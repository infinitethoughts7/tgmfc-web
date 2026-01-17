"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { getFeaturedNews } from "../../lib/api/api";
import type { PressRelease } from "../../lib/types/news";

export default function FeaturedNews() {
  const [featuredNews, setFeaturedNews] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        const data = await getFeaturedNews();
        setFeaturedNews(data.news || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch featured news:", error);
        setLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-gray-500">Loading news...</div>
        </div>
      </section>
    );
  }

  if (!featuredNews || featuredNews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Newspaper className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-teal-800">
                News & Press Releases
              </h2>
            </div>
            <div className="w-24 h-1 bg-green-600"></div>
          </div>
          <Link
            href="/news-and-press"
            className="hidden md:flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredNews.map((article) => (
            <Link
              key={article.id}
              href={`/news-and-press/${article.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {article.featured_image ? (
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-600 to-green-600">
                    <Newspaper className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article.published_date}>
                    {formatDate(article.published_date)}
                  </time>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 text-green-600 font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Read more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden text-center">
          <Link
            href="/news-and-press"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <span>View All News</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
