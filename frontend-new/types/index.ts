/**
 * Shared TypeScript type definitions for Artisan AI platform
 */

export interface Product {
  id: string;
  artisanId: string;
  productId: string;
  title: string;
  description: string;
  artisanStory: string;
  culturalContext?: string;
  material: string[];
  colors: string[];
  tags: string[];
  price: number; // in paise
  currency: string;
  images: ProductImage[];
  status: string;
  publishedAt: string;
  viewCount: number;
  favoriteCount: number;
  artisan?: Artisan;
}

export interface ProductImage {
  url: string;
  alt?: string;
  order?: number;
}

export interface Artisan {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  email?: string;
  craftType: string;
  region: string;
  language: string;
  status: string;
  bio?: string;
  profilePhotoUrl?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
