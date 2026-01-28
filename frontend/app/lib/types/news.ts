// News & Press Releases TypeScript Types

export interface NewsCategory {
  id: number;
  name: string;
  name_te: string;
  slug: string;
}

export interface PressRelease {
  id: number;
  title: string;
  title_te: string;
  slug: string;
  excerpt: string;
  excerpt_te: string;
  body: string;
  body_te: string;
  featured_image: string | null;
  category: number | null;
  category_name?: string;
  category_slug?: string;
  author: string;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  published_date: string;
  views: number;
}

export interface PressReleaseDetail extends Omit<PressRelease, 'category'> {
  category: {
    id: number;
    name: string;
    name_te: string;
    slug: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface NewsCategoriesResponse {
  categories: NewsCategory[];
}

export interface PressReleasesResponse {
  news: PressRelease[];
}

export interface PressReleaseFilters {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}
