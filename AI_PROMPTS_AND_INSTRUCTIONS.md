# AI Prompts and Instructions
## Exact Prompts Sent to AWS Services When Processing Artisan Messages

---

## Overview

When an artisan sends a WhatsApp message with a photo and voice description, the system processes it through three AWS AI services in sequence:

1. **AWS Transcribe** - Converts voice to text
2. **AWS Rekognition** - Analyzes the product image
3. **AWS Bedrock (Claude 3 Sonnet)** - Generates the product listing

---

## 1. AWS Transcribe (Voice-to-Text)

### Service Configuration

**No custom prompt** - AWS Transcribe is a speech-to-text service that doesn't use prompts. Instead, it receives configuration parameters:

```typescript
{
  TranscriptionJobName: `transcribe-${Date.now()}`,
  LanguageCode: 'hi-IN', // or 'ta-IN', 'te-IN', 'ml-IN', 'bn-IN', 'en-IN'
  MediaFormat: 'ogg',
  Media: {
    MediaFileUri: 's3://artisan-ai-media/voice-messages/...'
  },
  OutputBucketName: 'artisan-ai-media',
  Settings: {
    ShowSpeakerLabels: false
  }
}
```

### Language Mapping

The system automatically detects and maps the artisan's language:

- `hindi` → `hi-IN`
- `malayalam` → `ml-IN`
- `tamil` → `ta-IN`
- `telugu` → `te-IN`
- `bengali` → `bn-IN`
- `english` → `en-IN`
- `gujarati` → Not yet supported by AWS Transcribe

### Output

Returns raw transcription text in the artisan's language:
```
"यह मिट्टी का बर्तन है जो मैंने हाथ से बनाया है। यह पारंपरिक तरीके से बनाया गया है।"
```

---

## 2. AWS Rekognition (Image Analysis)

### Service Configuration

**No custom prompt** - AWS Rekognition analyzes images using computer vision. Configuration:

#### Label Detection
```typescript
{
  Image: {
    S3Object: {
      Bucket: 'artisan-ai-media',
      Name: 'product-images/...'
    }
  },
  MaxLabels: 20,
  MinConfidence: 70
}
```

#### Text Detection (Optional)
```typescript
{
  Image: {
    S3Object: {
      Bucket: 'artisan-ai-media',
      Name: 'product-images/...'
    }
  }
}
```

### Processing Logic

The service extracts:

1. **Labels**: Objects detected in the image (e.g., "Pottery", "Ceramic", "Handmade")
2. **Colors**: Extracted from label names (e.g., "Red", "Blue", "Brown")
3. **Quality Score**: Calculated from average confidence (1-10 scale)
4. **Text**: Any text visible in the image

### Output Example

```typescript
{
  labels: ['Pottery', 'Ceramic', 'Handmade', 'Art', 'Craft', 'Terracotta'],
  colors: ['brown', 'red', 'orange'],
  quality: 8,
  text: []
}
```

---

## 3. AWS Bedrock (Claude 3 Sonnet) - Product Listing Generation

### The Complete Prompt

This is the **exact prompt** sent to Claude 3 Sonnet via AWS Bedrock:

```
You are an expert in Indian handicrafts and e-commerce product listings.

ARTISAN CONTEXT:
- Name: Rajesh Kumar
- Craft Type: Pottery
- Region: Karnataka
- Language: Hindi

ARTISAN'S VOICE DESCRIPTION:
"यह मिट्टी का बर्तन है जो मैंने हाथ से बनाया है। यह पारंपरिक तरीके से बनाया गया है। मेरी दादी ने मुझे यह कला सिखाई थी।"

IMAGE ANALYSIS:
- Detected Objects: Pottery, Ceramic, Handmade, Art, Craft, Terracotta, Clay, Traditional
- Dominant Colors: brown, red, orange
- Quality Score: 8/10

TASK:
Generate a compelling product listing in JSON format with the following fields:

{
  "title": "Engaging product title (50-80 chars, English)",
  "description": "Detailed product description (150-300 words, English) covering materials, process, dimensions, and unique features",
  "artisanStory": "Brief artisan story (100-150 words) highlighting their craft tradition and expertise",
  "culturalContext": "Cultural significance and heritage (50-100 words)",
  "material": ["primary material", "secondary material"],
  "suggestedPrice": {
    "min": 0,
    "max": 0,
    "currency": "INR",
    "reasoning": "Brief explanation"
  },
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "dimensions": {
    "length": 0,
    "width": 0,
    "height": 0,
    "unit": "cm"
  }
}

GUIDELINES:
- Use authentic, respectful language
- Highlight craftsmanship and cultural heritage
- Be specific about materials and techniques
- Price should reflect artisan's input and market research
- Tags should include: material, style, occasion, region
- Keep tone warm and storytelling-focused
- Return ONLY valid JSON, no additional text

Generate the product listing now:
```

