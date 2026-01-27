# Backend Proxy Setup Guide

## Security Issue

**Current Implementation**: The mobile app directly calls the Anthropic API with an API key stored in the client (`EXPO_PUBLIC_ANTHROPIC_API_KEY`).

**Problem**: API keys in client-side apps can be easily extracted from the app bundle (APK/IPA), leading to:
- Unauthorized API usage
- Unexpected costs
- Rate limit exhaustion
- Security vulnerabilities

**Solution**: Create a backend proxy server that handles API calls securely.

---

## Architecture

```
[Mobile App] --> [Backend Proxy] --> [Anthropic API]
     (No API Key)     (Has API Key)      (Secure)
```

### Benefits:
- ✅ API key stays on server (never in app bundle)
- ✅ Can implement rate limiting per user
- ✅ Can add authentication/authorization
- ✅ Can monitor usage and costs
- ✅ Can cache responses to reduce costs
- ✅ Can implement fallback logic

---

## Implementation Steps

### 1. Create Backend Server

Choose a backend platform:
- **Recommended**: Vercel/Netlify Edge Functions (serverless, easy to deploy)
- **Alternative**: Express.js on Railway/Heroku
- **Advanced**: AWS Lambda + API Gateway

### 2. Backend Code Example (Node.js/Express)

Create `/backend/server.js`:

```javascript
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

// API key stored as environment variable on server
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Rate limiting: 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.'
});

app.use('/api/coach', limiter);

// Coach advice endpoint
app.post('/api/coach', async (req, res) => {
  try {
    const { message, context } = req.body;

    // Validate input
    if (!message || !context) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(context);

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: message
      }]
    });

    const responseText = response.content[0]?.text || '';

    res.json({
      message: responseText,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Anthropic API Error:', error);
    res.status(500).json({
      error: 'Failed to get coaching response',
      message: "I'm having trouble right now. Please try again later."
    });
  }
});

function buildSystemPrompt(context) {
  return `You are an expert card counting coach for blackjack...
Current context:
- Learning Phase: ${context.currentPhase}
- Counting System: ${context.currentSystem}

Guidelines:
- Be encouraging but honest
- Provide actionable advice
- Keep responses focused and practical`;
}

app.listen(3000, () => {
  console.log('Backend proxy running on port 3000');
});
```

### 3. Deploy Backend

**Vercel (Recommended)**:
```bash
cd backend
npm init -y
npm install express @anthropic-ai/sdk express-rate-limit
npm install -D vercel

# Create vercel.json
echo '{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/server.js" }],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key"
  }
}' > vercel.json

# Deploy
vercel --prod

# Add secret
vercel secrets add anthropic-api-key "your-api-key-here"
```

### 4. Update Mobile App

Update `/mobile/src/services/localCoachService.ts`:

```typescript
// Remove direct API key
// const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';

// Use backend proxy URL
const BACKEND_PROXY_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export class LocalCoachService {
    static async getCoachResponse(request: CoachRequest): Promise<CoachResponse> {
        try {
            const response = await fetch(`${BACKEND_PROXY_URL}/api/coach`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: request.message,
                    context: request.context
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return {
                message: data.message,
                timestamp: new Date(data.timestamp),
            };
        } catch (error) {
            console.error('Error calling backend proxy:', error);
            return {
                message: "I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
            };
        }
    }
}
```

### 5. Environment Configuration

Update `/mobile/.env`:
```bash
# Remove client-side API key
# EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-...

# Add backend proxy URL
EXPO_PUBLIC_BACKEND_URL=https://your-backend.vercel.app
```

---

## Advanced Features

### Authentication

Add user authentication to prevent abuse:

```javascript
import jwt from 'jsonwebtoken';

// Middleware to verify user token
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.use('/api/coach', authenticateUser, limiter);
```

### Caching

Cache common responses to reduce API costs:

