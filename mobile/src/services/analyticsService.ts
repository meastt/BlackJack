import AsyncStorage from '@react-native-async-storage/async-storage';

type AnalyticsEventName =
  | 'scenario_started'
  | 'scenario_completed'
  | 'edge_score_delta'
  | 'paywall_error_shown'
  | 'phase_completed'
  | 'certification_attempt';

interface AnalyticsEvent {
  name: AnalyticsEventName;
  timestamp: number;
  payload?: Record<string, string | number | boolean>;
}

const STORAGE_KEY = 'analytics_events_v1';
const MAX_BUFFER = 200;

export class AnalyticsService {
  static async trackEvent(
    name: AnalyticsEventName,
    payload?: Record<string, string | number | boolean>
  ) {
    const event: AnalyticsEvent = { name, timestamp: Date.now(), payload };

    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
      const next = [...parsed, event].slice(-MAX_BUFFER);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      // non-blocking, analytics should never break UX
      console.warn('Analytics event buffering failed', error);
    }
  }

  static async getRetentionSnapshot() {
    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];

      const phaseCompletions = parsed.filter((e) => e.name === 'phase_completed').length;
      const certificationAttempts = parsed.filter((e) => e.name === 'certification_attempt').length;
      const successfulCertifications = parsed.filter(
        (e) => e.name === 'certification_attempt' && e.payload?.success === true
      ).length;

      return {
        phaseCompletions,
        certificationAttempts,
        successfulCertifications,
      };
    } catch (error) {
      console.warn('Analytics retention snapshot failed', error);
      return {
        phaseCompletions: 0,
        certificationAttempts: 0,
        successfulCertifications: 0,
      };
    }
  }
}
