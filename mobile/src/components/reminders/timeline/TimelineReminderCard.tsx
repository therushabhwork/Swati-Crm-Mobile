import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface TimelineReminderCardProps {
  item: any;
  onPress: () => void;
}

export function TimelineReminderCard({ item, onPress }: TimelineReminderCardProps) {
  const title = item.title || item.taskName || 'Unknown';
  const priority = item.priority || '-';
  const status = item.status || 'scheduled';
  const dueDate = item.reminderDate ? new Date(item.reminderDate).toLocaleDateString() : '-';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.status}>{status}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Priority</Text>
              <Text style={styles.metaValue}>{priority}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Due Date</Text>
              <Text style={styles.metaValue}>{dueDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtonContainer}>
          <View style={styles.actionButton}>
            <Feather name="arrow-right" size={20} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing.xs,
    paddingRight: spacing.md,
    paddingBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.white,
    marginBottom: 4,
  },
  status: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'capitalize',
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  metaValue: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  actionButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    paddingBottom: 4,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
