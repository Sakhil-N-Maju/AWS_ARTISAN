/**
 * Quick AI Generation Test
 * Tests the complete AI pipeline without voice transcription
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { RekognitionClient, DetectLabelsCommand } = require('@aws-sdk/client-rekognition');
require('dotenv').config();

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: process.env.AWS_REGION });

console.log('🧪 Testing AI Product Generation Pipeline\n');
console.log('='.repeat(60));

async function testAIGeneration() {
  try {
    // Simulate artisan input
    const artisanInput = {
      name: 'Rajesh Kumar',
      craftType: 'Pottery',
      region: 'Rajasthan',
      description: 'This is a beautiful handmade terracotta bowl with traditional designs',
      language: 'english'
    };

    console.log('\n📝 Artisan Input:');
    console.log(`   Name: ${artisanInput.name}`);
    console.log(`   Craft: ${artisanInput.craftType}`);
    console.log(`   Region: ${artisanInput.region}`);
    console.log(`   Description: "${artisanInput.description}"\n`);

    // Step 1: Simulate image analysis (using a test image)
    console.log('👁️  Step 1: Analyzing product image...');
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');
    
    const rekognitionCommand = new DetectLabelsCommand({
      Image: { Bytes: testImageBuffer },
      MaxLabels: 10,
      MinConfidence: 70
    });
    
    const imageAnalysis = await rekognitionClient.send(rekognitionCommand);
    console.log(`   ✅ Image analyzed (${imageAnalysis.Labels?.length || 0} labels detected)\n`);

    // Step 2: Generate product listing with AI
    console.log('🤖 Step 2: Generating product listing with AI...');
    
    const prompt = `You are an expert e-commerce content writer specializing in handcrafted artisan products from India.

Generate a professional product listing based on this information:

Artisan: ${artisanInput.name} from ${artisanInput.region}
Craft Type: ${artisanInput.craftType}
Description: ${artisanInput.description}

Generate a JSON response with:
1. title: Compelling product title (max 100 characters)
2. description: Detailed product description (200-300 words) highlighting craftsmanship, cultural significance, and unique features
3. tags: Array of 10-15 relevant tags
4. suggestedPrice: Object with min and max price in INR
5. material: Primary material used
6. culturalContext: Brief cultural background (2-3 sentences)

Format as valid JSON only, no additional text.`;

    const bedrockCommand = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const startTime = Date.now();
    const response = await bedrockClient.send(bedrockCommand);
    const processingTime = Date.now() - startTime;
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.content[0].text;
    
    console.log(`   ✅ AI generation completed in ${processingTime}ms\n`);

    // Parse the generated content
    console.log('📦 Generated Product Listing:\n');
    console.log('='.repeat(60));
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const listing = JSON.parse(jsonMatch[0]);
        
        console.log(`\n📌 Title:`);
        console.log(`   ${listing.title}\n`);
        
        console.log(`📝 Description:`);
        console.log(`   ${listing.description.substring(0, 200)}...\n`);
        
        console.log(`🏷️  Tags:`);
        console.log(`   ${listing.tags.slice(0, 8).join(', ')}\n`);
        
        console.log(`💰 Suggested Price:`);
        console.log(`   ₹${listing.suggestedPrice.min} - ₹${listing.suggestedPrice.max}\n`);
        
        console.log(`🎨 Material:`);
        console.log(`   ${listing.material}\n`);
        
        console.log(`🏛️  Cultural Context:`);
        console.log(`   ${listing.culturalContext}\n`);
        
      } else {
        console.log(generatedText);
      }
    } catch (parseError) {
      console.log('Raw AI Response:');
      console.log(generatedText);
    }

    console.log('='.repeat(60));
    console.log('\n✅ AI Generation Pipeline Test: SUCCESS');
    console.log(`⏱️  Total processing time: ${processingTime}ms`);
    console.log('\n🎉 Your AI system is working perfectly!');
    console.log('\nNext steps:');
    console.log('1. Test WhatsApp integration');
    console.log('2. Set up database');
    console.log('3. Contact AWS Support for Transcribe (optional)');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

// Run the test
testAIGeneration();
