"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getGalleryImages, getGalleryCategories } from "../lib/api/api";

type GalleryItem = {
  id: number;
  image: string;
  title: string;
  date: string;
  category: string;
};

type Category = {
  id: string;
  label: string;
};

export default function PhotoGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imagesData, categoriesData] = await Promise.all([
          getGalleryImages(),
          getGalleryCategories(),
        ]);
        
        setGallery(imagesData.gallery || []);
        // Add "All" category at the beginning
        setCategories([
          { id: "all", label: "All" },
          ...(categoriesData.categories || []),
        ]);
        setLoading(false);
      } catch {
        setError("Failed to load gallery");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredImages =
    selectedCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">PHOTO GALLERY</h1>
          <div className="w-20 h-1 bg-green-600"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((item: GalleryItem) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Caption */}
              <div className="mt-2">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">
                  {item.title}
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No photos found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-lg"
            >
              ✕ Close
            </button>

            {/* Image */}
            <div className="relative aspect-video">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Caption */}
            <div className="bg-white p-4 rounded-b-lg">
              <p className="font-semibold text-gray-800">{selectedImage.title}</p>
              <p className="text-sm text-gray-500">{formatDate(selectedImage.date)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
