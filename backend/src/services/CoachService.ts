import Anthropic from '@anthropic-ai/sdk';
import {
  CoachRequest,
  CoachResponse,
  LearningPhase,
  CountingSystem,
} from '@card-counter-ai/shared';

export class CoachService {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    this.anthropic = new Anthropic({
      apiKey,
    });
  }

  /**
   * Get coaching response from Claude
   */
  async getCoachResponse(request: CoachRequest): Promise<CoachResponse> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userMessage = request.message;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      return {
        message: responseText,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to get coach response from AI');
    }
  }

  /**
   * Analyze a completed session
   */
  async analyzeSession(userId: string, sessionId: string): Promise<CoachResponse> {
    // In a real implementation, fetch session data from database
    // For now, return a placeholder response

    const analysisPrompt = `Analyze this card counting practice session and provide actionable insights on:
1. Accuracy trends
2. Speed improvements needed
3. Common mistakes
4. Next steps for improvement`;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: this.getAnalysisSystemPrompt(),
        messages: [
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      return {
        message: responseText,
        suggestions: this.extractSuggestions(responseText),
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error analyzing session:', error);
      throw new Error('Failed to analyze session');
    }
  }

  /**
   * Build system prompt based on user context
   */
  private buildSystemPrompt(request: CoachRequest): string {
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

  /**
   * Get system prompt for session analysis
   */
  private getAnalysisSystemPrompt(): string {
    return `You are an expert card counting coach analyzing a practice session. Provide:
1. Clear assessment of performance
2. Specific areas for improvement
3. Actionable next steps
4. Encouragement and motivation

Be direct, insightful, and focused on helping the player improve their skills.`;
  }

  /**
   * Get description of learning phase
   */
  private getPhaseDescription(phase: LearningPhase): string {
    const descriptions = {
      [LearningPhase.CARD_VALUES]: 'Learning card values (Hi-Lo system)',
      [LearningPhase.RUNNING_COUNT]: 'Practicing running count maintenance',
      [LearningPhase.TRUE_COUNT]: 'Learning true count conversion',
      [LearningPhase.BETTING_CORRELATION]: 'Mastering bet sizing based on count',
    };
    return descriptions[phase] || 'Unknown phase';
  }

  /**
   * Get description of counting system
   */
  private getSystemDescription(system: CountingSystem): string {
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

  /**
   * Extract actionable suggestions from response
   */
  private extractSuggestions(responseText: string): string[] {
    // Simple extraction: look for numbered lists or bullet points
    const suggestions: string[] = [];
    const lines = responseText.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^[\d\-\*•]/)) {
        suggestions.push(trimmed.replace(/^[\d\-\*•]\s*/, ''));
      }
    });

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  }
}
