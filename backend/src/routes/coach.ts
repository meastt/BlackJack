import { Router, Request, Response } from 'express';
import { CoachService } from '../services/CoachService';
import { CoachRequest } from '@card-counter-ai/shared';

const router = Router();
const coachService = new CoachService();

/**
 * POST /api/coach/ask
 * Get coaching advice from Claude AI
 */
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const coachRequest: CoachRequest = req.body;

    // Validate request
    if (!coachRequest.userId || !coachRequest.message) {
      return res.status(400).json({
        error: 'Missing required fields: userId and message',
      });
    }

    // Get response from Coach AI
    const response = await coachService.getCoachResponse(coachRequest);

    res.json(response);
  } catch (error) {
    console.error('Error in coach endpoint:', error);
    res.status(500).json({
      error: 'Failed to get coach response',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/coach/analyze-session
 * Analyze a completed session and provide insights
 */
router.post('/analyze-session', async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields: userId and sessionId',
      });
    }

    const analysis = await coachService.analyzeSession(userId, sessionId);

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing session:', error);
    res.status(500).json({
      error: 'Failed to analyze session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as coachRouter };
