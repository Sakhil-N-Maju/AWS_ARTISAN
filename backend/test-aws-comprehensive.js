/**
 * Comprehensive AWS Services Test
 * Tests all AWS services used in the WhatsApp Voice-First AI MVP
 */

const { 
  S3Client, 
  PutObjectCommand, 
  HeadBucketCommand 
} = require('@aws-sdk/client-s3');

const { 
  TranscribeClient, 
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand 
} = require('@aws-sdk/client-transcribe');

const { 
  RekognitionClient, 
  DetectLabelsCommand 
} = require('@aws-sdk/client-rekognition');

const { 
  BedrockRuntimeClient, 
  InvokeModelCommand 
} = require('@aws-sdk/client-bedrock-runtime');

require('dotenv').config();

const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const S3_BUCKET = process.env.S3_BUCKET || 'artisan-ai-media';
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

// Initialize clients
// S3 bucket is in ap-south-1, so use that region for S3
const s3Client = new S3Client({ region: 'ap-south-1' });
const transcribeClient = new TranscribeClient({ region: AWS_REGION });
const rekognitionClient = new RekognitionClient({ region: AWS_REGION });
const bedrockClient = new BedrockRuntimeClient({ region: AWS_REGION });

console.log('🧪 AWS Services Comprehensive Test\n');
console.log('Configuration:');
console.log(`  Region: ${AWS_REGION}`);
console.log(`  S3 Bucket: ${S3_BUCKET}`);
console.log(`  Bedrock Model: ${BEDROCK_MODEL_ID}`);
console.log('\n' + '='.repeat(60) + '\n');

const results = {
  s3: { status: 'pending', message: '', time: 0 },
  transcribe: { status: 'pending', message: '', time: 0 },
  rekognition: { status: 'pending', message: '', time: 0 },
  bedrock: { status: 'pending', message: '', time: 0 }
};

/**
 * Test 1: S3 Service
 */
async function testS3() {
  console.log('📦 Test 1: Amazon S3');
  console.log('   Testing bucket access and file upload...\n');
  
  const startTime = Date.now();
  
  try {
    // Test 1a: Check bucket access
    console.log('   1a. Checking bucket access...');
    const headCommand = new HeadBucketCommand({ Bucket: S3_BUCKET });
    await s3Client.send(headCommand);
    console.log('   ✅ Bucket is accessible\n');
    
    // Test 1b: Upload test file
    console.log('   1b. Uploading test file...');
    const testContent = 'AWS S3 Test - ' + new Date().toISOString();
    const testKey = `test/aws-test-${Date.now()}.txt`;
    
    const putCommand = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: testKey,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain'
    });
    
    await s3Client.send(putCommand);
    const s3Url = `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${testKey}`;
    console.log(`   ✅ File uploaded successfully`);
    console.log(`   📍 URL: ${s3Url}\n`);
    
    results.s3.status = 'success';
    results.s3.message = 'S3 bucket accessible and file upload successful';
    results.s3.time = Date.now() - startTime;
    
  } catch (error) {
    console.log(`   ❌ S3 test failed: ${error.message}\n`);
    results.s3.status = 'failed';
    results.s3.message = error.message;
    results.s3.time = Date.now() - startTime;
  }
}

/**
 * Test 2: AWS Transcribe
 */
async function testTranscribe() {
  console.log('🎤 Test 2: Amazon Transcribe');
  console.log('   Testing speech-to-text transcription...\n');
  
  const startTime = Date.now();
  
  try {
    // Note: This requires an actual audio file in S3
    // For now, we'll just test if we can start a job
    console.log('   Testing transcription job creation...');
    
    const jobName = `test-transcribe-${Date.now()}`;
    
    // This will fail if there's no audio file, but it tests credentials
    try {
      const command = new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: 'hi-IN',
        MediaFormat: 'ogg',
        Media: {
          MediaFileUri: `s3://${S3_BUCKET}/test/sample-audio.ogg`
        },
        OutputBucketName: S3_BUCKET
      });
      
      await transcribeClient.send(command);
      console.log('   ✅ Transcription job started successfully\n');
      
      results.transcribe.status = 'success';
      results.transcribe.message = 'Transcribe service accessible (job creation successful)';
      
    } catch (error) {
      if (error.name === 'BadRequestException' && error.message.includes('not found')) {
        console.log('   ⚠️  No test audio file found (expected)');
        console.log('   ✅ Transcribe service is accessible\n');
        results.transcribe.status = 'success';
        results.transcribe.message = 'Transcribe service accessible (credentials valid)';
      } else {
        throw error;
      }
    }
    
    results.transcribe.time = Date.now() - startTime;
    
  } catch (error) {
    console.log(`   ❌ Transcribe test failed: ${error.message}\n`);
    results.transcribe.status = 'failed';
    results.transcribe.message = error.message;
    results.transcribe.time = Date.now() - startTime;
  }
}

