import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

interface SessionRecapCardProps {
  edgeGained: string;
  topLeaks: string[];
  nextDrill: string;
}

export const SessionRecapCard: React.FC<SessionRecapCardProps> = ({ edgeGained, topLeaks, nextDrill }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Session Recap</Text>
    <Text style={styles.body}>Edge gained: {edgeGained}</Text>
    {topLeaks.map((leak, idx) => (
      <Text key={`${leak}-${idx}`} style={styles.body}>{idx + 1}. {leak}</Text>
    ))}
    <Text style={styles.body}>Next drill recommendation: {nextDrill}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 14,
    gap: 8,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  body: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
