# Architecture Documentation

## System Overview

Card Counter AI is a mobile-first application designed to teach card counting through progressive skill-building with AI coaching. The system follows a serverless architecture pattern for scalability and cost efficiency.

## Architecture Principles

1. **Separation of Concerns**: Clear boundaries between mobile, backend, and shared logic
2. **Serverless First**: Stateless functions, auto-scaling, pay-per-use
3. **Security by Design**: API keys server-side, encrypted data, secure webhooks
4. **Progressive Enhancement**: Free tier fully functional, premium adds value
5. **Offline-First Mobile**: Core drills work offline, sync when online

## System Components

### 1. Mobile Application (`/mobile`)

**Technology**: React Native + Expo
**State Management**: Zustand
**Key Features**:
- Cross-platform (iOS, Android)
- Offline drill engine
- Real-time card animations
- Local statistics caching
- RevenueCat SDK integration

**Data Flow**:
```
User Interaction → Component → Store (Zustand) → Local Engine or API
                                      ↓
                                 Update UI
```

**Key Modules**:
- **Drill Engine**: Runs locally for speed drills (no network latency)
- **API Client**: Communicates with backend for coaching, stats sync
- **State Store**: Manages user progress, session data
- **Theme System**: Consistent UI with casino aesthetic

### 2. Backend API (`/backend`)

**Technology**: Node.js + Express
**Deployment**: Serverless (AWS Lambda, Vercel Functions, etc.)
**Key Features**:
- RESTful API design
- Claude AI integration (coaching)
- User stats aggregation
- RevenueCat webhook handling
- Firebase/Firestore integration

**API Architecture**:
```
Mobile App → API Gateway → Express Routes → Services → External APIs
                                                ↓
                                            Database
```

**Services**:
1. **CoachService**: Claude AI integration for personalized coaching
2. **StatsService**: User statistics tracking and aggregation
3. **SubscriptionService**: RevenueCat integration, entitlement checks

**Security Layers**:
- Rate limiting on all endpoints
- JWT authentication (planned)
- API key validation
- Webhook signature verification

### 3. Shared Logic (`/shared`)

**Technology**: TypeScript
**Purpose**: Code reuse between mobile and backend
**Key Features**:
- Type definitions (cards, stats, sessions)
- Counting engine (pure logic)
- Drill generation algorithms
- Validation utilities

**Core Engine**:
```typescript
CardCountingEngine
├── Card value calculation
├── Running count maintenance
├── True count conversion
├── Deck/shoe management
└── Bet sizing recommendations

DrillEngine
├── Question generation
├── Answer validation
├── Performance tracking
└── Difficulty progression
```

## Data Models

### User Data
```typescript
{
  userId: string
  stats: UserStats
  subscription: UserSubscription
  sessions: GameSession[]
  progress: LearningPhase
}
```

### Session Data
```typescript
{
  sessionId: string
  mode: GameMode
  system: CountingSystem
  results: DrillResult[]
  startTime: Date
  endTime: Date
  ev: number
}
```

## External Integrations

### 1. Anthropic Claude API
- **Purpose**: AI coaching and session analysis
- **Model**: Claude 3.5 Sonnet
- **Security**: API key stored server-side only, accessed via proxy
- **Rate Limiting**: Per-user coaching query limits

### 2. RevenueCat
- **Purpose**: Subscription management (iOS & Android)
- **Integration Points**:
  - SDK in mobile app
  - Webhook receiver in backend
  - Entitlement checks
- **Products**:
  - `premium_monthly`: $9.99/month
  - `premium_yearly`: $49.99/year

### 3. Firebase/Firestore
- **Purpose**: User data persistence
- **Collections**:
  - `users`: User profiles and stats
  - `sessions`: Historical session data
  - `subscriptions`: Subscription status (synced from RevenueCat)

## Scalability Considerations

### Mobile App
- **Offline Support**: Core drills run without network
- **Lazy Loading**: Screens loaded on demand
- **Asset Optimization**: Image compression, vector graphics
- **Memory Management**: Card object pooling

### Backend
- **Stateless Functions**: Each request independent
- **Database Indexing**: Query optimization on Firebase
- **Caching Strategy**:
  - User stats cached (5 min TTL)
  - Subscription status cached (1 min TTL)
- **Auto-scaling**: Serverless platform handles traffic spikes

## Security Architecture

### Client (Mobile)
- No API keys stored locally
- Encrypted local storage (user session only)
- Certificate pinning for API calls
- No sensitive business logic exposed

### Backend
- Environment variable secrets
- API rate limiting (100 req/min per user)
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- CORS restrictions

### Data Transit
- HTTPS only (TLS 1.2+)
- Request signing for webhooks
- Token-based authentication (JWT planned)

## Performance Targets

### Mobile App
- Launch time: < 2 seconds
- Card animation: 60 FPS
- Drill response: < 100ms (local)
- API response: < 500ms (network)

### Backend
- API latency: p95 < 300ms
- Coach AI response: p95 < 2s
- Database queries: p95 < 100ms
- Uptime: 99.9%

## Monitoring & Analytics

### Application Metrics
- Session duration
- Drill completion rates
- Accuracy trends over time
- Premium conversion rate

### Technical Metrics
- API response times
- Error rates by endpoint
- Claude API usage costs
- Database query performance

### User Metrics
- Daily active users
- Retention (D1, D7, D30)
- Learning phase progression
- Subscription churn rate

## Deployment Strategy

### Mobile
1. Development: Expo Go app
2. Staging: TestFlight (iOS) + Internal Testing (Android)
3. Production: App Store + Google Play

### Backend
1. Development: Local server (localhost:3000)
2. Staging: Vercel preview deployment
3. Production: Vercel production deployment

### Continuous Integration
- GitHub Actions for automated testing
- Pre-commit hooks for linting
- Automated build on PR merge

## Future Architecture Enhancements

### V2 Improvements
- GraphQL API (replace REST)
- Redis caching layer
- WebSocket for real-time multiplayer
- CDN for static assets
- Advanced analytics pipeline

### Advanced Features
- Team play simulation (multi-user sessions)
- Live dealer video integration
- ML-based personalized training paths
- Shuffle tracking simulation

## Development Workflow

```
1. Feature branch creation
2. Local development with hot reload
3. Shared types updated (if needed)
4. Backend API changes (if needed)
5. Mobile UI implementation
6. Testing on simulator/device
7. Code review
8. Merge to main
9. Automated deployment
```

## Testing Strategy

### Unit Tests
- Card counting logic
- Drill generation algorithms
- Bet sizing calculations

### Integration Tests
- API endpoint testing
- Database operations
- External API mocking

### E2E Tests
- Critical user flows
- Subscription purchase flow
- Session completion and sync

## Cost Optimization

### Infrastructure
- Serverless: Pay only for actual usage
- Firebase: Free tier covers small user base
- Claude API: Caching common questions

### Development
- Expo: Free tier for builds
- RevenueCat: Free up to $10k MRR
- GitHub: Free for private repos

---

**Last Updated**: January 2026
**Version**: 1.0.0
