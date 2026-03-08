import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { s3Service } from './s3.service';

export interface CreateArtisanData {
  name: string;
  phone: string;
  whatsappNumber: string;
  email?: string;
  craftType: string;
  region: string;
  language: string;
  bio?: string;
  address?: any;
}

export class ArtisanService {
  /**
   * Create new artisan
   */
  async createArtisan(data: CreateArtisanData, adminId: string) {
    // Check if phone already exists
    const existing = await prisma.artisan.findUnique({
      where: { phone: data.phone }
    });

    if (existing) {
      throw new ApiError(400, 'Artisan with this phone number already exists');
    }

    const artisan = await prisma.artisan.create({
      data: {
        ...data,
        status: 'pending'
      }
    });

    // Log audit
    await this.logAudit('artisan', artisan.id, 'created', adminId, data);

    logger.info('Artisan created', { artisanId: artisan.id, name: artisan.name });

    return artisan;
  }

  /**
   * Get artisan by ID
   */
  async getArtisan(id: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id },
      include: {
        products: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            products: true,
            orders: true
          }
        }
      }
    });

    if (!artisan) {
      throw new ApiError(404, 'Artisan not found');
    }

    return artisan;
  }

  /**
   * List artisans with filters
   */
  async listArtisans(params: {
    page?: number;
    limit?: number;
    status?: string;
    craftType?: string;
    region?: string;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.craftType) {
      where.craftType = params.craftType;
    }

    if (params.region) {
      where.region = params.region;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search } }
      ];
    }

    const [artisans, total] = await Promise.all([
      prisma.artisan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { products: true }
          }
        }
      }),
      prisma.artisan.count({ where })
    ]);

    return {
      data: artisans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update artisan
   */
  async updateArtisan(id: string, data: Partial<CreateArtisanData>, adminId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id }
    });

    if (!artisan) {
      throw new ApiError(404, 'Artisan not found');
    }

    const updated = await prisma.artisan.update({
      where: { id },
      data
    });

    // Log audit
    await this.logAudit('artisan', id, 'updated', adminId, data);

    logger.info('Artisan updated', { artisanId: id });

    return updated;
  }

  /**
   * Verify artisan
   */
  async verifyArtisan(id: string, notes: string, adminId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id }
    });

    if (!artisan) {
      throw new ApiError(404, 'Artisan not found');
    }

    const updated = await prisma.artisan.update({
      where: { id },
      data: {
        status: 'verified',
        verificationNotes: notes,
        verifiedAt: new Date(),
        verifiedBy: adminId
      }
    });

    // Log audit
    await this.logAudit('artisan', id, 'verified', adminId, { notes });

    logger.info('Artisan verified', { artisanId: id, adminId });

    // TODO: Send WhatsApp notification to artisan

    return updated;
  }

  /**
   * Reject artisan
   */
  async rejectArtisan(id: string, reason: string, adminId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id }
    });

    if (!artisan) {
      throw new ApiError(404, 'Artisan not found');
    }

    const updated = await prisma.artisan.update({
      where: { id },
      data: {
        status: 'rejected',
        verificationNotes: reason
      }
    });

    // Log audit
    await this.logAudit('artisan', id, 'rejected', adminId, { reason });

    logger.info('Artisan rejected', { artisanId: id, adminId });

    // TODO: Send WhatsApp notification to artisan

    return updated;
  }

  /**
   * Upload ID proof
   */
  async uploadIdProof(artisanId: string, file: Buffer, contentType: string) {
    const key = s3Service.generateFileKey(`artisans/${artisanId}/id-proof`, 'jpg');
    const url = await s3Service.uploadFile(file, key, contentType);

    await prisma.artisan.update({
      where: { id: artisanId },
      data: { idProofUrl: url }
    });

    logger.info('ID proof uploaded', { artisanId, url });

    return url;
  }

  /**
   * Delete artisan
   */
  async deleteArtisan(id: string, adminId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, orders: true }
        }
      }
    });

    if (!artisan) {
      throw new ApiError(404, 'Artisan not found');
    }

    if (artisan._count.products > 0 || artisan._count.orders > 0) {
      throw new ApiError(400, 'Cannot delete artisan with existing products or orders');
    }

    await prisma.artisan.delete({
      where: { id }
    });

    // Log audit
    await this.logAudit('artisan', id, 'deleted', adminId, {});

    logger.info('Artisan deleted', { artisanId: id, adminId });
  }

  /**
   * Log audit trail
   */
  private async logAudit(
    entityType: string,
    entityId: string,
    action: string,
    performedBy: string,
    changes: any
  ) {
    await prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        action,
        performedBy,
        changes
      }
    });
  }
}

export const artisanService = new ArtisanService();
