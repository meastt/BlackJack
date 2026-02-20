import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

const ONBOARDING_STORAGE_KEY = '@protocol21_onboarding_completed';

export const getOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
};

export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
};

interface OnboardingModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onDismiss,
}) => {
  const handleGetStarted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setOnboardingCompleted();
    onDismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={40} tint="dark" style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.icon}>🎯</Text>
            <Text style={styles.title}>WELCOME TO PROTOCOL 21</Text>
            <Text style={styles.subtitle}>ADVANTAGE PLAY INTERFACE</Text>
          </View>

          <ScrollView
            style={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>// PROGRESSION SYSTEM</Text>
              <Text style={styles.sectionText}>
                This training follows a strict sequence. Each lesson builds on the
                previous one. You must complete them in order—no skipping.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>// START HERE</Text>
              <Text style={styles.sectionText}>
                You need to know basic blackjack rules first. Phase 0: Basic
                Strategy is your entry point—master the mathematically correct
                play for every hand before learning to count.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>// UNLOCKING MODULES</Text>
              <Text style={styles.sectionText}>
                Complete each phase to unlock the next. Card Values unlocks after
                Basic Strategy. Running Count unlocks after Card Values. The
                path is linear—each module prepares you for the next.
              </Text>
            </View>

            <View style={styles.progressionHint}>
              <Text style={styles.progressionHintText}>
                BASIC STRATEGY → CARD VALUES → RUNNING COUNT → TRUE COUNT →
                BETTING → DEVIATIONS
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>BEGIN TRAINING</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    width: '100%',
    maxWidth: 380,
    borderRadius: 4,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
    maxHeight: '85%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    paddingBottom: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  body: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  progressionHint: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.surfaceDark,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressionHintText: {
    fontSize: 10,
    color: colors.textTertiary,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
});
