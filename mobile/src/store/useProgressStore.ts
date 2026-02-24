import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_UNLOCK_ALL } from './useRevenueCatStore';

// Session result for tracking mastery
interface SessionResult {
    phase: string;
    accuracy: number;
    cardsCompleted: number;
    timeInSeconds: number;
    timestamp: number;
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    xpReward: number;
    completed: boolean;
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

    // Phase 2 (Running Count) progress
    phase2Sessions: SessionResult[];
    phase2ConsecutiveMastery: number; // Need 2 at 90%+

    // Phase 3 (True Count) progress
    phase3Sessions: SessionResult[];
    phase3ConsecutiveMastery: number; // Need 2 at 90%+

    // Phase 4 (Bet Sizing) progress
    phase4Sessions: SessionResult[];
    phase4ConsecutiveMastery: number; // Need 2 at 90%+

    // Phase 5 (Deviations) progress
    phase5Sessions: SessionResult[];
    phase5ConsecutiveMastery: number; // Need 3 at 90%+

    // Overall stats
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    lastPracticeDate: string | null;

    // Progression
    badges: string[];
    dailyMissions: Mission[];
    lastMissionDate: string | null;

    // Actions
    addSessionResult: (phase: string, result: SessionResult) => void;
    completePhase: (phase: number) => void;
    addXP: (amount: number) => void;
    updateStreak: () => void;
    resetProgress: () => void;
    unlockBadge: (badgeId: string) => void;
    updateMissionProgress: (missionId: string, amount: number) => void;
    checkDailyMissions: () => void;

    // Getters (computed)
    isPhaseUnlocked: (phase: number) => boolean;
    getPhaseProgress: (phase: number) => { sessions: number; masteryProgress: number };
    getCurrentLevel: () => { level: number; title: string; nextLevelXP: number; progress: number };
}

