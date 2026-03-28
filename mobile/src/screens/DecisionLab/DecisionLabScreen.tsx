import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { Button } from '../../components/Button';
import { useSimState } from '../../store/SimState';
import { AnalyticsService } from '../../services/analyticsService';
import { SessionRecapCard } from '../../components/metrics/SessionRecapCard';

type DifficultyMode = 'NOVICE' | 'ADVANCED';
type DecisionAction = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT';
type SizingBand = 'MIN' | 'MID' | 'MAX';

interface LabScenario {
  id: string;
  category: 'COUNT_DRIFT' | 'ACTION_MISMATCH' | 'SIZING_DISCIPLINE' | 'TIME_PRESSURE';
  hand: string;
  dealerUpCard: string;
  trueCount: number;
  runningCount: number;
  shoePenetration: number;
  recommendedAction: DecisionAction;
  recommendedSizing: SizingBand;
}

interface HomeScreenProps {
  navigation: any;
}

const ACTIONS: DecisionAction[] = ['HIT', 'STAND', 'DOUBLE', 'SPLIT'];
const SIZING_BANDS: SizingBand[] = ['MIN', 'MID', 'MAX'];

const SCENARIO_BANK = [
  { hand: '16', dealer: '10', action: 'HIT', sizing: 'MIN', category: 'ACTION_MISMATCH' },
  { hand: '12', dealer: '3', action: 'HIT', sizing: 'MID', category: 'COUNT_DRIFT' },
  { hand: 'A,7', dealer: '9', action: 'HIT', sizing: 'MID', category: 'ACTION_MISMATCH' },
  { hand: '10,10', dealer: '6', action: 'STAND', sizing: 'MAX', category: 'SIZING_DISCIPLINE' },
  { hand: '9,9', dealer: '7', action: 'STAND', sizing: 'MID', category: 'ACTION_MISMATCH' },
  { hand: '11', dealer: 'A', action: 'HIT', sizing: 'MID', category: 'TIME_PRESSURE' },
  { hand: '15', dealer: '10', action: 'HIT', sizing: 'MIN', category: 'COUNT_DRIFT' },
  { hand: '13', dealer: '2', action: 'STAND', sizing: 'MID', category: 'ACTION_MISMATCH' },
  { hand: 'A,8', dealer: '6', action: 'STAND', sizing: 'MAX', category: 'SIZING_DISCIPLINE' },
  { hand: '8,8', dealer: '10', action: 'SPLIT', sizing: 'MIN', category: 'TIME_PRESSURE' },
] as const;

const LEAK_COPY: Record<LabScenario['category'], string> = {
  COUNT_DRIFT: 'Count drift in deep-penetration spots',
  ACTION_MISMATCH: 'Action selection mismatch vs dealer up-card',
  SIZING_DISCIPLINE: 'Sizing-band discipline breakdown',
  TIME_PRESSURE: 'Decision quality degrades under timer pressure',
};

const DRILL_MAPPER: Record<LabScenario['category'], string> = {
  COUNT_DRIFT: 'True Count Conversion',
  ACTION_MISMATCH: 'Deviation Precision',
  SIZING_DISCIPLINE: 'Bet Sizing Calibration',
  TIME_PRESSURE: 'Speed Count',
};

const buildScenario = (index: number, difficulty: DifficultyMode): LabScenario => {
  const template = SCENARIO_BANK[index % SCENARIO_BANK.length];
  const volatility = difficulty === 'ADVANCED' ? 3 : 1;
  const penetrationBias = difficulty === 'ADVANCED' ? 14 : 0;
  const tcSeed = (index % 7) - 2;

  return {
    id: `scenario-${Date.now()}-${index}`,
    category: template.category,
    hand: template.hand,
    dealerUpCard: template.dealer,
    trueCount: Math.max(-2, Math.min(7, tcSeed + volatility)),
    runningCount: (index + 2) * volatility + (difficulty === 'ADVANCED' ? 3 : 0),
    shoePenetration: Math.min(95, 35 + index * 7 + penetrationBias),
    recommendedAction: template.action,
    recommendedSizing: template.sizing,
  };
};

