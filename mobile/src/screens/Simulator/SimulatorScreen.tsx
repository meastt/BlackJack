import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { colors } from '../../theme/colors';
import { HeatMeter } from '../../components/simulator/HeatMeter';
import { DistractionLayer } from '../../components/simulator/DistractionLayer';
import { Card as CardComponent } from '../../components/Card';
import { Shoe } from '@card-counter-ai/shared';
import { Card } from '@card-counter-ai/shared';
import { BlackjackGameEngine } from '../../utils/BlackjackGameEngine';
import { useSimState } from '../../store/SimState';
import * as Haptics from 'expo-haptics';

type GamePhase = 'BETTING' | 'DEALING' | 'PLAYER_TURN' | 'DEALER_TURN' | 'RESOLUTION' | 'SHOE_SHUFFLE';

export const SimulatorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    // Global state
    const { setSuspicionLevel, updateChallengeStats } = useSimState();

    // Game state
    const [gamePhase, setGamePhase] = useState<GamePhase>('BETTING');
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [currentBet, setCurrentBet] = useState(10);
    const [bankroll, setBankroll] = useState(1000);
    const [startingBankroll] = useState(1000);

    // Session statistics
    const [sessionStats, setSessionStats] = useState({
        handsWon: 0,
        handsLost: 0,
        handsPushed: 0,
        biggestWin: 0,
        biggestLoss: 0,
        highestBankroll: 1000,
        lowestBankroll: 1000,
    });

    // Split hand state
    const [isSplitHand, setIsSplitHand] = useState(false);
    const [splitHands, setSplitHands] = useState<Card[][]>([]);
    const [activeHandIndex, setActiveHandIndex] = useState(0);
    const [splitBets, setSplitBets] = useState<number[]>([]);

    // Shoe and counting
    const shoeRef = useRef(new Shoe(6)); // 6-deck shoe
    const [runningCount, setRunningCount] = useState(0);
    const [trueCount, setTrueCount] = useState(0);
    const [handsPlayed, setHandsPlayed] = useState(0);

    // UI state
    const [resultMessage, setResultMessage] = useState('');
    const [isDistractionActive, setIsDistractionActive] = useState(false);
    const [showCountDisplay, setShowCountDisplay] = useState(true); // Learning mode

    // Count validation
    const [showCountCheck, setShowCountCheck] = useState(false);
    const [userInputRC, setUserInputRC] = useState('');
    const [userInputTC, setUserInputTC] = useState('');
    const [countAccuracy, setCountAccuracy] = useState<number[]>([]); // Track accuracy history

    // UI toggles
    const [showSessionStats, setShowSessionStats] = useState(false);

    const MIN_BET = 10;
    const MAX_BET = 200;

    // Calculate decks remaining from cards
    const getDecksRemaining = (): number => {
        const cardsRemaining = shoeRef.current.getCardsRemaining();
        return Math.max(0.5, cardsRemaining / 52);
    };

    // Update running and true count
    const updateCount = (card: Card) => {
        const shoe = shoeRef.current;
        const newRC = shoe.getRunningCount();
        const decksRemaining = getDecksRemaining();
        const newTC = Math.floor(newRC / decksRemaining);

        setRunningCount(newRC);
        setTrueCount(newTC);
    };

    // Start a new hand
    const startNewHand = () => {
        if (bankroll < currentBet) {
            setResultMessage('OUT OF MONEY! Game Over.');
            return;
        }

        const shoe = shoeRef.current;

        // Check if shoe needs shuffle
        if (shoe.getCardsRemaining() < 20) {
            setGamePhase('SHOE_SHUFFLE');
            shoe.reset();
            setRunningCount(0);
            setTrueCount(0);
            setResultMessage('Shuffling shoe...');
            setTimeout(() => {
                setResultMessage('');
                startNewHand();
            }, 1500);
            return;
        }

        // Deduct bet
        setBankroll(prev => prev - currentBet);

        // Deal initial cards
        setGamePhase('DEALING');
        setResultMessage('Dealing...');

        const cards: Card[] = [];
        for (let i = 0; i < 4; i++) {
            const card = shoe.pop();
            if (card) {
                cards.push(card);
                updateCount(card);
            }
        }

        setPlayerHand([cards[0], cards[2]]);
        setDealerHand([cards[1], cards[3]]);
        setHandsPlayed(prev => prev + 1);

        // Check for immediate blackjack
        setTimeout(() => {
            if (BlackjackGameEngine.isBlackjack([cards[0], cards[2]])) {
                if (BlackjackGameEngine.isBlackjack([cards[1], cards[3]])) {
                    resolveHand([cards[0], cards[2]], [cards[1], cards[3]]);
                } else {
                    resolveDealerTurn([cards[0], cards[2]]);
                }
            } else {
                setGamePhase('PLAYER_TURN');
                setResultMessage('');
            }
        }, 800);
    };

    // Player hits
    const handleHit = () => {
        const shoe = shoeRef.current;
        const card = shoe.pop();
        if (!card) return;

        updateCount(card);

        const currentHand = isSplitHand ? splitHands[activeHandIndex] : playerHand;
        const newHand = [...currentHand, card];

        if (isSplitHand) {
            const newHands = [...splitHands];
            newHands[activeHandIndex] = newHand;
            setSplitHands(newHands);
        } else {
            setPlayerHand(newHand);
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Check if busted
        if (BlackjackGameEngine.isBusted(newHand)) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            if (isSplitHand) {
                handleSplitHandComplete(newHand);
            } else {
                setGamePhase('RESOLUTION');
                setResultMessage('BUST! You lose.');

                // Update challenge stats (loss)
                updateChallengeStats({
                    handsPlayed: 1,
                    correctDecisions: 0,
                    countingAccuracy: 1.0, // Assume accurate for now
                    heatGenerated: 0,
                });

                setTimeout(() => resetForNextHand(), 2000);
            }
        }
    };

    // Player stands
    const handleStand = () => {
        Haptics.selectionAsync();

        if (isSplitHand) {
            const currentHand = splitHands[activeHandIndex];
            handleSplitHandComplete(currentHand);
        } else {
            setGamePhase('DEALER_TURN');
            resolveDealerTurn(playerHand);
        }
    };

    // Player doubles
    const handleDouble = () => {
        const activeBet = isSplitHand ? splitBets[activeHandIndex] : currentBet;

        if (bankroll < activeBet) {
            setResultMessage('Not enough money to double!');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        // Double the bet
        setBankroll(prev => prev - activeBet);

        if (isSplitHand) {
            const newBets = [...splitBets];
            newBets[activeHandIndex] *= 2;
            setSplitBets(newBets);
        } else {
            setCurrentBet(prev => prev * 2);
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Hit once
        const shoe = shoeRef.current;
        const card = shoe.pop();
        if (!card) return;

        updateCount(card);

        const currentHand = isSplitHand ? splitHands[activeHandIndex] : playerHand;
        const newHand = [...currentHand, card];

        if (isSplitHand) {
            const newHands = [...splitHands];
            newHands[activeHandIndex] = newHand;
            setSplitHands(newHands);
        } else {
            setPlayerHand(newHand);
        }

        // Check if busted
        if (BlackjackGameEngine.isBusted(newHand)) {
            if (isSplitHand) {
                handleSplitHandComplete(newHand);
            } else {
                setGamePhase('RESOLUTION');
                setResultMessage('BUST! You lose.');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

                updateChallengeStats({
                    handsPlayed: 1,
                    correctDecisions: 0,
                    countingAccuracy: 1.0,
                    heatGenerated: 0,
                });

                setTimeout(() => resetForNextHand(), 2000);
            }
        } else {
            // Automatically stand
            if (isSplitHand) {
                handleSplitHandComplete(newHand);
            } else {
                setGamePhase('DEALER_TURN');
                resolveDealerTurn(newHand);
            }
        }
    };

    // Player splits
    const handleSplit = () => {
        if (bankroll < currentBet) {
            setResultMessage('Not enough money to split!');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            return;
        }

        // Deduct second bet
        setBankroll(prev => prev - currentBet);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Split the hand into two hands
        const hand1 = [playerHand[0]];
        const hand2 = [playerHand[1]];

        // Deal one card to each hand
        const shoe = shoeRef.current;
        const card1 = shoe.pop();
        const card2 = shoe.pop();

        if (!card1 || !card2) return;

        updateCount(card1);
        updateCount(card2);

        hand1.push(card1);
        hand2.push(card2);

        setIsSplitHand(true);
        setSplitHands([hand1, hand2]);
        setSplitBets([currentBet, currentBet]);
        setActiveHandIndex(0);
        setPlayerHand([]); // Clear original hand

        setResultMessage('Playing first hand...');
    };

    // Complete current split hand and move to next
    const handleSplitHandComplete = (finalHand: Card[]) => {
        if (activeHandIndex === 0) {
            // Move to second hand
            setActiveHandIndex(1);
            setResultMessage('Playing second hand...');
        } else {
            // Both hands complete, resolve against dealer
            setGamePhase('DEALER_TURN');
            resolveDealerTurnSplit();
        }
    };

    // Dealer plays
    const resolveDealerTurn = (finalPlayerHand: Card[]) => {
        setResultMessage('Dealer playing...');

        let dealerCards = [...dealerHand];
        const shoe = shoeRef.current;

        // Dealer draws cards with delay for animation
        const dealerDrawCard = () => {
            if (BlackjackGameEngine.dealerShouldHit(dealerCards)) {
                setTimeout(() => {
                    const card = shoe.pop();
                    if (!card) return;

                    updateCount(card);
                    dealerCards = [...dealerCards, card];
                    setDealerHand(dealerCards);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    dealerDrawCard(); // Recursively draw
                }, 600);
            } else {
                // Dealer stands, resolve
                setTimeout(() => {
                    resolveHand(finalPlayerHand, dealerCards);
                }, 600);
            }
        };

        dealerDrawCard();
    };

    // Resolve the hand and determine winner
    const resolveHand = (finalPlayerHand: Card[], finalDealerHand: Card[]) => {
        const result = BlackjackGameEngine.resolveHand(finalPlayerHand, finalDealerHand, currentBet);

        const payout = currentBet * result.payout;
        const netWin = payout - currentBet;
        const newBankroll = bankroll + payout;
        setBankroll(newBankroll);

        setGamePhase('RESOLUTION');

        // Update session stats
        setSessionStats(prev => ({
            ...prev,
            handsWon: result.outcome === 'WIN' || result.outcome === 'BLACKJACK' ? prev.handsWon + 1 : prev.handsWon,
            handsLost: result.outcome === 'LOSE' ? prev.handsLost + 1 : prev.handsLost,
            handsPushed: result.outcome === 'PUSH' ? prev.handsPushed + 1 : prev.handsPushed,
            biggestWin: netWin > prev.biggestWin ? netWin : prev.biggestWin,
            biggestLoss: netWin < 0 && Math.abs(netWin) > prev.biggestLoss ? Math.abs(netWin) : prev.biggestLoss,
            highestBankroll: newBankroll > prev.highestBankroll ? newBankroll : prev.highestBankroll,
            lowestBankroll: newBankroll < prev.lowestBankroll ? newBankroll : prev.lowestBankroll,
        }));

        let message = '';
        switch (result.outcome) {
            case 'WIN':
                message = `WIN! +$${netWin}`;
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'BLACKJACK':
                message = `BLACKJACK! +$${netWin}`;
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'PUSH':
                message = 'PUSH (Tie)';
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'LOSE':
                message = `LOSE! -$${currentBet}`;
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                break;
        }

        setResultMessage(message);

        // Update challenge stats
        const isWin = result.outcome === 'WIN' || result.outcome === 'BLACKJACK';
        updateChallengeStats({
            handsPlayed: 1,
            correctDecisions: isWin ? 1 : 0, // Simplified - assume correct play for now
            countingAccuracy: 1.0, // Simplified - no user input validation yet
            heatGenerated: 0, // Will add heat tracking
        });

        // Update heat meter
        const heatIncrease = BlackjackGameEngine.calculateHeatFromBet(currentBet, trueCount, MIN_BET);
        setSuspicionLevel((prev: number) => Math.min(100, prev + heatIncrease));

        setTimeout(() => resetForNextHand(), 3000);
    };

    // Dealer plays against split hands
    const resolveDealerTurnSplit = () => {
        setResultMessage('Dealer playing...');

        let dealerCards = [...dealerHand];
        const shoe = shoeRef.current;

        // Dealer draws cards with delay for animation
        const dealerDrawCard = () => {
            if (BlackjackGameEngine.dealerShouldHit(dealerCards)) {
                setTimeout(() => {
                    const card = shoe.pop();
                    if (!card) return;

                    updateCount(card);
                    dealerCards = [...dealerCards, card];
                    setDealerHand(dealerCards);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    dealerDrawCard(); // Recursively draw
                }, 600);
            } else {
                // Dealer stands, resolve both hands
                setTimeout(() => {
                    resolveHandSplit(dealerCards);
                }, 600);
            }
        };

        dealerDrawCard();
    };

    // Resolve split hands against dealer
    const resolveHandSplit = (finalDealerHand: Card[]) => {
        let totalPayout = 0;
        const results: string[] = [];

        splitHands.forEach((hand, index) => {
            const bet = splitBets[index];
            const result = BlackjackGameEngine.resolveHand(hand, finalDealerHand, bet);
            const payout = bet * result.payout;
            totalPayout += payout;

            let message = `Hand ${index + 1}: `;
            switch (result.outcome) {
                case 'WIN':
                    message += `WIN +$${payout - bet}`;
                    break;
                case 'BLACKJACK':
                    message += `BJ! +$${payout - bet}`;
                    break;
                case 'PUSH':
                    message += 'PUSH';
                    break;
                case 'LOSE':
                    message += `LOSE -$${bet}`;
                    break;
            }
            results.push(message);
        });

        setBankroll(prev => prev + totalPayout);
        setGamePhase('RESOLUTION');

        const totalBet = splitBets.reduce((sum, bet) => sum + bet, 0);
        const netResult = totalPayout - totalBet;

        setResultMessage(
            results.join(' | ') + `\nNet: ${netResult >= 0 ? '+' : ''}$${netResult}`
        );

        if (netResult > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (netResult < 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // Update challenge stats
        updateChallengeStats({
            handsPlayed: 2, // Played 2 split hands
            correctDecisions: netResult >= 0 ? 2 : 0,
            countingAccuracy: 1.0,
            heatGenerated: 0,
        });

        // Update heat meter
        const heatIncrease = splitBets.reduce((sum, bet) =>
            sum + BlackjackGameEngine.calculateHeatFromBet(bet, trueCount, MIN_BET), 0
        );
        setSuspicionLevel((prev: number) => Math.min(100, prev + heatIncrease));

        setTimeout(() => resetForNextHand(), 3500);
    };

    // Reset for next hand
    const resetForNextHand = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setResultMessage('');
        setCurrentBet(MIN_BET); // Reset to min bet
        setGamePhase('BETTING');

        // Clear split state
        setIsSplitHand(false);
        setSplitHands([]);
        setActiveHandIndex(0);
        setSplitBets([]);
    };

    // Auto-bet based on true count
    const handleAutoBet = () => {
        const optimalBet = BlackjackGameEngine.calculateOptimalBet(trueCount, bankroll, MIN_BET, MAX_BET);
        setCurrentBet(optimalBet);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // Validate user's count input
    const handleCountCheck = () => {
        const userRC = parseInt(userInputRC);
        const userTC = parseInt(userInputTC);

        const isRCCorrect = userRC === runningCount;
        const isTCCorrect = userTC === trueCount;
        const isCorrect = isRCCorrect && isTCCorrect;

        // Track accuracy
        setCountAccuracy(prev => [...prev, isCorrect ? 1 : 0]);

        if (isCorrect) {
            setResultMessage('✓ Perfect Count!');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            let message = '✗ Incorrect. ';
            if (!isRCCorrect) message += `RC should be ${runningCount}. `;
            if (!isTCCorrect) message += `TC should be ${trueCount}.`;
            setResultMessage(message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setShowCountCheck(false);
        setUserInputRC('');
        setUserInputTC('');

        setTimeout(() => {
            if (gamePhase === 'BETTING') {
                setResultMessage('');
            }
        }, 2000);
    };

    // Calculate overall counting accuracy
    const getCountingAccuracy = (): number => {
        if (countAccuracy.length === 0) return 0;
        const correct = countAccuracy.reduce((sum, val) => sum + val, 0);
        return Math.round((correct / countAccuracy.length) * 100);
    };

    // Reset session
    const resetSession = () => {
        setBankroll(startingBankroll);
        setSessionStats({
            handsWon: 0,
            handsLost: 0,
            handsPushed: 0,
            biggestWin: 0,
            biggestLoss: 0,
            highestBankroll: startingBankroll,
            lowestBankroll: startingBankroll,
        });
        setHandsPlayed(0);
        setCountAccuracy([]);
        shoeRef.current.reset();
        setRunningCount(0);
        setTrueCount(0);
        setGamePhase('BETTING');
        setResultMessage('Session reset');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(() => setResultMessage(''), 1500);
    };

    // Calculate win rate
    const getWinRate = (): number => {
        const totalHands = sessionStats.handsWon + sessionStats.handsLost + sessionStats.handsPushed;
        if (totalHands === 0) return 0;
        return Math.round((sessionStats.handsWon / totalHands) * 100);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Casino Simulator</Text>
                <TouchableOpacity onPress={() => setShowCountDisplay(!showCountDisplay)}>
                    <Text style={styles.toggleText}>{showCountDisplay ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Stats HUD */}
                <View style={styles.hud}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Bankroll</Text>
                        <Text style={[styles.statValue, bankroll > 1000 ? styles.pos : styles.neg]}>
                            ${bankroll}
                        </Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Hands</Text>
                        <Text style={styles.statValue}>{handsPlayed}</Text>
                    </View>
                    {showCountDisplay && (
                        <>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>RC</Text>
                                <Text style={[styles.statValue, runningCount > 0 ? styles.pos : styles.neg]}>
                                    {runningCount > 0 ? `+${runningCount}` : runningCount}
                                </Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>TC</Text>
                                <Text style={[styles.statValue, trueCount > 0 ? styles.pos : styles.neg]}>
                                    {trueCount > 0 ? `+${trueCount}` : trueCount}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Heat Meter */}
                <View style={styles.heatContainer}>
                    <Text style={styles.heatLabel}>PIT BOSS HEAT</Text>
                    <HeatMeter />
                </View>

                {/* Session Stats */}
                <TouchableOpacity
                    style={styles.sessionStatsToggle}
                    onPress={() => setShowSessionStats(!showSessionStats)}
                >
                    <Text style={styles.sessionStatsToggleText}>
                        Session Stats {showSessionStats ? '▼' : '▶'}
                    </Text>
                </TouchableOpacity>

                {showSessionStats && (
                    <View style={styles.sessionStatsContainer}>
                        <View style={styles.sessionStatsGrid}>
                            <View style={styles.sessionStatItem}>
                                <Text style={styles.sessionStatLabel}>Win Rate</Text>
                                <Text style={[styles.sessionStatValue, styles.pos]}>{getWinRate()}%</Text>
                            </View>
                            <View style={styles.sessionStatItem}>
                                <Text style={styles.sessionStatLabel}>Net</Text>
                                <Text style={[
                                    styles.sessionStatValue,
                                    bankroll >= startingBankroll ? styles.pos : styles.neg
                                ]}>
                                    {bankroll >= startingBankroll ? '+' : ''}${bankroll - startingBankroll}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.sessionStatsGrid}>
                            <View style={styles.sessionStatItem}>
                                <Text style={styles.sessionStatLabel}>W/L/P</Text>
                                <Text style={styles.sessionStatValue}>
                                    {sessionStats.handsWon}/{sessionStats.handsLost}/{sessionStats.handsPushed}
                                </Text>
                            </View>
                            <View style={styles.sessionStatItem}>
                                <Text style={styles.sessionStatLabel}>Peak</Text>
                                <Text style={styles.sessionStatValue}>${sessionStats.highestBankroll}</Text>
                            </View>
                        </View>

                        <View style={styles.sessionStatsGrid}>
                            <View style={styles.sessionStatItem}>
                                <Text style={styles.sessionStatLabel}>Best Win</Text>
                                <Text style={[styles.sessionStatValue, styles.pos]}>
                                    +${sessionStats.biggestWin}
                                </Text>
                            </View>
                            <View style={styles.sessionStatItem}>
                                <Text style={styles.sessionStatLabel}>Worst Loss</Text>
                                <Text style={[styles.sessionStatValue, styles.neg]}>
                                    -${sessionStats.biggestLoss}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetSession}
                        >
                            <Text style={styles.resetButtonText}>Reset Session</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Game Table */}
                {gamePhase !== 'BETTING' && (
                    <View style={styles.gameTable}>
                        {/* Dealer */}
                        <View style={styles.dealerArea}>
                            <Text style={styles.label}>
                                Dealer{gamePhase !== 'PLAYER_TURN' && dealerHand.length > 0
                                    ? `: ${BlackjackGameEngine.getHandValue(dealerHand).value}`
                                    : ''}
                            </Text>
                            <View style={styles.cardRow}>
                                {dealerHand.map((card, i) => (
                                    <CardComponent
                                        key={i}
                                        card={card}
                                        size="medium"
                                        showBack={gamePhase === 'PLAYER_TURN' && i === 1}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Player */}
                        {!isSplitHand ? (
                            <View style={styles.playerArea}>
                                <Text style={styles.label}>
                                    You{playerHand.length > 0
                                        ? `: ${BlackjackGameEngine.getHandValue(playerHand).value}`
                                        : ''}
                                </Text>
                                <View style={styles.cardRow}>
                                    {playerHand.map((card, i) => (
                                        <CardComponent key={i} card={card} size="medium" />
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <View style={styles.playerArea}>
                                {splitHands.map((hand, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.splitHandContainer,
                                            activeHandIndex === index && styles.activeHand
                                        ]}
                                    >
                                        <Text style={styles.label}>
                                            Hand {index + 1} ${splitBets[index]}
                                            {hand.length > 0
                                                ? `: ${BlackjackGameEngine.getHandValue(hand).value}`
                                                : ''}
                                            {activeHandIndex === index ? ' ◀' : ''}
                                        </Text>
                                        <View style={styles.cardRow}>
                                            {hand.map((card, i) => (
                                                <CardComponent key={i} card={card} size="small" />
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* Result Message */}
                {resultMessage && (
                    <View style={styles.resultContainer}>
                        <Text style={[
                            styles.resultText,
                            resultMessage.includes('WIN') || resultMessage.includes('BLACKJACK') ? styles.pos : styles.neg
                        ]}>
                            {resultMessage}
                        </Text>
                    </View>
                )}

                {/* Betting Interface */}
                {gamePhase === 'BETTING' && (
                    <View style={styles.bettingInterface}>
                        <Text style={styles.betPrompt}>Place your bet</Text>

                        <View style={styles.betControls}>
                            <TouchableOpacity
                                onPress={() => setCurrentBet(MIN_BET)}
                                style={styles.betBtn}
                            >
                                <Text style={styles.betBtnText}>MIN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setCurrentBet(prev => Math.max(MIN_BET, prev - 10))}
                                style={styles.betBtn}
                            >
                                <Text style={styles.betBtnText}>-$10</Text>
                            </TouchableOpacity>

                            <View style={styles.betAmountContainer}>
                                <Text style={styles.betAmount}>${currentBet}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => setCurrentBet(prev => Math.min(MAX_BET, bankroll, prev + 10))}
                                style={styles.betBtn}
                            >
                                <Text style={styles.betBtnText}>+$10</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleAutoBet}
                                style={[styles.betBtn, styles.autoBtn]}
                            >
                                <Text style={styles.betBtnText}>AUTO</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.dealButton}
                            onPress={startNewHand}
                        >
                            <Text style={styles.dealButtonText}>DEAL</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Player Action Buttons */}
                {gamePhase === 'PLAYER_TURN' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.hitBtn]}
                            onPress={handleHit}
                        >
                            <Text style={styles.actionBtnText}>HIT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.standBtn]}
                            onPress={handleStand}
                        >
                            <Text style={styles.actionBtnText}>STAND</Text>
                        </TouchableOpacity>

                        {!isSplitHand && BlackjackGameEngine.canDouble(playerHand, bankroll >= currentBet) && (
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.doubleBtn]}
                                onPress={handleDouble}
                            >
                                <Text style={styles.actionBtnText}>DOUBLE</Text>
                            </TouchableOpacity>
                        )}

                        {!isSplitHand && BlackjackGameEngine.canSplit(playerHand, bankroll >= currentBet) && (
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.splitBtn]}
                                onPress={handleSplit}
                            >
                                <Text style={styles.actionBtnText}>SPLIT</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Distraction Toggle */}
                <View style={styles.settingsRow}>
                    <Text style={styles.settingsLabel}>Distractions:</Text>
                    <TouchableOpacity
                        onPress={() => setIsDistractionActive(!isDistractionActive)}
                        style={[styles.toggleButton, isDistractionActive && styles.toggleActive]}
                    >
                        <Text style={styles.toggleButtonText}>
                            {isDistractionActive ? 'ON' : 'OFF'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Count Check Button */}
                <TouchableOpacity
                    style={styles.countCheckButton}
                    onPress={() => setShowCountCheck(true)}
                >
                    <Text style={styles.countCheckButtonText}>Check My Count</Text>
                </TouchableOpacity>

                {/* Counting Accuracy */}
                {countAccuracy.length > 0 && (
                    <View style={styles.accuracyContainer}>
                        <Text style={styles.accuracyLabel}>Counting Accuracy:</Text>
                        <Text style={[
                            styles.accuracyValue,
                            getCountingAccuracy() >= 90 ? styles.pos : styles.neg
                        ]}>
                            {getCountingAccuracy()}%
                        </Text>
                        <Text style={styles.accuracyDetail}>
                            ({countAccuracy.filter(v => v === 1).length}/{countAccuracy.length} correct)
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Count Check Modal */}
            <Modal
                visible={showCountCheck}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCountCheck(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>What's the count?</Text>
                        <Text style={styles.modalSubtitle}>Test your counting accuracy</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Running Count:</Text>
                            <TextInput
                                style={styles.input}
                                value={userInputRC}
                                onChangeText={setUserInputRC}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={colors.textMuted}
                                autoFocus
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>True Count:</Text>
                            <TextInput
                                style={styles.input}
                                value={userInputTC}
                                onChangeText={setUserInputTC}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={colors.textMuted}
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnCancel]}
                                onPress={() => {
                                    setShowCountCheck(false);
                                    setUserInputRC('');
                                    setUserInputTC('');
                                }}
                            >
                                <Text style={styles.modalBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnConfirm]}
                                onPress={handleCountCheck}
                            >
                                <Text style={styles.modalBtnText}>Check</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <DistractionLayer isActive={isDistractionActive} />
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
    backButton: {},
    backText: {
        color: colors.accentBlue,
        fontSize: 16,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    toggleText: {
        fontSize: 24,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    hud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    statBox: {
        flex: 1,
        minWidth: 80,
        backgroundColor: colors.surfaceLight,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statValue: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    pos: {
        color: colors.accentGreen,
    },
    neg: {
        color: colors.accent,
    },
    heatContainer: {
        marginBottom: 20,
    },
    heatLabel: {
        color: colors.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 8,
        textAlign: 'center',
    },
    gameTable: {
        marginBottom: 20,
    },
    dealerArea: {
        alignItems: 'center',
        marginBottom: 40,
    },
    playerArea: {
        alignItems: 'center',
    },
    label: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    cardRow: {
        flexDirection: 'row',
        gap: 8,
    },
    resultContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    bettingInterface: {
        alignItems: 'center',
        marginVertical: 30,
    },
    betPrompt: {
        color: colors.textPrimary,
        fontSize: 18,
        marginBottom: 20,
    },
    betControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
    },
    betBtn: {
        backgroundColor: colors.surfaceLight,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.accentBlue,
    },
    betBtnText: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    autoBtn: {
        borderColor: colors.accentGreen,
    },
    betAmountContainer: {
        backgroundColor: colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.accent,
    },
    betAmount: {
        color: colors.accent,
        fontSize: 24,
        fontWeight: 'bold',
    },
    dealButton: {
        backgroundColor: colors.accentGreen,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 25,
    },
    dealButtonText: {
        color: colors.background,
        fontSize: 20,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginVertical: 20,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    actionBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    hitBtn: {
        backgroundColor: colors.accentGreen,
        borderColor: colors.accentGreen,
    },
    standBtn: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    doubleBtn: {
        backgroundColor: colors.accentBlue,
        borderColor: colors.accentBlue,
    },
    splitBtn: {
        backgroundColor: '#FF9500',
        borderColor: '#FF9500',
    },
    splitHandContainer: {
        marginBottom: 20,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeHand: {
        borderColor: colors.accentGreen,
        borderWidth: 2,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 15,
    },
    settingsLabel: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    toggleButton: {
        backgroundColor: colors.surfaceLight,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    toggleActive: {
        backgroundColor: colors.accentGreen,
        borderColor: colors.accentGreen,
    },
    toggleButtonText: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    countCheckButton: {
        backgroundColor: colors.accentBlue,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: colors.accentBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    countCheckButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    accuracyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.surfaceLight,
        borderRadius: 12,
        gap: 8,
    },
    accuracyLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    accuracyValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    accuracyDetail: {
        color: colors.textMuted,
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.surfaceLight,
        borderRadius: 12,
        padding: 16,
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalBtnCancel: {
        backgroundColor: colors.surfaceLight,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    modalBtnConfirm: {
        backgroundColor: colors.accentGreen,
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    sessionStatsToggle: {
        backgroundColor: colors.surfaceLight,
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    sessionStatsToggleText: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    sessionStatsContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.glassBorder,
    },
    sessionStatsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    sessionStatItem: {
        flex: 1,
        backgroundColor: colors.surfaceLight,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    sessionStatLabel: {
        color: colors.textSecondary,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    sessionStatValue: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        backgroundColor: colors.accent,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    resetButtonText: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
