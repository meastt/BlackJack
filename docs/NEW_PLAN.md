# Role
You are an expert Full-Stack Engineer and Lead Game Designer specializing in Educational Simulations. We are refactoring our existing Blackjack app into the "Holy Grail" of Card Counting Trainers.

# Objective
Refactor the app from a basic game into a "Progressive Mastery System" that builds the specific cognitive muscles needed for professional advantage play.

# Architectural Vision: The "Simulator" UX
Please implement/refactor the codebase to support the following three-tier training system:

## 1. The "Muscle Memory" Drills (Isolated Logic)
- **The Deck Countdown:** Implement a high-speed card-flipping engine. Users must maintain a running count. Track "Seconds per Deck." Use a "Cancellation" logic engine where the app identifies pairs that net to 0 to teach the user to skip them.
- **The Discard Tray AR/Visualizer:** Create a module that displays 3D-style stacks of cards. The user must estimate "Decks Remaining" to the nearest half-deck. This feeds into the "True Count" calculation.
- **Basic Strategy Drill:** Rapid-fire scenarios where only "deviations" (Illustrious 18) are tested.

## 2. The "True Count" Normalization Engine
- Implement a global `GameState` that manages:
    - `RunningCount`
    - `DecksPlayed` (based on visual estimation training)
    - `TrueCount` (RunningCount / DecksRemaining)
- **Feature:** A "Cheat Mode" toggle that overlays the math during practice but hides it during "Test Mode."

## 3. The "Casino Chaos" Environment
- **Distraction Engine:** Implement a random event generator (audio clips of casino noise, "Dealer" chat pop-ups, "Waitress" drink orders).
- **The Heat Meter:** Create an algorithm that monitors the user's "Bet Spread." If the user jumps bets too aggressively relative to the True Count, increase a "Pit Boss Suspicion" meter.
- **Camouflage Training:** Reward users for "Cover Plays" (e.g., staying on a 16 against a 10 when the count is slightly positive, even if it's a minor EV loss).

# Technical Requirements
- **Stack:** [Insert your stack: e.g., React Native, Flutter, or Next.js/Tailwind]
- **State Management:** Ensure the count is persistent across sub-modules.
- **Analytics:** Build a "Risk of Ruin" dashboard that shows Expected Value (EV) vs. Actual Win/Loss over the last 1,000 simulated hands.

# Initial Task
Analyze the current project structure and propose a new folder hierarchy that separates "Drills," "Simulations," and "MathEngines." Then, refactor the main "Play" view to include the "Heat Meter" and "True Count" logic.

# 🎰 PROJECT BLUEPRINT: The Blackjack Flight Simulator (BFS)

## 1. MISSION & PRODUCT PHILOSOPHY
**Goal:** Transition the user from "Basic Strategy" to "Professional Advantage Play" by automating cognitive load.
**Core Principle:** Move math from the prefrontal cortex to the basal ganglia (muscle memory). 

---

## 2. CORE ARCHITECTURE: THE "MODULAR MASTERY" PLAN

### Phase 1: The "Source of Truth" Logic Engine
* **ShoeEngine.ts:** * Tracks exact composition of 1–8 decks (52 cards each).
    * **Ground Truth:** Calculates actual Running Count (RC) and True Count (TC) based on $RC / DecksRemaining$.
    * **Validation:** Compares User Input to Ground Truth for real-time scoring.
* **Betting Engine:** * Implements **Kelly Criterion** betting: $Bet = (Edge / Variance) * Bankroll$.
    * Calculates "Risk of Ruin" (RoR) for user-defined bankrolls.

### Phase 2: Isolated "Muscle Memory" Drills
* **The Cancellation Drill:** * Displays 2 cards at once. 
    * *Goal:* Recognize net-zero pairs (+1, -1) instantly to reduce mental load by 50%.
* **Visual Volume Estimation:** * Displays static/3D renders of card stacks in a discard tray.
    * *Goal:* Calibrate the user's eye to estimate decks remaining to the nearest 0.5 deck.
* **The Illustrious 18 (Decision Deviations):** * Tests the 18 specific scenarios where counting overrides Basic Strategy (e.g., Taking Insurance at TC +3, Standing on 16 vs 10 at TC 0+).

### Phase 3: The "Casino Chaos" Simulator
* **The Distraction Engine:** Random audio/visual triggers (Casino noise, dealer banter, waitress pop-ups).
* **The Heat Meter (Security AI):** * Monitors "Bet Volatility."
    * *Detection Logic:* If $CurrentBet / MinimumBet > 5x$ immediately following a TC spike, increase "Suspicion" by 25%.
* **Camouflage Mode:** Rewards users for "Cover Plays" (intentional minor EV losses to avoid detection).

---

## 3. TECHNICAL GUARDRAILS FOR AI AGENTS
1. **State Management:** Use a centralized `SimState`. Counts must be persistent across drill transitions.
2. **Latency:** Card flip animations must be <100ms.
3. **Betting Units:** All bets must be calculated in "Units" (e.g., 1 Unit = $10) for easier bankroll scaling.
4. **No "Random" Cards:** Every card must be popped from the `Shoe` object to ensure the remaining deck composition is mathematically valid.

---

## 4. FOLDER STRUCTURE REFACTOR
- `/src/engines/` -> `ShoeEngine.ts`, `MathLogic.ts`
- `/src/components/drills/` -> `Cancellation.tsx`, `VolumeEstimate.tsx`, `Deviations.tsx`
- `/src/components/simulator/` -> `CasinoView.tsx`, `HeatMeter.tsx`, `DistractionLayer.tsx`
- `/src/analytics/` -> `RiskOfRuin.ts`, `ExpectedValue.ts`

