import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import artisanRoutes from './routes/artisan.routes';
import publicArtisanRoutes from './routes/public-artisan.routes';
import productRoutes from './routes/product.routes';
import publicProductRoutes from './routes/public-product.routes';
import verifyRoutes from './routes/verify.routes';
import whatsappRoutes from './routes/whatsapp.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3002' // Alternative port
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
});

app.use('/api', limiter);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  };
  
  res.status(200).json(health);
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Artisan AI API',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/artisans', artisanRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/artisans', publicArtisanRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
