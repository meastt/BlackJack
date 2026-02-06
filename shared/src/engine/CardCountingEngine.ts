import { Card, Rank, Suit, CountingSystem, CountingSystemConfig } from '../types';

// Counting system configurations
export const COUNTING_SYSTEMS: Record<CountingSystem, CountingSystemConfig> = {
  [CountingSystem.HI_LO]: {
    name: 'Hi-Lo',
    system: CountingSystem.HI_LO,
    values: {
      [Rank.TWO]: 1,
      [Rank.THREE]: 1,
      [Rank.FOUR]: 1,
      [Rank.FIVE]: 1,
      [Rank.SIX]: 1,
      [Rank.SEVEN]: 0,
      [Rank.EIGHT]: 0,
      [Rank.NINE]: 0,
      [Rank.TEN]: -1,
      [Rank.JACK]: -1,
      [Rank.QUEEN]: -1,
      [Rank.KING]: -1,
      [Rank.ACE]: -1,
    },
    isBalanced: true,
    difficulty: 'beginner',
    description: 'The most popular and easiest card counting system. Perfect for beginners.',
  },
  [CountingSystem.KO]: {
    name: 'Knock-Out (KO)',
    system: CountingSystem.KO,
    values: {
      [Rank.TWO]: 1,
      [Rank.THREE]: 1,
      [Rank.FOUR]: 1,
      [Rank.FIVE]: 1,
      [Rank.SIX]: 1,
      [Rank.SEVEN]: 1,
      [Rank.EIGHT]: 0,
      [Rank.NINE]: 0,
      [Rank.TEN]: -1,
      [Rank.JACK]: -1,
      [Rank.QUEEN]: -1,
      [Rank.KING]: -1,
      [Rank.ACE]: -1,
    },
    isBalanced: false,
    difficulty: 'beginner',
    description: 'Unbalanced system with no true count conversion needed.',
  },
  [CountingSystem.HI_OPT_I]: {
    name: 'Hi-Opt I',
    system: CountingSystem.HI_OPT_I,
    values: {
      [Rank.TWO]: 0,
      [Rank.THREE]: 1,
      [Rank.FOUR]: 1,
      [Rank.FIVE]: 1,
      [Rank.SIX]: 1,
      [Rank.SEVEN]: 0,
      [Rank.EIGHT]: 0,
      [Rank.NINE]: 0,
      [Rank.TEN]: -1,
      [Rank.JACK]: -1,
      [Rank.QUEEN]: -1,
      [Rank.KING]: -1,
      [Rank.ACE]: 0,
    },
    isBalanced: true,
    difficulty: 'intermediate',
    description: 'More accurate than Hi-Lo, requires side-counting aces for optimal play.',
  },
  [CountingSystem.HI_OPT_II]: {
    name: 'Hi-Opt II',
    system: CountingSystem.HI_OPT_II,
    values: {
      [Rank.TWO]: 1,
      [Rank.THREE]: 1,
      [Rank.FOUR]: 2,
      [Rank.FIVE]: 2,
      [Rank.SIX]: 1,
      [Rank.SEVEN]: 1,
      [Rank.EIGHT]: 0,
      [Rank.NINE]: 0,
      [Rank.TEN]: -2,
      [Rank.JACK]: -2,
      [Rank.QUEEN]: -2,
      [Rank.KING]: -2,
      [Rank.ACE]: 0,
    },
    isBalanced: true,
    difficulty: 'advanced',
    description: 'Multi-level system with ace side count. High accuracy, high difficulty.',
  },
  [CountingSystem.OMEGA_II]: {
    name: 'Omega II',
    system: CountingSystem.OMEGA_II,
    values: {
      [Rank.TWO]: 1,
      [Rank.THREE]: 1,
      [Rank.FOUR]: 2,
      [Rank.FIVE]: 2,
      [Rank.SIX]: 2,
      [Rank.SEVEN]: 1,
      [Rank.EIGHT]: 0,
      [Rank.NINE]: -1,
      [Rank.TEN]: -2,
      [Rank.JACK]: -2,
      [Rank.QUEEN]: -2,
      [Rank.KING]: -2,
      [Rank.ACE]: 0,
    },
    isBalanced: true,
    difficulty: 'expert',
    description: 'Highly accurate multi-level system. Requires significant practice.',
  },
  [CountingSystem.ZEN]: {
    name: 'Zen Count',
    system: CountingSystem.ZEN,
    values: {
      [Rank.TWO]: 1,
      [Rank.THREE]: 1,
      [Rank.FOUR]: 2,
      [Rank.FIVE]: 2,
      [Rank.SIX]: 2,
      [Rank.SEVEN]: 1,
      [Rank.EIGHT]: 0,
      [Rank.NINE]: 0,
      [Rank.TEN]: -2,
      [Rank.JACK]: -2,
      [Rank.QUEEN]: -2,
      [Rank.KING]: -2,
      [Rank.ACE]: -1,
    },
    isBalanced: true,
    difficulty: 'advanced',
    description: 'Balanced multi-level system with good betting correlation.',
  },
};

