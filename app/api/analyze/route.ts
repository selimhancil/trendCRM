import { NextResponse } from "next/server";
import { fetchInstagramAnalysis } from "@/lib/apiClient";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const data = await fetchInstagramAnalysis(username);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze Instagram account" },
      { status: 500 }
    );
  }
}
