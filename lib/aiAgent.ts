/**
 * Unified n8n AI Agent Client
 * All AI-related requests go through a single endpoint with Bearer token authentication
 */

interface AIAgentRequest {
  prompt: string;
  context?: any;
  task?: string; // Optional task identifier for routing within n8n
}

interface AIAgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

interface AIAgentOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class AIAgent {
  private baseTimeout = 60000; // 60 seconds for AI operations
  private defaultRetries = 2;
  private defaultRetryDelay = 1000; // 1 second

  /**
   * Get the n8n AI Agent URL from settings or environment
   */
  private async getAgentUrl(): Promise<string | undefined> {
    try {
      const { getSettingsServer } = await import("@/lib/settings");
      const settings = await getSettingsServer();
      return settings.n8n_agent_url || process.env.N8N_AGENT_URL;
    } catch {
      return process.env.N8N_AGENT_URL;
    }
  }

  /**
   * Get the n8n AI Agent token from settings or environment
   */
  private async getAgentToken(): Promise<string | undefined> {
    try {
      const { getSettingsServer } = await import("@/lib/settings");
      const settings = await getSettingsServer();
      return settings.n8n_agent_token || process.env.N8N_AGENT_TOKEN;
    } catch {
      return process.env.N8N_AGENT_TOKEN;
    }
  }

  /**
   * Send request to n8n AI Agent
   */
  async call(
    request: AIAgentRequest,
    options: AIAgentOptions = {}
  ): Promise<AIAgentResponse> {
    const {
      timeout = this.baseTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
    } = options;

    // Get URL and token
    const agentUrl = await this.getAgentUrl();
    const agentToken = await this.getAgentToken();

    if (!agentUrl || !agentUrl.trim()) {
      return {
        success: false,
        error: "N8N_AGENT_URL is not configured. Please set it in environment variables or admin settings.",
      };
    }

    if (!agentToken || !agentToken.trim()) {
      return {
        success: false,
        error: "N8N_AGENT_TOKEN is not configured. Please set it in environment variables or admin settings.",
      };
    }

    let lastError: Error | null = null;

    // Retry mechanism
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(agentUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${agentToken}`,
            "User-Agent": "trendCRM/1.0",
          },
          body: JSON.stringify({
            prompt: request.prompt,
            context: request.context || {},
            task: request.task,
            metadata: {
              timestamp: new Date().toISOString(),
              source: "trendcrm",
              version: "1.0",
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `n8n AI Agent error (${response.status}): ${errorText}`
          );
        }

        const data = await response.json();

        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } catch (error: any) {
        lastError = error;

        // Don't retry on last attempt
        if (attempt < retries) {
          await this.sleep(retryDelay * attempt); // Exponential backoff
        }

        // Handle abort error
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "n8n AI Agent timeout - request took too long",
            statusCode: 408,
          };
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || "n8n AI Agent request failed",
    };
  }

  /**
   * Check if AI Agent is configured
   */
  async isReady(): Promise<boolean> {
    const url = await this.getAgentUrl();
    const token = await this.getAgentToken();
    return !!(url && token);
  }

  /**
   * Health check for AI Agent
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.call({
        prompt: "health_check",
        task: "health_check",
      });
      return response.success;
    } catch {
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const aiAgent = new AIAgent();

// Helper function to format prompts for different tasks
export function formatPrompt(
  task: string,
  data: any
): { prompt: string; context: any } {
  switch (task) {
    case "analyze_trends":
      return {
        prompt: `Analyze trends for ${data.sector || "the sector"}. ${data.question || "Provide trend recommendations."}`,
        context: {
          sector: data.sector,
          question: data.question,
          ...data.context,
        },
      };

    case "analyze_instagram_account":
      return {
        prompt: `Analyze Instagram account @${data.username} with ${data.followers} followers and ${data.posts} posts. Sector: ${data.sector || "General"}. Goal: ${data.goal || "Growth"}. Provide detailed recommendations.`,
        context: {
          username: data.username,
          followers: data.followers,
          posts: data.posts,
          engagement: data.engagement,
          sector: data.sector,
          goal: data.goal,
        },
      };

    case "generate_caption":
      return {
        prompt: `Generate an Instagram caption for: "${data.content}". Tone: ${data.tone || "professional"}. Sector: ${data.sector || "General"}.`,
        context: {
          content: data.content,
          tone: data.tone,
          sector: data.sector,
        },
      };

    case "suggest_hashtags":
      return {
        prompt: `Suggest ${data.count || 10} relevant hashtags for: "${data.content}". Sector: ${data.sector || "General"}.`,
        context: {
          content: data.content,
          sector: data.sector,
          count: data.count,
        },
      };

    case "analyze_sentiment":
      return {
        prompt: `Analyze the sentiment of this text: "${data.text}". Return sentiment (positive/neutral/negative), score (0-1), and confidence (0-1).`,
        context: {
          text: data.text,
        },
      };

    case "analyze_report":
      return {
        prompt: `Analyze this report data for period: ${data.period}. Provide summary, insights, and recommendations.`,
        context: {
          metrics: data.metrics,
          period: data.period,
          accountData: data.accountData,
        },
      };

    case "suggest_campaign":
      return {
        prompt: `Suggest a campaign strategy. Goal: ${data.goal}. Budget: ${data.budget}. Target: ${data.targetAudience}. Sector: ${data.sector || "General"}. Duration: ${data.duration || 30} days.`,
        context: {
          goal: data.goal,
          budget: data.budget,
          targetAudience: data.targetAudience,
          sector: data.sector,
          duration: data.duration,
        },
      };

    case "summarize_text":
      return {
        prompt: `Summarize this text in maximum ${data.maxLength || 200} characters: "${data.text}"`,
        context: {
          text: data.text,
          maxLength: data.maxLength,
        },
      };

    case "generate_text":
      return {
        prompt: data.prompt,
        context: {
          maxTokens: data.maxTokens,
          temperature: data.temperature,
        },
      };

    case "analyze_competitor":
      return {
        prompt: `Compare and analyze competitor accounts. Your account: @${data.yourAccount?.username || "unknown"}. Competitors: ${data.competitorAccounts?.map((c: any) => `@${c.username}`).join(", ") || "none"}. Provide detailed comparison and recommendations.`,
        context: {
          yourAccount: data.yourAccount,
          competitorAccounts: data.competitorAccounts,
        },
      };

    default:
      return {
        prompt: typeof data === "string" ? data : JSON.stringify(data),
        context: typeof data === "object" ? data : {},
      };
  }
}







