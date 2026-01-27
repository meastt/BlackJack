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
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Phase 4: Betting</Text>
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
                    <Text style={styles.instruction}>How many units shoud you bet?</Text>
                </View>

                {/* Feedback */}
                <View style={styles.feedbackContainer}>
                    {feedback === 'CORRECT' && <Text style={[styles.feedbackText, styles.pos]}>Perfect! Bet {lastAnswer} units.</Text>}
                    {feedback === 'WRONG' && <Text style={[styles.feedbackText, styles.neg]}>Too {lastAnswer > 1 ? 'low' : 'high'}. Bet {lastAnswer} units.</Text>}
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
        <Text style={styles.betBtnText}>{label || `${units} Unit${units > 1 ? 's' : ''}`}</Text>
        <Text style={styles.betSubtext}>{disabled ? '(Coming Soon)' : ''}</Text>
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
    },
    backButton: { marginRight: 20 },
    backText: { color: colors.accentBlue, fontSize: 16 },
    title: { color: colors.textPrimary, fontSize: 20, fontWeight: 'bold' },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    streakLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    streakValue: {
        color: colors.textPrimary,
        fontSize: 36,
        fontWeight: 'bold',
    },
    streakHot: {
        color: colors.accent,
        textShadowColor: colors.glowPink,
        textShadowRadius: 10,
    },
    scenarioBox: {
        alignItems: 'center',
        marginBottom: 40,
        width: '100%',
        padding: 30,
        backgroundColor: colors.surfaceLight,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    scenarioLabel: {
        color: colors.textMuted,
        marginBottom: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
    scenarioValue: {
        fontSize: 64,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    instruction: {
        color: colors.textSecondary,
        fontSize: 18,
    },
    pos: { color: colors.accentGreen },
    neg: { color: colors.incorrect },
    neutral: { color: colors.textPrimary },
    feedbackContainer: {
        height: 40,
        marginBottom: 20,
    },
    feedbackText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    controls: {
        width: '100%',
        gap: 15,
    },
    row: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
    },
    betBtn: {
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.accentBlue,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        minHeight: 80,
        justifyContent: 'center',
    },
    btnDisabled: {
        borderColor: colors.border,
        opacity: 0.5,
    },
    betBtnText: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    betSubtext: {
        color: colors.textSecondary,
        fontSize: 10,
        marginTop: 4,
    }
});
