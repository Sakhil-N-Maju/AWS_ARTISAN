/**
 * Data transformation utilities for Artisan AI platform
 */

import { Product } from '@/types';

/**
 * Transform backend product to frontend display format
 */
export function transformProduct(backendProduct: any): Product {
  return {
    ...backendProduct,
    images: backendProduct.images || [],
    price: backendProduct.price, // Already in paise
    publishedAt: backendProduct.publishedAt || new Date().toISOString(),
    viewCount: backendProduct.viewCount || 0,
    favoriteCount: backendProduct.favoriteCount || 0,
  };
}

/**
 * Transform price from rupees to paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Transform price from paise to rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Format price for display
 */
export function formatPrice(paise: number, currency: string = 'INR'): string {
  const rupees = paiseToRupees(paise);
  return `₹${rupees.toLocaleString('en-IN')}`;
}
