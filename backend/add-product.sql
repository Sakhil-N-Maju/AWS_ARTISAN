INSERT INTO products (
  id, "artisanId", "productId", title, description, "artisanStory", 
  "culturalContext", material, colors, tags, price, currency, 
  images, status, "publishedAt", "qrCodeUrl", "aiGeneratedFields",
  "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  id,
  'ART-KER-MET-001',
  'Handcrafted Aranmula Kannadi Mirror',
  'A stunning traditional mirror crafted using ancient metallurgical techniques passed down through generations.',
  'Rajesh Kumar learned this sacred craft from his grandfather.',
  'Aranmula Kannadi is a handmade metal-alloy mirror from Kerala.',
  ARRAY['Bronze', 'Copper', 'Tin'],
  ARRAY['Gold', 'Bronze'],
  ARRAY['mirror', 'metal', 'traditional', 'kerala'],
  850000,
  'INR',
  ARRAY[]::jsonb[],
  'published',
  NOW(),
  'https://placeholder.com/qr',
  ARRAY['title', 'description', 'artisanStory'],
  NOW(),
  NOW()
FROM artisans WHERE phone = '+919876543210'
RETURNING "productId", title, price;
