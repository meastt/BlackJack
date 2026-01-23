import { create } from 'zustand';
import {
  Card,
  UserStats,
  GameMode,
  LearningPhase,
  CountingSystem,
  DrillResult,
} from '@card-counter-ai/shared';

interface GameState {
  // User data
  userId: string | null;
  userStats: UserStats | null;

  // Current session
  currentMode: GameMode;
  currentPhase: LearningPhase;
  currentSystem: CountingSystem;

  // Drill state
  currentCards: Card[];
  runningCount: number;
  userInputCount: number;
  isSessionActive: boolean;
  sessionStartTime: number;

  // Results
  drillResults: DrillResult[];

  // Actions
  setUserId: (userId: string) => void;
  setUserStats: (stats: UserStats) => void;
  setCurrentMode: (mode: GameMode) => void;
  setCurrentPhase: (phase: LearningPhase) => void;
  setCurrentSystem: (system: CountingSystem) => void;
  setCurrentCards: (cards: Card[]) => void;
  updateRunningCount: (count: number) => void;
  setUserInputCount: (count: number) => void;
  startSession: () => void;
  endSession: () => void;
  addDrillResult: (result: DrillResult) => void;
  resetSession: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  userId: null,
  userStats: null,
  currentMode: GameMode.GUIDED_LEARNING,
  currentPhase: LearningPhase.CARD_VALUES,
  currentSystem: CountingSystem.HI_LO,
  currentCards: [],
  runningCount: 0,
  userInputCount: 0,
  isSessionActive: false,
  sessionStartTime: 0,
  drillResults: [],

  // Actions
  setUserId: (userId) => set({ userId }),

  setUserStats: (stats) => set({ userStats: stats }),

  setCurrentMode: (mode) => set({ currentMode: mode }),

  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  setCurrentSystem: (system) => set({ currentSystem: system }),

  setCurrentCards: (cards) => set({ currentCards: cards }),

  updateRunningCount: (count) => set({ runningCount: count }),

  setUserInputCount: (count) => set({ userInputCount: count }),

  startSession: () => set({
    isSessionActive: true,
    sessionStartTime: Date.now(),
    drillResults: [],
    runningCount: 0,
    userInputCount: 0,
  }),

  endSession: () => set({ isSessionActive: false }),

  addDrillResult: (result) => set((state) => ({
    drillResults: [...state.drillResults, result],
  })),

  resetSession: () => set({
    currentCards: [],
    runningCount: 0,
    userInputCount: 0,
    isSessionActive: false,
    sessionStartTime: 0,
    drillResults: [],
  }),
}));
