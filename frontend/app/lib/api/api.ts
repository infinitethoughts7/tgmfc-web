import type {
  NewsCategoriesResponse,
  PressReleasesResponse,
  PressReleaseDetail,
  PressReleaseFilters,
} from "../types/news";
import { API_V2_URL } from "./config";

const API_BASE = API_V2_URL;

export async function getNotifications() {
  const res = await fetch(`${API_BASE}/notifications/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function getGalleryCategories() {
  const res = await fetch(`${API_BASE}/gallery/categories/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getGalleryImages() {
  const res = await fetch(`${API_BASE}/gallery/images/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
}

// News & Press Releases API

export async function getNewsCategories(): Promise<NewsCategoriesResponse> {
  const res = await fetch(`${API_BASE}/news/categories/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch news categories");
  return res.json();
}

export async function getPressReleases(
  filters?: PressReleaseFilters
): Promise<PressReleasesResponse> {
  const params = new URLSearchParams();

  if (filters?.category) params.append("category", filters.category);
  if (filters?.featured !== undefined)
    params.append("featured", filters.featured.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const url = `${API_BASE}/news/${params.toString() ? `?${params.toString()}` : ""}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch press releases");
  return res.json();
}

export async function getPressReleaseBySlug(
  slug: string
): Promise<PressReleaseDetail> {
  const res = await fetch(`${API_BASE}/news/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Press release not found");
    }
    throw new Error("Failed to fetch press release");
  }

  return res.json();
}

export async function getFeaturedNews(): Promise<PressReleasesResponse> {
  return getPressReleases({ featured: true, limit: 3 });
}