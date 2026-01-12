"use client";

import Image from "next/image";
import Notifications from "../sections/Notifications";
import ImageCarousel from "../ImageCarousel";
import officialsData from "../../mock/officials.json";

export default function HeroSection() {
  // Find Mohammad Azharuddin from officials data
  const minister = officialsData.officials.find(
    (official) => official.name === "Sri. Mohammad Azharuddin"
  );

  return (
    <div className="w-full py-2">
      <div className="max-w-7xl mx-auto px-4">

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-3">
          {/* Minister Card */}
          {minister && (
            <div className="bg-gradient-to-br from-green-50 via-white to-green-50 rounded-xl border-2 border-green-200 shadow-lg p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full border-3 border-green-500 overflow-hidden shadow-md">
                  <Image
                    src={minister.photo_url}
                    alt={minister.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-bold text-green-900">
                    {minister.name}
                  </h3>
                  <span className="text-sm font-semibold text-green-700">
                    {minister.designation}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Carousel */}
          <div className="h-[300px]">
            <ImageCarousel />
          </div>

          {/* Notifications */}
          <div className="h-[350px]">
            <Notifications />
          </div>
        </div>

        {/* Desktop Layout - 3 Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-[280px_1fr_280px] gap-4 h-[450px]">
          
          {/* Left Column - Minister */}
          {minister && (
            <div className="h-full bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-xl border-2 border-green-200 shadow-lg flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-600 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-600 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Photo with decorative ring */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-md opacity-30 scale-110"></div>
                  <div className="relative h-36 w-36 rounded-full border-4 border-green-500 overflow-hidden shadow-xl bg-white">
                    <Image
                      src={minister.photo_url}
                      alt={minister.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Name */}
                <h3 className="text-xl font-bold text-green-900 mb-2 leading-tight">
                  {minister.name}
                </h3>
                
                {/* Designation */}
                <span className="text-base font-semibold text-green-700 mb-3">
                  {minister.designation}
                </span>
                
                {/* Department Label */}
                <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                  Minority Welfare
                </div>
              </div>
            </div>
          )}

          {/* Middle Column - Carousel (Expanded) */}
          <div className="h-full">
            <ImageCarousel />
          </div>

          {/* Right Column - Notifications */}
          <div className="h-full">
            <Notifications />
          </div>
        </div>
      </div>
    </div>
  );
}
