
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
    const { phase2Complete, addSessionResult, updateStreak, getPhaseProgress } = useProgressStore();
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [startTime, setStartTime] = useState(Date.now());
    const [showIntro, setShowIntro] = useState(true);
    const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

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
        setStartTime(Date.now()); // Reset timer
        setSessionSummary(null);
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
        const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        const accuracy = finalScore.total > 0 ? finalScore.correct / finalScore.total : 0;

        // Save session result to progress store
        addSessionResult('phase2', {
            phase: 'phase2',
            accuracy,
            cardsCompleted: currentCardIndex + 1,
            timeInSeconds,
            timestamp: Date.now(),
        });

        updateStreak();

        // Get updated progress
        const progress = getPhaseProgress(2);
        const isMastery =
            accuracy >= MASTERY_REQUIREMENTS.PHASE_2.REQUIRED_ACCURACY &&
            timeInSeconds <= MASTERY_REQUIREMENTS.PHASE_2.TIME_LIMIT_SECONDS;

        setSessionSummary({
            correctChecks: finalScore.correct,
            totalChecks: finalScore.total,
            accuracy,
            isMastery,
            consecutiveProgress: progress.masteryProgress,
            phaseComplete: phase2Complete,
        });

        setGameState('SUMMARY');
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
                    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
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
                            <TouchableOpacity onPress={() => setUserCount(c => c - 1)} style={styles.controlBtn}>
                                <Text style={styles.controlText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.countDisplay}>{userCount}</Text>
                            <TouchableOpacity onPress={() => setUserCount(c => c + 1)} style={styles.controlBtn}>
                                <Text style={styles.controlText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleInputCheck(userCount)} style={styles.submitBtn}>
                            <Text style={styles.submitText}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {gameState === 'FEEDBACK' && (
                    <View style={styles.checkContainer}>
                        <Text style={[styles.checkTitle, { color: colors.success }]}>✓ CORRECT</Text>
                        <Text style={styles.instructionText}>RESUMING...</Text>
                    </View>
                )}

                {gameState === 'SUMMARY' && sessionSummary && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>
                            {sessionSummary.isMastery ? '✓ MASTERY SESSION!' : 'SESSION COMPLETE'}
                        </Text>

                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>ACCURACY</Text>
                                <Text style={[styles.statValue, sessionSummary.isMastery && styles.masteryText]}>
                                    {Math.round(sessionSummary.accuracy * 100)}%
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>TIME</Text>
                                <Text style={[styles.statValue, sessionSummary.isMastery && styles.masteryText]}>
                                    {Math.floor((Date.now() - startTime) / 1000)}s
                                </Text>
                            </View>
                        </View>

                        <View style={styles.progressBar}>
                            <Text style={styles.progressLabel}>
                                MASTERY PROGRESS: {Math.round(sessionSummary.consecutiveProgress * 100)}%
                            </Text>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${sessionSummary.consecutiveProgress * 100}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressHint}>
                                {sessionSummary.phaseComplete
                                    ? '🏆 PHASE 2 COMPLETE! PHASE 3 UNLOCKED!'
                                    : `NEED ${MASTERY_REQUIREMENTS.PHASE_2.CONSECUTIVE_SESSIONS} SESSIONS AT ${MASTERY_REQUIREMENTS.PHASE_2.REQUIRED_ACCURACY * 100}% AND < ${MASTERY_REQUIREMENTS.PHASE_2.TIME_LIMIT_SECONDS}S`
                                }
                            </Text>
                        </View>

                        <View style={styles.buttonRow}>
                            {navigation && (
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={[styles.submitBtn, styles.secondaryBtn]}
                                >
                                    <Text style={[styles.submitText, styles.secondaryBtnText]}>HOME</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={startNewSession} style={styles.submitBtn}>
                                <Text style={styles.submitText}>AGAIN</Text>
                            </TouchableOpacity>
                        </View>
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
        paddingVertical: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    phaseTitle: {
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 4,
        fontSize: 10,
        fontWeight: '900',
        marginBottom: 12,
    },
    countBadge: {
        backgroundColor: colors.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    debugText: {
        color: colors.textTertiary,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    cardContainer: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 10,
    },
    instructionText: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.textSecondary,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    checkContainer: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 32,
    },
    checkTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.textSecondary,
        marginBottom: 40,
        letterSpacing: 2,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    inputControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 48,
        gap: 24,
    },
    controlBtn: {
        width: 64,
        height: 64,
        borderRadius: 4,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    controlText: {
        fontSize: 32,
        color: colors.primary,
        fontWeight: '900',
    },
    countDisplay: {
        fontSize: 64,
        fontWeight: '900',
        color: '#FFFFFF',
        width: 120,
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
    },
    submitBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    summaryContainer: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 4,
        padding: 32,
        borderWidth: 1,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        gap: 24,
    },
    summaryTitle: {
        fontSize: 20,
        color: colors.textPrimary,
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 24,
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        paddingVertical: 16,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    statLabel: {
        fontSize: 9,
        color: colors.textTertiary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '800',
    },
    statValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        fontVariant: ['tabular-nums'],
    },
    masteryText: {
        color: colors.success,
    },
    progressBar: {
        width: '100%',
        marginVertical: 12,
    },
    progressLabel: {
        fontSize: 10,
        color: colors.textTertiary,
        marginBottom: 12,
        textAlign: 'center',
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    progressBarBg: {
        height: 4,
        backgroundColor: colors.surfaceDark,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.success,
    },
    progressHint: {
        fontSize: 10,
        color: colors.textTertiary,
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    secondaryBtn: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        shadowOpacity: 0,
    },
    secondaryBtnText: {
        color: colors.textSecondary,
    },
});
