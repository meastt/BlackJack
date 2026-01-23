# CLAUDE.md - AI Assistant Guide

> **Last Updated**: January 23, 2026
> **Version**: 1.0.0
> **Repository**: Card Counter AI - BlackJack Training Application

This document provides comprehensive guidance for AI assistants working on the Card Counter AI codebase. It explains the project structure, development workflows, conventions, and common tasks.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Development Workflows](#development-workflows)
4. [Key Patterns and Conventions](#key-patterns-and-conventions)
5. [Common Tasks](#common-tasks)
6. [Type System and Shared Code](#type-system-and-shared-code)
7. [API Integration](#api-integration)
8. [Testing Strategy](#testing-strategy)
9. [Git Workflow](#git-workflow)
10. [Important Gotchas](#important-gotchas)
11. [File Reference Guide](#file-reference-guide)

---

## Project Overview

**Card Counter AI** is a mobile-first application that teaches card counting in blackjack through progressive skill-building with AI coaching powered by Claude (Anthropic).

### Core Purpose
- Teach users to count cards from complete beginner to casino-ready
- Provide AI-powered coaching and personalized feedback
- Track detailed performance metrics and progression
- Simulate real casino environments with progressive difficulty tiers

### Tech Stack Summary
- **Mobile**: React Native + Expo (iOS/Android)
- **Backend**: Node.js + Express (serverless)
- **AI**: Anthropic Claude 3.5 Sonnet
- **State**: Zustand (mobile), in-memory (backend)
- **Database**: Firebase/Firestore (planned)
- **Subscriptions**: RevenueCat
- **Language**: TypeScript throughout

### Business Model
- **Free Tier**: Guided learning (4 phases), basic AI coach
- **Premium** ($9.99/mo or $49.99/yr): Casino simulation, pressure training, advanced systems, session analysis

---

## Monorepo Structure

This is a **monorepo** managed with npm workspaces containing three packages:

```
BlackJack/
├── mobile/              # React Native mobile app
├── backend/             # Serverless Express API
├── shared/              # Shared TypeScript types and engines
├── package.json         # Root workspace config
├── README.md            # Project overview
├── ARCHITECTURE.md      # System architecture details
├── SETUP.md             # Development setup guide
└── CLAUDE.md            # This file (AI assistant guide)
```

### Package Dependencies
```
mobile → shared (types, engines)
backend → shared (types, engines)
shared → (no dependencies on other packages)
```

**Critical**: The `shared` package must be built before running `mobile` or `backend`.

---

## Development Workflows

### Initial Setup

1. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

2. **Build shared package** (required before running mobile/backend):
   ```bash
   cd shared
   npm run build
   ```

3. **Start backend** (terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

4. **Start mobile app** (terminal 2):
   ```bash
   cd mobile
   npm start
   ```

### Development Mode (Recommended)

Use 3 terminals for optimal development experience:

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev  # Nodemon watches for changes
```

**Terminal 2 - Shared (watch mode)**:
```bash
cd shared
npm run watch  # Rebuilds on file changes
```

**Terminal 3 - Mobile**:
```bash
cd mobile
npm start  # Expo dev server
```

### Making Changes

#### When modifying types or shared logic:
1. Edit files in `/shared/src/`
2. Changes auto-rebuild if using `npm run watch`
3. If not using watch mode, run `cd shared && npm run build`
4. Restart mobile/backend if types change significantly

#### When modifying mobile UI:
1. Edit files in `/mobile/src/`
2. Fast Refresh updates automatically
3. Check both iOS and Android if changing platform-specific code

#### When modifying backend API:
1. Edit files in `/backend/src/`
2. Nodemon restarts server automatically
3. Update `/shared/src/types/` if API contracts change

---

## Key Patterns and Conventions

### File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `Card.tsx`)
- **Screens**: PascalCase (e.g., `Phase1CardValues.tsx`)
- **Services**: camelCase (e.g., `apiService.ts`, `CoachService.ts`)
- **Types**: camelCase file, PascalCase interfaces (e.g., `index.ts` exports `UserStats`)
- **Routes**: camelCase (e.g., `coach.ts`, `stats.ts`)

### Code Organization Patterns

#### Mobile App Structure
```
/mobile/src/
├── components/      # Reusable UI components (Button, Card)
├── screens/         # Full-screen views (Phase1CardValues)
├── services/        # API communication (apiService)
├── store/           # State management (useGameStore)
└── theme/           # Design system (colors, typography)
```

#### Backend Structure
```
/backend/src/
├── routes/          # Express route handlers (coach.ts, stats.ts)
├── services/        # Business logic (CoachService, StatsService)
├── middleware/      # Express middleware (errorHandler)
└── index.ts         # App entry, server setup
```

#### Shared Package Structure
```
/shared/src/
├── types/           # TypeScript interfaces and enums
├── engine/          # Game logic (CardCountingEngine, DrillEngine)
└── index.ts         # Package exports
```

### TypeScript Conventions

1. **Always use interfaces for data structures**:
   ```typescript
   interface UserStats {
     cardsPerMinute: number;
     runningCountAccuracy: number;
     // ... more fields
   }
   ```

2. **Use enums for fixed sets of values**:
   ```typescript
   enum CountingSystem {
     HI_LO = 'hi_lo',
     KO = 'ko',
     // ... more systems
   }
   ```

3. **Export types from `/shared/src/types/index.ts`**:
   ```typescript
   export { Card, Suit, Rank };
   export type { UserStats, GameSession };
   ```

4. **Import shared types consistently**:
   ```typescript
   import { Card, UserStats, CountingSystem } from '@card-counter-ai/shared';
   ```

### State Management Patterns

#### Mobile (Zustand)
```typescript
// In useGameStore.ts
interface GameStore {
  userId: string | null;
  stats: UserStats | null;
  setUserId: (id: string) => void;
  updateStats: (stats: UserStats) => void;
}

// Usage in components
const userId = useGameStore(state => state.userId);
```

#### Backend (In-Memory)
```typescript
// In services
const userStatsCache = new Map<string, UserStats>();

// Fetch with cache
export const getUserStats = async (userId: string): Promise<UserStats> => {
  if (userStatsCache.has(userId)) {
    return userStatsCache.get(userId)!;
  }
  // ... fetch from database
};
```

### Component Patterns (Mobile)

#### Button Component Usage
```typescript
import { Button } from '../components/Button';

<Button
  variant="primary"  // primary, secondary, accent, outline
  size="medium"      // small, medium, large
  onPress={handlePress}
  disabled={isLoading}
  loading={isLoading}
>
  Submit Answer
</Button>
```

#### Card Component Usage
```typescript
import { Card } from '../components/Card';
import { Rank, Suit } from '@card-counter-ai/shared';

<Card
  rank={Rank.ACE}
  suit={Suit.SPADES}
  size="medium"  // small, medium, large
  faceUp={true}
/>
```

### API Integration Patterns

#### Mobile to Backend
```typescript
// In apiService.ts
import axios from 'axios';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'      // iOS simulator
  // ? 'http://10.0.2.2:3000/api'   // Android emulator
  : 'https://your-production-api.com/api';

// Example usage
const response = await apiService.askCoach(userId, message, context);
```

#### Backend Route Pattern
```typescript
// In routes/coach.ts
import { Router } from 'express';
import { CoachService } from '../services/CoachService';

const router = Router();
const coachService = new CoachService();

router.post('/ask', async (req, res, next) => {
  try {
    const { userId, message, context } = req.body;
    const response = await coachService.getCoachResponse(userId, message, context);
    res.json(response);
  } catch (error) {
    next(error);  // Passes to errorHandler middleware
  }
});

export default router;
```

### Error Handling Patterns

#### Mobile
```typescript
try {
  const stats = await apiService.getUserStats(userId);
  useGameStore.getState().updateStats(stats);
} catch (error) {
  console.error('Failed to fetch stats:', error);
  Alert.alert('Error', 'Failed to load your statistics');
}
```

#### Backend
```typescript
// Routes use try/catch and pass to next()
try {
  // ... business logic
} catch (error) {
  next(error);  // errorHandler middleware handles it
}

// errorHandler.ts formats all errors
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

## Common Tasks

### Task 1: Adding a New Screen to Mobile App

1. **Create screen file**:
   ```bash
   # Location: /mobile/src/screens/GuidedLearning/Phase2RunningCount.tsx
   ```

2. **Import necessary dependencies**:
   ```typescript
   import React, { useState } from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { Button } from '../../components/Button';
   import { Card } from '../../components/Card';
   import { useGameStore } from '../../store/useGameStore';
   import { CardCountingEngine, CountingSystem } from '@card-counter-ai/shared';
   ```

3. **Follow existing screen patterns** (see `Phase1CardValues.tsx` as reference)

4. **Add to navigation** (update router configuration)

### Task 2: Adding a New API Endpoint

1. **Define request/response types in `/shared/src/types/index.ts`**:
   ```typescript
   export interface NewFeatureRequest {
     userId: string;
     data: string;
   }

   export interface NewFeatureResponse {
     result: string;
   }
   ```

2. **Rebuild shared package**:
   ```bash
   cd shared && npm run build
   ```

3. **Create service in `/backend/src/services/NewFeatureService.ts`**:
   ```typescript
   import { NewFeatureRequest, NewFeatureResponse } from '@card-counter-ai/shared';

   export class NewFeatureService {
     async processRequest(request: NewFeatureRequest): Promise<NewFeatureResponse> {
       // Business logic here
       return { result: 'success' };
     }
   }
   ```

4. **Create route in `/backend/src/routes/newFeature.ts`**:
   ```typescript
   import { Router } from 'express';
   import { NewFeatureService } from '../services/NewFeatureService';

   const router = Router();
   const service = new NewFeatureService();

   router.post('/process', async (req, res, next) => {
     try {
       const result = await service.processRequest(req.body);
       res.json(result);
     } catch (error) {
       next(error);
     }
   });

   export default router;
   ```

5. **Register route in `/backend/src/index.ts`**:
   ```typescript
   import newFeatureRoutes from './routes/newFeature';
   app.use('/api/new-feature', newFeatureRoutes);
   ```

6. **Add client method in `/mobile/src/services/apiService.ts`**:
   ```typescript
   async processNewFeature(userId: string, data: string): Promise<NewFeatureResponse> {
     const response = await axios.post(`${API_BASE_URL}/new-feature/process`, {
       userId,
       data
     });
     return response.data;
   }
   ```

### Task 3: Adding a New Counting System

1. **Add to enum in `/shared/src/types/index.ts`**:
   ```typescript
   export enum CountingSystem {
     HI_LO = 'hi_lo',
     KO = 'ko',
     NEW_SYSTEM = 'new_system',  // Add here
     // ... others
   }
   ```

2. **Add system config in `/shared/src/engine/CardCountingEngine.ts`**:
   ```typescript
   private static readonly COUNTING_SYSTEMS: Record<CountingSystem, CountingSystemConfig> = {
     // ... existing systems
     [CountingSystem.NEW_SYSTEM]: {
       name: 'New System',
       values: {
         [Rank.TWO]: 1,
         [Rank.THREE]: 1,
         // ... define all rank values
       },
       balanced: true,
       difficulty: 'advanced'
     }
   };
   ```

3. **Rebuild shared package**: `cd shared && npm run build`

4. **Add UI option in mobile app** (selection screen)

### Task 4: Modifying the Card Counting Engine

**Location**: `/shared/src/engine/CardCountingEngine.ts`

**Important**: This is pure TypeScript logic with no dependencies. Changes here affect both mobile and backend.

**Example - Adding a new method**:
```typescript
// In CardCountingEngine class
public getAdvantagePercentage(): number {
  const trueCount = this.getTrueCount();
  // Each true count point = ~0.5% advantage
  return trueCount * 0.5;
}
```

**After changes**: Rebuild shared (`cd shared && npm run build`)

### Task 5: Updating User Stats Schema

1. **Modify interface in `/shared/src/types/index.ts`**:
   ```typescript
   export interface UserStats {
     // Existing fields
     cardsPerMinute: number;
     runningCountAccuracy: number;

     // New field
     newMetric: number;  // Add here
   }
   ```

2. **Update default stats in `/backend/src/services/StatsService.ts`**:
   ```typescript
   const defaultStats: UserStats = {
     // ... existing defaults
     newMetric: 0,  // Add default value
   };
   ```

3. **Update UI displays in mobile app** to show new metric

4. **Rebuild shared**: `cd shared && npm run build`

5. **Restart both mobile and backend** to pick up type changes

### Task 6: Integrating with Claude AI

**Location**: `/backend/src/services/CoachService.ts`

**Pattern for adding new AI-powered features**:
```typescript
export class CoachService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async newAIFeature(userId: string, input: string): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `System prompt here.\n\nUser input: ${input}`
      }]
    });

    return message.content[0].type === 'text'
      ? message.content[0].text
      : '';
  }
}
```

**Important**: Always keep API keys server-side. Never expose in mobile app.

---

## Type System and Shared Code

### Understanding the Shared Package

The `/shared` package is the **single source of truth** for:
- Type definitions (interfaces, enums)
- Card counting logic (CardCountingEngine)
- Drill generation logic (DrillEngine)
- Data validation utilities

### Key Types Reference

#### Card Types
```typescript
enum Suit { HEARTS, DIAMONDS, CLUBS, SPADES }
enum Rank { TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE }

interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}
```

#### Counting Systems
```typescript
enum CountingSystem {
  HI_LO = 'hi_lo',          // Beginner: +1, 0, -1
  KO = 'ko',                // Unbalanced
  HI_OPT_I = 'hi_opt_i',    // Intermediate
  HI_OPT_II = 'hi_opt_ii',  // Advanced: multi-level
  OMEGA_II = 'omega_ii',    // Expert: multi-level
  ZEN = 'zen'               // Advanced: balanced multi-level
}
```

#### Learning Phases
```typescript
enum LearningPhase {
  CARD_VALUES = 'card_values',              // Phase 1: Learn card values
  RUNNING_COUNT = 'running_count',          // Phase 2: Maintain running count
  TRUE_COUNT = 'true_count',                // Phase 3: Convert to true count
  BETTING_CORRELATION = 'betting_correlation' // Phase 4: Bet sizing
}
```

#### Game Modes
```typescript
enum GameMode {
  GUIDED_LEARNING = 'guided_learning',      // Free: 4-phase tutorial
  CASINO_SIM_TIER_1 = 'casino_sim_tier_1', // Premium: Empty table
  CASINO_SIM_TIER_2 = 'casino_sim_tier_2', // Premium: Crowded table
  CASINO_SIM_TIER_3 = 'casino_sim_tier_3', // Premium: Pit boss pressure
  CASINO_SIM_TIER_4 = 'casino_sim_tier_4', // Premium: Multi-table
  CASINO_SIM_TIER_5 = 'casino_sim_tier_5', // Premium: Vegas floor test
  PRESSURE_TRAINING = 'pressure_training'   // Premium: Speed/distraction
}
```

#### User Data Structures
```typescript
interface UserStats {
  // Speed metrics
  cardsPerMinute: number;

  // Accuracy metrics
  runningCountAccuracy: number;
  trueCountAccuracy: number;
  betCorrelationScore: number;

  // Progression
  currentPhase: LearningPhase;
  phasesCompleted: LearningPhase[];
  unlockedModes: GameMode[];

  // Performance
  totalSessionsCompleted: number;
  totalCardsProcessed: number;
  averageSessionEV: number;

  // Advanced metrics
  heatScore: number;              // Detectability (lower is better)
  distractionResistance: number;  // 0-100
  multiTableProficiency: number;  // 0-100
}

interface UserSubscription {
  tier: 'free' | 'premium_monthly' | 'premium_yearly';
  active: boolean;
  startDate: Date;
  expiryDate: Date;
  revenueCatId: string;
}

interface GameSession {
  sessionId: string;
  userId: string;
  mode: GameMode;
  countingSystem: CountingSystem;
  startTime: Date;
  endTime: Date;
  results: DrillResult[];
  finalStats: {
    accuracy: number;
    speed: number;
    ev: number;
  };
}
```

### Using CardCountingEngine

```typescript
import { CardCountingEngine, CountingSystem, Rank, Suit } from '@card-counter-ai/shared';

// Create engine with Hi-Lo system and 6 decks
const engine = new CardCountingEngine(CountingSystem.HI_LO, 6);

// Create a shuffled shoe
const shoe = CardCountingEngine.createShoe(6);
CardCountingEngine.shuffleDeck(shoe);

// Count cards
const card1 = { rank: Rank.FIVE, suit: Suit.HEARTS, id: '5H' };
engine.countCard(card1);  // Running count increases

// Get current counts
const runningCount = engine.getRunningCount();  // e.g., 5
const trueCount = engine.getTrueCount();        // e.g., 1 (5 decks remaining)
const betMultiplier = engine.getBetMultiplier(); // e.g., 2x (true count +1)

// Validate user's answer
const userCount = 5;
const isCorrect = engine.validateCount(userCount);
const accuracy = engine.calculateAccuracy(5, 5);  // 100%

// Reset for new shoe
engine.reset();
```

### Using DrillEngine

```typescript
import { DrillEngine, DrillType } from '@card-counter-ai/shared';

// Create drill engine
const drillEngine = new DrillEngine(DrillType.CARD_FLASH, CountingSystem.HI_LO);

// Start a drill session
drillEngine.startDrill();

// Generate a question
const question = drillEngine.generateQuestion();
// Returns: { cards: [...], correctAnswer: number, questionText: string }

// Submit user answer
const result = drillEngine.submitAnswer(userAnswer);
// Returns: { correct: boolean, correctAnswer: number, timeMs: number }

// Get session results
const results = drillEngine.getResults();
// Returns: { accuracy: number, averageTimeMs: number, cardsPerMinute: number }

// Check if target met
const targetMet = drillEngine.isTargetMet();
// Returns: boolean (based on accuracy and speed thresholds)
```

---

## API Integration

### Backend API Endpoints

#### Coach Endpoints (`/api/coach`)

**POST `/api/coach/ask`** - Get coaching advice
```typescript
// Request
{
  userId: string;
  message: string;
  context: {
    currentPhase: LearningPhase;
    currentSystem: CountingSystem;
    recentStats: UserStats;
    sessionHistory: GameSession[];
  };
}

// Response
{
  response: string;
  suggestions: string[];
}
```

**POST `/api/coach/analyze-session`** - Analyze completed session
```typescript
// Request
{
  userId: string;
  session: GameSession;
}

// Response
{
  analysis: string;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}
```

#### Stats Endpoints (`/api/stats`)

**GET `/api/stats/:userId`** - Fetch user statistics
```typescript
// Response
{
  stats: UserStats;
}
```

**POST `/api/stats/:userId`** - Update user statistics
```typescript
// Request
{
  updates: Partial<UserStats>;
}

// Response
{
  stats: UserStats;
}
```

**POST `/api/stats/:userId/session`** - Record completed session
```typescript
// Request
{
  session: GameSession;
}

// Response
{
  stats: UserStats;  // Updated stats after session
  unlocks: GameMode[]; // Any newly unlocked modes
}
```

#### Subscription Endpoints (`/api/subscription`)

**GET `/api/subscription/:userId`** - Get subscription status
```typescript
// Response
{
  subscription: UserSubscription;
  hasAccess: (mode: GameMode) => boolean;
}
```

**POST `/api/subscription/webhook`** - RevenueCat webhook handler
```typescript
// Request (from RevenueCat)
{
  event: {
    type: 'INITIAL_PURCHASE' | 'RENEWAL' | 'CANCELLATION' | 'EXPIRATION';
    app_user_id: string;
    product_id: string;
    // ... more RevenueCat fields
  };
}

// Response
{
  received: boolean;
}
```

### Mobile API Service Usage

```typescript
import { apiService } from '../services/apiService';

// Example: Ask coach for advice
const handleAskCoach = async () => {
  try {
    const userId = useGameStore.getState().userId;
    const context = {
      currentPhase: LearningPhase.CARD_VALUES,
      currentSystem: CountingSystem.HI_LO,
      recentStats: useGameStore.getState().stats,
      sessionHistory: []
    };

    const response = await apiService.askCoach(userId, message, context);
    console.log('Coach says:', response.response);
  } catch (error) {
    console.error('Failed to get coach response:', error);
  }
};

// Example: Record session
const handleSessionComplete = async (session: GameSession) => {
  try {
    const userId = useGameStore.getState().userId;
    const result = await apiService.recordSession(userId, session);

    // Update local state with new stats
    useGameStore.getState().updateStats(result.stats);

    // Check for unlocked modes
    if (result.unlocks.length > 0) {
      Alert.alert('New Mode Unlocked!', `You unlocked: ${result.unlocks.join(', ')}`);
    }
  } catch (error) {
    console.error('Failed to record session:', error);
  }
};
```

---

## Testing Strategy

### Current State
⚠️ **No test files currently exist in the codebase.**

### Planned Testing Approach (from ARCHITECTURE.md)

#### Unit Tests (Planned)
- Card counting logic (`CardCountingEngine`)
- Drill generation algorithms (`DrillEngine`)
- Bet sizing calculations
- Type validation utilities

**Recommended framework**: Jest

**Example test structure**:
```typescript
// /shared/src/engine/__tests__/CardCountingEngine.test.ts
import { CardCountingEngine, CountingSystem, Rank, Suit } from '../CardCountingEngine';

describe('CardCountingEngine', () => {
  it('should calculate correct running count for Hi-Lo', () => {
    const engine = new CardCountingEngine(CountingSystem.HI_LO, 6);

    engine.countCard({ rank: Rank.FIVE, suit: Suit.HEARTS, id: '5H' });  // +1
    engine.countCard({ rank: Rank.KING, suit: Suit.SPADES, id: 'KS' }); // -1

    expect(engine.getRunningCount()).toBe(0);
  });
});
```

#### Integration Tests (Planned)
- API endpoint testing
- Database operations
- External API mocking (Claude, RevenueCat)

**Recommended framework**: Jest + Supertest

#### E2E Tests (Planned)
- Critical user flows
- Subscription purchase flow
- Session completion and sync

**Recommended framework**: Detox (React Native E2E)

### When Adding Tests

1. Create test files adjacent to source files with `.test.ts` or `.spec.ts` extension
2. For shared package: `/shared/src/engine/__tests__/`
3. For backend: `/backend/src/services/__tests__/`
4. For mobile: `/mobile/src/components/__tests__/`
5. Add test scripts to package.json: `"test": "jest"`

---

## Git Workflow

### Branch Naming Convention

When creating new branches for features, use the pattern:
```
claude/<feature-name>-<session-id>
```

**Examples**:
- `claude/card-counter-app-WncUn`
- `claude/claude-md-mkrjctefflz2yd2a-0U1oT` (current branch)

### Commit Message Guidelines

Follow conventional commits format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes

**Examples**:
```
feat(mobile): add Phase 2 running count screen
fix(backend): correct true count calculation in CoachService
docs: update SETUP.md with RevenueCat configuration
refactor(shared): simplify DrillEngine question generation
```

### Pushing Changes

Always push to the designated feature branch:
```bash
git push -u origin claude/<branch-name>
```

**Important**: Branch must start with `claude/` and match the session ID, otherwise push will fail with 403.

### Creating Pull Requests

When work is complete:
1. Ensure all changes are committed
2. Push to feature branch
3. Create PR against `main` branch
4. Use descriptive PR title and body
5. Link any related issues

---

## Important Gotchas

### 1. Shared Package Must Be Built

**Problem**: Changes to `/shared` not reflected in mobile or backend.

**Solution**: Always rebuild after changing shared code:
```bash
cd shared && npm run build
```

**Better**: Use watch mode during development:
```bash
cd shared && npm run watch
```

### 2. Android Emulator Localhost Issues

**Problem**: Android emulator can't connect to `http://localhost:3000`.

**Solution**: Use `10.0.2.2` instead of `localhost` for Android:
```typescript
const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api'
  : 'https://production-api.com/api';
```

### 3. Environment Variables

**Problem**: Backend can't find `ANTHROPIC_API_KEY`.

**Solution**: Ensure `.env` file exists in `/backend/` directory:
```bash
cd backend
cp .env.example .env
# Edit .env with actual API keys
```

**Never commit** `.env` files (already in `.gitignore`).

### 4. TypeScript Strict Mode

**Problem**: Type errors in development.

**Solution**: Project uses strict TypeScript. Always:
- Define proper types/interfaces
- Avoid `any` type
- Handle null/undefined explicitly
- Use type guards when needed

### 5. Monorepo Workspace Issues

**Problem**: `Cannot find module '@card-counter-ai/shared'`.

**Solution**: Ensure all packages are installed:
```bash
npm run install:all
cd shared && npm run build
```

### 6. Port Already in Use

**Problem**: Backend won't start - port 3000 in use.

**Solution**: Either kill the existing process or change port in `.env`:
```env
PORT=3001
```

And update mobile app API URL accordingly.

### 7. Claude API Rate Limits

**Problem**: API calls to Anthropic failing.

**Solution**:
- Implement caching for common questions
- Add retry logic with exponential backoff
- Monitor API usage in Anthropic console
- Consider upgrading API tier if needed

### 8. RevenueCat Webhook Signature Verification

**Problem**: Webhook events not being processed.

**Solution**: Ensure webhook secret is correctly configured:
```env
REVENUECAT_WEBHOOK_SECRET=your_webhook_secret
```

And verify signature in webhook handler (see `/backend/src/services/SubscriptionService.ts`).

### 9. React Native Fast Refresh

**Problem**: Changes not appearing in mobile app.

**Solution**:
- For JS/TS changes: Fast Refresh should work automatically
- For native changes: Rebuild app (`npm run ios` or `npm run android`)
- For type changes: Restart Metro bundler (`r` in terminal)

### 10. Firebase Credentials Format

**Problem**: Firebase private key formatting issues.

**Solution**: Private key must be in `.env` as single-line string with `\n`:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
```

---

## File Reference Guide

### Critical Files to Understand

#### `/shared/src/types/index.ts` (395 lines)
- **All type definitions** for the entire project
- Card types (Suit, Rank, Card)
- Counting systems and configs
- User data structures (UserStats, UserSubscription)
- Session and drill types
- Coach message interfaces

#### `/shared/src/engine/CardCountingEngine.ts` (300+ lines)
- Core card counting logic
- 6 counting system implementations
- Running count maintenance
- True count calculation
- Bet sizing recommendations
- Deck/shoe creation and shuffling

#### `/shared/src/engine/DrillEngine.ts` (250+ lines)
- 8 drill types (card flash, pairs, running count, etc.)
- Question generation algorithms
- Answer validation
- Performance metrics calculation

#### `/mobile/src/store/useGameStore.ts`
- Zustand state management
- User data, stats, session state
- Actions for updating state

#### `/mobile/src/services/apiService.ts`
- Axios HTTP client
- All API endpoint methods
- Request/response handling

#### `/mobile/src/theme/colors.ts`
- Color palette (casino theme)
- Primary, accent, success, error colors
- Card suit colors

#### `/backend/src/index.ts`
- Express app setup
- Middleware registration
- Route mounting
- Server startup

#### `/backend/src/services/CoachService.ts`
- Anthropic Claude integration
- System prompt construction
- Context-aware coaching
- Session analysis

#### `/backend/src/services/StatsService.ts`
- User statistics management
- Session recording and aggregation
- Mode unlock logic
- Cache management

### Configuration Files

#### `package.json` (root)
- Workspace configuration
- Root-level scripts
- Monorepo dependencies

#### `tsconfig.json` (in each package)
- TypeScript compilation settings
- Module resolution
- Strict mode enabled

#### `.gitignore`
- Ignore patterns for dependencies, builds, env files
- Mobile-specific ignores (ios/android build folders)
- IDE and OS files

#### `.env.example` (backend)
- Template for environment variables
- Required API keys and configuration

---

## Quick Command Reference

### Development
```bash
# Install everything
npm run install:all

# Build shared package
cd shared && npm run build

# Start backend (with hot reload)
cd backend && npm run dev

# Start mobile (Expo dev server)
cd mobile && npm start

# Watch shared package
cd shared && npm run watch
```

### Mobile
```bash
cd mobile

npm start           # Start Expo dev server
npm run ios        # Launch iOS simulator
npm run android    # Launch Android emulator
npm run web        # Launch web browser
npm run lint       # Run ESLint
```

### Backend
```bash
cd backend

npm run dev        # Development with Nodemon
npm run build      # Compile TypeScript
npm start          # Run compiled code
npm run clean      # Remove dist/
```

### Shared
```bash
cd shared

npm run build      # Compile TypeScript
npm run watch      # Watch mode (auto-rebuild)
npm run clean      # Remove dist/
```

### Git
```bash
# Create feature branch
git checkout -b claude/<feature-name>-<session-id>

# Stage and commit
git add .
git commit -m "feat(scope): description"

# Push to feature branch
git push -u origin claude/<branch-name>

# Check status
git status
git log --oneline -5
```

---

## Best Practices for AI Assistants

### 1. Always Read Before Modifying
Never propose changes to code you haven't read. Use the `Read` tool to understand existing code before suggesting modifications.

### 2. Follow the Monorepo Pattern
- Changes to types → `/shared/src/types/index.ts`
- Changes to counting logic → `/shared/src/engine/`
- Mobile UI changes → `/mobile/src/`
- API changes → `/backend/src/`

### 3. Maintain Type Safety
- Always import types from `@card-counter-ai/shared`
- Define new types in shared package first
- Rebuild shared after type changes
- Never use `any` unless absolutely necessary

### 4. Respect Separation of Concerns
- Mobile: UI and user interaction only
- Backend: Business logic, external API calls, database
- Shared: Pure TypeScript logic, no dependencies

### 5. Keep It Simple
- Don't over-engineer solutions
- Only make changes that are directly requested
- Avoid premature abstractions
- Don't add unnecessary error handling for impossible scenarios

### 6. Security Awareness
- Never expose API keys in mobile app
- Always keep secrets in backend `.env`
- Validate input on backend
- Use HTTPS in production

### 7. Performance Considerations
- Card counting engine runs locally on mobile (no network latency)
- Cache user stats on backend (5 min TTL)
- Implement pagination for large data sets
- Use React Native Fast Refresh for quick iterations

### 8. Documentation
- Update this file (CLAUDE.md) when adding new patterns
- Update ARCHITECTURE.md for system-level changes
- Update SETUP.md for new setup steps
- Add inline comments for complex logic only

---

## Additional Resources

### Documentation Files
- **README.md** - Project overview, features, quick start
- **ARCHITECTURE.md** - System architecture, scalability, deployment
- **SETUP.md** - Detailed setup instructions, troubleshooting
- **CLAUDE.md** - This file (AI assistant guide)

### External Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [RevenueCat Docs](https://docs.revenuecat.com/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)

### Code Examples
- **Phase 1 Screen**: `/mobile/src/screens/GuidedLearning/Phase1CardValues.tsx`
- **Button Component**: `/mobile/src/components/Button.tsx`
- **Card Component**: `/mobile/src/components/Card.tsx`
- **API Service**: `/mobile/src/services/apiService.ts`
- **Coach Service**: `/backend/src/services/CoachService.ts`

---

## Contact and Support

For questions about the codebase:
1. Review this CLAUDE.md file
2. Check ARCHITECTURE.md for system design
3. Check SETUP.md for development environment
4. Review existing code patterns in similar files
5. Contact repository maintainer if needed

---

**Version**: 1.0.0
**Last Updated**: January 23, 2026
**Maintained By**: Card Counter AI Team

This document should be updated whenever significant changes are made to:
- Project structure
- Development workflows
- Key patterns and conventions
- API contracts
- Type definitions
