/**
 * Local coaching tips and educational content
 * Self-contained help system without external API calls
 */

export interface Tip {
  title: string;
  content: string;
  category: 'phase' | 'drill' | 'simulator' | 'general';
}

export class LocalTips {
  private static tips: Record<string, Tip> = {
    // Phase 0: Basic Strategy
    phase0: {
      title: 'Why Basic Strategy?',
      content: `Basic Strategy is the mathematically optimal way to play every hand in blackjack without counting cards.

You MUST master this first because:
• It reduces the house edge to ~0.5%
• Card counting won't help if you make bad decisions
• It's your foundation for everything else

Memorize when to Hit, Stand, Double, and Split. Once this is second nature, you're ready for counting.`,
      category: 'phase'
    },

    phase1: {
      title: 'Learning Card Values',
      content: `The Hi-Lo system assigns values to cards:
• 2-6: +1 (good for player when gone)
• 7-9: 0 (neutral)
• 10-A: -1 (good for dealer when gone)

Why these values?
Low cards (2-6) help the dealer (must hit to 17). When they're gone, deck favors you.
High cards (10-A) help player (more blackjacks, better doubles). When they're gone, deck favors dealer.

Master these values until they're instant. You should see a card and KNOW its value without thinking.`,
      category: 'phase'
    },

    phase2: {
      title: 'Running Count',
      content: `The Running Count is your cumulative tally of all cards seen.

Start at 0 when shoe shuffles. As each card appears:
• Add +1 for 2-6
• Add 0 for 7-9
• Add -1 for 10-A

A positive count means more low cards have been played, so the remaining deck is rich in 10s and Aces (good for you!).

Goal: Count a full deck in under 60 seconds with 100% accuracy. Speed and accuracy both matter.`,
      category: 'phase'
    },

    phase3: {
      title: 'True Count',
      content: `True Count adjusts the Running Count for how many decks remain.

Formula: TC = RC ÷ Decks Remaining

Why?
RC of +6 is amazing in a single deck, but mediocre in 6 decks.

Example:
• RC +6, 3 decks left: TC = +2 (decent)
• RC +6, 1 deck left: TC = +6 (excellent!)

True Count tells you the actual density of high cards. This is what you bet on.

Casinos use 6-8 deck shoes to dilute the count. True Count compensates for this.`,
      category: 'phase'
    },

    phase4: {
      title: 'Kelly Criterion Betting',
      content: `The Kelly Criterion optimizes bet sizing to maximize profit while minimizing risk of ruin.

Simple betting spread:
• TC +1 or less: Bet minimum (1 unit)
• TC +2: Bet 2 units
• TC +3: Bet 3 units
• TC +4: Bet 4 units
• TC +5+: Bet 5 units (max)

Why not bet bigger?
Risk of Ruin. Even with an edge, variance can wipe you out if you overbet.

The house still wins 48% of hands at TC +5. Proper betting protects your bankroll from bad runs.`,
      category: 'phase'
    },

    phase5: {
      title: 'The Illustrious 18',
      content: `Basic Strategy assumes neutral count. But when the count changes, so should your plays.

The Illustrious 18 are the 18 most profitable strategy deviations:

Example:
• Insurance: Take it at TC +3+ (normally never take it)
• 16 vs 10: Stand at TC 0+ (normally hit)
• 15 vs 10: Stand at TC +4+ (normally hit)

These deviations add ~0.1-0.2% to your edge. Small gain, but it compounds.

Master the top 6 first (insurance, 16v10, 15v10, 10v10, 12v3, 12v2).`,
      category: 'phase'
    },

    // Drills
    speedDrill: {
      title: 'Speed Drill (Cancellation)',
      content: `Train yourself to spot pairs that cancel out (+1 and -1).

Why it helps:
• 2 and King = 0 (skip both, faster counting)
• Reduces mental load
• Increases speed dramatically

In real casino play, you'll often see 2-3 cards at once. Instantly recognizing "that's zero" lets you focus on the cards that matter.

Goal: Instantly spot cancellation pairs without thinking.`,
      category: 'drill'
    },

    deckCountdown: {
      title: 'Deck Countdown',
      content: `Count through an entire deck as fast as possible.

This drill:
• Tests accuracy (must end at 0)
• Builds speed (goal: < 25 seconds)
• Simulates real game pace
• Builds confidence

A balanced count (like Hi-Lo) will always end at 0 for a full deck. If you don't hit 0, you made an error.

Casinos deal ~60 cards per hour. You need to keep up.`,
      category: 'drill'
    },

    discardTray: {
      title: 'Discard Tray Estimation',
      content: `Estimating decks remaining is crucial for True Count.

Casino dealers place discards in a clear tray. You need to:
• Glance at discard tray
• Estimate decks played
• Subtract from starting decks
• Calculate decks remaining

Tips:
• 1 deck ≈ 1 inch of cards
• Focus on "quarters": 0.5, 1.0, 1.5, 2.0 decks
• Overestimate by 0.5 decks (conservative)

Accuracy matters. TC +5 vs +6 changes your bet significantly.`,
      category: 'drill'
    },

    deviations: {
      title: 'Strategy Deviations',
      content: `Practice the Illustrious 18 - the most valuable plays that deviate from Basic Strategy.

When to deviate:
• Count is high/low enough to change the math
• Expected value of deviation > cost of error

Example:
16 vs 10 (dealer showing):
• TC 0 or higher: STAND (deck is rich in 10s, dealer likely has 20)
• TC negative: HIT (Basic Strategy - deck favors dealer)

These plays require CONFIDENCE. Practice until they're automatic.`,
      category: 'drill'
    },

    // Simulator
    simulator: {
      title: 'Casino Simulator',
      content: `Practice everything together in a realistic casino environment.

Features:
• Real 6-deck shoe with shuffle
• Running & True Count tracking
• Kelly Criterion auto-betting
• Heat meter (pit boss suspicion)
• Session statistics

This is where you test if you're casino-ready. Can you:
• Keep count accurately while playing?
• Bet correctly based on True Count?
• Make quick decisions under pressure?
• Avoid generating heat?

If you can play 2 full shoes with 95%+ counting accuracy and positive bankroll, you're ready.`,
      category: 'simulator'
    },

    heatMeter: {
      title: 'Heat Meter (Pit Boss)',
      content: `Casinos watch for card counters. The heat meter tracks how suspicious your play looks.

What generates heat:
• Huge bet spreads (1 to 10+ units)
• Betting big when count is low (!)
• Wonging out (leaving when count drops)
• Betting min when count is high

How to reduce heat:
• Keep spread reasonable (1-5 units)
• Occasionally make "bad" bets to look like a tourist
• Don't play too long (2-3 hour sessions)
• Spread action across multiple tables/casinos

If heat reaches 100%, you get backed off (asked to leave). Manage it carefully.`,
      category: 'simulator'
    },

    countCheck: {
      title: 'Count Accuracy Check',
      content: `Test your counting accuracy during play.

This feature:
• Pauses the game
• Asks you for current RC and TC
• Gives instant feedback
• Tracks accuracy over time

Use this frequently while learning. Goal: 95%+ accuracy.

In a real casino, you don't get feedback. You must be confident your count is correct. This builds that confidence.`,
      category: 'simulator'
    },

    sessionStats: {
      title: 'Session Statistics',
      content: `Track your performance over a session:

Key metrics:
• Win Rate: Should be 52-55% with advantage
• Net Profit: Long-term should be positive
• Peak Bankroll: Track your best run
• Biggest Win/Loss: Understand variance

Variance is HUGE in blackjack. Even perfect play can have losing sessions. What matters is:
• Long-term profitability
• Counting accuracy
• Proper bet sizing

Review stats after every session. Look for patterns in your mistakes.`,
      category: 'simulator'
    },

    // General
    whatIsCardCounting: {
      title: 'What is Card Counting?',
      content: `Card counting is NOT memorizing every card. It's tracking the ratio of high to low cards remaining in the deck.

How it works:
1. High cards (10, J, Q, K, A) favor the player
2. Low cards (2-6) favor the dealer
3. When more high cards remain, bet more
4. When more low cards remain, bet less

Your advantage:
• At TC +1: ~0.5% edge
• At TC +2: ~1.0% edge
• At TC +3: ~1.5% edge
• At TC +5: ~2.5% edge

Compare this to the house edge of 0.5% against Basic Strategy players. A 2% swing is huge!

But: You still lose ~48% of hands. Variance is massive. Proper bankroll management is essential.`,
      category: 'general'
    },

    isItLegal: {
      title: 'Is Card Counting Legal?',
      content: `YES, card counting is 100% legal everywhere in the United States.

It's NOT cheating - you're just using your brain to play optimally.

However:
• Casinos can refuse service to anyone
• If caught, you'll be "backed off" (asked to leave)
• Banned from that casino (sometimes entire chains)
• No legal recourse (they can kick you out)

It's a cat-and-mouse game. Casinos protect their profits, counters try to stay under the radar.

Tips to avoid detection:
• Don't be obvious (huge bet spreads)
• Don't play too long (2-3 hours max)
• Act like a tourist (chat, make mistakes occasionally)
• Spread action across multiple casinos`,
      category: 'general'
    },

    bankrollManagement: {
      title: 'Bankroll Management',
      content: `Risk of Ruin is real. Even with an edge, you can go broke.

Minimum bankroll rules:
• 100 max bets (conservative)
• 50 max bets (moderate risk)
• 20 max bets (high risk of ruin)

Example:
If your max bet is $25, you need:
• $2,500 (conservative)
• $1,250 (moderate)
• $500 (risky)

Variance will cause 10-20 bet swings regularly. Without proper bankroll, one bad session wipes you out.

The Kelly Criterion optimizes bet sizing to maximize long-term growth while minimizing ruin risk.

Never bet more than 1-2% of bankroll on a single hand.`,
      category: 'general'
    }
  };

  /**
   * Get a tip by key
   */
  static getTip(key: string): Tip | null {
    return this.tips[key] || null;
  }

  /**
   * Get all tips for a category
   */
  static getTipsByCategory(category: Tip['category']): Tip[] {
    return Object.values(this.tips).filter(tip => tip.category === category);
  }

  /**
   * Get a random tip
   */
  static getRandomTip(): Tip {
    const keys = Object.keys(this.tips);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return this.tips[randomKey];
  }

  /**
   * Search tips by keyword
   */
  static searchTips(query: string): Tip[] {
    const lowerQuery = query.toLowerCase();
    return Object.values(this.tips).filter(tip =>
      tip.title.toLowerCase().includes(lowerQuery) ||
      tip.content.toLowerCase().includes(lowerQuery)
    );
  }
}
