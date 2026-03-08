/**
 * AWS SCP Diagnosis Script
 * Checks if Service Control Policies are blocking Bedrock/Marketplace access
 */

const { 
  OrganizationsClient, 
  DescribeOrganizationCommand,
  ListPoliciesForTargetCommand,
  DescribePolicyCommand 
} = require('@aws-sdk/client-organizations');

const { 
  CloudTrailClient, 
  LookupEventsCommand 
} = require('@aws-sdk/client-cloudtrail');

const { 
  STSClient, 
  GetCallerIdentityCommand 
} = require('@aws-sdk/client-sts');

require('dotenv').config();

const ACCOUNT_ID = '557211736798';

async function checkOrganization() {
  console.log('\n🔍 Checking AWS Organization Status...\n');
  console.log('='.repeat(60));
  
  const client = new OrganizationsClient({ region: 'us-east-1' });
  
  try {
    const command = new DescribeOrganizationCommand({});
    const response = await client.send(command);
    
    console.log('✅ Account is part of an AWS Organization');
    console.log(`   Organization ID: ${response.Organization.Id}`);
    console.log(`   Master Account: ${response.Organization.MasterAccountId}`);
    console.log(`   Master Email: ${response.Organization.MasterAccountEmail}`);
    
    console.log('\n⚠️  This is likely the root cause!');
    console.log('   Service Control Policies may be blocking Marketplace access.');
    
    return true;
  } catch (error) {
    if (error.name === 'AWSOrganizationsNotInUseException') {
      console.log('✅ Account is NOT in an Organization (standalone)');
      console.log('   SCP restrictions are NOT the issue.');
      return false;
    } else if (error.name === 'AccessDeniedException') {
      console.log('⚠️  Cannot check Organization status (access denied)');
      console.log('   You may not have permissions to view Organization details.');
      console.log('   Contact your AWS administrator.');
      return null;
    } else {
      console.log('❌ Error checking Organization:', error.message);
      return null;
    }
  }
}

async function checkSCPs() {
  console.log('\n🔍 Checking Service Control Policies...\n');
  console.log('='.repeat(60));
  
  const client = new OrganizationsClient({ region: 'us-east-1' });
  
  try {
    const command = new ListPoliciesForTargetCommand({
      TargetId: ACCOUNT_ID,
      Filter: 'SERVICE_CONTROL_POLICY'
    });
    
    const response = await client.send(command);
    
    if (!response.Policies || response.Policies.length === 0) {
      console.log('✅ No SCPs attached to this account');
      return [];
    }
    
    console.log(`Found ${response.Policies.length} SCP(s) attached:\n`);
    
    for (const policy of response.Policies) {
      console.log(`📋 Policy: ${policy.Name}`);
      console.log(`   ID: ${policy.Id}`);
      console.log(`   Type: ${policy.Type}`);
      
      // Try to get policy content
      try {
        const detailCommand = new DescribePolicyCommand({
          PolicyId: policy.Id
        });
        const detail = await client.send(detailCommand);
        const content = JSON.parse(detail.Policy.Content);
        
        // Check for marketplace restrictions
        const hasMarketplaceDeny = JSON.stringify(content).toLowerCase().includes('marketplace');
        
        if (hasMarketplaceDeny) {
          console.log('   ⚠️  Contains Marketplace restrictions!');
          console.log('   This policy may be blocking Bedrock access.');
        } else {
          console.log('   ✅ No obvious Marketplace restrictions');
        }
      } catch (err) {
        console.log('   ⚠️  Cannot read policy content (access denied)');
      }
      
      console.log('');
    }
    
    return response.Policies;
  } catch (error) {
    if (error.name === 'AccessDeniedException') {
      console.log('⚠️  Cannot list SCPs (access denied)');
      console.log('   Contact your Organization administrator.');
    } else {
      console.log('❌ Error checking SCPs:', error.message);
    }
    return null;
  }
}

