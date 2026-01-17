"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, Tag, Eye } from "lucide-react";
import { getPressReleases, getNewsCategories } from "../lib/api/api";
import type { PressRelease, NewsCategory } from "../lib/types/news";

export default function NewsAndPressPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<PressRelease[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsData, categoriesData] = await Promise.all([
          getPressReleases(),
          getNewsCategories(),
        ]);

        setNews(newsData.news || []);
        setCategories(categoriesData.categories || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load news");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.category_slug === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-3">
            News & Press Releases
          </h1>
          <div className="w-24 h-1 bg-green-600"></div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search news and press releases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All News
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.slug
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Showing {filteredNews.length} {filteredNews.length === 1 ? "article" : "articles"}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No news articles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <Link
                key={article.id}
                href={`/news-and-press/${article.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Featured Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {article.featured_image ? (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-600 to-green-600">
                      <span className="text-white text-5xl font-bold">
                        {article.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {article.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category & Date */}
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                    {article.category_name && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span>{article.category_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.published_date)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{article.views} views</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium group-hover:underline">
                      Read more →
                    </span>
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
