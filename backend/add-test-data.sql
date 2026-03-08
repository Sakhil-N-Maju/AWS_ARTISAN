-- Add test data to database
-- Run this in Prisma Studio or via psql

-- 1. Add Admin User
INSERT INTO admins (id, email, name, password_hash, role, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@artisanai.com',
  'Admin User',
  '$2b$10$rKJ5VqZ9YqZ9YqZ9YqZ9YeZ9YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y',
  'super_admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 2. Add Test Artisan 1 (for WhatsApp testing with Twilio sandbox)
INSERT INTO artisans (id, name, phone, whatsapp_number, email, craft_type, region, language, status, bio, verified_at, verified_by, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Test Artisan',
  '+14155238886',
  '+14155238886',
  'test@artisan.com',
  'Pottery',
  'Maharashtra',
  'hindi',
  'verified',
  'Test artisan for WhatsApp integration testing',
  NOW(),
  (SELECT id FROM admins WHERE email = 'admin@artisanai.com' LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (phone) DO NOTHING;

-- 3. Add Test Artisan 2
INSERT INTO artisans (id, name, phone, whatsapp_number, email, craft_type, region, language, status, bio, verified_at, verified_by, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Rajesh Kumar',
  '+919876543210',
  '+919876543210',
  'rajesh@example.com',
  'Metal Craft',
  'Kerala',
  'malayalam',
  'verified',
  'Master craftsman specializing in traditional Aranmula Kannadi mirrors with 25 years of experience',
  NOW(),
  (SELECT id FROM admins WHERE email = 'admin@artisanai.com' LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (phone) DO NOTHING;

-- 4. Add Sample Product
INSERT INTO products (
  id, artisan_id, product_id, title, description, artisan_story, 
  cultural_context, material, colors, tags, price, currency, 
  images, status, published_at, qr_code_url, ai_generated_fields,
  created_at, updated_at
)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM artisans WHERE phone = '+919876543210' LIMIT 1),
  'ART-KER-MET-001',
  'Handcrafted Aranmula Kannadi Mirror',
  'A stunning traditional mirror crafted using ancient metallurgical techniques passed down through generations. This unique piece reflects not just your image but centuries of Kerala''s rich cultural heritage.',
  'Rajesh Kumar learned this sacred craft from his grandfather, maintaining the traditional methods that make each Aranmula Kannadi a masterpiece of Indian metallurgy.',
  'Aranmula Kannadi is a handmade metal-alloy mirror, made in Aranmula, Kerala. Unlike normal glass mirrors, it is a front surface reflection mirror, which eliminates secondary reflections.',
  ARRAY['Bronze', 'Copper', 'Tin'],
  ARRAY['Gold', 'Bronze'],
  ARRAY['mirror', 'metal', 'traditional', 'kerala', 'handcrafted'],
  850000,
  'INR',
  ARRAY[]::text[],
  'published',
  NOW(),
  'https://placeholder.com/qr',
  ARRAY['title', 'description', 'artisanStory'],
  NOW(),
  NOW()
);
