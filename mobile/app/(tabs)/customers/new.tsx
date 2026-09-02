import React from 'react';
import { CustomerWizard } from '../../../src/components/customers/CustomerWizard';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../../src/theme/colors';
import { AppHeader } from '../../../src/components/ui/AppHeader';

export default function NewCustomerScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Add Customer" showBack />
      <CustomerWizard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
