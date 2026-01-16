"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

// Safe useLayoutEffect for SSR
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// --- Types ---
interface GoogleTranslateElement {
  new (
    options: {
      pageLanguage: string;
      includedLanguages: string;
      layout: number;
      autoDisplay: boolean;
    },
    elementId: string
  ): void;
  InlineLayout: {
    SIMPLE: number;
    HORIZONTAL: number;
    VERTICAL: number;
  };
}

interface GoogleTranslateAPI {
  translate?: {
    TranslateElement: GoogleTranslateElement;
  };
}

type WindowWithGoogle = {
  google?: GoogleTranslateAPI;
  googleTranslateElementInit?: () => void;
}

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

// Get current language from cookie
function getCurrentLanguage(): string {
  if (typeof document === "undefined") return "en";
  
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "googtrans" && value) {
      // Cookie format: /en/hi or /auto/hi
      const match = value.match(/\/[^/]+\/([a-z]{2})/i);
      if (match) return match[1];
    }
  }
  return "en";
}

// Set translation cookie and reload
function setTranslationLanguage(langCode: string) {
  // Clear existing cookies first
  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
  
  if (langCode !== "en") {
    // Set new cookie
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
  }
  
  // Reload to apply translation
  window.location.reload();
}

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  // Always start with "en" to avoid hydration mismatch (server has no cookies)
  const [selectedLang, setSelectedLang] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync language from cookie on client mount (avoids hydration mismatch)
  useIsomorphicLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const lang = getCurrentLanguage();
      if (lang !== "en") {
        setSelectedLang(lang);
      }
    }
  }, []);

  // Load Google Translate script on mount
  useEffect(() => {
    const windowWithGoogle = window as unknown as Window & WindowWithGoogle;

    // Inject Google Translate element container if it doesn't exist
    let container = document.getElementById("google_translate_element");
    if (!container) {
      container = document.createElement("div");
      container.id = "google_translate_element";
      container.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;";
      document.body.appendChild(container);
    }

    // Function to create the widget
    const createWidget = () => {
      const google = windowWithGoogle.google;
      const el = document.getElementById("google_translate_element");
      if (google?.translate?.TranslateElement && el && !el.hasChildNodes()) {
        try {
          new google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: languages.map(l => l.code).join(","),
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        } catch {
          // Widget might already exist
        }
      }
    };

    // Function to apply translation when widget is ready - more aggressive retry
    const applyStoredLanguage = () => {
      const storedLang = getCurrentLanguage();
      if (storedLang !== "en") {
        let attempts = 0;
        const maxAttempts = 50; // Try for up to 10 seconds (50 * 200ms)
        
        const checkAndApply = () => {
          const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
          if (googleSelect && googleSelect.options.length > 1) {
            // Widget is ready, apply translation
            googleSelect.value = storedLang;
            googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
            // Verify and retry if needed
            setTimeout(() => {
              const newSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
              if (newSelect && newSelect.value !== storedLang && attempts < maxAttempts) {
                attempts++;
                newSelect.value = storedLang;
                newSelect.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }, 500);
          } else if (attempts < maxAttempts) {
            attempts++;
            // Keep checking until widget is ready
            setTimeout(checkAndApply, 200);
          }
        };
        checkAndApply();
      }
    };

    // Define the init callback (will be called by Google's script)
    windowWithGoogle.googleTranslateElementInit = function() {
      createWidget();
      // After creating widget, apply stored language with longer delay
      setTimeout(applyStoredLanguage, 1000);
    };

    // Load Google Translate script if not already loaded
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Script already exists - check if widget needs to be created
      if (windowWithGoogle.google?.translate?.TranslateElement) {
        createWidget();
        setTimeout(applyStoredLanguage, 1000);
      } else {
        // Script is still loading, wait for it
        const checkGoogle = setInterval(() => {
          if (windowWithGoogle.google?.translate?.TranslateElement) {
            clearInterval(checkGoogle);
            createWidget();
            setTimeout(applyStoredLanguage, 1000);
          }
        }, 100);
        // Clear interval after 15 seconds to prevent memory leak
        setTimeout(() => clearInterval(checkGoogle), 15000);
      }
    }
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

    setIsLoading(true);
    setSelectedLang(langCode);
    setIsOpen(false);

    // Try using Google's select element first (instant translation)
    const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    
    if (googleSelect && googleSelect.options.length > 1 && langCode !== "en") {
      // Widget is ready - use it for instant translation
      googleSelect.value = langCode;
      googleSelect.dispatchEvent(new Event("change", { bubbles: true }));
      
      // Give it a moment to apply
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else if (langCode === "en") {
      // Reset to English - clear cookies and reload
      setTranslationLanguage("en");
    } else {
      // Widget not ready - try waiting for it, then fall back to cookie method
      let attempts = 0;
      const maxAttempts = 10;
      
      const tryApply = () => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (combo && combo.options.length > 1) {
          combo.value = langCode;
          combo.dispatchEvent(new Event("change", { bubbles: true }));
          setIsLoading(false);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryApply, 300);
        } else {
          // Give up and use cookie method (requires page reload)
          setTranslationLanguage(langCode);
        }
      };
      tryApply();
    }
  };

  const currentLangName = languages.find(l => l.code === selectedLang)?.name || "English";

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          aria-label="Select language"
          type="button"
        >
          <Globe className="h-5 w-5 text-green-700" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700" suppressHydrationWarning>
            {isLoading ? "Loading..." : currentLangName}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-9999 overflow-hidden border border-gray-200">
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
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global styles to hide Google Translate UI elements */}
      <style jsx global>{`
        /* Hide Google Translate banner */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-gadget-icon,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover,
        #goog-gt-tt,
        .goog-te-spinner-pos,
        .goog-te-gadget-simple {
          display: none !important;
        }
        
        /* Remove highlight styling from translated text */
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        /* Prevent body margin shift from Google banner */
        body {
          top: 0 !important;
        }
        
        /* Hide the translate element completely */
        #google_translate_element {
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        
        /* Keep the combo functional but hidden */
        .goog-te-combo {
          position: absolute !important;
          left: -9999px !important;
        }
        
        /* Hide any iframes Google injects */
        iframe.skiptranslate {
          display: none !important;
        }
      `}</style>
    </>
  );
}