### Prompt Components Breakdown

#### 1. System Role
```
You are an expert in Indian handicrafts and e-commerce product listings.
```
- Establishes AI's expertise domain
- Ensures culturally appropriate responses

#### 2. Artisan Context
```
ARTISAN CONTEXT:
- Name: [Artisan's name]
- Craft Type: [Their specialty]
- Region: [Location]
- Language: [Native language]
```
- Provides personalization data
- Helps AI understand cultural context

#### 3. Voice Transcription
```
ARTISAN'S VOICE DESCRIPTION:
"[Transcribed text in artisan's language]"
```
- Raw transcription from AWS Transcribe
- Preserves artisan's authentic voice
- May be in Hindi, Tamil, Telugu, etc.

#### 4. Image Analysis
```
IMAGE ANALYSIS:
- Detected Objects: [List from Rekognition]
- Dominant Colors: [Extracted colors]
- Quality Score: [1-10]
```
- Computer vision insights
- Helps AI understand visual aspects
- Validates artisan's description

#### 5. Output Schema
```json
{
  "title": "...",
  "description": "...",
  "artisanStory": "...",
  "culturalContext": "...",
  "material": [...],
  "suggestedPrice": {...},
  "tags": [...],
  "dimensions": {...}
}
```
- Structured JSON format
- Ensures consistent output
- All fields required

#### 6. Guidelines
```
GUIDELINES:
- Use authentic, respectful language
- Highlight craftsmanship and cultural heritage
- Be specific about materials and techniques
- Price should reflect artisan's input and market research
- Tags should include: material, style, occasion, region
- Keep tone warm and storytelling-focused
- Return ONLY valid JSON, no additional text
```
- Quality control instructions
- Tone and style requirements
- Cultural sensitivity reminders

### API Request Format

The prompt is sent to Bedrock with these parameters:

```typescript
{
  modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
  contentType: 'application/json',
  accept: 'application/json',
  body: JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 2000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: [THE_PROMPT_ABOVE]
      }
    ]
  })
}
```

### Expected Output Example

```json
{
  "title": "Handcrafted Traditional Karnataka Terracotta Water Pot",
  "description": "This exquisite terracotta water pot embodies centuries of Karnataka's pottery tradition. Handcrafted using traditional techniques passed down through generations, each piece showcases the artisan's mastery of clay work. The pot features a beautiful reddish-brown hue characteristic of natural terracotta, with smooth curves and a sturdy base. Made from locally sourced clay and fired in traditional kilns, this pot not only serves as a functional water vessel but also as a piece of living heritage. The porous nature of terracotta keeps water naturally cool, making it perfect for Indian summers. Each pot is unique, bearing the subtle marks of the artisan's hands.",
  "artisanStory": "Rajesh Kumar is a third-generation potter from Karnataka who learned this ancient craft from his grandmother. Growing up in a family of traditional potters, Rajesh has dedicated over 20 years to perfecting the art of terracotta pottery. His work preserves the authentic techniques while ensuring each piece meets modern quality standards. By supporting Rajesh's craft, you help sustain traditional artisan communities and keep centuries-old skills alive.",
  "culturalContext": "Terracotta pottery has been an integral part of Karnataka's cultural heritage for over 2000 years. These traditional water pots, known locally as 'kalash', are not just utilitarian objects but symbols of prosperity and purity in Indian households. The craft represents a sustainable, eco-friendly tradition that connects modern users with ancient wisdom.",
  "material": ["Terracotta Clay", "Natural Earth Pigments"],
  "suggestedPrice": {
    "min": 800,
    "max": 1500,
    "currency": "INR",
    "reasoning": "Price reflects handcrafted quality, traditional techniques, and fair compensation for artisan's skill and time"
  },
  "tags": ["terracotta", "pottery", "handmade", "karnataka", "traditional", "water-pot", "eco-friendly", "artisan-craft", "indian-handicraft", "sustainable"],
  "dimensions": {
    "length": 20,
    "width": 20,
    "height": 25,
    "unit": "cm"
  }
}
```

---

## 4. Mock Bedrock Service (Currently Active)

