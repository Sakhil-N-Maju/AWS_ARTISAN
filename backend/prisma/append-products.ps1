$productsCode = @'

  // Create all 24 products with rich descriptions
  await prisma.product.createMany({
    data: [
      {
        artisanId: artisans[0].id,
        productId: 'ART-KAR-TEX-001',
        title: 'Hand-Woven Saree',
        description: 'Exquisite hand-woven saree crafted with traditional techniques passed down through generations.',
        artisanStory: 'Priya Textiles has been weaving traditional sarees for over 20 years.',
        culturalContext: 'Hand-woven sarees represent centuries of Indian textile tradition.',
        material: ['Silk', 'Cotton', 'Zari'],
        colors: ['Red', 'Gold', 'Green'],
        tags: ['textiles', 'saree', 'handwoven', 'traditional', 'karnataka'],
        price: 450000,
        currency: 'INR',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        qrCodeUrl: 'https://placeholder.com/qr',
        aiGeneratedFields: ['description', 'artisanStory']
      },
      {
        artisanId: artisans[1].id,
        productId: 'ART-GUJ-TEX-002',
        title: 'Organic Cotton Dupatta',
        description: 'Sustainable and eco-friendly organic cotton dupatta woven with traditional techniques.',
        artisanStory: 'Sharma Weaves is committed to sustainable textile production.',
        culturalContext: 'Organic cotton weaving represents a return to traditional practices.',
        material: ['Organic Cotton'],
        colors: ['White', 'Beige', 'Natural'],
        tags: ['textiles', 'dupatta', 'organic', 'sustainable', 'gujarat'],
        price: 220000,
        currency: 'INR',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        qrCodeUrl: 'https://placeholder.com/qr',
        aiGeneratedFields: ['description', 'artisanStory']
      },
      {
        artisanId: artisans[2].id,
        productId: 'ART-KAS-TEX-003',
        title: 'Silk Shawl',
        description: 'Luxurious Kashmiri silk shawl featuring traditional embroidery and patterns.',
        artisanStory: 'Kashmir Silks continues a family tradition spanning five generations.',
        culturalContext: 'Kashmiri silk shawls are renowned globally for their exceptional quality.',
        material: ['Silk', 'Pashmina'],
        colors: ['Burgundy', 'Gold', 'Cream'],
        tags: ['textiles', 'shawl', 'silk', 'kashmir', 'luxury'],
        price: 890000,
        currency: 'INR',
        images: [],
        status: 'published',
        publishedAt: new Date(),
        qrCodeUrl: 'https://placeholder.com/qr',
        aiGeneratedFields: ['description', 'artisanStory']
      },
'@

Add-Content -Path "seed.ts" -Value $productsCode
Write-Host "Appended products section"
