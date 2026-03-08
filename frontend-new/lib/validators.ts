/**
 * Data validation utilities for Artisan AI platform
 * Validates product and artisan data to ensure required fields are present
 */

import type { Product, Artisan } from '@/types';

/**
 * Validates a product object to ensure all required fields are present and valid
 * @param product - The product object to validate
 * @returns true if valid, false if invalid
 */
export function validateProduct(product: any): product is Product {
  if (!product || typeof product !== 'object') {
    console.warn('Invalid product: not an object', product);
    return false;
  }

  // Check required fields
  const requiredFields = ['id', 'title', 'price', 'artisanId', 'status'];
  const missingFields = requiredFields.filter((field) => !product[field]);

  if (missingFields.length > 0) {
    console.warn(`Invalid product: missing required fields [${missingFields.join(', ')}]`, product);
    return false;
  }

  // Validate price is a positive number
  if (typeof product.price !== 'number' || product.price <= 0) {
    console.warn('Invalid product: price must be a positive number', product);
    return false;
  }

  // Validate arrays exist (can be empty)
  const arrayFields = ['images', 'material', 'colors', 'tags'];
  for (const field of arrayFields) {
    if (product[field] && !Array.isArray(product[field])) {
      console.warn(`Invalid product: ${field} must be an array`, product);
      return false;
    }
  }

  return true;
}

/**
 * Validates an artisan object to ensure all required fields are present and valid
 * @param artisan - The artisan object to validate
 * @returns true if valid, false if invalid
 */
export function validateArtisan(artisan: any): artisan is Artisan {
  if (!artisan || typeof artisan !== 'object') {
    console.warn('Invalid artisan: not an object', artisan);
    return false;
  }

  // Check required fields
  const requiredFields = ['id', 'name', 'craftType', 'region', 'status'];
  const missingFields = requiredFields.filter((field) => !artisan[field]);

  if (missingFields.length > 0) {
    console.warn(`Invalid artisan: missing required fields [${missingFields.join(', ')}]`, artisan);
    return false;
  }

  // Validate phone number exists
  if (!artisan.phone && !artisan.whatsappNumber) {
    console.warn('Invalid artisan: must have either phone or whatsappNumber', artisan);
    return false;
  }

  return true;
}

/**
 * Validates an array of products, filtering out invalid ones
 * @param products - Array of products to validate
 * @returns Array of valid products only
 */
export function validateProducts(products: any[]): Product[] {
  if (!Array.isArray(products)) {
    console.warn('Invalid products: not an array', products);
    return [];
  }

  return products.filter(validateProduct);
}

/**
 * Validates an array of artisans, filtering out invalid ones
 * @param artisans - Array of artisans to validate
 * @returns Array of valid artisans only
 */
export function validateArtisans(artisans: any[]): Artisan[] {
  if (!Array.isArray(artisans)) {
    console.warn('Invalid artisans: not an array', artisans);
    return [];
  }

  return artisans.filter(validateArtisan);
}
