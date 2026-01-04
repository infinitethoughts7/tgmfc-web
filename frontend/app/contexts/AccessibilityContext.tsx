"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Extend window type for Google Translate
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          config: {
            pageLanguage: string;
            includedLanguages: string;
            layout: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
        InlineLayout?: {
          SIMPLE: string;
        };
      };
    };
    googleTranslateElementInit?: () => void;
    speechSynthesis: SpeechSynthesis;
  }
}

export type Language = 'en' | 'ur' | 'te';

interface AccessibilityContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  isScreenReaderActive: boolean;
  toggleScreenReader: () => void;
  announceToScreenReader: (text: string) => void;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  readText: (text: string, lang?: Language) => void;
  stopReading: () => void;
  isReading: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Initialize font size from localStorage
  const getInitialFontSize = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem('accessibility-font-size');
      if (savedFontSize) {
        const size = parseInt(savedFontSize, 10);
        if (size >= 12 && size <= 24) {
          return size;
        }
      }
    }
    return 16;
  }, []);

  const getInitialLanguage = useCallback((): Language => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('accessibility-language') as Language;
      if (savedLang && ['en', 'ur', 'te'].includes(savedLang)) {
        return savedLang;
      }
    }
    return 'en';
  }, []);

  const [fontSize, setFontSizeState] = useState(getInitialFontSize);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
  const [isReading, setIsReading] = useState(false);

  // Apply font size globally
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('accessibility-font-size', fontSize.toString());
  }, [fontSize]);

  // Initialize Google Translate
  useEffect(() => {
    const initGoogleTranslate = () => {
      if (typeof window !== 'undefined') {
        // Create the Google Translate container if it doesn't exist
        if (!document.getElementById('google_translate_element')) {
          const container = document.createElement('div');
          container.id = 'google_translate_element';
          container.style.position = 'fixed';
          container.style.top = '-9999px';
          container.style.left = '-9999px';
          document.body.appendChild(container);
        }

        // Load Google Translate script
        if (!window.google?.translate) {
          const script = document.createElement('script');
          script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          document.head.appendChild(script);

          window.googleTranslateElementInit = function() {
            if (window.google?.translate?.TranslateElement && window.google.translate.InlineLayout) {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,ur,te',
                layout: window.google.translate.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          };
        }
      }
    };

    initGoogleTranslate();
  }, []);

  const setFontSize = (size: number) => {
    setFontSizeState(Math.max(12, Math.min(24, size)));
  };

  const increaseFontSize = () => {
    setFontSizeState(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSizeState(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSizeState(16);
  };

  const toggleScreenReader = () => {
    setIsScreenReaderActive(!isScreenReaderActive);

    if (!isScreenReaderActive) {
      const announcement = "Screen reader activated. Press Tab to navigate through interactive elements. Press Escape to exit screen reader mode.";
      announceToScreenReader(announcement);
    }
  };


  const announceToScreenReader = (text: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    announcement.textContent = text;
    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-language', lang);

      // Trigger Google Translate to change language
      triggerGoogleTranslate(lang);
    }
  };

  const triggerGoogleTranslate = (lang: Language) => {
    if (typeof window === 'undefined') return;

    // Map our language codes to Google Translate language codes
    const langMap: Record<Language, string> = {
      'en': 'en',
      'ur': 'ur',
      'te': 'te'
    };

    const targetLang = langMap[lang];

    const tryTranslate = (attempts = 0) => {
      if (attempts > 10) {
        console.log('Google Translate widget not found after multiple attempts');
        return;
      }

      // Try multiple selectors for the Google Translate combo box
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;

      if (combo) {
        // Set the value
        combo.value = targetLang;

        // Trigger multiple events to ensure it works
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        combo.dispatchEvent(new Event('click', { bubbles: true }));

        // Also try triggering it programmatically
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', { writable: false, value: combo });
        combo.dispatchEvent(event);

        console.log(`Triggered Google Translate to: ${lang} (${targetLang})`);
      } else {
        // Widget not ready yet, try again
        setTimeout(() => tryTranslate(attempts + 1), 300);
      }
    };

    tryTranslate();
  };

  const getVoiceForLanguage = (lang: Language): string => {
    const voiceMap: Record<Language, string[]> = {
      'en': ['en-US', 'en-GB', 'en'],
      'ur': ['ur-PK', 'ur-IN', 'ur'],
      'te': ['te-IN', 'te']
    };
    return voiceMap[lang][0];
  };

  const readText = useCallback((text: string, lang?: Language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang || currentLanguage;

    // Set language
    utterance.lang = getVoiceForLanguage(targetLang);

    // Try to find a voice for the target language
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(voice =>
      voice.lang.startsWith(targetLang) || voice.lang.startsWith(utterance.lang)
    );

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
  }, [currentLanguage]);

  const stopReading = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  }, []);

  // Load voices when available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };

      loadVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Trigger Google Translate on mount if a language is saved
  useEffect(() => {
    if (currentLanguage !== 'en') {
      // Wait for Google Translate to be fully loaded before triggering
      const timer = setTimeout(() => {
        triggerGoogleTranslate(currentLanguage);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const value: AccessibilityContextType = {
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isScreenReaderActive,
    toggleScreenReader,
    announceToScreenReader,
    currentLanguage,
    setLanguage,
    readText,
    stopReading,
    isReading,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
