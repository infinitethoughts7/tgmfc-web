"use client";

import Link from "next/link";
import { Plus, Minus, RotateCcw, Languages, Volume2, VolumeX, Shield } from "lucide-react";
import { useState } from "react";
import { useAccessibility, Language } from "../../contexts/AccessibilityContext";

export default function AccessibilityBar() {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    currentLanguage,
    setLanguage,
    isReading,
    stopReading,
    readText
  } = useAccessibility();

  const languageLabels: Record<Language, { name: string; nativeName: string }> = {
    en: { name: 'English', nativeName: 'English' },
    ur: { name: 'Urdu', nativeName: 'اردو' },
    te: { name: 'Telugu', nativeName: 'తెలుగు' }
  };

  const handleReadPage = () => {
    const mainContent = document.querySelector('main') || document.body;
    const text = mainContent?.textContent?.slice(0, 500) || 'No content to read';
    readText(text, currentLanguage);
  };

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

            {/* Language Selection */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-700">Language</span>
              <div className="relative z-[100]">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="w-full flex items-center justify-between gap-2 rounded px-3 py-2 hover:bg-green-100 bg-white border border-green-300"
                  aria-label="Select language"
                  title="Select language"
                >
                  <Languages className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-semibold text-green-700">
                    {languageLabels[currentLanguage].nativeName}
                  </span>
                </button>

                {showLanguageMenu && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-green-500 rounded-md shadow-2xl z-[200]">
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
    </>
  );
}
