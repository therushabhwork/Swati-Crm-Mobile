import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MetricColorTheme {
  primary: string;
  light: string;
  gradient: [string, string, string, string];
}

const ACCOUNTS_THEME: MetricColorTheme = {
  primary: '#DC2626',
  light: '#FEF2F2',
  gradient: ['#FFFFFF', '#FEF2F2', '#FEE2E2', '#FECACA'],
};

const METRIC_THEMES: Record<string, MetricColorTheme> = {
  'Accounts': ACCOUNTS_THEME,
  'My Group Accounts': ACCOUNTS_THEME,
  'Deals': ACCOUNTS_THEME,
  'Customers': ACCOUNTS_THEME,
  'Support Requests': ACCOUNTS_THEME,
  'Quotations': ACCOUNTS_THEME,
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconFamily?: 'Feather' | 'FontAwesome5';
  variant?: 'hero' | 'bento' | 'full';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  primaryColor?: string;
  lightColor?: string;
  gradientColors?: [string, string, string, string];
}

export function StatCard({
  title,
  value,
  icon,
  iconFamily = 'Feather',
  variant = 'bento',
  style,
  onPress,
  primaryColor,
  lightColor,
  gradientColors,
}: StatCardProps) {
  const defaultTheme = METRIC_THEMES[title] || {
    primary: '#DC2626',
    light: '#FEF2F2',
    gradient: ['#FFFFFF', '#FEF2F2', '#FEE2E2', '#FECACA'],
  };

  const themePrimary = primaryColor || defaultTheme.primary;
  const themeLight = lightColor || defaultTheme.light;
  const themeGradient = gradientColors || defaultTheme.gradient;

  const isHero = variant === 'hero';
  const isFull = variant === 'full';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardWrapper,
        isHero && styles.heroCardWrapper,
        isFull && styles.fullCardWrapper,
        style,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={themeGradient}
        locations={[0, 0.45, 0.75, 1.0]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        {isFull ? (
          <View style={styles.fullContainer}>
            <View style={styles.fullLeft}>
              <Text style={[styles.fullValue, { color: themePrimary }]}>{value}</Text>
              <Text style={styles.fullTitle}>{title}</Text>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: themeLight }]}>
              <Feather name="chevron-right" size={16} color={themePrimary} />
            </View>
          </View>
        ) : isHero ? (
          <View style={styles.heroContainer}>
            <View style={styles.heroHeader}>
              <View style={[styles.iconContainer, { backgroundColor: themeLight }]}>
                {iconFamily === 'FontAwesome5' ? (
                  <FontAwesome5 name={icon as any} size={20} color={themePrimary} />
                ) : (
                  <Feather name={icon as any} size={20} color={themePrimary} />
                )}
              </View>
              <Feather name="chevron-right" size={18} color={themePrimary} style={{ opacity: 0.8 }} />
            </View>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={[styles.heroValue, { color: themePrimary }]}>{value}</Text>
          </View>
        ) : (
          <View style={styles.bentoContainer}>
            <View style={[styles.iconContainer, { backgroundColor: themeLight }]}>
              {iconFamily === 'FontAwesome5' ? (
                <FontAwesome5 name={icon as any} size={18} color={themePrimary} />
              ) : (
                <Feather name={icon as any} size={18} color={themePrimary} />
              )}
            </View>
            <Text style={styles.bentoTitle} numberOfLines={2}>{title}</Text>
            <View style={styles.bentoFooter}>
              <Text style={[styles.bentoValue, { color: themePrimary }]}>{value}</Text>
              <Feather name="chevron-right" size={16} color={themePrimary} style={{ opacity: 0.8 }} />
            </View>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  heroCardWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  fullCardWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
  },
  cardPressed: {
    transform: [{ scale: 1.015 }],
    opacity: 0.92,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bentoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  bentoTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
    lineHeight: 18,
  },
  bentoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  bentoValue: {
    fontSize: 26,
    fontWeight: '700',
  },
  heroContainer: {
    minHeight: 120,
    justifyContent: 'center',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  fullContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  fullLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullValue: {
    fontSize: 22,
    fontWeight: '700',
    marginRight: 12,
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
