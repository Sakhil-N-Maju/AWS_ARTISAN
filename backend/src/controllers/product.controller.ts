import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productService } from '../services/product.service';
import { AuthRequest } from '../middleware/auth';

const updateProductSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  artisanStory: z.string().optional(),
  culturalContext: z.string().optional(),
  price: z.number().optional(),
  tags: z.array(z.string()).optional(),
  material: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional()
});

export class ProductController {
  /**
   * GET /api/products
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 24,
        craftType: req.query.craftType as string,
        region: req.query.region as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        search: req.query.search as string
      };

      const result = await productService.listProducts(filters);
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProduct(req.params.id as string);
      const related = await productService.getRelatedProducts(req.params.id as string);
      
      res.json({
        success: true,
        data: {
          ...product,
          related
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/verify/:productId
   */
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductByProductId(req.params.productId as string);
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/products/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(
        req.params.id as string,
        data,
        req.admin!.id
      );
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/products/:id/publish
   */
  async publish(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.publishProduct(
        req.params.id as string,
        req.admin!.id
      );
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/products/:id/archive
   */
  async archive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.archiveProduct(
        req.params.id as string,
        req.admin!.id
      );
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/products
   */
  async listAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as string,
        craftType: req.query.craftType as string,
        region: req.query.region as string,
        search: req.query.search as string
      };

      const result = await productService.listProducts(filters);
      
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
