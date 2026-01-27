# Proposed Folder Structure Refactor

Based on `NEW_PLAN.md` and the existing project layout, we propose the following restructuring. The goal is to separate "Muscle Memory" drills, "Simulation" environments, and pure "Math/Logic" engines.

We will leverage the existing `shared/` workspace for core logic to ensure it can be reused (e.g., by backend for validation) and keep `mobile/` focused on UI/UX.

## 1. Logic & Engines (`shared/src/`)

We will rename/refactor `shared/src/engine` to `shared/src/engines` and split responsibilities:

- **`shared/src/engines/ShoeEngine.ts`** (New):
  - Strictly manages the deck composition (1-8 decks).
  - Handles "popping" cards (random draw without replacement).
  - Maintains the "Ground Truth" state (cards remaining, true count).
- **`shared/src/engines/MathLogic.ts`** (Refactor of `CardCountingEngine.ts`):
  - Pure functions for counting math (Running Count, True Count, Bet Spreads).
  - Validating user inputs against ground truth.
- **`shared/src/analytics/`** (New):
  - `RiskOfRuin.ts`: RoR calculations.
  - `ExpectedValue.ts`: EV simulations.

## 2. Mobile Application (`mobile/src/`)

We will restructure `mobile/src` to align with the "Three-Tier Training System":

- **`mobile/src/components/drills/`** (New Folder):
  - `Cancellation.tsx`: The card cancellation speed drill.
  - `VolumeEstimate.tsx`: The deck estimation visualizer.
  - `Deviations.tsx`: The "Illustrious 18" scenarios.
  - *Migration:* Move `screens/GuidedLearning/Phase2RunningCount.tsx` logic here (or adapt it).
- **`mobile/src/components/simulator/`** (New Folder):
  - `CasinoView.tsx`: The main "Flight Simulator" view.
  - `HeatMeter.tsx`: Visual component for "Pit Boss Suspicion".
  - `DistractionLayer.tsx`: Audio/Visual noise engine.
- **`mobile/src/store/`** (Update):
  - `SimState.ts`: Global state for the Simulator (Running Count, Heat Meter, Bankroll), likely replacing or augmenting `useGameStore.ts`.

## 3. Migration Map

| Current File | New Location | Notes |
|--------------|--------------|-------|
| `shared/.../CardCountingEngine.ts` | `shared/src/engines/MathLogic.ts` | Split logic: Deck management goes to `ShoeEngine`. |
| (New) | `shared/src/engines/ShoeEngine.ts` | "Source of Truth" for card distribution. |
| `mobile/.../Phase2RunningCount.tsx` | `mobile/src/components/drills/RunningCount.tsx` | Refactor into a reusable drill component. |
| `mobile/.../basicStrategy.ts` | `shared/src/engines/BasicStrategyEngine.ts` | Move logic to shared. |
| `mobile/.../useGameStore.ts` | `mobile/src/store/SimState.ts` | Refactor to support new Sim variables. |

## 4. Immediate Next Steps (Step 2 & 3)

1. **Refactor Logic:** Create `ShoeEngine.ts` in `shared` to handle the `pop()` logic and deck state.
2. **Initialize State:** Create `SimState` in `mobile/src/store` to track the count and heat meter.