async function checkCloudTrail() {
  console.log('\n🔍 Checking CloudTrail for Denied Events...\n');
  console.log('='.repeat(60));
  
  const client = new CloudTrailClient({ region: 'us-east-1' });
  
  try {
    // Check for marketplace subscribe events
    const command = new LookupEventsCommand({
      LookupAttributes: [
        {
          AttributeKey: 'EventName',
          AttributeValue: 'Subscribe'
        }
      ],
      MaxResults: 10
    });
    
    const response = await client.send(command);
    
    if (!response.Events || response.Events.length === 0) {
      console.log('ℹ️  No recent Subscribe events found in CloudTrail');
      return;
    }
    
    console.log(`Found ${response.Events.length} Subscribe event(s):\n`);
    
    for (const event of response.Events) {
      const eventData = JSON.parse(event.CloudTrailEvent);
      console.log(`📅 ${event.EventTime}`);
      console.log(`   Event: ${event.EventName}`);
      console.log(`   User: ${event.Username}`);
      
      if (eventData.errorCode) {
        console.log(`   ❌ Error: ${eventData.errorCode}`);
        console.log(`   Message: ${eventData.errorMessage}`);
        
        if (eventData.errorMessage && eventData.errorMessage.includes('service control policy')) {
          console.log('   🎯 FOUND IT! SCP is blocking this action!');
        }
      } else {
        console.log('   ✅ Success');
      }
      
      console.log('');
    }
  } catch (error) {
    console.log('⚠️  Cannot check CloudTrail:', error.message);
    console.log('   You may not have CloudTrail read permissions.');
  }
}

async function checkCallerIdentity() {
  console.log('\n🔍 Checking Current AWS Identity...\n');
  console.log('='.repeat(60));
  
  const client = new STSClient({ region: 'us-east-1' });
  
  try {
    const command = new GetCallerIdentityCommand({});
    const response = await client.send(command);
    
    console.log('✅ Current AWS Identity:');
    console.log(`   Account: ${response.Account}`);
    console.log(`   User ARN: ${response.Arn}`);
    console.log(`   User ID: ${response.UserId}`);
    
    if (response.Account !== ACCOUNT_ID) {
      console.log(`\n⚠️  WARNING: Current account (${response.Account}) doesn't match`);
      console.log(`   expected account (${ACCOUNT_ID})`);
    }
  } catch (error) {
    console.log('❌ Error checking identity:', error.message);
  }
}

async function runDiagnostics() {
  console.log('🔬 AWS SCP Diagnosis Tool');
  console.log('='.repeat(60));
  console.log('Checking if Service Control Policies are blocking Bedrock...\n');
  
  // Check current identity
  await checkCallerIdentity();
  
  // Check if in Organization
  const inOrg = await checkOrganization();
  
  if (inOrg === true) {
    // Check SCPs
    await checkSCPs();
    
    // Check CloudTrail
    await checkCloudTrail();
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSIS SUMMARY');
    console.log('='.repeat(60));
    console.log('\n✅ Account is in an AWS Organization');
    console.log('⚠️  Service Control Policies may be blocking Marketplace access');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Contact your AWS Organization administrator');
    console.log('2. Request exception for AWS Marketplace (Bedrock models)');
    console.log('3. Share this diagnostic output with them');
    console.log('4. See AWS_SCP_DIAGNOSIS_AND_FIX.md for detailed instructions');
    
  } else if (inOrg === false) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSIS SUMMARY');
    console.log('='.repeat(60));
    console.log('\n✅ Account is standalone (not in Organization)');
    console.log('✅ SCP restrictions are NOT the issue');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Contact AWS Support for payment instrument issue');
    console.log('2. Verify payment method is international credit/debit card');
    console.log('3. Check AWS Billing console for account restrictions');
    console.log('4. See AWS_SUPPORT_REQUEST.md for support ticket template');
    
  } else {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSIS SUMMARY');
    console.log('='.repeat(60));
    console.log('\n⚠️  Cannot determine Organization status');
    console.log('⚠️  Insufficient permissions to run full diagnostics');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Contact your AWS administrator');
    console.log('2. Request Organization and SCP information');
    console.log('3. Or contact AWS Support directly');
    console.log('4. See AWS_SCP_DIAGNOSIS_AND_FIX.md for more options');
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run diagnostics
runDiagnostics().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
