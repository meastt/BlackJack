# Card Counting Protocol 21 — iOS Rebirth Plan

## Status: Engineering Complete — Ready for Submission Prep

---

## Why the previous version was rejected

The build submitted 2026-02-26 was rejected for four reasons:

1. **Simulated gambling from individual account** — Simulator screen presented playable blackjack rounds with fake-money betting.
2. **IAP products not submitted** — Monthly/annual/lifetime subscriptions were not attached to the app version for review.
3. **IAP UX bug** — Indefinite loading spinner when triggering Unlock Pro on iPad.
4. **Metadata mismatch** — Store name "Protocol 21: Blackjack Trainer" vs prior on-device name (resolved: **Card Counting Protocol 21** everywhere).

---

## Completed Changes

### Simulator Removal (iOS)
- `trainingModeEnabled` feature flag gates on `Platform.OS === 'ios'` (`src/config/featureFlags.ts`)
- AppNavigator conditionally excludes Simulator route when flag is active
- HomeScreen has no Simulator entry point on iOS
- Simulator code preserved for Android builds

### App Naming Alignment
- `app.json` name set to "Card Counting Protocol 21"
- `Info.plist` CFBundleDisplayName set to "Card Counting Protocol 21"
- Consistent across device and planned marketplace name

### Gambling Language Removal
- All iOS-visible screens use educational/training language: "PROTOCOL 21", "ADVANTAGE PLAY INTERFACE", "TRAINING MODULES", "TACTICAL TOOLS"
- No casino, betting, or gambling terms in user-facing iOS flow
- Educational disclaimer in ProfileScreen ("TRAINING NOTICE")

### Decision Lab (replaces Simulator)
- Full `DecisionLabScreen` implementation with timed scenario prompts
- Novice/Advanced adaptive difficulty with distractor prompts
- Leak bucket tracking (COUNT_DRIFT, ACTION_MISMATCH, SIZING_DISCIPLINE, TIME_PRESSURE)
- Session recap with edge metrics and next-drill recommendations

### Edge Metrics (replaces fake bankroll)
- `trainingMetrics.ts` defines: EdgeScore, EVCaptured, MistakeCost, DecisionLatency, CountIntegrity, ScenarioResult, EdgeSessionSummary, ReadinessTier
- EdgeScore (0-1000 scale) with tier progression: NOVICE / DEVELOPING / ADVANTAGED / ELITE
- Integrated into SimState store, AnalyticsDashboard, and DecisionLab

### IAP / Paywall Hardening
- PaywallScreen handles empty offerings with explicit error message and retry CTA
- 15-second timeout wrapper on purchase and restore operations
- "Continue with free training" fallback — no trapped states
- Analytics events for paywall errors (`paywall_error_shown`)

### TypeScript & Test Health (2026-03-26)
- **0 TypeScript errors** (`npx tsc --noEmit` clean)
- **924/924 tests passing** across 7 suites
- Fixed: missing color token aliases, stale import paths, type mismatches in apiService/Certification/Deviations/AnalyticsDashboard
- Excluded `__tests__/` from tsconfig (Jest provides its own globals)

### Documentation
- `APP_STORE_METADATA_SCREENSHOT_PLAN.md` — subtitle, description, keywords, 6 screenshot specs
- `docs/APP_REVIEW_SUBMISSION_PACKAGE.md` — reviewer test path, sandbox notes, QA checklist

---

## Remaining To-Do (Submission Checklist)

### Manual QA
- [ ] Smoke test on **iPhone**: Home -> Decision Lab -> Analytics -> Paywall
- [ ] Smoke test on **iPad** (Apple reviewed on iPad Air 11-inch M3) — verify layouts
- [ ] **Sandbox IAP test**: complete a purchase end-to-end, confirm no spinner hang
- [ ] **Offline/poor-network test**: verify paywall shows error + retry + "continue free"

### Build
- [ ] Create release build and upload to App Store Connect

### App Store Connect Configuration
- [ ] Change **product name** in App Store Connect to **Card Counting Protocol 21** (replace legacy titles such as "Protocol 21: Blackjack Trainer" if still present)
- [ ] Update **content rating** — remove gambling/simulated gambling flags
- [ ] **Attach IAP products** (monthly, annual, lifetime) to the app version
- [ ] Add a **review screenshot** to each IAP product (screenshot of PaywallScreen showing offerings)
- [ ] Upload **6 marketing screenshots** (new prompts drafted, no casino/gambling imagery)
- [ ] Paste **subtitle** (pick from: "Advantage Play Skills Trainer" / "Card Counting Drills & Analytics" / "Blackjack AP Training System")
- [ ] Paste **description** and **keywords** from `APP_STORE_METADATA_SCREENSHOT_PLAN.md`
- [ ] Paste **reviewer notes**: "Card Counting Protocol 21 is an educational card-counting training app. This version does not include simulated wagering gameplay or playable casino blackjack rounds. Reviewer path: Home -> Training Modules -> Decision Lab -> Analytics -> Paywall."
- [ ] Final sandbox IAP verification in App Store Connect before hitting Submit
