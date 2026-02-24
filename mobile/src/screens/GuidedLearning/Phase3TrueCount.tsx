import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { DiscardTray } from '../../components/drills/DiscardTray';
import { HapticEngine } from '../../utils/HapticEngine';
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


export const Phase3TrueCount: React.FC<{ navigation: any }> = ({ navigation }) => {
    const TOTAL_DECKS = 6;
    const [runningCount, setRunningCount] = useState(0);
    const [decksDiscarded, setDecksDiscarded] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');

    // Progression State
    const [gameState, setGameState] = useState<'PLAYING' | 'SUMMARY'>('PLAYING');
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [startTime, setStartTime] = useState(Date.now());
    const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
    const [showIntro, setShowIntro] = useState(true);

    const { phase3Complete, addSessionResult, updateStreak, getPhaseProgress } = useProgressStore();

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
        startNewRound();
    };

    const startNewRound = () => {
        setFeedback('IDLE');

        // 1. Generate a realistic Discard Amount (0.5 to 5.0)
        // We avoid 0 discards (6 remaining) and 5.5 discards (0.5 remaining) to keep math standard initially?
        // Let's stick to half-deck increments.
        const discardSteps = Math.floor(Math.random() * 10); // 0 to 9
        const discards = (discardSteps * 0.5) + 0.5; // 0.5 to 5.0
        setDecksDiscarded(discards);

        const decksRemaining = TOTAL_DECKS - discards;

        // 2. Generate a Running Count that makes sense (not too wild)
        // Usually within -20 to +20 depending on depth.
        // To ensure integer/clean(ish) TC for early learning? 
        // Real life is messy (flooring), but maybe we start with "clean division" examples?
        // Let's try to generate "Nice" numbers 70% of the time, "Messy" numbers 30%.

        let rc = 0;
        const isNice = Math.random() > 0.3;

        if (isNice) {
            // Generate a TC between -5 and +5
            const targetTC = Math.floor(Math.random() * 11) - 5;
            rc = Math.round(targetTC * decksRemaining);
        } else {
            // Random RC
            rc = Math.floor(Math.random() * 30) - 15;
        }
        setRunningCount(rc);

        generateOptions(rc, decksRemaining);
    };

    const calculateTrueCount = (rc: number, remaining: number) => {
        // Standard flooring logic used in blackjack
        // TC = RC / Remaining. Truncate toward zero? Or floor?
        // Most common: Floor (always round down). Some use simple rounding.
        // Let's use Math.floor(rc / remaining) for positive, but be careful with negative.
        // Actually, the app should probably teach "Flooring".
        // Example: RC +5, 2 Decks => +2.5 => +2.

        return Math.floor(rc / remaining);
    };

    const generateOptions = (rc: number, remaining: number) => {
        const correctTC = calculateTrueCount(rc, remaining);

        const opts = new Set<number>();
        opts.add(correctTC);

        while (opts.size < 4) {
            const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const val = correctTC + offset;
            if (val !== correctTC) {
                opts.add(val);
            }
        }

        setOptions(Array.from(opts).sort((a, b) => a - b));
    };

    const handleGuess = (guess: number) => {
        if (feedback !== 'IDLE') return; // Prevent double taps

        const correctTC = calculateTrueCount(runningCount, TOTAL_DECKS - decksDiscarded);
        const isCorrect = guess === correctTC;

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

        if (newScore.total >= MASTERY_REQUIREMENTS.PHASE_3.CHECKS_PER_SESSION) {
            setTimeout(() => finishSession(newScore), 800);
        } else {
            // Keep going if wrong so they can learn, or skip?
            // Usually we auto-advance on both to keep the drill moving.
            setTimeout(startNewRound, 1000);
        }
    };

    const finishSession = (finalScore: { correct: number, total: number }) => {
        const timeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        const accuracy = finalScore.total > 0 ? finalScore.correct / finalScore.total : 0;

        addSessionResult('phase3', {
            phase: 'phase3',
            accuracy,
            cardsCompleted: finalScore.total,
            timeInSeconds,
            timestamp: Date.now(),
        });

        updateStreak();

        const progress = getPhaseProgress(3);
        const isMastery = accuracy >= MASTERY_REQUIREMENTS.PHASE_3.REQUIRED_ACCURACY;

        setSessionSummary({
            correctChecks: finalScore.correct,
            totalChecks: finalScore.total,
            accuracy,
            isMastery,
            consecutiveProgress: progress.masteryProgress,
            phaseComplete: useProgressStore.getState().phase3Complete,
        });

        setGameState('SUMMARY');
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>TRUE COUNT DRILL</Text>
                <View style={[styles.streakBadge, { opacity: 0 }]}>
                    <Text style={styles.streakLabel}>STREAK</Text>
                    <Text style={styles.streakValue}>0</Text>
                </View>
            </View>

            <View style={styles.content}>

                {gameState === 'PLAYING' && (
                    <>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressText}>
                                CHECK {score.total + 1} OF {MASTERY_REQUIREMENTS.PHASE_3.CHECKS_PER_SESSION}
                            </Text>
                        </View>

                        {/* The Visuals */}
                        <View style={styles.visualRow}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Running Count</Text>
                                <Text style={[
                                    styles.statValue,
                                    runningCount > 0 ? styles.pos : (runningCount < 0 ? styles.neg : styles.neutral)
                                ]}>
                                    {runningCount > 0 ? `+${runningCount}` : runningCount}
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.trayBox}>
                                <DiscardTray
                                    totalDecks={TOTAL_DECKS}
                                    decksDiscarded={decksDiscarded}
                                    scale={0.8}
                                />
                                <Text style={styles.statLabel}>Decks Remaining: {TOTAL_DECKS - decksDiscarded}</Text>
                            </View>
                        </View>

                        <Text style={styles.equation}>
                            TC = ⌊ {runningCount} / {TOTAL_DECKS - decksDiscarded} ⌋
                        </Text>

                        {/* Feedback Area */}
                        <View style={styles.feedbackContainer}>
                            {feedback === 'CORRECT' && <Text style={[styles.feedback, styles.pos]}>CORRECT</Text>}
                            {feedback === 'WRONG' && <Text style={[styles.feedback, styles.neg]}>TRY AGAIN</Text>}
                        </View>

                        {/* Input Grid */}
                        <View style={styles.grid}>
                            {options.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.optionBtn,
                                        feedback !== 'IDLE' && opt === calculateTrueCount(runningCount, TOTAL_DECKS - decksDiscarded) && styles.optionBtnCorrect,
                                        feedback === 'WRONG' && opt !== calculateTrueCount(runningCount, TOTAL_DECKS - decksDiscarded) && styles.optionBtnWrong,
                                    ]}
                                    onPress={() => handleGuess(opt)}
                                    disabled={feedback !== 'IDLE'}
                                >
                                    <Text style={[
                                        styles.btnText,
                                        feedback !== 'IDLE' && opt === calculateTrueCount(runningCount, TOTAL_DECKS - decksDiscarded) && { color: colors.success },
                                        feedback === 'WRONG' && opt !== calculateTrueCount(runningCount, TOTAL_DECKS - decksDiscarded) && { color: colors.textTertiary }
                                    ]}>{opt > 0 ? `+${opt}` : opt}</Text>
                                </TouchableOpacity>
                            ))}
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
                                STREAK: {sessionSummary.phaseComplete ? MASTERY_REQUIREMENTS.PHASE_3.CONSECUTIVE_SESSIONS : Math.round(sessionSummary.consecutiveProgress * MASTERY_REQUIREMENTS.PHASE_3.CONSECUTIVE_SESSIONS)} / {MASTERY_REQUIREMENTS.PHASE_3.CONSECUTIVE_SESSIONS} QUALIFYING SESSIONS
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
                                    ? '🏆 PHASE 3 COMPLETE! PHASE 4 UNLOCKED!'
                                    : `NEED ${MASTERY_REQUIREMENTS.PHASE_3.CONSECUTIVE_SESSIONS} SESSIONS AT ${MASTERY_REQUIREMENTS.PHASE_3.REQUIRED_ACCURACY * 100}%`
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
                phase="phase3"
                onStart={() => setShowIntro(false)}
            />
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    streakBadge: {
        alignItems: 'center',
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    streakLabel: {
        fontSize: 8,
        color: colors.textTertiary,
        fontWeight: '900',
        letterSpacing: 1,
    },
    streakValue: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '900',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    visualRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
        backgroundColor: colors.surface,
        paddingVertical: 32,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    trayBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        color: colors.textTertiary,
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 56,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    divider: {
        width: 1,
        height: 80,
        backgroundColor: colors.border,
    },
    equation: {
        fontSize: 18,
        color: colors.textSecondary,
        marginBottom: 48,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        letterSpacing: 1,
    },
    feedbackContainer: {
        height: 60,
        marginBottom: 20,
        justifyContent: 'center',
    },
    feedback: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 4,
        textAlign: 'center',
    },
    pos: { color: colors.success },
    neg: { color: colors.error },
    neutral: { color: colors.textPrimary },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
        width: '100%',
    },
    optionBtn: {
        width: '45%',
        height: 100,
        backgroundColor: 'transparent',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
    },
    optionBtnCorrect: {
        borderColor: colors.success,
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
    },
    optionBtnWrong: {
        borderColor: colors.border,
        opacity: 0.5,
    },
    btnText: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.primary,
        fontVariant: ['tabular-nums'],
    },
    progressHeader: {
        marginBottom: 20,
    },
    progressText: {
        color: colors.textTertiary,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
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
