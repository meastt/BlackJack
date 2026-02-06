/**
 * Exhaustive Basic Strategy Verification
 *
 * Tests every combination of player hand vs dealer upcard against
 * the standard H17/DAS basic strategy chart, and cross-checks
 * the mobile and web implementations agree on every hand.
 */
import {
  getBasicStrategyAction as webGetAction,
  Hand,
  HandStatus,
} from '../../web/src/lib/simulator/blackjack';
import {
  getBasicStrategyAction as mobileGetAction,
} from '../src/utils/basicStrategy';
import { Card, Rank, Suit } from '@card-counter-ai/shared';

// ─── Helpers ────────────────────────────────────────────────────────────────

function card(rank: Rank): Card {
  return { rank, suit: Suit.HEARTS, id: `${rank}_h` };
}

function webAction(cards: Card[], dealer: Card, canSplit: boolean, canDouble: boolean): string {
  const h: Hand = { cards, bet: 10, status: HandStatus.ACTIVE };
  return webGetAction(h, dealer, canSplit, canDouble);
}

function mobileAction(playerRanks: string[], dealerRank: string): string {
  return mobileGetAction(playerRanks, dealerRank).toUpperCase();
}

// Normalize web output to match mobile conventions (uppercase)
function normalizeWeb(action: string): string {
  return action.toUpperCase();
}

// Rank string to Rank enum
const R: Record<string, Rank> = {
  '2': Rank.TWO, '3': Rank.THREE, '4': Rank.FOUR, '5': Rank.FIVE,
  '6': Rank.SIX, '7': Rank.SEVEN, '8': Rank.EIGHT, '9': Rank.NINE,
  '10': Rank.TEN, J: Rank.JACK, Q: Rank.QUEEN, K: Rank.KING, A: Rank.ACE,
};

const DEALER_CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

// ─── Reference Chart (H17, DAS) ────────────────────────────────────────────
// H=Hit, S=Stand, D=Double(else Hit), Ds=Double(else Stand), P=Split

// Hard totals: key = total, value = actions vs dealer 2-A
const HARD: Record<number, string[]> = {
  //       2    3    4    5    6    7    8    9   10    A
  5:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  6:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  7:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  8:  ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
  9:  ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  10: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  11: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
  12: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  13: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  14: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  15: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  16: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
  17: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  18: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
};

// Soft totals: key = total (13=A+2 .. 20=A+9)
const SOFT: Record<number, string[]> = {
  //       2    3    4    5    6    7    8    9   10    A
  13: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  14: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  15: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  16: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  17: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
  18: ['S', 'Ds','Ds','Ds','Ds','S', 'S', 'H', 'H', 'H'],
  19: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  20: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
};

// Pairs: key = pair card value (2-11 where 11=A)
const PAIRS: Record<number, string[]> = {
  //       2    3    4    5    6    7    8    9   10    A
  2:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  3:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  4:  ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  5:  ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
  6:  ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
  7:  ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
  8:  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  9:  ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
  10: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
  11: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
};

// ─── Chart Code → Action Mapping ───────────────────────────────────────────

function chartToExpected(code: string): string {
  // D = Double if allowed, else Hit
  // Ds = Double if allowed, else Stand
  // For our tests we always pass canDouble=true, so:
  switch (code) {
    case 'H': return 'HIT';
    case 'S': return 'STAND';
    case 'D': return 'DOUBLE';
    case 'Ds': return 'DOUBLE';
    case 'P': return 'SPLIT';
    default: throw new Error(`Unknown chart code: ${code}`);
  }
}

// For testing "can't double" scenarios
function chartToExpectedNoDouble(code: string): string {
  switch (code) {
    case 'H': return 'HIT';
    case 'S': return 'STAND';
    case 'D': return 'HIT';      // D means double else hit
    case 'Ds': return 'STAND';   // Ds means double else stand
    case 'P': return 'SPLIT';
    default: throw new Error(`Unknown chart code: ${code}`);
  }
}

// Card composition helpers for building specific hard totals
function hardCards(total: number): [string, string] {
  // Avoid aces (would be soft) and avoid pairs
  if (total <= 11) {
    // Use 2 + (total-2) — avoid ace
    if (total >= 5) return ['3', String(total - 3)];
    return ['2', String(total - 2)];
  }
  // 12-20: use 10 + remainder, or adjust to avoid pair/soft
  if (total >= 12 && total <= 19) return ['10', String(total - 10)];
  if (total === 20) return ['10', 'Q']; // This would be a pair of 10s; use J instead
  return ['10', String(total - 10)];
}

// Build the right Rank enums for hard totals (no aces, no pairs)
function hardRanks(total: number): [Rank, Rank] {
  if (total === 20) return [Rank.JACK, Rank.QUEEN]; // avoid "pair" since both are 10-val
  if (total === 5) return [Rank.THREE, Rank.TWO];
  if (total === 6) return [Rank.FOUR, Rank.TWO];
  if (total === 7) return [Rank.FIVE, Rank.TWO];
  if (total === 8) return [Rank.SIX, Rank.TWO];
  if (total === 9) return [Rank.SEVEN, Rank.TWO];
  if (total === 10) return [Rank.SEVEN, Rank.THREE];
  if (total === 11) return [Rank.EIGHT, Rank.THREE];
  // 12+: TEN + something
  const remainder = total - 10;
  const remainderRank: Record<number, Rank> = {
    2: Rank.TWO, 3: Rank.THREE, 4: Rank.FOUR, 5: Rank.FIVE,
    6: Rank.SIX, 7: Rank.SEVEN, 8: Rank.EIGHT, 9: Rank.NINE,
  };
  return [Rank.TEN, remainderRank[remainder]];
}