```javascript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

app.post('/api/coach', async (req, res) => {
  const cacheKey = `${req.body.message}_${req.body.context.currentPhase}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // Call API...
  const response = await anthropic.messages.create({...});

  // Cache response
  cache.set(cacheKey, response);

  res.json(response);
});
```

### Usage Tracking

Track API usage per user:

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.post('/api/coach', async (req, res) => {
  // Track usage
  await prisma.apiUsage.create({
    data: {
      userId: req.userId,
      endpoint: '/api/coach',
      timestamp: new Date(),
      tokensUsed: response.usage?.total_tokens || 0
    }
  });

  // Check user quota
  const usage = await prisma.apiUsage.count({
    where: {
      userId: req.userId,
      timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
  });

  if (usage > 50) {
    return res.status(429).json({
      error: 'Daily quota exceeded',
      message: 'You\'ve reached your daily coaching limit. Please try again tomorrow.'
    });
  }

  // Proceed with API call...
});
```

---

## Cost Management

### Estimated Costs (Anthropic Claude 3.5 Sonnet)
- Input: $3.00 per 1M tokens
- Output: $15.00 per 1M tokens

**Average coaching request**:
- Input: ~500 tokens (system prompt + user message)
- Output: ~300 tokens (response)
- Cost per request: ~$0.0060

**Monthly estimates**:
- 100 users × 10 requests/day = 30,000 requests/month
- Cost: ~$180/month

### Cost Reduction Strategies:
1. **Cache common questions** (50% cost reduction)
2. **Use smaller model for simple queries** (Claude 3 Haiku: 80% cheaper)
3. **Implement daily user quotas** (prevent abuse)
4. **Compress system prompts** (reduce input tokens)

---

## Security Checklist

Before going to production:

- [ ] API key stored as environment variable on server (never in code)
- [ ] Rate limiting implemented (per IP and per user)
- [ ] User authentication required for API access
- [ ] Input validation on all endpoints
- [ ] CORS configured to only allow your app domain
- [ ] HTTPS enforced (no HTTP)
- [ ] Error messages don't leak sensitive info
- [ ] Usage monitoring and alerting set up
- [ ] Daily cost alerts configured
- [ ] API key rotation policy in place

---

## Migration Checklist

- [ ] Create backend server with proxy endpoints
- [ ] Deploy backend to production
- [ ] Test backend endpoints with Postman/curl
- [ ] Update mobile app to use backend proxy
- [ ] Remove API key from mobile .env file
- [ ] Test mobile app with new backend
- [ ] Monitor API usage and costs
- [ ] Set up alerts for high usage

---

## Testing

Test the backend locally:

```bash
# Start backend
cd backend
npm install
ANTHROPIC_API_KEY=sk-... node server.js

# Test with curl
curl -X POST http://localhost:3000/api/coach \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I improve my running count speed?",
    "context": {
      "currentPhase": "RUNNING_COUNT",
      "currentSystem": "HI_LO",
      "recentStats": {
        "runningCountAccuracy": 85.5,
        "cardsPerMinute": 45
      }
    }
  }'
```

---

## Troubleshooting

**Backend returns 500 error**:
- Check `ANTHROPIC_API_KEY` is set correctly
- Check Anthropic API status: https://status.anthropic.com
- Review server logs for detailed error

**Mobile app can't connect to backend**:
- Verify `EXPO_PUBLIC_BACKEND_URL` is set correctly
- Check CORS configuration on backend
- Test backend URL in browser/Postman first

**Rate limit errors**:
- Increase rate limit in `limiter` configuration
- Implement per-user rate limiting instead of per-IP
- Add caching to reduce duplicate requests

---

## Next Steps

1. Choose deployment platform (Vercel recommended)
2. Create backend server with coach endpoint
3. Deploy and test backend
4. Update mobile app to use backend
5. Remove API key from mobile environment
6. Monitor usage and costs
7. Implement authentication (if needed)
8. Add caching for cost optimization
