
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
    ScrollView,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { Card as CardComponent } from '../../components/Card';
import { Card as CardType, Suit, Rank } from '@card-counter-ai/shared';
import { colors } from '../../theme/colors';
import { fontStyles } from '../../theme/typography';
import { useProgressStore, MASTERY_REQUIREMENTS } from '../../store/useProgressStore';
import { generateScenario, Action, Scenario } from '../../utils/basicStrategy';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { PhaseIntroModal } from '../../components/PhaseIntroModal';
import { HapticEngine } from '../../utils/HapticEngine';

const { width } = Dimensions.get('window');
const CARDS_PER_SESSION = MASTERY_REQUIREMENTS.PHASE_0.CARDS_PER_SESSION;

const triggerHaptic = (type: 'success' | 'error' | 'selection') => {
    switch (type) {
        case 'success':
            HapticEngine.triggerSuccess();
            break;
        case 'error':
            HapticEngine.triggerError();
            break;
        case 'selection':
            HapticEngine.triggerSelection();
            break;
    }
};

interface SessionSummary {
    correct: number;
    total: number;
    accuracy: number;
    isMastery: boolean;
    consecutiveProgress: number;
    phaseComplete: boolean;
}

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

// Create a displayable Card object from a rank string
const createCardFromString = (rankStr: string, index: number): CardType => {
    const suits = [Suit.SPADES, Suit.HEARTS, Suit.CLUBS, Suit.DIAMONDS];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return {
        id: `card-${index}-${Date.now()}`,
        rank: rankStr as Rank,
        suit: suit,
    };
};

const getCardValue = (rank: string): number => {
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    if (rank === 'A') return 11;
    return parseInt(rank, 10);
};

const calculateHandValue = (hand: string[]): { value: number; isSoft: boolean } => {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
        if (['J', 'Q', 'K'].includes(card)) value += 10;
        else if (card === 'A') {
            value += 11;
            aces += 1;
        } else {
            value += parseInt(card, 10);
        }
    }

    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }

    const isSoft = aces > 0 && value <= 21;
    return { value, isSoft };
};

// -----------------------------------------------------------------------------
// CHEATSHEET COMPONENT
// -----------------------------------------------------------------------------

const CheatsheetModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {

    // Improved Row Rendering
    const renderCell = (content: string, isHeader: boolean, isFirst: boolean) => {
        const getActionStyle = (action: string) => {
            if (action === 'H' || action === 'Hit') return styles.actionHit;
            if (action === 'S' || action === 'Stand') return styles.actionStand;
            if (action === 'D' || action === 'Double') return styles.actionDouble;
            if (action === 'P' || action === 'Split') return styles.actionSplit;
            return {};
        };

        // Parse content like "H" or "D (S)" or "Stand"
        let display = content;
        let style = {};

        if (!isHeader && !isFirst) {
            // Simplified actions for cleaner grid
            if (content.startsWith('Hit')) { display = 'H'; style = styles.actionHit; }
            else if (content.startsWith('Stand')) { display = 'S'; style = styles.actionStand; }
            else if (content.startsWith('Double')) { display = 'D'; style = styles.actionDouble; }
            else if (content.startsWith('Split')) { display = 'P'; style = styles.actionSplit; }

            // Handle complex cases if needed, but for visual clarity, letters are standard in blackjack charts
            // Actually, keep it simple for now as per previous version but styled better
            // Let's stick to full words but minimalized? 
            // Better: Use clear abbreviations or color blocks
        }

        return (
            <View style={[styles.gridCell, isFirst && styles.gridCellFirst, isHeader && styles.gridCellHeader, !isHeader && !isFirst && style]}>
                <Text style={[styles.gridText, isHeader && styles.gridTextHeader, isFirst && styles.gridTextLabel, !isHeader && !isFirst && styles.gridTextAction]}>
                    {content}
                </Text>
            </View>
        );
    };

    const renderGridRow = (col1: string, col2: string, col3: string, col4: string, col5: string) => (
        <View style={styles.gridRow}>
            <View style={[styles.gridCell, styles.gridCellLabel]}>
                <Text style={styles.gridTextLabel}>{col1}</Text>
            </View>
            <View style={[styles.gridCell, getCellStyle(col2)]}>
                <Text style={styles.gridTextAction}>{col2}</Text>
            </View>
            <View style={[styles.gridCell, getCellStyle(col3)]}>
                <Text style={styles.gridTextAction}>{col3}</Text>
            </View>
            <View style={[styles.gridCell, getCellStyle(col4)]}>
                <Text style={styles.gridTextAction}>{col4}</Text>
            </View>
            <View style={[styles.gridCell, getCellStyle(col5)]}>
                <Text style={styles.gridTextAction}>{col5}</Text>
            </View>
        </View>
    );

    const getCellStyle = (action: string) => {
        if (action === 'H') return styles.bgHit;
        if (action === 'S') return styles.bgStand;
        if (action === 'D') return styles.bgDouble;
        if (action === 'P') return styles.bgSplit;
        if (action === 'Ds') return styles.bgDoubleStand; // Double or Stand
        return {};
    };

    const LegendItem = ({ color, label, char }: { color: string, label: string, char: string }) => (
        <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: color }]}>
                <Text style={styles.legendChar}>{char}</Text>
            </View>
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide">
            <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
                <View style={styles.csContainer}>
                    <View style={styles.csHeader}>
                        <Text style={styles.csTitle}>Strategy Chart</Text>
                        <TouchableOpacity onPress={onClose} style={styles.csCloseBtn}>
                            <Text style={styles.csCloseText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.legendContainer}>
                        <LegendItem color={colors.success} label="Hit" char="H" />
                        <LegendItem color={colors.error} label="Stand" char="S" />
                        <LegendItem color={colors.primary} label="Double" char="D" />
                        <LegendItem color={colors.warning} label="Split" char="P" />
                    </View>

                    <ScrollView style={styles.csContent}>
                        {/* Header Row */}
                        <View style={styles.gridHeaderRow}>
                            <Text style={[styles.gridHeaderLabel, { flex: 1.2 }]}>Your Hand</Text>
                            <Text style={styles.gridHeaderLabel}>2-3</Text>
                            <Text style={styles.gridHeaderLabel}>4-6</Text>
                            <Text style={styles.gridHeaderLabel}>7-9</Text>
                            <Text style={styles.gridHeaderLabel}>10-A</Text>
                        </View>

                        <Text style={styles.csSectionTitle}>Hard Totals</Text>
                        {renderGridRow('17+', 'S', 'S', 'S', 'S')}
                        {renderGridRow('13-16', 'S', 'S', 'H', 'H')}
                        {renderGridRow('12', 'H', 'S', 'H', 'H')}
                        {renderGridRow('11', 'D', 'D', 'D', 'D')}
                        {renderGridRow('10', 'D', 'D', 'D', 'H')}
                        {renderGridRow('9', 'H', 'D', 'H', 'H')}
                        {renderGridRow('5-8', 'H', 'H', 'H', 'H')}

                        <Text style={styles.csSectionTitle}>Soft Totals</Text>
                        {renderGridRow('S 19+', 'S', 'S', 'S', 'S')}
                        {renderGridRow('S 18', 'Is', 'D', 'S', 'H')}
                        {renderGridRow('S 17', 'H', 'D', 'H', 'H')}
                        {renderGridRow('S 15-16', 'H', 'D', 'H', 'H')}
                        {renderGridRow('S 13-14', 'H', 'D', 'H', 'H')}

                        <Text style={styles.csSectionTitle}>Pairs</Text>
                        {renderGridRow('A,A', 'P', 'P', 'P', 'P')}
                        {renderGridRow('10,10', 'S', 'S', 'S', 'S')}
                        {renderGridRow('9,9', 'P', 'P', 'S', 'S')}
                        {renderGridRow('8,8', 'P', 'P', 'P', 'P')}
                        {renderGridRow('6,6 / 7,7', 'P', 'P', 'H', 'H')}
                        {renderGridRow('5,5', 'D', 'D', 'D', 'H')}
                        {renderGridRow('4,4', 'H', 'P', 'H', 'H')}
                        {renderGridRow('2,2 / 3,3', 'P', 'P', 'H', 'H')}

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </View>
            </BlurView>
        </Modal>
    );
};


// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export const Phase0BasicStrategy: React.FC<{ navigation?: any }> = ({ navigation }) => {
    const [scenario, setScenario] = useState<Scenario>(generateScenario());
    const [dealerCardObj, setDealerCardObj] = useState<CardType>(createCardFromString(scenario.dealerCard, 0));
    const [playerHandObjs, setPlayerHandObjs] = useState<CardType[]>(
        scenario.playerHand.map((r, i) => createCardFromString(r, i + 1))
    );

    const [userAnswer, setUserAnswer] = useState<Action | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [sessionComplete, setSessionComplete] = useState(false);
    const [summary, setSummary] = useState<SessionSummary | null>(null);
    const [startTime] = useState(Date.now());
    const [showCheatsheet, setShowCheatsheet] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Derived values
    const playerTotal = calculateHandValue(scenario.playerHand);
    const dealerTotal = getCardValue(scenario.dealerCard); // Dealer only shows 1 card

    // Progress store
    const {
        addSessionResult,
        phase0ConsecutivePerfect,
        phase0Complete,
        updateStreak
    } = useProgressStore();

    const showNextScenario = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            const newScenario = generateScenario();
            setScenario(newScenario);
            setDealerCardObj(createCardFromString(newScenario.dealerCard, 0));
            setPlayerHandObjs(newScenario.playerHand.map((r, i) => createCardFromString(r, i + 1)));

            setUserAnswer(null);
            setIsCorrect(null);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleAnswer = (action: Action) => {
        if (userAnswer !== null) return;

        setUserAnswer(action);
        const correct = action === scenario.correctAction;

        triggerHaptic(correct ? 'success' : 'error');

        setIsCorrect(correct);
        const newScore = {
            correct: score.correct + (correct ? 1 : 0),
            total: score.total + 1,
        };
        setScore(newScore);

        // If correct, move on automatically. If wrong, wait for user to acknowledge.
        if (correct) {
            // Check if session is complete
            if (newScore.total >= CARDS_PER_SESSION) {
                setTimeout(() => {
                    completeSession(newScore);
                }, 1500);
            } else {
                setTimeout(() => {
                    showNextScenario();
                }, 1500);
            }
        }
        // If incorrect, we stay on this screen to user can handleContinue
    };

    const handleContinue = () => {
        if (score.total >= CARDS_PER_SESSION) {
            completeSession(score);
        } else {
            showNextScenario();
        }
    };

    const completeSession = (finalScore: { correct: number; total: number }) => {
        const accuracy = finalScore.correct / finalScore.total;
        const isMastery = accuracy >= MASTERY_REQUIREMENTS.PHASE_0.REQUIRED_ACCURACY;
        const newConsecutive = isMastery ? phase0ConsecutivePerfect + 1 : 0;
        const isPhaseComplete = phase0Complete || newConsecutive >= MASTERY_REQUIREMENTS.PHASE_0.CONSECUTIVE_SESSIONS;

        // Save session result
        addSessionResult('phase0', {
            phase: 'phase0',
            accuracy,
            cardsCompleted: finalScore.total,
            timeInSeconds: Math.floor((Date.now() - startTime) / 1000),
            timestamp: Date.now(),
        });

        // Update streak
        updateStreak();

        setSummary({
            correct: finalScore.correct,
            total: finalScore.total,
            accuracy,
            isMastery,
            consecutiveProgress: Math.min(newConsecutive, MASTERY_REQUIREMENTS.PHASE_0.CONSECUTIVE_SESSIONS),
            phaseComplete: isPhaseComplete,
        });
        setSessionComplete(true);
    };

    const startNewSession = () => {
        setScore({ correct: 0, total: 0 });
        setSessionComplete(false);
        setSummary(null);
        showNextScenario();
    };

    const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
    const progress = score.total / CARDS_PER_SESSION;

    return (
        <View style={styles.container}>
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>HANDS</Text>
                    <Text style={styles.statValue}>
                        <Text style={styles.neonCyan}>{score.total}</Text>
                        <Text style={styles.statDivider}>/{CARDS_PER_SESSION}</Text>
                    </Text>
                </View>

                {/* Cheatsheet Button */}
                <TouchableOpacity
                    style={styles.cheatsheetButton}
                    onPress={() => setShowCheatsheet(true)}
                >
                    <Text style={styles.cheatsheetIcon}>?</Text>
                    <Text style={styles.cheatsheetText}>Reference</Text>
                </TouchableOpacity>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>ACCURACY</Text>
                    <Text style={[styles.statValue, accuracy >= 95 ? styles.neonGreen : styles.neonCyan]}>
                        {accuracy.toFixed(0)}%
                    </Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Animated.View style={[styles.gameArea, { opacity: fadeAnim, flex: 1, justifyContent: 'center' }]}>

                    {/* Dealer Area */}
                    <View style={styles.dealerArea}>
                        <View style={styles.labelRow}>
                            <Text style={styles.areaLabel}>DEALER SHOWS</Text>
                            <View style={styles.valueBadge}>
                                <Text style={styles.valueText}>{dealerTotal}</Text>
                            </View>
                        </View>
                        <View style={styles.cardGlow}>
                            <CardComponent card={dealerCardObj} size="medium" />
                        </View>
                    </View>

                    {/* Player Area */}
                    <View style={styles.playerArea}>
                        <View style={styles.labelRow}>
                            <Text style={styles.areaLabel}>YOUR HAND</Text>
                            <View style={styles.valueBadge}>
                                <Text style={styles.valueText}>
                                    {playerTotal.isSoft ? `Soft ${playerTotal.value}` : playerTotal.value}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.handContainer}>
                            <View style={[styles.cardGlow, { transform: [{ rotate: '-5deg' }], marginRight: -40 }]}>
                                <CardComponent card={playerHandObjs[0]} size="medium" />
                            </View>
                            <View style={[styles.cardGlow, { transform: [{ rotate: '5deg' }] }]}>
                                <CardComponent card={playerHandObjs[1]} size="medium" />
                            </View>
                        </View>
                    </View>

                </Animated.View>

                {/* Feedback */}
                <View style={styles.feedbackContainer}>
                    {isCorrect !== null ? (
                        <TouchableOpacity
                            style={[
                                styles.feedback,
                                isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
                            ]}
                            onPress={!isCorrect ? handleContinue : undefined}
                            activeOpacity={!isCorrect ? 0.8 : 1}
                        >
                            <Text style={[
                                styles.feedbackText,
                                isCorrect ? styles.neonGreen : styles.neonPink
                            ]}>
                                {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                            </Text>
                            <Text style={styles.feedbackValue}>
                                {scenario.explanation}
                            </Text>
                            {!isCorrect && (
                                <Text style={styles.correctActionText}>Correct: {scenario.correctAction}</Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.feedbackSpacer} />
                    )}
                </View>
            </View>

            {/* Answer Buttons */}
            <View style={styles.answerSection}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.hitButton,
                            userAnswer === 'HIT' && styles.selectedButton
                        ]}
                        onPress={() => handleAnswer('HIT')}
                        disabled={userAnswer !== null}
                    >
                        <Text style={[styles.actionButtonText, styles.hitText]}>HIT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.standButton,
                            userAnswer === 'STAND' && styles.selectedButton
                        ]}
                        onPress={() => handleAnswer('STAND')}
                        disabled={userAnswer !== null}
                    >
                        <Text style={[styles.actionButtonText, styles.standText]}>STAND</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.doubleButton,
                            userAnswer === 'DOUBLE' && styles.selectedButton
                        ]}
                        onPress={() => handleAnswer('DOUBLE')}
                        disabled={userAnswer !== null}
                    >
                        <Text style={[styles.actionButtonText, styles.doubleText]}>DOUBLE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            styles.splitButton,
                            userAnswer === 'SPLIT' && styles.selectedButton,
                            scenario.type !== 'PAIR' && styles.disabledButton
                        ]}
                        onPress={() => handleAnswer('SPLIT')}
                        disabled={userAnswer !== null || scenario.type !== 'PAIR'}
                    >
                        <Text style={[
                            styles.actionButtonText,
                            styles.splitText,
                            scenario.type !== 'PAIR' && styles.disabledButtonText
                        ]}>SPLIT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Cheatsheet Modal */}
            <CheatsheetModal visible={showCheatsheet} onClose={() => setShowCheatsheet(false)} />

            {/* Intro Modal */}
            <PhaseIntroModal
                visible={showIntro}
                phase="phase0"
                onStart={() => setShowIntro(false)}
            />

            {/* Session Complete Modal */}
            <Modal
                visible={sessionComplete}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Session Complete!</Text>

                        {summary && (
                            <>
                                <View style={styles.summaryStats}>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Score</Text>
                                        <Text style={styles.summaryValue}>
                                            {summary.correct}/{summary.total}
                                        </Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Accuracy</Text>
                                        <Text style={[
                                            styles.summaryValue,
                                            summary.isMastery ? styles.neonGreen : styles.neonPink
                                        ]}>
                                            {(summary.accuracy * 100).toFixed(1)}%
                                        </Text>
                                    </View>
                                </View>

                                {summary.isMastery ? (
                                    <View style={styles.masteryBadge}>
                                        <Text style={styles.masteryText}>🎯 MASTERY SESSION!</Text>
                                        <Text style={styles.masterySubtext}>95%+ Accuracy</Text>
                                    </View>
                                ) : (
                                    <View style={styles.retryBadge}>
                                        <Text style={styles.retryText}>Need 95% to progress</Text>
                                    </View>
                                )}

                                {/* Progress toward phase completion */}
                                <View style={styles.phaseProgress}>
                                    <Text style={styles.phaseProgressLabel}>
                                        Mastery Progress: {summary.consecutiveProgress}/{MASTERY_REQUIREMENTS.PHASE_0.CONSECUTIVE_SESSIONS}
                                    </Text>
                                    <View style={styles.phaseProgressDots}>
                                        {Array.from({ length: MASTERY_REQUIREMENTS.PHASE_0.CONSECUTIVE_SESSIONS }).map((_, i) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.progressDot,
                                                    i < summary.consecutiveProgress && styles.progressDotFilled,
                                                ]}
                                            />
                                        ))}
                                    </View>
                                </View>

                                {summary.phaseComplete && (
                                    <View style={styles.completeBadge}>
                                        <Text style={styles.completeText}>🏆 PHASE 0 COMPLETE!</Text>
                                        <Text style={styles.completeSubtext}>Basic Strategy Mastered</Text>
                                    </View>
                                )}
                            </>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButtonSecondary}
                                onPress={() => navigation?.goBack()}
                            >
                                <Text style={styles.modalButtonSecondaryText}>Back to Menu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButtonPrimary}
                                onPress={startNewSession}
                            >
                                <Text style={styles.modalButtonPrimaryText}>Practice Again</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    progressBarContainer: {
        height: 3,
        backgroundColor: colors.surface,
    },
    progressBar: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    statsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    statItem: {
        alignItems: 'center',
        width: 80,
    },
    statLabel: {
        fontSize: 10,
        color: colors.textTertiary,
        marginBottom: 4,
        letterSpacing: 1.5,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 20,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    statDivider: {
        color: colors.textTertiary,
        fontSize: 14,
    },
    statDividerVertical: {
        width: 1,
        height: 24,
        backgroundColor: colors.border,
    },

    // Cheatsheet Button
    cheatsheetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cheatsheetIcon: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 6,
    },
    cheatsheetText: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },

    neonCyan: {
        color: colors.primary,
        textShadowColor: colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    neonGreen: {
        color: colors.success,
        textShadowColor: colors.success,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    neonPink: {
        color: colors.accent,
        textShadowColor: colors.error,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    gameArea: {
        alignItems: 'center',
        width: '100%',
    },
    dealerArea: {
        alignItems: 'center',
        marginBottom: 30,
    },
    playerArea: {
        alignItems: 'center',
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    areaLabel: {
        ...fontStyles.caption,
        color: colors.textTertiary,
        letterSpacing: 2,
        marginBottom: 0,
    },
    valueBadge: {
        backgroundColor: colors.surfaceLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    valueText: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    handContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    cardGlow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    feedbackContainer: {
        position: 'absolute',
        bottom: 20, // Move it up from bottom
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100, // Make sure it's on top
        elevation: 10,
    },
    feedback: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        width: '90%',
        backgroundColor: colors.surface,
        borderWidth: 2, // Thicker border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    feedbackSpacer: {
        height: 0, // No spacer needed if absolute
    },
    feedbackCorrect: {
        borderColor: colors.success,
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    feedbackIncorrect: {
        borderColor: colors.error,
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    feedbackText: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 4,
    },
    feedbackValue: {
        ...fontStyles.body,
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    correctActionText: {
        ...fontStyles.caption,
        color: colors.success,
        marginTop: 4,
        fontWeight: 'bold',
    },
    answerSection: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 30,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    hitButton: {
        borderColor: colors.success,
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    standButton: {
        borderColor: colors.error,
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    doubleButton: {
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    splitButton: {
        borderColor: colors.warning,
        shadowColor: colors.warning,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    disabledButton: {
        opacity: 0.5,
        borderColor: colors.border,
    },
    selectedButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 2,
    },
    hitText: { color: colors.success },
    standText: { color: colors.error },
    doubleText: { color: colors.primary },
    splitText: { color: colors.warning },
    disabledButtonText: {
        color: colors.textSecondary,
    },

    // Modal styles (shared mostly)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: 4,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    summaryStats: {
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    summaryLabel: {
        ...fontStyles.body,
        color: colors.textSecondary,
    },
    summaryValue: {
        ...fontStyles.body,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    masteryBadge: {
        backgroundColor: `${colors.success}20`,
        borderWidth: 1,
        borderColor: colors.success,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    masteryText: {
        color: colors.success,
        fontWeight: 'bold',
        fontSize: 18,
    },
    masterySubtext: {
        color: colors.textSecondary,
        marginTop: 4,
    },
    retryBadge: {
        backgroundColor: `${colors.accent}20`,
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    retryText: {
        color: colors.accent,
        fontWeight: '600',
    },
    phaseProgress: {
        alignItems: 'center',
        marginBottom: 20,
    },
    phaseProgressLabel: {
        color: colors.textSecondary,
        marginBottom: 8,
    },
    phaseProgressDots: {
        flexDirection: 'row',
        gap: 8,
    },
    progressDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
    },
    progressDotFilled: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    completeBadge: {
        backgroundColor: `${colors.info}20`,
        borderWidth: 2,
        borderColor: colors.info,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    completeText: {
        color: colors.info,
        fontWeight: 'bold',
        fontSize: 20,
    },
    completeSubtext: {
        color: colors.textSecondary,
        marginTop: 4,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButtonSecondary: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    modalButtonSecondaryText: {
        color: colors.textSecondary,
        fontWeight: '600',
    },
    modalButtonPrimary: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    modalButtonPrimaryText: {
        color: colors.textPrimary,
        fontWeight: '600',
    },

    // CS Styles
    csContainer: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        width: '95%',
        height: '80%',
        maxWidth: 500,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    csHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    csTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    csCloseBtn: {
        padding: 8,
    },
    csCloseText: {
        fontSize: 20,
        color: colors.textSecondary,
    },
    csContent: {
        padding: 0,
    },
    csSectionTitle: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 10,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendChar: {
        fontSize: 10,
        color: '#FFF',
        fontWeight: 'bold',
    },
    legendLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },

    // Grid Styles
    gridHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 10,
    },
    gridHeaderLabel: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textSecondary,
    },
    gridRow: {
        flexDirection: 'row',
        height: 44, // Fixed height for rows
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    gridCell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.05)',
    },
    gridCellLabel: {
        flex: 1.2,
        backgroundColor: 'rgba(255,255,255,0.02)',
        alignItems: 'flex-start',
        paddingLeft: 12,
        borderRightColor: colors.border,
    },
    gridTextLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    gridTextAction: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    // Backgrounds for Actions
    bgHit: {
        backgroundColor: `${colors.success}90`,
    },
    bgStand: {
        backgroundColor: `${colors.accent}90`,
    },
    bgDouble: {
        backgroundColor: `${colors.primary}90`,
    },
    bgSplit: {
        backgroundColor: `${colors.warning}90`,
    },
    bgDoubleStand: {
        backgroundColor: `${colors.primary}50`, // Dashed? Or just indicate double
        // For simplicity, just use double color but maybe text indicates 'Ds'?
        // In this simplified view, we just show Double color. The text 'D' or 'Is' handles it.
    },
    gridCellFirst: {
        borderRightWidth: 0,
    },
    gridCellHeader: {
        backgroundColor: 'transparent',
    },
    gridTextHeader: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    gridText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    actionHit: { color: colors.success },
    actionStand: { color: colors.error },
    actionDouble: { color: colors.primary },
    actionSplit: { color: colors.warning },
});
