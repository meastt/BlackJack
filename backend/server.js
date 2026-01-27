import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Rate limiting: 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Coach advice endpoint
app.post('/api/coach', limiter, async (req, res) => {
  try {
    const { message, context } = req.body;

    // Validate input
    if (!message || !context) {
      return res.status(400).json({ error: 'Missing required fields: message and context' });
    }

    // Check for API key
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return res.status(500).json({
        error: 'Service not configured',
        message: "Coaching service is not available right now."
      });
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(context);

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: message
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', errorData);
      throw new Error('API request failed');
    }

    const data = await response.json();
    const responseText = data.content[0]?.text || '';

    res.json({
      message: responseText,
      timestamp: new Date(),
      tokensUsed: data.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({
      error: 'Failed to get coaching response',
      message: "I'm having trouble right now. Please try again later.",
      timestamp: new Date()
    });
  }
});

// Session analysis endpoint
app.post('/api/analyze-session', limiter, async (req, res) => {
  try {
    const { userId, sessionData } = req.body;

    if (!userId || !sessionData) {
      return res.status(400).json({ error: 'Missing required fields: userId and sessionData' });
    }

    // Build analysis prompt
    const analysisPrompt = buildSessionAnalysisPrompt(sessionData);

    // Call Anthropic API for analysis
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: 'You are an expert blackjack coach analyzing a practice session.',
        messages: [{
          role: 'user',
          content: analysisPrompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const analysisText = data.content[0]?.text || '';

    res.json({
      message: analysisText,
      timestamp: new Date(),
      suggestions: extractSuggestions(analysisText)
    });

  } catch (error) {
    console.error('Error analyzing session:', error);
    res.status(500).json({
      error: 'Failed to analyze session',
      message: "Session analysis is unavailable right now.",
      timestamp: new Date()
    });
  }
});

// Helper functions
function buildSystemPrompt(context) {
  let prompt = `You are an expert card counting coach for blackjack. Your role is to teach players how to count cards effectively, from complete beginner to casino-ready.

Current context:
- Learning Phase: ${getPhaseDescription(context.currentPhase)}
- Counting System: ${getSystemDescription(context.currentSystem)}`;

  if (context.recentStats) {
    prompt += `\n\nRecent Performance:`;
    if (context.recentStats.runningCountAccuracy !== undefined) {
      prompt += `\n- Running Count Accuracy: ${context.recentStats.runningCountAccuracy.toFixed(1)}%`;
    }
    if (context.recentStats.trueCountAccuracy !== undefined) {
      prompt += `\n- True Count Accuracy: ${context.recentStats.trueCountAccuracy.toFixed(1)}%`;
    }
    if (context.recentStats.cardsPerMinute !== undefined) {
      prompt += `\n- Speed: ${context.recentStats.cardsPerMinute.toFixed(1)} cards/minute`;
    }
  }

  prompt += `\n\nGuidelines:
- Be encouraging but honest about areas needing improvement
- Explain the "why" behind card counting concepts
- Use clear, concise language
- Provide actionable advice
- Reference real casino scenarios when relevant
- Keep responses focused and practical

Answer the user's question with expertise and clarity.`;

  return prompt;
}

function buildSessionAnalysisPrompt(sessionData) {
  return `Analyze this card counting practice session and provide actionable insights:

Session Summary:
- Hands Played: ${sessionData.handsPlayed || 'N/A'}
- Counting Accuracy: ${sessionData.countingAccuracy || 'N/A'}%
- Win Rate: ${sessionData.winRate || 'N/A'}%
- Biggest Win: $${sessionData.biggestWin || 0}
- Biggest Loss: $${sessionData.biggestLoss || 0}
- Net Result: $${sessionData.netResult || 0}

Provide:
1. Overall performance assessment
2. Specific areas for improvement
3. 3-5 actionable next steps
4. Encouragement and motivation`;
}

function getPhaseDescription(phase) {
  const descriptions = {
    'CARD_VALUES': 'Learning card values (Hi-Lo system)',
    'RUNNING_COUNT': 'Practicing running count maintenance',
    'TRUE_COUNT': 'Learning true count conversion',
    'BETTING_CORRELATION': 'Mastering bet sizing based on count',
  };
  return descriptions[phase] || 'Unknown phase';
}

function getSystemDescription(system) {
  const descriptions = {
    'HI_LO': 'Hi-Lo (beginner-friendly, balanced)',
    'KO': 'Knock-Out (unbalanced, no true count)',
    'HI_OPT_I': 'Hi-Opt I (intermediate)',
    'HI_OPT_II': 'Hi-Opt II (advanced, multi-level)',
    'OMEGA_II': 'Omega II (expert, highly accurate)',
    'ZEN': 'Zen Count (advanced, balanced)',
  };
  return descriptions[system] || 'Unknown system';
}

function extractSuggestions(analysisText) {
  // Extract actionable suggestions from analysis text
  const suggestions = [];
  const lines = analysisText.split('\n');

  for (const line of lines) {
    if (line.match(/^[\d\-•]\s+/) && line.length < 100) {
      suggestions.push(line.replace(/^[\d\-•]\s+/, '').trim());
    }
  }

  return suggestions.slice(0, 5); // Return top 5 suggestions
}

// Start server
app.listen(PORT, () => {
  console.log(`Backend proxy server running on port ${PORT}`);
  console.log(`API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
});

export default app;
