import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
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

  console.log('✅ Created admin user:', admin.email);

  // Create sample artisans
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

  const artisan3 = await prisma.artisan.upsert({
    where: { phone: '+919876543212' },
    update: {},
    create: {
      name: 'Amit Sharma',
      phone: '+919876543212',
      whatsappNumber: '+919876543212',
      craftType: 'Pottery',
      region: 'Uttar Pradesh',
      language: 'hindi',
      status: 'pending',
      bio: 'Traditional pottery maker from Varanasi.'
    }
  });

  console.log('✅ Created sample artisans');

  // Create sample products
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

  console.log('✅ Created sample products');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Email: admin@artisanai.com');
  console.log('   Password: admin123456');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
