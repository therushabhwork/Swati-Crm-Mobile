import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radii, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

interface QuickActionProps {
  title: string;
  icon: string;
  iconFamily?: 'Feather' | 'FontAwesome5';
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
}

export function QuickAction({ title, icon, iconFamily = 'Feather', variant = 'secondary', onPress }: QuickActionProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      {iconFamily === 'FontAwesome5' ? (
        <FontAwesome5 
          name={icon as any} 
          size={16} 
          color={isPrimary ? colors.white : colors.primary} 
          style={styles.icon}
        />
      ) : (
        <Feather 
          name={icon as any} 
          size={16} 
          color={isPrimary ? colors.white : colors.primary} 
          style={styles.icon}
        />
      )}
      <Text style={[
        styles.text,
        isPrimary ? styles.primaryText : styles.secondaryText
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
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
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
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
    color: colors.textPrimary,
  },
});
