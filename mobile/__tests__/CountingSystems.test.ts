import {
  CardCountingEngine,
  COUNTING_SYSTEMS,
} from '@card-counter-ai/shared';
import { Rank, CountingSystem, Suit } from '@card-counter-ai/shared';

// Published card values for each counting system
// Sources: Blackjack Attack (Don Schlesinger), Professional Blackjack (Stanford Wong)
const EXPECTED_VALUES: Record<string, Record<string, number>> = {
  [CountingSystem.HI_LO]: {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, J: -1, Q: -1, K: -1, A: -1,
  },
  [CountingSystem.KO]: {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1,
    '8': 0, '9': 0,
    '10': -1, J: -1, Q: -1, K: -1, A: -1,
  },
  [CountingSystem.HI_OPT_I]: {
    '2': 0, '3': 1, '4': 1, '5': 1, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, J: -1, Q: -1, K: -1, A: 0,
  },
  [CountingSystem.HI_OPT_II]: {
    '2': 1, '3': 1, '4': 2, '5': 2, '6': 1, '7': 1,
    '8': 0, '9': 0,
    '10': -2, J: -2, Q: -2, K: -2, A: 0,
  },
  [CountingSystem.OMEGA_II]: {
    '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1,
    '8': 0, '9': -1,
    '10': -2, J: -2, Q: -2, K: -2, A: 0,
  },
  [CountingSystem.ZEN]: {
    '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1,
    '8': 0, '9': 0,
    '10': -2, J: -2, Q: -2, K: -2, A: -1,
  },
};

const RANK_MAP: Record<string, Rank> = {
  '2': Rank.TWO, '3': Rank.THREE, '4': Rank.FOUR, '5': Rank.FIVE,
  '6': Rank.SIX, '7': Rank.SEVEN, '8': Rank.EIGHT, '9': Rank.NINE,
  '10': Rank.TEN, J: Rank.JACK, Q: Rank.QUEEN, K: Rank.KING, A: Rank.ACE,
};

const ALL_RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const ALL_SYSTEMS = Object.values(CountingSystem);

describe('Counting Systems — Card Values', () => {
  for (const system of ALL_SYSTEMS) {
    describe(COUNTING_SYSTEMS[system].name, () => {
      const engine = new CardCountingEngine(system);
      const expected = EXPECTED_VALUES[system];

      for (const rank of ALL_RANKS) {
        it(`${rank} → ${expected[rank]}`, () => {
          expect(engine.getCardValue(RANK_MAP[rank])).toBe(expected[rank]);
        });
      }
    });
  }
});

describe('Balanced / Unbalanced Property', () => {
  const balancedSystems = [
    CountingSystem.HI_LO,
    CountingSystem.HI_OPT_I,
    CountingSystem.HI_OPT_II,
    CountingSystem.OMEGA_II,
    CountingSystem.ZEN,
  ];

  for (const system of balancedSystems) {
    it(`${COUNTING_SYSTEMS[system].name} sums to 0 across one deck`, () => {
      const engine = new CardCountingEngine(system);
      let sum = 0;
      for (const rank of ALL_RANKS) {
        sum += engine.getCardValue(RANK_MAP[rank]) * 4; // 4 suits per rank
      }
      expect(sum).toBe(0);
    });
  }

  it('KO sums to +4 per deck (unbalanced)', () => {
    const engine = new CardCountingEngine(CountingSystem.KO);
    let sum = 0;
    for (const rank of ALL_RANKS) {
      sum += engine.getCardValue(RANK_MAP[rank]) * 4;
    }
    expect(sum).toBe(4);
  });

  it('KO isBalanced property is false', () => {
    expect(COUNTING_SYSTEMS[CountingSystem.KO].isBalanced).toBe(false);
  });

  for (const system of balancedSystems) {
    it(`${COUNTING_SYSTEMS[system].name} isBalanced property is true`, () => {
      expect(COUNTING_SYSTEMS[system].isBalanced).toBe(true);
    });
  }
});

