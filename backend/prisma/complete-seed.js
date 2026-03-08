const fs = require('fs');

const productsData = `
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
        artisanStory: \`\${artisans[p.idx].name} creates beautiful \${p.title.toLowerCase()} using traditional techniques.\`,
        culturalContext: \`Traditional Indian craftsmanship at its finest.\`,
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

  console.log('\\n🎉 Seeding completed successfully!');
  console.log('\\n📝 Login credentials:');
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
`;

fs.appendFileSync('seed.ts', productsData);
console.log('✅ Completed seed.ts file');