### Why Mock Service?

Due to AWS SCP (Service Control Policy) restrictions, we're currently using a mock service that generates realistic listings without calling AWS Bedrock.

### Mock Service Logic

The mock service uses **rule-based generation** instead of AI:

1. **Analyzes inputs**: Transcription keywords, image labels, artisan context
2. **Applies templates**: Pre-written templates for different craft types
3. **Personalizes**: Inserts artisan name, region, craft type
4. **Generates pricing**: Based on craft type and market research
5. **Creates tags**: Combines craft type, region, colors, materials

### Mock Service Advantages

- ✅ **Fast**: ~1 second response time
- ✅ **Consistent**: Predictable output quality
- ✅ **No cost**: No AWS Bedrock charges
- ✅ **Reliable**: No API failures or rate limits

### Mock Service Limitations

- ❌ **Not AI-powered**: Uses templates, not true understanding
- ❌ **Limited creativity**: Can't adapt to unique descriptions
- ❌ **No story extraction**: Doesn't truly understand artisan's voice
- ❌ **Generic descriptions**: Less personalized than real AI

---

## Complete Processing Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ARTISAN INPUT                                            │
│    WhatsApp: Photo + Voice Message                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. MEDIA UPLOAD                                             │
│    S3 Service: Upload to artisan-ai-media bucket            │
│    - Voice: /voice-messages/[timestamp].ogg                 │
│    - Image: /product-images/[timestamp].jpg                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. VOICE TRANSCRIPTION                                      │
│    AWS Transcribe                                           │
│    Input: S3 voice URL + language code                      │
│    Output: "यह मिट्टी का बर्तन है..."                      │
│    Time: 10-15 seconds                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. IMAGE ANALYSIS                                           │
│    AWS Rekognition                                          │
│    Input: S3 image URL                                      │
│    Output: {labels, colors, quality, text}                  │
│    Time: 3-5 seconds                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. PRODUCT LISTING GENERATION                               │
│    AWS Bedrock (Claude 3 Sonnet) OR Mock Service            │
│    Input: Transcription + Image Analysis + Artisan Context  │
│    Prompt: [See detailed prompt above]                      │
│    Output: Complete product listing JSON                    │
│    Time: 5-10 seconds (Bedrock) or 1 second (Mock)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. PRODUCT CREATION                                         │
│    Database: Save to PostgreSQL                             │
│    - Generate unique product ID                             │
│    - Create QR code                                         │
│    - Store all metadata                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. ARTISAN PREVIEW                                          │
│    WhatsApp: Send preview in artisan's language             │
│    - Product title                                          │
│    - Description                                            │
│    - Suggested price                                        │
│    - Approval options                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Insights

### 1. Story Preservation Strategy

The prompt specifically instructs Claude to:
- Extract cultural heritage from artisan's voice
- Preserve authentic storytelling
- Highlight traditional techniques
- Maintain respectful, warm tone

### 2. Multi-Language Handling

- **Input**: Artisan speaks in Hindi/Tamil/Telugu/etc.
- **Processing**: AI understands regional language context
- **Output**: Professional English for global audience
- **Preview**: Translated back to artisan's language

### 3. Quality Control

The prompt ensures:
- Authentic, respectful language
- Specific material and technique details
- Fair pricing based on craftsmanship
- SEO-optimized tags
- Storytelling-focused descriptions

### 4. Cultural Sensitivity

Guidelines emphasize:
- Respect for traditional crafts
- Preservation of cultural heritage
- Fair representation of artisan's work
- Authentic voice preservation

---

## Future Enhancements

When AWS Bedrock access is restored, we can enhance the prompt to:

1. **Better Story Extraction**
   - Identify emotional elements
   - Extract family history
   - Highlight unique techniques

2. **Image Enhancement Instructions**
   - Background removal
   - Color correction
   - Quality improvement suggestions

3. **Dynamic Pricing**
   - Market trend analysis
   - Competitor pricing
   - Seasonal adjustments

4. **SEO Optimization**
   - Keyword research
   - Search intent matching
   - Meta description generation

---

## Testing the Prompts

To test with real AWS services:

1. Set `USE_MOCK_BEDROCK=false` in `.env`
2. Ensure AWS credentials have Bedrock access
3. Send test message via WhatsApp
4. Monitor logs for prompt and response

Current status: Using mock service due to AWS SCP restrictions.

---

**Last Updated**: March 8, 2026
**Status**: Mock service active, awaiting AWS Bedrock access
