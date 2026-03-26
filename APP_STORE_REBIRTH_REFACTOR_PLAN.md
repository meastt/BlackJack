# Protocol 21 iOS Rebirth Plan

## Objective
Ship a new iOS version that:
1. Meets App Store review requirements for an individual developer account (no simulated gambling gameplay),
2. Preserves the core promise: users are training to become advantaged blackjack players,
3. Keeps conversion-focused positioning and progression psychology,
4. Stabilizes IAP review flows and metadata consistency.

---

## Why the previous version was rejected (decision framing)
The previous build was rejected for four separate reasons:
- **Simulated gambling policy/account type conflict** (individual account + simulated gambling features).
- **IAP completeness** (paid products not fully submitted for review).
- **IAP UX bug** (indefinite loading on Unlock Pro flow).
- **Metadata mismatch** (store name vs on-device app name too different).

This plan addresses each issue with explicit product, UX, technical, and release steps.

---

## Product Reframe: Keep the intent, remove the risky interpretation

### Keep (must remain)
- Blackjack card counting skill progression.
- Hi-Lo fundamentals: card values, running count, true count, deviations, bet correlation logic.
- “Advantage player” outcomes language (training readiness, edge capture, discipline).
- Premium monetization for advanced training tools and analytics.

### Remove/replace (must change)
- Playable blackjack loop with dealer/player hand resolution for fake money.
- Bankroll-as-currency progression that resembles wagering simulation.
- Casino-roleplay semantics as core feature framing (pit boss, chaos mode simulator, etc.).

### New framing
- **Protocol 21 Advantage Lab**: scenario-based decision training and edge analytics.
- User proof of progress via **Edge Score**, **EV Capture**, **Error Cost**, **Readiness Tiers**.
- “Train like an AP” without simulating gambling rounds.

---

## Feature Migration Map (Old -> New)

1. **Casino Simulator** -> **Table Decision Lab**
   - Input: current count context + shoe depth + hand scenario.
   - User actions: choose optimal play and stake sizing band.
   - Output: EV delta, speed score, confidence impact.

2. **Fake Bankroll trajectory** -> **Edge Trajectory**
   - Replace dollar growth narrative with performance-capital narrative.
   - Keep graph visualization and longitudinal trend feedback.

3. **Heat meter** -> **Camouflage Discipline Index**
   - Retain behavioral consistency scoring but remove gambling theatre framing.

4. **Hand wins/losses** -> **Scenario quality metrics**
   - EV capture %, count accuracy %, deviation accuracy %, decision latency.

5. **Certification mode** -> **Readiness Certification**
   - Preserve strict pass rubric and progression prestige.

---

## Delivery Plan (4 phases)

## Phase 0 — Compliance Freeze (1-2 days)
**Goal:** Remove high-risk surfaces from iOS release candidate before deeper refactor.

Tasks:
- Hide/remove Simulator entry point in iOS build.
- Remove explicit simulated gambling copy from home/paywall/marketing strings in-app.
- Align app naming across device and marketplace naming conventions.
- Keep drills + progression + analytics accessible.

Definition of done:
- No route in iOS allows simulated blackjack hand-play loop.
- No first-run UX markets the app as a casino simulator.

---

## Phase 1 — Reinforcement Engine (3-5 days)
**Goal:** Replace fake bankroll motivation with high-credibility “advantage readiness” reinforcement.

Tasks:
- Introduce `EdgeScore` domain model (0-100 or 0-1000 scale).
- Introduce `EVCaptured`, `MistakeCost`, `DecisionLatency`, `CountIntegrity` metrics.
- Implement scenario result formula:
  - Correct count + correct decision + correct sizing -> positive edge contribution.
  - Mistakes apply weighted penalty and streak decay.
- Replace bankroll UI labels/components with edge-performance labels.

Definition of done:
- Users still get “I am improving / I am profitable in expectation” feedback.
- No fake cash/wager loop semantics remain in primary progression.

---

## Phase 2 — Decision Lab Experience (4-7 days)
**Goal:** Preserve realism through scenario density and pressure, not simulated betting rounds.