export const DecisionLabScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    edgeScore,
    metrics,
    getReadinessTier,
    recordScenarioResult,
    finalizeEdgeSession,
    lastSessionSummary,
  } = useSimState();

  const [difficulty, setDifficulty] = useState<DifficultyMode>('NOVICE');
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [activeScenario, setActiveScenario] = useState<LabScenario | null>(null);
  const [selectedAction, setSelectedAction] = useState<DecisionAction | null>(null);
  const [selectedSizing, setSelectedSizing] = useState<SizingBand | null>(null);
  const [scenarioStartedAt, setScenarioStartedAt] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(12);

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [distractorPrompt, setDistractorPrompt] = useState<string | null>(null);
  const [leakBuckets, setLeakBuckets] = useState<Record<LabScenario['category'], number>>({
    COUNT_DRIFT: 0,
    ACTION_MISMATCH: 0,
    SIZING_DISCIPLINE: 0,
    TIME_PRESSURE: 0,
  });

  const sessionTarget = difficulty === 'ADVANCED' ? 8 : 5;
  const initialTimer = difficulty === 'ADVANCED' ? 6 : 12;
  const sessionComplete = scenarioIndex >= sessionTarget;

  useEffect(() => {
    if (!activeScenario || sessionComplete) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeScenario, sessionComplete]);

  useEffect(() => {
    if (!activeScenario || sessionComplete || timeLeft !== 0) return;
    submitScenario(true);
  }, [timeLeft, activeScenario, sessionComplete]);

  useEffect(() => {
    if (!activeScenario || difficulty !== 'ADVANCED') {
      setDistractorPrompt(null);
      return;
    }

    const distractors = [
      'Noise spike: cocktail server interrupt',
      'Peripheral distraction: table chatter rising',
      'Speed pressure: dealer cadence increased',
      'Cover pressure: maintain consistent tempo',
    ];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * distractors.length);
      setDistractorPrompt(distractors[idx]);
    }, 2500);

    return () => clearInterval(interval);
  }, [activeScenario, difficulty]);

  const readinessTier = getReadinessTier();

  const topLeaks = useMemo(() => {
    const ranked = Object.entries(leakBuckets)
      .sort((a, b) => b[1] - a[1])
      .filter(([, count]) => count > 0)
      .slice(0, 3)
      .map(([key]) => LEAK_COPY[key as LabScenario['category']]);

    return ranked.length > 0 ? ranked : ['No critical leaks detected this session'];
  }, [leakBuckets]);

  const nextDrillRecommendation = useMemo(() => {
    const topLeak = Object.entries(leakBuckets).sort((a, b) => b[1] - a[1])[0];
    if (!topLeak || topLeak[1] === 0) {
      if (metrics.decisionLatencyMs > 2600) return 'Speed Count';
      if (metrics.countIntegrity < 90) return 'True Count Conversion';
      return 'Deviation Precision';
    }
    return DRILL_MAPPER[topLeak[0] as LabScenario['category']];
  }, [leakBuckets, metrics.decisionLatencyMs, metrics.countIntegrity]);

  const startSession = () => {
    setSessionStartedAt(Date.now());
    setScenarioIndex(0);
    setSelectedAction(null);
    setSelectedSizing(null);
    setFeedbackMessage(null);
    setDistractorPrompt(null);
    setLeakBuckets({
      COUNT_DRIFT: 0,
      ACTION_MISMATCH: 0,
      SIZING_DISCIPLINE: 0,
      TIME_PRESSURE: 0,
    });

    const scenario = buildScenario(0, difficulty);
    setActiveScenario(scenario);
    setScenarioStartedAt(Date.now());
    setTimeLeft(initialTimer);
    AnalyticsService.trackEvent('scenario_started', { difficulty, scenario_number: 1 });
  };

  const advanceScenario = () => {
    const nextIndex = scenarioIndex + 1;
    setScenarioIndex(nextIndex);

    if (nextIndex >= sessionTarget) {
      setActiveScenario(null);
      return;
    }

    const nextScenario = buildScenario(nextIndex, difficulty);
    setActiveScenario(nextScenario);
    setScenarioStartedAt(Date.now());
    setTimeLeft(initialTimer);
    setSelectedAction(null);
    setSelectedSizing(null);
    AnalyticsService.trackEvent('scenario_started', { difficulty, scenario_number: nextIndex + 1 });
  };

  const submitScenario = (timedOut = false) => {
    if (!activeScenario) return;

    const latency = Date.now() - scenarioStartedAt;
    const actionCorrect = selectedAction === activeScenario.recommendedAction;
    const sizingCorrect = selectedSizing === activeScenario.recommendedSizing;
    const countCorrect = activeScenario.trueCount >= 0;
    if (!actionCorrect || !sizingCorrect || !countCorrect || timedOut) {
      setLeakBuckets((prev) => ({
        ...prev,
        [activeScenario.category]: prev[activeScenario.category] + 1,
      }));
    }

    recordScenarioResult({
      scenarioId: activeScenario.id,
      timestamp: Date.now(),
      correctCount: countCorrect,
      correctDecision: actionCorrect && !timedOut,
      correctSizing: sizingCorrect && !timedOut,
      decisionLatencyMs: latency,
      evDelta: actionCorrect ? 1.2 : 0.2,
      mistakePenalty: timedOut ? 0.8 : sizingCorrect ? 0.2 : 0.6,
    });
    AnalyticsService.trackEvent('scenario_completed', {
      difficulty,
      timed_out: timedOut,
      action_correct: actionCorrect,
      sizing_correct: sizingCorrect,
      count_correct: countCorrect,
      latency_ms: latency,
    });

    const verdict = timedOut
      ? 'Timeout'
      : actionCorrect && sizingCorrect
        ? 'Strong decision'
        : 'Leak detected';

    setFeedbackMessage(
      `${verdict}: recommended ${activeScenario.recommendedAction} + ${activeScenario.recommendedSizing}`
    );

    advanceScenario();
  };

  const finishSession = () => {
    if (!sessionStartedAt) return;
    const summary = finalizeEdgeSession(sessionStartedAt);
    AnalyticsService.trackEvent('edge_score_delta', {
      edge_score_delta: summary.edgeScoreDelta,
      readiness_tier: summary.readinessTier,
      scenarios_completed: summary.scenariosCompleted,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>CARD COUNTING PROTOCOL 21 // TABLE DECISION LAB</Text>
        <Text style={styles.title}>Decision Lab</Text>
        <Text style={styles.description}>
          Timed scenario training focused on count quality, action precision, and sizing discipline.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Controls</Text>
          <View style={styles.pillRow}>
            {(['NOVICE', 'ADVANCED'] as DifficultyMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.pill, difficulty === mode && styles.pillActive]}
                onPress={() => setDifficulty(mode)}
              >
                <Text style={[styles.pillText, difficulty === mode && styles.pillTextActive]}>{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.cardBody}>Readiness Tier: {readinessTier}</Text>
          <Text style={styles.cardBody}>Edge Score: {edgeScore.toFixed(0)}</Text>
        </View>

        {!activeScenario && !sessionComplete && (
          <Button title="Start Decision Session" onPress={startSession} size="large" />
        )}

        {activeScenario && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Scenario {scenarioIndex + 1} / {sessionTarget}</Text>
            <Text style={styles.cardBody}>Hand: {activeScenario.hand} vs Dealer {activeScenario.dealerUpCard}</Text>
            <Text style={styles.cardBody}>Running Count: {activeScenario.runningCount}</Text>
            <Text style={styles.cardBody}>True Count: {activeScenario.trueCount}</Text>
            <Text style={styles.cardBody}>Shoe Penetration: {activeScenario.shoePenetration}%</Text>
            <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
            {difficulty === 'NOVICE' && (
              <Text style={styles.hintText}>
                Hint: prioritize count integrity first, then action, then sizing discipline.
              </Text>
            )}
            {difficulty === 'ADVANCED' && distractorPrompt && (
              <Text style={styles.distractorText}>⚠ {distractorPrompt}</Text>
            )}

            <Text style={styles.selectorTitle}>Action</Text>
            <View style={styles.pillRow}>
              {ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action}
                  style={[styles.pill, selectedAction === action && styles.pillActive]}
                  onPress={() => setSelectedAction(action)}
                >
                  <Text style={[styles.pillText, selectedAction === action && styles.pillTextActive]}>{action}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.selectorTitle}>Sizing Band</Text>
            <View style={styles.pillRow}>
              {SIZING_BANDS.map((band) => (
                <TouchableOpacity
                  key={band}
                  style={[styles.pill, selectedSizing === band && styles.pillActive]}
                  onPress={() => setSelectedSizing(band)}
                >
                  <Text style={[styles.pillText, selectedSizing === band && styles.pillTextActive]}>{band}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Submit Scenario" onPress={() => submitScenario(false)} size="large" />
          </View>
        )}

        {feedbackMessage && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Immediate Feedback</Text>
            <Text style={styles.cardBody}>{feedbackMessage}</Text>
          </View>
        )}

        {sessionComplete && (
          <View style={styles.card}>
            <SessionRecapCard
              edgeGained={(metrics.evCaptured - metrics.mistakeCost).toFixed(1)}
              topLeaks={topLeaks}
              nextDrill={nextDrillRecommendation}
            />
            <Button title="Finalize Session" onPress={finishSession} variant="secondary" size="large" />
          </View>
        )}

        {lastSessionSummary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last Summary</Text>
            <Text style={styles.cardBody}>Scenarios: {lastSessionSummary.scenariosCompleted}</Text>
            <Text style={styles.cardBody}>Edge Delta: {lastSessionSummary.edgeScoreDelta.toFixed(1)}</Text>
            <Text style={styles.cardBody}>Tier: {lastSessionSummary.readinessTier}</Text>
          </View>
        )}

        <Button
          title="Return Home"
          onPress={() => navigation.navigate('Home')}
          variant="outline"
          size="large"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
  },
  eyebrow: {
    color: colors.accentCyan,
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: '800',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  timer: {
    color: colors.accentAmber,
    fontSize: 14,
    fontWeight: '700',
  },
  hintText: {
    color: colors.accentCyan,
    fontSize: 12,
    lineHeight: 18,
  },
  distractorText: {
    color: colors.warning,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  selectorTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surfaceDark,
  },
  pillActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99,102,241,0.2)',
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.textPrimary,
  },
});
