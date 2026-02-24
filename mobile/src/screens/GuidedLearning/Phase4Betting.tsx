import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { HapticEngine } from '../../utils/HapticEngine';
import { HI_LO_BETTING_STRATEGY } from '@card-counter-ai/shared';
import { useProgressStore, MASTERY_REQUIREMENTS } from '../../store/useProgressStore';
import { PhaseIntroModal } from '../../components/PhaseIntroModal';

interface SessionSummary {
    correctChecks: number;
    totalChecks: number;
    accuracy: number;
    isMastery: boolean;
    consecutiveProgress: number;
    phaseComplete: boolean;
}

export const Phase4Betting: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [trueCount, setTrueCount] = useState(0);
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
    const [lastAnswer, setLastAnswer] = useState(0);

    // Progression State
    const [gameState, setGameState] = useState<'PLAYING' | 'SUMMARY'>('PLAYING');
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [startTime, setStartTime] = useState(Date.now());
    const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
    const [showIntro, setShowIntro] = useState(true);

    const { phase4Complete, addSessionResult, updateStreak, getPhaseProgress } = useProgressStore();

    useEffect(() => {
        if (!showIntro) {
            startDemo();
        }
    }, [showIntro]);

    const startDemo = () => {
        setScore({ correct: 0, total: 0 });
        setGameState('PLAYING');
        setSessionSummary(null);
        setStartTime(Date.now());
        nextScenario();
    };

    const nextScenario = () => {
        setFeedback('IDLE');
        // Generate a TC between 0 and 6
        const newTC = Math.floor(Math.random() * 7);
        setTrueCount(newTC);
    };

    const getCorrectBet = (tc: number) => {
        if (tc < 1) return 1; // Min bet
        // Find the unit in our strategy
        const strategy = HI_LO_BETTING_STRATEGY.find(s => s.trueCount === tc);
        if (strategy) return strategy.betMultiplier;

        // Cap at max of strategy or extrapolate? 
        // For this drill, if TC > 4, we'll cap at 8 or use logic.
        // Let's stick to the defined strategy for simplicity or default to max.
        if (tc >= 4) return 8;
        return 1; // Fallback
    };

    const handleGuess = (betUnit: number) => {
        if (feedback !== 'IDLE') return; // Prevent double taps

        const correctBet = getCorrectBet(trueCount);
        setLastAnswer(correctBet);

        const isCorrect = betUnit === correctBet;

        if (isCorrect) {
            setFeedback('CORRECT');
            HapticEngine.triggerSuccess();
        } else {
            setFeedback('WRONG');
            HapticEngine.triggerError();
        }

        const newScore = {
            correct: score.correct + (isCorrect ? 1 : 0),
            total: score.total + 1
        };
        setScore(newScore);

        if (newScore.total >= MASTERY_REQUIREMENTS.PHASE_4.BETS_PER_SESSION) {
            setTimeout(() => finishSession(newScore), 800);
        } else {
            setTimeout(nextScenario, 1000);
        }
    };

    const finishSession = (finalScore: { correct: number, total: number }) => {
        const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        const accuracy = finalScore.total > 0 ? finalScore.correct / finalScore.total : 0;

        addSessionResult('phase4', {
            phase: 'phase4',
            accuracy,
            cardsCompleted: finalScore.total,
            timeInSeconds,
            timestamp: Date.now(),
        });

        updateStreak();

        const progress = getPhaseProgress(4);
        const isMastery = accuracy >= MASTERY_REQUIREMENTS.PHASE_4.REQUIRED_ACCURACY;

        setSessionSummary({
            correctChecks: finalScore.correct,
            totalChecks: finalScore.total,
            accuracy,
            isMastery,
            consecutiveProgress: progress.masteryProgress,
            phaseComplete: useProgressStore.getState().phase4Complete,
        });

        setGameState('SUMMARY');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>PHASE 4: BETTING</Text>
            </View>

            <View style={styles.content}>

                {gameState === 'PLAYING' && (
                    <>
                        {/* Score/Streak */}
                        <View style={styles.streakContainer}>
                            <Text style={styles.streakLabel}>PROGRESS</Text>
                            <Text style={styles.streakValue}>{score.total} / {MASTERY_REQUIREMENTS.PHASE_4.BETS_PER_SESSION}</Text>
                        </View>

                        {/* Scenario */}
                        <View style={styles.scenarioBox}>
                            <Text style={styles.scenarioLabel}>TRUE COUNT IS</Text>
                            <Text style={[styles.scenarioValue, trueCount > 0 ? styles.pos : styles.neutral]}>
                                {trueCount > 0 ? `+${trueCount}` : trueCount}
                            </Text>
                            <Text style={styles.instruction}>Identify correct bet size</Text>
                        </View>

                        {/* Feedback */}
                        <View style={styles.feedbackContainer}>
                            {feedback === 'CORRECT' && <Text style={[styles.feedbackText, styles.pos]}>CORRECT: {lastAnswer} UNITS</Text>}
                            {feedback === 'WRONG' && <Text style={[styles.feedbackText, styles.neg]}>INCORRECT: {lastAnswer} UNITS</Text>}
                        </View>

                        {/* Controls */}
                        <View style={styles.controls}>
                            <View style={styles.row}>
                                <BetButton units={1} onPress={() => handleGuess(1)} />
                                <BetButton units={2} onPress={() => handleGuess(2)} />
                            </View>
                            <View style={styles.row}>
                                <BetButton units={4} onPress={() => handleGuess(4)} />
                                <BetButton units={8} onPress={() => handleGuess(8)} />
                            </View>
                            <View style={styles.row}>
                                <BetButton units={10} label="2 Hands" onPress={() => handleGuess(10)} disabled />
                            </View>
                        </View>
                    </>
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
                                <Text style={styles.statLabel}>SCORE</Text>
                                <Text style={[styles.statValue, sessionSummary.isMastery && styles.masteryText]}>
                                    {sessionSummary.correctChecks}/{sessionSummary.totalChecks}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.progressBar}>
                            <Text style={styles.progressLabel}>
                                STREAK: {sessionSummary.phaseComplete ? MASTERY_REQUIREMENTS.PHASE_4.CONSECUTIVE_SESSIONS : Math.round(sessionSummary.consecutiveProgress * MASTERY_REQUIREMENTS.PHASE_4.CONSECUTIVE_SESSIONS)} / {MASTERY_REQUIREMENTS.PHASE_4.CONSECUTIVE_SESSIONS} QUALIFYING SESSIONS
                            </Text>
                            <View style={styles.progressBarBg}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        { width: `${sessionSummary.phaseComplete ? 100 : sessionSummary.consecutiveProgress * 100}%` }
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressHint}>
                                {sessionSummary.phaseComplete
                                    ? '🏆 PHASE 4 COMPLETE! PHASE 5 UNLOCKED!'
                                    : `NEED ${MASTERY_REQUIREMENTS.PHASE_4.CONSECUTIVE_SESSIONS} SESSIONS AT ${MASTERY_REQUIREMENTS.PHASE_4.REQUIRED_ACCURACY * 100}%`
                                }
                            </Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={[styles.submitBtn, styles.secondaryBtn, styles.rowBtn, { flex: 1 }]}
                            >
                                <Text style={[styles.submitText, styles.secondaryBtnText]}>HOME</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={startDemo} style={[styles.submitBtn, styles.rowBtn, { flex: 1 }]}>
                                <Text style={styles.submitText}>TRY AGAIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </View>

            <PhaseIntroModal
                visible={showIntro}
                phase="phase4"
                onStart={() => setShowIntro(false)}
            />
        </SafeAreaView>
    );
};

