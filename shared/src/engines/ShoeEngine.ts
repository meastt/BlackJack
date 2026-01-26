import { Card, Rank, Suit } from '../types';

export class Shoe {
  private cards: Card[] = [];
  private _runningCount: number = 0;
  private readonly numberOfDecks: number;

  constructor(numberOfDecks: number) {
    if (numberOfDecks < 1 || numberOfDecks > 8) {
      throw new Error('Number of decks must be between 1 and 8');
    }
    this.numberOfDecks = numberOfDecks;
    this.reset();
  }

  /**
   * Resets the shoe: generates new cards, shuffles them, and resets count.
   */
  public reset(): void {
    this.cards = this.generateShoe(this.numberOfDecks);
    this.shuffle();
    this._runningCount = 0;
  }

  /**
   * Generates a standard 52-card deck composition (4 of each rank per deck).
   */
  private generateShoe(numberOfDecks: number): Card[] {
    const shoe: Card[] = [];
    const suits = Object.values(Suit);
    const ranks = Object.values(Rank);

    for (let i = 0; i < numberOfDecks; i++) {
      for (const suit of suits) {
        for (const rank of ranks) {
          shoe.push({
            suit,
            rank,
            id: `${rank}-${suit}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          });
        }
      }
    }
    return shoe;
  }

  /**
   * Implements a Fisher-Yates shuffle on initialization.
   */
  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Pops the top card and updates the 'Ground Truth' Running Count.
   * Hi-Lo: 2-6 = +1, 10-A = -1, 7-9 = 0.
   * Functional constraint: No Math.random() calls inside this method.
   */
  public pop(): Card | undefined {
    if (this.cards.length === 0) {
      return undefined;
    }

    const card = this.cards.pop();
    if (card) {
      this.updateRunningCount(card);
    }
    return card;
  }

  /**
   * Updates the internal running count based on Hi-Lo system.
   */
  private updateRunningCount(card: Card): void {
    const rank = card.rank;
    if (
      rank === Rank.TWO ||
      rank === Rank.THREE ||
      rank === Rank.FOUR ||
      rank === Rank.FIVE ||
      rank === Rank.SIX
    ) {
      this._runningCount += 1;
    } else if (
      rank === Rank.TEN ||
      rank === Rank.JACK ||
      rank === Rank.QUEEN ||
      rank === Rank.KING ||
      rank === Rank.ACE
    ) {
      this._runningCount -= 1;
    }
    // 7, 8, 9 are 0, so no change
  }

  /**
   * Returns the current Ground Truth Running Count.
   */
  public getRunningCount(): number {
    return this._runningCount;
  }

  /**
   * Returns the Ground Truth True Count based on estimated decks remaining.
   * TC = RC / DecksRemaining
   */
  public getTrueCount(estimatedDecksRemaining: number): number {
    if (estimatedDecksRemaining <= 0) {
      // Avoid division by zero, return RC or handle as edge case.
      // In practice, if decks remaining is 0, game is over.
      // Return 0 or RC. Standard is technically undefined but we return RC for safety or 0.
      return 0;
    }
    return this._runningCount / estimatedDecksRemaining;
  }

  /**
   * Returns the number of cards remaining in the shoe.
   */
  public getCardsRemaining(): number {
    return this.cards.length;
  }
  
  /**
   * Returns the remaining cards in the shoe (for inspection/debugging).
   * Returns a copy to maintain immutability of internal state.
   */
  public getRemainingCards(): Card[] {
    return [...this.cards];
  }
}
