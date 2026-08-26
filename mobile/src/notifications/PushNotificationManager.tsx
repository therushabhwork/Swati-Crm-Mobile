import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

export function PushNotificationManager() {
  const { user } = useAuth();
  const router = useRouter();
  const responseListener = useRef<any>(null);

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
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
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
          console.log('Failed to get push token for push notification!');
          return;
        }
        
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;

        if (!projectId) {
          console.warn("No EAS project ID found. You must run 'eas init' or configure it in app.json.");
          return;
        }

        try {
          token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        } catch (error) {
          console.warn("Failed to get Expo Push Token:", error);
          return;
        }
      } else {
        console.log('Must use physical device for Push Notifications');
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
        } catch (err) {
          console.error('Failed to register push token to backend:', err);
        }
      }

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
    }

    setupNotifications();

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user]);

  return null;
}
