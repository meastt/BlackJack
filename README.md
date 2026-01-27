# Card Counter AI - Production Guide

## 🎰 Launching the App

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This will install dependencies for both the root workspace and nested packages (`mobile`, `shared`).

2.  **Start the Metro Bundler:**
    ```bash
    cd mobile
    npm start
    ```
    - Scan the QR code with **Expo Go** (Android/iOS) to run on a physical device.
    - Press `a` to run on Android Emulator.
    - Press `i` to run on iOS Simulator (macOS only).

## 🏆 Pro Certification Challenge

To verify the "Perfect Session" logic:

1.  Navigate to the **Certification** screen via the app menu (or direct link if enabled).
2.  Tap **"Start Challenge"**.
3.  **Requirements:**
    - Play through **2 Full Shoes** (approx. 200 hands).
    - Maintain **100% Counting Accuracy** (checked at every shuffle).
    - Maintain **>98% Decision Accuracy** (Basic Strategy + Deviations).
    - Keep **Heat < 80%** (Avoid erratic bet spreads).
4.  Upon completion, if criteria are met, the **"PRO CARD COUNTER"** badge will be awarded.

## 🛠 Native Build Steps (Manual)

For a full store release (IPA/APK):

1.  **Permissions:** Ensure `VIBRATE`, `CAMERA`, and `RECORD_AUDIO` are configured in `app.json` (Done).
2.  **EAS Build:**
    ```bash
    npm install -g eas-cli
    eas build --platform all
    ```
3.  **Assets:** Ensure all audio/image assets in `mobile/assets/` are optimized.

## 📦 Project Structure

- `mobile/`: React Native (Expo) application.
- `shared/`: Core game engines (`ShoeEngine`, `RiskOfRuin`) shared via workspace.
