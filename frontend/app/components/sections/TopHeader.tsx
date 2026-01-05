"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Plus, Minus, RotateCcw, Languages, Volume2, VolumeX, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility, Language } from "../../contexts/AccessibilityContext";

export default function TopHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isScreenReaderActive,
    toggleScreenReader,
    currentLanguage,
    setLanguage,
    isReading,
    stopReading,
    readText
  } = useAccessibility();

  // Remove unnecessary useEffect and setMounted pattern as per React best practices

  const languageLabels: Record<Language, { name: string; nativeName: string }> = {
    en: { name: 'English', nativeName: 'English' },
    ur: { name: 'Urdu', nativeName: 'اردو' },
    te: { name: 'Telugu', nativeName: 'తెలుగు' }
  };

  const handleReadPage = () => {
    // Get the main content of the page (you can customize this selector)
    const mainContent = document.querySelector('main') || document.body;
    const text = mainContent?.textContent?.slice(0, 500) || 'No content to read';
    readText(text, currentLanguage);
  };

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
    <div className={`w-full border-b bg-white transition-transform duration-300 relative z-[60] ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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

            {/* Officer Login Button */}
            <Link
              href="/officer/login"
              className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors"
              title="Officer Login"
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Officer Login</span>
            </Link>

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

              <div className="relative z-[100]">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-1 rounded px-2 py-1 hover:bg-green-100 bg-white border border-green-300"
                  aria-label="Select language"
                  title="Select language"
                >
                  <Languages className="h-4 w-4 text-green-700" />
                  <span className="text-xs font-semibold text-green-700">
                    {mounted ? languageLabels[currentLanguage].nativeName : 'English'}
                  </span>
                </button>

                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border-2 border-green-500 rounded-md shadow-2xl z-[200] min-w-[140px]">
                    {(['en', 'ur', 'te'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-base font-medium transition-colors ${
                          currentLanguage === lang
                            ? 'bg-green-600 text-white font-bold'
                            : 'bg-white text-gray-800 hover:bg-green-100'
                        } first:rounded-t-md last:rounded-b-md border-b border-gray-200 last:border-b-0`}
                      >
                        {languageLabels[lang].nativeName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isReading ? (
                <button
                  onClick={stopReading}
                  className="rounded p-1 hover:bg-green-100 bg-red-100"
                  aria-label="Stop reading"
                  title="Stop reading"
                >
                  <VolumeX className="h-4 w-4 text-red-700" />
                </button>
              ) : (
                <button
                  onClick={handleReadPage}
                  className="rounded p-1 hover:bg-green-100"
                  aria-label="Read page content"
                  title="Read page content"
                >
                  <Volume2 className="h-4 w-4 text-green-700" />
                </button>
              )}
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

            {/* Officer Login & Accessibility Tools - Compact */}
            <div className="flex items-center gap-1">
              <Link
                href="/officer/login"
                className="flex items-center gap-1 px-2 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-medium transition-colors"
                title="Officer Login"
              >
                <Shield className="h-3 w-3" />
              </Link>

              <button onClick={decreaseFontSize} className="rounded p-1 hover:bg-green-100" aria-label="Decrease font size">
                <Minus className="h-4 w-4 text-green-700" />
              </button>
              <button onClick={increaseFontSize} className="rounded p-1 hover:bg-green-100" aria-label="Increase font size">
                <Plus className="h-4 w-4 text-green-700" />
              </button>

              <div className="relative z-[100]">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-1 rounded p-1 hover:bg-green-100 bg-white border border-green-300"
                  aria-label="Select language"
                >
                  <Languages className="h-4 w-4 text-green-700" />
                </button>

                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border-2 border-green-500 rounded-md shadow-2xl z-[200] min-w-[120px]">
                    {(['en', 'ur', 'te'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
                          currentLanguage === lang
                            ? 'bg-green-600 text-white font-bold'
                            : 'bg-white text-gray-800 hover:bg-green-100'
                        } first:rounded-t-md last:rounded-b-md border-b border-gray-200 last:border-b-0`}
                      >
                        {languageLabels[lang].nativeName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isReading ? (
                <button onClick={stopReading} className="rounded p-1 hover:bg-green-100 bg-red-100" aria-label="Stop reading">
                  <VolumeX className="h-4 w-4 text-red-700" />
                </button>
              ) : (
                <button onClick={handleReadPage} className="rounded p-1 hover:bg-green-100" aria-label="Read page content">
                  <Volume2 className="h-4 w-4 text-green-700" />
                </button>
              )}
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
