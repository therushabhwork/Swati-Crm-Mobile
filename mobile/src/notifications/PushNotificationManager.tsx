import { useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import apiClient from '../api/client';
import { NotificationPayload } from './NotificationBanner';
export function PushNotificationManager() {
  const { user } = useAuth();
  const { showNotification } = useSocket();
  const router = useRouter();
  const responseListener = useRef<any>(null);
  const notificationListener = useRef<any>(null);

  useEffect(() => {
    // SDK 53+ removed remote push notifications from Expo Go. 
    // To prevent the module from throwing a fatal error on load, we skip it entirely in Expo Go.
    if (Constants.appOwnership === 'expo') {
      console.log('Skipping push notifications setup: Not supported in Expo Go.');
      return;
    }

    if (!user) return;

    let Notifications: any;

    async function setupNotifications() {
      // Dynamically import so the module side-effects don't crash Expo Go
      Notifications = await import('expo-notifications');

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      // Always register listeners immediately so we don't miss local/FCM events 
      // even if token generation fails later.
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        const data = response.notification.request.content.data;
        if (data?.entityType && data?.entityId) {
          let route = '';
          switch (data.entityType) {
            case 'deal': route = `/deals/${data.entityId}`; break;
            case 'account': route = `/accounts/${data.entityId}`; break;
            case 'task': route = `/tasks/${data.entityId}`; break;
            case 'customer': route = `/customers/${data.entityId}`; break;
            case 'message': route = `/messages`; break;
            case 'quotation': route = `/quotations/${data.entityId}`; break;
            default: break;
          }
          
          if (route) {
            router.push(route as any);
          }
        }
      });

      // Handle FCM push notifications while app is in the foreground
      notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
        const data = notification.request?.content?.data;
        const title = notification.request?.content?.title || 'New Notification';
        const body = notification.request?.content?.body || '';
        
        if (data) {
          // Trigger the custom Socket in-app toast
          showNotification({
            ...(data as any),
            message: body || data.message || 'New Notification',
          } as NotificationPayload);
        }
      });

      let token;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.error('[FCM] Failed to get push token for push notification! Status:', finalStatus);
          Alert.alert("Permission Denied", "Failed to get push token for push notifications!");
          return;
        }
        
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;

        if (!projectId) {
          console.warn("[FCM] No EAS project ID found.");
          Alert.alert("Configuration Error", "No EAS project ID found. You must configure it in app.json.");
          return;
        }

        try {
          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
          console.log('[FCM] Successfully Generated Expo Push Token:', token);
        } catch (error: any) {
          console.error("[FCM] Failed to get Expo Push Token:", error);
          Alert.alert("Firebase Error", "Failed to fetch push token: " + error.message);
          return;
        }
      } else {
        console.log('[FCM] Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (token) {
        try {
          await apiClient.post('/devices/register', {
            pushToken: token,
            platform: Platform.OS,
            deviceId: Device.modelName || 'Unknown Device',
          });
          console.log('[FCM] Token successfully registered to backend API.');
        } catch (err: any) {
          console.error('[FCM] Failed to register push token to backend:', err);
          Alert.alert("Registration Error", "Failed to register device token to CRM backend.");
        }
      }
    }

    setupNotifications();

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, [user]);

  return null;
}
