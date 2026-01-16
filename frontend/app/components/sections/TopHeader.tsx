"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import officialsData from "../../mock/officials.json";
import LanguageSelector from "../LanguageSelector";

export default function TopHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`w-full border-b bg-white transition-transform duration-300 relative z-[60] ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left: Logo + Ministry Name */}
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16">
              <Image
                src="/logos/telangana.png"
                alt="Telangana Government Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-green-700">
                Telangana Ministry of Minority Welfare
              </span>
              <span className="text-base font-bold text-green-700">
                تلنگانہ محکمہ اقلیتی بہبود
              </span>
            </div>
          </div>

          {/* Right: Both Officials + Language Selector */}
          <div className="flex items-center gap-3">
            {officialsData.officials.map((official) => (
              <div
                key={official.id}
                className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-white rounded-lg px-3 py-2 border border-green-200 shadow-sm"
              >
                <div className="relative h-14 w-14 rounded-full border-2 border-green-500 overflow-hidden">
                  <Image
                    src={official.photo_url}
                    alt={official.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-green-900 leading-tight">
                    {official.name}
                  </h3>
                  <span className="text-xs font-semibold text-green-700">
                    {official.designation}
                  </span>
                </div>
              </div>
            ))}
            <LanguageSelector />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Top Row: Logo + Title + Language Selector */}
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-12 shrink-0">
              <Image
                src="/logos/telangana.png"
                alt="Telangana Government Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-bold text-green-700 leading-tight">
                Telangana Ministry of Minority Welfare
              </span>
              <span className="text-xs font-bold text-green-700">
                تلنگانہ محکمہ اقلیتی بہبود
              </span>
            </div>
            <LanguageSelector />
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              aria-label="Search"
            />
          </div>

          {/* Officials - Horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {officialsData.officials.map((official) => (
              <div
                key={official.id}
                className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-green-50 to-white rounded-lg px-2 py-2 border border-green-200 shadow-sm min-w-[200px]"
              >
                <div className="relative h-12 w-12 rounded-full border-2 border-green-500 overflow-hidden">
                  <Image
                    src={official.photo_url}
                    alt={official.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-green-900 leading-tight">
                    {official.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-green-700">
                    {official.designation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
