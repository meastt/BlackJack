import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { HapticEngine } from '../../utils/HapticEngine';
import { HI_LO_BETTING_STRATEGY } from '@card-counter-ai/shared';

export const Phase4Betting: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [trueCount, setTrueCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
    const [lastAnswer, setLastAnswer] = useState(0);

    useEffect(() => {
        nextScenario();
    }, []);

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
        const correctBet = getCorrectBet(trueCount);
        setLastAnswer(correctBet);

        if (betUnit === correctBet) {
            setFeedback('CORRECT');
            setStreak(s => s + 1);
            HapticEngine.triggerSuccess();
            setTimeout(nextScenario, 1000);
        } else {
            setFeedback('WRONG');
            setStreak(0);
            HapticEngine.triggerError();
        }
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

                {/* Score/Streak */}
                <View style={styles.streakContainer}>
                    <Text style={styles.streakLabel}>STREAK</Text>
                    <Text style={[styles.streakValue, streak > 2 && styles.streakHot]}>{streak}</Text>
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
                        {/* 2 Hands logic implies spread, keeping simple for now */}
                    </View>
                </View>

            </View>
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
    }
});
