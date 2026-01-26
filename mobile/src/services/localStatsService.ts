import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    UserStats,
    GameSession,
    LearningPhase,
    GameMode,
    CountingSystem,
} from '@card-counter-ai/shared';

const STATS_STORAGE_KEY = 'user_stats_v1';

export class LocalStatsService {
    /**
     * Get user statistics from local storage
     */
    static async getUserStats(userId: string): Promise<UserStats | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(STATS_STORAGE_KEY);
            if (jsonValue != null) {
                const stats = JSON.parse(jsonValue);
                // Ensure dates are parsed back to Date objects
                return {
                    ...stats,
                    lastUpdated: new Date(stats.lastUpdated),
                };
            }
            return this.createDefaultStats(userId);
        } catch (e) {
            console.error('Error reading stats from storage', e);
            return this.createDefaultStats(userId);
        }
    }

    /**
     * Update user statistics
     */
    static async updateUserStats(
        userId: string,
        statsUpdate: Partial<UserStats>
    ): Promise<UserStats> {
        let currentStats = await this.getUserStats(userId);

        if (!currentStats) {
            currentStats = this.createDefaultStats(userId);
        }

        const updatedStats: UserStats = {
            ...currentStats,
            ...statsUpdate,
            userId,
            lastUpdated: new Date(),
        };

        try {
            await AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updatedStats));
        } catch (e) {
            console.error('Error saving stats to storage', e);
        }

        return updatedStats;
    }

    /**
     * Record a completed session
     */
    static async recordSession(userId: string, session: GameSession): Promise<UserStats> {
        const currentStats = await this.getUserStats(userId);

        if (!currentStats) {
            throw new Error('User stats not found');
        }

        // Calculate updated stats based on session performance
        const sessionResults = session.results;
        if (sessionResults.length === 0) {
            return currentStats;
        }

        const totalAccuracy = sessionResults.reduce(
            (sum, result) => sum + result.accuracy,
            0
        ) / sessionResults.length;

        const totalSpeed = sessionResults.reduce(
            (sum, result) => sum + result.speed,
            0
        ) / sessionResults.length;

        // Update stats with weighted average (70% old, 30% new)
        // If it's the first session (0 hands played), take the new value directly
        const weight = currentStats.totalHandsPlayed === 0 ? 0 : 0.7;
        const newWeight = 1 - weight;

        const updatedStats: UserStats = {
            ...currentStats,
            cardsPerMinute: currentStats.cardsPerMinute * weight + totalSpeed * newWeight,
            runningCountAccuracy: currentStats.runningCountAccuracy * weight + totalAccuracy * newWeight,
            totalHandsPlayed: currentStats.totalHandsPlayed + session.handsPlayed,
            sessionEV: session.ev,
            lastUpdated: new Date(),
        };

        await this.updateUserStats(userId, updatedStats);

        return updatedStats;
    }

    /**
     * Create default stats for a new user
     */
    private static createDefaultStats(userId: string): UserStats {
        return {
            userId,
            cardsPerMinute: 0,
            runningCountAccuracy: 0,
            trueCountAccuracy: 0,
            betCorrelationScore: 0,
            heatScore: 0,
            distractionResistance: 0,
            sessionEV: 0,
            totalHandsPlayed: 0,
            currentPhase: LearningPhase.CARD_VALUES,
            unlockedModes: [GameMode.GUIDED_LEARNING],
            currentSystem: CountingSystem.HI_LO,
            unlockedSystems: [CountingSystem.HI_LO],
            lastUpdated: new Date(),
        };
    }
}
