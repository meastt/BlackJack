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
            <Text style={styles.neonCyan}>{score.total}</Text>
            <Text style={styles.statDivider}>/{CARDS_PER_SESSION}</Text>
          </Text>
        </View>
        <View style={styles.statDividerVertical} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACCURACY</Text>
          <Text style={[styles.statValue, accuracy >= 95 ? styles.neonGreen : styles.neonCyan]}>
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
              isCorrect ? styles.neonGreen : styles.neonPink
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
              userAnswer === -1 && styles.answerButtonSelectedPink,
            ]}
            onPress={() => handleAnswer(-1)}
            disabled={userAnswer !== null}
            activeOpacity={0.7}
          >
            <Text style={[styles.answerButtonText, styles.neonPink]}>-1</Text>
            <Text style={styles.answerButtonSubtext}>10 J Q K A</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              styles.answerButtonNeutral,
              userAnswer === 0 && styles.answerButtonSelectedCyan,
            ]}
            onPress={() => handleAnswer(0)}
            disabled={userAnswer !== null}
            activeOpacity={0.7}
          >
            <Text style={[styles.answerButtonText, styles.neonCyan]}>0</Text>
            <Text style={styles.answerButtonSubtext}>7 8 9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              styles.answerButtonPositive,
              userAnswer === 1 && styles.answerButtonSelectedGreen,
            ]}
            onPress={() => handleAnswer(1)}
            disabled={userAnswer !== null}
            activeOpacity={0.7}
          >
            <Text style={[styles.answerButtonText, styles.neonGreen]}>+1</Text>
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
                      summary.isMastery ? styles.neonGreen : styles.neonPink
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
    height: 3,
    backgroundColor: colors.surface,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accentBlue,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  statDivider: {
    color: colors.textMuted,
  },
  statDividerVertical: {
    width: 1,
    height: 30,
    backgroundColor: colors.glassBorder,
  },
  neonPink: {
    color: colors.accent,
    textShadowColor: colors.glowPink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  neonCyan: {
    color: colors.accentBlue,
    textShadowColor: colors.glowCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  neonGreen: {
    color: colors.accentGreen,
    textShadowColor: colors.glowGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    ...fontStyles.h3,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  cardContainer: {
    marginVertical: 20,
  },
  cardGlow: {
    shadowColor: colors.accentBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  feedback: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    minWidth: 160,
    backgroundColor: colors.surface,
    borderWidth: 1,
  },
  feedbackSpacer: {
    height: 72,
    marginTop: 20,
  },
  feedbackCorrect: {
    borderColor: colors.accentGreen,
    shadowColor: colors.glowGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  feedbackIncorrect: {
    borderColor: colors.accent,
    shadowColor: colors.glowPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  feedbackValue: {
    ...fontStyles.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  answerSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 40,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: colors.surfaceDark,
  },
  answerButtonNegative: {
    borderColor: `${colors.accent}60`,
  },
  answerButtonNeutral: {
    borderColor: `${colors.accentBlue}60`,
  },
  answerButtonPositive: {
    borderColor: `${colors.accentGreen}60`,
  },
  answerButtonSelectedPink: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}20`,
    shadowColor: colors.glowPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  answerButtonSelectedCyan: {
    borderColor: colors.accentBlue,
    backgroundColor: `${colors.accentBlue}20`,
    shadowColor: colors.glowCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  answerButtonSelectedGreen: {
    borderColor: colors.accentGreen,
    backgroundColor: `${colors.accentGreen}20`,
    shadowColor: colors.glowGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  answerButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  answerButtonSubtext: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
    letterSpacing: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  modalTitle: {
    ...fontStyles.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryStats: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  summaryLabel: {
    ...fontStyles.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...fontStyles.body,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  masteryBadge: {
    backgroundColor: `${colors.accentGreen}20`,
    borderWidth: 1,
    borderColor: colors.accentGreen,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  masteryText: {
    color: colors.accentGreen,
    fontWeight: 'bold',
    fontSize: 18,
  },
  masterySubtext: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  retryBadge: {
    backgroundColor: `${colors.accent}20`,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  retryText: {
    color: colors.accent,
    fontWeight: '600',
  },
  phaseProgress: {
    alignItems: 'center',
    marginBottom: 20,
  },
  phaseProgressLabel: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  phaseProgressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.glassBorder,
  },
  progressDotFilled: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  completeBadge: {
    backgroundColor: `${colors.accentYellow}20`,
    borderWidth: 2,
    borderColor: colors.accentYellow,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  completeText: {
    color: colors.accentYellow,
    fontWeight: 'bold',
    fontSize: 20,
  },
  completeSubtext: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
