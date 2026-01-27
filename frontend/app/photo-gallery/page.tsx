"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, Calendar, Image as ImageIcon } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
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
        setCategories([
          { id: "all", label: "All" },
          ...(categoriesData.categories || []),
        ]);
        setLoading(false);
      } catch (err) {
        console.error("Gallery fetch error:", err);
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
      month: "long",
      year: "numeric",
    });
  };

  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    const index = filteredImages.findIndex((img) => img.id === item.id);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const showNext = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const showPrevious = () => {
    const prevIndex =
      (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleDownload = () => {
    if (selectedImage) {
      window.open(selectedImage.image, "_blank");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          showPrevious();
          break;
        case "ArrowRight":
          showNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-pulse" />
          <div className="text-gray-500">Loading gallery...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <ImageIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-teal-800">Photo Gallery</h1>
          </div>
          <div className="w-24 h-1 bg-green-600"></div>
          <p className="text-gray-600 mt-3">
            Browse through our collection of events and programs
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                selectedCategory === cat.id
                  ? "bg-green-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Showing {filteredImages.length}{" "}
          {filteredImages.length === 1 ? "photo" : "photos"}
        </div>

        {/* Gallery Grid - Enhanced */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No photos found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredImages.map((item: GalleryItem) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                onClick={() => openLightbox(item)}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Caption */}
                <div className="p-4">
                  <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <time>{formatDate(item.date)}</time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="absolute top-4 right-16 text-white hover:text-gray-300 transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Download"
          >
            <Download className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors p-3 bg-white/10 rounded-full backdrop-blur-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors p-3 bg-white/10 rounded-full backdrop-blur-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-6xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full h-[70vh]">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Caption Box */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg mt-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {selectedImage.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <time>{formatDate(selectedImage.date)}</time>
              </div>
              {filteredImages.length > 1 && (
                <div className="mt-3 text-sm text-gray-500">
                  Photo {currentIndex + 1} of {filteredImages.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
