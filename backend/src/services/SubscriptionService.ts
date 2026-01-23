import { UserSubscription, SubscriptionTier, GameMode } from '@card-counter-ai/shared';

// In-memory cache (use Firebase/Firestore in production)
const subscriptionCache = new Map<string, UserSubscription>();

export class SubscriptionService {
  /**
   * Get user subscription status
   */
  async getSubscription(userId: string): Promise<UserSubscription> {
    if (subscriptionCache.has(userId)) {
      return subscriptionCache.get(userId)!;
    }

    // Return default free tier for new users
    return this.createDefaultSubscription(userId);
  }

  /**
   * Handle RevenueCat webhook events
   */
  async handleWebhook(event: any): Promise<void> {
    const { type, app_user_id, product_id } = event;

    switch (type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
        await this.activateSubscription(app_user_id, product_id);
        break;

      case 'CANCELLATION':
      case 'EXPIRATION':
        await this.deactivateSubscription(app_user_id);
        break;

      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }
  }

  /**
   * Activate a subscription
   */
  private async activateSubscription(
    userId: string,
    productId: string
  ): Promise<void> {
    const tier = this.getTierFromProductId(productId);

    const subscription: UserSubscription = {
      userId,
      tier,
      startDate: new Date(),
      isActive: true,
      revenueCatId: productId,
    };

    subscriptionCache.set(userId, subscription);
  }

  /**
   * Deactivate a subscription
   */
  private async deactivateSubscription(userId: string): Promise<void> {
    const current = await this.getSubscription(userId);

    const updated: UserSubscription = {
      ...current,
      isActive: false,
      endDate: new Date(),
      tier: SubscriptionTier.FREE,
    };

    subscriptionCache.set(userId, updated);
  }

  /**
   * Create default free subscription
   */
  private createDefaultSubscription(userId: string): UserSubscription {
    return {
      userId,
      tier: SubscriptionTier.FREE,
      startDate: new Date(),
      isActive: true,
    };
  }

  /**
   * Map product ID to subscription tier
   */
  private getTierFromProductId(productId: string): SubscriptionTier {
    if (productId.includes('monthly')) {
      return SubscriptionTier.PREMIUM_MONTHLY;
    }
    if (productId.includes('yearly')) {
      return SubscriptionTier.PREMIUM_YEARLY;
    }
    return SubscriptionTier.FREE;
  }

  /**
   * Check if user has access to a game mode
   */
  async hasAccessToMode(userId: string, mode: GameMode): Promise<boolean> {
    const subscription = await this.getSubscription(userId);

    // Free modes
    if (mode === GameMode.GUIDED_LEARNING) {
      return true;
    }

    // Premium modes require active subscription
    return subscription.isActive && subscription.tier !== SubscriptionTier.FREE;
  }
}
