import { Router } from 'express';
import { productController } from '../controllers/product.controller';

const router = Router();

// QR code verification
router.get('/:productId', productController.verify.bind(productController));

export default router;
