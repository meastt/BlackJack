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
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>True Count Drill</Text>
                <Text style={styles.streak}>Streak: {streak}</Text>
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
                    {feedback === 'CORRECT' && <Text style={[styles.feedback, styles.pos]}>Correct!</Text>}
                    {feedback === 'WRONG' && <Text style={[styles.feedback, styles.neg]}>Try Again</Text>}
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
    },
    backButton: {
        padding: 8,
    },
    backText: {
        color: colors.accentBlue,
        fontSize: 16,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    streak: {
        color: colors.accentGreen,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    visualRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
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
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: 10,
    },
    statValue: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    divider: {
        width: 1,
        height: 60,
        backgroundColor: colors.glassBorder,
    },
    equation: {
        fontSize: 18,
        color: colors.textMuted,
        marginBottom: 40,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    feedbackContainer: {
        height: 40,
        marginBottom: 20,
    },
    feedback: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    pos: { color: colors.accentGreen },
    neg: { color: colors.incorrect },
    neutral: { color: colors.textPrimary },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center',
        width: '100%',
    },
    optionBtn: {
        width: '40%',
        height: 80,
        backgroundColor: colors.surfaceLight,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    btnText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
});
