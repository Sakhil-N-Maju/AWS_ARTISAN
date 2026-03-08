import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['super_admin', 'admin', 'moderator'])
});

export class AuthController {
  /**
   * POST /api/admin/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await authService.login(email, password);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createAdminSchema.parse(req.body);
      const admin = await authService.createAdmin(data);
      
      res.status(201).json({
        success: true,
        data: admin
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/auth/me
   */
  async getCurrentAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.admin) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const admin = await authService.getCurrentAdmin(req.admin.id);
      
      res.json({
        success: true,
        data: admin
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/auth/logout
   */
  async logout(req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}

export const authController = new AuthController();
