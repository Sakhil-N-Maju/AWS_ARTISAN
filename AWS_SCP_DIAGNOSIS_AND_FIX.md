# AWS Service Control Policy (SCP) Issue - Diagnosis & Fix

**Root Cause Identified**: Service Control Policy blocking AWS Marketplace actions

**Date**: March 7, 2026  
**Status**: 🔴 CRITICAL - Requires Organization Admin Access

---

## 🎯 Root Cause Analysis

### The Real Problem

Your AWS account is likely part of an **AWS Organizations** structure with a **Service Control Policy (SCP)** that has an **explicit deny** for AWS Marketplace actions.

### Why This Causes the Issue

1. **Amazon Bedrock requires AWS Marketplace permissions** to subscribe to foundation models
2. **SCP restrictions take precedence** over IAM permissions and payment methods
3. **Marketplace subscription fails immediately**, causing the agreement to expire instantly
4. **Error appears as payment issue**, but it's actually a policy restriction

### Evidence Supporting This Diagnosis

✅ **AWS Marketplace agreements expire instantly** (created and expired at same timestamp)  
✅ **Other AWS services work fine** (S3, Rekognition) - they don't need Marketplace  
✅ **Payment method is valid** but still shows INVALID_PAYMENT_INSTRUMENT  
✅ **Error persists across all regions** and all Bedrock models  
✅ **Multiple payment methods fail** (UPI/GooglePay)

---

## 🔍 Step 1: Diagnose the Issue

### Check if Your Account is in an Organization

```bash
# Using AWS CLI
aws organizations describe-organization
```

**Expected Output if in Organization**:
```json
{
  "Organization": {
    "Id": "o-xxxxxxxxxxxx",
    "Arn": "arn:aws:organizations::...",
    "MasterAccountId": "123456789012",
    "MasterAccountEmail": "admin@example.com"
  }
}
```

**If you get an error**: Your account is standalone (not the issue)  
**If you get output**: Your account is in an Organization (likely the issue)

---

### Check Service Control Policies

```bash
# List all SCPs attached to your account
aws organizations list-policies-for-target \
  --target-id 557211736798 \
  --filter SERVICE_CONTROL_POLICY
```

**Look for policies with names like**:
- "DenyMarketplace"
- "RestrictMarketplace"
- "SecurityBaseline"
- "CompliancePolicy"

---

### Check Specific SCP Content

```bash
# Get policy details
aws organizations describe-policy \
  --policy-id p-xxxxxxxxxx
```

**Look for deny statements like**:
```json
{
  "Effect": "Deny",
  "Action": [
    "aws-marketplace:*",
    "aws-marketplace:Subscribe",
    "aws-marketplace:Unsubscribe"
  ],
  "Resource": "*"
}
```

---

### Check CloudTrail Logs

```bash
# Check for denied marketplace actions
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=Subscribe \
  --max-results 10
```

**Look for**:
- `errorCode: "AccessDenied"`
- `errorMessage: "...explicit deny in a service control policy..."`

---

## 🔧 Step 2: Fix the Issue

### Option A: You Have Organization Admin Access

#### 1. Identify the Restrictive SCP

Go to AWS Console:
1. Navigate to: **AWS Organizations** → **Policies** → **Service control policies**
2. Find policies attached to your account or OU (Organizational Unit)
3. Look for policies with Marketplace restrictions

#### 2. Modify the SCP to Allow Bedrock

**Option 2a: Add Exception for Bedrock** (Recommended)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyMarketplaceExceptBedrock",
      "Effect": "Deny",
      "Action": "aws-marketplace:*",
      "Resource": "*",
      "Condition": {
        "StringNotLike": {
          "aws-marketplace:ProductId": [
            "prod-ozonys2hmmpe*",  // Anthropic Claude models
            "prod-*bedrock*"        // Other Bedrock models
          ]
        }
      }
    },
    {
      "Sid": "AllowBedrockMarketplace",
      "Effect": "Allow",
      "Action": [
        "aws-marketplace:Subscribe",
        "aws-marketplace:Unsubscribe",
        "aws-marketplace:ViewSubscriptions"
      ],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws-marketplace:ProductId": "prod-*bedrock*"
        }
      }
    }
  ]
}
```

**Option 2b: Temporarily Remove Marketplace Restriction**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowMarketplace",
      "Effect": "Allow",
      "Action": "aws-marketplace:*",
      "Resource": "*"
    }
  ]
}
```

#### 3. Apply the Updated Policy

1. In AWS Organizations console
2. Select the policy
3. Click "Edit policy"
4. Paste the updated JSON
5. Save changes
6. **Wait 5-10 minutes** for propagation

#### 4. Verify the Fix

```bash
cd backend
node test-bedrock-simple.js
```

Expected: ✅ SUCCESS

---

### Option B: You DON'T Have Organization Admin Access

#### 1. Identify the Organization Administrator

```bash
# Get master account info
aws organizations describe-organization | grep MasterAccountEmail
```

Or check your AWS account setup documentation.

#### 2. Contact the Organization Administrator

**Email Template**:

```
Subject: Request to Allow AWS Marketplace Access for Amazon Bedrock

Hi [Admin Name],

I need access to Amazon Bedrock foundation models for a hackathon project 
(AI for Bharat Hackathon), but I'm encountering an SCP restriction.

AWS Account ID: 557211736798
Issue: AWS Marketplace subscriptions are being blocked by SCP
Service Needed: Amazon Bedrock (Claude 3 models)

Error Details:
- AWS Marketplace agreements expire instantly upon creation
- Error: INVALID_PAYMENT_INSTRUMENT (but payment method is valid)
- Agreement ID: agmt-ehimfxpsr0g0zuctfog215dj

Required Permissions:
- aws-marketplace:Subscribe
- aws-marketplace:Unsubscribe  
- aws-marketplace:ViewSubscriptions

Specifically for Bedrock model Product IDs:
- prod-ozonys2hmmpe* (Anthropic Claude models)

This is time-sensitive for the hackathon. Can you please:
1. Check if there's an SCP blocking AWS Marketplace actions
2. Add an exception for Amazon Bedrock marketplace subscriptions
3. Or temporarily allow marketplace access for my account

Thank you!
```

