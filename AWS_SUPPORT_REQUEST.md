# AWS Support Request - Bedrock Access Issue

## Issue Summary

Unable to access Amazon Bedrock models (Claude 3 Haiku and Sonnet) due to payment instrument error. Root cause appears to be **Service Control Policy (SCP) restrictions** blocking AWS Marketplace actions, not an actual payment method issue.

## Error Message

```
Model access is denied due to INVALID_PAYMENT_INSTRUMENT:
A valid payment instrument must be provided. 
Your AWS Marketplace subscription for this model cannot be completed at this time.
```

## Account Details

- **AWS Account ID**: 557211736798
- **Region**: us-east-1 (also tested ap-south-1, us-west-2)
- **Payment Method**: UPI/GooglePay - Active and verified
- **AWS Credits**: $200-300 available (AI for Bharat Hackathon)

## Root Cause Analysis

### Likely Cause: Service Control Policy (SCP) Restriction

The instant expiration of AWS Marketplace agreements (created and expired at same timestamp) strongly indicates an **SCP-level restriction** blocking `aws-marketplace:Subscribe` actions.

**Evidence**:
1. ✅ AWS Marketplace agreements expire instantly (same timestamp)
2. ✅ Other AWS services work fine (S3, Rekognition) - don't need Marketplace
3. ✅ Payment method is valid but still shows INVALID_PAYMENT_INSTRUMENT
4. ✅ Error persists across all regions and all Bedrock models
5. ✅ SCP restrictions take precedence over IAM permissions and payment methods

### Alternative Causes (Less Likely)

- Payment method not compatible with AWS Marketplace
- Account restrictions for new accounts
- Regional payment processing issues

## Timeline

1. **March 7, 2026 06:47 AM UTC**: 
   - AWS Marketplace agreement created for Claude 3 Haiku
   - Agreement ID: agmt-ehimfxpsr0g0zuctfog215dj
   - Purchase amount: $0.00

2. **March 7, 2026 06:47 AM UTC** (same time):
   - Agreement expired immediately
   - Received expiration email at same timestamp

3. **Model Access Page Retirement**:
   - AWS announced that model access page has been retired
   - Models should now be automatically enabled on first invocation
   - Anthropic models may require use case details submission

4. **Current Status** (Latest Test):
   - All Bedrock models showing payment error across all regions
   - Error persists despite automatic enablement announcement
   - Payment method is valid and active
   - Other AWS services (S3, Rekognition) working fine
   - Tested models: Claude 3 Haiku, Claude 3 Sonnet
   - Tested regions: us-east-1, us-west-2, ap-south-1

## What I've Tried

1. ✅ Added valid payment method (UPI/GooglePay)
2. ✅ Verified payment method is active
3. ✅ Submitted use case form for Anthropic models (500 char limit)
4. ✅ Tested multiple regions (us-east-1, us-west-2, ap-south-1)
5. ✅ Tested multiple models (Haiku, Sonnet)
6. ✅ Waited several hours for verification
7. ✅ Attempted to invoke models after automatic enablement announcement
8. ✅ Checked AWS Marketplace subscriptions
9. ❌ Still getting INVALID_PAYMENT_INSTRUMENT error

## Request

Please help resolve this issue. Specifically:

1. **Check if account is in AWS Organizations** with Service Control Policies
2. **Verify if SCPs are blocking** `aws-marketplace:Subscribe` actions
3. **If SCP issue**: Provide guidance on adding exception for Bedrock models
4. **If not SCP issue**: Investigate why payment method validation is failing

I have:
- Valid payment method on file (UPI/GooglePay)
- AWS credits available ($200-300)
- Submitted use case forms
- Account in good standing

The AWS Marketplace agreements are being created and expiring instantly, which suggests either:
- An SCP with explicit deny for Marketplace actions
- Or an account-level payment processing configuration issue

## Use Case

Building a WhatsApp-based AI assistant for traditional artisans in India as part of the AI for Bharat Hackathon. The system helps artisans create professional product listings using AI.

## Diagnostic Information

### Run SCP Diagnosis

```bash
cd backend
node test-scp-diagnosis.js
```

This will check:
- If account is in AWS Organizations
- Service Control Policies attached
- CloudTrail events for denied actions
- Current IAM identity

### Required Permissions for Bedrock

```json
{
  "Effect": "Allow",
  "Action": [
    "aws-marketplace:Subscribe",
    "aws-marketplace:Unsubscribe",
    "aws-marketplace:ViewSubscriptions",
    "bedrock:InvokeModel",
    "bedrock:ListFoundationModels"
  ],
  "Resource": "*"
}
```

### If SCP is the Issue

The SCP needs to allow AWS Marketplace actions for Bedrock model Product IDs:
- `prod-ozonys2hmmpe*` (Anthropic Claude models)
- Or allow all Bedrock marketplace subscriptions

## Contact Information

- **Email**: [Your email from AWS account]
- **Preferred Contact**: Email
- **Urgency**: High (Hackathon project)

---

## How to Submit This Request

### Option 1: AWS Support Center (Recommended)

1. Go to: https://console.aws.amazon.com/support/
2. Click "Create case"
3. Select "Account and billing support"
4. Subject: "Cannot access Amazon Bedrock - Payment instrument error"
5. Copy the content above into the description
6. Submit

### Option 2: AWS re:Post Community

1. Go to: https://repost.aws/
2. Create a new question
3. Tag: "Amazon Bedrock", "AWS Marketplace", "Billing"
4. Post the issue

### Option 3: Hackathon Organizers

Contact AI for Bharat Hackathon organizers - they may have a direct line to AWS support for hackathon participants.

---

## Expected Resolution

AWS Support should be able to:
1. Verify your payment method is properly configured
2. Check why Marketplace agreements are expiring instantly
3. Manually enable Bedrock access if needed
4. Resolve any account restrictions

**Typical response time**: 1-24 hours for billing/account issues

---

## Temporary Workaround

While waiting for AWS Support:
- ✅ Continue development with S3 and Rekognition
- ✅ Test image upload and analysis
- ✅ Build WhatsApp integration
- ⏳ Mock AI generation responses for testing
- ⏳ Add Bedrock once access is restored

---

**Created**: March 7, 2026  
**Status**: Awaiting AWS Support response