// Mobile-format hard cards (string arrays)
function hardMobileCards(total: number): [string, string] {
  if (total === 20) return ['J', 'Q'];
  if (total === 5) return ['3', '2'];
  if (total === 6) return ['4', '2'];
  if (total === 7) return ['5', '2'];
  if (total === 8) return ['6', '2'];
  if (total === 9) return ['7', '2'];
  if (total === 10) return ['7', '3'];
  if (total === 11) return ['8', '3'];
  const remainder = total - 10;
  return ['10', String(remainder)];
}

// Soft hand composition: A + otherCard
function softRank(total: number): Rank {
  // soft 13 = A+2, soft 14 = A+3, etc.
  const other = total - 11;
  const map: Record<number, Rank> = {
    2: Rank.TWO, 3: Rank.THREE, 4: Rank.FOUR, 5: Rank.FIVE,
    6: Rank.SIX, 7: Rank.SEVEN, 8: Rank.EIGHT, 9: Rank.NINE,
  };
  return map[other];
}

function softMobileCard(total: number): string {
  return String(total - 11);
}

// Pair composition
function pairRank(val: number): Rank {
  const map: Record<number, Rank> = {
    2: Rank.TWO, 3: Rank.THREE, 4: Rank.FOUR, 5: Rank.FIVE,
    6: Rank.SIX, 7: Rank.SEVEN, 8: Rank.EIGHT, 9: Rank.NINE,
    10: Rank.TEN, 11: Rank.ACE,
  };
  return map[val];
}

function pairMobileCard(val: number): string {
  if (val === 11) return 'A';
  return String(val);
}

function dealerRank(d: string): Rank {
  if (d === 'A') return Rank.ACE;
  return R[d];
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Exhaustive Basic Strategy — Hard Totals', () => {
  const totals = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  for (const total of totals) {
    for (let di = 0; di < DEALER_CARDS.length; di++) {
      const d = DEALER_CARDS[di];
      const expected = chartToExpected(HARD[total][di]);

      it(`Hard ${total} vs ${d} → ${expected}`, () => {
        const [r1, r2] = hardRanks(total);
        const result = normalizeWeb(webAction(
          [card(r1), card(r2)],
          card(dealerRank(d)),
          false, // no split
          true   // can double
        ));
        expect(result).toBe(expected);
      });
    }
  }
});

describe('Exhaustive Basic Strategy — Soft Totals', () => {
  const totals = [13, 14, 15, 16, 17, 18, 19, 20];

  for (const total of totals) {
    for (let di = 0; di < DEALER_CARDS.length; di++) {
      const d = DEALER_CARDS[di];
      const expected = chartToExpected(SOFT[total][di]);

      it(`Soft ${total} vs ${d} → ${expected}`, () => {
        const result = normalizeWeb(webAction(
          [card(Rank.ACE), card(softRank(total))],
          card(dealerRank(d)),
          false, // no split
          true   // can double
        ));
        expect(result).toBe(expected);
      });
    }
  }
});

describe('Exhaustive Basic Strategy — Pairs', () => {
  const pairValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  for (const val of pairValues) {
    for (let di = 0; di < DEALER_CARDS.length; di++) {
      const d = DEALER_CARDS[di];
      const expected = chartToExpected(PAIRS[val][di]);
      const pRank = pairRank(val);
      const label = val === 11 ? 'A,A' : `${val},${val}`;

      it(`Pair ${label} vs ${d} → ${expected}`, () => {
        const result = normalizeWeb(webAction(
          [card(pRank), card(pRank)],
          card(dealerRank(d)),
          true,  // can split
          true   // can double
        ));
        expect(result).toBe(expected);
      });
    }
  }
});

describe('Cross-Check: Mobile vs Web — Hard Totals', () => {
  const totals = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  for (const total of totals) {
    for (let di = 0; di < DEALER_CARDS.length; di++) {
      const d = DEALER_CARDS[di];

      it(`Hard ${total} vs ${d}: mobile === web`, () => {
        const [r1, r2] = hardRanks(total);
        const web = normalizeWeb(webAction(
          [card(r1), card(r2)],
          card(dealerRank(d)),
          false,
          true
        ));
        const [m1, m2] = hardMobileCards(total);
        const mob = mobileAction([m1, m2], d);
        expect(mob).toBe(web);
      });
    }
  }
});

describe('Cross-Check: Mobile vs Web — Soft Totals', () => {
  const totals = [13, 14, 15, 16, 17, 18, 19, 20];

  for (const total of totals) {
    for (let di = 0; di < DEALER_CARDS.length; di++) {
      const d = DEALER_CARDS[di];

      it(`Soft ${total} vs ${d}: mobile === web`, () => {
        const web = normalizeWeb(webAction(
          [card(Rank.ACE), card(softRank(total))],
          card(dealerRank(d)),
          false,
          true
        ));
        const mc = softMobileCard(total);
        const mob = mobileAction(['A', mc], d);
        expect(mob).toBe(web);
      });
    }
  }
});

describe('Cross-Check: Mobile vs Web — Pairs', () => {
  const pairValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  for (const val of pairValues) {
    for (let di = 0; di < DEALER_CARDS.length; di++) {
      const d = DEALER_CARDS[di];
      const label = val === 11 ? 'A,A' : `${val},${val}`;

      it(`Pair ${label} vs ${d}: mobile === web`, () => {
        const pRank = pairRank(val);
        const web = normalizeWeb(webAction(
          [card(pRank), card(pRank)],
          card(dealerRank(d)),
          true,
          true
        ));
        const mc = pairMobileCard(val);
        const mob = mobileAction([mc, mc], d);
        expect(mob).toBe(web);
      });
    }
  }
});
