import React, { useState, useRef, useEffect } from 'react';
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
import { TacticalShoe } from '../../components/simulator/TacticalShoe';
import { TacticalChip, ChipValue } from '../../components/simulator/TacticalChip';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type GamePhase = 'BETTING' | 'DEALING' | 'PLAYER_TURN' | 'DEALER_TURN' | 'RESOLUTION' | 'SHOE_SHUFFLE';

export const SimulatorScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    // Global state
    const { setSuspicionLevel, updateChallengeStats, checkCount, setRunningCount: setGlobalRC, getAccuracy } = useSimState();
    const insets = useSafeAreaInsets();

    // Game state
    const [gamePhase, setGamePhase] = useState<GamePhase>('BETTING');
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [currentBet, setCurrentBet] = useState(0);
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
    const currentBetRef = useRef(0); // Ref to track actual bet for resolution (handles async state)
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
    const [showSettings, setShowSettings] = useState(false);

    // Training Helper Toggles
    const [showCountImpact, setShowCountImpact] = useState(true);
    const [showTacticalShoe, setShowTacticalShoe] = useState(true);
    const [showChipTray, setShowChipTray] = useState(true);
    const [deckCount, setDeckCount] = useState(6);
    const [checkInterval, setCheckInterval] = useState(0); // 0 means manual only

    // Reset shoe when deck count changes
    useEffect(() => {
        shoeRef.current = new Shoe(deckCount);
        setRunningCount(0);
        setTrueCount(0);
        // Also reset the hand if we're in betting phase
        if (gamePhase === 'BETTING') {
            setPlayerHand([]);
            setDealerHand([]);
        }
    }, [deckCount]);

    const MIN_BET = 10;
    const MAX_BET = 10000;

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
        setGlobalRC(newRC);
    };

    // Start a new hand
    const startNewHand = () => {
        // Check if bet is placed
        if (currentBet === 0) {
            setResultMessage('Place a bet!');
            return;
        }

        // Auto-prompt for count check
        if (checkInterval > 0 && handsPlayed > 0 && handsPlayed % checkInterval === 0) {
            setShowCountCheck(true);
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

        // Bet is already deducted in handleAddBet

        // Deal initial cards sequentially for animation
        setGamePhase('DEALING');
        setResultMessage('Dealing...');
        setPlayerHand([]);
        setDealerHand([]);
        currentBetRef.current = currentBet; // Set ref for resolution

        const dealSequence = async () => {
            const tempCards: Card[] = [];
            let localPlayerHand: Card[] = [];
            let localDealerHand: Card[] = [];

            for (let i = 0; i < 4; i++) {
                const card = shoe.pop();
                if (card) {
                    tempCards.push(card);
                    updateCount(card);

                    // Add haptic feedback for initial deal
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    if (i === 0) {
                        localPlayerHand = [card];
                        setPlayerHand(localPlayerHand);
                    } else if (i === 1) {
                        localDealerHand = [card];
                        setDealerHand(localDealerHand);
                    } else if (i === 2) {
                        localPlayerHand = [...localPlayerHand, card];
                        setPlayerHand(localPlayerHand);
                    } else if (i === 3) {
                        localDealerHand = [...localDealerHand, card];
                        setDealerHand(localDealerHand);
                    }

                    await new Promise(resolve => setTimeout(resolve, 250));
                }
            }

            setHandsPlayed(prev => prev + 1);

            // Check for immediate blackjack AFTER animation
            if (BlackjackGameEngine.isBlackjack(localPlayerHand)) {
                if (BlackjackGameEngine.isBlackjack(localDealerHand)) {
                    // Both have BJ - Push
                    resolveHand(localPlayerHand, localDealerHand);
                } else {
                    // Player has BJ, Dealer does not - Instant Win (New Logic)
                    // We DO NOT let dealer play out their hand.
                    resolveHand(localPlayerHand, localDealerHand);
                }
            } else if (BlackjackGameEngine.isBlackjack(localDealerHand)) {
                // Dealer has BJ, Player doesn't - Instant Loss
                resolveHand(localPlayerHand, localDealerHand);
            } else {
                setGamePhase('PLAYER_TURN');
                setResultMessage('');
            }
        };

        dealSequence();
    };

    const nextHand = () => {
        setPlayerHand([]);
        setDealerHand([]);
        setResultMessage('');
        setGamePhase('BETTING');
        setCurrentBet(0); // Reset visible bet to force new deduction
        currentBetRef.current = 0; // Reset bet ref

        // Clear split state
        setIsSplitHand(false);
        setSplitHands([]);
        setActiveHandIndex(0);
        setSplitBets([]);
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
        const { value: handValue } = BlackjackGameEngine.getHandValue(newHand);

        if (handValue > 21) {
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

                // Auto-advance removed - User must tap Next Hand
                // setTimeout(() => nextHand(), 2000);
            }
        } else if (handValue === 21) {
            // Auto-stand on 21
            if (isSplitHand) {
                handleSplitHandComplete(newHand);
            } else {
                setGamePhase('DEALER_TURN');
                resolveDealerTurn(newHand);
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
            const doubledBet = currentBet * 2;
            setCurrentBet(doubledBet);
            currentBetRef.current = doubledBet; // Update ref immediately for resolution
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

                // Auto-advance removed - User must tap Next Hand
                // setTimeout(() => nextHand(), 2000);
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
        const dealerDrawCard = (currentHand: Card[]) => {
            if (BlackjackGameEngine.dealerShouldHit(currentHand)) {
                setTimeout(() => {
                    const card = shoe.pop();

                    if (!card) {
                        // Safety: If shoe is empty mid-hand, force resolve to prevent hang
                        setResultMessage('Shoe Empty! Resolving...');
                        resolveHand(finalPlayerHand, currentHand);
                        return;
                    }

                    updateCount(card);
                    const newHand = [...currentHand, card];
                    setDealerHand(newHand);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    dealerDrawCard(newHand); // Recursively draw
                }, 600);
            } else {
                // Dealer stands, resolve
                setTimeout(() => {
                    resolveHand(finalPlayerHand, currentHand);
                }, 600);
            }
        };

        dealerDrawCard(dealerCards);
    };

    // Resolve the hand and determine winner
    const resolveHand = (finalPlayerHand: Card[], finalDealerHand: Card[]) => {
        // Use ref value for bet to handle async state updates (e.g., after double)
        const actualBet = currentBetRef.current || currentBet;
        const result = BlackjackGameEngine.resolveHand(finalPlayerHand, finalDealerHand, actualBet);

        const payout = actualBet * result.payout;
        const netWin = payout - actualBet;
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
        const playerBJ = BlackjackGameEngine.isBlackjack(finalPlayerHand);
        const dealerBJ = BlackjackGameEngine.isBlackjack(finalDealerHand);

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
                if (playerBJ && dealerBJ) {
                    message = 'PUSH - Both Blackjack!';
                } else {
                    message = 'PUSH (Tie)';
                }
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'LOSE':
                if (dealerBJ) {
                    message = `DEALER BLACKJACK!\n-$${actualBet}`;
                } else {
                    message = `LOSE! -$${actualBet}`;
                }
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
        const heatIncrease = BlackjackGameEngine.calculateHeatFromBet(actualBet, trueCount, MIN_BET);
        setSuspicionLevel((prev: number) => Math.min(100, prev + heatIncrease));

        // Auto-advance removed - User must tap Next Hand
        // setTimeout(() => nextHand(), 3000);
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
            results.join('\n') + `\n\nNet: ${netResult >= 0 ? '+' : ''}$${netResult}`
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

        // Auto-advance removed - User must tap Next Hand
        // setTimeout(() => nextHand(), 3500);
    };

    // Add to current bet using chips
    const handleAddBet = (value: number) => {
        if (bankroll >= value && currentBet + value <= MAX_BET) {
            setBankroll(prev => prev - value);
            setCurrentBet(prev => prev + value);
        } else if (bankroll < value) {
            setResultMessage('Not enough bankroll!');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    };

    const handleClearBet = () => {
        setBankroll(prev => prev + currentBet);
        setCurrentBet(0);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // (Unifying reset logic into nextHand)

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

        const { isCorrectRc, isCorrectTc } = checkCount(userRC, userTC, trueCount);
        const isCorrect = isCorrectRc && isCorrectTc;

        if (isCorrect) {
            setResultMessage('✓ PERFECT_COUNT');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            let message = '✗ MATH_DRIFT: ';
            if (!isCorrectRc) message += `RC should be ${runningCount}. `;
            if (!isCorrectTc) message += `TC should be ${trueCount}.`;
            setResultMessage(message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }

        setShowCountCheck(false);
        setUserInputRC('');
        setUserInputTC('');
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={styles.headerBankroll}>
                        <Ionicons name="cash-outline" size={14} color={colors.primary} /> ${bankroll.toLocaleString()}
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    <View style={styles.headerAccuracy}>
                        <Text style={styles.headerAccuracyLabel}>ACCURACY</Text>
                        <Text style={[styles.headerAccuracyValue, { color: getAccuracy() >= 90 ? colors.success : colors.error }]}>
                            {getAccuracy()}%
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.headerIcon}>
                        <Ionicons name="settings-sharp" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Top HUD Overlay - OUTSIDE gameTable to avoid overflow:hidden clipping */}
            <View style={styles.topHud}>
                <View style={styles.hudBadge}>
                    <Text style={styles.hudBadgeText}>DECKS: {deckCount}</Text>
                    <Text style={styles.hudBadgeText}>CARDS: {shoeRef.current.getCardsRemaining()}</Text>
                    {showCountDisplay && (
                        <Text style={[styles.hudBadgeText, { color: colors.primary }]}>RC: {runningCount > 0 ? `+${runningCount}` : runningCount}</Text>
                    )}
                </View>
                {showTacticalShoe && (
                    <TacticalShoe
                        remaining={shoeRef.current.getCardsRemaining()}
                        total={deckCount * 52}
                    />
                )}
            </View>

            {/* Table Surface */}
            <View style={styles.gameTable}>
                {/* Vignette Background */}
                <LinearGradient
                    colors={[colors.surface, '#000000']}
                    style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
                    start={{ x: 0.5, y: 0.2 }}
                    end={{ x: 0.5, y: 1.2 }}
                />

                {/* Neon Arch (Dealer Rail) */}
                <View style={styles.neonArch} />

                {/* Table Markings & Text */}
                {/* Top Title Banner */}
                <View style={styles.tableTitleContainer}>
                    <Text style={styles.tableTextTitle}>PROTOCOL 21</Text>
                </View>

                {/* Bottom Table Rules */}
                <View style={styles.tableTextContainer}>
                    <Text style={styles.tableTextSubtitle}>PAYS 3 TO 2</Text>
                    <Text style={styles.tableTextRules}>DEALER MUST DRAW TO 16 AND STAND ON ALL 17s</Text>
                    <Text style={styles.tableTextRules}>INSURANCE PAYS 2 TO 1</Text>
                </View>

                {/* Main Vertical Flow */}
                <View style={styles.tableCenter}>
                    {/* Dealer Area */}
                    <View style={styles.dealerHandArea}>
                        <View style={styles.cardOverlapRow}>
                            {dealerHand.map((card, i) => (
                                <View key={i} style={[styles.cardInHand, { zIndex: i, marginLeft: i > 0 ? -30 : 0 }]}>
                                    <CardComponent
                                        card={card}
                                        size="small"
                                        showBack={(gamePhase === 'DEALING' || gamePhase === 'PLAYER_TURN') && i === 1}
                                        showCountImpact={showCountImpact && (gamePhase !== 'PLAYER_TURN' || i === 0)}
                                    />
                                </View>
                            ))}
                        </View>
                        {dealerHand.length > 0 && <Text style={styles.handLabel}>DEALER</Text>}
                    </View>

                    {/* Pot / Bet Stack */}
                    <View style={styles.potArea}>
                        <View style={styles.bettingRing} />
                        {currentBet > 0 ? (
                            <View style={styles.betStackContainer}>
                                <View style={styles.betStack}>
                                    {/* Visual representation of stack */}
                                    {[...Array(Math.min(5, Math.ceil(currentBet / 25)))].map((_, i) => (
                                        <View key={i} style={[styles.betStackChip, { bottom: i * 3 }]} />
                                    ))}
                                </View>
                                <View style={styles.betLabelBadge}>
                                    <Text style={styles.betLabelText}>${currentBet}</Text>
                                </View>
                            </View>
                        ) : (
                            gamePhase === 'BETTING' && <Text style={styles.placeBetPrompt}>PLACE YOUR BET</Text>
                        )}
                    </View>

                    {/* Player Area */}
                    <View style={styles.handArea}>
                        {!isSplitHand ? (
                            <View style={styles.cardOverlapRow}>
                                {playerHand.map((card, i) => (
                                    <View key={i} style={[styles.cardInHand, { zIndex: i, marginLeft: i > 0 ? -30 : 0 }]}>
                                        <CardComponent
                                            card={card}
                                            size="small"
                                            showCountImpact={showCountImpact}
                                        />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.handArea}>
                                {splitHands.map((hand, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.cardOverlapRow,
                                            activeHandIndex === index && styles.activeHand
                                        ]}
                                    >
                                        {hand.map((card, i) => (
                                            <View key={i} style={[styles.cardInHand, { zIndex: i, marginLeft: i > 0 ? -30 : 0 }]}>
                                                <CardComponent
                                                    card={card}
                                                    size="small"
                                                    showCountImpact={showCountImpact}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}
                        {playerHand.length > 0 && <Text style={styles.handLabel}>PLAYER</Text>}
                    </View>
                </View>

                {/* Result Message Overlay */}
                {gamePhase === 'RESOLUTION' && resultMessage && (
                    <View style={styles.resultOverlay}>
                        <View style={styles.resultBox}>
                            <Text style={[
                                styles.resultMainText,
                                resultMessage.includes('WIN') || resultMessage.includes('BLACKJACK') ? styles.pos : styles.neg
                            ]}>
                                {resultMessage}
                            </Text>
                            <TouchableOpacity style={styles.nextHandBtn} onPress={nextHand}>
                                <Text style={styles.nextHandBtnText}>NEXT HAND</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Bottom Controls */}
            <View style={[styles.controlPanel, { paddingBottom: insets.bottom + 10 }]}>
                {gamePhase === 'BETTING' ? (
                    <View style={styles.bettingFlow}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                            {[1, 5, 25, 100, 500].map((val) => (
                                <TacticalChip
                                    key={val}
                                    value={val as ChipValue}
                                    onPress={() => handleAddBet(val)}
                                    disabled={bankroll < val}
                                />
                            ))}
                        </ScrollView>
                        <View style={styles.dealRow}>
                            <TouchableOpacity style={styles.clearBtn} onPress={handleClearBet}>
                                <Ionicons name="refresh" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.mainDealBtn, currentBet === 0 && styles.btnDisabled]}
                                onPress={startNewHand}
                                disabled={currentBet === 0}
                            >
                                <Text style={styles.mainDealBtnText}>DEAL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    gamePhase === 'PLAYER_TURN' && (
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={[styles.actionBtn, styles.hitBtn]} onPress={handleHit}>
                                <Text style={styles.actionBtnText}>HIT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.standBtn]} onPress={handleStand}>
                                <Text style={styles.actionBtnText}>STAND</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.actionBtn,
                                    styles.doubleBtn,
                                    !BlackjackGameEngine.canDouble(playerHand, bankroll >= currentBet) && styles.btnActionDisabled
                                ]}
                                onPress={handleDouble}
                                disabled={!BlackjackGameEngine.canDouble(playerHand, bankroll >= currentBet)}
                            >
                                <Text style={styles.actionBtnText}>2X</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.actionBtn,
                                    styles.splitBtn,
                                    !BlackjackGameEngine.canSplit(playerHand, bankroll >= currentBet) && styles.btnActionDisabled
                                ]}
                                onPress={handleSplit}
                                disabled={!BlackjackGameEngine.canSplit(playerHand, bankroll >= currentBet)}
                            >
                                <Text style={styles.actionBtnText}>SPLIT</Text>
                            </TouchableOpacity>
                        </View>
                    )
                )}
            </View>

            {/* Count Check Modal */}
            <Modal
                visible={showSettings}
                transparent
                animationType="slide"
                onRequestClose={() => setShowSettings(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>TACTICAL_SETTINGS</Text>
                            <TouchableOpacity onPress={() => setShowSettings(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.settingsGroup}>
                            <Text style={styles.groupLabel}>TRAINING HELPERS</Text>

                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Show Count Tags</Text>
                                <TouchableOpacity
                                    onPress={() => setShowCountImpact(!showCountImpact)}
                                    style={[styles.miniToggle, showCountImpact && styles.miniToggleActive]}
                                >
                                    <View style={[styles.miniToggleCircle, showCountImpact && styles.miniToggleCircleActive]} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Visual Shoe Aid</Text>
                                <TouchableOpacity
                                    onPress={() => setShowTacticalShoe(!showTacticalShoe)}
                                    style={[styles.miniToggle, showTacticalShoe && styles.miniToggleActive]}
                                >
                                    <View style={[styles.miniToggleCircle, showTacticalShoe && styles.miniToggleCircleActive]} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Modern Chip Tray</Text>
                                <TouchableOpacity
                                    onPress={() => setShowChipTray(!showChipTray)}
                                    style={[styles.miniToggle, showChipTray && styles.miniToggleActive]}
                                >
                                    <View style={[styles.miniToggleCircle, showChipTray && styles.miniToggleCircleActive]} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Spot Check Interval</Text>
                                <View style={styles.deckSelector}>
                                    {[0, 5, 10, 20].map(i => (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => setCheckInterval(i)}
                                            style={[styles.deckOption, checkInterval === i && styles.deckOptionActive]}
                                        >
                                            <Text style={[styles.deckOptionText, checkInterval === i && styles.deckOptionTextActive]}>
                                                {i === 0 ? 'OFF' : i}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Chaos Mode (Distractions)</Text>
                                <TouchableOpacity
                                    onPress={() => setIsDistractionActive(!isDistractionActive)}
                                    style={[styles.miniToggle, isDistractionActive && styles.miniToggleActive]}
                                >
                                    <View style={[styles.miniToggleCircle, isDistractionActive && styles.miniToggleCircleActive]} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.settingsGroup}>
                            <Text style={styles.groupLabel}>CASINO RULES</Text>
                            <View style={styles.settingItem}>
                                <Text style={styles.settingLabel}>Decks in Shoe</Text>
                                <View style={styles.deckSelector}>
                                    {[1, 2, 6, 8].map(d => (
                                        <TouchableOpacity
                                            key={d}
                                            onPress={() => setDeckCount(d)}
                                            style={[styles.deckOption, deckCount === d && styles.deckOptionActive]}
                                        >
                                            <Text style={[styles.deckOptionText, deckCount === d && styles.deckOptionTextActive]}>{d}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setShowSettings(false)}
                        >
                            <Text style={styles.modalCloseBtnText}>APPLY_CHANGES</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Count Check Modal (Spot Check) */}
            <Modal
                visible={showCountCheck}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCountCheck(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>SPOT_CHECK</Text>
                            <TouchableOpacity onPress={() => setShowCountCheck(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>Verify your math precision</Text>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Running Count</Text>
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
                                <Text style={styles.inputLabel}>True Count</Text>
                                <TextInput
                                    style={styles.input}
                                    value={userInputTC}
                                    onChangeText={setUserInputTC}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={colors.textTertiary}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={handleCountCheck}
                        >
                            <Text style={styles.modalCloseBtnText}>VERIFY_PRECISION</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalBtn, { marginTop: 10 }]}
                            onPress={() => setShowCountCheck(false)}
                        >
                            <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>Abort</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <DistractionLayer isActive={isDistractionActive} />
        </View>
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
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
        zIndex: 100,
        elevation: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    backButton: {
        padding: 4,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    headerIcon: {
        padding: 4,
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
        gap: 6,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        marginHorizontal: 3,
    },
    statLabel: {
        color: colors.textTertiary,
        fontSize: 7,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    statValue: {
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '700',
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
        alignSelf: 'flex-start', // Fix elongation
        minWidth: 120,
    },
    heatSectionWrapper: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 5,
    },
    heatGraphSide: {
        // Removed flex: 1
    },
    heatLabel: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    gameTable: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden', // Clip the neonArch so it doesn't cover the header
        paddingTop: 30, // Space for table text with rotateX transform
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
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    headerCore: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    headerBankroll: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    headerAccuracy: {
        alignItems: 'flex-start',
    },
    headerAccuracyLabel: {
        color: colors.textTertiary,
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    headerAccuracyValue: {
        fontSize: 13,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    topHud: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        zIndex: 50,
        elevation: 5,
        backgroundColor: 'transparent',
    },
    hudBadge: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    hudBadgeText: {
        color: colors.textSecondary,
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 2,
    },
    tableCenter: {
        flex: 1,
        justifyContent: 'space-evenly', // Changed from center to space-evenly
        alignItems: 'center',
        paddingVertical: 20, // Increased padding
        zIndex: 20,
    },
    handArea: {
        alignItems: 'center',
        minHeight: 100,
    },
    dealerHandArea: {
        alignItems: 'center',
        minHeight: 100,
        // marginBottom removed for space-evenly
    },
    cardOverlapRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        zIndex: 100,
        elevation: 10,
    },
    cardInHand: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    handLabel: {
        marginTop: 5,
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 4,
    },
    potArea: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    betStackContainer: {
        alignItems: 'center',
    },
    betStack: {
        width: 44,
        height: 30,
        position: 'relative',
    },
    betStackChip: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 12,
        borderRadius: 30,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        opacity: 0.8,
    },
    betLabelBadge: {
        marginTop: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    betLabelText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    placeBetPrompt: {
        color: 'rgba(255,255,255,0.1)',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 5,
    },
    resultOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    resultBox: {
        backgroundColor: 'rgba(26, 26, 26, 0.95)',
        paddingVertical: 35,
        paddingHorizontal: 25,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        width: '85%',
        maxWidth: 340,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    resultMainText: {
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 25,
        textAlign: 'center',
        lineHeight: 32,
    },
    nextHandBtn: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    nextHandBtnText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 1,
    },
    controlPanel: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        padding: 15,
    },
    bettingFlow: {
        gap: 15,
    },
    chipScroll: {
        paddingVertical: 10,
        gap: 10,
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    dealRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clearBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceDark,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    mainDealBtn: {
        paddingHorizontal: 60,
        height: 50,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.success,
    },
    mainDealBtnText: {
        color: colors.success,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 2,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    actionBtn: {
        flex: 1,
        height: 55,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    hitBtn: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: '#22c55e',
    },
    standBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#ef4444',
    },
    doubleBtn: {
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: colors.primary,
    },
    splitBtn: {
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: '#f59e0b',
    },
    btnActionDisabled: {
        opacity: 0.2,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    btnDisabled: {
        opacity: 0.5,
        backgroundColor: colors.surfaceDark,
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
        backgroundColor: colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    betAmount: {
        color: colors.primary,
        fontSize: 24,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    chipTray: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    activeBetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
        marginBottom: 20,
        gap: 15,
    },
    activeBetDisplay: {
        alignItems: 'center',
    },
    activeBetLabel: {
        color: colors.textTertiary,
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
    },
    activeBetValue: {
        color: colors.primary,
        fontSize: 20,
        fontWeight: '700',
    },
    clearBetBtn: {
        padding: 8,
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderRadius: 4,
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
    hitBtnText: { color: colors.success },
    standBtnText: { color: colors.error },
    doubleBtnText: { color: colors.primary },
    splitBtnText: { color: colors.warning },
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
        padding: 20,
        width: '90%',
        maxWidth: 360,
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
    inputGroup: {
        gap: 15,
        marginBottom: 25,
    },
    inputContainer: {
        marginBottom: 0,
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    settingsGroup: {
        marginBottom: 25,
    },
    groupLabel: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: colors.surfaceDark,
        padding: 12,
        borderRadius: 4,
    },
    settingLabel: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    miniToggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.surfaceLight,
        padding: 2,
    },
    miniToggleActive: {
        backgroundColor: colors.primary,
    },
    miniToggleCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.textSecondary,
    },
    miniToggleCircleActive: {
        backgroundColor: '#FFF',
        transform: [{ translateX: 20 }],
    },
    deckSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    deckOption: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    deckOptionActive: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
    },
    deckOptionText: {
        color: colors.textSecondary,
        fontWeight: 'bold',
        fontSize: 12,
    },
    deckOptionTextActive: {
        color: colors.primary,
    },
    modalCloseBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    modalCloseBtnText: {
        color: '#FFF',
        fontWeight: '900',
        letterSpacing: 2,
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
    tableTitleContainer: {
        position: 'absolute',
        top: '4%', // Pushed up to match bottom spacing
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.15,
        zIndex: 1,
        pointerEvents: 'none',
    },
    tableTextContainer: {
        position: 'absolute',
        bottom: '4%', // Pushed down to bottom
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.2,
        zIndex: 1,
        pointerEvents: 'none',
    },
    tableTextTitle: {
        color: colors.primary,
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 4,
        textShadowColor: colors.primary,
        textShadowRadius: 10,
    },
    tableTextSubtitle: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 3,
        marginTop: 4,
        marginBottom: 12,
    },
    tableTextRules: {
        color: colors.textTertiary,
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 2,
    },
    neonArch: {
        position: 'absolute',
        top: '-15%',
        left: -100,
        right: -100,
        height: 600,
        borderRadius: 600,
        borderWidth: 2,
        borderColor: colors.primary,
        opacity: 0.08,
        zIndex: 1, // Layer 1
        pointerEvents: 'none',
    },
    bettingRing: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.primary,
        opacity: 0.15,
        backgroundColor: 'rgba(6, 182, 212, 0.02)',
    },
});
