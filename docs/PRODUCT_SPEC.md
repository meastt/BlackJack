# Card Counter AI - Product Specification

## Vision
The only app that actually teaches you to count cards—from complete beginner to casino-ready. Progressive skill-building with AI coaching until you can hold a true count under pressure.

---

## Learning Path Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 0: BASIC STRATEGY (Prerequisite - MUST complete first)  │
│  "You can't count if you can't play"                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: CARD VALUES                                           │
│  Learn Hi-Lo values (+1, 0, -1) for every card                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: RUNNING COUNT                                         │
│  Maintain count in real-time, learn cancellation                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: TRUE COUNT                                            │
│  Deck estimation + Running Count ÷ Decks Remaining              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: BET SIZING                                            │
│  Bet spread based on True Count advantage                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: DEVIATIONS (Illustrious 18)                           │
│  When to deviate from Basic Strategy based on count             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BOSS MODE: DISTRACTION TRAINING                                │
│  Count under pressure with casino distractions                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Basic Strategy (PREREQUISITE)

### Why This Comes First
- Counting provides ~1-2% edge
- Playing bad Basic Strategy **costs** 2-4%
- Net: You LOSE money if you count but don't play perfectly

### Core Concepts to Teach

#### Hard Totals vs Soft Totals
| Hand Type | Example | Logic |
|-----------|---------|-------|
| Hard 16 | 10 + 6 | No flexibility, risky to hit |
| Soft 16 | A + 5 | Can't bust, should hit/double |

#### Dealer Up-Card Categories
| Category | Cards | Player Action |
|----------|-------|---------------|
| Weak/Bust Cards | 2-6 | Dealer likely busts, stand more often |
| Strong Cards | 7-A | Dealer likely makes hand, hit more often |

### Lesson: Speed Strategy Drill

**UI Flow:**
1. Show: Player hand (e.g., "Hard 14") + Dealer up-card (e.g., "6")
2. User swipes: HIT / STAND / DOUBLE / SPLIT
3. Timer: 3 seconds to answer (decreases with mastery)
4. Feedback: Instant correct/incorrect with explanation

**Completion Criteria:**
- 50 consecutive correct answers
- Average response time < 2 seconds
- Must score 95%+ before unlocking counting phases

**Gate Logic:**
- ❌ Any Basic Strategy error after Phase 1 unlocks → Warning modal
- ❌ 3 consecutive errors → Locks counting phases, requires re-certification

---

## Phase 1: Card Values (Hi-Lo System)

### Status: ✅ Partially Built (needs completion criteria)

### Card Value Chart
| Cards | Hi-Lo Value | Memory Trick |
|-------|-------------|--------------|
| 2, 3, 4, 5, 6 | +1 | Low cards = good for player leaving |
| 7, 8, 9 | 0 | Neutral, ignore |
| 10, J, Q, K, A | -1 | High cards = bad for player leaving |

### Current Implementation Issues
1. ❌ **Endless mode** - no completion criteria
2. ❌ **No progression gates**

### Required Changes
1. **Session limits**: 25 cards per session (half deck)
2. **Mastery criteria**: 
   - Score 95%+ on 3 consecutive sessions
   - Average response time < 1.5 seconds
3. **Speed ramping**: Start with 3s per card, decrease to 1s
4. **Progress bar**: Show completion % toward unlocking Phase 2

---

## Phase 2: Running Count

### Core Concepts

#### Single Card Counting
- See card → Add/subtract value from running total
- Start at 0, end of deck should equal 0 (balanced system)

#### Cancellation Principle (CRITICAL)
**Don't count linearly!** Train pattern recognition:

| Cards Shown | Mental Process | Result |
|-------------|----------------|--------|
| K + 5 | Instant cancel | 0 |
| 2 + 3 + 10 | +1 +1 -1 | +1 |
| Q + J + 6 + 4 | -1 -1 +1 +1 | 0 |

### Drill Types

#### Drill 2A: Single Card Stream
- Cards flash one at a time
- User maintains running count
- Speed increases over time
- After 20-30 cards, ask "What is the count?"

#### Drill 2B: Pair Recognition
- Show 2 cards simultaneously
- User must give net value
- Teaches cancellation pattern recognition

#### Drill 2C: Group Recognition (4-6 cards)
- Show a "table" of cards (simulating a round)
- User must give net change to running count
- Mimics real gameplay scenarios

### Mastery Criteria
- Complete full deck (52 cards) in < 60 seconds
- End with correct count (0) on 10 consecutive attempts
- Group recognition > 90% accuracy

