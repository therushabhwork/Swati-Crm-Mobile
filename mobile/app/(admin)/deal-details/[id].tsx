import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import apiClient from '../../../src/api/client';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { colors } from '../../../src/theme/colors';

export default function DealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for inline double-tap editing
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [lastTap, setLastTap] = useState<number>(0);
  const [activeKey, setActiveKey] = useState<string>('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await apiClient.get(`/deals/${id}`);
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.log('Error fetching deal details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <AppHeader title="Deal Details" showBack onBack={() => router.push('/(admin)/deals')} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <AppHeader title="Deal Details" showBack onBack={() => router.push('/(admin)/deals')} />
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Deal not found.</Text>
        </View>
      </View>
    );
  }

  const handleRowPress = (key: string, rawValue: string) => {
    const now = Date.now();
    if (activeKey === key && now - lastTap < 300) {
      setEditingField(key);
      setEditingValue(String(rawValue ?? ''));
    } else {
      setLastTap(now);
      setActiveKey(key);
    }
  };

  const handleSaveField = async (key: string, newValue: string) => {
    if (newValue === String(data[key] ?? '')) {
      setEditingField(null);
      return;
    }
    try {
      let resolvedValue: any = newValue;
      if (key === 'dealValue' || key === 'poValue') {
        resolvedValue = parseFloat(newValue.replace(/[^0-9.]/g, '')) || 0;
      } else if (key === 'convertPo') {
        resolvedValue = newValue.toLowerCase() === 'yes' || newValue === 'true';
      }
      
      const payload: any = { [key]: resolvedValue };
      if (key === 'dealName') { payload.name = resolvedValue; payload.title = resolvedValue; }
      if (key === 'dealValue') { payload.value = resolvedValue; payload.amount = resolvedValue; }
      if (key === 'dealStatus') { payload.stage = resolvedValue; payload.status = resolvedValue; }

      const res = await apiClient.put(`/deals/${id}`, payload);
      if (res.data?.success) {
        setData(res.data.data);
      } else {
        Alert.alert('Error', 'Failed to update deal.');
      }
    } catch (error) {
      console.log('Error saving field:', error);
      Alert.alert('Error', 'Server error saving field.');
    } finally {
      setEditingField(null);
    }
  };

  // Fields: Deal No Deal Name  Deal Date   Deal Owner   Deal Type  Deal Status   Project Name   Deal Value   Convert PO   PO Value  Job No. Lost Order Reason
  const fields = [
    { label: 'Deal No', key: 'dealNo', value: data.dealNo || data.id || '-', editable: false },
    { label: 'Deal Name', key: 'dealName', value: data.dealName || data.name || '-', rawValue: data.dealName || data.name || '' },
    { label: 'Deal Date', key: 'dealDate', value: data.dealDate || data.createdAt ? new Date(data.dealDate || data.createdAt).toLocaleDateString() : '-', rawValue: data.dealDate || data.createdAt || '' },
    { label: 'Deal Owner', key: 'dealOwner', value: data.dealOwner || data.ownerUserId || '-', editable: false },
    { label: 'Deal Type', key: 'dealType', value: data.dealType || data.type || '-', rawValue: data.dealType || data.type || '' },
    { label: 'Deal Status', key: 'dealStatus', value: data.dealStatus || data.status || '-', rawValue: data.dealStatus || data.status || '' },
    { label: 'Project Name', key: 'projectName', value: data.projectName || data.project || '-', rawValue: data.projectName || data.project || '' },
    { label: 'Deal Value', key: 'dealValue', value: data.dealValue ? `₹${data.dealValue.toLocaleString()}` : '-', rawValue: data.dealValue || '' },
    { label: 'Convert PO', key: 'convertPo', value: data.convertPo ? 'Yes' : 'No', rawValue: data.convertPo ? 'Yes' : 'No' },
    { label: 'PO Value', key: 'poValue', value: data.poValue ? `₹${data.poValue.toLocaleString()}` : '-', rawValue: data.poValue || '' },
    { label: 'Job No.', key: 'jobNo', value: data.jobNo || '-', rawValue: data.jobNo || '' },
    { label: 'Lost Order Reason', key: 'lostOrderReason', value: data.lostOrderReason || '-', rawValue: data.lostOrderReason || '' }
  ];

  return (
    <View style={styles.container}>
      <AppHeader title={data.dealName || data.name || "Deal Details"} showBack onBack={() => router.push('/(admin)/deals')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Information</Text>
          <Text style={styles.banner}>Double tap any field to edit</Text>
          <View style={styles.divider} />
          
          {fields.map((field, idx) => {
            const isEditing = editingField === field.key;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={field.editable !== false ? 0.7 : 1}
                onPress={() => field.editable !== false && handleRowPress(field.key, field.rawValue)}
                style={styles.row}
              >
                <Text style={styles.label}>{field.label}</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.value, styles.editInput]}
                    value={editingValue}
                    onChangeText={setEditingValue}
                    autoFocus
                    onBlur={() => handleSaveField(field.key, editingValue)}
                    onSubmitEditing={() => handleSaveField(field.key, editingValue)}
                  />
                ) : (
                  <Text style={styles.value}>{field.value}</Text>
                )}
              </TouchableOpacity>
            );
          })}
          
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#718096',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  banner: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#edf2f7',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  value: {
    flex: 1.5,
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '600',
  },
  editInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primary || '#3182ce',
    paddingVertical: 0,
    marginVertical: -2,
    color: '#2d3748',
  }
});
