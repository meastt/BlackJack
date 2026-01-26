
import {
    CoachRequest,
    CoachResponse,
    LearningPhase,
    CountingSystem,
} from '@card-counter-ai/shared';

// TODO: In a real production app, you should not hardcode API keys.
// However, for a self-contained personal app or specific use-case, this is the trade-off.
// Ideally, fetch this from a secure remote config or user input.
const ANTHROPIC_API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export class LocalCoachService {
    /**
     * Get coaching response from Claude Direct API
     */
    static async getCoachResponse(request: CoachRequest): Promise<CoachResponse> {
        if (!ANTHROPIC_API_KEY) {
            console.warn('ANTHROPIC_API_KEY is not set');
            return {
                message: "I can't provide coaching right now because the API key is missing. Please check your configuration.",
                timestamp: new Date()
            };
        }

        const systemPrompt = this.buildSystemPrompt(request);
        const userMessage = request.message;

        try {
            const response = await fetch(ANTHROPIC_API_URL, {
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
                    messages: [
                        {
                            role: 'user',
                            content: userMessage,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Anthropic API Error:', errorData);
                throw new Error('API request failed');
            }

            const data = await response.json();
            const responseText = data.content[0]?.text || '';

            return {
                message: responseText,
                timestamp: new Date(),
            };
        } catch (error) {
            console.error('Error calling Claude API:', error);
            // Fallback response if offline or error
            return {
                message: "I'm having trouble connecting to the coaching servers right now. Please try again later.",
                timestamp: new Date(),
            };
        }
    }

    /**
     * Analyze a completed session
     */
    static async analyzeSession(userId: string, sessionId: string): Promise<CoachResponse> {
        // Note: In local mode, we assume the 'session' data would be passed in, 
        // or we'd fetch it from LocalStatsService. 
        // For this implementation, we'll assume the prompt construction happens here similarly to backend.

        // In a real refactor, we should pass the session data directly to this function
        // rather than just IDs, since we are now client-side.
        // However, to keep API signature compatible-ish, we'll stub it.

        // TODO: Need actual session data here to analyze.

        const analysisPrompt = `Analyze this card counting practice session and provide actionable insights on:
1. Accuracy trends
2. Speed improvements needed
3. Common mistakes
4. Next steps for improvement`;

        return this.getMockAnalysis(); // Fallback for now without actual session data injection
    }

    private static getMockAnalysis(): Promise<CoachResponse> {
        return Promise.resolve({
            message: "Great work on your session! To provide detailed analysis, I'll need to see the specific hands you played. Keep practicing your running count speed.",
            timestamp: new Date(),
            suggestions: ["Practice pairs", "Focus on speed", "Review true count table"]
        });
    }

    /**
     * Build system prompt based on user context
     */
    private static buildSystemPrompt(request: CoachRequest): string {
        const { context } = request;

        let prompt = `You are an expert card counting coach for blackjack. Your role is to teach players how to count cards effectively, from complete beginner to casino-ready.

Current context:
- Learning Phase: ${this.getPhaseDescription(context.currentPhase)}
- Counting System: ${this.getSystemDescription(context.currentSystem)}
`;

        if (context.recentStats) {
            prompt += `\nRecent Performance:`;
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

    private static getPhaseDescription(phase: LearningPhase): string {
        const descriptions = {
            [LearningPhase.CARD_VALUES]: 'Learning card values (Hi-Lo system)',
            [LearningPhase.RUNNING_COUNT]: 'Practicing running count maintenance',
            [LearningPhase.TRUE_COUNT]: 'Learning true count conversion',
            [LearningPhase.BETTING_CORRELATION]: 'Mastering bet sizing based on count',
        };
        return descriptions[phase] || 'Unknown phase';
    }

    private static getSystemDescription(system: CountingSystem): string {
        const descriptions = {
            [CountingSystem.HI_LO]: 'Hi-Lo (beginner-friendly, balanced)',
            [CountingSystem.KO]: 'Knock-Out (unbalanced, no true count)',
            [CountingSystem.HI_OPT_I]: 'Hi-Opt I (intermediate)',
            [CountingSystem.HI_OPT_II]: 'Hi-Opt II (advanced, multi-level)',
            [CountingSystem.OMEGA_II]: 'Omega II (expert, highly accurate)',
            [CountingSystem.ZEN]: 'Zen Count (advanced, balanced)',
        };
        return descriptions[system] || 'Unknown system';
    }
}
