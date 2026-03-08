import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({ adapter });

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

  // Create artisans for all 24 products
  const artisans = await Promise.all([
    // Textiles (4 artisans)
    prisma.artisan.upsert({
      where: { phone: '+919876543201' },
      update: {},
      create: {
        name: 'Priya Textiles',
        phone: '+919876543201',
        whatsappNumber: '+919876543201',
        craftType: 'Textile',
        region: 'Karnataka',
        language: 'kannada',
        status: 'verified',
        bio: 'Master weaver specializing in traditional hand-woven sarees with intricate patterns passed down through generations.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543202' },
      update: {},
      create: {
        name: 'Sharma Weaves',
        phone: '+919876543202',
        whatsappNumber: '+919876543202',
        craftType: 'Textile',
        region: 'Gujarat',
        language: 'gujarati',
        status: 'verified',
        bio: 'Organic cotton specialist creating sustainable and eco-friendly textiles using traditional weaving techniques.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543203' },
      update: {},
      create: {
        name: 'Kashmir Silks',
        phone: '+919876543203',
        whatsappNumber: '+919876543203',
        craftType: 'Textile',
        region: 'Kashmir',
        language: 'kashmiri',
        status: 'verified',
        bio: 'Renowned silk artisan crafting luxurious Kashmiri shawls with traditional embroidery and patterns.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543204' },
      update: {},
      create: {
        name: 'Rajasthani Arts',
        phone: '+919876543204',
        whatsappNumber: '+919876543204',
        craftType: 'Textile',
        region: 'Rajasthan',
        language: 'hindi',
        status: 'verified',
        bio: 'Expert in traditional Rajasthani block printing, creating vibrant fabrics with natural dyes and hand-carved blocks.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),

    // Pottery (4 artisans)
    prisma.artisan.upsert({
      where: { phone: '+919876543205' },
      update: {},
      create: {
        name: 'Rajesh Ceramics',
        phone: '+919876543205',
        whatsappNumber: '+919876543205',
        craftType: 'Pottery',
        region: 'Tamil Nadu',
        language: 'tamil',
        status: 'verified',
        bio: 'Traditional terracotta potter creating functional and decorative pieces using ancient Tamil pottery techniques.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543206' },
      update: {},
      create: {
        name: 'Khurja Crafts',
        phone: '+919876543206',
        whatsappNumber: '+919876543206',
        craftType: 'Pottery',
        region: 'Uttar Pradesh',
        language: 'hindi',
        status: 'verified',
        bio: 'Master of Khurja blue pottery, famous for its distinctive Persian-influenced designs and vibrant colors.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543207' },
      update: {},
      create: {
        name: 'Delhi Ceramics',
        phone: '+919876543207',
        whatsappNumber: '+919876543207',
        craftType: 'Pottery',
        region: 'Delhi',
        language: 'hindi',
        status: 'verified',
        bio: 'Contemporary ceramic artist blending traditional techniques with modern designs in hand-painted pottery.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543208' },
      update: {},
      create: {
        name: 'Jaipur Pottery',
        phone: '+919876543208',
        whatsappNumber: '+919876543208',
        craftType: 'Pottery',
        region: 'Rajasthan',
        language: 'hindi',
        status: 'verified',
        bio: 'Specialist in earthenware and traditional Jaipur pottery, creating functional dining sets with artistic flair.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),

    // Jewelry (4 artisans)
    prisma.artisan.upsert({
      where: { phone: '+919876543209' },
      update: {},
      create: {
        name: 'Meera Jewelry',
        phone: '+919876543209',
        whatsappNumber: '+919876543209',
        craftType: 'Jewelry',
        region: 'Rajasthan',
        language: 'hindi',
        status: 'verified',
        bio: 'Expert Kundan jewelry artisan creating exquisite pieces using traditional gem-setting techniques.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543210' },
      update: {},
      create: {
        name: 'Jaipur Jewels',
        phone: '+919876543210',
        whatsappNumber: '+919876543210',
        craftType: 'Jewelry',
        region: 'Rajasthan',
        language: 'hindi',
        status: 'verified',
        bio: 'Master of Meenakari enamel work, creating colorful and intricate jewelry pieces with traditional designs.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543211' },
      update: {},
      create: {
        name: 'South Indian Arts',
        phone: '+919876543211',
        whatsappNumber: '+919876543211',
        craftType: 'Jewelry',
        region: 'Tamil Nadu',
        language: 'tamil',
        status: 'verified',
        bio: 'Specialist in traditional South Indian temple jewelry, crafting ornate pieces inspired by ancient temple art.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543212' },
      update: {},
      create: {
        name: 'Silversmith Studio',
        phone: '+919876543212',
        whatsappNumber: '+919876543212',
        craftType: 'Jewelry',
        region: 'Odisha',
        language: 'odia',
        status: 'verified',
        bio: 'Traditional silversmith creating elegant silver jewelry using ancient filigree and casting techniques.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),

    // Woodcraft (4 artisans)
    prisma.artisan.upsert({
      where: { phone: '+919876543213' },
      update: {},
      create: {
        name: 'Kumar Woodcraft',
        phone: '+919876543213',
        whatsappNumber: '+919876543213',
        craftType: 'Woodcraft',
        region: 'Kerala',
        language: 'malayalam',
        status: 'verified',
        bio: 'Master wood carver specializing in intricate panels and sculptures inspired by Kerala temple architecture.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543214' },
      update: {},
      create: {
        name: 'Mysore Crafts',
        phone: '+919876543214',
        whatsappNumber: '+919876543214',
        craftType: 'Woodcraft',
        region: 'Karnataka',
        language: 'kannada',
        status: 'verified',
        bio: 'Expert in sandalwood carving, creating aromatic and beautifully crafted boxes and decorative items.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543215' },
      update: {},
      create: {
        name: 'Handicraft Studio',
        phone: '+919876543215',
        whatsappNumber: '+919876543215',
        craftType: 'Woodcraft',
        region: 'Uttar Pradesh',
        language: 'hindi',
        status: 'verified',
        bio: 'Skilled woodworker creating functional and decorative wooden boxes with traditional joinery techniques.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543216' },
      update: {},
      create: {
        name: 'Agra Handicrafts',
        phone: '+919876543216',
        whatsappNumber: '+919876543216',
        craftType: 'Woodcraft',
        region: 'Uttar Pradesh',
        language: 'hindi',
        status: 'verified',
        bio: 'Master of marble and wood inlay work, creating stunning furniture pieces inspired by Mughal artistry.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),

    // Metalwork (4 artisans)
    prisma.artisan.upsert({
      where: { phone: '+919876543217' },
      update: {},
      create: {
        name: 'Moradabad Brass',
        phone: '+919876543217',
        whatsappNumber: '+919876543217',
        craftType: 'Metalwork',
        region: 'Uttar Pradesh',
        language: 'hindi',
        status: 'verified',
        bio: 'Traditional brass artisan from Moradabad, creating decorative diyas and religious items with intricate designs.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543218' },
      update: {},
      create: {
        name: 'Madhya Pradesh Crafts',
        phone: '+919876543218',
        whatsappNumber: '+919876543218',
        craftType: 'Metalwork',
        region: 'Madhya Pradesh',
        language: 'hindi',
        status: 'verified',
        bio: 'Expert coppersmith creating traditional utensils and cookware using time-honored metalworking techniques.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543219' },
      update: {},
      create: {
        name: 'Rajasthan Ironwork',
        phone: '+919876543219',
        whatsappNumber: '+919876543219',
        craftType: 'Metalwork',
        region: 'Rajasthan',
        language: 'hindi',
        status: 'verified',
        bio: 'Skilled ironworker creating decorative wall hangings and functional items with traditional Rajasthani motifs.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543220' },
      update: {},
      create: {
        name: 'Art Foundry India',
        phone: '+919876543220',
        whatsappNumber: '+919876543220',
        craftType: 'Metalwork',
        region: 'Tamil Nadu',
        language: 'tamil',
        status: 'verified',
        bio: 'Master bronze sculptor creating traditional and contemporary sculptures using ancient lost-wax casting methods.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),

    // Paintings (4 artisans)
    prisma.artisan.upsert({
      where: { phone: '+919876543221' },
      update: {},
      create: {
        name: 'Anita Art Studio',
        phone: '+919876543221',
        whatsappNumber: '+919876543221',
        craftType: 'Painting',
        region: 'Rajasthan',
        language: 'hindi',
        status: 'verified',
        bio: 'Expert miniature painter specializing in Mughal-style paintings with intricate details and gold leaf work.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543222' },
      update: {},
      create: {
        name: 'Bihar Art Collective',
        phone: '+919876543222',
        whatsappNumber: '+919876543222',
        craftType: 'Painting',
        region: 'Bihar',
        language: 'hindi',
        status: 'verified',
        bio: 'Traditional Madhubani artist creating vibrant folk art with natural pigments and traditional motifs.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543223' },
      update: {},
      create: {
        name: 'Tribal Arts',
        phone: '+919876543223',
        whatsappNumber: '+919876543223',
        craftType: 'Painting',
        region: 'Maharashtra',
        language: 'marathi',
        status: 'verified',
        bio: 'Warli art specialist preserving ancient tribal painting traditions with geometric patterns and nature themes.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
    prisma.artisan.upsert({
      where: { phone: '+919876543224' },
      update: {},
      create: {
        name: 'South Indian Gallery',
        phone: '+919876543224',
        whatsappNumber: '+919876543224',
        craftType: 'Painting',
        region: 'Tamil Nadu',
        language: 'tamil',
        status: 'verified',
        bio: 'Master Tanjore painter creating classical South Indian art with gold foil embellishments and rich colors.',
        verifiedAt: new Date(),
        verifiedBy: admin.id
      }
    }),
  ]);

  console.log('✅ Created 24 artisan profiles');

  // Create all 24 products
  const productData = [
    { idx: 0, id: 'ART-KAR-TEX-001', title: 'Hand-Woven Saree', desc: 'Exquisite hand-woven saree crafted with traditional techniques.', price: 450000, mat: ['Silk', 'Cotton'], colors: ['Red', 'Gold'], tags: ['textiles', 'saree', 'handwoven'] },
    { idx: 1, id: 'ART-GUJ-TEX-002', title: 'Organic Cotton Dupatta', desc: 'Sustainable organic cotton dupatta.', price: 220000, mat: ['Cotton'], colors: ['White', 'Beige'], tags: ['textiles', 'dupatta', 'organic'] },
    { idx: 2, id: 'ART-KAS-TEX-003', title: 'Silk Shawl', desc: 'Luxurious Kashmiri silk shawl.', price: 890000, mat: ['Silk'], colors: ['Burgundy', 'Gold'], tags: ['textiles', 'shawl', 'silk'] },
    { idx: 3, id: 'ART-RAJ-TEX-004', title: 'Block Print Fabric', desc: 'Traditional Rajasthani block-printed fabric.', price: 180000, mat: ['Cotton'], colors: ['Blue', 'Red'], tags: ['textiles', 'fabric', 'blockprint'] },
    { idx: 4, id: 'ART-TN-POT-005', title: 'Terracotta Pot Set', desc: 'Beautiful terracotta pots.', price: 320000, mat: ['Terracotta'], colors: ['Red', 'Brown'], tags: ['pottery', 'terracotta', 'pots'] },
    { idx: 5, id: 'ART-UP-POT-006', title: 'Blue Pottery Bowl', desc: 'Stunning Khurja blue pottery bowl.', price: 280000, mat: ['Ceramic'], colors: ['Blue', 'White'], tags: ['pottery', 'bluepottery', 'bowl'] },
    { idx: 6, id: 'ART-DEL-POT-007', title: 'Hand-Painted Vase', desc: 'Contemporary ceramic vase.', price: 460000, mat: ['Ceramic'], colors: ['Multicolor'], tags: ['pottery', 'vase', 'handpainted'] },
    { idx: 7, id: 'ART-RAJ-POT-008', title: 'Earthen Dinner Set', desc: 'Complete earthenware dinner set.', price: 580000, mat: ['Earthenware'], colors: ['Brown', 'Cream'], tags: ['pottery', 'dinnerware'] },
    { idx: 8, id: 'ART-RAJ-JEW-009', title: 'Kundan Necklace', desc: 'Exquisite Kundan necklace.', price: 890000, mat: ['Gold', 'Kundan'], colors: ['Gold', 'Red'], tags: ['jewelry', 'kundan', 'necklace'] },
    { idx: 9, id: 'ART-RAJ-JEW-010', title: 'Meenakari Earrings', desc: 'Beautiful Meenakari earrings.', price: 350000, mat: ['Gold', 'Enamel'], colors: ['Blue', 'Green'], tags: ['jewelry', 'meenakari', 'earrings'] },
    { idx: 10, id: 'ART-TN-JEW-011', title: 'Temple Jewelry Set', desc: 'Ornate temple jewelry set.', price: 620000, mat: ['Gold'], colors: ['Gold', 'Red'], tags: ['jewelry', 'temple', 'traditional'] },
    { idx: 11, id: 'ART-OD-JEW-012', title: 'Silver Bangles', desc: 'Elegant silver bangles.', price: 440000, mat: ['Silver'], colors: ['Silver'], tags: ['jewelry', 'silver', 'bangles'] },
    { idx: 12, id: 'ART-KER-WOOD-013', title: 'Carved Wooden Panel', desc: 'Intricate wooden panel.', price: 560000, mat: ['Teak'], colors: ['Brown'], tags: ['woodcraft', 'carving', 'panel'] },
    { idx: 13, id: 'ART-KAR-WOOD-014', title: 'Sandalwood Box', desc: 'Beautifully crafted sandalwood box.', price: 390000, mat: ['Sandalwood'], colors: ['Light Brown'], tags: ['woodcraft', 'sandalwood', 'box'] },
    { idx: 14, id: 'ART-UP-WOOD-015', title: 'Wooden Jewelry Box', desc: 'Functional wooden jewelry box.', price: 280000, mat: ['Sheesham'], colors: ['Dark Brown'], tags: ['woodcraft', 'box', 'jewelry'] },
    { idx: 15, id: 'ART-UP-WOOD-016', title: 'Inlay Work Table', desc: 'Stunning inlay work table.', price: 1250000, mat: ['Wood', 'Marble'], colors: ['Brown', 'White'], tags: ['woodcraft', 'inlay', 'table'] },
    { idx: 16, id: 'ART-UP-MET-017', title: 'Brass Diya Set', desc: 'Traditional brass diya set.', price: 220000, mat: ['Brass'], colors: ['Gold'], tags: ['metalwork', 'brass', 'diya'] },
    { idx: 17, id: 'ART-MP-MET-018', title: 'Copper Utensil Set', desc: 'Traditional copper utensil set.', price: 540000, mat: ['Copper'], colors: ['Copper'], tags: ['metalwork', 'copper', 'utensils'] },
    { idx: 18, id: 'ART-RAJ-MET-019', title: 'Iron Wall Hanging', desc: 'Decorative iron wall hanging.', price: 380000, mat: ['Iron'], colors: ['Black'], tags: ['metalwork', 'iron', 'wallart'] },
    { idx: 19, id: 'ART-TN-MET-020', title: 'Bronze Sculpture', desc: 'Magnificent bronze sculpture.', price: 890000, mat: ['Bronze'], colors: ['Bronze'], tags: ['metalwork', 'bronze', 'sculpture'] },
    { idx: 20, id: 'ART-RAJ-PAINT-021', title: 'Miniature Mughal Painting', desc: 'Exquisite miniature painting.', price: 680000, mat: ['Paper', 'Gold Leaf'], colors: ['Gold', 'Red'], tags: ['painting', 'miniature', 'mughal'] },
    { idx: 21, id: 'ART-BIH-PAINT-022', title: 'Madhubani Artwork', desc: 'Vibrant Madhubani folk art.', price: 420000, mat: ['Paper'], colors: ['Red', 'Yellow'], tags: ['painting', 'madhubani', 'folkart'] },
    { idx: 22, id: 'ART-MAH-PAINT-023', title: 'Warli Painting', desc: 'Traditional Warli tribal art.', price: 360000, mat: ['Paper'], colors: ['White', 'Red'], tags: ['painting', 'warli', 'tribal'] },
    { idx: 23, id: 'ART-TN-PAINT-024', title: 'Tanjore Painting', desc: 'Classical Tanjore painting.', price: 920000, mat: ['Wood', 'Gold Foil'], colors: ['Gold', 'Red'], tags: ['painting', 'tanjore', 'traditional'] },
  ];

  for (const p of productData) {
    await prisma.product.create({
      data: {
        artisanId: artisans[p.idx].id,
        productId: p.id,
        title: p.title,
        description: p.desc,
        artisanStory: `${artisans[p.idx].name} creates beautiful ${p.title.toLowerCase()} using traditional techniques.`,
        culturalContext: `Traditional Indian craftsmanship at its finest.`,
        material: p.mat,
        colors: p.colors,
        tags: p.tags,
        price: p.price,
        currency: 'INR',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        qrCodeUrl: 'https://placeholder.com/qr',
        aiGeneratedFields: ['description', 'artisanStory']
      }
    });
  }

  console.log('✅ Created 24 products across 6 categories');

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
    await pool.end();
  });
