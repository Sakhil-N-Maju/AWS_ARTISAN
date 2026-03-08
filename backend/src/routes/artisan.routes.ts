import { Router } from 'express';
import { artisanController } from '../controllers/artisan.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Artisan CRUD
router.post('/', artisanController.create.bind(artisanController));
router.get('/', artisanController.list.bind(artisanController));
router.get('/:id', artisanController.getById.bind(artisanController));
router.put('/:id', artisanController.update.bind(artisanController));
router.delete('/:id', requireRole('super_admin', 'admin'), artisanController.delete.bind(artisanController));

// Verification
router.post('/:id/verify', artisanController.verify.bind(artisanController));
router.post('/:id/reject', artisanController.reject.bind(artisanController));

export default router;
