import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
// We'll add navigation types later

interface HomeScreenProps {
  navigation: any; // Temporary typing
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Card Counter AI</Text>
          <Text style={styles.headerSubtitle}>Master the art of advantage play</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guided Learning</Text>
          
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Phase1CardValues')}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🎴</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Phase 1: Card Values</Text>
                <Text style={styles.cardDescription}>Learn the Hi-Lo values for every card rank.</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.cardDisabled]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.iconDisabled]}>
                <Text style={styles.icon}>🔢</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, styles.textDisabled]}>Phase 2: Running Count</Text>
                <Text style={[styles.cardDescription, styles.textDisabled]}>Keep the count as cards are dealt.</Text>
              </View>
              <Text style={[styles.arrow, styles.textDisabled]}>🔒</Text>
            </View>
          </TouchableOpacity>

           <TouchableOpacity style={[styles.card, styles.cardDisabled]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.iconDisabled]}>
                <Text style={styles.icon}>➗</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, styles.textDisabled]}>Phase 3: True Count</Text>
                <Text style={[styles.cardDescription, styles.textDisabled]}>Adjust for remaining decks.</Text>
              </View>
              <Text style={[styles.arrow, styles.textDisabled]}>🔒</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.cardDisabled]}>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.iconDisabled]}>
                <Text style={styles.icon}>💰</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, styles.textDisabled]}>Phase 4: Betting</Text>
                <Text style={[styles.cardDescription, styles.textDisabled]}>Size your bets based on the advantage.</Text>
              </View>
              <Text style={[styles.arrow, styles.textDisabled]}>🔒</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice & Tools</Text>
          <View style={styles.grid}>
             <TouchableOpacity style={[styles.gridCard, styles.cardDisabled]}>
               <Text style={styles.gridIcon}>⏱️</Text>
               <Text style={[styles.gridTitle, styles.textDisabled]}>Speed Drill</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.gridCard, styles.cardDisabled]}>
               <Text style={styles.gridIcon}>🎰</Text>
               <Text style={[styles.gridTitle, styles.textDisabled]}>Casino Sim</Text>
             </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDisabled: {
    backgroundColor: colors.surfaceLight, // A bit lighter or tailored for disabled
    opacity: 0.7,
    borderColor: 'transparent',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconDisabled: {
    backgroundColor: colors.disabled,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  arrow: {
    fontSize: 24,
    color: colors.accent,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
