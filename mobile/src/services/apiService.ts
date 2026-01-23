import axios from 'axios';
import {
  CoachRequest,
  CoachResponse,
  UserStats,
  GameSession,
  UserSubscription,
} from '@card-counter-ai/shared';

// Configure API base URL
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  /**
   * Get coaching advice from AI
   */
  static async getCoachAdvice(request: CoachRequest): Promise<CoachResponse> {
    try {
      const response = await api.post<CoachResponse>('/coach/ask', request);
      return response.data;
    } catch (error) {
      console.error('Error getting coach advice:', error);
      throw new Error('Failed to get coaching advice');
    }
  }

  /**
   * Analyze a completed session
   */
  static async analyzeSession(
    userId: string,
    sessionId: string
  ): Promise<CoachResponse> {
    try {
      const response = await api.post<CoachResponse>('/coach/analyze-session', {
        userId,
        sessionId,
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing session:', error);
      throw new Error('Failed to analyze session');
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      const response = await api.get<UserStats>(`/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }

  /**
   * Update user statistics
   */
  static async updateUserStats(
    userId: string,
    stats: Partial<UserStats>
  ): Promise<UserStats> {
    try {
      const response = await api.post<UserStats>(`/stats/${userId}`, stats);
      return response.data;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw new Error('Failed to update user statistics');
    }
  }

  /**
   * Record a completed session
   */
  static async recordSession(
    userId: string,
    session: GameSession
  ): Promise<UserStats> {
    try {
      const response = await api.post<UserStats>(
        `/stats/${userId}/session`,
        session
      );
      return response.data;
    } catch (error) {
      console.error('Error recording session:', error);
      throw new Error('Failed to record session');
    }
  }

  /**
   * Get user subscription status
   */
  static async getSubscription(userId: string): Promise<UserSubscription> {
    try {
      const response = await api.get<UserSubscription>(`/subscription/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw new Error('Failed to fetch subscription status');
    }
  }
}
