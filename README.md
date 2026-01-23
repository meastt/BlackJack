# 🃏 Card Counter AI

The only app that actually teaches you to count cards—from complete beginner to casino-ready. Not a gimmick, not a flashcard toy. Progressive skill-building with AI coaching until you can hold a true count under pressure.

## ✨ Features

### Free Features
- **Guided Learning Mode**: Complete Hi-Lo system training
  - Phase 1: Card Values (learn the basics)
  - Phase 2: Running Count (maintain count during play)
  - Phase 3: True Count Conversion (deck estimation)
  - Phase 4: Betting Correlation (optimal bet sizing)
- **AI Coach**: Get help understanding concepts at any time

### Premium Features ($9.99/mo or $49.99/yr)
- **Casino Simulation** (5 progressive tiers)
  - Tier 1: Empty table practice
  - Tier 2: Crowded table with distractions
  - Tier 3: Pit boss pressure simulation
  - Tier 4: Multi-table rotation
  - Tier 5: Vegas floor graduation test
- **Pressure Training**: Speed drills, distraction resistance
- **Advanced Systems**: KO, Hi-Opt I/II, Omega II, Zen Count
- **Session Analysis**: AI-powered performance reviews

## 🏗️ Architecture

This is a monorepo containing:
- `/mobile` - React Native mobile app (iOS & Android)
- `/backend` - Serverless backend (Express.js)
- `/shared` - Shared TypeScript types and logic

### Tech Stack
- **Mobile**: React Native + Expo, TypeScript, Zustand
- **Backend**: Node.js, Express, Anthropic SDK (Claude AI)
- **Database**: Firebase/Firestore (user data)
- **Subscriptions**: RevenueCat
- **AI**: Claude 3.5 Sonnet (coaching & analysis)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (for mobile development)
- Anthropic API key (for AI coach)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/meastt/BlackJack.git
   cd BlackJack
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your API keys
   ```

4. **Build shared package**
   ```bash
   cd shared
   npm run build
   cd ..
   ```

5. **Start the backend**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the mobile app** (in a new terminal)
   ```bash
   cd mobile
   npm start
   ```

For detailed setup instructions, see [SETUP.md](SETUP.md).

## 📱 Mobile App

The mobile app is built with React Native and Expo for cross-platform development.

### Running on Device/Simulator

```bash
cd mobile
npm run ios     # iOS simulator
npm run android # Android emulator
npm run web     # Web browser
```

### Key Components

- **Card Component**: Renders playing cards with proper styling
- **Button Component**: Reusable button with variants
- **Phase1CardValues**: First learning module (card value drills)
- **ApiService**: Backend API communication
- **GameStore**: Zustand state management

## 🔧 Backend API

RESTful API with the following endpoints:

### Coach AI
- `POST /api/coach/ask` - Get coaching advice
- `POST /api/coach/analyze-session` - Analyze completed session

### User Stats
- `GET /api/stats/:userId` - Get user statistics
- `POST /api/stats/:userId` - Update user stats
- `POST /api/stats/:userId/session` - Record session

### Subscriptions
- `GET /api/subscription/:userId` - Get subscription status
- `POST /api/subscription/webhook` - RevenueCat webhook handler

## 🧮 Card Counting Engine

The core counting logic is in `/shared/src/engine/CardCountingEngine.ts`:

```typescript
import { CardCountingEngine, CountingSystem } from '@card-counter-ai/shared';

// Create engine with Hi-Lo system
const engine = new CardCountingEngine(CountingSystem.HI_LO, 6);

// Count cards
const cards = CardCountingEngine.createShoe(6);
engine.countCards(cards.slice(0, 10));

// Get counts
const runningCount = engine.getRunningCount();
const trueCount = engine.getTrueCount();
const betMultiplier = engine.getBetMultiplier();
```

### Supported Systems

- **Hi-Lo**: Beginner-friendly, balanced (+1/0/-1)
- **KO**: Unbalanced, no true count needed
- **Hi-Opt I**: Intermediate, more accurate
- **Hi-Opt II**: Advanced, multi-level with ace side count
- **Omega II**: Expert level, highest accuracy
- **Zen**: Advanced, balanced multi-level

## 📊 User Progression

The app tracks detailed metrics:
- Cards per minute (speed)
- Running count accuracy %
- True count accuracy %
- Bet correlation score
- Heat score (detectability)
- Distraction resistance
- Session EV (expected value)

## 🔐 Security & Privacy

- API keys stored server-side only
- Claude API calls via secure backend proxy
- RevenueCat for secure subscription management
- Encrypted user data storage
- No sensitive data on client

## 📄 Legal Disclaimer

Card counting is a legal advantage play technique. This app teaches the skill for educational purposes. Casinos are private property and may restrict players at their discretion. Play responsibly.

## 🛠️ Development

### Project Structure

```
BlackJack/
├── mobile/              # React Native app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── screens/     # App screens
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   └── theme/       # Colors & typography
│   ├── app.json
│   └── package.json
├── backend/             # Serverless backend
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── middleware/  # Express middleware
│   └── package.json
├── shared/              # Shared code
│   ├── src/
│   │   ├── types/       # TypeScript types
│   │   └── engine/      # Counting logic
│   └── package.json
└── package.json         # Root package
```

### Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture details
- **API Docs** - See individual route files in `/backend/src/routes`

### Building for Production

**Mobile:**
```bash
cd mobile
eas build --platform ios
eas build --platform android
```

**Backend:**
Deploy to your serverless platform (Vercel, AWS Lambda, etc.)

## 🤝 Contributing

This is a private project. For issues or questions, contact the repository owner.

## 📝 License

MIT License - See LICENSE file for details

## 🎯 Roadmap

**V1 (Current)**
- ✅ Hi-Lo system training
- ✅ Guided learning (4 phases)
- ✅ AI coaching
- ✅ Basic casino simulation
- ✅ Stats tracking

**V2 (Planned)**
- Advanced counting systems
- Multi-table training
- Team play simulation
- Live dealer integration
- Advanced heat management

---

**Made with ♠️ ♥️ ♣️ ♦️**
