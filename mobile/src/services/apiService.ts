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
    return LocalCoachService.getCoachResponse(request);
  }

  /**
   * Analyze a completed session (Mock/Stub for now, or Local Analysis)
   */
  static async analyzeSession(
    userId: string,
    sessionId: string
  ): Promise<CoachResponse> {
    return LocalCoachService.analyzeSession(userId, sessionId);
  }

  /**
   * Get user statistics (Local Storage)
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    const stats = await LocalStatsService.getUserStats(userId);
    if (!stats) {
      throw new Error('Could not initialize stats');
    }
    return stats;
  }

  /**
   * Update user statistics (Local Storage)
   */
  static async updateUserStats(
    userId: string,
    stats: Partial<UserStats>
  ): Promise<UserStats> {
    return LocalStatsService.updateUserStats(userId, stats);
  }

  /**
   * Record a completed session (Local Storage)
   */
  static async recordSession(
    userId: string,
    session: GameSession
  ): Promise<UserStats> {
    return LocalStatsService.recordSession(userId, session);
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
