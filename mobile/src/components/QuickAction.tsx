import React from 'react';
import { Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radii, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

interface QuickActionProps {
  title: string;
  icon: string;
  iconFamily?: 'Feather' | 'FontAwesome5';
  variant?: 'primary' | 'secondary' | 'tertiary';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function QuickAction({ title, icon, iconFamily = 'Feather', variant = 'secondary', style, onPress }: QuickActionProps) {
  const isPrimary = variant === 'primary';
  const isTertiary = variant === 'tertiary';
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : isTertiary ? styles.tertiaryButton : styles.secondaryButton,
        style,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <>
          {iconFamily === 'FontAwesome5' ? (
            <FontAwesome5 
              name={icon as any} 
              size={16} 
              color={pressed || isPrimary ? colors.white : isTertiary ? colors.textSecondary : colors.primary} 
              style={styles.icon}
            />
          ) : (
            <Feather 
              name={icon as any} 
              size={16} 
              color={pressed || isPrimary ? colors.white : isTertiary ? colors.textSecondary : colors.primary} 
              style={styles.icon}
            />
          )}
          <Text style={[
            styles.text,
            isPrimary ? styles.primaryText : isTertiary ? styles.tertiaryText : styles.secondaryText,
            pressed && styles.primaryText
          ]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.round,
    marginRight: spacing.sm,
    ...shadows.card,
    elevation: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tertiaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    elevation: 0,
    shadowOpacity: 0,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 11,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primaryDark,
  },
  tertiaryText: {
    color: colors.textSecondary,
  },
});