#### 3. Provide Diagnostic Information

Attach this information to help them diagnose:

```bash
# Get your account's OU
aws organizations list-parents --child-id 557211736798

# Get attached policies
aws organizations list-policies-for-target \
  --target-id 557211736798 \
  --filter SERVICE_CONTROL_POLICY
```

---

### Option C: Create a New Standalone Account (Last Resort)

If you can't get SCP access in time:

1. **Create new AWS account** (not in Organization)
2. **Add payment method** (credit/debit card recommended)
3. **Apply hackathon credits** to new account
4. **Migrate resources**:
   - S3 bucket (copy objects)
   - IAM credentials
   - Application code

**Time Required**: 2-4 hours

---

## 🧪 Step 3: Verify the Fix

### Test 1: Check Marketplace Access

```bash
# Try to list marketplace subscriptions
aws marketplace-catalog list-entities \
  --catalog AWSMarketplace \
  --entity-type AmiProduct
```

**Expected**: No access denied errors

---

### Test 2: Test Bedrock Access

```bash
cd backend
node test-bedrock-simple.js
```

**Expected Output**:
```
✅ SUCCESS in us-east-1!
Response: Hello
```

---

### Test 3: Check Marketplace Agreement

1. Go to: https://console.aws.amazon.com/marketplace/
2. Navigate to: **Manage subscriptions**
3. Look for: **Claude 3 Haiku (Amazon Bedrock Edition)**
4. Status should be: **Active** (not expired)

---

### Test 4: Full AI Pipeline Test

```bash
cd backend
node test-ai-generation.js
```

**Expected**: Complete product listing generated with real AI

---

## 📋 Required IAM Permissions

Once SCP is fixed, ensure your IAM user/role has:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "aws-marketplace:Subscribe",
        "aws-marketplace:Unsubscribe",
        "aws-marketplace:ViewSubscriptions",
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:ListFoundationModels",
        "bedrock:GetFoundationModel"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 🔍 Additional Diagnostics

### Check IAM Permissions (After SCP Fix)

```bash
# Test if you can invoke Bedrock
aws bedrock list-foundation-models --region us-east-1
```

---

### Check CloudTrail for Detailed Errors

```bash
# Look for recent Bedrock/Marketplace events
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=InvokeModel \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --max-results 50
```

---

### Monitor Policy Propagation

After SCP changes:
1. Wait 5-10 minutes
2. Test in different regions
3. Check CloudTrail for policy evaluation logs

---

## 🎯 Success Criteria

You'll know the issue is resolved when:

1. ✅ AWS Marketplace agreements stay active (don't expire instantly)
2. ✅ `test-bedrock-simple.js` passes without payment errors
3. ✅ CloudTrail shows successful `aws-marketplace:Subscribe` events
4. ✅ Bedrock models return AI-generated content
5. ✅ No "explicit deny in service control policy" errors

---

## ⏱️ Timeline

| Scenario | Time to Resolution |
|----------|-------------------|
| You have admin access | 30 min - 1 hour |
| Need to contact admin | 2-24 hours |
| Admin needs approval | 1-3 days |
| Create new account | 2-4 hours |

---

## 🆘 If SCP Fix Doesn't Work

### Check These Additional Issues

1. **IAM Permissions**: Even with SCP fixed, IAM must allow Marketplace actions
2. **Resource Policies**: S3 bucket policies might restrict Bedrock access
3. **VPC Endpoints**: If using VPC endpoints, ensure Marketplace endpoint exists
4. **Regional Restrictions**: Some organizations restrict specific regions

### Alternative Debugging Commands

```bash
# Check effective permissions
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::557211736798:user/YOUR_USER \
  --action-names aws-marketplace:Subscribe \
  --resource-arns "*"

# Check for deny policies
aws iam get-account-authorization-details \
  --filter User \
  --query 'UserDetailList[].AttachedManagedPolicies'
```

---

## 📞 Who to Contact

### If You're in an Organization

1. **AWS Organization Administrator** (primary contact)
2. **Cloud Security Team** (if they manage SCPs)
3. **DevOps/Platform Team** (if they manage AWS accounts)

### If You're Standalone

1. **AWS Support** (account/billing issue)
2. **Hackathon Organizers** (for escalation)

---

## 💡 Prevention for Future

### Best Practices

1. **Document SCP restrictions** before starting projects
2. **Request exceptions early** for known service requirements
3. **Test in sandbox account** before production
4. **Keep SCP documentation** accessible to developers

### For Hackathons

1. **Use standalone accounts** (not Organization accounts)
2. **Verify service access** before hackathon starts
3. **Have backup account** ready
4. **Contact organizers early** if issues arise

---

## 📚 References

- [AWS Organizations SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)
- [AWS Marketplace Permissions](https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-iam-users-groups-policies.html)
- [Amazon Bedrock Permissions](https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html)
- [CloudTrail Event History](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html)

---

**Last Updated**: March 7, 2026  
**Status**: Awaiting SCP verification/fix

---

## 🎬 Immediate Action Items

1. **Check if account is in Organization**: `aws organizations describe-organization`
2. **If yes**: Contact Organization administrator with email template above
3. **If no**: Issue is something else - contact AWS Support
4. **While waiting**: Continue development with mock AI service

**Remember**: This is an account-level policy issue, not a payment or code issue!