Tasks:
- Build Table Decision Lab screen:
  - timed prompts,
  - count updates,
  - shoe penetration estimates,
  - action and sizing recommendations.
- Add adaptive difficulty:
  - novice: slower cadence + hints,
  - advanced: higher velocity + distractor prompts.
- Add session recap:
  - edge gained,
  - top 3 leaks,
  - next drill recommendations.

Definition of done:
- Users perceive realistic AP preparation.
- Session loop is clearly educational/training-focused.

---

## Phase 3 — App Store Readiness + Monetization Hardening (2-4 days)
**Goal:** Eliminate avoidable review failures.

Tasks:
- IAP:
  - Ensure products are attached/submitted with the app version.
  - Add explicit paywall error states (no indefinite spinner).
  - Add retry + fallback (continue with free mode).
- Metadata:
  - Harmonize app name/device name.
  - Remove gambling-simulation phrasing from screenshots and description.
- Review notes package:
  - Explain educational purpose and no simulated wagering gameplay.
  - Provide exact reviewer test path and sandbox notes.

Definition of done:
- Paywall behavior deterministic under missing offerings/network issues.
- Reviewer can complete app flow without blocked states.

---

## Backlog by workstream

## A) UX & Content
- Rename modules:
  - “Simulator” -> “Decision Lab”
  - “Bankroll” -> “Edge Capital” or “Edge Score”
  - “Heat” -> “Discipline”
- Replace copy references to casino simulation with skills language.
- Add transparent educational disclaimer in settings/about:
  - training tool,
  - no real-money play,
  - no gambling operations.

## B) Front-end architecture
- Introduce `training_mode` feature flag for iOS-safe experience.
- Create new shared components for metric cards and session recaps.
- Preserve existing drill routes and unlock progression.

## C) Data model
- New entities:
  - `ScenarioResult`
  - `EdgeSessionSummary`
  - `ReadinessTier`
- Migration script for old persisted simulator state -> new analytics model.

## D) Analytics
- KPI events:
  - `scenario_started`, `scenario_completed`, `edge_score_delta`, `paywall_error_shown`.
- Retention metrics by phase completion and certification attempts.

## E) QA
- Regression suite for drills/progression unlocks.
- iPad-first layout pass (review device class).
- Offline/poor-network tests for paywall and startup states.

---

## Acceptance Criteria for “Rebirth v1”

### App Review Safety Criteria
- No simulated gambling hand-play experience in iOS submission.
- No fake bankroll gameplay loop tied to hand outcomes.
- Naming and metadata are consistent and discoverable.
- IAP products fully submitted and testable in sandbox.
- No infinite loading states on monetization screens.

### Product Integrity Criteria
- User can still complete a guided path to AP readiness.
- User receives strong reinforcement signals (progress, mastery, expected edge quality).
- Premium value proposition remains clear and conversion-ready.

---

## Proposed release sequence
1. **Rebirth RC1**: compliance freeze + naming + IAP hardening.
2. **Rebirth RC2**: edge score model + analytics relabel.
3. **Rebirth RC3**: full Decision Lab + adaptive pressure + certification polish.
4. Submit with explicit App Review Notes and QA checklist attached.

---

## App Review Note template (draft)
"Protocol 21 is an educational card-counting training app focused on skill drills, true-count math, and decision quality evaluation. This version does not include simulated wagering gameplay or playable casino blackjack rounds. Paid features unlock additional educational modules and analytics. Reviewer test flow: Home -> Training Modules -> Decision Lab -> Analytics -> Paywall (with sandbox product IDs configured)."

---

## Kickoff task list (first implementation sprint)
1. Remove simulator route exposure from Home and AppNavigator for iOS-safe build.
2. Create `DecisionLabScreen` scaffold and route.
3. Relabel analytics surfaces from bankroll semantics to edge semantics.
4. Add paywall empty-offerings error state + retry CTA.
5. Align `CFBundleDisplayName` with final App Store product name.
6. Draft updated App Store metadata and screenshot plan.

