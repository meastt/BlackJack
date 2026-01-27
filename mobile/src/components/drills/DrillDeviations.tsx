import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { Card as CardComponent } from '../Card';
import { Card, Rank, Suit } from '@card-counter-ai/shared';
import { HapticEngine } from '../../utils/HapticEngine';

// Simplified Illustrious 18 Rule Set (Top 5 for MVP)
// Format: { id, playerHand, dealerUp, threshold, trigger: 'TC >= X', correctMove: 'STAND', basicStrategy: 'HIT' }
const DEVIATIONS = [
    {
        id: 'ins',
        name: 'Insurance',
        player: 'Any',
        dealer: 'Ace',
        tc: 3,
        rule: 'Take Insurance if TC >= +3',
        correctMove: 'INSURANCE',
        wrongMove: 'NO_INSURANCE'
    },
    {
        id: '16v10',
        name: '16 vs 10',
        player: '16',
        dealer: '10',
        tc: 0,
        rule: 'Stand if TC >= 0',
        correctMove: 'STAND',
        wrongMove: 'HIT'
    },
    {
        id: '15v10',
        name: '15 vs 10',
        player: '15',
        dealer: '10',
        tc: 4,
        rule: 'Stand if TC >= +4',
        correctMove: 'STAND',
        wrongMove: 'HIT'
    },
    {
        id: 'TTv5',
        name: '10,10 vs 5',
        player: '20',
        dealer: '5',
        tc: 5,
        rule: 'Split 10s if TC >= +5',
        correctMove: 'SPLIT',
        wrongMove: 'STAND'
    },
    {
        id: 'TTv6',
        name: '10,10 vs 6',
        player: '20',
        dealer: '6',
        tc: 4,
        rule: 'Split 10s if TC >= +4',
        correctMove: 'SPLIT',
        wrongMove: 'STAND'
    }
];

