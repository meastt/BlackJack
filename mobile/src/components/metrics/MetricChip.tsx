import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

interface MetricChipProps {
  label: string;
  value: string | number;
}

export const MetricChip: React.FC<MetricChipProps> = ({ label, value }) => (
  <View style={styles.chip}>
    <Text style={styles.text}>{label}: {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceDark,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
});
