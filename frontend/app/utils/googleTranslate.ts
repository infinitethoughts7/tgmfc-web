// Utility functions for Google Translate integration

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Clear old cookies first
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;

  // Set new cookie
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; domain=${window.location.hostname}`;
}

export function getCurrentLanguage(): string {
  const googtrans = getCookie("googtrans");
  if (googtrans) {
    const match = googtrans.match(/\/[^/]+\/([a-z]{2})/i);
    if (match) return match[1];
  }
  return "en";
}

export function translatePage(langCode: string) {
  if (langCode === "en") {
    // Reset to English
    setCookie("googtrans", "/en/en", 1);
  } else {
    // Set translation language
    setCookie("googtrans", `/en/${langCode}`, 365);
  }

  // Reload page to apply translation
  window.location.reload();
}
