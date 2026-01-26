# Architecture Documentation

## System Overview

Card Counter AI is a **self-contained mobile application** that teaches card counting through progressive skill-building with AI coaching. The app runs entirely on-device with direct API calls - no backend server required.

## Architecture Principles

1. **Self-Contained**: All functionality runs on-device or via direct API calls
2. **Offline-First**: Core drills and game engine work without network
3. **Local Storage**: User progress saved to device via AsyncStorage
4. **Direct AI Integration**: Claude API called directly from the app

## System Components

### 1. Mobile Application (`/mobile`)

**Technology**: React Native + Expo SDK 54
**State Management**: Zustand
**Navigation**: React Navigation (Stack)

**Key Modules**:
- **CardCountingEngine**: Pure TypeScript game logic (from shared package)
- **LocalCoachService**: Direct Anthropic Claude API integration
- **LocalStatsService**: AsyncStorage-based user statistics
- **Theme System**: Consistent casino-aesthetic UI

**Data Flow**:
```
User Interaction → Component → Zustand Store → Local Service
                                    ↓
                               Update UI
```

### 2. Shared Logic (`/shared`)

**Technology**: TypeScript
**Purpose**: Code reuse and type safety

**Contents**:
- Type definitions (cards, stats, sessions)
- CardCountingEngine (all 6 counting systems)
- DrillEngine (question generation, validation)

**Core Engine**:
```typescript
CardCountingEngine
├── Card value calculation (per system)
├── Running count maintenance
├── True count conversion
├── Deck/shoe management
└── Bet sizing recommendations
```

## Data Models

### User Statistics
```typescript
interface UserStats {
  userId: string;
  cardsPerMinute: number;
  runningCountAccuracy: number;
  trueCountAccuracy: number;
  betCorrelationScore: number;
  totalHandsPlayed: number;
  currentPhase: LearningPhase;
  currentSystem: CountingSystem;
  lastUpdated: Date;
}
```

### Counting Systems
```typescript
enum CountingSystem {
  HI_LO = 'hi_lo',          // Beginner
  KO = 'ko',                // Unbalanced
  HI_OPT_I = 'hi_opt_1',    // Intermediate
  HI_OPT_II = 'hi_opt_2',   // Advanced
  OMEGA_II = 'omega_2',     // Expert
  ZEN = 'zen'               // Advanced
}
```

## External Integrations

### Anthropic Claude API
- **Purpose**: AI coaching and personalized feedback
- **Model**: Claude 3.5 Sonnet
- **Integration**: Direct client-side API calls via `LocalCoachService`
- **Configuration**: API key via `EXPO_PUBLIC_ANTHROPIC_API_KEY` environment variable

### AsyncStorage
- **Purpose**: Local data persistence
- **Data Stored**: User stats, progress, preferences
- **Location**: Device-local (not synced across devices)

## Security Considerations

### Current State (Development)
- API key stored in client-side `.env` file
- Suitable for personal use / development

### Production Recommendations
- Use edge function or lightweight proxy to hide API key
- Implement rate limiting on client side
- Consider user authentication if syncing data

## Performance Targets

- Launch time: < 2 seconds
- Card animation: 60 FPS
- Drill response: < 100ms (local)
- AI coach response: < 3s (network dependent)

## Future Enhancements

### Potential Additions
- Cloud sync for cross-device progress
- RevenueCat subscription integration
- Multiplayer/team play simulation
- Additional counting systems
- Enhanced analytics

---

**Last Updated**: January 2026
**Version**: 1.0.0
