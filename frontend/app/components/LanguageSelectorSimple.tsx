"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { getCurrentLanguage, translatePage } from "../utils/googleTranslate";

const languages = [
  { code: "en", name: "English" },
  { code: "ur", name: "Urdu" },
  { code: "te", name: "Telugu" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "ml", name: "Malayalam" },
  { code: "kn", name: "Kannada" },
  { code: "gu", name: "Gujarati" },
  { code: "mr", name: "Marathi" },
  { code: "pa", name: "Punjabi" },
  { code: "or", name: "Odia" },
];

export default function LanguageSelectorSimple() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }
    return getCurrentLanguage();
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load translation state from session on mount (only after hydration)
  useEffect(() => {
    // Check if we're in the middle of a translation (page just reloaded with cookie)
    const lang = getCurrentLanguage();
    if (lang !== "en" && typeof window !== "undefined") {
      const isReloading = sessionStorage.getItem("translating");
      if (isReloading === "true") {
        // Defer state update to avoid setState directly in the effect body
        const startLoaderTimeout = setTimeout(() => {
          setIsTranslating(true);
          console.log("Translation in progress, showing loader...");
        }, 0);

        // Wait for Google Translate to apply translation
        const checkTranslation = setInterval(() => {
          // Check if translation has been applied by looking for Google's elements
          const translatedElements = document.querySelectorAll("font[class*='translated']");
          if (translatedElements.length > 0 || document.querySelector(".goog-te-combo")) {
            console.log("Translation applied, hiding loader");
            setIsTranslating(false);
            sessionStorage.removeItem("translating");
            clearInterval(checkTranslation);
          }
        }, 100);

        // Fallback: hide loader after 3 seconds even if translation not detected
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

    // Set flag in sessionStorage to show loader after reload
    if (langCode !== "en") {
      sessionStorage.setItem("translating", "true");
    } else {
      sessionStorage.removeItem("translating");
    }

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
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-fuchsia-700 hover:bg-fuchsia-800 transition-colors"
          aria-label="Select language"
          type="button"
        >
          <Globe className="h-3.5 w-3.5 text-white" />
          <span className="hidden sm:inline text-xs font-bold text-white" suppressHydrationWarning>
            {currentLangName}
          </span>
          <ChevronDown className={`h-3 w-3 text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl   overflow-hidden border border-gray-200">
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

      {/* Translation loading overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-white z-99999 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Translating content...</p>
          </div>
        </div>
      )}

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
