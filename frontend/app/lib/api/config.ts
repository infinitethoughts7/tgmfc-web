/**
 * API Configuration
 * Centralized configuration for all API-related settings.
 * Single source of truth for API URLs and endpoints.
 */

// Base URL for the backend API (without trailing slash)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// API version paths
export const API_V1_PATH = "/api/v1";
export const API_V2_PATH = "/api/v2";

// Full versioned API URLs
export const API_V1_URL = `${API_BASE_URL}${API_V1_PATH}`;
export const API_V2_URL = `${API_BASE_URL}${API_V2_PATH}`;

// Media URL for images and files
export const MEDIA_URL = `${API_BASE_URL}/media`;

// Helper to construct full media URLs from relative paths
export function getMediaUrl(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  const cleanPath = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  return `${API_BASE_URL}${cleanPath}`;
}
