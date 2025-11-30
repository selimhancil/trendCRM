/**
 * AI Service Layer
 * Tüm AI işlemleri unified n8n AI Agent üzerinden yapılır
 */

import { aiAgent, formatPrompt } from "./aiAgent";

interface AIAnalysisOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

interface AITrendRequest {
  sector?: string;
  question?: string;
  context?: any;
}

interface AITrendResponse {
  trends: Array<{
    title: string;
    description: string;
    category: string;
    tags: string[];
    recommendation?: string;
  }>;
  aiRecommendation: string;
  insights?: string[];
}

class AIService {
  /**
   * AI servisi yapılandırılmış mı kontrol et
   * Unified n8n AI Agent URL ve Token kontrol edilir
   */
  async isReady(): Promise<boolean> {
    return await aiAgent.isReady();
  }

  /**
   * Trend analizi için AI çağrısı yap (unified n8n AI Agent üzerinden)
   */
  async analyzeTrends(
    request: AITrendRequest,
    options: AIAnalysisOptions = {}
  ): Promise<AITrendResponse> {
    try {
      const { prompt, context } = formatPrompt("analyze_trends", {
        sector: request.sector,
        question: request.question,
        context: {
          ...request.context,
          options: {
            model: options.model,
            temperature: options.temperature,
            maxTokens: options.maxTokens,
            systemPrompt: options.systemPrompt,
          },
        },
      });

      const response = await aiAgent.call({
        prompt,
        context,
        task: "analyze_trends",
      });

      if (response.success && response.data) {
        // n8n'den gelen veriyi formatla
        if (response.data.trends && response.data.aiRecommendation) {
          return response.data as AITrendResponse;
        }
        // Eğer n8n farklı formatta döndürdüyse, formatla
        return this.formatTrendResponse(response.data, request);
      }

      throw new Error(response.error || "n8n AI Agent yanıt vermedi");
    } catch (error: any) {
      console.error("AI Service Error:", error);
      // Fallback response
      return {
        trends: [
          {
            title: `${request.sector || "Sektörünüz"} İçin Trend Önerisi`,
            description: `${request.question || request.sector} için AI destekli trend önerileri.`,
            category: request.sector || "Genel",
            tags: [request.sector?.toLowerCase() || "trend"],
          },
        ],
        aiRecommendation: `${request.sector || "Sektörünüz"} için güncel trend önerileri hazırlanıyor...`,
      };
    }
  }

