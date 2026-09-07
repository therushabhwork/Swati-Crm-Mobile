import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiClient from '../../../src/api/client';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { colors } from '../../../src/theme/colors';

export default function LeadDetailsScreen() {
  const { id, fromSearch } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await apiClient.get(`/leads/${id}`);
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (error: any) {
        console.log(`[API Error] GET /leads/${id} - Status: ${error?.response?.status}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  const handleConvertDeal = () => {
    Alert.alert(
      'Convert to Deal',
      'Are you sure you want to convert this Account to a Deal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Convert', 
          style: 'default',
          onPress: async () => {
            try {
              setIsLoading(true);
              const res = await apiClient.post(`/leads/${id}/convert-to-deal`);
              if (res.data?.success || res.status === 200 || res.status === 201) {
                Alert.alert('Success', 'Account successfully converted to a Deal!', [
                  { text: 'OK', onPress: () => router.push('/(admin)/deals') }
                ]);
              }
            } catch (error: any) {
              console.log('Error converting deal:', error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to convert to Deal');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <AppHeader title="Account Details" showBack onBack={() => fromSearch === 'true' && router.canGoBack() ? router.back() : router.push('/(admin)/leads')} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <AppHeader title="Account Details" showBack onBack={() => fromSearch === 'true' && router.canGoBack() ? router.back() : router.push('/(admin)/leads')} />
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Account not found.</Text>
        </View>
      </View>
    );
  }

  // Grouped Fields
  const sections = [
    {
      title: 'Account details',
      data: [
        { label: 'Account No.', value: data.accountNo || data.leadNo || data.id || '-' },
        { label: 'Account Name', value: data.accountName || data.name || data.companyName || '-' },
        { label: 'Project Name', value: data.projectName || data.project || '-' },
        { label: 'Account Owner', value: data.accountOwner || data.ownerUserId || '-' },
        { label: 'Account Date', value: data.accountDate || data.createdAt ? new Date(data.accountDate || data.createdAt).toLocaleDateString() : '-' },
        { label: 'Account Category', value: data.accountCategory || data.category || '-' },
      ]
    },
    {
      title: 'Status',
      data: [
        { label: 'Account Status', value: data.accountStatus || data.status || '-' },
        { label: 'Account State', value: data.accountState || data.state || '-' },
      ]
    },
    {
      title: 'Contact',
      data: [
        { label: 'Phone', value: data.phone || '-' },
        { label: 'Email', value: data.email || '-' },
        { label: 'Contact Person', value: data.contactPerson || data.contactName || '-' },
      ]
    },
    {
      title: 'Commercial',
      data: [
        { label: 'PO Value', value: data.poValue ? `₹${data.poValue.toLocaleString()}` : '-' },
        { label: 'Job No', value: data.jobNo || '-' }
      ]
    }
  ];

  const getStatusColor = (value: string) => {
    const lowerValue = value?.toString().toLowerCase();
    if (lowerValue === 'pending') return colors.warning || '#F59E0B';
    if (lowerValue === 'converted') return colors.success || '#16A34A';
    return '#2d3748';
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <AppHeader title={data.accountName || data.name || "Account Details"} showBack onBack={() => fromSearch === 'true' && router.canGoBack() ? router.back() : router.push('/(admin)/leads')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={[styles.card, sIdx < sections.length - 1 && { marginBottom: 16 }]}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <View style={styles.divider} />
            
            {section.data.map((field, idx) => {
              const isStatusSection = section.title === 'Status';
              const valueStyle = isStatusSection 
                ? [styles.value, { color: getStatusColor(field.value) }]
                : styles.value;
                
              return (
                <View key={idx} style={[styles.row, idx === section.data.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]}>
                  <Text style={styles.label}>{field.label}</Text>
                  <Text style={valueStyle}>{field.value}</Text>
                </View>
              );
            })}
          </View>
        ))}

        {(!data.isConverted && !data.dealId && data.status?.toLowerCase() !== 'converted' && data.accountState?.toLowerCase() !== 'converted') && (
          <TouchableOpacity style={styles.actionBtn} onPress={handleConvertDeal}>
            <Text style={styles.actionBtnText}>Convert Deal</Text>
          </TouchableOpacity>
        )}
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
  },
  actionBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
