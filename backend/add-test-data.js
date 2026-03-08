// Quick script to add test data to database
// Run with: node add-test-data.js

require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Adding test data to database...\n');

  try {
    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123456', 10);
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@artisanai.com' },
      update: {},
      create: {
        email: 'admin@artisanai.com',
        name: 'Admin User',
        passwordHash: adminPassword,
        role: 'super_admin',
        isActive: true
      }
    });
    console.log('✅ Admin user created:', admin.email);

    // Create test artisan 1
    console.log('\nCreating test artisan 1...');
    const artisan1 = await prisma.artisan.upsert({
      where: { phone: '+919876543210' },
      update: {},
      create: {
        name: 'Rajesh Kumar',
        phone: '+919876543210',
        whatsappNumber: '+919876543210',
        email: 'rajesh@example.com',
        craftType: 'Metal Craft',
        region: 'Kerala',
        language: 'malayalam',
        status: 'verified',
        bio: 'Master craftsman specializing in traditional Aranmula Kannadi mirrors with 25 years of experience.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    });
    console.log('✅ Artisan created:', artisan1.name);

    // Create test artisan 2
    console.log('\nCreating test artisan 2...');
    const artisan2 = await prisma.artisan.upsert({
      where: { phone: '+919876543211' },
      update: {},
      create: {
        name: 'Lakshmi Devi',
        phone: '+919876543211',
        whatsappNumber: '+919876543211',
        craftType: 'Textile',
        region: 'Karnataka',
        language: 'kannada',
        status: 'verified',
        bio: 'Expert in Channapatna toy making and traditional silk weaving.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    });
    console.log('✅ Artisan created:', artisan2.name);

    // Create test artisan 3 (for WhatsApp testing - using Twilio sandbox number)
    console.log('\nCreating test artisan 3 (for WhatsApp testing)...');
    const artisan3 = await prisma.artisan.upsert({
      where: { phone: '+14155238886' },
      update: {},
      create: {
        name: 'Test Artisan',
        phone: '+14155238886',
        whatsappNumber: '+14155238886',
        craftType: 'Pottery',
        region: 'Maharashtra',
        language: 'hindi',
        status: 'verified',
        bio: 'Test artisan for WhatsApp integration testing.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    });
    console.log('✅ Artisan created:', artisan3.name);

    // Create sample product 1
    console.log('\nCreating sample product 1...');
    const product1 = await prisma.product.create({
      data: {
        artisanId: artisan1.id,
        productId: 'ART-KER-MET-001',
        title: 'Handcrafted Aranmula Kannadi Mirror',
        description: 'A stunning traditional mirror crafted using ancient metallurgical techniques passed down through generations. This unique piece reflects not just your image but centuries of Kerala\'s rich cultural heritage.',
        artisanStory: 'Rajesh Kumar learned this sacred craft from his grandfather, maintaining the traditional methods that make each Aranmula Kannadi a masterpiece of Indian metallurgy.',
        culturalContext: 'Aranmula Kannadi is a handmade metal-alloy mirror, made in Aranmula, Kerala. Unlike normal glass mirrors, it is a front surface reflection mirror, which eliminates secondary reflections.',
        material: ['Bronze', 'Copper', 'Tin'],
        colors: ['Gold', 'Bronze'],
        tags: ['mirror', 'metal', 'traditional', 'kerala', 'handcrafted'],
        price: 850000, // ₹8,500
        currency: 'INR',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        qrCodeUrl: 'https://placeholder.com/qr',
        aiGeneratedFields: ['title', 'description', 'artisanStory']
      }
    });
    console.log('✅ Product created:', product1.title);

    // Create sample product 2
    console.log('\nCreating sample product 2...');
    const product2 = await prisma.product.create({
      data: {
        artisanId: artisan2.id,
        productId: 'ART-KAR-TEX-001',
        title: 'Traditional Channapatna Wooden Toy Set',
        description: 'Vibrant, eco-friendly wooden toys handcrafted using traditional lacquer work. Each piece is made from sustainable wood and colored with natural dyes, making them safe for children.',
        artisanStory: 'Lakshmi Devi has been creating these colorful toys for over 15 years, keeping alive the 200-year-old tradition of Channapatna toy making.',
        culturalContext: 'Channapatna toys are a particular form of wooden toys manufactured in Channapatna, Karnataka. This traditional craft is protected as a geographical indication under the World Trade Organization.',
        material: ['Wood', 'Natural Lacquer'],
        colors: ['Red', 'Yellow', 'Green', 'Blue'],
        tags: ['toys', 'wooden', 'channapatna', 'karnataka', 'eco-friendly'],
        price: 120000, // ₹1,200
        currency: 'INR',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        qrCodeUrl: 'https://placeholder.com/qr',
        aiGeneratedFields: ['title', 'description']
      }
    });
    console.log('✅ Product created:', product2.title);

    console.log('\n🎉 Test data added successfully!\n');
    console.log('📝 Login credentials:');
    console.log('   Email: admin@artisanai.com');
    console.log('   Password: admin123456\n');
    console.log('📱 Test artisans:');
    console.log('   1. Rajesh Kumar (+919876543210) - Kerala, Metal Craft');
    console.log('   2. Lakshmi Devi (+919876543211) - Karnataka, Textile');
    console.log('   3. Test Artisan (+14155238886) - For WhatsApp testing\n');
    console.log('🛍️ Sample products: 2 products created\n');
    console.log('🌐 View in Prisma Studio: http://localhost:51212');
    console.log('🌐 View on website: http://localhost:3000/products');

  } catch (error) {
    console.error('❌ Error adding test data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
