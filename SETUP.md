# Setup Guide

Complete setup instructions for Card Counter AI development environment.

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher ([download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Mobile Development
- **Expo CLI**: Install globally
  ```bash
  npm install -g expo-cli
  ```

- **iOS Development** (Mac only):
  - Xcode 14+ from App Store
  - Xcode Command Line Tools: `xcode-select --install`
  - iOS Simulator

- **Android Development**:
  - Android Studio
  - Android SDK (API 33+)
  - Android Emulator or physical device

### API Keys & Services

You'll need accounts and API keys for:

1. **Anthropic** (Claude AI)
   - Sign up at https://console.anthropic.com/
   - Create an API key
   - Pricing: ~$0.002-0.015 per request

2. **Firebase** (Database)
   - Create project at https://console.firebase.google.com/
   - Enable Firestore Database
   - Download service account credentials

3. **RevenueCat** (Subscriptions)
   - Sign up at https://www.revenuecat.com/
   - Create a project
   - Get API keys for iOS and Android

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/meastt/BlackJack.git
cd BlackJack
```

### 2. Install Dependencies

Install all dependencies for monorepo:

```bash
npm run install:all
```

Or install individually:

```bash
# Root dependencies
npm install

# Shared package
cd shared
npm install
cd ..

# Backend
cd backend
npm install
cd ..

# Mobile
cd mobile
npm install
cd ..
```

### 3. Build Shared Package

The shared package must be built before running mobile or backend:

```bash
cd shared
npm run build
cd ..
```

**Note**: Rebuild shared package whenever you modify types or engine logic:
```bash
cd shared
npm run build
```

Or use watch mode during development:
```bash
cd shared
npm run watch
```

## Backend Setup

### 1. Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Anthropic API (Claude)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Firebase (for user data storage)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# RevenueCat
REVENUECAT_API_KEY=your_revenuecat_api_key
REVENUECAT_WEBHOOK_SECRET=your_webhook_secret

# Security
JWT_SECRET=your-random-secret-string-here
API_RATE_LIMIT=100
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate new private key
6. Copy credentials to `.env` file

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

Server should start on http://localhost:3000

Test health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-23T12:00:00.000Z"
}
```

## Mobile App Setup

### 1. Configure API Endpoint

Edit `mobile/src/services/apiService.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'  // For iOS simulator
  // ? 'http://10.0.2.2:3000/api' // For Android emulator
  : 'https://your-production-api.com/api';
```

### 2. RevenueCat Setup (Optional for development)

1. Create RevenueCat project
2. Add iOS and Android apps
3. Configure products:
   - `premium_monthly` - $9.99/month
   - `premium_yearly` - $49.99/year
4. Add SDK keys to mobile app config

### 3. Start Mobile App

```bash
cd mobile
npm start
```

This opens Expo Dev Tools. From there:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

### 4. Running on Physical Device

**iOS** (requires Mac):
```bash
cd mobile
npm run ios
```

**Android**:
```bash
cd mobile
npm run android
```

## Development Workflow

### Terminal Setup

Recommended: Use 3 terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Shared (watch mode):**
```bash
cd shared
npm run watch
```

**Terminal 3 - Mobile:**
```bash
cd mobile
npm start
```

### Hot Reload

- **Mobile**: Fast Refresh enabled by default (automatic)
- **Backend**: Nodemon watches for changes (automatic)
- **Shared**: Watch mode rebuilds on save (automatic)

## Testing the Setup

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Test coach endpoint (requires valid userId)
curl -X POST http://localhost:3000/api/coach/ask \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "message": "How do I count cards?",
    "context": {
      "currentPhase": "card_values",
      "currentSystem": "hi_lo",
      "recentStats": {},
      "sessionHistory": []
    }
  }'
```

### 2. Test Mobile App

1. Launch app in simulator/emulator
2. Navigate to "Guided Learning"
3. Start Phase 1: Card Values
4. Try answering a few questions
5. Check accuracy tracking

### 3. Test AI Coach Integration

1. In mobile app, tap "Ask Coach" button
2. Type a question like "What is Hi-Lo counting?"
3. Verify response from Claude AI appears

## Common Issues & Solutions

### Issue: "Cannot find module '@card-counter-ai/shared'"

**Solution**: Build the shared package
```bash
cd shared
npm run build
```

### Issue: "ANTHROPIC_API_KEY is not set"

**Solution**: Add API key to `backend/.env`
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Issue: Backend not accessible from Android emulator

**Solution**: Use `10.0.2.2` instead of `localhost`
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

### Issue: iOS simulator can't connect to backend

**Solution**: Ensure backend is running and using `localhost`
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Issue: "Expo command not found"

**Solution**: Install Expo CLI globally
```bash
npm install -g expo-cli
```

### Issue: Port 3000 already in use

**Solution**: Change port in `backend/.env`
```env
PORT=3001
```

And update mobile app API URL accordingly.

## VS Code Setup (Recommended)

### Extensions
- ESLint
- Prettier
- React Native Tools
- TypeScript Importer
- GitLens

### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Next Steps

After successful setup:

1. **Explore the codebase**:
   - Review `/shared/src/types` for data models
   - Check `/shared/src/engine` for counting logic
   - Look at `/mobile/src/screens` for UI components

2. **Run through learning phases**:
   - Complete Phase 1: Card Values
   - Test accuracy tracking
   - Try asking the AI coach questions

3. **Make your first change**:
   - Modify a UI component
   - Add a new drill type
   - Extend the counting engine

4. **Read the docs**:
   - `README.md` for project overview
   - `ARCHITECTURE.md` for system design
   - API docs in each route file

## Support

For issues or questions:
- Check existing GitHub issues
- Review architecture documentation
- Contact repository maintainer

---

**Happy Coding! 🃏**
