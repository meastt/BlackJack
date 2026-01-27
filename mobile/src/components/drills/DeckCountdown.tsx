import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Shoe, Card } from '@card-counter-ai/shared';
import { Card as CardComponent } from '../Card';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { HapticEngine } from '../../utils/HapticEngine';
import { useSimState } from '../../store/SimState';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const DeckCountdown: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [shoe] = useState(() => new Shoe(1)); // Single deck for countdown
    const [currentCard, setCurrentCard] = useState<Card | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [cardsDealt, setCardsDealt] = useState(0);

    // For final verification
    const [userCount, setUserCount] = useState<number>(0);
    const [showResult, setShowResult] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startDrill = () => {
        shoe.reset();
        setCurrentCard(null);
        setCardsDealt(0);
        setIsFinished(false);
        setShowResult(false);
        setUserCount(0);

        setIsActive(true);
        setStartTime(Date.now());

        // Initial card
        dealNext();

        timerRef.current = setInterval(() => {
            setElapsedTime((Date.now() - startTime) / 1000);
        }, 100);
    };

    const stopDrill = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsActive(false);
        setIsFinished(true);
        setElapsedTime((Date.now() - startTime) / 1000);
    };

    const dealNext = () => {
        const card = shoe.pop();
        if (card) {
            setCurrentCard(card);
            setCardsDealt(prev => prev + 1);
            HapticEngine.triggerSelection();
        } else {
            // No more cards
            stopDrill();
        }
    };

    const handleTap = () => {
        if (!isActive && !isFinished) {
            startDrill();
        } else if (isActive) {
            dealNext();
        }
    };

    const checkResult = () => {
        const actualCount = shoe.getRunningCount(); // Should be 0 for full deck
        setShowResult(true);
        if (userCount === actualCount) {
            HapticEngine.triggerSuccess();
        } else {
            HapticEngine.triggerError();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Deck Countdown</Text>
            </View>

            <TouchableOpacity
                style={styles.gameArea}
                activeOpacity={1}
                onPress={handleTap}
            >
                {!isActive && !isFinished ? (
                    <View style={styles.centerPrompt}>
                        <Text style={styles.promptText}>Tap to Start</Text>
                        <Text style={styles.subPrompt}>Count down 1 full deck as fast as you can.</Text>
                    </View>
                ) : (
                    <View style={styles.cardContainer}>
                        {currentCard && <CardComponent card={currentCard} size="large" />}
                    </View>
                )}

                {isActive && (
                    <View style={styles.statsOverlay}>
                        <Text style={styles.timerText}>{elapsedTime.toFixed(1)}s</Text>
                        <Text style={styles.counterText}>{cardsDealt} / 52</Text>
                    </View>
                )}
            </TouchableOpacity>

            {isFinished && !showResult && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Done!</Text>
                    <Text style={styles.resultTime}>Time: {elapsedTime.toFixed(2)}s</Text>

                    <Text style={styles.inputPrompt}>What was the final count?</Text>
                    <View style={styles.inputRow}>
                        {[-2, -1, 0, 1, 2].map(val => (
                            <TouchableOpacity
                                key={val}
                                style={[
                                    styles.inputButton,
                                    userCount === val && styles.inputButtonSelected
                                ]}
                                onPress={() => setUserCount(val)}
                            >
                                <Text style={[
                                    styles.inputText,
                                    userCount === val && styles.inputTextSelected
                                ]}>{val}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.checkButton} onPress={checkResult}>
                        <Text style={styles.checkButtonText}>Check Count</Text>
                    </TouchableOpacity>
                </View>
            )}

            {showResult && (
                <View style={styles.resultContainer}>
                    <Text style={[styles.resultTitle, { color: userCount === 0 ? colors.accentGreen : colors.incorrect }]}>
                        {userCount === 0 ? 'Correct!' : 'Incorrect'}
                    </Text>
                    <Text style={styles.resultTime}>Target: 0</Text>
                    <Text style={styles.resultTime}>Your Time: {elapsedTime.toFixed(2)}s</Text>

                    <TouchableOpacity style={styles.restartButton} onPress={startDrill}>
                        <Text style={styles.restartText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        zIndex: 10,
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
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerPrompt: {
        alignItems: 'center',
    },
    promptText: {
        color: colors.accent,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subPrompt: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    cardContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    statsOverlay: {
        position: 'absolute',
        top: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    timerText: {
        color: colors.textPrimary,
        fontSize: 24,
        fontVariant: ['tabular-nums'],
    },
    counterText: {
        color: colors.textSecondary,
        fontSize: 24,
    },
    resultContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 20,
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 10,
    },
    resultTime: {
        fontSize: 18,
        color: colors.textSecondary,
        marginBottom: 20,
    },
    inputPrompt: {
        color: colors.textPrimary,
        fontSize: 16,
        marginBottom: 15,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    inputButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    inputButtonSelected: {
        backgroundColor: colors.accentBlue,
        borderColor: colors.accentBlue,
    },
    inputText: {
        fontSize: 20,
        color: colors.textPrimary,
    },
    inputTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    checkButton: {
        backgroundColor: colors.accentGreen,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    checkButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    restartButton: {
        backgroundColor: colors.surfaceLight,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    restartText: {
        color: colors.textPrimary,
        fontSize: 18,
    }
});
