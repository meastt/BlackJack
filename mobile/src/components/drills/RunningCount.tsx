
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
    SafeAreaView,
} from 'react-native';
import { Card as CardComponent } from '../../components/Card';
import { CardCountingEngine, Card } from '@card-counter-ai/shared';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { useProgressStore, MASTERY_REQUIREMENTS } from '../../store/useProgressStore';
import * as Haptics from 'expo-haptics';
import { PhaseIntroModal } from '../../components/PhaseIntroModal';

const CARDS_PER_SESSION = 52; // Full deck for running count usually, but let's start with smaller batches or check reqs.
// Spec says: "After 20-30 cards, ask 'What is the count?'"
// Let's do a "Drill" of 20 cards for now to keep it snappy, asking halfway and at end.

interface SessionSummary {
    correctChecks: number;
    totalChecks: number;
    accuracy: number;
    isMastery: boolean;
    consecutiveProgress: number;
    phaseComplete: boolean;
}

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

export const Phase2RunningCount: React.FC<{ navigation?: any }> = ({ navigation }) => {
    // Game State
    const [deck, setDeck] = useState<Card[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1);
    const [runningCount, setRunningCount] = useState(0); // The ACTUAL running count
    const [userCount, setUserCount] = useState(0); // Input from user logic

    // UI State
    const [gameState, setGameState] = useState<'IDLE' | 'DEALING' | 'CHECK' | 'FEEDBACK' | 'SUMMARY'>('IDLE');
    const [checkReason, setCheckReason] = useState<'RANDOM' | 'END'>('RANDOM');

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Engine
    const engine = useRef(new CardCountingEngine()).current;

    // Progress
    const { phase2Complete, addSessionResult, updateStreak } = useProgressStore();
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [startTime] = useState(Date.now());
    const [showIntro, setShowIntro] = useState(true);

    // Settings
    const DELAY_MS = 2000; // 2 seconds per card for now

    // Initialize
    useEffect(() => {
        if (!showIntro) {
            startNewSession();
        }
    }, [showIntro]);

    const startNewSession = () => {
        const newDeck = CardCountingEngine.shuffleDeck(CardCountingEngine.createDeck());
        setDeck(newDeck);
        setCurrentCardIndex(-1);
        setRunningCount(0);
        setScore({ correct: 0, total: 0 });
        setGameState('IDLE');
        fadeAnim.setValue(0);

        // Auto start after short delay
        setTimeout(() => {
            setGameState('DEALING');
            dealNextCard(newDeck, -1, 0); // Start recursion
        }, 1000);
    };

    // Recursive dealing loop
    const dealNextCard = (currentDeck: Card[], currentIndex: number, currentRC: number) => {
        const nextIndex = currentIndex + 1;

        // CHECKPOINT LOGIC
        // Ask for count every 10 cards OR at end of deck (let's do 10 for now)
        // Or specific random intervals. Let's do index 10 and 20.
        if (nextIndex > 0 && (nextIndex % 10 === 0 || nextIndex >= 20)) { // Stop at 20 cards for this drill
            setGameState('CHECK');
            setCheckReason(nextIndex >= 20 ? 'END' : 'RANDOM');
            return;
        }

        const card = currentDeck[nextIndex];
        const val = engine.getCardValue(card.rank);
        const nextRC = currentRC + val;

        setDeck(currentDeck); // Just to be safe
        setCurrentCardIndex(nextIndex);
        setRunningCount(nextRC);

        // Flash Card
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(DELAY_MS - 400), // Hold
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true })
        ]).start(() => {
            // Next card
            dealNextCard(currentDeck, nextIndex, nextRC);
        });
    };

    const handleInputCheck = (input: number) => {
        const isCorrect = input === runningCount;

        triggerHaptic(isCorrect ? 'success' : 'error');

        const newScore = {
            correct: score.correct + (isCorrect ? 1 : 0),
            total: score.total + 1
        };
        setScore(newScore);

        if (isCorrect) {
            // If correct, continue or finish?
            if (checkReason === 'END') {
                finishSession(newScore);
            } else {
                // Continue dealing
                setGameState('FEEDBACK'); // Briefly show "Correct!" then continue
                setTimeout(() => {
                    setGameState('DEALING');
                    dealNextCard(deck, currentCardIndex, runningCount);
                }, 1000);
            }
        } else {
            // If wrong, GAME OVER for this drill? Or just feedback?
            // "Strict" mode usually fails you. Let's just show feedback and stop for now.
            finishSession(newScore); // End session on error for now? Or just let them finish?
            // Actually, let's just finish logic for MVP.
        }
    };

    const finishSession = (finalScore: { correct: number, total: number }) => {
        setGameState('SUMMARY');
        // Save progress logic here...
    };

    return (
        <View style={styles.container}>
            {/* Header / Stats */}
            <View style={styles.header}>
                <Text style={styles.phaseTitle}>running count</Text>
                <View style={styles.countBadge}>
                    {/* Only show count in DEBUG mode or if game over? Hidden for user */}
                    <Text style={styles.debugText}>Cards: {currentCardIndex + 1}</Text>
                </View>
            </View>

            {/* Dealing Area */}
            <View style={styles.gameArea}>
                {gameState === 'DEALING' && currentCardIndex >= 0 && (
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <CardComponent card={deck[currentCardIndex]} size="large" />
                    </Animated.View>
                )}

                {gameState === 'IDLE' && (
                    <Text style={styles.instructionText}>Get Ready...</Text>
                )}

                {gameState === 'CHECK' && (
                    <View style={styles.checkContainer}>
                        <Text style={styles.checkTitle}>What is the running count?</Text>
                        <View style={styles.inputControls}>
                            <TouchableOpacity onPress={() => setUserCount(c => c - 1)} style={styles.controlBtn}><Text style={styles.controlText}>-</Text></TouchableOpacity>
                            <Text style={styles.countDisplay}>{userCount}</Text>
                            <TouchableOpacity onPress={() => setUserCount(c => c + 1)} style={styles.controlBtn}><Text style={styles.controlText}>+</Text></TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleInputCheck(userCount)} style={styles.submitBtn}>
                            <Text style={styles.submitText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {gameState === 'FEEDBACK' && (
                    <View style={styles.checkContainer}>
                        <Text style={[styles.checkTitle, { color: colors.accentGreen }]}>✓ Correct!</Text>
                        <Text style={styles.instructionText}>Resuming...</Text>
                    </View>
                )}

                {gameState === 'SUMMARY' && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Session Complete</Text>
                        <Text style={styles.summaryScore}>
                            Actual Count: {runningCount}
                        </Text>
                        <Text style={styles.summaryScore}>
                            Your Check: {score.correct > 0 ? 'Correct' : 'Incorrect'}
                        </Text>
                        <TouchableOpacity onPress={startNewSession} style={styles.submitBtn}>
                            <Text style={styles.submitText}>AGAIN</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <PhaseIntroModal
                visible={showIntro}
                phase="phase2"
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
    header: {
        padding: 20,
        alignItems: 'center',
    },
    phaseTitle: {
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
    },
    countBadge: {
        backgroundColor: colors.surfaceLight,
        padding: 5,
        borderRadius: 5,
    },
    debugText: {
        color: colors.textMuted,
        fontSize: 12,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructionText: {
        ...fontStyles.h2,
        color: colors.textPrimary,
    },
    checkContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    checkTitle: {
        ...fontStyles.h3,
        color: colors.textPrimary,
        marginBottom: 30,
    },
    inputControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        gap: 20,
    },
    controlBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accentBlue,
    },
    controlText: {
        fontSize: 30,
        color: colors.accentBlue,
    },
    countDisplay: {
        fontSize: 48,
        fontWeight: 'bold',
        color: colors.textPrimary,
        width: 100,
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: colors.accentGreen,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    submitText: {
        color: colors.background, // dark text on green
        fontWeight: 'bold',
        fontSize: 18,
    },
    summaryContainer: {
        alignItems: 'center',
        gap: 20,
    },
    summaryTitle: {
        fontSize: 24,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    summaryScore: {
        fontSize: 18,
        color: colors.textSecondary,
    },
});
