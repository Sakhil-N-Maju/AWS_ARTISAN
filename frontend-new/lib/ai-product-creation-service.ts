// AI Product Creation Service
// Phase 1: Product Listing via Voice + Image
// Uses Gemini multimodal primary, OpenAI fallback

export interface ProductImage {
  file: File;
  preview: string;
  analysis?: ImageAnalysisResult;
}

export interface ImageAnalysisResult {
  category: string;
  subcategory?: string;
  colors: string[];
  materials: string[];
  techniques: string[];
  description: string;
  suggestedTags: string[];
  confidence: number;
}

export interface VoiceProductInput {
  transcription: string;
  language: string;
  audioUrl?: string;
}

export interface ProductListingData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  materials: string[];
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit: 'cm' | 'inch' | 'kg' | 'g';
  };
  colors: string[];
  techniques: string[];
  tags: string[];
  price?: number;
  inventory?: {
    quantity: number;
    sku?: string;
  };
  variants?: ProductVariant[];
  craftType?: string;
  region?: string;
  artisanStory?: string;
  culturalSignificance?: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
  prices?: { [key: string]: number };
}

export interface AIProductCreationResult {
  success: boolean;
  product: ProductListingData;
  confidence: number;
  model: 'gemini' | 'openai' | 'fallback';
  processingTime: number;
  suggestions: string[];
}

class AIProductCreationService {
  private readonly GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  private readonly OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  /**
   * Create product listing from images and voice description
   */
  async createProductListing(
    images: ProductImage[],
    voiceInput?: VoiceProductInput
  ): Promise<AIProductCreationResult> {
    const startTime = Date.now();

    try {
      // Try Gemini first (multimodal support)
      const result = await this.tryGeminiCreation(images, voiceInput);

      return {
        ...result,
        model: 'gemini',
        processingTime: Date.now() - startTime,
      };
    } catch (geminiError) {
      console.warn('Gemini failed, trying OpenAI:', geminiError);

      try {
        // Fallback to OpenAI
        const result = await this.tryOpenAICreation(images, voiceInput);

        return {
          ...result,
          model: 'openai',
          processingTime: Date.now() - startTime,
        };
      } catch (openaiError) {
        console.warn('OpenAI failed, using rule-based fallback:', openaiError);

        // Ultimate fallback
        const result = await this.ruleBasedCreation(images, voiceInput);

        return {
          ...result,
          model: 'fallback',
          processingTime: Date.now() - startTime,
        };
      }
    }
  }

  /**
   * Analyze single image using AI
   */
  async analyzeImage(image: ProductImage): Promise<ImageAnalysisResult> {
    // TODO: Replace with actual Gemini Vision or OpenAI GPT-4V API call

    // Simulated analysis
    await this.delay(1000);

    return {
      category: 'Textiles',
      subcategory: 'Saree',
      colors: ['Red', 'Gold', 'Maroon'],
      materials: ['Silk', 'Zari Thread'],
      techniques: ['Handloom Weaving', 'Banarasi'],
      description: 'Traditional handwoven Banarasi silk saree with intricate gold zari work',
      suggestedTags: ['banarasi', 'silk-saree', 'handloom', 'wedding', 'traditional'],
      confidence: 0.88,
    };
  }

  /**
   * Extract product details from voice transcription
   */
  parseVoiceInput(voiceInput: VoiceProductInput): Partial<ProductListingData> {
    const text = voiceInput.transcription.toLowerCase();

    // Simple keyword extraction (in production, use NLP/LLM)
    const extracted: Partial<ProductListingData> = {};

    // Extract price
    const priceMatch = text.match(/(?:price|cost|₹|rs\.?)\s*(\d+)/i);
    if (priceMatch) {
      extracted.price = parseInt(priceMatch[1]);
    }

    // Extract materials
    const materials = ['silk', 'cotton', 'wool', 'brass', 'wood', 'clay', 'stone'];
    extracted.materials = materials.filter((m) => text.includes(m));

    // Extract techniques
    const techniques = ['handmade', 'handwoven', 'hand-carved', 'hand-painted', 'embroidered'];
    extracted.techniques = techniques.filter((t) => text.includes(t.replace('-', ' ')));

    return extracted;
  }

  /**
   * Gemini multimodal API integration (Primary)
   */
  private async tryGeminiCreation(
    images: ProductImage[],
    voiceInput?: VoiceProductInput
  ): Promise<Omit<AIProductCreationResult, 'model' | 'processingTime'>> {
    // TODO: Implement actual Gemini API call
    // Example endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent

    await this.delay(1500); // Simulate API call

    const imageAnalysis = images.length > 0 ? await this.analyzeImage(images[0]) : null;
    const voiceData = voiceInput ? this.parseVoiceInput(voiceInput) : {};

    return {
      success: true,
      product: this.mergeProductData(imageAnalysis, voiceData),
      confidence: 0.89,
      suggestions: [
        'Consider adding measurements for better customer experience',
        'Add more close-up images showing craftsmanship details',
        'Include information about care instructions',
      ],
    };
  }

