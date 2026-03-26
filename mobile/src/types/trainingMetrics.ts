export type ReadinessTier = 'NOVICE' | 'DEVELOPING' | 'ADVANTAGED' | 'ELITE';

export interface ScenarioResult {
  scenarioId: string;
  timestamp: number;
  correctCount: boolean;
  correctDecision: boolean;
  correctSizing: boolean;
  decisionLatencyMs: number;
  evDelta: number;
  mistakePenalty: number;
}

export interface EdgeSessionSummary {
  startedAt: number;
  completedAt: number;
  scenariosCompleted: number;
  edgeScoreStart: number;
  edgeScoreEnd: number;
  edgeScoreDelta: number;
  evCaptured: number;
  mistakeCost: number;
  countIntegrity: number;
  decisionLatencyMsAvg: number;
  readinessTier: ReadinessTier;
}

export const getReadinessTier = (edgeScore: number): ReadinessTier => {
  if (edgeScore >= 850) return 'ELITE';
  if (edgeScore >= 700) return 'ADVANTAGED';
  if (edgeScore >= 550) return 'DEVELOPING';
  return 'NOVICE';
};
