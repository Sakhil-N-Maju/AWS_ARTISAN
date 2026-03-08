// Test script for AWS services
require('dotenv').config();
const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { RekognitionClient, DetectLabelsCommand } = require('@aws-sdk/client-rekognition');
const { TranscribeClient, ListTranscriptionJobsCommand } = require('@aws-sdk/client-transcribe');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET = process.env.S3_BUCKET;

console.log('🧪 Testing AWS Services...\n');
console.log('Configuration:');
console.log('- Region:', AWS_REGION);
console.log('- Access Key:', AWS_ACCESS_KEY_ID ? `${AWS_ACCESS_KEY_ID.substring(0, 8)}...` : 'NOT SET');
console.log('- S3 Bucket:', S3_BUCKET);
console.log('\n' + '='.repeat(60) + '\n');

const awsConfig = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
};

// Test 1: S3
async function testS3() {
  console.log('1️⃣  Testing S3...');
  try {
    const s3Client = new S3Client(awsConfig);
    
    // List buckets
    const listCommand = new ListBucketsCommand({});
    const response = await s3Client.send(listCommand);
    
    console.log('   ✅ S3 Connection: SUCCESS');
    console.log(`   📦 Found ${response.Buckets.length} buckets`);
    
    // Check if our bucket exists
    const bucketExists = response.Buckets.some(b => b.Name === S3_BUCKET);
    if (bucketExists) {
      console.log(`   ✅ Bucket "${S3_BUCKET}" exists`);
    } else {
      console.log(`   ⚠️  Bucket "${S3_BUCKET}" not found`);
      console.log('   Available buckets:', response.Buckets.map(b => b.Name).join(', '));
    }
    
    // Try to upload a test file
    try {
      const testContent = 'Test file from AWS service test';
      const uploadCommand = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: 'test/test-file.txt',
        Body: testContent,
        ContentType: 'text/plain'
      });
      
      await s3Client.send(uploadCommand);
      console.log('   ✅ File upload: SUCCESS');
    } catch (uploadError) {
      console.log('   ❌ File upload: FAILED');
      console.log('   Error:', uploadError.message);
    }
    
    return true;
  } catch (error) {
    console.log('   ❌ S3 Connection: FAILED');
    console.log('   Error:', error.message);
    return false;
  }
}

// Test 2: Rekognition
async function testRekognition() {
  console.log('\n2️⃣  Testing Rekognition...');
  try {
    const rekognitionClient = new RekognitionClient(awsConfig);
    
    // Create a simple 1x1 pixel image (base64 encoded PNG)
    const testImage = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: testImage
      },
      MaxLabels: 5
    });
    
    const response = await rekognitionClient.send(command);
    console.log('   ✅ Rekognition Connection: SUCCESS');
    console.log(`   🏷️  Detected ${response.Labels.length} labels`);
    
    return true;
  } catch (error) {
    console.log('   ❌ Rekognition Connection: FAILED');
    console.log('   Error:', error.message);
    
    if (error.message.includes('not subscribed')) {
      console.log('   💡 Tip: Enable Rekognition in AWS Console');
    }
    
    return false;
  }
}

// Test 3: Transcribe
async function testTranscribe() {
  console.log('\n3️⃣  Testing Transcribe...');
  try {
    const transcribeClient = new TranscribeClient(awsConfig);
    
    // Just list jobs to test connection
    const command = new ListTranscriptionJobsCommand({
      MaxResults: 1
    });
    
    const response = await transcribeClient.send(command);
    console.log('   ✅ Transcribe Connection: SUCCESS');
    console.log(`   🎤 Found ${response.TranscriptionJobSummaries?.length || 0} recent jobs`);
    
    return true;
  } catch (error) {
    console.log('   ❌ Transcribe Connection: FAILED');
    console.log('   Error:', error.message);
    
    if (error.message.includes('not subscribed')) {
      console.log('   💡 Tip: Enable Transcribe in AWS Console');
    }
    
    return false;
  }
}

// Test 4: Bedrock (Claude)
async function testBedrock() {
  console.log('\n4️⃣  Testing Bedrock (Claude AI)...');
  try {
    const bedrockClient = new BedrockRuntimeClient(awsConfig);
    
    const prompt = 'Hello! Please respond with just "OK" to confirm you are working.';
    
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
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
    
    console.log('   ✅ Bedrock Connection: SUCCESS');
    console.log('   🤖 Claude Response:', responseBody.content[0].text);
    
    return true;
  } catch (error) {
    console.log('   ❌ Bedrock Connection: FAILED');
    console.log('   Error:', error.message);
    
    if (error.message.includes('not subscribed') || error.message.includes('access')) {
      console.log('   💡 Tip: Enable Bedrock and request Claude model access in AWS Console');
      console.log('   📝 Go to: AWS Console → Bedrock → Model access → Request access');
    }
    
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    s3: false,
    rekognition: false,
    transcribe: false,
    bedrock: false
  };
  
  results.s3 = await testS3();
  results.rekognition = await testRekognition();
  results.transcribe = await testTranscribe();
  results.bedrock = await testBedrock();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary:\n');
  console.log(`   S3:           ${results.s3 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Rekognition:  ${results.rekognition ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Transcribe:   ${results.transcribe ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Bedrock:      ${results.bedrock ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  console.log('\n' + '='.repeat(60));
  
  if (allPassed) {
    console.log('\n🎉 All AWS services are working! You\'re ready to test WhatsApp!\n');
  } else {
    console.log('\n⚠️  Some services failed. Fix the issues before testing WhatsApp.\n');
    console.log('Common fixes:');
    console.log('1. Check AWS credentials in backend/.env');
    console.log('2. Verify IAM permissions for your access key');
    console.log('3. Enable services in AWS Console');
    console.log('4. Request Bedrock model access if needed\n');
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Test script failed:', error);
  process.exit(1);
});
