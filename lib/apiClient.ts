export async function fetchInstagramAnalysis(username: string) {
  const response = await fetch(process.env.N8N_API_ANALYZE_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) throw new Error("Failed to fetch analysis");
  return await response.json();
}

export async function fetchTrendingContent(category?: string) {
  const response = await fetch(process.env.N8N_API_TRENDS_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category }),
  });
  if (!response.ok) throw new Error("Failed to fetch trends");
  return await response.json();
}
