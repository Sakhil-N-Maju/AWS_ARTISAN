import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export interface ProductFilters {
  page?: number;
  limit?: number;
  craftType?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  search?: string;
  status?: string;
}

export class ProductService {
  /**
   * Transform images from string array to object array format
   */
  private transformImages(images: any[]): Array<{url: string, alt?: string, order?: number}> {
    if (!images || images.length === 0) {
      return [{ url: '/placeholder.svg' }];
    }
    
    return images.map((img, index) => {
      if (typeof img === 'string') {
        return { url: img, order: index };
      }
      return img;
    });
  }

  /**
   * Get product by ID (public)
   */
  async getProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        artisan: {
          select: {
            id: true,
            name: true,
            craftType: true,
            region: true,
            bio: true,
            profilePhotoUrl: true,
            status: true
          }
        }
      }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Increment view count
    await prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    // Transform images to expected format
    return {
      ...product,
      images: this.transformImages(product.images as any[])
    };
  }

  /**
   * Get product by product ID (for QR verification)
   */
  async getProductByProductId(productId: string) {
    const product = await prisma.product.findUnique({
      where: { productId },
      include: {
        artisan: {
          select: {
            id: true,
            name: true,
            craftType: true,
            region: true,
            bio: true,
            profilePhotoUrl: true,
            status: true,
            verifiedAt: true
          }
        }
      }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Transform images to expected format
    return {
      ...product,
      images: this.transformImages(product.images as any[])
    };
  }

  /**
   * List products with filters (public)
   */
  async listProducts(filters: ProductFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 24;
    const skip = (page - 1) * limit;

    const where: any = {
      status: filters.status || 'published'
    };

    if (filters.craftType) {
      where.artisan = {
        craftType: filters.craftType
      };
    }

    if (filters.region) {
      where.artisan = {
        ...where.artisan,
        region: filters.region
      };
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = filters.minPrice * 100; // Convert to paise
      }
      if (filters.maxPrice) {
        where.price.lte = filters.maxPrice * 100;
      }
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags
      };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          artisan: {
            select: {
              id: true,
              name: true,
              region: true,
              status: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    // Transform images for all products
    const transformedProducts = products.map(product => ({
      ...product,
      images: this.transformImages(product.images as any[])
    }));

    return {
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update product (admin)
   */
  async updateProduct(id: string, data: any, adminId: string) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const updated = await prisma.product.update({
      where: { id },
      data
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        entityType: 'product',
        entityId: id,
        action: 'updated',
        performedBy: adminId,
        changes: data
      }
    });

    logger.info('Product updated', { productId: id, adminId });

    return updated;
  }

  /**
   * Publish product (admin)
   */
  async publishProduct(id: string, adminId: string) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date()
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        entityType: 'product',
        entityId: id,
        action: 'published',
        performedBy: adminId,
        changes: {}
      }
    });

    logger.info('Product published', { productId: id, adminId });

    return updated;
  }

  /**
   * Archive product (admin)
   */
  async archiveProduct(id: string, adminId: string) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { status: 'archived' }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        entityType: 'product',
        entityId: id,
        action: 'archived',
        performedBy: adminId,
        changes: {}
      }
    });

    logger.info('Product archived', { productId: id, adminId });

    return updated;
  }

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string, limit: number = 4) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { artisan: true }
    });

    if (!product) {
      return [];
    }

    // Find products with similar tags or from same artisan
    const related = await prisma.product.findMany({
      where: {
        id: { not: productId },
        status: 'published',
        OR: [
          { artisanId: product.artisanId },
          { tags: { hasSome: product.tags } }
        ]
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
      include: {
        artisan: {
          select: {
            id: true,
            name: true,
            region: true
          }
        }
      }
    });

    // Transform images for related products
    return related.map(product => ({
      ...product,
      images: this.transformImages(product.images as any[])
    }));
  }
}

export const productService = new ProductService();