describe('True Count Truncation (Math.trunc)', () => {
  // Helper: create engine, manually set state via countCards
  function makeEngine(runningCount: number, cardsDealt: number, totalDecks: number = 6) {
    const engine = new CardCountingEngine(CountingSystem.HI_LO, totalDecks);
    // Feed cards to build desired running count and cardsDealt
    // Use 2s (+1) and 10s (-1) and 7s (0) to construct the count
    const suit = Suit.HEARTS;
    const cards = [];

    // First set the running count
    if (runningCount > 0) {
      for (let i = 0; i < runningCount; i++) {
        cards.push({ suit, rank: Rank.TWO, id: `t${i}` }); // +1 each
      }
    } else if (runningCount < 0) {
      for (let i = 0; i < Math.abs(runningCount); i++) {
        cards.push({ suit, rank: Rank.TEN, id: `t${i}` }); // -1 each
      }
    }
    // Fill remaining cardsDealt with neutral cards
    const remaining = cardsDealt - Math.abs(runningCount);
    for (let i = 0; i < remaining; i++) {
      cards.push({ suit, rank: Rank.SEVEN, id: `n${i}` }); // 0 each
    }

    engine.countCards(cards);
    return engine;
  }

  it('RC=5, 2 decks remaining → TC=2 (not 3)', () => {
    // 6 decks, 4 decks dealt = 208 cards dealt, 2 decks remain
    const engine = makeEngine(5, 208, 6);
    expect(engine.getTrueCount()).toBe(2); // 5/2 = 2.5 → trunc → 2
  });

  it('RC=-5, 2 decks remaining → TC=-2 (not -3)', () => {
    const engine = makeEngine(-5, 208, 6);
    expect(engine.getTrueCount()).toBe(-2); // -5/2 = -2.5 → trunc → -2
  });

  it('RC=7, 3 decks remaining → TC=2', () => {
    // 6 decks, 3 decks dealt = 156 cards
    const engine = makeEngine(7, 156, 6);
    expect(engine.getTrueCount()).toBe(2); // 7/3 = 2.33 → trunc → 2
  });

  it('RC=-7, 3 decks remaining → TC=-2', () => {
    const engine = makeEngine(-7, 156, 6);
    expect(engine.getTrueCount()).toBe(-2); // -7/3 = -2.33 → trunc → -2
  });

  it('RC=3, 1 deck remaining → TC=3', () => {
    const engine = makeEngine(3, 260, 6);
    expect(engine.getTrueCount()).toBe(3); // 3/1 = 3 → trunc → 3
  });

  it('RC=0 → TC=0 regardless of decks', () => {
    const engine = makeEngine(0, 100, 6);
    expect(engine.getTrueCount()).toBe(0);
  });
});

describe('Bet Multiplier Thresholds', () => {
  function makeEngineWithTC(targetTC: number): CardCountingEngine {
    // We need TC = trunc(RC / decksRemaining) = targetTC
    // With 6 decks and 0 cards dealt, decksRemaining = 6
    // So RC = targetTC * 6 gives TC = targetTC
    const engine = new CardCountingEngine(CountingSystem.HI_LO, 6);
    const suit = Suit.HEARTS;
    const rc = targetTC * 6;
    const cards = [];
    if (rc > 0) {
      for (let i = 0; i < rc; i++) {
        cards.push({ suit, rank: Rank.TWO, id: `b${i}` });
      }
    } else if (rc < 0) {
      for (let i = 0; i < Math.abs(rc); i++) {
        cards.push({ suit, rank: Rank.TEN, id: `b${i}` });
      }
    }
    if (cards.length > 0) engine.countCards(cards);
    return engine;
  }

  it('TC ≤ 1 → multiplier 1', () => {
    const engine = makeEngineWithTC(1);
    expect(engine.getBetMultiplier()).toBe(1);
  });

  it('TC = 2 → multiplier 2', () => {
    const engine = makeEngineWithTC(2);
    expect(engine.getBetMultiplier()).toBe(2);
  });

  it('TC = 3 → multiplier 4', () => {
    const engine = makeEngineWithTC(3);
    expect(engine.getBetMultiplier()).toBe(4);
  });

  it('TC ≥ 4 → multiplier 8', () => {
    const engine = makeEngineWithTC(4);
    expect(engine.getBetMultiplier()).toBe(8);
  });

  it('TC = 0 → multiplier 1', () => {
    const engine = makeEngineWithTC(0);
    expect(engine.getBetMultiplier()).toBe(1);
  });

  it('Negative TC → multiplier 1', () => {
    const engine = makeEngineWithTC(-3);
    expect(engine.getBetMultiplier()).toBe(1);
  });
});