---

## Phase 3: True Count Conversion

### Why True Count Matters
```
Running Count of +10 with 5 decks left = TC +2 (slight advantage)
Running Count of +10 with 1 deck left = TC +10 (massive advantage)
```

### The Formula
```
True Count = Running Count ÷ Decks Remaining
```

### Core Concepts

#### Deck Estimation
**The Discard Tray Visual:**
- Show images of discard trays at various fill levels
- User estimates decks remaining (to nearest 0.5)

| Visual Reference | Decks Dealt | Decks Remaining (6-deck shoe) |
|------------------|-------------|------------------------------|
| ~1/6 full | 1 deck | 5.0 |
| ~1/3 full | 2 decks | 4.0 |
| ~1/2 full | 3 decks | 3.0 |
| ~2/3 full | 4 decks | 2.0 |
| ~5/6 full | 5 decks | 1.0 |

#### Flooring Convention
- TC 2.8 → Use 2
- TC -1.3 → Use -1
- Always round toward zero

### Drill Types

#### Drill 3A: Deck Estimation
- Show discard tray image
- User inputs decks remaining (0.5 increments)
- Target: ±0.5 deck accuracy

#### Drill 3B: True Count Conversion
- Given: Running Count (e.g., +12)
- Given: Visual of discard tray (e.g., 4 decks dealt)
- User calculates: True Count (+12 ÷ 2 = +6)

#### Drill 3C: Combined Stream
- Cards dealt one at a time (maintaining RC)
- Periodically ask: "What is the True Count?"
- Must track RC AND track deck penetration

### Mastery Criteria
- Deck estimation within ±0.5 on 20 consecutive trials
- TC conversion 90%+ accuracy at speed
- Combined drill: 95%+ accuracy on full shoe

---

## Phase 4: Bet Sizing

### The Betting Spread

Define betting unit (e.g., $25)

| True Count | Bet Size | Units |
|------------|----------|-------|
| < 1 | Minimum | 1 unit |
| +1 | Minimum/Wait | 1 unit |
| +2 | 2 units | $50 |
| +3 | 4 units | $100 |
| +4 | 6 units | $150 |
| +5+ | Max bet | 8-12 units |

### Why Bet Sizing Matters
- Counting cards tells you WHEN you have an advantage
- Betting correctly CAPTURES that advantage
- Flat betting with perfect counting = minimal profit

### Drill Types

#### Drill 4A: Bet Selection
- Given: True Count
- User selects correct bet size
- Trains automatic bet-sizing decisions

#### Drill 4B: Bankroll Simulator
- Full shoe simulation
- User plays hands AND must select bet before seeing cards
- Scoring: 
  - Correct bet + win = Big points
  - Correct bet + loss = Small points (you played right)
  - Wrong bet + win = Warning (lucky, but wrong)
  - Wrong bet + loss = Major penalty

### Mastery Criteria
- Correct bet sizing 95%+ over 100 hands
- Response time < 2 seconds
- Bankroll simulator: Positive EV over 500 hands

---

## Phase 5: Deviations (The Illustrious 18)

### What Are Deviations?
Changes to Basic Strategy based on the True Count.

### The Illustrious 18 (Most Important Deviations)

| Hand | Dealer | Basic Strategy | Deviation | Index |
|------|--------|----------------|-----------|-------|
| Insurance | Any | Don't take | Take | +3 |
| 16 | 10 | Hit | Stand | 0 |
| 15 | 10 | Hit | Stand | +4 |
| 10,10 | 5 | Stand | Split | +5 |
| 10,10 | 6 | Stand | Split | +4 |
| 10 | 10 | Don't double | Double | +4 |
| 12 | 3 | Hit | Stand | +2 |
| 12 | 2 | Hit | Stand | +3 |
| 11 | A | Double | Hit | +1 |
| 9 | 2 | Hit | Double | +1 |
| 10 | A | Don't double | Double | +4 |
| 9 | 7 | Hit | Double | +3 |
| 16 | 9 | Hit | Stand | +5 |
| 13 | 2 | Stand | Hit | -1 |
| 12 | 4 | Stand | Hit | 0 |
| 12 | 5 | Stand | Hit | -2 |
| 12 | 6 | Stand | Hit | -1 |
| 13 | 3 | Stand | Hit | -2 |

### Drill: Deviation Alerts

**Scenario-based training:**
1. Show: Hand + Dealer card + True Count
2. User selects: Correct play (may differ from Basic Strategy)
3. Highlight: "This is an INDEX MOMENT"

