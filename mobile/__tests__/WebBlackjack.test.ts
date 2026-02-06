import {
  calculateHandValue,
  isBlackjack,
  shouldDealerHit,
  determineHandResult,
  canDoubleDown,
  canSplit,
  canSurrender,
  getBasicStrategyAction,
  Hand,
  HandStatus,
  HandResult,
} from '../../web/src/lib/simulator/blackjack';
import { Card, Rank, Suit } from '@card-counter-ai/shared';

// Helper to create a card
function card(rank: Rank, suit: Suit = Suit.HEARTS): Card {
  return { rank, suit, id: `${rank}_${suit}` };
}

// Helper to create a hand
function hand(cards: Card[], bet: number = 10, status: HandStatus = HandStatus.ACTIVE): Hand {
  return { cards, bet, status };
}

describe('calculateHandValue', () => {
  it('two number cards', () => {
    expect(calculateHandValue([card(Rank.FIVE), card(Rank.SEVEN)]).value).toBe(12);
  });

  it('face cards count as 10', () => {
    expect(calculateHandValue([card(Rank.JACK), card(Rank.QUEEN)]).value).toBe(20);
  });

  it('ace as 11 (soft)', () => {
    const result = calculateHandValue([card(Rank.ACE), card(Rank.SIX)]);
    expect(result.value).toBe(17);
    expect(result.isSoft).toBe(true);
  });

  it('ace adjusts to 1 when would bust', () => {
    const result = calculateHandValue([card(Rank.ACE), card(Rank.SEVEN), card(Rank.EIGHT)]);
    expect(result.value).toBe(16);
    expect(result.isSoft).toBe(false);
  });

  it('two aces', () => {
    const result = calculateHandValue([card(Rank.ACE), card(Rank.ACE)]);
    expect(result.value).toBe(12);
    expect(result.isSoft).toBe(true);
  });

  it('three aces', () => {
    const result = calculateHandValue([card(Rank.ACE), card(Rank.ACE), card(Rank.ACE)]);
    expect(result.value).toBe(13);
    expect(result.isSoft).toBe(true);
  });

  it('bust hand', () => {
    const result = calculateHandValue([card(Rank.TEN), card(Rank.SEVEN), card(Rank.EIGHT)]);
    expect(result.value).toBe(25);
    expect(result.isSoft).toBe(false);
  });
});

describe('isBlackjack', () => {
  it('A + 10 = blackjack', () => {
    expect(isBlackjack([card(Rank.ACE), card(Rank.TEN)])).toBe(true);
  });

  it('A + K = blackjack', () => {
    expect(isBlackjack([card(Rank.ACE), card(Rank.KING)])).toBe(true);
  });

  it('3-card 21 is NOT blackjack', () => {
    expect(isBlackjack([card(Rank.SEVEN), card(Rank.SEVEN), card(Rank.SEVEN)])).toBe(false);
  });

  it('two 10s is not blackjack', () => {
    expect(isBlackjack([card(Rank.TEN), card(Rank.JACK)])).toBe(false);
  });
});

describe('shouldDealerHit', () => {
  it('hits on hard 16', () => {
    expect(shouldDealerHit([card(Rank.TEN), card(Rank.SIX)])).toBe(true);
  });

  it('hits on soft 17 (H17 rule)', () => {
    expect(shouldDealerHit([card(Rank.ACE), card(Rank.SIX)])).toBe(true);
  });

  it('stands on hard 17', () => {
    expect(shouldDealerHit([card(Rank.TEN), card(Rank.SEVEN)])).toBe(false);
  });

  it('stands on soft 18', () => {
    expect(shouldDealerHit([card(Rank.ACE), card(Rank.SEVEN)])).toBe(false);
  });

  it('stands on 20', () => {
    expect(shouldDealerHit([card(Rank.TEN), card(Rank.QUEEN)])).toBe(false);
  });
});

describe('determineHandResult', () => {
  it('player blackjack pays 3:2', () => {
    const h = hand([card(Rank.ACE), card(Rank.TEN)], 10, HandStatus.BLACKJACK);
    const dealer = [card(Rank.TEN), card(Rank.SEVEN)];
    const result = determineHandResult(h, dealer);
    expect(result.result).toBe(HandResult.BLACKJACK);
    expect(result.payout).toBe(25); // 10 * 2.5
  });

  it('both blackjack is push', () => {
    const h = hand([card(Rank.ACE), card(Rank.TEN)], 10);
    const dealer = [card(Rank.ACE), card(Rank.KING)];
    const result = determineHandResult(h, dealer);
    expect(result.result).toBe(HandResult.PUSH);
    expect(result.payout).toBe(10);
  });

  it('player bust loses', () => {
    const h = hand([card(Rank.TEN), card(Rank.SEVEN), card(Rank.EIGHT)], 10, HandStatus.BUST);
    const dealer = [card(Rank.TEN), card(Rank.SEVEN)];
    const result = determineHandResult(h, dealer);
    expect(result.result).toBe(HandResult.LOSE);
    expect(result.payout).toBe(0);
  });

  it('dealer bust, player wins', () => {
    const h = hand([card(Rank.TEN), card(Rank.EIGHT)], 10, HandStatus.STAND);
    const dealer = [card(Rank.TEN), card(Rank.SIX), card(Rank.EIGHT)];
    const result = determineHandResult(h, dealer);
    expect(result.result).toBe(HandResult.WIN);
    expect(result.payout).toBe(20);
  });

  it('surrender returns half', () => {
    const h = hand([card(Rank.TEN), card(Rank.SIX)], 10, HandStatus.SURRENDER);
    const dealer = [card(Rank.ACE), card(Rank.SEVEN)];
    const result = determineHandResult(h, dealer);
    expect(result.result).toBe(HandResult.SURRENDER);
    expect(result.payout).toBe(5);
  });

  it('player wins with higher value', () => {
    const h = hand([card(Rank.TEN), card(Rank.NINE)], 10, HandStatus.STAND);
    const dealer = [card(Rank.TEN), card(Rank.EIGHT)];
    const result = determineHandResult(h, dealer);
    expect(result.result).toBe(HandResult.WIN);
    expect(result.payout).toBe(20);
  });
});

