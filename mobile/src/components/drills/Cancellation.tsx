import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Shoe, Card, Rank } from '@card-counter-ai/shared';
import { useSimState } from '../../store/SimState';
import { Card as CardComponent } from '../Card';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';

const TIMEOUT_MS = 2000;

export const Cancellation: React.FC = () => {
    const shoe = useRef(new Shoe(6)).current;
    const { incrementSpeedErrors, incrementLogicErrors } = useSimState();

    const [pair, setPair] = useState<Card[]>([]);
    const [timeLeft, setTimeLeft] = useState(TIMEOUT_MS);
    const [gameState, setGameState] = useState<'IDLE' | 'ACTIVE' | 'FEEDBACK'>('IDLE');
    const [feedback, setFeedback] = useState('');
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        startNewRound();
        return () => stopTimer();
    }, []);

    const stopTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const startNewRound = () => {
        setGameState('IDLE');
        setFeedback('');
        
        // Ensure cards
        if (shoe.getCardsRemaining() < 4) {
            shoe.reset();
        }

        const c1 = shoe.pop();
        const c2 = shoe.pop();

        if (c1 && c2) {
            setPair([c1, c2]);
            setGameState('ACTIVE');
            startTimeRef.current = Date.now();
            
            // Start Timer
            stopTimer();
            timerRef.current = setTimeout(() => {
                handleTimeout();
            }, TIMEOUT_MS);
        }
    };

    const handleTimeout = () => {
        setFeedback('Too Slow!');
        setGameState('FEEDBACK');
        incrementSpeedErrors();
        setTimeout(startNewRound, 1500);
    };

    const getCardValue = (rank: Rank): number => {
        if ([Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX].includes(rank)) return 1;
        if ([Rank.SEVEN, Rank.EIGHT, Rank.NINE].includes(rank)) return 0;
        return -1;
    };

    const handleInput = (inputVal: number) => {
        stopTimer();
        if (gameState !== 'ACTIVE') return;

        const val1 = getCardValue(pair[0].rank);
        const val2 = getCardValue(pair[1].rank);
        const correctNet = val1 + val2;

        if (inputVal === correctNet) {
            setFeedback('Correct!');
            setGameState('FEEDBACK');
            // Immediate next round for speed? Or short delay?
            setTimeout(startNewRound, 500);
        } else {
            setFeedback(`Wrong! Net was ${correctNet > 0 ? '+' : ''}${correctNet}`);
            setGameState('FEEDBACK');
            incrementLogicErrors(); // Wrong math is a logic error
            setTimeout(startNewRound, 1500);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Cancellation Drill</Text>
                <Text style={styles.subtitle}>Net Count?</Text>
            </View>

            <View style={styles.cardsContainer}>
                {pair.map(card => (
                    <CardComponent key={card.id} card={card} size="large" />
                ))}
            </View>

            <View style={styles.feedbackContainer}>
                <Text style={[
                    styles.feedbackText,
                    feedback === 'Correct!' ? styles.success : styles.error
                ]}>{feedback}</Text>
            </View>

            <View style={styles.controls}>
                {[-2, -1, 0, 1, 2].map(val => (
                    <TouchableOpacity
                        key={val}
                        style={styles.button}
                        onPress={() => handleInput(val)}
                    >
                        <Text style={styles.buttonText}>{val > 0 ? `+${val}` : val}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        marginTop: 40,
        alignItems: 'center',
    },
    title: {
        ...fontStyles.h2,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 8,
    },
    cardsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    feedbackContainer: {
        height: 50,
        justifyContent: 'center',
    },
    feedbackText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    success: {
        color: colors.accentGreen,
    },
    error: {
        color: colors.accentRed || '#FF4444',
    },
    controls: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 50,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
});
