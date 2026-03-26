import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EdgeSessionSummary, ScenarioResult, getReadinessTier } from '../types/trainingMetrics';
import { AnalyticsService } from '../services/analyticsService';

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
  edgeScore: number;
  edgeHistory: number[];
  metrics: {
    evCaptured: number;
    mistakeCost: number;
    decisionLatencyMs: number;
    countIntegrity: number;
  };
  scenarioResults: ScenarioResult[];
  lastSessionSummary: EdgeSessionSummary | null;
  performanceStreak: number;
  bankrollHistory: number[];
  accuracyHistory: { correct: boolean, timestamp: number }[];
  isProMode?: boolean;
  certificationStatus?: 'PRO' | 'NONE';
  challengeStats?: {
    isActive: boolean;
    shoesCompleted: number;
    totalHands: number;
    correctCounts: number;
    countChecks: number;
    decisionErrors: number;
    maxHeat: number;
  };

  // Actions
  setRunningCount: (count: number) => void;
  setTrueCountUserEstimate: (count: number) => void;
  setTrueCountGroundTruth: (count: number) => void;
  setBankroll: (amount: number) => void;
  setSuspicionLevel: (level: number | ((prev: number) => number)) => void;
  incrementLogicErrors: () => void;
  incrementSpeedErrors: () => void;
  trackEV: (isCorrect: boolean, type: 'INSURANCE' | 'DEVIATION' | 'BASIC') => void;
  validateBet: (amount: number) => void;
  updateBankroll: (delta: number) => void;
  recordScenarioResult: (result: ScenarioResult) => void;
  finalizeEdgeSession: (startedAt: number) => EdgeSessionSummary;
  getReadinessTier: () => ReturnType<typeof getReadinessTier>;
  checkCount: (userRc: number, userTc: number, actualTc: number) => { isCorrectRc: boolean; isCorrectTc: boolean };
  resetSimState: () => void;

  toggleProMode: () => void;
  startChallenge: () => void;
  updateChallengeStats: (stats: any) => void;
  completeChallenge: () => { success: boolean; rubric: { failReason: string; improvementTip: string } };
  getAccuracy: () => number;

  // Computed/Logic
  getSuggestedBet: (minBet: number) => number;
}

