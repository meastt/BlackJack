import { create } from 'zustand';

interface SimState {
  // State variables
  runningCount: number;
  trueCountUserEstimate: number;
  trueCountGroundTruth: number;
  bankroll: number;
  suspicionLevel: number; // 0-100 representing "Pit Boss Suspicion"
  logicErrors: number;
  speedErrors: number;
  evTracking: {
    theoreticalWin: number; // Total EV gained from correct plays
    mistakesCost: number; // EV lost from mistakes
  };

  // Actions
  setRunningCount: (count: number) => void;
  setTrueCountUserEstimate: (count: number) => void;
  setTrueCountGroundTruth: (count: number) => void;
  setBankroll: (amount: number) => void;
  setSuspicionLevel: (level: number) => void;
  incrementLogicErrors: () => void;
  incrementSpeedErrors: () => void;
  trackEV: (isCorrect: boolean, type: 'INSURANCE' | 'DEVIATION' | 'BASIC') => void;
  validateBet: (amount: number) => void;
  updateBankroll: (delta: number) => void;
  resetSimState: () => void;

  // Computed/Logic
  getSuggestedBet: (minBet: number) => number;
}

export const useSimState = create<SimState>((set, get) => ({
  runningCount: 0,
  trueCountUserEstimate: 0,
  trueCountGroundTruth: 0,
  bankroll: 1000, // Default starting bankroll
  suspicionLevel: 0,
  logicErrors: 0,
  speedErrors: 0,
  evTracking: { theoreticalWin: 0, mistakesCost: 0 },

  setRunningCount: (count) => set({ runningCount: count }),
  setTrueCountUserEstimate: (count) => set({ trueCountUserEstimate: count }),
  setTrueCountGroundTruth: (count) => set({ trueCountGroundTruth: count }),
  setBankroll: (amount) => set({ bankroll: amount }),
  setSuspicionLevel: (level) => set({ suspicionLevel: level }),
  incrementLogicErrors: () => set((state) => ({ logicErrors: state.logicErrors + 1 })),
  incrementSpeedErrors: () => set((state) => ({ speedErrors: state.speedErrors + 1 })),
  
  trackEV: (isCorrect, type) => set((state) => {
    // Simplified EV values for "Theoretical Win/Loss" simulation
    // Insurance at TC +3: +6% EV roughly? No, Insurance pays 2:1.
    // If TC >= 3, Insurance is +EV. Let's assign an arbitrary unit value for the drill tracking.
    // Say +0.1 Unit per correct decision, -0.1 Unit per incorrect.
    
    // More realistic: 
    // Insurance EV is approx +0.06 * Bet at TC +3.
    // Deviation EV varies.
    
    // For drill feedback, we'll use a standard unit of "EV Points".
    const unit = 0.5; // 0.5 units per decision
    
    if (isCorrect) {
        return { 
            evTracking: { 
                ...state.evTracking, 
                theoreticalWin: state.evTracking.theoreticalWin + unit 
            } 
        };
    } else {
        return { 
            evTracking: { 
                ...state.evTracking, 
                mistakesCost: state.evTracking.mistakesCost + unit 
            } 
        };
    }
  }),

  validateBet: (amount) => {
    const state = get();
    const suggested = state.getSuggestedBet(10); // Assume min bet 10 for now
    const { trueCountGroundTruth, suspicionLevel } = state;

    // Only monitor suspicion on High Counts (e.g. TC >= 2)
    if (trueCountGroundTruth >= 2) {
      const diff = Math.abs(amount - suggested);
      const percentDiff = diff / suggested;

      if (percentDiff > 0.2) {
        // Increase suspicion
        // Cap at 100
        const newSuspicion = Math.min(100, suspicionLevel + 10); // +10 per bad bet?
        set({ suspicionLevel: newSuspicion });
      }
    }
  },

  updateBankroll: (delta) => set((state) => ({ bankroll: state.bankroll + delta })),
  
  resetSimState: () => set({
    runningCount: 0,
    trueCountUserEstimate: 0,
    trueCountGroundTruth: 0,
    bankroll: 1000,
    suspicionLevel: 0,
    logicErrors: 0,
    speedErrors: 0,
    evTracking: { theoreticalWin: 0, mistakesCost: 0 },
  }),

  /**
   * Kelly Criterion Formula: Bet = (Edge / Variance) * Bankroll
   * Assumptions:
   * - House Edge at TC 0 is approx 0.5% (-0.005)
   * - Each True Count point adds ~0.5% advantage (+0.005)
   * - Variance is approx 1.33
   * - We use "Half Kelly" or fractional Kelly for safety often, but prompt asks for the formula.
   *   I will implement Full Kelly but clamped to 0 if edge is negative.
   */
  getSuggestedBet: (minBet: number) => {
    const { trueCountGroundTruth, bankroll } = get();
    
    // 1. Calculate Player Edge
    // Edge = (TC * 0.005) - 0.005
    // Example: TC 1 => 0% edge. TC 2 => 0.5% edge.
    const startingHouseEdge = 0.005;
    const advantagePerTc = 0.005;
    const playerEdge = (trueCountGroundTruth * advantagePerTc) - startingHouseEdge;

    if (playerEdge <= 0) {
      return minBet;
    }

    // 2. Variance for Blackjack (approx 1.33)
    const variance = 1.33;

    // 3. Kelly Fraction
    // f = Edge / Variance
    const kellyFraction = playerEdge / variance;

    // 4. Calculate Bet
    const suggestedBet = bankroll * kellyFraction;

    // Ensure we don't bet less than minBet if we have an edge (or maybe we do? Kelly says bet 0 if edge <= 0)
    // But usually in a casino you have to play minBet or leave.
    // If edge is positive, suggested bet should be at least minBet.
    return Math.max(minBet, Math.floor(suggestedBet));
  },
}));
