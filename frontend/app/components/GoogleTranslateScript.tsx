"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function GoogleTranslateScript() {
  useEffect(() => {
    // Define the callback function that Google Translate will call
    (window as any).googleTranslateElementInit = function() {
      console.log("Initializing Google Translate widget");

      // Create hidden container for the widget
      let container = document.getElementById("google_translate_element");
      if (!container) {
        container = document.createElement("div");
        container.id = "google_translate_element";
        container.style.display = "none";
        document.body.appendChild(container);
      }

      // Initialize Google Translate
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,te,hi,ta,ml,kn,gu,mr,pa,ur,or",
            autoDisplay: false,
          },
          "google_translate_element"
        );
        console.log("Google Translate widget initialized");
      }
    };
  }, []);

  return (
    <Script
      id="google-translate-script"
      src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("Google Translate script loaded");
      }}
      onError={(e) => {
        console.error("Failed to load Google Translate script:", e);
      }}
    />
  );
}
