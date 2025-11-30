/**
 * API Client - Backward Compatibility
 * Eski API çağrıları için uyumluluk katmanı
 * 
 * NOTE: Bu metodlar artık kullanılmıyor.
 * Yeni kod için aiAgent veya aiService kullanın.
 */

import { aiService } from "./aiService";
import { aiAgent, formatPrompt } from "./aiAgent";

/**
 * Instagram analiz verisi çek (Backward compatibility)
 * @deprecated Use aiAgent or aiService instead
 */
export async function fetchInstagramAnalysis(
  username: string,
  sector?: string,
  goal?: string
) {
  try {
    // AI Agent kullanarak analiz yap
    const { prompt, context } = formatPrompt("analyze_instagram_account", {
      username,
      sector,
      goal,
    });
    
    const response = await aiAgent.call({
      prompt,
      context,
      task: "analyze_instagram_account",
    });
    
    if (!response.success) {
      throw new Error(response.error || "Failed to fetch analysis");
    }
    return response.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch analysis");
  }
}

/**
 * Trend içerik verisi çek (Backward compatibility)
 * @deprecated Use getAITrends from aiService instead
 */
export async function fetchTrendingContent(category?: string) {
  try {
    // AI Service kullanarak trend verisi al
    const { getAITrends } = await import("./aiService");
    const result = await getAITrends({
      sector: category,
      question: category ? `${category} sektörü için trendler` : "Güncel trendler",
    });
    
    return result.trends || [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch trends");
  }
}