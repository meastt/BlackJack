import {
    CoachRequest,
    CoachResponse,
    LearningPhase,
    CountingSystem,
} from '@card-counter-ai/shared';
import { LocalTips } from '../utils/LocalTips';

/**
 * Local coaching service using built-in tips
 * No external API calls - fully self-contained
 */
export class LocalCoachService {
    /**
     * Get coaching response using local tips
     */
    static async getCoachResponse(request: CoachRequest): Promise<CoachResponse> {
        const { context, message } = request;

        // Try to match user question to relevant tip
        const relevantTip = this.findRelevantTip(message, context.currentPhase);

        if (relevantTip) {
            return {
                message: relevantTip.content,
                timestamp: new Date(),
            };
        }

        // Fallback: provide phase-specific guidance
        return {
            message: this.getPhaseGuidance(context.currentPhase),
            timestamp: new Date(),
        };
    }

    /**
     * Analyze a completed session
     */
    static async analyzeSession(userId: string, sessionId: string): Promise<CoachResponse> {
        // Provide general session analysis tips
        return {
            message: `Great work on your session!

Key areas to focus on:
• Accuracy: Aim for 95%+ counting accuracy
• Speed: Practice until you can count comfortably at game pace
• Decision Making: Review any hands where you hesitated
• Bet Sizing: Follow Kelly Criterion to manage bankroll

Tap the ⓘ icons throughout the app for detailed help on specific topics.

Keep practicing! Consistent practice is the key to mastery.`,
            timestamp: new Date(),
            suggestions: [
                'Practice counting speed',
                'Review basic strategy',
                'Master true count conversion',
                'Focus on bet sizing'
            ]
        };
    }

    /**
     * Find relevant tip based on user's question
     */
    private static findRelevantTip(message: string, phase: LearningPhase): any {
        const lowerMessage = message.toLowerCase();

        // Map keywords to tip keys
        const keywordMap: Record<string, string> = {
            'basic strategy': 'phase0',
            'card values': 'phase1',
            'running count': 'phase2',
            'true count': 'phase3',
            'betting': 'phase4',
            'kelly': 'phase4',
            'deviations': 'phase5',
            'illustrious': 'phase5',
            'speed': 'speedDrill',
            'countdown': 'deckCountdown',
            'discard': 'discardTray',
            'simulator': 'simulator',
            'heat': 'heatMeter',
            'legal': 'isItLegal',
            'bankroll': 'bankrollManagement',
            'what is': 'whatIsCardCounting',
        };

        for (const [keyword, tipKey] of Object.entries(keywordMap)) {
            if (lowerMessage.includes(keyword)) {
                return LocalTips.getTip(tipKey);
            }
        }

        // Phase-specific tips
        const phaseTips: Record<LearningPhase, string> = {
            [LearningPhase.CARD_VALUES]: 'phase1',
            [LearningPhase.RUNNING_COUNT]: 'phase2',
            [LearningPhase.TRUE_COUNT]: 'phase3',
            [LearningPhase.BETTING_CORRELATION]: 'phase4',
        };

        return LocalTips.getTip(phaseTips[phase]);
    }

    /**
     * Get phase-specific guidance
     */
    private static getPhaseGuidance(phase: LearningPhase): string {
        const guidance: Record<LearningPhase, string> = {
            [LearningPhase.CARD_VALUES]: `Focus on memorizing card values:
• 2-6 = +1 (low cards)
• 7-9 = 0 (neutral)
• 10-A = -1 (high cards)

Practice until you can instantly identify any card's value without thinking.

Tap the ⓘ icon for detailed explanations of why these values matter.`,

            [LearningPhase.RUNNING_COUNT]: `Keep a running tally of all cards:
• Start at 0 when shoe shuffles
• Add/subtract for each card you see
• Practice until you can count a full deck in under 60 seconds

The running count tells you when the deck favors you.

Tap the ⓘ icon to learn more about running count strategy.`,

            [LearningPhase.TRUE_COUNT]: `Convert running count to true count:
• TC = RC ÷ Decks Remaining
• This adjusts for how much of the shoe is left
• True count is what you base your bets on

Practice estimating decks remaining using the discard tray.

Tap the ⓘ icon for true count examples.`,

            [LearningPhase.BETTING_CORRELATION]: `Size your bets based on true count:
• TC ≤ 1: Min bet (1 unit)
• TC +2: 2 units
• TC +3: 3 units
• TC +4: 4 units
• TC +5+: Max bet (5 units)

This is the Kelly Criterion - optimizes profit while managing risk.

Tap the ⓘ icon for betting strategy details.`,
        };

        return guidance[phase] || 'Keep practicing! Use the info icons (ⓘ) throughout the app for detailed help.';
    }
}
