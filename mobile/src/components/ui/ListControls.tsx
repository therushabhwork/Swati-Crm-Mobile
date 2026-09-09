import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export type ListControlsProps = {
  searchPlaceholder?: string;
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
  onSortPress?: () => void;
  filterLabel?: string;
  sortLabel?: string;
  onAddPress?: () => void;
  addLabel?: string;
};

export const ListControls: React.FC<ListControlsProps> = ({
  searchPlaceholder = 'Search...',
  onSearch,
  onFilterPress,
  onSortPress,
  filterLabel = 'All',
  onAddPress,
  addLabel = 'Add',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onFilterPress}>
          <Text style={styles.actionLabel}>Filter: </Text>
          <Text style={styles.actionValue}>{filterLabel}</Text>
          <Feather name="chevron-down" size={16} color="#718096" />
        </TouchableOpacity>
        {onAddPress && (
          <TouchableOpacity style={[styles.actionButton, styles.addButton]} onPress={onAddPress}>
            <Feather name="plus" size={16} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.addButtonText}>{addLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  actionLabel: {
    fontSize: 13,
    color: '#718096',
  },
  actionValue: {
    fontSize: 13,
    color: '#2d3748',
    fontWeight: '600',
    marginRight: 4,
  },
  addButton: {
    backgroundColor: '#1650C8',
    borderColor: '#1650C8',
  },
  addButtonText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  }
});
