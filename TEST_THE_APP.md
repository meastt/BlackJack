# 🧪 BLACKJACK FLIGHT SIMULATOR: QA CHECKLIST

## 1. Mathematical Integrity (The "Ground Truth" Test)
* [ ] **The "Perfect Shoe" Test:** Run a full shoe in "Cheat Mode." Verify that the `trueCountGroundTruth` updates correctly after *every* card is popped.
* [ ] **The 0-Sum Test:** At the end of a shoe, the Running Count must be checked against the remaining cards. If you count every card, you should end at exactly 0. 
* [ ] **Fisher-Yates Shuffle:** Reset the shoe 5 times. Ensure the first card dealt is different each time (verifying the shuffle isn't "stuck").
* [ ] **TC Division:** Verify that at 0.5 decks remaining, a Running Count of +3 correctly shows a True Count of +6.

## 2. Decision Logic (The Illustrious 18)
* [ ] **Insurance Snap:** When the dealer shows an Ace, does the 1.5s timer feel fair or too fast? Does a TC of +2.9 correctly trigger a "Bad Insurance" error?
* [ ] **The 16 vs 10 Pivot:** At TC -1, "Hit" should be correct. At TC +1, "Stand" should be correct. Verify the app flags the error if you do the opposite.
* [ ] **Split Logic:** Verify 10-10 vs 5/6 triggers the "Split" deviation only when TC is high enough.
* [ ] **EV Tracking:** Check the Analytics page after a "Wrong" decision. Did your `mistakesCost` increase?

## 3. Sensory & UX (The "Feel")
* [ ] **Haptic Differentiation:** Can you tell the difference between a "Math Error" (Double Tap) and "Heat Warning" (Long Pulse) without looking at the screen?
* [ ] **Audio Normalization:** Turn on the "Distraction Engine." Is the casino noise loud enough to be annoying but quiet enough to hear the "Dealer" talk?
* [ ] **Input Latency:** In the "Cancellation Drill," tap as fast as possible. Does the UI lag or miss taps? (Goal: <100ms response).

## 4. The "Heat Meter" (Security Simulation)
* [ ] **The "Whale" Test:** Bet 1 unit ($10) for 5 hands, then suddenly bet 50 units ($500). The Heat Meter should spike immediately.
* [ ] **The "Wong" Test:** If you sit out hands when the count is negative and jump in only when positive, does the Heat Meter reflect "suspicious entry"?
* [ ] **Cover Play:** Intentionally make a "mistake" (e.g., hitting a 12 vs 4). Does the "Heat Meter" actually drop? (It should, as it makes you look like a "bad" player).

## 5. Analytics & RoR (Monte Carlo Check)
* [ ] **The "What-If" Slider:** Change your bankroll from $10k to $1k. Does the Risk of Ruin % update within 1 second?
* [ ] **Variance Scaling:** Ensure the RoR doesn't stay at 0% when you have a small bankroll. If it does, the 1.33 variance isn't being applied correctly.
* [ ] **Chart Persistence:** Close the app and reopen. Is your `bankrollHistory` still there?

## 6. Certification (The "Final Boss")
* [ ] **The 100% Barrier:** Pass a shoe with 1 error. The app should *strictly* refuse the "Pro Counter" badge.
* [ ] **The Diagnostic Rubric:** Fail on purpose in three different ways (Math, Tactics, Heat). Does the "After-Action Report" give you the correct coaching tip for each?
