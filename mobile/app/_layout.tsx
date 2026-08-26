import { LogBox } from 'react-native';
import { Slot } from 'expo-router';

// Suppress the SDK 53+ Expo Go push notification error so it doesn't block development
LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);
import { AuthProvider } from '../src/context/AuthContext';
import { PushNotificationManager } from '../src/notifications/PushNotificationManager';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <AuthProvider>
        <PushNotificationManager />
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}
