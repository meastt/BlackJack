import { CardCountingEngine } from '@card-counter-ai/shared';
import { Rank } from '@card-counter-ai/shared';

describe('CardCountingEngine', () => {
  let engine: CardCountingEngine;

  beforeEach(() => {
    engine = new CardCountingEngine();
  });

  describe('Hi-Lo Card Values', () => {
    it('should return +1 for rank 2', () => {
      expect(engine.getCardValue(Rank.TWO)).toBe(1);
    });

    it('should return +1 for rank 3', () => {
      expect(engine.getCardValue(Rank.THREE)).toBe(1);
    });

    it('should return +1 for rank 4', () => {
      expect(engine.getCardValue(Rank.FOUR)).toBe(1);
    });

    it('should return +1 for rank 5', () => {
      expect(engine.getCardValue(Rank.FIVE)).toBe(1);
    });

    it('should return +1 for rank 6', () => {
      expect(engine.getCardValue(Rank.SIX)).toBe(1);
    });

    it('should return 0 for rank 7', () => {
      expect(engine.getCardValue(Rank.SEVEN)).toBe(0);
    });

    it('should return 0 for rank 8', () => {
      expect(engine.getCardValue(Rank.EIGHT)).toBe(0);
    });

    it('should return 0 for rank 9', () => {
      expect(engine.getCardValue(Rank.NINE)).toBe(0);
    });

    it('should return -1 for rank 10', () => {
      expect(engine.getCardValue(Rank.TEN)).toBe(-1);
    });

    it('should return -1 for rank J', () => {
      expect(engine.getCardValue(Rank.JACK)).toBe(-1);
    });

    it('should return -1 for rank Q', () => {
      expect(engine.getCardValue(Rank.QUEEN)).toBe(-1);
    });

    it('should return -1 for rank K', () => {
      expect(engine.getCardValue(Rank.KING)).toBe(-1);
    });

    it('should return -1 for rank A', () => {
      expect(engine.getCardValue(Rank.ACE)).toBe(-1);
    });
  });

  describe('Deck Counting', () => {
    it('should count through full deck to 0', () => {
      let runningCount = 0;

      // All ranks in a deck (4 of each)
      const ranks = [
        Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX,
        Rank.SEVEN, Rank.EIGHT, Rank.NINE,
        Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
      ];

      ranks.forEach(rank => {
        // 4 cards of each rank
        for (let i = 0; i < 4; i++) {
          runningCount += engine.getCardValue(rank);
        }
      });

      // Full deck should balance to 0 in Hi-Lo
      expect(runningCount).toBe(0);
    });

    it('should have correct running count after low cards', () => {
      let runningCount = 0;

      // Deal five 2s
      for (let i = 0; i < 5; i++) {
        runningCount += engine.getCardValue(Rank.TWO);
      }

      expect(runningCount).toBe(5);
    });

    it('should have correct running count after high cards', () => {
      let runningCount = 0;

      // Deal five Kings
      for (let i = 0; i < 5; i++) {
        runningCount += engine.getCardValue(Rank.KING);
      }

      expect(runningCount).toBe(-5);
    });

    it('should have correct running count after neutral cards', () => {
      let runningCount = 0;

      // Deal five 7s
      for (let i = 0; i < 5; i++) {
        runningCount += engine.getCardValue(Rank.SEVEN);
      }

      expect(runningCount).toBe(0);
    });

    it('should handle mixed sequence correctly', () => {
      let runningCount = 0;

      // Sequence: 2, K, 5, 8, A, 3
      // Values:   +1, -1, +1, 0, -1, +1 = +1
      const sequence = [Rank.TWO, Rank.KING, Rank.FIVE, Rank.EIGHT, Rank.ACE, Rank.THREE];

      sequence.forEach(rank => {
        runningCount += engine.getCardValue(rank);
      });

      expect(runningCount).toBe(1);
    });

    it('should count multiple decks correctly', () => {
      let runningCount = 0;

      // Two full decks should also balance to 0
      const ranks = Object.values(Rank);

      // 2 decks = 8 of each rank
      ranks.forEach(rank => {
        for (let i = 0; i < 8; i++) {
          runningCount += engine.getCardValue(rank);
        }
      });

      expect(runningCount).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle large number of cards', () => {
      let runningCount = 0;

      // Deal 100 low cards
      for (let i = 0; i < 100; i++) {
        runningCount += engine.getCardValue(Rank.TWO);
      }

      expect(runningCount).toBe(100);
    });

    it('should handle alternating high and low cards', () => {
      let runningCount = 0;

      // Alternate: 2, K, 2, K, 2, K
      // Should net to 0
      for (let i = 0; i < 10; i++) {
        runningCount += engine.getCardValue(Rank.TWO);  // +1
        runningCount += engine.getCardValue(Rank.KING); // -1
      }

      expect(runningCount).toBe(0);
    });
  });
});
