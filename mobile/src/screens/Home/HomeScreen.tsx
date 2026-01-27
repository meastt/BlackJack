import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { colors, neonGlow } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { useProgressStore } from '../../store/useProgressStore';
import { InfoIcon } from '../../components/InfoIcon';
import * as Haptics from 'expo-haptics';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isPhaseUnlocked, phase0Complete, phase1Complete, phase3Complete, phase4Complete, phase5Complete } = useProgressStore();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with neon glow effect */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
          />
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

          {/* Phase 0 - Basic Strategy */}
          <TouchableOpacity
            style={[styles.card, isPhaseUnlocked(0) ? styles.cardActive : styles.cardLocked]}
            onPress={() => {
              if (isPhaseUnlocked(0)) {
                Haptics.selectionAsync();
                navigation.navigate('Phase0BasicStrategy');
              }
            }}
            activeOpacity={0.8}
            disabled={!isPhaseUnlocked(0)}
          >
            {isPhaseUnlocked(0) && <View style={styles.cardGlow} />}
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, isPhaseUnlocked(0) ? styles.iconZero : styles.iconLocked]}>
                <Text style={styles.icon}>🧠</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, !isPhaseUnlocked(0) && styles.textLocked]}>Phase 0: Basic Strategy</Text>
                  <InfoIcon tipKey="phase0" size={18} />
                  {phase0Complete && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.cardDescription, !isPhaseUnlocked(0) && styles.textLocked]}>Prerequisite: Learn when to Hit, Stand, Split, or Double.</Text>
              </View>
              {isPhaseUnlocked(0) ? (
                <Text style={styles.arrow}>›</Text>
              ) : (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Phase 1 - Card Values */}
          <TouchableOpacity
            style={[styles.card, isPhaseUnlocked(1) ? styles.cardActive : styles.cardLocked]}
            onPress={() => {
              if (isPhaseUnlocked(1)) {
                Haptics.selectionAsync();
                navigation.navigate('Phase1CardValues');
              }
            }}
            activeOpacity={0.8}
            disabled={!isPhaseUnlocked(1)}
          >
            {isPhaseUnlocked(1) && <View style={styles.cardGlow} />}
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, isPhaseUnlocked(1) ? styles.iconActive : styles.iconLocked]}>
                <Text style={styles.icon}>🎴</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, !isPhaseUnlocked(1) && styles.textLocked]}>Phase 1: Card Values</Text>
                  <InfoIcon tipKey="phase1" size={18} />
                  {phase1Complete && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.cardDescription, !isPhaseUnlocked(1) && styles.textLocked]}>Learn the Hi-Lo values for every card rank.</Text>
              </View>
              {isPhaseUnlocked(1) ? (
                <Text style={styles.arrow}>›</Text>
              ) : (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Phase 2 - Running Count */}
          <TouchableOpacity
            style={[styles.card, isPhaseUnlocked(2) ? styles.cardActive : styles.cardLocked]}
            onPress={() => {
              if (isPhaseUnlocked(2)) {
                Haptics.selectionAsync();
                navigation.navigate('Phase2RunningCount');
              }
            }}
            activeOpacity={0.8}
            disabled={!isPhaseUnlocked(2)}
          >
            {isPhaseUnlocked(2) && <View style={styles.cardGlow} />}
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, isPhaseUnlocked(2) ? styles.iconActive : styles.iconLocked]}>
                <Text style={styles.icon}>🔢</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, !isPhaseUnlocked(2) && styles.textLocked]}>Phase 2: Running Count</Text>
                  <InfoIcon tipKey="phase2" size={18} />
                </View>
                <Text style={[styles.cardDescription, !isPhaseUnlocked(2) && styles.textLocked]}>Keep the count as cards are dealt.</Text>
              </View>
              {!isPhaseUnlocked(2) && <Text style={styles.lockIcon}>🔒</Text>}
            </View>
          </TouchableOpacity>

          {/* Phase 3 - True Count */}
          <TouchableOpacity
            style={[styles.card, isPhaseUnlocked(3) ? styles.cardActive : styles.cardLocked]}
            onPress={() => {
              if (isPhaseUnlocked(3)) {
                Haptics.selectionAsync();
                navigation.navigate('Phase3TrueCount');
              }
            }}
            activeOpacity={0.8}
            disabled={!isPhaseUnlocked(3)}
          >
            {isPhaseUnlocked(3) && <View style={styles.cardGlow} />}
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, isPhaseUnlocked(3) ? styles.iconActive : styles.iconLocked]}>
                <Text style={styles.icon}>➗</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, !isPhaseUnlocked(3) && styles.textLocked]}>Phase 3: True Count</Text>
                  <InfoIcon tipKey="phase3" size={18} />
                  {phase3Complete && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.cardDescription, !isPhaseUnlocked(3) && styles.textLocked]}>Adjust for remaining decks.</Text>
              </View>
              {isPhaseUnlocked(3) ? (
                <Text style={styles.arrow}>›</Text>
              ) : (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Phase 4 - Betting */}
          <TouchableOpacity
            style={[styles.card, isPhaseUnlocked(4) ? styles.cardActive : styles.cardLocked]}
            onPress={() => {
              if (isPhaseUnlocked(4)) {
                Haptics.selectionAsync();
                navigation.navigate('Phase4Betting');
              }
            }}
            activeOpacity={0.8}
            disabled={!isPhaseUnlocked(4)}
          >
            {isPhaseUnlocked(4) && <View style={styles.cardGlow} />}
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, isPhaseUnlocked(4) ? styles.iconActive : styles.iconLocked]}>
                <Text style={styles.icon}>💰</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, !isPhaseUnlocked(4) && styles.textLocked]}>Phase 4: Betting</Text>
                  <InfoIcon tipKey="phase4" size={18} />
                  {phase4Complete && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.cardDescription, !isPhaseUnlocked(4) && styles.textLocked]}>Size your bets based on the advantage.</Text>
              </View>
              {isPhaseUnlocked(4) ? (
                <Text style={styles.arrow}>›</Text>
              ) : (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Phase 5 - Deviations */}
          <TouchableOpacity
            style={[styles.card, isPhaseUnlocked(5) ? styles.cardActive : styles.cardLocked]}
            onPress={() => {
              if (isPhaseUnlocked(5)) {
                Haptics.selectionAsync();
                navigation.navigate('Phase5Deviations');
              }
            }}
            activeOpacity={0.8}
            disabled={!isPhaseUnlocked(5)}
          >
            {isPhaseUnlocked(5) && <View style={styles.cardGlow} />}
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, isPhaseUnlocked(5) ? styles.iconActive : styles.iconLocked]}>
                <Text style={styles.icon}>🎓</Text>
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, !isPhaseUnlocked(5) && styles.textLocked]}>Phase 5: Deviations</Text>
                  <InfoIcon tipKey="phase5" size={18} />
                  {phase5Complete && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={[styles.cardDescription, !isPhaseUnlocked(5) && styles.textLocked]}>
                  Master the Illustrious 18 strategy deviations.
                </Text>
              </View>
              {isPhaseUnlocked(5) ? (
                <Text style={styles.arrow}>›</Text>
              ) : (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Practice & Tools Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice & Tools</Text>
          <View style={styles.grid}>
            <TouchableOpacity
              style={[styles.gridCard, styles.cardActive]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('DrillCancellation');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.gridIconRow}>
                <Text style={styles.gridIcon}>⏱️</Text>
                <InfoIcon tipKey="speedDrill" size={14} />
              </View>
              <Text style={styles.gridTitle}>Speed Drill</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.cardActive]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('Simulator');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.gridIconRow}>
                <Text style={styles.gridIcon}>🎰</Text>
                <InfoIcon tipKey="simulator" size={14} />
              </View>
              <Text style={styles.gridTitle}>Casino Sim</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.grid, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.gridCard, styles.cardActive]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('DrillDeckCountdown');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.gridIconRow}>
                <Text style={styles.gridIcon}>⚡️</Text>
                <InfoIcon tipKey="deckCountdown" size={14} />
              </View>
              <Text style={styles.gridTitle}>Deck Countdown</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.cardActive]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('DrillDiscardTray');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.gridIconRow}>
                <Text style={styles.gridIcon}>👁️</Text>
                <InfoIcon tipKey="discardTray" size={14} />
              </View>
              <Text style={styles.gridTitle}>Discard Eye</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.cardActive]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('DrillDeviations');
              }}
              activeOpacity={0.8}
            >
              <View style={styles.gridIconRow}>
                <Text style={styles.gridIcon}>🎓</Text>
                <InfoIcon tipKey="deviations" size={14} />
              </View>
              <Text style={styles.gridTitle}>The 18</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.grid, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.gridCard, styles.cardActive]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('Analytics');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.gridIcon}>📊</Text>
              <Text style={styles.gridTitle}>Analytics</Text>
            </TouchableOpacity>

            <View style={[styles.gridCard, styles.cardLocked]}>
              <Text style={styles.gridIcon}>🏆</Text>
              <Text style={[styles.gridTitle, styles.textLocked]}>Coming Soon</Text>
            </View>
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
    alignItems: 'center', // Center everything in header
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 16, // Optional rounding
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
  iconZero: {
    backgroundColor: `${colors.accent}20`,
    borderColor: colors.accent,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkMark: {
    color: colors.accentGreen,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
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
  gridIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  gridIcon: {
    fontSize: 36,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
