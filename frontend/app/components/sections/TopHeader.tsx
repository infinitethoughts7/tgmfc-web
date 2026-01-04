"use client";

import Image from "next/image";
import { Menu, Search, Plus, Minus, RotateCcw, Languages, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";

export default function TopHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isScreenReaderActive,
    toggleScreenReader,
    toggleTranslate
  } = useAccessibility();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling up, show when at top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`w-full border-b bg-white transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="mx-auto max-w-7xl px-4 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Logo + Ministry Name */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12">
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
              <span className="text-lg font-bold text-green-700">
                تلنگانہ محکمہ اقلیتی بہبود
              </span>
            </div>
          </div>

          {/* Right: Search bar and accessibility tools */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                aria-label="Search"
              />
            </div>

            {/* Accessibility Controls */}
            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
              <div className="flex items-center gap-1">
                <button onClick={decreaseFontSize} className="rounded p-1 hover:bg-green-100" aria-label="Decrease font size" title="Decrease font size">
                  <Minus className="h-4 w-4 text-green-700" />
                </button>
                <span className="text-xs text-gray-600 min-w-[20px] text-center">{fontSize}px</span>
                <button onClick={increaseFontSize} className="rounded p-1 hover:bg-green-100" aria-label="Increase font size" title="Increase font size">
                  <Plus className="h-4 w-4 text-green-700" />
                </button>
                <button onClick={resetFontSize} className="rounded p-1 hover:bg-green-100" aria-label="Reset font size" title="Reset font size">
                  <RotateCcw className="h-4 w-4 text-green-700" />
                </button>
              </div>

              <button onClick={toggleTranslate} className="flex items-center gap-1 rounded p-1 hover:bg-green-100" aria-label="Translate website" title="Translate website">
                <Languages className="h-4 w-4 text-green-700" />
                <span className="text-xs text-green-700">اردو</span>
              </button>

              <button onClick={toggleScreenReader} className={`rounded p-1 hover:bg-green-100 ${isScreenReaderActive ? 'bg-green-200' : ''}`} aria-label={isScreenReaderActive ? "Disable screen reader" : "Enable screen reader"} title={isScreenReaderActive ? "Disable screen reader" : "Enable screen reader"}>
                <Volume2 className={`h-4 w-4 ${isScreenReaderActive ? 'text-green-800' : 'text-green-700'}`} />
              </button>
            </div>

            <button className="rounded p-2 hover:bg-green-100" aria-label="Open sidebar">
              <Menu className="h-5 w-5 text-green-700" />
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Top Row: Logo + Title + Accessibility */}
          <div className="flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src="/logos/telangana.png"
                  alt="Telangana Government Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-green-700 leading-tight">
                  Telangana Ministry of Minority Welfare
                </span>
                <span className="text-xs font-bold text-green-700">
                  تلنگانہ محکمہ اقلیتی بہبود
                </span>
              </div>
            </div>

            {/* Accessibility Tools - Compact */}
            <div className="flex items-center gap-1">
              <button onClick={decreaseFontSize} className="rounded p-1 hover:bg-green-100" aria-label="Decrease font size">
                <Minus className="h-4 w-4 text-green-700" />
              </button>
              <button onClick={increaseFontSize} className="rounded p-1 hover:bg-green-100" aria-label="Increase font size">
                <Plus className="h-4 w-4 text-green-700" />
              </button>
              <button onClick={toggleTranslate} className="rounded p-1 hover:bg-green-100" aria-label="Translate website">
                <Languages className="h-4 w-4 text-green-700" />
              </button>
              <button onClick={toggleScreenReader} className={`rounded p-1 hover:bg-green-100 ${isScreenReaderActive ? 'bg-green-200' : ''}`} aria-label="Toggle screen reader">
                <Volume2 className={`h-4 w-4 ${isScreenReaderActive ? 'text-green-800' : 'text-green-700'}`} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Search Bar - Full Width */}
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
        </div>
      </div>
    </div>
  );
}
