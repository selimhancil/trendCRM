import { NextResponse } from "next/server";
import { fetchTrendingContent } from "@/lib/apiClient";

export async function POST(request: Request) {
  try {
    const { category } = await request.json();
    
    const data = await fetchTrendingContent(category);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Trends error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 }
    );
  }
}

