import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { format, addDays } from 'date-fns';

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function HorizontalDateSelector({ selectedDate, onSelectDate }: Props) {
  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      list.push(addDays(today, i));
    }
    return list;
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {dates.map((date, index) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const isSelected = selectedDate === dateStr;
        return (
          <TouchableOpacity
            key={dateStr}
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={() => onSelectDate(dateStr)}
          >
            <Text style={[styles.dayText, isSelected && styles.selectedText]}>
              {format(date, 'EEE')}
            </Text>
            <Text style={[styles.dateText, isSelected && styles.selectedText]}>
              {format(date, 'dd')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  card: {
    width: 60,
    height: 70,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateText: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  selectedText: {
    color: colors.white,
  },
});
