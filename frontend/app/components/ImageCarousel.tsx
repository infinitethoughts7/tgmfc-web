"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    image: "/news-press/p1.jpeg",
    title: "Education for Every Child",
    description: "Launching the statewide admission drive for Minority Residential Schools to ensure quality education reaches every household.",
  },
   {image: "/news-press/g3.jpeg",
    title: "Listening to Every Voice",
    description: "Engaging directly with elders to understand their concerns firsthand and ensure their grievances are addressed with care and urgency.",
  },
  {
    image: "/news-press/p2.jpeg",
    title: "People-Centric Leadership",
    description: "Strengthening the bond with the community through continuous engagement and transparent governance.",
  },
  {
    image: "/news-press/p3.jpeg",
    title: "Inaugurating Development Projects",
    description: "Unveiling new infrastructure and welfare initiatives designed to uplift the minority community.",
  },
  {
    image: "/news-press/p4.jpeg",
    title: "Women's Economic Empowerment",
    description: "Distributing sewing machines to foster self-reliance, entrepreneurship, and financial independence among women.",
  },
  {
    image: "/news-press/p11.jpeg",
    title: "Empowering the Next Generation",
    description: "Awarding scholarships and appointment orders to deserving youth, paving the way for a brighter professional future.",
  },
  {
    image: "/news-press/p9.jpeg",
    title: "Health & Wellness Initiatives",
    description: "Ensuring accessible healthcare and medical support for the most vulnerable sections of society.",
  },
  {
    image: "/news-press/p6.jpeg",
    title: "A Leader Who Delivers",
    description: "Standing shoulder-to-shoulder with beneficiaries, the Hon'ble Minister translates policy into reality by personally ensuring welfare benefits reach the people.",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Caption overlay - Stories style horizontal box */}
        <div className="absolute bottom-6 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <h4 className="text-green-400 font-bold text-sm lg:text-base">
            {currentSlide.title}
          </h4>
          <p className="text-white text-xs mt-0.5 line-clamp-1">
            {currentSlide.description}
          </p>
        </div>

        {/* Dots overlay at bottom */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
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