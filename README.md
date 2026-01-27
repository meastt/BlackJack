# Card Counter AI - Progressive Mastery System

**Card Counter AI** is a professional-grade training simulator designed to transition users from "Basic Strategy" to "Advantage Play" (Card Counting) by automating cognitive load. It uses a "Muscle Memory" approach to build specific skills in isolation before combining them in a chaotic casino simulator.

## 🚀 Features

### The Progressive Mastery System
The app is structured into unlocked phases:
1.  **Phase 0: Basic Strategy** - Master the fundamental decision table (Hit, Stand, Split, Double) before counting.
2.  **Phase 1: Card Values** - Learn Hi-Lo values (+1, 0, -1) instantly.
3.  **Phase 2: Running Count** - Keep a running tally as cards are dealt.
4.  **Phase 3: True Count** - Normalize the Running Count based on **Decks Remaining**.
5.  **Phase 4: Betting** - Size your bets according to the True Count advantage (Kelly Criterion).
6.  **Phase 5: Certification** - The final exam.

### Special Training Drills
*   **⚡️ Speed Drill (Cancellation):** Identify net-zero pairs (+1/-1) instantly to reduce mental math.
*   **🌩️ Deck Countdown:** Count down a single deck as fast as possible. Track your "Seconds Per Deck".
*   **👁️ Discard Tray Visualizer:** Train your eye to estimate "Decks Remaining" (0.5 deck precision) for accurate True Count calculation.
*   **🎓 Illustrious 18 (Deviations):** Master the specific scenarios where counting overrides Basic Strategy (e.g., Standing on 16 vs 10 at TC +0).

### 🎰 Casino Simulator (Chaos Mode)
Putting it all together in a realistic environment.
*   **Distraction Engine:** Random audio/visual triggers ("Cocktails?", "Pit Boss Watching") to challenge your focus.
*   **Heat Meter:** Tracks your "Bet Spread" volatility. If you act too aggressively, the Pit Boss gets suspicious.
*   **Full Game Loop:** Play generic Blackjack with persistent bankroll and stats.

---

## 🛠 Quick Start

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This installs dependencies for both `mobile` (React Native/Expo) and `shared` logic.

2.  **Run the Mobile App:**
    ```bash
    cd mobile
    npm start
    ```
    - Scan the **QR code** with Expo Go (Android/iOS).
    - Press `i` for iOS Simulator.
    - Press `a` for Android Emulator.

3.  **Run Tests:**
    ```bash
    npm test
    ```

---

## 📦 Project Structure

*   `mobile/`: React Native (Expo) application. UI, Navigation, and Drills.
*   `shared/`: Core game logic shared across platforms.
    *   `ShoeEngine.ts`: Manages deck composition and card dealing.
    *   `RiskOfRuin.ts`: Analytics and probability math.
    *   `types/`: Shared TypeScript interfaces.
*   `docs/`: Design documents, architectural plans, and specifications.

## 🏆 Certification Criteria
To earn the **"PRO CARD COUNTER"** badge in the simulator:
- Play **2 Full Shoes**.
- Maintain **100% Counting Accuracy**.
- Maintain **>98% Decision Accuracy** (Basic + Deviations).
- Keep **Heat < 80%**.

---
*Built with React Native, Expo, and TypeScript.*
