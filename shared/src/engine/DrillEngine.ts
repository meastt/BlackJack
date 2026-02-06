import { Card, DrillType, DrillConfig, DrillResult, Rank } from '../types';
import { CardCountingEngine } from './CardCountingEngine';

export interface DrillQuestion {
  cards: Card[];
  correctAnswer: number;
  questionType: DrillType;
  timestamp: number;
}

export class DrillEngine {
  private config: DrillConfig;
  private currentQuestion: DrillQuestion | null = null;
  private correctAnswers: number = 0;
  private incorrectAnswers: number = 0;
  private startTime: number = 0;
  private cardsShown: number = 0;

  constructor(config: DrillConfig) {
    this.config = config;
  }

  /**
   * Start a new drill session
   */
  startDrill(): void {
    this.reset();
    this.startTime = Date.now();
  }

  /**
   * Generate a new question based on drill type
   */
  generateQuestion(): DrillQuestion {
    const { type } = this.config;
    let cards: Card[] = [];
    let correctAnswer = 0;

    switch (type) {
      case DrillType.SINGLE_CARD_FLASH:
        cards = this.generateRandomCards(1);
        correctAnswer = this.calculateRunningCount(cards);
        this.cardsShown += 1;
        break;

      case DrillType.CARD_PAIRS:
        cards = this.generateRandomCards(2);
        correctAnswer = this.calculateRunningCount(cards);
        this.cardsShown += 2;
        break;

      case DrillType.CARD_TRIPLETS:
        cards = this.generateRandomCards(3);
        correctAnswer = this.calculateRunningCount(cards);
        this.cardsShown += 3;
        break;

      case DrillType.RUNNING_COUNT:
        const numCards = Math.floor(Math.random() * 10) + 10; // 10-20 cards
        cards = this.generateRandomCards(numCards);
        correctAnswer = this.calculateRunningCount(cards);
        this.cardsShown += numCards;
        break;

      case DrillType.DECK_COUNTDOWN:
        cards = CardCountingEngine.createDeck();
        correctAnswer = 0; // Balanced system should end at 0
        this.cardsShown += 52;
        break;

      default:
        cards = this.generateRandomCards(1);
        correctAnswer = this.calculateRunningCount(cards);
        this.cardsShown += 1;
    }

    this.currentQuestion = {
      cards,
      correctAnswer,
      questionType: type,
      timestamp: Date.now(),
    };

    return this.currentQuestion;
  }

  /**
   * Submit an answer and get feedback
   */
  submitAnswer(userAnswer: number): boolean {
    if (!this.currentQuestion) {
      throw new Error('No active question');
    }

    const isCorrect = userAnswer === this.currentQuestion.correctAnswer;

    if (isCorrect) {
      this.correctAnswers++;
    } else {
      this.incorrectAnswers++;
    }

    return isCorrect;
  }

  /**
   * Get the current drill results
   */
  getResults(): DrillResult {
    const timeElapsed = Date.now() - this.startTime;
    const totalAnswers = this.correctAnswers + this.incorrectAnswers;
    const accuracy = totalAnswers > 0 ? (this.correctAnswers / totalAnswers) * 100 : 0;
    const speed = CardCountingEngine.calculateCardsPerMinute(this.cardsShown, timeElapsed);

    return {
      drillType: this.config.type,
      accuracy,
      speed,
      cardsShown: this.cardsShown,
      correctAnswers: this.correctAnswers,
      incorrectAnswers: this.incorrectAnswers,
      completedAt: new Date(),
      timeElapsed,
    };
  }

  /**
   * Check if drill target is met
   */
  isTargetMet(): boolean {
    const results = this.getResults();
    return (
      results.accuracy >= this.config.targetAccuracy &&
      results.speed >= this.config.targetSpeed
    );
  }

  /**
   * Reset the drill session
   */
  private reset(): void {
    this.currentQuestion = null;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.startTime = 0;
    this.cardsShown = 0;
  }

  /**
   * Generate random cards
   */
  private generateRandomCards(count: number): Card[] {
    const deck = CardCountingEngine.createShoe(1);
    return deck.slice(0, count);
  }

  /**
   * Calculate running count for a set of cards
   */
  private calculateRunningCount(cards: Card[]): number {
    const engine = new CardCountingEngine();
    return engine.countCards(cards);
  }

  /**
   * Generate a true count drill question
   */
  generateTrueCountQuestion(): {
    runningCount: number;
    decksRemaining: number;
    correctTrueCount: number;
  } {
    const runningCount = Math.floor(Math.random() * 20) - 10; // -10 to +10
    const decksRemaining = Math.floor(Math.random() * 50) / 10 + 0.5; // 0.5 to 5.5
    const correctTrueCount = Math.trunc(runningCount / decksRemaining);

    return {
      runningCount,
      decksRemaining,
      correctTrueCount,
    };
  }

  /**
   * Generate a bet sizing question
   */
  generateBetSizingQuestion(minBet: number = 10): {
    trueCount: number;
    correctBet: number;
  } {
    const trueCount = Math.floor(Math.random() * 8) - 2; // -2 to +5
    let multiplier = 1;

    if (trueCount <= 1) multiplier = 1;
    else if (trueCount === 2) multiplier = 2;
    else if (trueCount === 3) multiplier = 4;
    else multiplier = 8;

    return {
      trueCount,
      correctBet: minBet * multiplier,
    };
  }
}
