import { Router } from 'express';
import { whatsappController } from '../controllers/whatsapp.controller';

const router = Router();

// Webhook verification (GET)
router.get('/webhook', whatsappController.verifyWebhook.bind(whatsappController));

// Receive messages (POST)
router.post('/webhook', whatsappController.receiveMessage.bind(whatsappController));

export default router;
