import { create } from 'zustand';

interface SimState {
  // State variables
  runningCount: number;
  trueCountUserEstimate: number;
  trueCountGroundTruth: number;
  bankroll: number;
  suspicionLevel: number; // 0-100 representing "Pit Boss Suspicion"

  // Actions
  setRunningCount: (count: number) => void;
  setTrueCountUserEstimate: (count: number) => void;
  setTrueCountGroundTruth: (count: number) => void;
  setBankroll: (amount: number) => void;
  setSuspicionLevel: (level: number) => void;
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

  setRunningCount: (count) => set({ runningCount: count }),
  setTrueCountUserEstimate: (count) => set({ trueCountUserEstimate: count }),
  setTrueCountGroundTruth: (count) => set({ trueCountGroundTruth: count }),
  setBankroll: (amount) => set({ bankroll: amount }),
  setSuspicionLevel: (level) => set({ suspicionLevel: level }),
  
  updateBankroll: (delta) => set((state) => ({ bankroll: state.bankroll + delta })),
  
  resetSimState: () => set({
    runningCount: 0,
    trueCountUserEstimate: 0,
    trueCountGroundTruth: 0,
    bankroll: 1000,
    suspicionLevel: 0,
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
