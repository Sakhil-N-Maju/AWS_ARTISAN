const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'artisan_ai',
  user: 'artisan',
  password: 'artisan_password',
  ssl: false
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

// Map of craft types to placeholder images from public folder
const imageMap = {
  'Painting': ['/indian-hand-painted-art.jpg', '/traditional-indian-art.jpg'],
  'Textiles': ['/hand-woven-saree.jpg', '/colorful-indian-fabrics.jpg', '/indian-handmade-textiles-fabric.jpg'],
  'Pottery': ['/terracotta-pots.jpg', '/traditional-indian-pottery-ceramic.jpg', '/blue-pottery-bowl.jpg'],
  'Metalwork': ['/brass-lamp.jpg', '/brass-copper-metalwork.jpg'],
  'Woodwork': ['/carved-wood-art.jpg', '/wooden-handicraft-indian-carving.jpg'],
  'Jewelry': ['/traditional-jewelry.png', '/kundan-necklace.jpg', '/indian-jewelry-gold-traditional.jpg']
};

async function updateProductImages() {
  try {
    console.log('🖼️  Updating product images...');

    // Get all products
    const products = await prisma.product.findMany({
      include: {
        artisan: true
      }
    });

    console.log(`Found ${products.length} products to update`);

    for (const product of products) {
      // Determine craft type from tags or artisan
      let craftType = 'Painting'; // default
      
      if (product.tags.includes('pottery') || product.tags.includes('terracotta')) {
        craftType = 'Pottery';
      } else if (product.tags.includes('textile') || product.tags.includes('saree') || product.tags.includes('fabric')) {
        craftType = 'Textiles';
      } else if (product.tags.includes('metal') || product.tags.includes('brass') || product.tags.includes('copper')) {
        craftType = 'Metalwork';
      } else if (product.tags.includes('wood') || product.tags.includes('carved')) {
        craftType = 'Woodwork';
      } else if (product.tags.includes('jewelry') || product.tags.includes('necklace')) {
        craftType = 'Jewelry';
      } else if (product.tags.includes('painting') || product.tags.includes('art')) {
        craftType = 'Painting';
      }

      // Get appropriate images for this craft type
      const images = imageMap[craftType] || imageMap['Painting'];
      const selectedImage = images[Math.floor(Math.random() * images.length)];

      // Update product with image
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: [selectedImage]
        }
      });

      console.log(`✅ Updated ${product.title} with ${selectedImage}`);
    }

    console.log('\n🎉 All product images updated successfully!');
  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

updateProductImages();
