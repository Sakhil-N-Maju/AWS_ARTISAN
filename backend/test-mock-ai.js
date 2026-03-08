/**
 * Test Mock AI Generation
 * Tests the mock Bedrock service while waiting for AWS access
 */

const { mockBedrockService } = require('./dist/services/bedrock-mock.service');

console.log('🧪 Testing Mock AI Generation\n');
console.log('='.repeat(60));

async function testMockAI() {
  try {
    // Simulate artisan input
    const transcription = 'This is a beautiful handmade terracotta bowl with traditional Rajasthani designs. It took me three days to make this piece.';
    
    const imageAnalysis = {
      labels: ['Bowl', 'Pottery', 'Ceramic', 'Handmade'],
      colors: ['Terracotta', 'Brown', 'Orange'],
      dominantColor: 'Terracotta'
    };
    
    const artisan = {
      name: 'Rajesh Kumar',
      craftType: 'pottery',
      region: 'Rajasthan',
      language: 'hindi'
    };

    console.log('\n📝 Input:');
    console.log(`   Artisan: ${artisan.name} from ${artisan.region}`);
    console.log(`   Craft: ${artisan.craftType}`);
    console.log(`   Description: "${transcription.substring(0, 80)}..."`);
    console.log(`   Image labels: ${imageAnalysis.labels.join(', ')}`);
    console.log(`   Colors: ${imageAnalysis.colors.join(', ')}\n`);

    console.log('🤖 Generating product listing with Mock AI...\n');
    
    const startTime = Date.now();
    const listing = await mockBedrockService.generateListing(
      transcription,
      imageAnalysis,
      artisan
    );
    const processingTime = Date.now() - startTime;

    console.log('='.repeat(60));
    console.log('\n📦 Generated Product Listing:\n');
    
    console.log(`📌 Title:`);
    console.log(`   ${listing.title}\n`);
    
    console.log(`📝 Description:`);
    console.log(`   ${listing.description.substring(0, 300)}...\n`);
    
    console.log(`🏷️  Tags (${listing.tags.length}):`);
    console.log(`   ${listing.tags.slice(0, 10).join(', ')}\n`);
    
    console.log(`💰 Suggested Price:`);
    console.log(`   ₹${listing.suggestedPrice.min} - ₹${listing.suggestedPrice.max}\n`);
    
    console.log(`🎨 Material:`);
    console.log(`   ${listing.material}\n`);
    
    console.log(`📏 Dimensions:`);
    console.log(`   ${listing.dimensions}\n`);
    
    console.log(`🏛️  Cultural Context:`);
    console.log(`   ${listing.culturalContext.substring(0, 200)}...\n`);
    
    console.log(`👤 Artisan Story:`);
    console.log(`   ${listing.artisanStory.substring(0, 200)}...\n`);
    
    console.log('='.repeat(60));
    console.log(`\n✅ Mock AI Generation: SUCCESS`);
    console.log(`⏱️  Processing time: ${processingTime}ms`);
    console.log('\n💡 This is a mock service generating realistic listings.');
    console.log('   Once AWS Bedrock access is restored, switch to real AI.\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Compile TypeScript first, then run test
const { execSync } = require('child_process');

console.log('📦 Compiling TypeScript...\n');
try {
  execSync('npx tsc --skipLibCheck', { stdio: 'inherit' });
  console.log('\n✅ Compilation successful\n');
  testMockAI();
} catch (error) {
  console.error('❌ Compilation failed');
  process.exit(1);
}