export const useSimState = create<SimState>()(
  persist(
    (set, get) => ({
      runningCount: 0,
      trueCountUserEstimate: 0,
      trueCountGroundTruth: 0,
      bankroll: 1000, // Default starting bankroll
      suspicionLevel: 0,
      logicErrors: 0,
      speedErrors: 0,
      evTracking: { theoreticalWin: 0, mistakesCost: 0 },
      edgeScore: 500,
      edgeHistory: [500],
      metrics: {
        evCaptured: 0,
        mistakeCost: 0,
        decisionLatencyMs: 0,
        countIntegrity: 100,
      },
      scenarioResults: [],
      lastSessionSummary: null,
      performanceStreak: 0,
      bankrollHistory: [1000],
      accuracyHistory: [],

      setRunningCount: (count) => set({ runningCount: count }),
      setTrueCountUserEstimate: (count) => set({ trueCountUserEstimate: count }),
      setTrueCountGroundTruth: (count) => set({ trueCountGroundTruth: count }),
      setBankroll: (amount) => set((state) => {
        // Add to history if changed substantially or just push?
        return { bankroll: amount, bankrollHistory: [...state.bankrollHistory, amount] };
      }),
      setSuspicionLevel: (level) => set((state) => ({
        suspicionLevel: typeof level === 'function' ? level(state.suspicionLevel) : level
      })),
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

      updateBankroll: (delta) => set((state) => {
        const newBankroll = state.bankroll + delta;
        return {
          bankroll: newBankroll,
          bankrollHistory: [...state.bankrollHistory, newBankroll]
        };
      }),

      recordScenarioResult: (result) => set((state) => {
        const isPerfectScenario = result.correctCount && result.correctDecision && result.correctSizing;
        const currentStreak = isPerfectScenario ? state.performanceStreak + 1 : 0;
        const streakDecay = isPerfectScenario ? 0 : Math.min(20, state.performanceStreak * 2);

        const outcomeScore =
          (result.correctCount ? 12 : -8) +
          (result.correctDecision ? 15 : -12) +
          (result.correctSizing ? 10 : -9);

        const evContribution = (result.evDelta * 6) - (result.mistakePenalty * 7);
        const latencyPenalty = Math.min(6, Math.floor(result.decisionLatencyMs / 1800));
        const delta = outcomeScore + evContribution - latencyPenalty - streakDecay;

        const nextEdgeScore = Math.max(0, Math.min(1000, state.edgeScore + delta));
        const totalScenarios = state.scenarioResults.length + 1;
        const nextCountIntegrity = Math.round(
          ((state.metrics.countIntegrity * state.scenarioResults.length) + (result.correctCount ? 100 : 0)) / totalScenarios
        );
        const nextDecisionLatency = Math.round(
          ((state.metrics.decisionLatencyMs * state.scenarioResults.length) + result.decisionLatencyMs) / totalScenarios
        );

        return {
          edgeScore: nextEdgeScore,
          edgeHistory: [...state.edgeHistory, nextEdgeScore],
          metrics: {
            evCaptured: state.metrics.evCaptured + Math.max(0, result.evDelta),
            mistakeCost: state.metrics.mistakeCost + result.mistakePenalty,
            decisionLatencyMs: nextDecisionLatency,
            countIntegrity: nextCountIntegrity,
          },
          scenarioResults: [...state.scenarioResults, result],
          performanceStreak: currentStreak,
        };
      }),

      finalizeEdgeSession: (startedAt) => {
        const state = get();
        const completedAt = Date.now();
        const scenariosCompleted = state.scenarioResults.length;
        const edgeScoreStart = state.edgeHistory[0] ?? state.edgeScore;
        const edgeScoreEnd = state.edgeScore;
        const edgeScoreDelta = edgeScoreEnd - edgeScoreStart;
        const countIntegrity = state.metrics.countIntegrity;
        const decisionLatencyMsAvg = state.metrics.decisionLatencyMs;
        const readinessTier = getReadinessTier(edgeScoreEnd);

        const summary: EdgeSessionSummary = {
          startedAt,
          completedAt,
          scenariosCompleted,
          edgeScoreStart,
          edgeScoreEnd,
          edgeScoreDelta,
          evCaptured: state.metrics.evCaptured,
          mistakeCost: state.metrics.mistakeCost,
          countIntegrity,
          decisionLatencyMsAvg,
          readinessTier,
        };

        set({ lastSessionSummary: summary });
        return summary;
      },

      getReadinessTier: () => {
        const { edgeScore } = get();
        return getReadinessTier(edgeScore);
      },

      checkCount: (userRc, userTc, actualTc) => {
        const state = get();
        const isCorrectRc = userRc === state.runningCount;
        // Tolerance of 1 for True Count as per reference app
        const isCorrectTc = Math.abs(userTc - actualTc) <= 1;

        const isCorrectOverall = isCorrectRc && isCorrectTc;

        set((state) => ({
          accuracyHistory: [...state.accuracyHistory, { correct: isCorrectOverall, timestamp: Date.now() }],
          challengeStats: state.challengeStats ? {
            ...state.challengeStats,
            countChecks: state.challengeStats.countChecks + 1,
            correctCounts: state.challengeStats.correctCounts + (isCorrectOverall ? 1 : 0)
          } : state.challengeStats
        }));

        return { isCorrectRc, isCorrectTc };
      },

      resetSimState: () => set({
        runningCount: 0,
        trueCountUserEstimate: 0,
        trueCountGroundTruth: 0,
        bankroll: 1000,
        suspicionLevel: 0,
        logicErrors: 0,
        speedErrors: 0,
        evTracking: { theoreticalWin: 0, mistakesCost: 0 },
        edgeScore: 500,
        edgeHistory: [500],
        metrics: {
          evCaptured: 0,
          mistakeCost: 0,
          decisionLatencyMs: 0,
          countIntegrity: 100,
        },
        scenarioResults: [],
        lastSessionSummary: null,
        performanceStreak: 0,
        bankrollHistory: [1000],
        accuracyHistory: [],
      }),

      toggleProMode: () => set(state => ({ isProMode: !state.isProMode })),

      startChallenge: () => set({
        challengeStats: {
          isActive: true,
          shoesCompleted: 0,
          totalHands: 0,
          correctCounts: 0,
          countChecks: 0,
          decisionErrors: 0,
          maxHeat: 0
        },
        // Reset session stats too?
        bankroll: 1000,
        suspicionLevel: 0,
        logicErrors: 0
      }),

      updateChallengeStats: (stats) => set(state => ({
        challengeStats: { ...state.challengeStats, ...stats }
      })),

      completeChallenge: () => {
        const state = get();
        if (!state.challengeStats) {
          return { success: false, rubric: { failReason: "No Active Challenge", improvementTip: "Start a challenge first." } };
        }
        const s = state.challengeStats;

        const countAccuracy = s.countChecks > 0 ? (s.correctCounts / s.countChecks) : 1;
        const decisionAccuracy = s.totalHands > 0 ? 1 - (s.decisionErrors / s.totalHands) : 1;
        const heatSafe = s.maxHeat < 80;

        let success = false;
        let failReason = "None";
        let improvementTip = "Perfect Session!";

        if (s.shoesCompleted >= 2 && countAccuracy === 1 && decisionAccuracy > 0.98 && heatSafe) {
          success = true;
          set({ certificationStatus: 'PRO', challengeStats: { ...s, isActive: false } as any });
          AnalyticsService.trackEvent('certification_attempt', { success: true });
        } else {
          success = false;
          // Determine Rubric Feedback
          if (countAccuracy < 1) {
            const errorRate = Math.round((1 - countAccuracy) * 100);
            failReason = `Math Accuracy < 100%`;
            improvementTip = `Math Drift. Your count was off by ${errorRate}% at shuffle points. You are betting on bad data.`;
          } else if (decisionAccuracy <= 0.98) {
            failReason = `Deviation Accuracy < 98%`;
            improvementTip = "Tactical Failure. You gave the house back their edge on index plays.";
          } else if (!heatSafe) {
            failReason = `Max Heat > 80%`;
            improvementTip = "Banned! Your bet spread was too aggressive for your cover level.";
          } else if (s.shoesCompleted < 2) {
            failReason = "Incomplete Session";
            improvementTip = "Endurance Failure. You must complete 2 full shoes to prove consistency.";
          }

          set({ challengeStats: { ...s, isActive: false } as any });
          AnalyticsService.trackEvent('certification_attempt', { success: false, failReason });
        }

        return { success, rubric: { failReason, improvementTip } };
      },

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
      getAccuracy: () => {
        const historicalAccuracy = get().accuracyHistory;
        if (historicalAccuracy.length === 0) return 100;
        const correct = historicalAccuracy.filter(x => x.correct).length;
        return Math.round((correct / historicalAccuracy.length) * 100);
      },
    }),
    {
      name: 'sim-storage',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version) => {
        if (!persistedState) return persistedState;

        // v1 -> v2: map legacy bankroll-centric progression into edge-centric defaults.
        if (version < 2) {
          const bankroll = typeof persistedState.bankroll === 'number' ? persistedState.bankroll : 1000;
          const normalizedEdgeScore = Math.max(0, Math.min(1000, Math.round((bankroll / 2000) * 1000)));

          return {
            ...persistedState,
            edgeScore: persistedState.edgeScore ?? normalizedEdgeScore,
            edgeHistory: persistedState.edgeHistory ?? [normalizedEdgeScore],
            metrics: persistedState.metrics ?? {
              evCaptured: persistedState.evTracking?.theoreticalWin ?? 0,
              mistakeCost: persistedState.evTracking?.mistakesCost ?? 0,
              decisionLatencyMs: 0,
              countIntegrity: 100,
            },
            scenarioResults: persistedState.scenarioResults ?? [],
            lastSessionSummary: persistedState.lastSessionSummary ?? null,
            performanceStreak: persistedState.performanceStreak ?? 0,
          };
        }

        return persistedState;
      },
      // Optional: ignore properties that shouldn't persist
      // partialize: (state) => ({ bankroll: state.bankroll, ... }) 
    }
  )
);
