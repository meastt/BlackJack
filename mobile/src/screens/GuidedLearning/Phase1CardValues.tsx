import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import { Card as CardComponent } from '../../components/Card';
import { CardCountingEngine } from '@card-counter-ai/shared';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { useProgressStore, MASTERY_REQUIREMENTS } from '../../store/useProgressStore';
import * as Haptics from 'expo-haptics';
import { PhaseIntroModal } from '../../components/PhaseIntroModal';

const CARDS_PER_SESSION = MASTERY_REQUIREMENTS.PHASE_1.CARDS_PER_SESSION;

const triggerHaptic = (type: 'success' | 'error' | 'selection') => {
  switch (type) {
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
    case 'selection':
      Haptics.selectionAsync();
      break;
  }
};

interface SessionSummary {
  correct: number;
  total: number;
  accuracy: number;
  isMastery: boolean;
  consecutiveProgress: number;
  phaseComplete: boolean;
}

export const Phase1CardValues: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [currentCard, setCurrentCard] = useState(CardCountingEngine.createDeck()[0]);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [startTime] = useState(Date.now());
  const [showIntro, setShowIntro] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const engine = new CardCountingEngine();

  // Progress store
  const {
    addSessionResult,
    phase1ConsecutiveMastery,
    phase1Complete,
    updateStreak
  } = useProgressStore();

  const showNextCard = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      const deck = CardCountingEngine.shuffleDeck(CardCountingEngine.createDeck());
      setCurrentCard(deck[0]);
      setUserAnswer(null);
      setIsCorrect(null);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAnswer = (answer: number) => {
    if (userAnswer !== null) return;

    setUserAnswer(answer);
    const correctValue = engine.getCardValue(currentCard.rank);
    const correct = answer === correctValue;

    triggerHaptic(correct ? 'success' : 'error');

    setIsCorrect(correct);
    const newScore = {
      correct: score.correct + (correct ? 1 : 0),
      total: score.total + 1,
    };
    setScore(newScore);

    // Check if session is complete
    if (newScore.total >= CARDS_PER_SESSION) {
      setTimeout(() => {
        completeSession(newScore);
      }, 800);
    } else {
      // Auto-advance after 1 second
      setTimeout(() => {
        showNextCard();
      }, 1000);
    }
  };

  const completeSession = (finalScore: { correct: number; total: number }) => {
    const accuracy = finalScore.correct / finalScore.total;
    const isMastery = accuracy >= MASTERY_REQUIREMENTS.PHASE_1.REQUIRED_ACCURACY;
    const newConsecutive = isMastery ? phase1ConsecutiveMastery + 1 : 0;
    const isPhaseComplete = phase1Complete || newConsecutive >= MASTERY_REQUIREMENTS.PHASE_1.CONSECUTIVE_SESSIONS;

    // Save session result
    addSessionResult('phase1', {
      phase: 'phase1',
      accuracy,
      cardsCompleted: finalScore.total,
      timeInSeconds: Math.floor((Date.now() - startTime) / 1000),
      timestamp: Date.now(),
    });

    // Update streak
    updateStreak();

    // Show summary
    setSummary({
      correct: finalScore.correct,
      total: finalScore.total,
      accuracy,
      isMastery,
      consecutiveProgress: Math.min(newConsecutive, MASTERY_REQUIREMENTS.PHASE_1.CONSECUTIVE_SESSIONS),
      phaseComplete: isPhaseComplete,
    });
    setSessionComplete(true);
  };

  const startNewSession = () => {
    setScore({ correct: 0, total: 0 });
    setSessionComplete(false);
    setSummary(null);
    showNextCard();
  };

  const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
  const progress = score.total / CARDS_PER_SESSION;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>PROGRESS</Text>
          <Text style={styles.statValue}>
            <Text style={styles.textPrimary}>{score.total}</Text>
            <Text style={styles.statDivider}>/{CARDS_PER_SESSION}</Text>
          </Text>
        </View>
        <View style={styles.statDividerVertical} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACCURACY</Text>
          <Text style={[styles.statValue, accuracy >= 95 ? styles.textSuccess : styles.textPrimary]}>
            {accuracy.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.instruction}>
          What is the Hi-Lo value?
        </Text>

        <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
          <View style={styles.cardGlow}>
            <CardComponent card={currentCard} size="large" />
          </View>
        </Animated.View>

        {/* Feedback */}
        {isCorrect !== null && (
          <View style={[
            styles.feedback,
            isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          ]}>
            <Text style={[
              styles.feedbackText,
              isCorrect ? styles.textSuccess : styles.textError
            ]}>
              {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
            </Text>
            <Text style={styles.feedbackValue}>
              Value: {engine.getCardValue(currentCard.rank)}
            </Text>
          </View>
        )}

        {isCorrect === null && <View style={styles.feedbackSpacer} />}
      </View>

      {/* Answer Buttons */}
      <View style={styles.answerSection}>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[
              styles.answerButton,
              styles.answerButtonNegative,
              userAnswer === -1 && styles.answerButtonSelectedError,
            ]}
            onPress={() => handleAnswer(-1)}
            disabled={userAnswer !== null}
            activeOpacity={0.7}
          >
            <Text style={[styles.answerButtonText, styles.textError]}>-1</Text>
            <Text style={styles.answerButtonSubtext}>10 J Q K A</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              styles.answerButtonNeutral,
              userAnswer === 0 && styles.answerButtonSelectedPrimary,
            ]}
            onPress={() => handleAnswer(0)}
            disabled={userAnswer !== null}
            activeOpacity={0.7}
          >
            <Text style={[styles.answerButtonText, styles.textPrimary]}>0</Text>
            <Text style={styles.answerButtonSubtext}>7 8 9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              styles.answerButtonPositive,
              userAnswer === 1 && styles.answerButtonSelectedSuccess,
            ]}
            onPress={() => handleAnswer(1)}
            disabled={userAnswer !== null}
            activeOpacity={0.7}
          >
            <Text style={[styles.answerButtonText, styles.textSuccess]}>+1</Text>
            <Text style={styles.answerButtonSubtext}>2 3 4 5 6</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Session Complete Modal */}
      <Modal
        visible={sessionComplete}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session Complete!</Text>

            {summary && (
              <>
                <View style={styles.summaryStats}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Score</Text>
                    <Text style={styles.summaryValue}>
                      {summary.correct}/{summary.total}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Accuracy</Text>
                    <Text style={[
                      styles.summaryValue,
                      summary.isMastery ? styles.textSuccess : styles.textError
                    ]}>
                      {(summary.accuracy * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>

                {summary.isMastery ? (
                  <View style={styles.masteryBadge}>
                    <Text style={styles.masteryText}>🎯 MASTERY SESSION!</Text>
                    <Text style={styles.masterySubtext}>95%+ Accuracy</Text>
                  </View>
                ) : (
                  <View style={styles.retryBadge}>
                    <Text style={styles.retryText}>Need 95% to progress</Text>
                  </View>
                )}

                {/* Progress toward phase completion */}
                <View style={styles.phaseProgress}>
                  <Text style={styles.phaseProgressLabel}>
                    Mastery Progress: {summary.consecutiveProgress}/{MASTERY_REQUIREMENTS.PHASE_1.CONSECUTIVE_SESSIONS}
                  </Text>
                  <View style={styles.phaseProgressDots}>
                    {Array.from({ length: MASTERY_REQUIREMENTS.PHASE_1.CONSECUTIVE_SESSIONS }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.progressDot,
                          i < summary.consecutiveProgress && styles.progressDotFilled,
                        ]}
                      />
                    ))}
                  </View>
                </View>

                {summary.phaseComplete && (
                  <View style={styles.completeBadge}>
                    <Text style={styles.completeText}>🏆 PHASE 1 COMPLETE!</Text>
                    <Text style={styles.completeSubtext}>Phase 2 Unlocked</Text>
                  </View>
                )}
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => navigation?.goBack()}
              >
                <Text style={styles.modalButtonSecondaryText}>Back to Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={startNewSession}
              >
                <Text style={styles.modalButtonPrimaryText}>Practice Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <PhaseIntroModal
        visible={showIntro}
        phase="phase1"
        onStart={() => setShowIntro(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.surface,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    marginBottom: 6,
    letterSpacing: 2,
    fontWeight: '900',
  },
  statValue: {
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  statDivider: {
    color: colors.textTertiary,
    fontWeight: 'normal',
    fontSize: 14,
  },
  statDividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  textPrimary: { color: colors.primary },
  textSuccess: { color: colors.success },
  textError: { color: colors.error },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  cardContainer: {
    marginVertical: 24,
  },
  cardGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  feedback: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 2,
    marginTop: 24,
    alignItems: 'center',
    minWidth: 180,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feedbackSpacer: {
    height: 80,
    marginTop: 24,
  },
  feedbackCorrect: {
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  feedbackIncorrect: {
    borderColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  feedbackText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  feedbackValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textTertiary,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  answerSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    paddingBottom: 48,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  answerButtonNegative: {
    borderColor: colors.border,
  },
  answerButtonNeutral: {
    borderColor: colors.border,
  },
  answerButtonPositive: {
    borderColor: colors.border,
  },
  answerButtonSelectedError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  answerButtonSelectedPrimary: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  answerButtonSelectedSuccess: {
    borderColor: colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  answerButtonText: {
    fontSize: 32,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  answerButtonSubtext: {
    fontSize: 9,
    color: colors.textTertiary,
    marginTop: 8,
    letterSpacing: 1.5,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 4,
    padding: 32,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  summaryStats: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  masteryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 2,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  masteryText: {
    color: colors.success,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  masterySubtext: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  retryBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 2,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  retryText: {
    color: colors.error,
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  phaseProgress: {
    alignItems: 'center',
    marginBottom: 24,
  },
  phaseProgressLabel: {
    color: colors.textTertiary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  phaseProgressDots: {
    flexDirection: 'row',
    gap: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressDotFilled: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  completeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 2,
    borderColor: colors.warning,
    borderRadius: 2,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeText: {
    color: colors.warning,
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 2,
  },
  completeSubtext: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonSecondary: {
    flex: 1,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  modalButtonSecondaryText: {
    color: colors.textSecondary,
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 16,
    borderRadius: 4,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
