import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient from '../../../src/api/client';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { colors } from '../../../src/theme/colors';

export default function DealDetailsScreen() {
  const { id, fromSearch } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <AppHeader title="Deal Details" showBack onBack={() => fromSearch === 'true' && router.canGoBack() ? router.back() : router.push('/(tabs)/deals')} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <AppHeader title="Deal Details" showBack onBack={() => fromSearch === 'true' && router.canGoBack() ? router.back() : router.push('/(tabs)/deals')} />
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Deal not found.</Text>
        </View>
      </View>
    );
  }

  const sections = [
    {
      title: 'Deal details',
      data: [
        { label: 'Deal No', value: data.dealNo || data.id || '-' },
        { label: 'Deal Name', value: data.dealName || data.name || '-' },
        { label: 'Deal Date', value: data.dealDate || data.createdAt ? new Date(data.dealDate || data.createdAt).toLocaleDateString() : '-' },
        { label: 'Deal Owner', value: data.dealOwner || data.ownerUserId || '-' },
        { label: 'Deal Type', value: data.dealType || data.type || '-' },
        { label: 'Project Name', value: data.projectName || data.project || '-' }
      ]
    },
    {
      title: 'Status',
      data: [
        { label: 'Deal Status', value: data.dealStatus || data.status || '-' },
        { label: 'Lost Order Reason', value: data.lostOrderReason || '-' }
      ]
    },
    {
      title: 'Commercial',
      data: [
        { label: 'Deal Value', value: data.dealValue ? `₹${data.dealValue.toLocaleString()}` : '-' },
        { label: 'Convert PO', value: data.convertPo ? 'Yes' : 'No' },
        { label: 'PO Value', value: data.poValue ? `₹${data.poValue.toLocaleString()}` : '-' },
        { label: 'Job No.', value: data.jobNo || '-' },
      ]
    }
  ];

  const getStatusColor = (value: string) => {
    const lowerValue = value?.toString().toLowerCase();
    if (lowerValue === 'pending') return colors.warning || '#F59E0B';
    if (lowerValue === 'converted' || lowerValue === 'won') return colors.success || '#16A34A';
    if (lowerValue === 'lost') return '#E53E3E';
    return '#2d3748';
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <AppHeader title={data.dealName || data.name || "Deal Details"} showBack onBack={() => fromSearch === 'true' && router.canGoBack() ? router.back() : router.push('/(tabs)/deals')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={[styles.card, sIdx < sections.length - 1 && { marginBottom: 16 }]}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <View style={styles.divider} />
            
            {section.data.map((field, idx) => {
              const isStatusSection = section.title === 'Status';
              const isPrimarySection = section.title.toLowerCase().includes('details');
              
              const valueStyle = isStatusSection && field.label.includes('Status')
                ? [styles.value, { color: getStatusColor(field.value) }]
                : styles.value;
                
              const rowStyle = isPrimarySection 
                ? [styles.row, { flexDirection: 'column', alignItems: 'flex-start' }, idx === section.data.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]
                : [styles.row, idx === section.data.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }];
                
              const labelStyle = isPrimarySection
                ? [styles.label, { marginBottom: 4 }]
                : styles.label;

              return (
                <View key={idx} style={rowStyle as any}>
                  <Text style={labelStyle}>{field.label}</Text>
                  <Text style={valueStyle}>{field.value}</Text>
                </View>
              );
            })}
          </View>
        ))}
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
    marginBottom: 12,
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
  }
});
