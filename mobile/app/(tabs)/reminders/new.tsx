import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../../src/theme/colors';
import { spacing, radii } from '../../../src/theme/spacing';
import { typography } from '../../../src/theme/typography';
import { HorizontalDateSelector } from '../../../src/components/reminders/HorizontalDateSelector';
import { TimeChipGrid } from '../../../src/components/reminders/TimeChipGrid';
import { ReminderModeSelector } from '../../../src/components/reminders/ReminderModeSelector';
import apiClient from '../../../src/api/client';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarModal } from '../../../src/components/calendar/CalendarModal';

export default function AddReminderScreen() {
  const { accountId, contextName } = useLocalSearchParams();
  const [mode, setMode] = useState('Call');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSave = async () => {
    if (!note.trim()) {
      Alert.alert('Validation Error', 'Please enter a reminder note.');
      return;
    }
    
    try {
      const payload = {
        title: `${mode} Reminder`,
        message: note,
        remindAt: `${date}T${time.length > 5 ? new Date('2000-01-01 ' + time).toTimeString().substring(0, 5) : time}:00`,
        recurrence: 'none',
        status: 'scheduled',
        relatedEntityType: 'account',
        relatedEntityId: accountId || null,
        reminderMode: mode,
        reminderDate: date,
        reminderTime: time.length > 5 ? new Date('2000-01-01 ' + time).toTimeString().substring(0, 5) : time,
      };
      
      const res = await apiClient.post('/reminders', payload);
      if (res.data?.success) {
        Alert.alert('Success', 'Reminder saved successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', res.data?.message || 'Failed to save reminder.');
      }
    } catch (error) {
      console.log('Save reminder error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setTime(format(selectedDate, 'hh:mm a'));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Add Reminder</Text>
          {accountId && (
            <Text style={styles.subtitle}>{contextName || 'Account'} | {accountId}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        
        {/* Date Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Reminder Date</Text>
            <TouchableOpacity onPress={() => setShowCalendar(true)}><Text style={styles.sectionValue}>{format(new Date(date), 'dd-MM-yyyy')}</Text></TouchableOpacity>
          </View>
          <HorizontalDateSelector selectedDate={date} onSelectDate={setDate} />
        </View>

        {/* Mode Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Reminder Mode</Text>
          <ReminderModeSelector selectedMode={mode} onSelectMode={setMode} />
        </View>

        {/* Time Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Reminder Time</Text>
          </View>
          <TimeChipGrid selectedTime={time} onSelectTime={setTime} />
          
          <Text style={[styles.sectionLabel, { marginTop: spacing.lg, marginBottom: spacing.xs }]}>Other</Text>
          <TouchableOpacity style={styles.otherTimeInput} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.otherTimeText}>{time}</Text>
            <Feather name="clock" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Reminder Note</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add reminder note here..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
          />
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.md }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Reminder</Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={new Date(`${date}T${time.length > 5 ? new Date('2000-01-01 ' + time).toTimeString().substring(0, 5) : time}:00`)}
          mode="time"
          is24Hour={false}
          textColor={colors.primary}
          accentColor={colors.primary}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <CalendarModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={new Date(date)}
        onSelectDate={(newDate) => {
          if(newDate) setDate(format(newDate, 'yyyy-MM-dd'));
          setShowCalendar(false);
        }}
        reminders={[]}
        position="center"
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Off-white clean background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.h3,
    color: '#172033', // Dark navy text
  },
  subtitle: {
    ...typography.caption,
    color: '#667085', // Secondary text
    marginTop: 2,
  },
  closeButton: {
    padding: spacing.xs,
    backgroundColor: '#F3F4F6',
    borderRadius: radii.round,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDE2EA',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  section: {
    marginBottom: spacing.xl,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#DDE2EA',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionLabel: {
    ...typography.subtitle,
    color: '#172033',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sectionValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  otherTimeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#DDE2EA',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  otherTimeText: {
    ...typography.body,
    color: '#172033',
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: '#DDE2EA',
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    ...typography.body,
    color: '#172033',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#DDE2EA',
  },
  saveButton: {
    backgroundColor: colors.primary, // Uses dashboard maroon/red
    height: 52,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.subtitle,
    color: colors.white,
    fontWeight: 'bold',
  },
});
