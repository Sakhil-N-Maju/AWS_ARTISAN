import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { artisanService } from '../services/artisan.service';
import { AuthRequest } from '../middleware/auth';

const createArtisanSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email().optional(),
  craftType: z.string().min(2),
  region: z.string().min(2),
  language: z.string().min(2),
  bio: z.string().optional(),
  address: z.any().optional()
});

const updateArtisanSchema = createArtisanSchema.partial();

const verifyArtisanSchema = z.object({
  notes: z.string().min(1)
});

const rejectArtisanSchema = z.object({
  reason: z.string().min(1)
});

export class ArtisanController {
  /**
   * POST /api/admin/artisans
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = createArtisanSchema.parse(req.body);
      const artisan = await artisanService.createArtisan(data, req.admin!.id);
      
      res.status(201).json({
        success: true,
        data: artisan
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/artisans/:id
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const artisan = await artisanService.getArtisan(req.params.id as string);
      
      res.json({
        success: true,
        data: artisan
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/artisans
   */
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const params = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as string,
        craftType: req.query.craftType as string,
        region: req.query.region as string,
        search: req.query.search as string
      };

      const result = await artisanService.listArtisans(params);
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/artisans/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateArtisanSchema.parse(req.body);
      const artisan = await artisanService.updateArtisan(
        req.params.id as string,
        data,
        req.admin!.id
      );
      
      res.json({
        success: true,
        data: artisan
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/artisans/:id/verify
   */
  async verify(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { notes } = verifyArtisanSchema.parse(req.body);
      const artisan = await artisanService.verifyArtisan(
        req.params.id as string,
        notes,
        req.admin!.id
      );
      
      res.json({
        success: true,
        data: artisan
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/artisans/:id/reject
   */
  async reject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { reason } = rejectArtisanSchema.parse(req.body);
      const artisan = await artisanService.rejectArtisan(
        req.params.id as string,
        reason,
        req.admin!.id
      );
      
      res.json({
        success: true,
        data: artisan
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/artisans/:id
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await artisanService.deleteArtisan(req.params.id as string, req.admin!.id);
      
      res.json({
        success: true,
        message: 'Artisan deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const artisanController = new ArtisanController();
