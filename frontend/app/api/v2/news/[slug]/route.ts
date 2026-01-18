import { NextResponse } from "next/server";
import newsData from "@/app/mock/news-press-releases.json";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const newsItem = newsData.news.find((item) => item.slug === slug);

    if (!newsItem) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // Get category information
    const category = newsData.categories.find(
      (cat) => cat.id === newsItem.category
    );

    // Get related news (same category, different article)
    const relatedNews = newsData.news
      .filter(
        (item) => item.category === newsItem.category && item.id !== newsItem.id
      )
      .slice(0, 3)
      .map((item) => ({
        ...item,
        category_name: category?.name,
        category_slug: category?.slug,
      }));

    const newsWithCategory = {
      ...newsItem,
      category_name: category?.name,
      category_slug: category?.slug,
      category_name_te: category?.name_te,
      related_news: relatedNews,
    };

    return NextResponse.json(newsWithCategory);
  } catch (error) {
    console.error("Error fetching news article:", error);
    return NextResponse.json(
      { error: "Failed to fetch news article" },
      { status: 500 }
    );
  }
}
