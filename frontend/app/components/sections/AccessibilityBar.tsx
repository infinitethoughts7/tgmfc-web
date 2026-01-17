"use client";

import Link from "next/link";
import { Plus, Minus, RotateCcw, Globe, Volume2, VolumeX, Shield, ChevronDown, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { getCurrentLanguage, translatePage } from "../../utils/googleTranslate";

const translateLanguages = [
  { code: "en", name: "English" },
  { code: "ur", name: "Urdu - اردو" },
  { code: "te", name: "Telugu - తెలుగు" },
  { code: "hi", name: "Hindi - हिंदी" },
  { code: "ta", name: "Tamil - தமிழ்" },
  { code: "ml", name: "Malayalam - മലയാളം" },
  { code: "kn", name: "Kannada - ಕನ್ನಡ" },
  { code: "gu", name: "Gujarati - ગુજરાતી" },
  { code: "mr", name: "Marathi - मराठी" },
  { code: "pa", name: "Punjabi - ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia - ଓଡ଼ିଆ" },
];

export default function AccessibilityBar() {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTranslateLang, setSelectedTranslateLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return getCurrentLanguage();
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isReading,
    stopReading,
    readText
  } = useAccessibility();

  useEffect(() => {
    const lang = getCurrentLanguage();
    if (lang !== "en" && typeof window !== "undefined") {
      const isReloading = sessionStorage.getItem("translating");
      if (isReloading === "true") {
        const startLoaderTimeout = setTimeout(() => {
          setIsTranslating(true);
        }, 0);

        const checkTranslation = setInterval(() => {
          const translatedElements = document.querySelectorAll("font[class*='translated']");
          if (translatedElements.length > 0 || document.querySelector(".goog-te-combo")) {
            setIsTranslating(false);
            sessionStorage.removeItem("translating");
            clearInterval(checkTranslation);
          }
        }, 100);

        const fallbackTimeout = setTimeout(() => {
          setIsTranslating(false);
          sessionStorage.removeItem("translating");
          clearInterval(checkTranslation);
        }, 3000);

        return () => {
          clearTimeout(startLoaderTimeout);
          clearInterval(checkTranslation);
          clearTimeout(fallbackTimeout);
        };
      }
    }
    return undefined;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === selectedTranslateLang) {
      setShowLanguageMenu(false);
      return;
    }

    setSelectedTranslateLang(langCode);
    setShowLanguageMenu(false);

    if (langCode !== "en") {
      sessionStorage.setItem("translating", "true");
    } else {
      sessionStorage.removeItem("translating");
    }

    translatePage(langCode);
  };

  const handleReadPage = () => {
    const mainContent = document.querySelector('main') || document.body;
    const text = mainContent?.textContent?.slice(0, 500) || 'No content to read';
    readText(text, selectedTranslateLang as any);
  };

  const currentTranslateLangName = translateLanguages.find((l) => l.code === selectedTranslateLang)?.name || "English";

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed right-4 top-20 z-[70] bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all"
        aria-label="Toggle accessibility menu"
        title="Accessibility Tools"
      >
        <Shield className="h-5 w-5" />
      </button>

      {/* Accessibility Panel */}
      {isVisible && (
        <div className="fixed right-4 top-32 z-[70] bg-white border-2 border-green-500 rounded-lg shadow-2xl p-4 min-w-[280px]">
          <div className="flex flex-col gap-4">
            {/* Officer Login */}
            <Link
              href="/officer/login"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors"
              title="Officer Login"
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm">Officer Login</span>
            </Link>

            {/* Font Size Controls */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-700">Font Size</span>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="flex-1 rounded p-2 hover:bg-green-100 border border-green-300"
                  aria-label="Decrease font size"
                  title="Decrease font size"
                >
                  <Minus className="h-4 w-4 text-green-700 mx-auto" />
                </button>
                <span className="text-sm text-gray-600 min-w-[40px] text-center font-semibold">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="flex-1 rounded p-2 hover:bg-green-100 border border-green-300"
                  aria-label="Increase font size"
                  title="Increase font size"
                >
                  <Plus className="h-4 w-4 text-green-700 mx-auto" />
                </button>
                <button
                  onClick={resetFontSize}
                  className="flex-1 rounded p-2 hover:bg-green-100 border border-green-300"
                  aria-label="Reset font size"
                  title="Reset font size"
                >
                  <RotateCcw className="h-4 w-4 text-green-700 mx-auto" />
                </button>
              </div>
            </div>

            {/* Google Translate Language Selection */}
            <div className="flex flex-col gap-2" ref={dropdownRef}>
              <span className="text-sm font-bold text-gray-700">Language</span>
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="w-full flex items-center justify-between gap-2 rounded-lg px-4 py-3 hover:bg-green-50 bg-white border-2 border-green-300 transition-all hover:border-green-500"
                  aria-label="Select language"
                  title="Select language"
                  type="button"
                >
                  <Globe className="h-5 w-5 text-green-700 flex-shrink-0" />
                  <span className="text-sm font-semibold text-green-700 flex-1 text-left truncate">
                    {currentTranslateLangName}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-green-700 transition-transform flex-shrink-0 ${showLanguageMenu ? "rotate-180" : ""}`} />
                </button>

                {showLanguageMenu && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-green-500 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-[200]">
                    {translateLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-all flex items-center justify-between ${
                          selectedTranslateLang === lang.code
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-800 hover:bg-green-50'
                        } first:rounded-t-lg last:rounded-b-lg border-b border-gray-200 last:border-b-0`}
                        type="button"
                      >
                        <span>{lang.name}</span>
                        {selectedTranslateLang === lang.code && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Screen Reader */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-700">Screen Reader</span>
              {isReading ? (
                <button
                  onClick={stopReading}
                  className="w-full rounded p-2 hover:bg-red-100 bg-red-50 border border-red-300 flex items-center justify-center gap-2"
                  aria-label="Stop reading"
                  title="Stop reading"
                >
                  <VolumeX className="h-4 w-4 text-red-700" />
                  <span className="text-sm font-medium text-red-700">Stop Reading</span>
                </button>
              ) : (
                <button
                  onClick={handleReadPage}
                  className="w-full rounded p-2 hover:bg-green-100 border border-green-300 flex items-center justify-center gap-2"
                  aria-label="Read page content"
                  title="Read page content"
                >
                  <Volume2 className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-medium text-green-700">Read Page</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Translation loading overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-white z-[99999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-semibold text-lg">Translating content...</p>
          </div>
        </div>
      )}

      {/* Hide Google Translate UI */}
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-spinner-pos {
          display: none !important;
        }

        body {
          top: 0 !important;
        }

        #google_translate_element {
          display: none !important;
        }
      `}</style>
    </>
  );
}
