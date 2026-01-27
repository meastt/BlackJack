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
                                placeholderTextColor={colors.textTertiary}
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
                                placeholderTextColor={colors.textTertiary}
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
        backgroundColor: colors.background, // Void Black
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
    },
    backButton: {
        padding: 8,
    },
    backText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    toggleText: {
        fontSize: 22,
        opacity: 0.8,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    hud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        minWidth: 80,
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 4, // Sharp corners for tactical look
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    statLabel: {
        color: colors.textTertiary,
        fontSize: 10,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontWeight: '600',
    },
    statValue: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: '700', // Monospace-like bold
        fontVariant: ['tabular-nums'],
    },
    pos: {
        color: colors.success,
    },
    neg: {
        color: colors.error,
    },
    heatContainer: {
        marginBottom: 24,
        backgroundColor: colors.surfaceDark,
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    heatLabel: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 12,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    gameTable: {
        marginBottom: 24,
        minHeight: 300,
        justifyContent: 'center',
    },
    dealerArea: {
        alignItems: 'center',
        marginBottom: 40,
    },
    playerArea: {
        alignItems: 'center',
    },
    label: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    cardRow: {
        flexDirection: 'row',
        gap: 8,
    },
    resultContainer: {
        alignItems: 'center',
        marginVertical: 10,
        padding: 12,
        backgroundColor: colors.surfaceDark,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.borderActive,
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: colors.textPrimary,
    },
    bettingInterface: {
        alignItems: 'center',
        marginVertical: 20,
    },
    betPrompt: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    betControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    betBtn: {
        backgroundColor: colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    betBtnText: {
        color: colors.textPrimary,
        fontWeight: '600',
        fontSize: 12,
    },
    autoBtn: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
    betAmountContainer: {
        backgroundColor: colors.background,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    betAmount: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    dealButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 4,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    dealButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 20,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 1,
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#FFFFFF',
    },
    hitBtn: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    standBtn: {
        backgroundColor: colors.error, // Red for Stop/Stand
        borderColor: colors.error,
    },
    doubleBtn: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    splitBtn: {
        backgroundColor: colors.warning,
        borderColor: colors.warning,
    },
    splitHandContainer: {
        marginBottom: 20,
        padding: 16,
        borderRadius: 4,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activeHand: {
        borderColor: colors.primary,
        borderWidth: 1,
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 15,
        backgroundColor: colors.surfaceDark,
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    settingsLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    toggleButton: {
        backgroundColor: colors.surface,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    toggleActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    toggleButtonText: {
        color: colors.textPrimary,
        fontWeight: '600',
        fontSize: 12,
    },
    countCheckButton: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    countCheckButtonText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    accuracyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.surfaceDark,
        borderRadius: 4,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    accuracyLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    accuracyValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    accuracyDetail: {
        color: colors.textTertiary,
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 4,
        padding: 30,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    modalSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 4,
        padding: 16,
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: 'center',
    },
    modalBtnCancel: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalBtnConfirm: {
        backgroundColor: colors.primary,
    },
    modalBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sessionStatsToggle: {
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 4,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    sessionStatsToggleText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sessionStatsContainer: {
        backgroundColor: colors.surfaceDark,
        borderRadius: 4,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sessionStatsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    sessionStatItem: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    sessionStatLabel: {
        color: colors.textTertiary,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    sessionStatValue: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    resetButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.error,
    },
    resetButtonText: {
        color: colors.error,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
