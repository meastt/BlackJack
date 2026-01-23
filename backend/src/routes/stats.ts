import { Router, Request, Response } from 'express';
import { StatsService } from '../services/StatsService';

const router = Router();
const statsService = new StatsService();

/**
 * GET /api/stats/:userId
 * Get user statistics
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const stats = await statsService.getUserStats(userId);

    if (!stats) {
      return res.status(404).json({ error: 'User stats not found' });
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      error: 'Failed to fetch user stats',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/stats/:userId
 * Update user statistics
 */
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const statsUpdate = req.body;

    const updatedStats = await statsService.updateUserStats(userId, statsUpdate);
    res.json(updatedStats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    res.status(500).json({
      error: 'Failed to update user stats',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/stats/:userId/session
 * Record a completed session
 */
router.post('/:userId/session', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const sessionData = req.body;

    const result = await statsService.recordSession(userId, sessionData);
    res.json(result);
  } catch (error) {
    console.error('Error recording session:', error);
    res.status(500).json({
      error: 'Failed to record session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as statsRouter };
