import {
  UserStats,
  GameSession,
  LearningPhase,
  GameMode,
  CountingSystem,
} from '@card-counter-ai/shared';

// In production, this would use Firebase/Firestore
// For now, using in-memory storage for demonstration
const statsCache = new Map<string, UserStats>();

export class StatsService {
  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats | null> {
    // In production, fetch from Firebase/Firestore
    if (statsCache.has(userId)) {
      return statsCache.get(userId)!;
    }

    // Return default stats for new users
    return this.createDefaultStats(userId);
  }

  /**
   * Update user statistics
   */
  async updateUserStats(
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

    // In production, save to Firebase/Firestore
    statsCache.set(userId, updatedStats);

    return updatedStats;
  }

  /**
   * Record a completed session
   */
  async recordSession(userId: string, session: GameSession): Promise<UserStats> {
    const currentStats = await this.getUserStats(userId);

    if (!currentStats) {
      throw new Error('User stats not found');
    }

    // Calculate updated stats based on session performance
    const sessionResults = session.results;
    const totalAccuracy = sessionResults.reduce(
      (sum, result) => sum + result.accuracy,
      0
    ) / sessionResults.length;

    const totalSpeed = sessionResults.reduce(
      (sum, result) => sum + result.speed,
      0
    ) / sessionResults.length;

    // Update stats with weighted average (70% old, 30% new)
    const updatedStats: UserStats = {
      ...currentStats,
      cardsPerMinute: currentStats.cardsPerMinute * 0.7 + totalSpeed * 0.3,
      runningCountAccuracy: currentStats.runningCountAccuracy * 0.7 + totalAccuracy * 0.3,
      totalHandsPlayed: currentStats.totalHandsPlayed + session.handsPlayed,
      sessionEV: session.ev,
      lastUpdated: new Date(),
    };

    statsCache.set(userId, updatedStats);

    return updatedStats;
  }

  /**
   * Create default stats for a new user
   */
  private createDefaultStats(userId: string): UserStats {
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

  /**
   * Check if user can unlock next mode
   */
  async checkModeUnlock(userId: string): Promise<GameMode | null> {
    const stats = await this.getUserStats(userId);

    if (!stats) return null;

    // Define unlock criteria
    const unlockCriteria = {
      [GameMode.CASINO_SIM_TIER_1]: {
        phase: LearningPhase.BETTING_CORRELATION,
        accuracy: 90,
      },
      [GameMode.CASINO_SIM_TIER_2]: {
        mode: GameMode.CASINO_SIM_TIER_1,
        accuracy: 92,
        hands: 100,
      },
      [GameMode.CASINO_SIM_TIER_3]: {
        mode: GameMode.CASINO_SIM_TIER_2,
        accuracy: 94,
        hands: 200,
      },
    };

    // Check each locked mode
    for (const [mode, criteria] of Object.entries(unlockCriteria)) {
      if (!stats.unlockedModes.includes(mode as GameMode)) {
        // Check if criteria met (simplified logic)
        if (stats.runningCountAccuracy >= 90) {
          return mode as GameMode;
        }
      }
    }

    return null;
  }
}
