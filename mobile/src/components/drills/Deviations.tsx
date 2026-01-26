import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shoe, Rank, Card } from '@card-counter-ai/shared';
import { useSimState } from '../../store/SimState';
import { getBasicStrategyAction, Action } from '../../utils/basicStrategy';
import { Card as CardComponent } from '../Card';
import { colors } from '../../theme/colors';

// Illustrious 18 Deviation Map (Subset for implementation)
// Key format: "PlayerHand_vs_DealerRank"
// PlayerHand can be "Total", "Rank,Rank" for pairs, "A,Rank" for soft?
// Simplified: "HardTotal_vs_DealerRank", "PairRank_vs_DealerRank", "SoftTotal_vs_DealerRank"
interface DeviationRule {
  trigger: number; // True Count >= this value
  action: Action | 'INSURANCE';
  description: string;
}

const DEVIATIONS_MAP: Record<string, DeviationRule> = {
  // Insurance: Dealer Ace? If trueCount >= 3, Action: INSURANCE.
  'INSURANCE': { trigger: 3, action: 'INSURANCE', description: 'Take Insurance at TC >= 3' },

  // 16 vs 10 -> STAND at TC >= 0 (Basic Strategy is HIT)
  '16_vs_10': { trigger: 0, action: 'STAND', description: 'Stand on 16 v 10 at TC >= 0' },
  
  // 15 vs 10 -> STAND at TC >= 4 (Basic Strategy is HIT)
  '15_vs_10': { trigger: 4, action: 'STAND', description: 'Stand on 15 v 10 at TC >= 4' },
  
  // 10,10 vs 5 -> SPLIT at TC >= 5 (Basic Strategy is STAND)
  '10,10_vs_5': { trigger: 5, action: 'SPLIT', description: 'Split 10s v 5 at TC >= 5' },
  
  // 10,10 vs 6 -> SPLIT at TC >= 4 (Basic Strategy is STAND)
  '10,10_vs_6': { trigger: 4, action: 'SPLIT', description: 'Split 10s v 6 at TC >= 4' },
  
  // 12 vs 3 -> STAND at TC >= 2 (Basic Strategy is HIT)
  // Note: Prompt removed these specific examples but said "Use these 5 critical...". 
  // I will keep only the requested ones + Insurance.
  // Actually, I'll keep the ones I already had if they don't conflict, but strictly prompt asked for:
  // Insurance, 16v10, 15v10, 10,10v5, 10,10v6.
  // I will comment out the others to stay strict to the prompt or just leave them.
  // The prompt said "Use THESE 5 critical...", implying exclusivity for this task.
};