**Example:**
- You have: 16
- Dealer shows: 10
- True Count: +1
- Basic Strategy says: Hit
- Correct play: **Stand** (Index is 0, TC is above)

### Mastery Criteria
- Learn Top 6 deviations first (Insurance, 16v10, 15v10, etc.)
- 90%+ accuracy on deviation recognition
- Can recite index numbers from memory

---

## Boss Mode: Distraction Training

### Purpose
Real casino environment includes:
- Cocktail waitresses
- Pit boss conversations
- Chip handling
- Table talk
- Ambient noise

### Distraction Types

| Distraction | Implementation |
|-------------|----------------|
| Math popup | "Quick! What's 17 + 8?" (tap to dismiss) |
| Waitress | "Can I get you a drink?" (must tap response) |
| Pit boss | "How's the table treating you?" (tap to dismiss) |
| Chip count | "How many chips do you have?" (approximate) |
| Casino audio | Slot machines, crowd noise, music |

### Implementation
- Distractions appear at random intervals
- User must dismiss without losing count
- Count verification continues throughout
- Tracks "distraction tolerance" score

### Settings
- Distraction frequency: Low / Medium / High / Casino
- Audio: On/Off
- Types: Toggle each distraction type

---

## Progress Tracking & Gamification

### XP System
- Complete lesson: +100 XP
- Pass mastery test: +500 XP
- Daily streak: +50 XP per day
- Perfect session: +200 XP bonus

### Badges
- 🎴 **Card Scholar**: Complete Phase 1
- 🔢 **Count Master**: Complete Phase 2
- ➗ **True Count Pro**: Complete Phase 3
- 💰 **Bet Strategist**: Complete Phase 4
- 🎯 **Deviation Expert**: Complete Phase 5
- 🎰 **Casino Ready**: Complete Boss Mode
- 🔥 **7-Day Streak**: Practice 7 days in a row
- ⚡ **Speed Demon**: Complete deck in < 30 seconds

### Leaderboard
- Weekly speed rankings
- Accuracy rankings by phase
- Total XP rankings

---

## AI Coach Integration

### When to Prompt AI
- After 3 consecutive errors on same concept
- When user asks a question
- At completion of each phase (summary)
- When stuck on a concept for > 5 minutes

### AI Capabilities
- Explain concepts in different ways
- Provide personalized tips based on error patterns
- Answer "what if" questions
- Quiz on theory between drills

---

## Data to Track (Per User)

### Progress Metrics
```typescript
interface UserProgress {
  // Phase completion
  basicStrategyUnlocked: boolean;
  phase1Complete: boolean;
  phase2Complete: boolean;
  phase3Complete: boolean;
  phase4Complete: boolean;
  phase5Complete: boolean;
  bossModeComplete: boolean;
  
  // Performance stats
  cardValuesAccuracy: number;
  cardValuesSpeed: number; // cards per minute
  runningCountAccuracy: number;
  trueCountAccuracy: number;
  betSizingAccuracy: number;
  deviationAccuracy: number;
  
  // Gamification
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  
  // Session history
  lastSessionDate: Date;
  totalPracticeTime: number;
  sessionsCompleted: number;
}
```

---

## Implementation Priority

### MVP (Week 1-2)
1. ✅ Card Values (Phase 1) - with completion criteria
2. 🔲 Basic Strategy (Phase 0) - gatekeeping
3. 🔲 Running Count (Phase 2) - single card + cancellation

### V1.0 (Week 3-4)
4. 🔲 True Count (Phase 3)
5. 🔲 Bet Sizing (Phase 4)
6. 🔲 Progress tracking & XP system

### V1.5 (Week 5-6)
7. 🔲 Deviations (Phase 5)
8. 🔲 Boss Mode distractions
9. 🔲 AI Coach integration improvements

### V2.0 (Future)
10. 🔲 Full table simulation
11. 🔲 Multiplayer/team play
12. 🔲 Advanced counting systems (Hi-Opt II, Omega II)
13. 🔲 Casino finder integration

---

## Technical Requirements

### Assets Needed
- Discard tray images (various fill levels)
- Chip stack images
- Casino ambient audio
- Waitress/pit boss character art (optional)

### Performance Targets
- Card flash: 60 FPS animations
- Response validation: < 50ms
- Session save: Automatic every 10 seconds

### Offline Support
- All drills work offline
- Progress syncs when online
- AI Coach requires connectivity

---

*Last Updated: January 2025*
*Version: 1.0 Draft*