export const DrillDeviations: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [currentScenario, setCurrentScenario] = useState<any>(null);
    const [currentTC, setCurrentTC] = useState(0);
    const [fakePlayerCards, setFakePlayerCards] = useState<Card[]>([]);
    const [fakeDealerCard, setFakeDealerCard] = useState<Card | null>(null);
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        nextScenario();
    }, []);

    const nextScenario = () => {
        setFeedback('IDLE');
        setExplanation('');

        // 1. Pick a random deviation rule
        const rule = DEVIATIONS[Math.floor(Math.random() * DEVIATIONS.length)];
        setCurrentScenario(rule);

        // 2. Generate a TC that is EITHER above or below the threshold
        // 50/50 chance to be a "Deviation Situation" or "Basic Strategy Situation"
        const isDeviationActive = Math.random() > 0.5;

        let generatedTC = 0;
        if (isDeviationActive) {
            // Generate TC >= rule.tc
            generatedTC = rule.tc + Math.floor(Math.random() * 3); // +0, +1, +2
        } else {
            // Generate TC < rule.tc
            generatedTC = rule.tc - 1 - Math.floor(Math.random() * 3); // -1 to -3
        }
        setCurrentTC(generatedTC);

        // 3. Generate Visual Cards
        generateCards(rule);
    };

    const generateCards = (rule: any) => {
        // Dealer
        let dealerRank = Rank.TEN;
        if (rule.dealer === 'Ace') dealerRank = Rank.ACE;
        if (rule.dealer === '5') dealerRank = Rank.FIVE;
        if (rule.dealer === '6') dealerRank = Rank.SIX;

        setFakeDealerCard({
            suit: Suit.SPADES,
            rank: dealerRank,
            id: 'dealer-1'
        });

        // Player
        if (rule.player === '16') {
            setFakePlayerCards([
                { suit: Suit.HEARTS, rank: Rank.TEN, id: 'p1' },
                { suit: Suit.CLUBS, rank: Rank.SIX, id: 'p2' }
            ]);
        } else if (rule.player === '15') {
            setFakePlayerCards([
                { suit: Suit.HEARTS, rank: Rank.TEN, id: 'p1' },
                { suit: Suit.CLUBS, rank: Rank.FIVE, id: 'p2' }
            ]);
        } else if (rule.player === '20') {
            setFakePlayerCards([
                { suit: Suit.HEARTS, rank: Rank.KING, id: 'p1' },
                { suit: Suit.DIAMONDS, rank: Rank.JACK, id: 'p2' }
            ]); // TJ actually
        } else if (rule.name === 'Insurance') {
            // Random hand for insurance
            setFakePlayerCards([
                { suit: Suit.HEARTS, rank: Rank.EIGHT, id: 'p1' },
                { suit: Suit.CLUBS, rank: Rank.NINE, id: 'p2' }
            ]);
        }
    };

    const handleAction = (action: string) => {
        if (!currentScenario) return;

        // Logic:
        // If TC >= threshold, we MUST do the "correctMove" (Deviation).
        // If TC < threshold, we MUST do the "wrongMove" (Basic Strategy).

        const isDeviationTime = currentTC >= currentScenario.tc;

        let expectedAction = '';
        if (isDeviationTime) {
            expectedAction = currentScenario.correctMove;
        } else {
            expectedAction = currentScenario.wrongMove;
        }

        if (action === expectedAction) {
            setFeedback('CORRECT');
            setExplanation('Correct! ' + (isDeviationTime ? `Deviation applies (${currentScenario.rule})` : 'Deviation does NOT apply (stick to Basic Strategy).'));
            HapticEngine.triggerSuccess();
            setTimeout(nextScenario, 1500);
        } else {
            setFeedback('WRONG');
            setExplanation(`Incorrect. ${isDeviationTime ? `You should deviate: ${currentScenario.rule}` : `TC is too low for deviation. Stick to Basic Strategy (${currentScenario.wrongMove}).`}`);
            HapticEngine.triggerError();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Illustrious 18</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* HUD */}
                <View style={styles.hud}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>True Count</Text>
                        <Text style={[styles.statValue, currentTC >= 0 ? styles.pos : styles.neg]}>
                            {currentTC > 0 ? `+${currentTC}` : currentTC}
                        </Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <Text style={styles.label}>Dealer</Text>
                    <View style={styles.cardRow}>
                        {fakeDealerCard && <CardComponent card={fakeDealerCard} />}
                    </View>

                    <View style={{ height: 40 }} />

                    <Text style={styles.label}>You</Text>
                    <View style={styles.cardRow}>
                        {fakePlayerCards.map((c, i) => (
                            <CardComponent key={i} card={c} />
                        ))}
                    </View>
                </View>

                {/* Feedback */}
                <View style={styles.feedbackContainer}>
                    {feedback === 'CORRECT' && <Text style={[styles.feedbackText, styles.pos]}>{explanation}</Text>}
                    {feedback === 'WRONG' && <Text style={[styles.feedbackText, styles.neg]}>{explanation}</Text>}
                    {feedback === 'IDLE' && <Text style={styles.instruction}>What is the correct move?</Text>}
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.btn, styles.hitBtn]} onPress={() => handleAction('HIT')}>
                            <Text style={styles.btnText}>HIT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.standBtn]} onPress={() => handleAction('STAND')}>
                            <Text style={styles.btnText}>STAND</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.btn, styles.splitBtn]} onPress={() => handleAction('SPLIT')}>
                            <Text style={styles.btnText}>SPLIT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.doubleBtn]} onPress={() => handleAction('DOUBLE')}>
                            <Text style={styles.btnText}>DOUBLE</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.btn, styles.insBtn]} onPress={() => handleAction('INSURANCE')}>
                        <Text style={styles.btnText}>INSURANCE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.insBtn]} onPress={() => handleAction('NO_INSURANCE')}>
                        <Text style={styles.btnText}>NO INSURANCE</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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
    backButton: { marginRight: 20 },
    backText: { color: colors.accentBlue, fontSize: 16 },
    title: { color: colors.textPrimary, fontSize: 20, fontWeight: 'bold' },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    hud: {
        marginBottom: 30,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        padding: 15,
        borderRadius: 12,
        minWidth: 100,
    },
    statLabel: { color: colors.textSecondary, marginBottom: 5 },
    statValue: { fontSize: 32, fontWeight: 'bold' },
    pos: { color: colors.accentGreen },
    neg: { color: colors.incorrect }, // Assuming this exists now
    table: {
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    label: { color: colors.textMuted, marginBottom: 10 },
    cardRow: {
        flexDirection: 'row',
        gap: 10,
    },
    feedbackContainer: {
        minHeight: 60,
        marginBottom: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    feedbackText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    instruction: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    controls: {
        width: '100%',
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    btn: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    btnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    hitBtn: { backgroundColor: colors.accentGreen },
    standBtn: { backgroundColor: colors.incorrect }, // Fallback
    splitBtn: { backgroundColor: colors.accentBlue },
    doubleBtn: { backgroundColor: colors.accentYellow },
    insBtn: { backgroundColor: colors.surfaceLight },
});
