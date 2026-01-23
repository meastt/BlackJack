import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Phase1CardValues } from './src/screens/GuidedLearning/Phase1CardValues';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Phase1CardValues />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
