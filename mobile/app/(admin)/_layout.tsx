import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Adjust for admin/user paths if needed. 
  // We'll remove the redirect here if it's admin so both layouts can be similar,
  // but let's keep the existing logic. We will replace this during runtime depending on the folder.
  // Actually, wait, let's keep the redirect logic dynamic.
  

  // paddingBottom = bottomNavigationHeight(56) + systemNavigationInset + visualSpacing(8)
  // Expo's Tabs bottom height usually defaults to around 49-50 + padding. 
  // We'll set the height dynamically.
  
  const isAndroid = Platform.OS === 'android';
  const baseHeight = isAndroid ? 56 : 49;
  const safeBottom = insets.bottom > 0 ? insets.bottom : (isAndroid ? 24 : 34);

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#F4512C',
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
        tabBarStyle: [styles.tabBar, { 
          paddingBottom: safeBottom,
          height: baseHeight + safeBottom,
        }],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: 'Deals',
          tabBarIcon: ({ color }) => <FontAwesome5 name="handshake" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Feather name="menu" size={24} color={color} />,
        }}
      />
      
      {/* Hidden Screens */}
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="reminders" options={{ href: null }} />
      <Tabs.Screen name="quotations" options={{ href: null }} />
      <Tabs.Screen name="group-accounts" options={{ href: null }} />
      
      {/* Hide detail screens from tab bar AND hide tab bar itself on these screens */}
      <Tabs.Screen name="lead-details/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="customer-details/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="deal-details/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="support-details/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="support/new" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="reminder-details/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="reminders/new" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="quotation-details/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="accounts/new" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E2E2',
    elevation: 0,
    shadowColor: 'transparent',
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  }
});
