import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Card as CardComponent } from '../../components/Card';
import { Button } from '../../components/Button';
import { CardCountingEngine } from '@card-counter-ai/shared';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { useGameStore } from '../../store/useGameStore';

export const Phase1CardValues: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(CardCountingEngine.createDeck()[0]);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const fadeAnim = new Animated.Value(1);

  const engine = new CardCountingEngine();

  const showNextCard = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Generate new card
      const deck = CardCountingEngine.shuffleDeck(CardCountingEngine.createDeck());
      setCurrentCard(deck[0]);
      setUserAnswer(null);
      setIsCorrect(null);

      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAnswer = (answer: number) => {
    setUserAnswer(answer);
    const correctValue = engine.getCardValue(currentCard.rank);
    const correct = answer === correctValue;

    setIsCorrect(correct);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    // Auto-advance after 1 second
    setTimeout(() => {
      showNextCard();
    }, 1000);
  };

  const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Phase 1: Card Values</Text>
        <Text style={styles.subtitle}>Learn Hi-Lo card counting values</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Score: {score.correct}/{score.total}
          </Text>
          <Text style={styles.accuracyText}>
            Accuracy: {accuracy.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          What is the value of this card?
        </Text>

        <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
          <CardComponent card={currentCard} size="large" />
        </Animated.View>

        {isCorrect !== null && (
          <View style={[
            styles.feedback,
            isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          ]}>
            <Text style={styles.feedbackText}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
            <Text style={styles.feedbackValue}>
              Value: {engine.getCardValue(currentCard.rank)}
            </Text>
          </View>
        )}

        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={[
              styles.answerButton,
              userAnswer === -1 && styles.answerButtonSelected,
            ]}
            onPress={() => handleAnswer(-1)}
            disabled={userAnswer !== null}
          >
            <Text style={styles.answerButtonText}>-1</Text>
            <Text style={styles.answerButtonSubtext}>10, J, Q, K, A</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              userAnswer === 0 && styles.answerButtonSelected,
            ]}
            onPress={() => handleAnswer(0)}
            disabled={userAnswer !== null}
          >
            <Text style={styles.answerButtonText}>0</Text>
            <Text style={styles.answerButtonSubtext}>7, 8, 9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.answerButton,
              userAnswer === 1 && styles.answerButtonSelected,
            ]}
            onPress={() => handleAnswer(1)}
            disabled={userAnswer !== null}
          >
            <Text style={styles.answerButtonText}>+1</Text>
            <Text style={styles.answerButtonSubtext}>2, 3, 4, 5, 6</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Hi-Lo Values:</Text>
        <Text style={styles.legendText}>2-6 = +1</Text>
        <Text style={styles.legendText}>7-9 = 0</Text>
        <Text style={styles.legendText}>10-A = -1</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...fontStyles.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...fontStyles.body,
    color: colors.textSecondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  scoreText: {
    ...fontStyles.body,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  accuracyText: {
    ...fontStyles.body,
    color: colors.success,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    ...fontStyles.h3,
    color: colors.textPrimary,
    marginBottom: 32,
    textAlign: 'center',
  },
  cardContainer: {
    marginVertical: 32,
  },
  feedback: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: `${colors.correct}33`,
    borderWidth: 2,
    borderColor: colors.correct,
  },
  feedbackIncorrect: {
    backgroundColor: `${colors.incorrect}33`,
    borderWidth: 2,
    borderColor: colors.incorrect,
  },
  feedbackText: {
    ...fontStyles.h3,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  feedbackValue: {
    ...fontStyles.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  answerButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  answerButtonSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.secondary,
  },
  answerButtonText: {
    ...fontStyles.h2,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  answerButtonSubtext: {
    ...fontStyles.caption,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  legend: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendTitle: {
    ...fontStyles.body,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendText: {
    ...fontStyles.bodySmall,
    color: colors.textSecondary,
    marginVertical: 2,
  },
});
