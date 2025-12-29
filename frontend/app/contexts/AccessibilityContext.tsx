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
  }
}

interface AccessibilityContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  isScreenReaderActive: boolean;
  toggleScreenReader: () => void;
  toggleTranslate: () => void;
  announceToScreenReader: (text: string) => void;
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

  const [fontSize, setFontSizeState] = useState(getInitialFontSize);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  // Apply font size globally
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('accessibility-font-size', fontSize.toString());
  }, [fontSize]);

  // Initialize Google Translate
  useEffect(() => {
    const initGoogleTranslate = () => {
      if (typeof window !== 'undefined' && !window.google?.translate) {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);

        window.googleTranslateElementInit = function() {
          if (window.google?.translate?.TranslateElement && window.google.translate.InlineLayout) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,ur,hi,te',
              layout: window.google.translate.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element');
          }
        };
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

  const toggleTranslate = () => {
    const element = document.getElementById('google_translate_element');
    if (element) {
      element.classList.toggle('hidden');
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

  const value: AccessibilityContextType = {
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    isScreenReaderActive,
    toggleScreenReader,
    toggleTranslate,
    announceToScreenReader,
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
