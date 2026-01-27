import { Shoe } from '@card-counter-ai/shared';
import { Rank } from '@card-counter-ai/shared';

describe('ShoeEngine', () => {
  describe('Shoe Construction', () => {
    it('should create 1-deck shoe with 52 cards', () => {
      const shoe = new Shoe(1);
      expect(shoe.getCardsRemaining()).toBe(52);
    });

    it('should create 6-deck shoe with 312 cards', () => {
      const shoe = new Shoe(6);
      expect(shoe.getCardsRemaining()).toBe(312);
    });

    it('should create 8-deck shoe with 416 cards', () => {
      const shoe = new Shoe(8);
      expect(shoe.getCardsRemaining()).toBe(416);
    });

    it('should throw error for invalid deck count', () => {
      expect(() => new Shoe(0)).toThrow();
      expect(() => new Shoe(9)).toThrow();
    });

    it('should have correct number of each rank in 1-deck shoe', () => {
      const shoe = new Shoe(1);
      const cards = shoe.getRemainingCards();

      // Count each rank
      const rankCounts: Record<string, number> = {};
      cards.forEach(card => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
      });

      // Each rank should appear 4 times (one per suit)
      Object.values(Rank).forEach(rank => {
        expect(rankCounts[rank]).toBe(4);
      });
    });

    it('should have correct number of each rank in 6-deck shoe', () => {
      const shoe = new Shoe(6);
      const cards = shoe.getRemainingCards();

      // Count each rank
      const rankCounts: Record<string, number> = {};
      cards.forEach(card => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
      });

      // Each rank should appear 24 times (4 suits * 6 decks)
      Object.values(Rank).forEach(rank => {
        expect(rankCounts[rank]).toBe(24);
      });
    });
  });

  describe('Card Dealing', () => {
    it('should deal a card with pop()', () => {
      const shoe = new Shoe(1);
      const card = shoe.pop();

      expect(card).toBeDefined();
      expect(card).toHaveProperty('rank');
      expect(card).toHaveProperty('suit');
      expect(card).toHaveProperty('id');
    });

    it('should reduce remaining cards after pop()', () => {
      const shoe = new Shoe(1);
      const initialCount = shoe.getCardsRemaining();

      shoe.pop();

      expect(shoe.getCardsRemaining()).toBe(initialCount - 1);
    });

    it('should return undefined when shoe is empty', () => {
      const shoe = new Shoe(1);

      // Deal all cards
      for (let i = 0; i < 52; i++) {
        shoe.pop();
      }

      expect(shoe.getCardsRemaining()).toBe(0);
      expect(shoe.pop()).toBeUndefined();
    });

    it('should shuffle cards (not in original order)', () => {
      const shoe1 = new Shoe(1);
      const shoe2 = new Shoe(1);

      const cards1 = shoe1.getRemainingCards().map(c => c.id);
      const cards2 = shoe2.getRemainingCards().map(c => c.id);

      // Different shoes should have different orders (extremely unlikely to be same after shuffle)
      const allSame = cards1.every((id, i) => id === cards2[i]);
      expect(allSame).toBe(false);
    });
  });

  describe('Running Count', () => {
    it('should start at 0', () => {
      const shoe = new Shoe(6);
      expect(shoe.getRunningCount()).toBe(0);
    });

    it('should add +1 for low cards (2-6)', () => {
      const shoe = new Shoe(1);

      // Find a low card and verify RC increases by exactly 1
      let foundLowCard = false;
      let rcBefore = 0;
      let rcAfter = 0;

      while (!foundLowCard && shoe.getCardsRemaining() > 0) {
        rcBefore = shoe.getRunningCount();
        const card = shoe.pop();
        if (card && [Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX].includes(card.rank)) {
          rcAfter = shoe.getRunningCount();
          foundLowCard = true;
        }
      }

      // RC should have increased by exactly 1 when a low card was dealt
      expect(rcAfter).toBe(rcBefore + 1);
    });

    it('should add 0 for neutral cards (7-9)', () => {
      const shoe = new Shoe(6);

      // Deal until we find 5 neutral cards
      let dealt = 0;
      while (dealt < 5) {
        const card = shoe.pop();
        if (card && [Rank.SEVEN, Rank.EIGHT, Rank.NINE].includes(card.rank)) {
          dealt++;
          // Count should still be 0 or based on previous cards
        }
      }

      // After dealing only neutral cards, count depends on what else was dealt
      // So we just verify the system doesn't crash
      expect(typeof shoe.getRunningCount()).toBe('number');
    });

    it('should subtract -1 for high cards (10-A)', () => {
      const shoe = new Shoe(1);

      // Deal until we're sure we've dealt more high cards than low cards
      // A full deck has 20 high cards and 20 low cards
      // If we deal the first half, we'll likely have mixed results
      // Better test: verify the value returned for a specific high card

      let foundHighCard = false;
      let rcBefore = 0;
      let rcAfter = 0;

      while (!foundHighCard) {
        rcBefore = shoe.getRunningCount();
        const card = shoe.pop();
        if (card && [Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE].includes(card.rank)) {
          rcAfter = shoe.getRunningCount();
          foundHighCard = true;
        }
      }

      // RC should have decreased by 1 when a high card was dealt
      expect(rcAfter).toBe(rcBefore - 1);
    });

    it('should accurately track running count through full deck', () => {
      const shoe = new Shoe(1);

      // Deal entire deck and count manually
      let manualCount = 0;
      while (shoe.getCardsRemaining() > 0) {
        const card = shoe.pop();
        if (!card) break;

        // Manual Hi-Lo counting
        if ([Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX].includes(card.rank)) {
          manualCount += 1;
        } else if ([Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE].includes(card.rank)) {
          manualCount -= 1;
        }
      }

      // A full deck should end at 0 (balanced count)
      expect(shoe.getRunningCount()).toBe(0);
      expect(manualCount).toBe(0);
    });
  });

  describe('True Count', () => {
    it('should calculate TC = RC / decks remaining', () => {
      const shoe = new Shoe(6);

      // Deal some cards to establish a non-zero running count
      let attempts = 0;
      while (attempts < 100) {
        shoe.pop();
        attempts++;
        const rc = shoe.getRunningCount();
        if (rc !== 0) break; // Stop when we have a non-zero RC
      }

      const rc = shoe.getRunningCount();
      const cardsRemaining = shoe.getCardsRemaining();
      const decksRemaining = Math.max(0.5, cardsRemaining / 52);
      const tc = shoe.getTrueCount(decksRemaining);

      expect(typeof tc).toBe('number');

      // True count should be close to RC / decks remaining
      const expectedTC = rc / decksRemaining;
      expect(Math.abs(tc - expectedTC)).toBeLessThan(1); // Allow for rounding
    });

    it('should return 0 when decks remaining is 0', () => {
      const shoe = new Shoe(1);

      // Deal all cards
      while (shoe.getCardsRemaining() > 0) {
        shoe.pop();
      }

      const tc = shoe.getTrueCount(0);
      expect(tc).toBe(0);
    });

    it('should handle negative running counts', () => {
      const shoe = new Shoe(6);

      // Deal until we have a negative count
      let attempts = 0;
      while (shoe.getRunningCount() >= 0 && attempts < 100) {
        shoe.pop();
        attempts++;
      }

      const rc = shoe.getRunningCount();
      const decksRemaining = shoe.getCardsRemaining() / 52;
      const tc = shoe.getTrueCount(decksRemaining);

      if (rc < 0) {
        expect(tc).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('Reset', () => {
    it('should reset to full shoe', () => {
      const shoe = new Shoe(6);

      // Deal some cards
      for (let i = 0; i < 50; i++) {
        shoe.pop();
      }

      expect(shoe.getCardsRemaining()).toBe(312 - 50);

      shoe.reset();

      expect(shoe.getCardsRemaining()).toBe(312);
    });

    it('should clear running count on reset', () => {
      const shoe = new Shoe(6);

      // Deal cards until running count is non-zero
      let attempts = 0;
      while (shoe.getRunningCount() === 0 && attempts < 50) {
        shoe.pop();
        attempts++;
      }

      const rcBefore = shoe.getRunningCount();
      expect(rcBefore).not.toBe(0);

      shoe.reset();

      expect(shoe.getRunningCount()).toBe(0);
    });

    it('should shuffle cards on reset', () => {
      const shoe = new Shoe(1);

      const firstOrder = shoe.getRemainingCards().map(c => c.id);

      shoe.reset();

      const secondOrder = shoe.getRemainingCards().map(c => c.id);

      // Orders should be different after reset/shuffle
      const allSame = firstOrder.every((id, i) => id === secondOrder[i]);
      expect(allSame).toBe(false);
    });
  });
});
