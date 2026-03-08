import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', productController.list.bind(productController));
router.get('/:id', productController.getById.bind(productController));

// Admin routes
router.get('/admin/products', requireAuth, productController.listAdmin.bind(productController));
router.put('/admin/products/:id', requireAuth, productController.update.bind(productController));
router.post('/admin/products/:id/publish', requireAuth, productController.publish.bind(productController));
router.post('/admin/products/:id/archive', requireAuth, productController.archive.bind(productController));

export default router;