export class CardCountingEngine {
  private system: CountingSystem;
  private runningCount: number;
  private cardsDealt: number;
  private totalDecks: number;

  constructor(system: CountingSystem = CountingSystem.HI_LO, totalDecks: number = 6) {
    this.system = system;
    this.runningCount = 0;
    this.cardsDealt = 0;
    this.totalDecks = totalDecks;
  }

  /**
   * Get the count value for a specific card rank
   */
  getCardValue(rank: Rank): number {
    const config = COUNTING_SYSTEMS[this.system];
    return config.values[rank];
  }

  /**
   * Process a single card and update the running count
   */
  countCard(card: Card): number {
    const value = this.getCardValue(card.rank);
    this.runningCount += value;
    this.cardsDealt++;
    return this.runningCount;
  }

  /**
   * Process multiple cards at once
   */
  countCards(cards: Card[]): number {
    cards.forEach(card => this.countCard(card));
    return this.runningCount;
  }

  /**
   * Calculate the true count (running count divided by decks remaining)
   */
  getTrueCount(): number {
    const decksRemaining = this.getDecksRemaining();
    if (decksRemaining === 0) return 0;
    return Math.trunc(this.runningCount / decksRemaining);
  }

  /**
   * Calculate decks remaining based on cards dealt
   */
  getDecksRemaining(): number {
    const cardsPerDeck = 52;
    const totalCards = this.totalDecks * cardsPerDeck;
    const cardsRemaining = totalCards - this.cardsDealt;
    const decksRemaining = cardsRemaining / cardsPerDeck;
    return Math.max(0.5, decksRemaining); // Minimum 0.5 decks to avoid division issues
  }

  /**
   * Get the current running count
   */
  getRunningCount(): number {
    return this.runningCount;
  }

  /**
   * Reset the count (for new shoe)
   */
  reset(): void {
    this.runningCount = 0;
    this.cardsDealt = 0;
  }

  /**
   * Get the recommended bet multiplier based on true count
   */
  getBetMultiplier(minBet: number = 1): number {
    const trueCount = this.getTrueCount();

    if (trueCount <= 1) return 1;
    if (trueCount === 2) return 2;
    if (trueCount === 3) return 4;
    return 8; // TC +4 or higher
  }

  /**
   * Create a standard 52-card deck
   */
  static createDeck(): Card[] {
    const deck: Card[] = [];
    const suits = Object.values(Suit);
    const ranks = Object.values(Rank);

    suits.forEach(suit => {
      ranks.forEach(rank => {
        deck.push({
          suit,
          rank,
          id: `${rank}_${suit}_${Math.random().toString(36).substr(2, 9)}`,
        });
      });
    });

    return deck;
  }

  /**
   * Create a shoe with multiple decks
   */
  static createShoe(numDecks: number): Card[] {
    const shoe: Card[] = [];
    for (let i = 0; i < numDecks; i++) {
      shoe.push(...this.createDeck());
    }
    return this.shuffleDeck(shoe);
  }

  /**
   * Shuffle a deck using Fisher-Yates algorithm
   */
  static shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Validate a user's count against the actual count
   */
  static validateCount(userCount: number, actualCount: number): boolean {
    return userCount === actualCount;
  }

  /**
   * Calculate accuracy percentage
   */
  static calculateAccuracy(correct: number, total: number): number {
    if (total === 0) return 0;
    return (correct / total) * 100;
  }

  /**
   * Calculate cards per minute
   */
  static calculateCardsPerMinute(cardsCount: number, timeMs: number): number {
    if (timeMs === 0) return 0;
    const minutes = timeMs / 60000;
    return cardsCount / minutes;
  }
}
