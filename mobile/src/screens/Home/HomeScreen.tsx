import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { colors, neonGlow } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with neon glow effect */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            <Text style={styles.neonPink}>Card</Text>
            <Text style={styles.neonCyan}> Counter</Text>
            <Text style={styles.neonGreen}> AI</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Master the art of advantage play</Text>
        </View>

        {/* Guided Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guided Learning</Text>

          {/* Phase 1 - Active */}
          <TouchableOpacity
            style={[styles.card, styles.cardActive]}
            onPress={() => navigation.navigate('Phase1CardValues')}
            activeOpacity={0.8}
          >
            <View style={styles.cardGlow} />
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.iconActive]}>
                <Text style={styles.icon}>🎴</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Phase 1: Card Values</Text>
                <Text style={styles.cardDescription}>Learn the Hi-Lo values for every card rank.</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Phase 2 - Locked */}
          <TouchableOpacity style={[styles.card, styles.cardLocked]} disabled>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.iconLocked]}>
                <Text style={styles.icon}>🔢</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, styles.textLocked]}>Phase 2: Running Count</Text>
                <Text style={[styles.cardDescription, styles.textLocked]}>Keep the count as cards are dealt.</Text>
              </View>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          </TouchableOpacity>

          {/* Phase 3 - Locked */}
          <TouchableOpacity style={[styles.card, styles.cardLocked]} disabled>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.iconLocked]}>
                <Text style={styles.icon}>➗</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, styles.textLocked]}>Phase 3: True Count</Text>
                <Text style={[styles.cardDescription, styles.textLocked]}>Adjust for remaining decks.</Text>
              </View>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          </TouchableOpacity>

          {/* Phase 4 - Locked */}
          <TouchableOpacity style={[styles.card, styles.cardLocked]} disabled>
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, styles.iconLocked]}>
                <Text style={styles.icon}>💰</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, styles.textLocked]}>Phase 4: Betting</Text>
                <Text style={[styles.cardDescription, styles.textLocked]}>Size your bets based on the advantage.</Text>
              </View>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Practice & Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice & Tools</Text>
          <View style={styles.grid}>
            <TouchableOpacity style={[styles.gridCard, styles.cardLocked]} disabled>
              <Text style={styles.gridIcon}>⏱️</Text>
              <Text style={[styles.gridTitle, styles.textLocked]}>Speed Drill</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gridCard, styles.cardLocked]} disabled>
              <Text style={styles.gridIcon}>🎰</Text>
              <Text style={[styles.gridTitle, styles.textLocked]}>Casino Sim</Text>
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
    marginBottom: 36,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  neonPink: {
    color: colors.accent,
    textShadowColor: colors.glowPink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  neonCyan: {
    color: colors.accentBlue,
    textShadowColor: colors.glowCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  neonGreen: {
    color: colors.accentGreen,
    textShadowColor: colors.glowGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Glass card base
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: colors.accentBlue,
    shadowColor: colors.glowCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.glassHighlight,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  iconActive: {
    backgroundColor: `${colors.accentBlue}20`,
    borderColor: colors.accentBlue,
  },
  iconLocked: {
    backgroundColor: colors.surfaceLight,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textLocked: {
    color: colors.textMuted,
  },
  arrow: {
    fontSize: 28,
    color: colors.accentBlue,
    fontWeight: '300',
    marginLeft: 8,
  },
  lockIcon: {
    fontSize: 18,
    marginLeft: 8,
    opacity: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  gridIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