describe('canSplit / canDoubleDown / canSurrender', () => {
  it('canSplit with matching ranks', () => {
    const h = hand([card(Rank.EIGHT), card(Rank.EIGHT)]);
    expect(canSplit(h, [h])).toBe(true);
  });

  it('canSplit with mixed 10-values', () => {
    const h = hand([card(Rank.TEN), card(Rank.KING)]);
    expect(canSplit(h, [h])).toBe(true);
  });

  it('cannot split with 3 cards', () => {
    const h = hand([card(Rank.EIGHT), card(Rank.EIGHT), card(Rank.TWO)]);
    expect(canSplit(h, [h])).toBe(false);
  });

  it('cannot split with 4 hands already', () => {
    const h = hand([card(Rank.EIGHT), card(Rank.EIGHT)]);
    expect(canSplit(h, [h, h, h, h])).toBe(false);
  });

  it('canDoubleDown on 2-card active hand', () => {
    const h = hand([card(Rank.FIVE), card(Rank.SIX)]);
    expect(canDoubleDown(h)).toBe(true);
  });

  it('cannot double after hit', () => {
    const h = hand([card(Rank.FIVE), card(Rank.SIX), card(Rank.TWO)]);
    expect(canDoubleDown(h)).toBe(false);
  });

  it('canSurrender on 2-card active hand', () => {
    const h = hand([card(Rank.TEN), card(Rank.SIX)]);
    expect(canSurrender(h)).toBe(true);
  });
});

describe('getBasicStrategyAction — Bug Regression Tests', () => {
  // Bug 2: Pair of 5s should NOT stand — should fall through to hard 10 logic
  it('pair of 5s vs dealer 6 → Double (not Stand)', () => {
    const h = hand([card(Rank.FIVE), card(Rank.FIVE)]);
    expect(getBasicStrategyAction(h, card(Rank.SIX), true, true)).toBe('Double');
  });

  it('pair of 5s vs dealer 10 → Hit (not Stand)', () => {
    const h = hand([card(Rank.FIVE), card(Rank.FIVE)]);
    expect(getBasicStrategyAction(h, card(Rank.TEN), true, true)).toBe('Hit');
  });

  // Bug 2: Pair of 4s should split vs 5-6, hit otherwise
  it('pair of 4s vs dealer 5 → Split (not Stand)', () => {
    const h = hand([card(Rank.FOUR), card(Rank.FOUR)]);
    expect(getBasicStrategyAction(h, card(Rank.FIVE), true, true)).toBe('Split');
  });

  it('pair of 4s vs dealer 6 → Split', () => {
    const h = hand([card(Rank.FOUR), card(Rank.FOUR)]);
    expect(getBasicStrategyAction(h, card(Rank.SIX), true, true)).toBe('Split');
  });

  it('pair of 4s vs dealer 7 → Hit (not Stand)', () => {
    const h = hand([card(Rank.FOUR), card(Rank.FOUR)]);
    expect(getBasicStrategyAction(h, card(Rank.SEVEN), true, true)).toBe('Hit');
  });

  // Bug 3: Soft 13 vs dealer 4 should Hit (not Double)
  it('soft 13 vs dealer 4 → Hit (not Double)', () => {
    const h = hand([card(Rank.ACE), card(Rank.TWO)]);
    expect(getBasicStrategyAction(h, card(Rank.FOUR), false, true)).toBe('Hit');
  });

  it('soft 13 vs dealer 5 → Double', () => {
    const h = hand([card(Rank.ACE), card(Rank.TWO)]);
    expect(getBasicStrategyAction(h, card(Rank.FIVE), false, true)).toBe('Double');
  });

  it('soft 15 vs dealer 3 → Hit (not Double)', () => {
    const h = hand([card(Rank.ACE), card(Rank.FOUR)]);
    expect(getBasicStrategyAction(h, card(Rank.THREE), false, true)).toBe('Hit');
  });

  it('soft 15 vs dealer 4 → Double', () => {
    const h = hand([card(Rank.ACE), card(Rank.FOUR)]);
    expect(getBasicStrategyAction(h, card(Rank.FOUR), false, true)).toBe('Double');
  });

  it('soft 17 vs dealer 2 → Hit (not Double)', () => {
    const h = hand([card(Rank.ACE), card(Rank.SIX)]);
    expect(getBasicStrategyAction(h, card(Rank.TWO), false, true)).toBe('Hit');
  });

  it('soft 17 vs dealer 3 → Double', () => {
    const h = hand([card(Rank.ACE), card(Rank.SIX)]);
    expect(getBasicStrategyAction(h, card(Rank.THREE), false, true)).toBe('Double');
  });

  // Bug 4: Soft 18 vs dealer 2 → Stand (not Double)
  it('soft 18 vs dealer 2 → Stand (not Double)', () => {
    const h = hand([card(Rank.ACE), card(Rank.SEVEN)]);
    expect(getBasicStrategyAction(h, card(Rank.TWO), false, true)).toBe('Stand');
  });

  it('soft 18 vs dealer 3 → Double', () => {
    const h = hand([card(Rank.ACE), card(Rank.SEVEN)]);
    expect(getBasicStrategyAction(h, card(Rank.THREE), false, true)).toBe('Double');
  });
});
