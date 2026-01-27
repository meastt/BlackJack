import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { DiscardTray } from '../../components/drills/DiscardTray';
import { HapticEngine } from '../../utils/HapticEngine';

export const Phase3TrueCount: React.FC<{ navigation: any }> = ({ navigation }) => {
    const TOTAL_DECKS = 6;
    const [runningCount, setRunningCount] = useState(0);
    const [decksDiscarded, setDecksDiscarded] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');

    // Stats for "Mastery"
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        startNewRound();
    }, []);

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
        const correctTC = calculateTrueCount(runningCount, TOTAL_DECKS - decksDiscarded);

        if (guess === correctTC) {
            setFeedback('CORRECT');
            HapticEngine.triggerSuccess();
            setStreak(s => s + 1);
            setTimeout(startNewRound, 800);
        } else {
            setFeedback('WRONG');
            HapticEngine.triggerError();
            setStreak(0);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>TRUE COUNT DRILL</Text>
                <View style={styles.streakBadge}>
                    <Text style={styles.streakLabel}>STREAK</Text>
                    <Text style={styles.streakValue}>{streak}</Text>
                </View>
            </View>

            <View style={styles.content}>

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
                            style={styles.optionBtn}
                            onPress={() => handleGuess(opt)}
                        >
                            <Text style={styles.btnText}>{opt > 0 ? `+${opt}` : opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
    btnText: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.primary,
        fontVariant: ['tabular-nums'],
    },
});
