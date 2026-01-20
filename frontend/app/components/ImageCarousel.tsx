"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/news-press/p1.jpeg",
  "/news-press/p2.jpeg",
  "/news-press/p3.jpeg",
  "/news-press/p4.jpeg",
  "/news-press/p6.jpeg",
  "/news-press/p9.jpeg",
  "/news-press/p10.jpeg",
  "/news-press/p11.jpeg"
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Dots overlay at bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? "bg-green-500" : "bg-white/70"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}