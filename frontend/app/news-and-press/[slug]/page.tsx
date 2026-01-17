"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Tag, Eye, ArrowLeft, Share2 } from "lucide-react";
import { getPressReleaseBySlug } from "../../lib/api/api";
import type { PressReleaseDetail } from "../../lib/types/news";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<PressReleaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        const data = await getPressReleaseBySlug(slug);
        setArticle(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article"
        );
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error || "Article not found"}</div>
        <Link
          href="/news-and-press"
          className="text-green-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/news-and-press"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to News</span>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Featured Badge */}
          {article.is_featured && (
            <div className="inline-block bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Featured Article
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(article.published_date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{article.author}</span>
            </div>

            {article.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                <Link
                  href={`/news-and-press?category=${article.category.slug}`}
                  className="text-green-600 hover:underline"
                >
                  {article.category.name}
                </Link>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{article.views} views</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 ml-auto text-green-600 hover:text-green-700 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          {/* Excerpt */}
          <p className="text-xl text-gray-700 leading-relaxed border-l-4 border-green-600 pl-4 py-2 bg-green-50">
            {article.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        {article.featured_image && (
          <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: article.body }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Metadata */}
        <div className="bg-gray-100 rounded-lg p-6 text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Published:</span>{" "}
              {formatDate(article.published_date)}
            </div>
            <div>
              <span className="font-semibold">Last Updated:</span>{" "}
              {formatDate(article.updated_at)}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
