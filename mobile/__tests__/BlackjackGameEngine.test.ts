import { BlackjackGameEngine } from '../src/utils/BlackjackGameEngine';
import { Card, Rank, Suit } from '@card-counter-ai/shared';

// Helper to create cards
const createCard = (rank: Rank, suit: Suit = Suit.SPADES): Card => ({
  rank,
  suit,
  id: `${rank}-${suit}-test`,
});

describe('BlackjackGameEngine', () => {
  describe('getHandValue', () => {
    it('should calculate simple number card values', () => {
      const hand = [createCard(Rank.FIVE), createCard(Rank.SEVEN)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(12);
      expect(result.isSoft).toBe(false);
    });

    it('should count Ace as 11 when possible (soft hand)', () => {
      const hand = [createCard(Rank.ACE), createCard(Rank.SEVEN)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(18);
      expect(result.isSoft).toBe(true);
    });

    it('should count Ace as 1 when 11 would bust (hard hand)', () => {
      const hand = [createCard(Rank.ACE), createCard(Rank.KING), createCard(Rank.NINE)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(20);
      expect(result.isSoft).toBe(false);
    });

    it('should handle multiple Aces correctly', () => {
      const hand = [createCard(Rank.ACE), createCard(Rank.ACE), createCard(Rank.NINE)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(21); // 11 + 1 + 9
      expect(result.isSoft).toBe(true);
    });

    it('should count face cards as 10', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.QUEEN)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(20);
    });

    it('should handle soft hand becoming hard after hit', () => {
      // A + 6 = soft 17, then hit 9 = hard 16
      const hand = [createCard(Rank.ACE), createCard(Rank.SIX), createCard(Rank.NINE)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(16);
      expect(result.isSoft).toBe(false);
    });

    it('should handle 10-value card correctly', () => {
      const hand = [createCard(Rank.TEN), createCard(Rank.FIVE)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(15);
    });
  });

  describe('isBlackjack', () => {
    it('should detect Ace + 10-value card as blackjack', () => {
      const hand = [createCard(Rank.ACE), createCard(Rank.KING)];
      expect(BlackjackGameEngine.isBlackjack(hand)).toBe(true);
    });

    it('should detect 10-value + Ace as blackjack', () => {
      const hand = [createCard(Rank.QUEEN), createCard(Rank.ACE)];
      expect(BlackjackGameEngine.isBlackjack(hand)).toBe(true);
    });

    it('should NOT detect 21 with 3+ cards as blackjack', () => {
      const hand = [createCard(Rank.SEVEN), createCard(Rank.SEVEN), createCard(Rank.SEVEN)];
      expect(BlackjackGameEngine.isBlackjack(hand)).toBe(false);
    });

    it('should NOT detect non-21 two-card hand as blackjack', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.NINE)];
      expect(BlackjackGameEngine.isBlackjack(hand)).toBe(false);
    });
  });

  describe('isBusted', () => {
    it('should detect hand over 21 as busted', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.QUEEN), createCard(Rank.FIVE)];
      expect(BlackjackGameEngine.isBusted(hand)).toBe(true);
    });

    it('should NOT detect hand at 21 as busted', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.QUEEN), createCard(Rank.ACE)];
      expect(BlackjackGameEngine.isBusted(hand)).toBe(false);
    });

    it('should NOT detect hand under 21 as busted', () => {
      const hand = [createCard(Rank.TEN), createCard(Rank.NINE)];
      expect(BlackjackGameEngine.isBusted(hand)).toBe(false);
    });

    it('should handle soft hand not busting', () => {
      const hand = [createCard(Rank.ACE), createCard(Rank.NINE), createCard(Rank.FIVE)];
      const result = BlackjackGameEngine.getHandValue(hand);
      expect(result.value).toBe(15); // A counts as 1
      expect(BlackjackGameEngine.isBusted(hand)).toBe(false);
    });
  });

  describe('canSplit', () => {
    it('should allow splitting matching ranks', () => {
      const hand = [createCard(Rank.EIGHT), createCard(Rank.EIGHT)];
      expect(BlackjackGameEngine.canSplit(hand, true)).toBe(true);
    });

    it('should allow splitting 10-value cards (K+Q)', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.QUEEN)];
      expect(BlackjackGameEngine.canSplit(hand, true)).toBe(true);
    });

    it('should allow splitting 10-value cards (J+10)', () => {
      const hand = [createCard(Rank.JACK), createCard(Rank.TEN)];
      expect(BlackjackGameEngine.canSplit(hand, true)).toBe(true);
    });

    it('should NOT allow splitting different values', () => {
      const hand = [createCard(Rank.NINE), createCard(Rank.TEN)];
      expect(BlackjackGameEngine.canSplit(hand, true)).toBe(false);
    });

    it('should NOT allow splitting with > 2 cards', () => {
      const hand = [createCard(Rank.EIGHT), createCard(Rank.EIGHT), createCard(Rank.EIGHT)];
      expect(BlackjackGameEngine.canSplit(hand, true)).toBe(false);
    });

    it('should NOT allow splitting without sufficient money', () => {
      const hand = [createCard(Rank.EIGHT), createCard(Rank.EIGHT)];
      expect(BlackjackGameEngine.canSplit(hand, false)).toBe(false);
    });
  });

  describe('canDouble', () => {
    it('should allow doubling with 2 cards and sufficient bankroll', () => {
      const hand = [createCard(Rank.FIVE), createCard(Rank.SIX)];
      expect(BlackjackGameEngine.canDouble(hand, true)).toBe(true);
    });

    it('should NOT allow doubling with > 2 cards', () => {
      const hand = [createCard(Rank.FIVE), createCard(Rank.SIX), createCard(Rank.TWO)];
      expect(BlackjackGameEngine.canDouble(hand, true)).toBe(false);
    });

    it('should NOT allow doubling without sufficient bankroll', () => {
      const hand = [createCard(Rank.FIVE), createCard(Rank.SIX)];
      expect(BlackjackGameEngine.canDouble(hand, false)).toBe(false);
    });
  });

  describe('dealerShouldHit', () => {
    it('should hit on 16 or less', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.SIX)];
      expect(BlackjackGameEngine.dealerShouldHit(hand)).toBe(true);
    });

    it('should hit on soft 17', () => {
      const hand = [createCard(Rank.ACE), createCard(Rank.SIX)];
      expect(BlackjackGameEngine.dealerShouldHit(hand)).toBe(true);
    });

    it('should stand on hard 17', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.SEVEN)];
      expect(BlackjackGameEngine.dealerShouldHit(hand)).toBe(false);
    });

    it('should stand on 18 or more', () => {
      const hand = [createCard(Rank.KING), createCard(Rank.EIGHT)];
      expect(BlackjackGameEngine.dealerShouldHit(hand)).toBe(false);
    });

    it('should stand on soft 18', () => {
      const hand = [createCard(Rank.ACE), createCard(Rank.SEVEN)];
      expect(BlackjackGameEngine.dealerShouldHit(hand)).toBe(false);
    });
  });

  describe('resolveHand', () => {
    it('should return 0 payout when player busts', () => {
      const playerHand = [createCard(Rank.KING), createCard(Rank.QUEEN), createCard(Rank.FIVE)];
      const dealerHand = [createCard(Rank.TEN), createCard(Rank.SEVEN)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('LOSE');
      expect(result.payout).toBe(0);
    });

    it('should return 2x payout when dealer busts', () => {
      const playerHand = [createCard(Rank.TEN), createCard(Rank.NINE)];
      const dealerHand = [createCard(Rank.KING), createCard(Rank.QUEEN), createCard(Rank.FIVE)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('WIN');
      expect(result.payout).toBe(2.0);
    });

    it('should return 2.5x payout for player blackjack', () => {
      const playerHand = [createCard(Rank.ACE), createCard(Rank.KING)];
      const dealerHand = [createCard(Rank.TEN), createCard(Rank.NINE)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('BLACKJACK');
      expect(result.payout).toBe(2.5); // 3:2 payout
    });

    it('should return push when both have blackjack', () => {
      const playerHand = [createCard(Rank.ACE), createCard(Rank.KING)];
      const dealerHand = [createCard(Rank.ACE), createCard(Rank.QUEEN)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('PUSH');
      expect(result.payout).toBe(1.0);
    });

    it('should return 0 payout when dealer has blackjack', () => {
      const playerHand = [createCard(Rank.TEN), createCard(Rank.NINE)];
      const dealerHand = [createCard(Rank.ACE), createCard(Rank.KING)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('LOSE');
      expect(result.payout).toBe(0);
    });

    it('should return 2x payout when player has higher value', () => {
      const playerHand = [createCard(Rank.KING), createCard(Rank.NINE)];
      const dealerHand = [createCard(Rank.TEN), createCard(Rank.SEVEN)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('WIN');
      expect(result.payout).toBe(2.0);
    });

    it('should return 0 payout when dealer has higher value', () => {
      const playerHand = [createCard(Rank.TEN), createCard(Rank.SEVEN)];
      const dealerHand = [createCard(Rank.KING), createCard(Rank.NINE)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('LOSE');
      expect(result.payout).toBe(0);
    });

    it('should return push when values are equal', () => {
      const playerHand = [createCard(Rank.KING), createCard(Rank.EIGHT)];
      const dealerHand = [createCard(Rank.NINE), createCard(Rank.NINE)];
      const result = BlackjackGameEngine.resolveHand(playerHand, dealerHand, 10);

      expect(result.outcome).toBe('PUSH');
      expect(result.payout).toBe(1.0);
    });
  });

  describe('calculateOptimalBet', () => {
    it('should return min bet when TC <= 1', () => {
      const bet = BlackjackGameEngine.calculateOptimalBet(1, 1000, 10, 200);
      expect(bet).toBe(10);
    });

    it('should return 2 units when TC = 2', () => {
      const bet = BlackjackGameEngine.calculateOptimalBet(2, 1000, 10, 200);
      expect(bet).toBe(20);
    });

    it('should return 5 units when TC = 5', () => {
      const bet = BlackjackGameEngine.calculateOptimalBet(5, 1000, 10, 200);
      expect(bet).toBe(50);
    });

    it('should not exceed max bet', () => {
      const bet = BlackjackGameEngine.calculateOptimalBet(25, 1000, 10, 200);
      expect(bet).toBe(200);
    });

    it('should not exceed bankroll', () => {
      const bet = BlackjackGameEngine.calculateOptimalBet(10, 75, 10, 200);
      expect(bet).toBe(75); // Only has $75 left
    });

    it('should return min bet for negative TC', () => {
      const bet = BlackjackGameEngine.calculateOptimalBet(-3, 1000, 10, 200);
      expect(bet).toBe(10);
    });
  });

  describe('calculateHeatFromBet', () => {
    it('should generate high heat for large bet spread', () => {
      const heat = BlackjackGameEngine.calculateHeatFromBet(60, 3, 10); // 6x spread
      expect(heat).toBeGreaterThanOrEqual(5);
    });

    it('should generate moderate heat for 3-5x spread', () => {
      const heat = BlackjackGameEngine.calculateHeatFromBet(40, 3, 10); // 4x spread
      expect(heat).toBeGreaterThanOrEqual(2);
    });

    it('should generate low heat for small spread', () => {
      const heat = BlackjackGameEngine.calculateHeatFromBet(25, 2, 10); // 2.5x spread (just over 2x threshold)
      expect(heat).toBeGreaterThanOrEqual(1);
    });

    it('should generate very high heat for betting high when TC low', () => {
      const heat = BlackjackGameEngine.calculateHeatFromBet(50, 0, 10); // Big bet at TC 0
      expect(heat).toBeGreaterThanOrEqual(10);
    });

    it('should generate moderate heat for wonging out', () => {
      const heat = BlackjackGameEngine.calculateHeatFromBet(10, 4, 10); // Min bet at TC +4
      expect(heat).toBeGreaterThanOrEqual(3);
    });

    it('should generate minimal heat for appropriate betting', () => {
      const heat = BlackjackGameEngine.calculateHeatFromBet(30, 3, 10); // 3 units at TC +3
      expect(heat).toBeLessThanOrEqual(3); // 3x spread generates 2 heat
    });
  });
});
