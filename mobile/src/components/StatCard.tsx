import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radii, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconFamily?: 'Feather' | 'FontAwesome5';
  variant?: 'hero' | 'bento' | 'full';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function StatCard({ title, value, icon, iconFamily = 'Feather', variant = 'bento', style, onPress }: StatCardProps) {
  const isHero = variant === 'hero';
  const isFull = variant === 'full';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isHero && styles.heroCardWrapper,
        isFull && styles.fullCard,
        style,
        pressed && styles.cardPressed
      ]}
      onPress={onPress}
    >
      {isFull ? (
        <View style={styles.fullCardContent}>
          <View style={styles.fullCardLeft}>
            <Text style={styles.fullCardValue}>{value}</Text>
            <Text style={styles.fullCardTitle}>{title}</Text>
          </View>
          <View style={styles.iconContainerFull}>
            <Feather name="arrow-right" size={16} color={colors.primary} />
          </View>
        </View>
      ) : isHero ? (
        <View style={styles.heroCardContent}>
          <View style={styles.iconContainerHero}>
            {iconFamily === 'FontAwesome5' ? (
              <FontAwesome5 name={icon as any} size={20} color={colors.primary} />
            ) : (
              <Feather name={icon as any} size={20} color={colors.primary} />
            )}
          </View>
          <Text style={styles.titleHero}>{title}</Text>
          <Text style={styles.valueHero}>{value}</Text>
          <View style={styles.heroArrow}>
            <Feather name="chevron-right" size={16} color={colors.primary} />
          </View>
        </View>
      ) : (
        <>
          <View style={[styles.iconContainer, isHero && styles.iconContainerHero]}>
            {iconFamily === 'FontAwesome5' ? (
              <FontAwesome5 name={icon as any} size={20} color={colors.primary} />
            ) : (
              <Feather name={icon as any} size={20} color={colors.primary} />
            )}
          </View>
          <Text style={[styles.title, isHero && styles.titleHero]}>{title}</Text>
          <Text style={[styles.value, isHero && styles.valueHero]}>{value}</Text>
          {isHero && (
            <View style={styles.heroArrow}>
              <Feather name="arrow-right" size={16} color={colors.textSecondary} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center', // Center by default for bento
    ...shadows.card,
    shadowOpacity: 0.05,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  heroCardWrapper: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 18,
    marginBottom: spacing.md,
    ...shadows.card,
    shadowOpacity: 0.05,
    elevation: 2,
    overflow: 'hidden',
  },
  heroCardContent: {
    flex: 1,
    width: '100%',
    padding: 20,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
  },
  fullCard: {
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'center',
  },
  cardPressed: {
    transform: [{ scale: 1.02 }],
    opacity: 0.9,
    backgroundColor: colors.primaryLight,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radii.round,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainerHero: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 2,
    textAlign: 'center',
  },
  titleHero: {
    ...typography.caption,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 2,
  },
  value: {
    ...typography.h3,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  valueHero: {
    ...typography.h3,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'left',
  },
  heroArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -8,
  },
  fullCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fullCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullCardValue: {
    ...typography.h3,
    color: colors.primaryDark,
    fontSize: 20,
    marginRight: 12,
  },
  fullCardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  iconContainerFull: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
