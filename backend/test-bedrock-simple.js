/**
 * Simple Bedrock Test - Try different configurations
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

async function testBedrock(region, modelId) {
  console.log(`\n🧪 Testing Bedrock in ${region} with ${modelId}...`);
  
  const client = new BedrockRuntimeClient({ region });
  
  try {
    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: 'Say "Hello" in one word.'
        }]
      })
    });
    
    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log(`✅ SUCCESS in ${region}!`);
    console.log(`Response: ${result.content[0].text}`);
    return true;
    
  } catch (error) {
    console.log(`❌ FAILED in ${region}`);
    console.log(`Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🔍 Testing Bedrock Access Across Regions\n');
  console.log('='.repeat(60));
  
  const tests = [
    { region: 'us-east-1', model: 'anthropic.claude-3-sonnet-20240229-v1:0' },
    { region: 'us-west-2', model: 'anthropic.claude-3-sonnet-20240229-v1:0' },
    { region: 'ap-south-1', model: 'anthropic.claude-3-sonnet-20240229-v1:0' },
    { region: 'us-east-1', model: 'anthropic.claude-3-haiku-20240307-v1:0' }, // Cheaper alternative
  ];
  
  let anySuccess = false;
  
  for (const test of tests) {
    const success = await testBedrock(test.region, test.model);
    if (success) {
      anySuccess = true;
      console.log(`\n✅ Working configuration found!`);
      console.log(`   Region: ${test.region}`);
      console.log(`   Model: ${test.model}`);
      console.log(`\n💡 Update your .env file:`);
      console.log(`   AWS_REGION=${test.region}`);
      console.log(`   BEDROCK_MODEL_ID=${test.model}`);
      break;
    }
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  if (!anySuccess) {
    console.log('\n❌ All tests failed. This indicates an account-level issue.');
    console.log('\n📞 Next steps:');
    console.log('1. Contact AWS Support (link in error message above)');
    console.log('2. Check if your account is in good standing');
    console.log('3. Verify payment method is valid');
    console.log('4. Check if you have any account restrictions');
  }
}

runTests();
