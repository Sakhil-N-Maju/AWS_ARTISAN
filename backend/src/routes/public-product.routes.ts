import { Router, Request, Response } from 'express';
import { productController } from '../controllers/product.controller';

const router = Router();

// Mock product data for when database is not available
const mockProducts = [
  {
    id: '1',
    productId: 'PROD-1709820000000',
    title: 'Handmade Terracotta Pot',
    description: 'Beautiful handcrafted terracotta pot made with traditional techniques by Test Artisan. Perfect for home decor and plants. Made in Karnataka with 20 years of experience.',
    price: 100000, // ₹1000 in paise
    images: ['/terracotta-pots.jpg'],
    status: 'published',
    craftType: 'Pottery',
    region: 'Karnataka',
    tags: ['pottery', 'terracotta', 'handmade', 'traditional'],
    material: ['terracotta', 'clay'],
    colors: ['brown', 'red'],
    viewCount: 45,
    likeCount: 12,
    createdAt: new Date('2024-03-07'),
    publishedAt: new Date('2024-03-07'),
    artisan: {
      id: '1',
      name: 'Test Artisan',
      craftType: 'Pottery',
      region: 'Karnataka',
      bio: 'Traditional pottery maker testing WhatsApp AI system',
      profilePhotoUrl: '/placeholder-user.jpg',
      status: 'verified'
    }
  },
  {
    id: '2',
    productId: 'PROD-1709820100000',
    title: 'Blue Pottery Bowl',
    description: 'Exquisite blue pottery bowl featuring traditional Rajasthani designs. Hand-painted with natural dyes and glazed to perfection.',
    price: 150000, // ₹1500
    images: ['/blue-pottery-bowl.jpg'],
    status: 'published',
    craftType: 'Pottery',
    region: 'Rajasthan',
    tags: ['pottery', 'blue-pottery', 'handmade', 'rajasthani'],
    material: ['ceramic', 'glaze'],
    colors: ['blue', 'white'],
    viewCount: 89,
    likeCount: 23,
    createdAt: new Date('2024-03-05'),
    publishedAt: new Date('2024-03-05'),
    artisan: {
      id: '2',
      name: 'Rajesh Kumar',
      craftType: 'Pottery',
      region: 'Rajasthan',
      bio: 'Master potter with 25 years of experience in traditional Rajasthani pottery',
      profilePhotoUrl: '/placeholder-user.jpg',
      status: 'verified'
    }
  },
  {
    id: '3',
    productId: 'PROD-1709820200000',
    title: 'Embroidered Silk Saree',
    description: 'Stunning silk saree with intricate Gujarati embroidery work. Features traditional mirror work and vibrant colors.',
    price: 450000, // ₹4500
    images: ['/hand-woven-saree.jpg'],
    status: 'published',
    craftType: 'Textiles',
    region: 'Gujarat',
    tags: ['textiles', 'saree', 'embroidery', 'silk'],
    material: ['silk', 'thread', 'mirrors'],
    colors: ['red', 'gold', 'green'],
    viewCount: 156,
    likeCount: 45,
    createdAt: new Date('2024-03-04'),
    publishedAt: new Date('2024-03-04'),
    artisan: {
      id: '3',
      name: 'Priya Sharma',
      craftType: 'Textiles',
      region: 'Gujarat',
      bio: 'Specializes in traditional Gujarati embroidery and textile work',
      profilePhotoUrl: '/placeholder-user.jpg',
      status: 'verified'
    }
  },
  {
    id: '4',
    productId: 'PROD-1709820300000',
    title: 'Brass Decorative Lamp',
    description: 'Handcrafted brass lamp with intricate engravings. Traditional design perfect for home decoration and festivals.',
    price: 250000, // ₹2500
    images: ['/brass-lamp.jpg'],
    status: 'published',
    craftType: 'Metalwork',
    region: 'Uttar Pradesh',
    tags: ['metalwork', 'brass', 'lamp', 'traditional'],
    material: ['brass', 'copper'],
    colors: ['gold', 'bronze'],
    viewCount: 67,
    likeCount: 18,
    createdAt: new Date('2024-03-03'),
    publishedAt: new Date('2024-03-03'),
    artisan: {
      id: '4',
      name: 'Mohammed Ali',
      craftType: 'Metalwork',
      region: 'Uttar Pradesh',
      bio: 'Expert in traditional brass and copper metalwork',
      profilePhotoUrl: '/placeholder-user.jpg',
      status: 'verified'
    }
  }
];

// Public product routes (no authentication required)
router.get('/', async (req: Request, res: Response) => {
  try {
    // Try to use the real controller
    await productController.list(req as any, res, (error: any) => {
      // If database error, return mock data
      if (error) {
        console.log('Database not available, returning mock product data');
        
        // Apply filters
        let filteredProducts = [...mockProducts];
        
        // Search filter
        if (req.query.search) {
          const search = (req.query.search as string).toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.tags.some(tag => tag.toLowerCase().includes(search))
          );
        }
        
        // Craft type filter
        if (req.query.craftType) {
          filteredProducts = filteredProducts.filter(p => 
            p.craftType === req.query.craftType
          );
        }
        
        // Region filter
        if (req.query.region) {
          filteredProducts = filteredProducts.filter(p => 
            p.region === req.query.region
          );
        }
        
        // Price range filter
        if (req.query.minPrice) {
          const minPrice = parseFloat(req.query.minPrice as string) * 100; // Convert to paise
          filteredProducts = filteredProducts.filter(p => p.price >= minPrice);
        }
        
        if (req.query.maxPrice) {
          const maxPrice = parseFloat(req.query.maxPrice as string) * 100; // Convert to paise
          filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
        }
        
        res.json({
          success: true,
          data: filteredProducts,
          pagination: {
            total: filteredProducts.length,
            page: 1,
            limit: 24,
            totalPages: 1
          }
        });
      }
    });
  } catch (error) {
    // Return mock data on any error
    res.json({
      success: true,
      data: mockProducts,
      pagination: {
        total: mockProducts.length,
        page: 1,
        limit: 24,
        totalPages: 1
      }
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    // Try to use the real controller
    await productController.getById(req as any, res, (error: any) => {
      // If database error, return mock data
      if (error) {
        const product = mockProducts.find(p => p.id === req.params.id || p.productId === req.params.id);
        if (product) {
          res.json({
            success: true,
            data: {
              ...product,
              related: mockProducts.filter(p => 
                p.id !== product.id && 
                (p.craftType === product.craftType || p.region === product.region)
              ).slice(0, 4)
            }
          });
        } else {
          res.status(404).json({
            success: false,
            error: 'Product not found'
          });
        }
      }
    });
  } catch (error) {
    const product = mockProducts.find(p => p.id === req.params.id || p.productId === req.params.id);
    if (product) {
      res.json({
        success: true,
        data: {
          ...product,
          related: mockProducts.filter(p => 
            p.id !== product.id && 
            (p.craftType === product.craftType || p.region === product.region)
          ).slice(0, 4)
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
  }
});

export default router;