// Leveling Titles
export const LEVEL_TITLES = [
    { maxLevel: 10, title: "Initiate" },
    { maxLevel: 20, title: "Operative" },
    { maxLevel: 30, title: "Specialist" },
    { maxLevel: 40, title: "Agent" },
    { maxLevel: 50, title: "Ghost" },
    { maxLevel: 999, title: "Director" },
];

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
    PHASE_2: {
        CARDS_PER_SESSION: 52, // Full deck
        REQUIRED_ACCURACY: 0.90,
        CONSECUTIVE_SESSIONS: 2,
        TIME_LIMIT_SECONDS: 60,
    },
    PHASE_3: {
        CHECKS_PER_SESSION: 10, // 10 true count questions per session
        REQUIRED_ACCURACY: 0.90,
        CONSECUTIVE_SESSIONS: 2,
    },
    PHASE_4: {
        BETS_PER_SESSION: 10, // 10 betting scenarios
        REQUIRED_ACCURACY: 0.90,
        CONSECUTIVE_SESSIONS: 2,
    },
    PHASE_5: {
        SCENARIOS_PER_SESSION: 20, // 20 deviation scenarios
        REQUIRED_ACCURACY: 0.90,
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

            phase2Sessions: [],
            phase2ConsecutiveMastery: 0,

            phase3Sessions: [],
            phase3ConsecutiveMastery: 0,

            phase4Sessions: [],
            phase4ConsecutiveMastery: 0,

            phase5Sessions: [],
            phase5ConsecutiveMastery: 0,

            totalXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastPracticeDate: null,
            badges: [],
            dailyMissions: [],
            lastMissionDate: null,

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

                if (phase === 'phase2') {
                    const isMastery =
                        result.accuracy >= MASTERY_REQUIREMENTS.PHASE_2.REQUIRED_ACCURACY &&
                        result.timeInSeconds <= MASTERY_REQUIREMENTS.PHASE_2.TIME_LIMIT_SECONDS;

                    const newConsecutive = isMastery ? state.phase2ConsecutiveMastery + 1 : 0;
                    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_2.CONSECUTIVE_SESSIONS;

                    return {
                        phase2Sessions: [...state.phase2Sessions, result],
                        phase2ConsecutiveMastery: newConsecutive,
                        phase2Complete: state.phase2Complete || isComplete,
                        totalXP: state.totalXP + (isMastery ? 200 : 50) + (isComplete ? 500 : 0),
                    };
                }

                if (phase === 'phase3') {
                    const isMastery = result.accuracy >= MASTERY_REQUIREMENTS.PHASE_3.REQUIRED_ACCURACY;

                    const newConsecutive = isMastery ? state.phase3ConsecutiveMastery + 1 : 0;
                    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_3.CONSECUTIVE_SESSIONS;

                    return {
                        phase3Sessions: [...state.phase3Sessions, result],
                        phase3ConsecutiveMastery: newConsecutive,
                        phase3Complete: state.phase3Complete || isComplete,
                        totalXP: state.totalXP + (isMastery ? 200 : 50) + (isComplete ? 500 : 0),
                    };
                }

                if (phase === 'phase4') {
                    const isMastery = result.accuracy >= MASTERY_REQUIREMENTS.PHASE_4.REQUIRED_ACCURACY;

                    const newConsecutive = isMastery ? state.phase4ConsecutiveMastery + 1 : 0;
                    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_4.CONSECUTIVE_SESSIONS;

                    return {
                        phase4Sessions: [...state.phase4Sessions, result],
                        phase4ConsecutiveMastery: newConsecutive,
                        phase4Complete: state.phase4Complete || isComplete,
                        totalXP: state.totalXP + (isMastery ? 200 : 50) + (isComplete ? 500 : 0),
                    };
                }

                if (phase === 'phase5') {
                    const isMastery = result.accuracy >= MASTERY_REQUIREMENTS.PHASE_5.REQUIRED_ACCURACY;
                    const newConsecutive = isMastery ? state.phase5ConsecutiveMastery + 1 : 0;
                    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_5.CONSECUTIVE_SESSIONS;

                    return {
                        phase5Sessions: [...state.phase5Sessions, result],
                        phase5ConsecutiveMastery: newConsecutive,
                        phase5Complete: state.phase5Complete || isComplete,
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

            unlockBadge: (badgeId) => set((state) => {
                if (!state.badges.includes(badgeId)) {
                    return { badges: [...state.badges, badgeId] };
                }
                return state;
            }),

            updateMissionProgress: (missionId, amount) => set((state) => {
                const updatedMissions = state.dailyMissions.map((mission) => {
                    if (mission.id === missionId && !mission.completed) {
                        const newProgress = Math.min(mission.progress + amount, mission.target);
                        const isCompleted = newProgress >= mission.target;

                        if (isCompleted) {
                            setTimeout(() => get().addXP(mission.xpReward), 0);
                        }

                        return { ...mission, progress: newProgress, completed: isCompleted };
                    }
                    return mission;
                });
                return { dailyMissions: updatedMissions };
            }),

            checkDailyMissions: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                if (state.lastMissionDate !== today) {
                    // Generate new dailies
                    const newMissions: Mission[] = [
                        { id: 'daily_basic', title: 'Basic Training', description: 'Play 50 Basic Strategy hands', target: 50, progress: 0, xpReward: 150, completed: false },
                        { id: 'daily_count', title: 'Counting Reps', description: 'Complete 2 Deck Countdown drills', target: 2, progress: 0, xpReward: 200, completed: false },
                        { id: 'daily_perfect', title: 'Flawless', description: 'Get 1 perfect session in any phase', target: 1, progress: 0, xpReward: 300, completed: false },
                    ];
                    return { dailyMissions: newMissions, lastMissionDate: today };
                }
                return state;
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
                phase2Sessions: [],
                phase2ConsecutiveMastery: 0,
                phase3Sessions: [],
                phase3ConsecutiveMastery: 0,
                phase5Sessions: [],
                phase5ConsecutiveMastery: 0,
                totalXP: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastPracticeDate: null,
                badges: [],
                dailyMissions: [],
                lastMissionDate: null,
            }),

            // Computed getters
            isPhaseUnlocked: (phase) => {
                if (DEV_UNLOCK_ALL) return true; // ⚠️ DEV bypass
                const state = get();
                switch (phase) {
                    case 0: return true;
                    case 1: return state.phase0Complete;
                    case 2: return state.phase1Complete;
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
                if (phase === 2) {
                    return {
                        sessions: state.phase2Sessions.length,
                        masteryProgress: state.phase2ConsecutiveMastery / MASTERY_REQUIREMENTS.PHASE_2.CONSECUTIVE_SESSIONS,
                    };
                }
                if (phase === 3) {
                    return {
                        sessions: state.phase3Sessions.length,
                        masteryProgress: state.phase3ConsecutiveMastery / MASTERY_REQUIREMENTS.PHASE_3.CONSECUTIVE_SESSIONS,
                    };
                }
                if (phase === 4) {
                    return {
                        sessions: state.phase4Sessions.length,
                        masteryProgress: state.phase4ConsecutiveMastery / MASTERY_REQUIREMENTS.PHASE_4.CONSECUTIVE_SESSIONS,
                    };
                }
                if (phase === 5) {
                    return {
                        sessions: state.phase5Sessions.length,
                        masteryProgress: state.phase5ConsecutiveMastery / MASTERY_REQUIREMENTS.PHASE_5.CONSECUTIVE_SESSIONS,
                    };
                }
                return { sessions: 0, masteryProgress: 0 };
            },

            getCurrentLevel: () => {
                const { totalXP } = get();

                let level = 1;
                let xpRequired = 0;
                let nextLevelXP = 500;

                while (totalXP >= nextLevelXP) {
                    level++;
                    xpRequired = nextLevelXP;
                    nextLevelXP = nextLevelXP + 500 + (level * 50);
                }

                const titleObj = LEVEL_TITLES.find(t => level <= t.maxLevel) || LEVEL_TITLES[LEVEL_TITLES.length - 1];

                const progressInLevel = totalXP - xpRequired;
                const xpNeededForNext = nextLevelXP - xpRequired;
                const progress = progressInLevel / xpNeededForNext;

                return {
                    level,
                    title: titleObj.title,
                    nextLevelXP,
                    progress
                };
            },
        }),
        {
            name: 'card-counter-progress',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
