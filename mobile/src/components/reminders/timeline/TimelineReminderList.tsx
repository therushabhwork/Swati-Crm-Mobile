import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { TimelineReminderCard } from './TimelineReminderCard';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

interface TimelineReminderListProps {
  data: any[];
  onRowPress: (item: any) => void;
}

export function TimelineReminderList({ data, onRowPress }: TimelineReminderListProps) {
  
  if (!data || data.length === 0) {
    return null; // The parent component handles the empty state
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Strictly extract time directly from reminderTime without fallback
    let timeLabel = item.reminderTime || '12:00'; // Default to 12:00 if totally absent, but prioritize reminderTime
    
    // Ensure it's just HH:MM if it has seconds or is a long string
    if (timeLabel && timeLabel.length > 5) {
      timeLabel = timeLabel.substring(0, 5);
    }
    
    if (timeLabel === 'Invalid Date' || !timeLabel) {
      timeLabel = '12:00'; // Fallback
    }

    return (
      <View style={styles.itemWrapper}>
        {/* Time Label on the left */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{timeLabel}</Text>
        </View>

        {/* The timeline axis line */}
        <View style={styles.timelineAxis}>
          <View style={styles.timelineDot} />
          {/* Don't draw the line below the last item */}
          {index < data.length - 1 && <View style={styles.timelineLine} />}
        </View>
        
        {/* The card */}
        <View style={styles.cardWrapper}>
          <TimelineReminderCard 
            item={item}
            onPress={() => onRowPress(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={data}
      keyExtractor={(item) => item._id || item.id || Math.random().toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Extra padding at bottom for FAB
  },
  itemWrapper: {
    flexDirection: 'row',
  },
  timeContainer: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
    paddingTop: 18,
  },
  timeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timelineAxis: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 24, // Align dot with the first line of text roughly
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 36, // Start below the dot
    bottom: -24, // Connect to the next dot
    width: 2,
    backgroundColor: colors.border, // Subtle gray line
    zIndex: 0,
  },
  cardWrapper: {
    flex: 1,
  }
});
