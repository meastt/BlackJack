# App Review Submission Package — Rebirth

## Build intent
Card Counter AI is an educational advantage-play training app.  
This release does **not** provide simulated wagering gameplay in iOS flow.

## Reviewer test path
1. Launch app
2. Home
3. Training Modules (Phase drills)
4. Decision Lab
5. Analytics
6. Paywall

## Sandbox / IAP notes
- RevenueCat offerings are required for paid plan cards.
- If offerings are unavailable, paywall shows:
  - explicit error state,
  - retry CTA,
  - fallback to continue with free training.
- Restoring purchases is available from Paywall.

## Compliance notes
- iOS runs in `trainingModeEnabled` flow (`mobile/src/config/featureFlags.ts`).
- Simulator route is not exposed when training mode is enabled.
- Educational disclaimer is visible in Profile screen.

## QA checklist for submission
- [ ] iPhone: Home -> Decision Lab -> Analytics flow works without blocked states.
- [ ] iPad: layout verification for Home, Decision Lab, Analytics, and Paywall.
- [ ] Poor network: paywall shows empty-offerings state + retry + continue free.
- [ ] Offline launch: drills and non-IAP paths remain usable.
- [ ] Purchase unavailable path does not trap user on spinner/loading state.

## Attachments to include in App Store Connect
- Updated screenshots reflecting Decision Lab and educational framing.
- Updated metadata copy from `APP_STORE_METADATA_SCREENSHOT_PLAN.md`.
- This reviewer path + sandbox notes document.

## Remaining work after code/repo changes
Use this as the execution checklist once engineering changes are merged.

### 1) Validation & QA (engineering + product)
- [ ] Run full mobile verification on current release branch:
  - [ ] `yarn tsc`
  - [ ] `yarn test`
  - [ ] Device/simulator smoke pass for Home -> Decision Lab -> Analytics -> Paywall
- [ ] Perform manual iPhone + iPad checks from the QA checklist above.
- [ ] Capture and log any regressions before creating release build.

### 2) App Store assets (product/marketing)
- [ ] Produce final screenshot set based on `APP_STORE_METADATA_SCREENSHOT_PLAN.md`.
- [ ] Finalize subtitle, promotional text, and description variant selection.
- [ ] Confirm keyword list and regional localization requirements (if any).

### 3) App Review submission (release owner)
- [ ] Paste reviewer notes snippet from `APP_STORE_METADATA_SCREENSHOT_PLAN.md`.
- [ ] Attach this package and final screenshots in App Store Connect.
- [ ] Verify IAP/paywall behavior in sandbox one final time before submit.
- [ ] Submit build and monitor App Review feedback queue.
