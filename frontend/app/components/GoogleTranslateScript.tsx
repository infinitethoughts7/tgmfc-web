"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleTranslateScript() {
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    // Define the callback function that Google Translate will call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).googleTranslateElementInit = function() {
      // Create hidden container for the widget
      let container = document.getElementById("google_translate_element");
      if (!container) {
        container = document.createElement("div");
        container.id = "google_translate_element";
        container.style.display = "none";
        document.body.appendChild(container);
      }

      // Initialize Google Translate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).google?.translate?.TranslateElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,te,hi,ta,ml,kn,gu,mr,pa,ur,or",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  // Don't render anything if script already failed
  if (scriptFailed) {
    return null;
  }

  return (
    <Script
      id="google-translate-script"
      src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      strategy="afterInteractive"
      onError={() => {
        // Silently handle the error - Google Translate may be blocked by ad blockers
        // or network restrictions. The site will continue to work without translation.
        setScriptFailed(true);
      }}
    />
  );
}
