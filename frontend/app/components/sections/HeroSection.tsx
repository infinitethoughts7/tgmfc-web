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
    <div className="w-full px-[3%]">

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-2">
          {/* Minister Card */}
          {minister && (
            <div className="bg-linear-to-br from-green-50 via-white to-green-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="relative h-42 w-26 rounded-lg border-2 border-green-500 overflow-hidden">
                  <Image
                    src={minister.photo_url}
                    alt={minister.name}
                    fill
                    className="object-cover object-bottom scale-150 origin-bottom translate-y-6"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-green-900">
                    {minister.name}
                  </h3>
                  <span className="text-xs font-semibold text-green-700">
                    {minister.designation}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Carousel */}
          <div className="h-[250px]">
            <ImageCarousel />
          </div>

          {/* Notifications */}
          <div className="h-[280px]">
            <Notifications />
          </div>
        </div>

        {/* Desktop Layout - 3 Column Grid */}
        <div className="hidden lg:grid lg:grid-cols-[220px_1fr_220px] gap-3 h-[380px]">
          
          {/* Left Column - Minister */}
          {minister && (
            <div className="h-full bg-linear-to-br from-green-50 via-white to-emerald-50 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-600 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-green-600 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Photo with decorative ring */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-linear-to-br from-green-400 to-emerald-600 rounded-lg blur-md opacity-30 scale-110"></div>
                  <div className="relative h-52 w-40 rounded-lg border-2 border-green-500 overflow-hidden bg-white">
                    <Image
                      src={minister.photo_url}
                      alt={minister.name}
                      fill
                      className="object-cover object-bottom scale-130 origin-bottom translate-y-10"
                    />
                  </div>
                </div>
                
                {/* Name */}
                <h3 className="text-lg font-bold text-green-900 mb-1 leading-tight">
                  {minister.name}
                </h3>
                
                {/* Designation */}
                <span className="text-sm font-semibold text-green-700 mb-2">
                  {minister.designation}
                </span>
                
                {/* Department Label */}
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
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
  );
}
