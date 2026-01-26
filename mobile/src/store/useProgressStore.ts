import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Session result for tracking mastery
interface SessionResult {
    phase: string;
    accuracy: number;
    cardsCompleted: number;
    timeInSeconds: number;
    timestamp: number;
}

interface ProgressState {
    // Phase completion status
    phase0Complete: boolean; // Basic Strategy
    phase1Complete: boolean; // Card Values
    phase2Complete: boolean; // Running Count
    phase3Complete: boolean; // True Count
    phase4Complete: boolean; // Bet Sizing
    phase5Complete: boolean; // Deviations

    // Phase 0 (Basic Strategy) progress
    phase0Sessions: SessionResult[];
    phase0ConsecutivePerfect: number;

    // Phase 1 (Card Values) progress
    phase1Sessions: SessionResult[];
    phase1ConsecutiveMastery: number; // Need 3 at 95%+

    // Overall stats
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    lastPracticeDate: string | null;

    // Actions
    addSessionResult: (phase: string, result: SessionResult) => void;
    completePhase: (phase: number) => void;
    addXP: (amount: number) => void;
    updateStreak: () => void;
    resetProgress: () => void;

    // Getters (computed)
    isPhaseUnlocked: (phase: number) => boolean;
    getPhaseProgress: (phase: number) => { sessions: number; masteryProgress: number };
}

// Constants for mastery requirements
export const MASTERY_REQUIREMENTS = {
    PHASE_0: {
        CARDS_PER_SESSION: 30,
        REQUIRED_ACCURACY: 0.95,
        CONSECUTIVE_SESSIONS: 2,
    },
    PHASE_1: {
        CARDS_PER_SESSION: 25,
        REQUIRED_ACCURACY: 0.95,
        CONSECUTIVE_SESSIONS: 3,
    },
};

export const useProgressStore = create<ProgressState>()(
    persist(
        (set, get) => ({
            // Initial state
            phase0Complete: false,
            phase1Complete: false,
            phase2Complete: false,
            phase3Complete: false,
            phase4Complete: false,
            phase5Complete: false,

            phase0Sessions: [],
            phase0ConsecutivePerfect: 0,

            phase1Sessions: [],
            phase1ConsecutiveMastery: 0,

            totalXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastPracticeDate: null,

            // Actions
            addSessionResult: (phase, result) => set((state) => {
                if (phase === 'phase0') {
                    const isMastery = result.accuracy >= MASTERY_REQUIREMENTS.PHASE_0.REQUIRED_ACCURACY;
                    const newConsecutive = isMastery ? state.phase0ConsecutivePerfect + 1 : 0;
                    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_0.CONSECUTIVE_SESSIONS;

                    return {
                        phase0Sessions: [...state.phase0Sessions, result],
                        phase0ConsecutivePerfect: newConsecutive,
                        phase0Complete: state.phase0Complete || isComplete,
                        totalXP: state.totalXP + (isMastery ? 200 : 50) + (isComplete ? 500 : 0),
                    };
                }

                if (phase === 'phase1') {
                    const isMastery = result.accuracy >= MASTERY_REQUIREMENTS.PHASE_1.REQUIRED_ACCURACY;
                    const newConsecutive = isMastery ? state.phase1ConsecutiveMastery + 1 : 0;
                    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_1.CONSECUTIVE_SESSIONS;

                    return {
                        phase1Sessions: [...state.phase1Sessions, result],
                        phase1ConsecutiveMastery: newConsecutive,
                        phase1Complete: state.phase1Complete || isComplete,
                        totalXP: state.totalXP + (isMastery ? 200 : 50) + (isComplete ? 500 : 0),
                    };
                }

                return state;
            }),

            completePhase: (phase) => set((state) => {
                const key = `phase${phase}Complete` as keyof ProgressState;
                return { ...state, [key]: true };
            }),

            addXP: (amount) => set((state) => ({
                totalXP: state.totalXP + amount,
            })),

            updateStreak: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

                if (state.lastPracticeDate === today) {
                    // Already practiced today
                    return state;
                }

                if (state.lastPracticeDate === yesterday) {
                    // Continuing streak
                    const newStreak = state.currentStreak + 1;
                    return {
                        currentStreak: newStreak,
                        longestStreak: Math.max(newStreak, state.longestStreak),
                        lastPracticeDate: today,
                    };
                }

                // Streak broken or first time
                return {
                    currentStreak: 1,
                    longestStreak: Math.max(1, state.longestStreak),
                    lastPracticeDate: today,
                };
            }),

            resetProgress: () => set({
                phase0Complete: false,
                phase1Complete: false,
                phase2Complete: false,
                phase3Complete: false,
                phase4Complete: false,
                phase5Complete: false,
                phase0Sessions: [],
                phase0ConsecutivePerfect: 0,
                phase1Sessions: [],
                phase1ConsecutiveMastery: 0,
                totalXP: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastPracticeDate: null,
            }),

            // Computed getters
            isPhaseUnlocked: (phase) => {
                const state = get();
                switch (phase) {
                    case 0: return true; // Basic Strategy always unlocked
                    case 1: return state.phase0Complete; // Card Values needs Basic Strategy
                    case 2: return state.phase1Complete; // Running Count needs Card Values
                    case 3: return state.phase2Complete;
                    case 4: return state.phase3Complete;
                    case 5: return state.phase4Complete;
                    default: return false;
                }
            },

            getPhaseProgress: (phase) => {
                const state = get();
                if (phase === 0) {
                    return {
                        sessions: state.phase0Sessions.length,
                        masteryProgress: state.phase0ConsecutivePerfect / MASTERY_REQUIREMENTS.PHASE_0.CONSECUTIVE_SESSIONS,
                    };
                }
                if (phase === 1) {
                    return {
                        sessions: state.phase1Sessions.length,
                        masteryProgress: state.phase1ConsecutiveMastery / MASTERY_REQUIREMENTS.PHASE_1.CONSECUTIVE_SESSIONS,
                    };
                }
                return { sessions: 0, masteryProgress: 0 };
            },
        }),
        {
            name: 'card-counter-progress',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