export const Deviations: React.FC = () => {
  const shoe = useRef(new Shoe(6)).current; // 6 Decks
  const { 
    trueCountGroundTruth, 
    setRunningCount, 
    setTrueCountGroundTruth, 
    incrementLogicErrors,
    resetSimState,
    trackEV // New action
  } = useSimState();

  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerCard, setDealerCard] = useState<Card | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [lastResult, setLastResult] = useState<'CORRECT' | 'ERROR' | null>(null);
  
  // Insurance State
  const [showInsurance, setShowInsurance] = useState(false);
  const insuranceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    resetSimState(); // Reset state on mount
    startNewHand();
    return () => {
        if (insuranceTimerRef.current) clearTimeout(insuranceTimerRef.current);
    };
  }, []);

  const startNewHand = () => {
    setFeedback('');
    setLastResult(null);
    setShowInsurance(false);

    // Ensure enough cards
    if (shoe.getCardsRemaining() < 10) {
      shoe.reset();
    }
    
    // Deal Hand
    const c1 = shoe.pop();
    const c2 = shoe.pop();
    const d1 = shoe.pop();

    if (c1 && c2 && d1) {
      setPlayerHand([c1, c2]);
      setDealerCard(d1);
      updateCounts();

      // Check for Insurance (Dealer Ace)
      if (d1.rank === Rank.ACE) {
          triggerInsuranceSnap();
      }
    }
  };

  const triggerInsuranceSnap = () => {
      setShowInsurance(true);
      // Auto-hide if no response? Or force response?
      // Prompt: "1.5-second 'Insurance Overlay'. The user must tap 'Yes' or 'No'"
      // Implies a timeout window.
      // If they don't tap in 1.5s, it counts as "No" or "Missed"? 
      // Let's assume they must tap quickly. If timeout -> default No.
      
      insuranceTimerRef.current = setTimeout(() => {
          if (showInsurance) {
             handleInsuranceResponse(false); // Default No
          }
      }, 1500);
  };

  const handleInsuranceResponse = (tookInsurance: boolean) => {
      if (insuranceTimerRef.current) clearTimeout(insuranceTimerRef.current);
      setShowInsurance(false);

      const rule = DEVIATIONS_MAP['INSURANCE'];
      const shouldTake = trueCountGroundTruth >= rule.trigger;

      if (tookInsurance === shouldTake) {
          // Correct
          if (shouldTake) {
              setFeedback('Insurance Taken (Correct)');
              trackEV(true, 'INSURANCE'); // Gain EV
          }
          // If shouldn't take and didn't, silent continue or feedback?
          // Drill usually gives positive feedback for everything.
      } else {
          // Wrong
          if (shouldTake && !tookInsurance) {
              setFeedback(`Missed Insurance! TC is ${trueCountGroundTruth.toFixed(1)}`);
              trackEV(false, 'INSURANCE'); // Lose EV
              incrementLogicErrors();
          } else if (!shouldTake && tookInsurance) {
              setFeedback(`Bad Insurance! TC is ${trueCountGroundTruth.toFixed(1)}`);
              trackEV(false, 'INSURANCE'); // Lose EV
              incrementLogicErrors();
          }
      }
  };

  const updateCounts = () => {
    const rc = shoe.getRunningCount();
    const decksRemaining = shoe.getCardsRemaining() / 52;
    const tc = shoe.getTrueCount(decksRemaining); 

    setRunningCount(rc);
    setTrueCountGroundTruth(tc); 
  };


  const getHandKey = (hand: Card[], dealer: Card): string => {
    const val1 = getCardValue(hand[0].rank);
    const val2 = getCardValue(hand[1].rank);
    const dealerVal = getCardValue(dealer.rank);

    // Check Pair
    if (val1 === val2) {
      // 10,10 vs 5
      if (val1 === 10) return `10,10_vs_${dealerVal}`;
    }

    // Check Hard Total (Simplified, ignoring Soft for key generation in this subset)
    const total = val1 + val2;
    return `${total}_vs_${dealerVal}`;
  };

  const getCardValue = (rank: Rank): number => {
    if ([Rank.JACK, Rank.QUEEN, Rank.KING, Rank.TEN].includes(rank)) return 10;
    if (rank === Rank.ACE) return 11;
    return parseInt(rank as string);
  };

  const handleAction = (userAction: Action) => {
    if (!dealerCard) return;

    const dealerValStr = getCardValue(dealerCard.rank).toString();
    const playerHandStr = playerHand.map(c => {
       if ([Rank.JACK, Rank.QUEEN, Rank.KING].includes(c.rank)) return '10';
       if (c.rank === Rank.TEN) return '10';
       return c.rank as string;
    });

    // 1. Determine Basic Strategy Action
    const basicAction = getBasicStrategyAction(playerHandStr, dealerValStr);
    
    // 2. Determine Deviation
    const handKey = getHandKey(playerHand, dealerCard);
    const deviation = DEVIATIONS_MAP[handKey];

    let correctAction = basicAction;
    let isDeviationRequired = false;

    // Check if Deviation applies
    if (deviation) {
      // Logic: If deviation.trigger is positive, we need TC >= trigger.
      // If trigger is negative (e.g. <= -2), logic might differ, but usually "Index" means >=.
      if (trueCountGroundTruth >= deviation.trigger) {
        correctAction = deviation.action;
        isDeviationRequired = true;
      }
    }

    // 3. Compare User Action
    if (userAction === correctAction) {
      setFeedback('Correct!');
      setLastResult('CORRECT');
      trackEV(true, isDeviationRequired ? 'DEVIATION' : 'BASIC');
      setTimeout(startNewHand, 1000);
    } else {
      setLastResult('ERROR');
      if (isDeviationRequired && userAction === basicAction) {
        setFeedback(`Missed Deviation! ${deviation.description} (TC: ${trueCountGroundTruth.toFixed(1)})`);
        trackEV(false, 'DEVIATION');
        incrementLogicErrors();
      } else {
        setFeedback(`Incorrect. Basic Strategy says ${basicAction}.`);
        trackEV(false, 'BASIC');
        incrementLogicErrors(); 
      }
      setTimeout(startNewHand, 2500);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>True Count: {trueCountGroundTruth.toFixed(1)}</Text>
      
      <View style={styles.table}>
        {/* Insurance Overlay */}
        {showInsurance && (
            <View style={styles.insuranceOverlay}>
                <Text style={styles.insuranceTitle}>INSURANCE?</Text>
                <View style={styles.insuranceBtns}>
                    <TouchableOpacity onPress={() => handleInsuranceResponse(true)} style={[styles.insBtn, styles.insYes]}>
                        <Text style={styles.insText}>YES</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleInsuranceResponse(false)} style={[styles.insBtn, styles.insNo]}>
                        <Text style={styles.insText}>NO</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.timerBar}>
                     {/* Could animate a bar here */}
                     <Text style={{color:'white'}}>Quick!</Text>
                </View>
            </View>
        )}

        {dealerCard && (
            <View style={styles.dealerArea}>
                <Text style={styles.label}>Dealer</Text>
                <CardComponent card={dealerCard} size="medium" />
            </View>
        )}
        
        <View style={styles.playerArea}>
             <Text style={styles.label}>Player</Text>
             <View style={styles.hand}>
                {playerHand.map(card => (
                    <CardComponent key={card.id} card={card} size="large" />
                ))}
             </View>
        </View>
      </View>

      <View style={styles.feedbackArea}>
        {feedback !== '' && (
             <Text style={[styles.feedbackText, lastResult === 'ERROR' ? styles.error : styles.success]}>
                 {feedback}
             </Text>
        )}
      </View>

      <View style={styles.controls}>
        {(['HIT', 'STAND', 'DOUBLE', 'SPLIT'] as Action[]).map(action => (
            <TouchableOpacity 
                key={action} 
                style={styles.button} 
                onPress={() => handleAction(action)}
            >
                <Text style={styles.buttonText}>{action}</Text>
            </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  table: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  dealerArea: {
    alignItems: 'center',
  },
  playerArea: {
    alignItems: 'center',
  },
  hand: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  feedbackArea: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  success: {
    color: colors.accentGreen,
  },
  error: {
    color: colors.accentRed || '#FF4444',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  insuranceOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
  },
  insuranceTitle: {
      color: '#FFF',
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 30,
  },
  insuranceBtns: {
      flexDirection: 'row',
      gap: 30,
  },
  insBtn: {
      width: 100,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
  },
  insYes: { backgroundColor: colors.accentGreen },
  insNo: { backgroundColor: colors.accentRed },
  insText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  timerBar: { marginTop: 20 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF', // colors.textOnPrimary
    fontWeight: 'bold',
    fontSize: 12,
  },
});
