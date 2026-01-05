const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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