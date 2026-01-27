import {
  CoachRequest,
  CoachResponse,
  UserStats,
  GameSession,
  UserSubscription,
} from '@card-counter-ai/shared';
import { LocalStatsService } from './localStatsService';
import { LocalCoachService } from './localCoachService';

// Re-export services for direct use if needed
export { LocalStatsService, LocalCoachService };

export class ApiService {
  /**
   * Get coaching advice from AI (Direct Client Call)
   */
  static async getCoachAdvice(request: CoachRequest): Promise<CoachResponse> {
    try {
      return await LocalCoachService.getCoachResponse(request);
    } catch (error) {
      console.error('Failed to get coach advice:', error);
      // Return fallback response
      return {
        advice: 'Unable to get coaching advice at this time. Please try again later.',
        confidence: 0,
        reasoning: 'Service temporarily unavailable',
      };
    }
  }

  /**
   * Analyze a completed session (Mock/Stub for now, or Local Analysis)
   */
  static async analyzeSession(
    userId: string,
    sessionId: string
  ): Promise<CoachResponse> {
    try {
      return await LocalCoachService.analyzeSession(userId, sessionId);
    } catch (error) {
      console.error('Failed to analyze session:', error);
      return {
        advice: 'Session analysis unavailable. Continue practicing!',
        confidence: 0,
        reasoning: 'Analysis service temporarily unavailable',
      };
    }
  }

  /**
   * Get user statistics (Local Storage)
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      const stats = await LocalStatsService.getUserStats(userId);
      if (!stats) {
        console.warn('Stats not found, initializing default stats');
        // Return default stats instead of throwing
        return {
          userId,
          totalHands: 0,
          totalWinnings: 0,
          countingAccuracy: 0,
          basicStrategyAccuracy: 0,
          sessions: [],
        } as UserStats;
      }
      return stats;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      // Return default stats on error
      return {
        userId,
        totalHands: 0,
        totalWinnings: 0,
        countingAccuracy: 0,
        basicStrategyAccuracy: 0,
        sessions: [],
      } as UserStats;
    }
  }

  /**
   * Update user statistics (Local Storage)
   */
  static async updateUserStats(
    userId: string,
    stats: Partial<UserStats>
  ): Promise<UserStats> {
    try {
      return await LocalStatsService.updateUserStats(userId, stats);
    } catch (error) {
      console.error('Failed to update user stats:', error);
      // Return current stats on error
      return await this.getUserStats(userId);
    }
  }

  /**
   * Record a completed session (Local Storage)
   */
  static async recordSession(
    userId: string,
    session: GameSession
  ): Promise<UserStats> {
    try {
      return await LocalStatsService.recordSession(userId, session);
    } catch (error) {
      console.error('Failed to record session:', error);
      // Return current stats on error
      return await this.getUserStats(userId);
    }
  }

  /**
   * Get user subscription status
   * TODO: Integrate with RevenueCat properly using react-native-purchases
   */
  static async getSubscription(userId: string): Promise<UserSubscription> {
    // Placeholder - assume free tier for now or implement RevenueCat check here
    return {
      userId,
      tier: 'free',
      status: 'active',
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year
      features: ['basic_drills'],
    } as any;
  }
}
