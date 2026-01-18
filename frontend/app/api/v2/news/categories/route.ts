import { NextResponse } from "next/server";
import newsData from "@/app/mock/news-press-releases.json";

export async function GET() {
  try {
    return NextResponse.json({
      categories: newsData.categories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