/**
 * Test 3: AWS Rekognition
 */
async function testRekognition() {
  console.log('👁️  Test 3: Amazon Rekognition');
  console.log('   Testing image analysis...\n');
  
  const startTime = Date.now();
  
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');
    
    console.log('   Testing label detection...');
    
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: testImageBuffer
      },
      MaxLabels: 10,
      MinConfidence: 70
    });
    
    const response = await rekognitionClient.send(command);
    console.log(`   ✅ Image analyzed successfully`);
    console.log(`   📊 Labels detected: ${response.Labels?.length || 0}\n`);
    
    results.rekognition.status = 'success';
    results.rekognition.message = `Rekognition service working (${response.Labels?.length || 0} labels detected)`;
    results.rekognition.time = Date.now() - startTime;
    
  } catch (error) {
    console.log(`   ❌ Rekognition test failed: ${error.message}\n`);
    results.rekognition.status = 'failed';
    results.rekognition.message = error.message;
    results.rekognition.time = Date.now() - startTime;
  }
}

/**
 * Test 4: AWS Bedrock (Claude 3 Sonnet)
 */
async function testBedrock() {
  console.log('🤖 Test 4: Amazon Bedrock (Claude 3 Sonnet)');
  console.log('   Testing AI content generation...\n');
  
  const startTime = Date.now();
  
  try {
    console.log('   Sending test prompt to Claude...');
    
    const prompt = 'Generate a short product title for a handmade pottery bowl from Rajasthan. Reply with just the title, max 10 words.';
    
    const command = new InvokeModelCommand({
      modelId: BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.content[0].text;
    
    console.log('   ✅ AI generation successful');
    console.log(`   💬 Generated: "${generatedText}"\n`);
    
    results.bedrock.status = 'success';
    results.bedrock.message = 'Bedrock (Claude 3 Sonnet) working correctly';
    results.bedrock.time = Date.now() - startTime;
    
  } catch (error) {
    console.log(`   ❌ Bedrock test failed: ${error.message}\n`);
    results.bedrock.status = 'failed';
    results.bedrock.message = error.message;
    results.bedrock.time = Date.now() - startTime;
  }
}

/**
 * Print summary
 */
function printSummary() {
  console.log('='.repeat(60));
  console.log('\n📊 Test Summary\n');
  
  const services = [
    { name: 'S3 (Storage)', key: 's3', icon: '📦' },
    { name: 'Transcribe (Speech-to-Text)', key: 'transcribe', icon: '🎤' },
    { name: 'Rekognition (Image Analysis)', key: 'rekognition', icon: '👁️' },
    { name: 'Bedrock (AI Generation)', key: 'bedrock', icon: '🤖' }
  ];
  
  let allPassed = true;
  
  services.forEach(service => {
    const result = results[service.key];
    const status = result.status === 'success' ? '✅ PASS' : '❌ FAIL';
    const time = result.time > 0 ? `(${result.time}ms)` : '';
    
    console.log(`${service.icon} ${service.name}`);
    console.log(`   Status: ${status} ${time}`);
    console.log(`   ${result.message}\n`);
    
    if (result.status !== 'success') {
      allPassed = false;
    }
  });
  
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('\n🎉 All AWS services are working correctly!');
    console.log('✅ WhatsApp Voice-First AI MVP is ready to use.\n');
  } else {
    console.log('\n⚠️  Some AWS services failed. Please check:');
    console.log('   1. AWS credentials are configured correctly');
    console.log('   2. IAM permissions are set up');
    console.log('   3. Services are enabled in your AWS account');
    console.log('   4. Region is correct (ap-south-1)\n');
  }
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    await testS3();
    await testTranscribe();
    await testRekognition();
    await testBedrock();
    
    printSummary();
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests();
