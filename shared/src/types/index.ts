// Card and Deck Types
export enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades',
}

export enum Rank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // Unique identifier for rendering
}

// Counting Systems
export enum CountingSystem {
  HI_LO = 'hi_lo',
  KO = 'ko',
  HI_OPT_I = 'hi_opt_1',
  HI_OPT_II = 'hi_opt_2',
  OMEGA_II = 'omega_2',
  ZEN = 'zen',
}

export interface CountingSystemConfig {
  name: string;
  system: CountingSystem;
  values: Record<Rank, number>;
  isBalanced: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
}

// User Progress Types
export enum LearningPhase {
  CARD_VALUES = 'card_values',
  RUNNING_COUNT = 'running_count',
  TRUE_COUNT = 'true_count',
  BETTING_CORRELATION = 'betting_correlation',
}

export enum GameMode {
  GUIDED_LEARNING = 'guided_learning',
  CASINO_SIM_TIER_1 = 'casino_sim_tier_1',
  CASINO_SIM_TIER_2 = 'casino_sim_tier_2',
  CASINO_SIM_TIER_3 = 'casino_sim_tier_3',
  CASINO_SIM_TIER_4 = 'casino_sim_tier_4',
  CASINO_SIM_TIER_5 = 'casino_sim_tier_5',
  PRESSURE_TRAINING = 'pressure_training',
}

export interface UserStats {
  userId: string;
  cardsPerMinute: number;
  runningCountAccuracy: number; // 0-100
  trueCountAccuracy: number; // 0-100
  betCorrelationScore: number; // 0-100
  heatScore: number; // 0-100 (lower is better)
  distractionResistance: number; // 0-100
  sessionEV: number; // Expected value in units
  totalHandsPlayed: number;
  currentPhase: LearningPhase;
  unlockedModes: GameMode[];
  currentSystem: CountingSystem;
  unlockedSystems: CountingSystem[];
  lastUpdated: Date;
}

// Drill Types
export enum DrillType {
  SINGLE_CARD_FLASH = 'single_card_flash',
  CARD_PAIRS = 'card_pairs',
  CARD_TRIPLETS = 'card_triplets',
  RUNNING_COUNT = 'running_count',
  DECK_COUNTDOWN = 'deck_countdown',
  TRUE_COUNT_CALC = 'true_count_calc',
  BET_SIZING = 'bet_sizing',
  SPEED_DRILL = 'speed_drill',
  DISTRACTION_DRILL = 'distraction_drill',
}

export interface DrillConfig {
  type: DrillType;
  duration: number; // milliseconds
  cardDisplayTime: number; // milliseconds per card
  targetAccuracy: number; // 0-100
  targetSpeed: number; // cards per minute
}

export interface DrillResult {
  drillType: DrillType;
  accuracy: number;
  speed: number;
  cardsShown: number;
  correctAnswers: number;
  incorrectAnswers: number;
  completedAt: Date;
  timeElapsed: number; // milliseconds
}

// Session Types
export interface GameSession {
  sessionId: string;
  userId: string;
  mode: GameMode;
  system: CountingSystem;
  startTime: Date;
  endTime?: Date;
  handsPlayed: number;
  currentRunningCount: number;
  currentTrueCount: number;
  decksRemaining: number;
  results: DrillResult[];
  ev: number;
}

// Subscription Types
export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM_MONTHLY = 'premium_monthly',
  PREMIUM_YEARLY = 'premium_yearly',
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  revenueCatId?: string;
}

// AI Coach Types
export interface CoachMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface CoachContext {
  currentPhase: LearningPhase;
  currentSystem: CountingSystem;
  recentStats: Partial<UserStats>;
  sessionHistory: DrillResult[];
}

export interface CoachRequest {
  userId: string;
  message: string;
  context: CoachContext;
}

export interface CoachResponse {
  message: string;
  suggestions?: string[];
  timestamp: Date;
}

// Betting Strategy
export interface BettingUnit {
  trueCount: number;
  betMultiplier: number; // Multiple of minimum bet
}

export const HI_LO_BETTING_STRATEGY: BettingUnit[] = [
  { trueCount: 1, betMultiplier: 1 },
  { trueCount: 2, betMultiplier: 2 },
  { trueCount: 3, betMultiplier: 4 },
  { trueCount: 4, betMultiplier: 8 },
];
