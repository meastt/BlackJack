import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Card as CardComponent } from '../../components/Card';
import { CardCountingEngine } from '@card-counter-ai/shared';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';

export const Phase1CardValues: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(CardCountingEngine.createDeck()[0]);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const engine = new CardCountingEngine();

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

    setIsCorrect(correct);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    setTimeout(() => {
      showNextCard();
    }, 1000);
  };

  const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Stats Bar - Glass style */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statValue}>
            <Text style={styles.neonCyan}>{score.correct}</Text>
            <Text style={styles.statDivider}>/</Text>
            <Text>{score.total}</Text>
          </Text>
        </View>
        <View style={styles.statDividerVertical} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>ACCURACY</Text>
          <Text style={[styles.statValue, styles.neonGreen]}>
            {accuracy.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.instruction}>
          What is the Hi-Lo value?
        </Text>

        {/* Card with neon glow */}
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

      {/* Answer Buttons - Neon style */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
});
