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

## 1. PROJECT MISSION & "THE WHY"
Most blackjack apps are "games" that encourage gambling. **BFS is a high-fidelity training simulator.**
* **The Goal:** Automate the cognitive load of card counting (Hi-Lo System) so it becomes subconscious.
* **The Philosophy:** If the user has to "think" about the math, they have already failed. The math must move from the prefrontal cortex to the basal ganglia (muscle memory).

---

## 2. CORE ARCHITECTURE: THE "MODULAR MASTERY" PLAN

### Phase 1: The Logic Engine (The Source of Truth)
The engine must move away from "random card generation" and toward "data-set simulation."
* **Deck Engine:** Support 1 to 8 decks. Must track exact deck composition to calculate "Ground Truth" behind the scenes.
* **State Management:** A global `SimState` tracking:
    * `RunningCount`: Integer sum of all seen cards.
    * `DecksRemaining`: Visual volume estimate (User Input vs. Reality).
    * `TrueCount`: (RunningCount / DecksRemaining).
* **Validation:** The system always knows the real count. User accuracy is measured by the delta between their input and the Ground Truth.

### Phase 2: The "Muscle Memory" Drills
Isolated environments to build specific sub-skills before full-game simulation.
* **Cancellation Drill:** Displays pairs of cards. 
    * *Why:* Teaches the brain to ignore "neutral" pairs (+1 and -1), reducing mental processing by 50%.
* **Visual Volume Estimation:** Displays stacks of cards in a discard tray. 
    * *Why:* True Count is useless if the user cannot estimate the denominator by eye.
    * 
* **The Illustrious 18 (Decision Deviations):** Rapid-fire "Basic Strategy" pivots. 
    * *Why:* Professional counters change their play based on the count (e.g., taking Insurance at True +3).
    * 

### Phase 3: The "Vegas Stress" Simulator (UX Refactor)
Moves the user from a quiet room to a chaotic casino floor.
* **The Distraction Engine:** * Integrated audio loops (casino floor noise/chatter).
    * "Dealer Talk" pop-ups: Users must answer a text question (e.g., "Where you from?") without losing the count.
* **The Heat Meter (Security AI):** * A logic-based meter monitoring **Bet Volatility**. If the user jumps from $10 to $200 instantly, the meter spikes.
    * *Why:* Teaches "Bet Ramping" and "Camouflage." Being "backed off" (banned) is the same as losing.

---

## 3. FUTURE FEATURE ROADMAP

### A. The "Risk of Ruin" (RoR) Dashboard
* **Feature:** User inputs bankroll (e.g., $10,000) and bet unit ($25).
* **Logic:** Simulates 1,000 "Shadow Sessions" to show the probability of bankruptcy due to variance, even with a perfect count.

### B. AR Discard Tray Calibration
* **Feature:** Use the phone's camera/Lidar to scan a physical stack of cards and overlay the "Deck Count."
* **Logic:** Calibrates the user's eye for real-world play using physical decks.

### C. The "Perfect Session" Certification
* **Feature:** A 20-minute un-interrupted session requirement.
* **Requirement:** 100% counting accuracy, 0 strategy errors, and "Heat Meter" below detection threshold.
* **Why:** The final gatekeeper before a user is "Casino Ready."

---

## 4. TECHNICAL GUARDRAILS FOR AI AGENTS
1.  **Strict Card Logic:** All cards must be drawn from a strictly defined `Shoe` object to ensure mathematical integrity. No "randomized" values that don't exist in the remaining deck.
2.  **Normalization:** All Betting Ramps must be calculated as `Units` (e.g., 1 unit = $10) to allow scaling.
3.  **Latency:** The "Card Flip" in speed drills must be sub-100ms to mimic the rapid "Sweep" of a Vegas dealer.
4.  **No Hedging:** If the user misses a count in "Test Mode," the app should not correct them until the end of the shoe to simulate real-world consequences.

---

## 5. REFACTORING COMMANDS FOR CURSOR
* "Initialize folder structure for `/src/engines/math` and `/src/components/drills`."
* "Refactor the main view to include the `Heat Meter` logic based on `TrueCount` bet volatility."
* "Build the `ShoeEngine.ts` to handle 100% accurate card tracking."
