import { Card, Rank } from '@card-counter-ai/shared';

export type Hand = {
  cards: Card[];
  bet: number;
  isDoubled: boolean;
  isStanding: boolean;
  isBusted: boolean;
  isSplit: boolean;
};

export type GameResult = {
  outcome: 'WIN' | 'LOSE' | 'PUSH' | 'BLACKJACK';
  payout: number; // Multiplier: 1.0 for push, 2.5 for blackjack, 2.0 for win, 0 for loss
};

export class BlackjackGameEngine {
  /**
   * Calculate hand value with soft/hard ace logic
   * Returns the best value <= 21 if possible
   */
  static getHandValue(cards: Card[]): { value: number; isSoft: boolean } {
    let value = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.rank === Rank.ACE) {
        aces++;
        value += 11;
      } else if ([Rank.KING, Rank.QUEEN, Rank.JACK, Rank.TEN].includes(card.rank)) {
        value += 10;
      } else {
        // Number cards: TWO through NINE
        const numValue = {
          [Rank.TWO]: 2,
          [Rank.THREE]: 3,
          [Rank.FOUR]: 4,
          [Rank.FIVE]: 5,
          [Rank.SIX]: 6,
          [Rank.SEVEN]: 7,
          [Rank.EIGHT]: 8,
          [Rank.NINE]: 9,
        }[card.rank];
        value += numValue || 0;
      }
    }

    // Adjust for aces (count as 1 instead of 11 if busting)
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    const isSoft = aces > 0 && value <= 21;
    return { value, isSoft };
  }

  /**
   * Check if hand is a natural blackjack (21 with exactly 2 cards)
   */
  static isBlackjack(cards: Card[]): boolean {
    return cards.length === 2 && this.getHandValue(cards).value === 21;
  }

  /**
   * Check if hand is busted (over 21)
   */
  static isBusted(cards: Card[]): boolean {
    return this.getHandValue(cards).value > 21;
  }

  /**
   * Check if player can split (two cards of same value)
   */
  static canSplit(cards: Card[], hasEnoughMoney: boolean): boolean {
    if (cards.length !== 2 || !hasEnoughMoney) return false;

    const [c1, c2] = cards;

    // Get card value (all 10-value cards can be split together)
    const getValue = (c: Card) => {
      if ([Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING].includes(c.rank)) {
        return 10;
      }
      if (c.rank === Rank.ACE) return 1;
      return {
        [Rank.TWO]: 2,
        [Rank.THREE]: 3,
        [Rank.FOUR]: 4,
        [Rank.FIVE]: 5,
        [Rank.SIX]: 6,
        [Rank.SEVEN]: 7,
        [Rank.EIGHT]: 8,
        [Rank.NINE]: 9,
      }[c.rank] || 0;
    };

    return getValue(c1) === getValue(c2);
  }

  /**
   * Check if player can double down (2 cards, enough money)
   */
  static canDouble(cards: Card[], hasEnoughMoney: boolean): boolean {
    return cards.length === 2 && hasEnoughMoney;
  }

  /**
   * Determine if dealer should hit based on house rules
   * Standard rules: Hit on 16 or less, hit on soft 17, stand on hard 17+
   */
  static dealerShouldHit(cards: Card[]): boolean {
    const { value, isSoft } = this.getHandValue(cards);

    if (value < 17) return true;
    if (value === 17 && isSoft) return true; // Hit soft 17 (casino standard)
    return false;
  }

  /**
   * Resolve a hand against the dealer and determine payout
   */
  static resolveHand(playerCards: Card[], dealerCards: Card[], bet: number): GameResult {
    const playerValue = this.getHandValue(playerCards).value;
    const dealerValue = this.getHandValue(dealerCards).value;
    const playerBJ = this.isBlackjack(playerCards);
    const dealerBJ = this.isBlackjack(dealerCards);

    // Player busted
    if (playerValue > 21) {
      return { outcome: 'LOSE', payout: 0 };
    }

    // Dealer busted, player wins
    if (dealerValue > 21) {
      return { outcome: 'WIN', payout: 2.0 };
    }

    // Both have blackjack - push
    if (playerBJ && dealerBJ) {
      return { outcome: 'PUSH', payout: 1.0 };
    }

    // Player has blackjack (3:2 payout)
    if (playerBJ) {
      return { outcome: 'BLACKJACK', payout: 2.5 };
    }

    // Dealer has blackjack
    if (dealerBJ) {
      return { outcome: 'LOSE', payout: 0 };
    }

    // Compare values
    if (playerValue > dealerValue) {
      return { outcome: 'WIN', payout: 2.0 };
    } else if (playerValue < dealerValue) {
      return { outcome: 'LOSE', payout: 0 };
    } else {
      return { outcome: 'PUSH', payout: 1.0 };
    }
  }

  /**
   * Calculate optimal bet using simplified Kelly Criterion
   * Based on true count and bankroll
   */
  static calculateOptimalBet(trueCount: number, bankroll: number, minBet: number = 10, maxBet: number = 200): number {
    if (trueCount <= 1) return minBet;

    // Bet spread: 1 unit at TC 1, increase by 1 unit per TC point
    // TC +2 = 2 units, TC +3 = 3 units, etc.
    const units = Math.max(1, trueCount);
    const bet = minBet * units;

    return Math.min(bet, maxBet, bankroll);
  }

  /**
   * Calculate heat generated from bet spread
   * Returns heat value (0-100 scale)
   */
  static calculateHeatFromBet(bet: number, trueCount: number, minBet: number = 10): number {
    const betSpread = bet / minBet;

    let heatIncrease = 0;

    // Large spread generates heat
    if (betSpread > 5) {
      heatIncrease = 5;
    } else if (betSpread > 3) {
      heatIncrease = 2;
    } else if (betSpread > 2) {
      heatIncrease = 1;
    }

    // Betting high when count is low (very suspicious)
    if (bet > minBet * 2 && trueCount <= 1) {
      heatIncrease += 10;
    }

    // Betting low when count is high (wong out behavior, also suspicious)
    if (bet === minBet && trueCount >= 3) {
      heatIncrease += 3;
    }

    return heatIncrease;
  }
}
