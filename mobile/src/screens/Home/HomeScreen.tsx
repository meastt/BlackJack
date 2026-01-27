import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { useProgressStore } from '../../store/useProgressStore';
import { InfoIcon } from '../../components/InfoIcon';
import * as Haptics from 'expo-haptics';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isPhaseUnlocked, phase0Complete, phase1Complete, phase3Complete, phase4Complete, phase5Complete } = useProgressStore();

  const renderPhaseCard = (phase: number, title: string, description: string, emoji: string, screen: string, isComplete: boolean) => {
    const unlocked = isPhaseUnlocked(phase);
    return (
      <TouchableOpacity
        style={[styles.card, unlocked ? styles.cardActive : styles.cardLocked]}
        onPress={() => {
          if (unlocked) {
            Haptics.selectionAsync();
            navigation.navigate(screen);
          }
        }}
        activeOpacity={0.8}
        disabled={!unlocked}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, unlocked ? styles.iconActive : styles.iconLocked]}>
            <Text style={styles.icon}>{unlocked ? emoji : '🔒'}</Text>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.cardTitle, !unlocked && styles.textLocked]} numberOfLines={1}>
                PHASE {phase}: {title}
              </Text>
              {isComplete && (
                <View style={styles.completeBadge}>
                  <Text style={styles.completeText}>COMPLETED</Text>
                </View>
              )}
            </View>
            <Text style={[styles.cardDescription, !unlocked && styles.textLocked]}>{description}</Text>
          </View>
          {unlocked && (
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>›</Text>
            </View>
          )}
        </View>
        {unlocked && <View style={styles.cardGlowLine} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tactical Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>PROTOCOL <Text style={styles.highlight}>21</Text></Text>
            <Text style={styles.headerSubtitle}>ADVANTAGE PLAY INTERFACE // v1.0.4</Text>
          </View>
        </View>

        {/* Training Modules */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>TRAINING_MODULES</Text>
          </View>

          {renderPhaseCard(0, 'BASIC STRATEGY', 'Master the fundamental math of the game.', '🧠', 'Phase0BasicStrategy', phase0Complete)}
          {renderPhaseCard(1, 'CARD VALUES', 'Internalize Hi-Lo values for every rank.', '🃏', 'Phase1CardValues', phase1Complete)}
          {renderPhaseCard(2, 'RUNNING COUNT', 'Maintain accuracy under simulated pressure.', '🔢', 'Phase2RunningCount', false)}
          {renderPhaseCard(3, 'TRUE COUNT', 'Adjust for deck density and penetration.', '➗', 'Phase3TrueCount', phase3Complete)}
          {renderPhaseCard(4, 'BETTING', 'Optimize bet sizing with Kelly Criterion.', '💰', 'Phase4Betting', phase4Complete)}
          {renderPhaseCard(5, 'DEVIATIONS', 'Master the Illustrious 18 index plays.', '🎓', 'Phase5Deviations', phase5Complete)}
        </View>

        {/* Tactical Tools */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIndicator, { backgroundColor: colors.primary }]} />
            <Text style={styles.sectionTitle}>TACTICAL_TOOLS</Text>
          </View>

          <View style={styles.grid}>
            <TouchableOpacity
              style={[styles.gridCard, styles.gridCardActive]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('Simulator');
              }}
            >
              <View style={styles.gridCardInner}>
                <Text style={styles.gridIcon}>🎰</Text>
                <Text style={styles.gridTitle}>SIMULATOR</Text>
                <View style={[styles.gridTag, styles.tagActive]}>
                  <Text style={styles.gridTagText}>OPERATIONAL</Text>
                </View>
              </View>
              <View style={styles.gridGlow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridCard, styles.gridCardLocked]}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate('Analytics');
              }}
            >
              <View style={styles.gridCardInner}>
                <Text style={styles.gridIcon}>📊</Text>
                <Text style={styles.gridTitle}>ANALYTICS</Text>
                <View style={[styles.gridTag, styles.tagLocked]}>
                  <Text style={styles.gridTagText}>ENCRYPTED</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.terminal}>
          <Text style={styles.terminalText}>// SYSTEM READY</Text>
          <Text style={styles.terminalText}>// CONNECTING TO TABLE_E4...</Text>
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
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    marginTop: 10,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 2,
    marginRight: 20,
    backgroundColor: colors.surface,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  highlight: {
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 9,
    color: colors.textTertiary,
    letterSpacing: 2,
    marginTop: 6,
    fontWeight: '800',
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 2,
    marginBottom: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: colors.border,
  },
  cardLocked: {
    opacity: 0.35,
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  cardGlowLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.primary,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 2,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  iconLocked: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  icon: {
    fontSize: 22,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
    width: '100%',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    flexShrink: 1,
    marginRight: 8,
  },
  completeBadge: {
    marginLeft: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: `${colors.success}40`,
    borderRadius: 2,
  },
  completeText: {
    color: colors.success,
    fontWeight: '900',
    fontSize: 7,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
  textLocked: {
    color: colors.textTertiary,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '300',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridCard: {
    flex: 1,
    height: 140,
    backgroundColor: colors.surface,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#0a0a0a',
  },
  gridCardLocked: {
    opacity: 0.4,
    borderStyle: 'dashed',
  },
  gridCardInner: {
    alignItems: 'center',
    zIndex: 2,
  },
  gridGlow: {
    position: 'absolute',
    bottom: -40,
    width: '100%',
    height: 80,
    backgroundColor: colors.primary,
    opacity: 0.1,
    borderRadius: 100,
    transform: [{ scaleX: 2 }],
  },
  gridIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  gridTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
  },
  gridTag: {
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    borderWidth: 1,
  },
  tagActive: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  tagLocked: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  gridTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  terminal: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 20,
  },
  terminalText: {
    color: colors.textTertiary,
    fontSize: 10,
    fontFamily: 'Courier', // If available, otherwise it defaults
    marginBottom: 4,
    letterSpacing: 1,
  }
});
