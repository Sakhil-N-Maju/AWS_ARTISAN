import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));

// Protected routes
router.get('/me', requireAuth, authController.getCurrentAdmin.bind(authController));
router.post('/logout', requireAuth, authController.logout.bind(authController));

export default router;
