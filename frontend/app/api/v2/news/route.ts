import { NextResponse } from "next/server";
import newsData from "@/app/mock/news-press-releases.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");

    let filteredNews = newsData.news;

    // Filter by category
    if (category) {
      filteredNews = filteredNews.filter((item) => {
        const itemCategory = newsData.categories.find(
          (cat) => cat.id === item.category
        );
        return itemCategory?.slug === category;
      });
    }

    // Filter by featured
    if (featured === "true") {
      filteredNews = filteredNews.filter((item) => item.is_featured);
    }

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNews = filteredNews.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.excerpt.toLowerCase().includes(searchLower) ||
          item.body.toLowerCase().includes(searchLower)
      );
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      filteredNews = filteredNews.slice(0, limitNum);
    }

    const normalizeImagePath = (path: string | null) => {
      if (!path) return null;
      if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
        return path;
      }
      return `/${path}`;
    };

    // Map news items to include category information
    const newsWithCategories = filteredNews.map((item) => {
      const category = newsData.categories.find(
        (cat) => cat.id === item.category
      );
      return {
        ...item,
        featured_image: normalizeImagePath(item.featured_image),
        category_name: category?.name,
        category_slug: category?.slug,
        category_name_te: category?.name_te,
      };
    });

    return NextResponse.json({
      news: newsWithCategories,
      total: newsWithCategories.length,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
