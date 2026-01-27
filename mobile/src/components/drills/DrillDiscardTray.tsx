import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { DiscardTray } from './DiscardTray';
import { HapticEngine } from '../../utils/HapticEngine';

export const DrillDiscardTray: React.FC<{ navigation: any }> = ({ navigation }) => {
    const TOTAL_DECKS = 6;
    const [targetDiscards, setTargetDiscards] = useState(0);
    const [options, setOptions] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');

    useEffect(() => {
        startNewRound();
    }, []);

    const startNewRound = () => {
        setFeedback('IDLE');
        // Generate random discarded amount (0.5 to 5.5 step 0.5)
        // Avoid 0 or Full just to keep it interesting? No, include them.
        const steps = (TOTAL_DECKS * 2); // 12 steps (0, 0.5, 1.0 ... 6.0)
        const randomStep = Math.floor(Math.random() * steps);
        const actualDiscards = randomStep * 0.5;

        setTargetDiscards(actualDiscards);
        generateOptions(actualDiscards);
    };

    const generateOptions = (correct: number) => {
        // Generate 3 wrong options around the correct answer
        const opts = new Set<number>();
        opts.add(correct); // Decks Discarded
        // BUT wait - question is usually "Decks Remaining" for True Count
        // or "Decks Discarded"?
        // Simulating the thought process: Look at discards -> Calc Remaining.
        // Let's ask "Decks Remaining?" as it's the direct input for TC.

        // Correct Answer is: (TOTAL - discards)

        while (opts.size < 4) {
            const offset = (Math.floor(Math.random() * 5) - 2) * 0.5; // -1, -0.5, 0, 0.5, 1
            const val = Math.max(0, Math.min(TOTAL_DECKS, correct + offset));
            opts.add(val);
        }

        // Convert discard stats to "Remaining" for the buttons?
        // Or keep it simple: "Estimate Discards"?
        // NEW_PLAN says: "estimate 'Decks Remaining' to the nearest half-deck"

        // So visuals show Discards. Buttons should be (TOTAL - Discards).

        // Let's store options as "Remaining" values.
    };

    // RETHINK: 
    // State: targetDiscards (what is shown).
    // Correct Answer: TOTAL_DECKS - targetDiscards.

    // Let's regenerate generateOptions properly.
    const getRemaining = (discards: number) => TOTAL_DECKS - discards;

    const optionsList = () => {
        const correctRemaining = getRemaining(targetDiscards);
        const rawOptions = new Set<number>();
        rawOptions.add(correctRemaining);

        while (rawOptions.size < 4) {
            const delta = (Math.floor(Math.random() * 7) - 3) * 0.5; // -1.5 to +1.5
            const val = correctRemaining + delta;
            if (val >= 0 && val <= TOTAL_DECKS && val !== correctRemaining) {
                rawOptions.add(val);
            }
        }
        return Array.from(rawOptions).sort((a, b) => a - b);
    };

    const [currentOptions, setCurrentOptions] = useState<number[]>([]);

    useEffect(() => {
        if (targetDiscards >= 0) {
            setCurrentOptions(optionsList());
        }
    }, [targetDiscards]);

    const handleGuess = (guess: number) => {
        const correct = getRemaining(targetDiscards);
        if (guess === correct) {
            setFeedback('CORRECT');
            HapticEngine.triggerSuccess();
            setTimeout(startNewRound, 1000);
        } else {
            setFeedback('WRONG');
            HapticEngine.triggerError();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Deck Estimation</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.prompt}>How many decks remaining?</Text>

                <View style={styles.trayContainer}>
                    <DiscardTray
                        totalDecks={TOTAL_DECKS}
                        decksDiscarded={targetDiscards}
                        scale={1.5}
                    />
                    <Text style={styles.label}>Discard Tray ({TOTAL_DECKS} Decks Max)</Text>
                </View>

                {feedback === 'WRONG' && (
                    <Text style={styles.errorText}>Try Again</Text>
                )}

                {feedback === 'CORRECT' && (
                    <Text style={styles.successText}>Correct!</Text>
                )}

                <View style={styles.optionsGrid}>
                    {currentOptions.map(opt => (
                        <TouchableOpacity
                            key={opt}
                            style={styles.optionButton}
                            onPress={() => handleGuess(opt)}
                        >
                            <Text style={styles.optionText}>{opt}</Text>
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
    },
    backButton: {
        marginRight: 20,
    },
    backText: {
        color: colors.accentBlue,
        fontSize: 16,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    prompt: {
        fontSize: 24,
        color: colors.textPrimary,
        marginBottom: 40,
        fontWeight: 'bold',
    },
    trayContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    label: {
        marginTop: 10,
        color: colors.textMuted,
        fontSize: 14,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
        width: '100%',
    },
    optionButton: {
        width: '40%',
        backgroundColor: colors.surfaceLight,
        padding: 20,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    optionText: {
        fontSize: 24,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    errorText: {
        color: colors.incorrect,
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    successText: {
        color: colors.accentGreen,
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
    }
});
