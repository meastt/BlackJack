# 🃏 Card Counter AI

The only app that actually teaches you to count cards—from complete beginner to casino-ready. Progressive skill-building with AI coaching until you can hold a true count under pressure.

## ✨ Features

### Guided Learning Mode
- **Phase 1: Card Values** - Learn the Hi-Lo card values (+1, 0, -1)
- **Phase 2: Running Count** - Maintain count as cards are dealt
- **Phase 3: True Count** - Convert running count based on decks remaining
- **Phase 4: Betting Correlation** - Size bets based on count advantage

### AI Coach
Real-time coaching powered by Claude AI to help you understand concepts and improve your technique.

### Counting Systems
- **Hi-Lo** - Beginner-friendly, balanced (+1/0/-1)
- **KO** - Unbalanced, no true count conversion needed
- **Hi-Opt I** - Intermediate, more accurate
- **Hi-Opt II** - Advanced, multi-level
- **Omega II** - Expert level, highest accuracy
- **Zen** - Advanced, balanced multi-level

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo Go app on your phone (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/meastt/BlackJack.git
cd BlackJack

# Install all dependencies
npm install

# Build the shared package
cd shared && npm run build && cd ..

# Start the mobile app
cd mobile && npx expo start
```

### Running on Device
1. Install [Expo Go](https://expo.dev/client) on your phone
2. Run `npx expo start` from the `/mobile` directory
3. Scan the QR code with your phone

## 📱 Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **AI**: Anthropic Claude API (direct client calls)
- **Storage**: AsyncStorage (local device storage)

## 🏗️ Project Structure

```
BlackJack/
├── mobile/              # React Native app
│   ├── src/
│   │   ├── components/  # Reusable UI (Button, Card)
│   │   ├── screens/     # App screens
│   │   ├── services/    # API services
│   │   ├── store/       # Zustand state
│   │   └── theme/       # Colors & typography
│   └── App.tsx          # Entry point
├── shared/              # Shared TypeScript package
│   └── src/
│       ├── types/       # Type definitions
│       └── engine/      # Card counting logic
└── package.json         # Root workspace config
```

## 🔧 Configuration

### Environment Variables

Create `mobile/.env`:
```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/).

## 📊 User Progression

The app tracks:
- Cards per minute (speed)
- Running count accuracy
- True count accuracy
- Bet correlation score
- Session performance

## 🔐 Architecture

This app runs **entirely on-device** with no backend server required:
- AI coaching calls Anthropic API directly from the app
- User stats stored locally on device via AsyncStorage
- Card counting engine runs as pure TypeScript

## 📱 Building for App Stores

```bash
cd mobile

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📄 Legal Disclaimer

Card counting is a legal advantage play technique. This app teaches the skill for educational purposes. Casinos are private property and may restrict players at their discretion. Play responsibly.

## 📝 License

MIT License

---

**Made with ♠️ ♥️ ♣️ ♦️**