const BetButton = ({ units, label, onPress, disabled }: { units: number, label?: string, onPress: () => void, disabled?: boolean }) => (
    <TouchableOpacity
        style={[styles.betBtn, disabled && styles.btnDisabled]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={styles.betBtnText}>{label || `${units} UNIT${units > 1 ? 'S' : ''}`}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    backText: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '300',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    streakLabel: {
        color: colors.textTertiary,
        fontSize: 10,
        letterSpacing: 2,
        fontWeight: '900',
        marginBottom: 8,
    },
    streakValue: {
        color: colors.textPrimary,
        fontSize: 48,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    streakHot: {
        color: colors.primary,
        textShadowColor: colors.primary,
        textShadowRadius: 10,
    },
    scenarioBox: {
        alignItems: 'center',
        marginBottom: 32,
        width: '100%',
        padding: 40,
        backgroundColor: colors.surface,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    scenarioLabel: {
        color: colors.textTertiary,
        marginBottom: 16,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
    scenarioValue: {
        fontSize: 72,
        fontWeight: '900',
        marginBottom: 24,
        fontVariant: ['tabular-nums'],
    },
    instruction: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    pos: { color: colors.success },
    neg: { color: colors.error },
    neutral: { color: colors.textPrimary },
    feedbackContainer: {
        height: 60,
        marginBottom: 24,
        justifyContent: 'center',
    },
    feedbackText: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
        textAlign: 'center',
    },
    controls: {
        width: '100%',
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
    },
    betBtn: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        paddingVertical: 24,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnDisabled: {
        borderColor: colors.border,
        opacity: 0.3,
    },
    betBtnText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1.5,
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
    submitBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    submitText: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    secondaryBtn: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
    },
    secondaryBtnText: {
        color: colors.textSecondary,
    },
    rowBtn: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
});
