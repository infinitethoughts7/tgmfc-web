"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { getCurrentLanguage, translatePage } from "../utils/googleTranslate";

const languages = [
  { code: "en", name: "English" },
  { code: "te", name: "Telugu" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "ml", name: "Malayalam" },
  { code: "kn", name: "Kannada" },
  { code: "gu", name: "Gujarati" },
  { code: "mr", name: "Marathi" },
  { code: "pa", name: "Punjabi" },
  { code: "ur", name: "Urdu" },
  { code: "or", name: "Odia" },
];

export default function LanguageSelectorSimple() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load current language from cookie on mount
  useEffect(() => {
    const lang = getCurrentLanguage();
    setSelectedLang(lang);
    console.log("Current language from cookie:", lang);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === selectedLang) {
      setIsOpen(false);
      return;
    }

    console.log(`Changing language from ${selectedLang} to ${langCode}`);
    setSelectedLang(langCode);
    setIsOpen(false);

    // Set cookie and reload page
    // Google Translate will auto-translate based on the cookie
    translatePage(langCode);
  };

  const currentLangName = languages.find((l) => l.code === selectedLang)?.name || "English";

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          aria-label="Select language"
          type="button"
        >
          <Globe className="h-5 w-5 text-green-700" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700" suppressHydrationWarning>
            {currentLangName}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-[9999] overflow-hidden border border-gray-200">
            <div className="py-1 max-h-80 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                    selectedLang === lang.code
                      ? "bg-green-600 text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  type="button"
                >
                  <span>{lang.name}</span>
                  {selectedLang === lang.code && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hide Google Translate UI - now using meta tag translate */}
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