  /**
   * OpenAI GPT-4V API integration (Fallback)
   */
  private async tryOpenAICreation(
    images: ProductImage[],
    voiceInput?: VoiceProductInput
  ): Promise<Omit<AIProductCreationResult, 'model' | 'processingTime'>> {
    // TODO: Implement actual OpenAI API call
    // Use GPT-4V for image analysis and GPT-4 for text processing

    await this.delay(1500); // Simulate API call

    const imageAnalysis = images.length > 0 ? await this.analyzeImage(images[0]) : null;
    const voiceData = voiceInput ? this.parseVoiceInput(voiceInput) : {};

    return {
      success: true,
      product: this.mergeProductData(imageAnalysis, voiceData),
      confidence: 0.85,
      suggestions: [
        'Product looks authentic - highlight traditional craftsmanship',
        'Consider creating product variants for different sizes',
      ],
    };
  }

  /**
   * Rule-based fallback (No API)
   */
  private async ruleBasedCreation(
    images: ProductImage[],
    voiceInput?: VoiceProductInput
  ): Promise<Omit<AIProductCreationResult, 'model' | 'processingTime'>> {
    await this.delay(500);

    const voiceData = voiceInput ? this.parseVoiceInput(voiceInput) : {};

    return {
      success: true,
      product: {
        title: voiceData.title || 'Handcrafted Product',
        description:
          voiceInput?.transcription || 'Beautiful handcrafted item made by skilled artisans',
        category: 'Handicrafts',
        materials: voiceData.materials || ['Handmade'],
        colors: [],
        techniques: voiceData.techniques || ['Traditional'],
        tags: ['handmade', 'artisan', 'india'],
        price: voiceData.price,
      },
      confidence: 0.6,
      suggestions: [
        'Add product images for better AI analysis',
        'Provide more details about materials and techniques',
        'Consider adding measurements and dimensions',
      ],
    };
  }

  /**
   * Merge image analysis and voice input data
   */
  private mergeProductData(
    imageAnalysis: ImageAnalysisResult | null,
    voiceData: Partial<ProductListingData>
  ): ProductListingData {
    return {
      title:
        voiceData.title ||
        (imageAnalysis ? this.generateTitle(imageAnalysis) : 'Handcrafted Product'),
      description:
        voiceData.description || imageAnalysis?.description || 'Beautiful handcrafted item',
      category: voiceData.category || imageAnalysis?.category || 'Handicrafts',
      subcategory: voiceData.subcategory || imageAnalysis?.subcategory,
      materials: voiceData.materials || imageAnalysis?.materials || [],
      colors: voiceData.colors || imageAnalysis?.colors || [],
      techniques: voiceData.techniques || imageAnalysis?.techniques || [],
      tags: voiceData.tags || imageAnalysis?.suggestedTags || [],
      price: voiceData.price,
      inventory: voiceData.inventory,
      craftType: voiceData.craftType,
      region: voiceData.region,
      artisanStory: voiceData.artisanStory,
      culturalSignificance: voiceData.culturalSignificance,
    };
  }

  /**
   * Generate product title from analysis
   */
  private generateTitle(analysis: ImageAnalysisResult): string {
    const parts: string[] = [];

    if (analysis.techniques.length > 0) {
      parts.push(analysis.techniques[0]);
    }

    if (analysis.materials.length > 0) {
      parts.push(analysis.materials[0]);
    }

    if (analysis.subcategory) {
      parts.push(analysis.subcategory);
    } else if (analysis.category) {
      parts.push(analysis.category);
    }

    return parts.join(' ');
  }

  /**
   * Generate SEO-friendly product title
   */
  generateSEOTitle(product: ProductListingData): string {
    const parts: string[] = [];

    if (product.techniques.length > 0) {
      parts.push(product.techniques[0]);
    }

    if (product.materials.length > 0) {
      parts.push(product.materials[0]);
    }

    parts.push(product.category);

    if (product.region) {
      parts.push(`from ${product.region}`);
    }

    return parts.join(' ');
  }

  /**
   * Generate product variants based on analysis
   */
  suggestVariants(product: ProductListingData): ProductVariant[] {
    const variants: ProductVariant[] = [];

    // Size variants for textiles
    if (
      product.category.toLowerCase().includes('textile') ||
      product.category.toLowerCase().includes('clothing')
    ) {
      variants.push({
        name: 'Size',
        options: ['Small', 'Medium', 'Large', 'Extra Large'],
      });
    }

    // Color variants if multiple colors detected
    if (product.colors.length > 1) {
      variants.push({
        name: 'Color',
        options: product.colors,
      });
    }

    return variants;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const aiProductCreationService = new AIProductCreationService();