  /**
   * Instagram hesap analizi için AI önerisi (unified n8n AI Agent üzerinden)
   */
  async analyzeInstagramAccount(
    accountData: {
      username: string;
      followers: number;
      posts: number;
      engagement?: string;
      sector?: string;
      goal?: string;
    },
    options: AIAnalysisOptions = {}
  ): Promise<{
    recommendation: string;
    detailedAnalysis?: {
      contentStrategy: string;
      postingSchedule: string;
      hashtagStrategy: string;
      audienceInsights: string;
      improvementAreas: string[];
      competitiveAdvantage: string;
    };
  }> {
    try {
      const { prompt, context } = formatPrompt("analyze_instagram_account", accountData);

      const response = await aiAgent.call({
        prompt,
        context,
        task: "analyze_instagram_account",
      });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error || "n8n AI Agent yanıt vermedi");
    } catch (error: any) {
      console.error("AI Instagram analysis error:", error);
      // Fallback response
      return {
        recommendation: `${accountData.sector || "Sektörünüz"} sektöründe ${accountData.goal || "hedefiniz"} için öneriler: Düzenli içerik paylaşımı yapın, sektörünüze özel hashtag'ler kullanın, etkileşim oranınızı artırmak için sorular sorun ve topluluk oluşturun.`,
      };
    }
  }

  /**
   * AI yanıtını formatla
   */
  private formatTrendResponse(
    aiResponse: any,
    request: AITrendRequest
  ): AITrendResponse {
    const trends = Array.isArray(aiResponse.trends)
      ? aiResponse.trends
      : [];

    return {
      trends: trends.map((trend: any) => ({
        title: trend.title || "Trend İçerik",
        description: trend.description || "",
        category: trend.category || request.sector || "Genel",
        tags: Array.isArray(trend.tags) ? trend.tags : [],
        recommendation: trend.recommendation,
      })),
      aiRecommendation:
        aiResponse.aiRecommendation ||
        `${request.sector || "Sektörünüz"} için güncel trend önerileri sunulmuştur.`,
      insights: Array.isArray(aiResponse.insights)
        ? aiResponse.insights
        : undefined,
    };
  }

  /**
   * Metin özetleme (unified n8n AI Agent üzerinden)
   */
  async summarizeText(text: string, maxLength: number = 200): Promise<string> {
    try {
      const { prompt, context } = formatPrompt("summarize_text", {
        text,
        maxLength,
      });

      const response = await aiAgent.call({
        prompt,
        context,
        task: "summarize_text",
      });

      if (response.success && response.data) {
        return typeof response.data === "string" 
          ? response.data 
          : response.data.summary || response.data.text || text.substring(0, maxLength) + "...";
      }

      // Fallback
      return text.substring(0, maxLength) + "...";
    } catch (error) {
      console.error("Summarize text error:", error);
      return text.substring(0, maxLength) + "...";
    }
  }

  /**
   * Hashtag önerisi (unified n8n AI Agent üzerinden)
   */
  async suggestHashtags(
    content: string,
    sector?: string,
    count: number = 10
  ): Promise<string[]> {
    try {
      const { prompt, context } = formatPrompt("suggest_hashtags", {
        content,
        sector,
        count,
      });

      const response = await aiAgent.call({
        prompt,
        context,
        task: "suggest_hashtags",
      });

      if (response.success && response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        }
        if (response.data.hashtags && Array.isArray(response.data.hashtags)) {
          return response.data.hashtags;
        }
        if (typeof response.data === "string") {
          return response.data
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .slice(0, count);
        }
      }

      return [];
    } catch (error) {
      console.error("Suggest hashtags error:", error);
      return [];
    }
  }

  /**
   * Yorum sentiment analizi (unified n8n AI Agent üzerinden)
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: "positive" | "neutral" | "negative";
    score: number;
    confidence: number;
  }> {
    try {
      const { prompt, context } = formatPrompt("analyze_sentiment", {
        text,
      });

      const response = await aiAgent.call({
        prompt,
        context,
        task: "analyze_sentiment",
      });

      if (response.success && response.data) {
        const data = response.data;
        return {
          sentiment: data.sentiment || "neutral",
          score: data.score || 0.5,
          confidence: data.confidence || 0.5,
        };
      }

      // Fallback: Basit keyword-based analiz
      return this.fallbackSentimentAnalysis(text);
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      return this.fallbackSentimentAnalysis(text);
    }
  }

  /**
   * Fallback sentiment analizi (AI yoksa)
   */
  private fallbackSentimentAnalysis(text: string): {
    sentiment: "positive" | "neutral" | "negative";
    score: number;
    confidence: number;
  } {
    const positiveWords = ["harika", "mükemmel", "güzel", "beğendim", "teşekkür", "tavsiye"];
    const negativeWords = ["kötü", "berbat", "memnun değilim", "şikayet", "iade"];
    const lowerText = text.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      return { sentiment: "positive", score: 0.7, confidence: 0.6 };
    } else if (negativeCount > positiveCount) {
      return { sentiment: "negative", score: 0.3, confidence: 0.6 };
    }
    return { sentiment: "neutral", score: 0.5, confidence: 0.5 };
  }

  /**
   * Rapor analizi ve öneriler (unified n8n AI Agent üzerinden)
   */
  async analyzeReport(data: {
    metrics: any;
    period: string;
    accountData?: any;
  }): Promise<{
    summary: string;
    insights: string[];
    recommendations: Array<{
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
    }>;
  }> {
    try {
      const { prompt, context } = formatPrompt("analyze_report", data);

      const response = await aiAgent.call({
        prompt,
        context,
        task: "analyze_report",
      });

      if (response.success && response.data) {
        return response.data;
      }

      // Fallback
      return {
        summary: `${data.period} dönemi analiz edildi.`,
        insights: ["Genel performans değerlendirildi."],
        recommendations: [
          {
            title: "Düzenli Paylaşım",
            description: "Haftada 3-5 post paylaşın.",
            priority: "high",
          },
        ],
      };
    } catch (error) {
      console.error("Report analysis error:", error);
      return {
        summary: `${data.period} dönemi analiz edildi.`,
        insights: ["Rapor analizi tamamlandı."],
        recommendations: [
          {
            title: "Performans İyileştirme",
            description: "Metrikleri düzenli takip edin.",
            priority: "medium",
          },
        ],
      };
    }
  }

  /**
   * Kampanya önerisi (unified n8n AI Agent üzerinden)
   */
  async suggestCampaign(data: {
    goal: string;
    budget: number;
    targetAudience: string;
    sector?: string;
    duration?: number;
  }): Promise<{
    suggestion: string;
    strategy: {
      name: string;
      description: string;
      budget: number;
      duration: number;
      platforms: string[];
      adTypes: string[];
      targeting: string[];
      metrics: string[];
    };
  }> {
    try {
      const { prompt, context } = formatPrompt("suggest_campaign", data);

      const response = await aiAgent.call({
        prompt,
        context,
        task: "suggest_campaign",
      });

      if (response.success && response.data) {
        return response.data;
      }

      // Fallback
      return {
        suggestion: `${data.goal} hedefi için kampanya önerisi hazırlanıyor.`,
        strategy: {
          name: `${data.goal} Kampanyası`,
          description: `${data.goal} hedefi için optimize edilmiş kampanya`,
          budget: data.budget,
          duration: data.duration || 30,
          platforms: ["Instagram Feed", "Instagram Stories"],
          adTypes: ["Video", "Görsel"],
          targeting: ["Yaş: 18-45", `İlgi: ${data.sector || "Genel"}`, "Lokasyon: Türkiye"],
          metrics: ["Erişim", "Etkileşim", "Tıklama Oranı"],
        },
      };
    } catch (error) {
      console.error("Campaign suggestion error:", error);
      return {
        suggestion: `${data.goal} hedefi için kampanya önerisi.`,
        strategy: {
          name: `${data.goal} Kampanyası`,
          description: `${data.goal} hedefi için optimize edilmiş kampanya`,
          budget: data.budget,
          duration: data.duration || 30,
          platforms: ["Instagram Feed", "Instagram Stories"],
          adTypes: ["Video", "Görsel"],
          targeting: ["Yaş: 18-45", `İlgi: ${data.sector || "Genel"}`],
          metrics: ["Erişim", "Etkileşim"],
        },
      };
    }
  }

  /**
   * Basit metin oluşturma (unified n8n AI Agent üzerinden)
   */
  async generateText(
    prompt: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      model?: string;
    } = {}
  ): Promise<string> {
    try {
      const { prompt: formattedPrompt, context } = formatPrompt("generate_text", {
        prompt,
        maxTokens: options.maxTokens,
        temperature: options.temperature,
      });

      const response = await aiAgent.call({
        prompt: formattedPrompt,
        context,
        task: "generate_text",
      });

      if (response.success && response.data) {
        return typeof response.data === "string" 
          ? response.data 
          : response.data.text || response.data.content || "AI servisi yanıt vermedi.";
      }

      return "AI servisi yapılandırılmamış. Lütfen N8N_AGENT_URL ve N8N_AGENT_TOKEN'ı ayarlardan yapılandırın.";
    } catch (error: any) {
      console.error("Generate text error:", error);
      return "Metin oluşturulurken hata oluştu.";
    }
  }
}

// Singleton instance
export const aiService = new AIService();

// Helper functions
export async function getAITrends(request: AITrendRequest) {
  const isReady = await aiService.isReady();
  
  if (!isReady) {
    // Fallback: Mock data
    return {
      trends: [
        {
          title: `${request.sector || "Sektörünüz"} İçin Trend Önerisi`,
          description: `${request.question || request.sector} için AI destekli trend önerileri.`,
          category: request.sector || "Genel",
          tags: [request.sector?.toLowerCase() || "trend"],
        },
      ],
      aiRecommendation: `${request.sector || "Sektörünüz"} için güncel trend önerileri hazırlanıyor...`,
    };
  }

  return aiService.analyzeTrends(request);
}
