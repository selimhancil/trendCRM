/**
 * API Client - Backward Compatibility
 * Eski API çağrıları için uyumluluk katmanı
 */

import { n8nClient } from "./n8nClient";

/**
 * Instagram analiz verisi çek (Backward compatibility)
 */
export async function fetchInstagramAnalysis(
  username: string,
  sector?: string,
  goal?: string
) {
  const response = await n8nClient.analyzeInstagram(username, sector, goal);
  if (!response.success) {
    throw new Error(response.error || "Failed to fetch analysis");
  }
  return response.data;
}

/**
 * Trend içerik verisi çek (Backward compatibility)
 */
export async function fetchTrendingContent(category?: string) {
  const response = await n8nClient.getTrendingContent(category);
  if (!response.success) {
    throw new Error(response.error || "Failed to fetch trends");
  }
  return response.data;
}