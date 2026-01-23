import { Router, Request, Response } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';

const router = Router();
const subscriptionService = new SubscriptionService();

/**
 * GET /api/subscription/:userId
 * Get user subscription status
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const subscription = await subscriptionService.getSubscription(userId);

    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/subscription/webhook
 * Handle RevenueCat webhook events
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // Verify webhook signature (in production)
    // const signature = req.headers['x-revenuecat-signature'];

    await subscriptionService.handleWebhook(event);

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as subscriptionRouter };
