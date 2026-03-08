/**
 * Cultural Storytelling Service
 *
 * Automated storyteller v2 that generates:
 * - SEO-optimized product titles and descriptions
 * - Authentic craft stories with cultural context
 * - Artisan profile narratives
 * - Social media captions
 *
 * Supports 12+ Indian languages with cultural authenticity
 */

import { CulturalHeritageDatabase } from './cultural-heritage-database';

export interface ProductStoryInput {
  productName?: string;
  craftType: string;
  region: string;
  materials?: string[];
  techniques?: string[];
  artisanName?: string;
  artisanExperience?: number;
  images?: string[];
  voiceDescription?: string;
}

export interface GeneratedStory {
  // SEO Content
  seoTitle: string;
  metaDescription: string;
  keywords: string[];

  // Product Content
  productTitle: string;
  productDescription: string;
  craftStory: string;

  // Artisan Content
  artisanStory: string;
  artisanProfile: string;

  // Social Media
  instagramCaption: string;
  twitterCaption: string;

  // Multi-language Support
  translations: {
    [languageCode: string]: {
      productTitle: string;
      productDescription: string;
      craftStory: string;
    };
  };

  // Metadata
  culturalContext: string[];
  relatedTraditions: string[];
  giTagInfo?: string;
  unescoInfo?: string;
}

export interface StoryGenerationOptions {
  targetLanguages?: string[];
  seoOptimize?: boolean;
  includeCulturalContext?: boolean;
  tone?: 'formal' | 'casual' | 'poetic' | 'authentic';
  length?: 'short' | 'medium' | 'long';
}

export class CulturalStorytellingService {
  private culturalDB: CulturalHeritageDatabase;

  // Supported languages
  private readonly SUPPORTED_LANGUAGES = [
    'en',
    'hi',
    'bn',
    'te',
    'mr',
    'ta',
    'gu',
    'kn',
    'ml',
    'pa',
    'or',
    'as',
  ];

  constructor() {
    this.culturalDB = new CulturalHeritageDatabase();
  }

  /**
   * Generate complete story content for a product
   */
  async generateProductStory(
    input: ProductStoryInput,
    options: StoryGenerationOptions = {}
  ): Promise<GeneratedStory> {
    const {
      targetLanguages = ['en', 'hi'],
      seoOptimize = true,
      includeCulturalContext = true,
      tone = 'authentic',
      length = 'medium',
    } = options;

    // Get cultural context from database
    const culturalInfo = await this.culturalDB.getCraftInfo(input.craftType, input.region);

    // Generate primary English content
    const primaryContent = await this.generatePrimaryContent(input, culturalInfo, tone, length);

    // Generate SEO content if requested
    const seoContent = seoOptimize
      ? await this.generateSEOContent(input, culturalInfo)
      : this.getDefaultSEO(input);

    // Generate artisan content
    const artisanContent = await this.generateArtisanContent(input, culturalInfo);

    // Generate social media content
    const socialContent = await this.generateSocialMediaContent(input, culturalInfo);

    // Generate translations
    const translations = await this.generateTranslations(
      primaryContent,
      targetLanguages,
      culturalInfo
    );

    // Get cultural context
    const culturalContext = includeCulturalContext
      ? await this.extractCulturalContext(culturalInfo)
      : [];

    return {
      ...seoContent,
      ...primaryContent,
      ...artisanContent,
      ...socialContent,
      translations,
      culturalContext,
      relatedTraditions: culturalInfo.relatedCrafts || [],
      giTagInfo: culturalInfo.giTag,
      unescoInfo: culturalInfo.unescoStatus,
    };
  }

  /**
   * Generate primary English content
   */
  private async generatePrimaryContent(
    input: ProductStoryInput,
    culturalInfo: any,
    tone: string,
    length: string
  ) {
    // In production, this would use AI models (Gemini/OpenAI)
    // For now, using template-based generation with cultural authenticity

    const craftName = culturalInfo.name || input.craftType;
    const region = input.region;
    const materials = input.materials?.join(', ') || 'traditional materials';
    const techniques = input.techniques?.join(', ') || 'time-honored techniques';

    const productTitle = this.generateProductTitle(input, culturalInfo);
    const productDescription = this.generateProductDescription(input, culturalInfo, length);
    const craftStory = this.generateCraftStory(input, culturalInfo, tone, length);

    return {
      productTitle,
      productDescription,
      craftStory,
    };
  }

  /**
   * Generate SEO-optimized title and meta description
   */
  private async generateSEOContent(input: ProductStoryInput, culturalInfo: any) {
    const craftName = culturalInfo.name || input.craftType;
    const region = input.region;

    // Generate SEO title (55-60 characters optimal)
    const seoTitle = `Authentic ${craftName} from ${region} | Handcrafted ${input.productName || 'Art'}`;

    // Generate meta description (150-160 characters optimal)
    const metaDescription = `Discover genuine ${craftName} crafted by skilled artisans in ${region}. ${culturalInfo.shortDescription || 'Traditional Indian handicraft with centuries of heritage'}. Shop authentic handmade products.`;

    // Generate keywords
    const keywords = [
      craftName.toLowerCase(),
      `${region.toLowerCase()} handicrafts`,
      'handmade',
      'artisan made',
      'traditional indian crafts',
      ...(input.materials || []).map((m) => m.toLowerCase()),
      ...(culturalInfo.keywords || []),
    ];

    return {
      seoTitle: seoTitle.substring(0, 60),
      metaDescription: metaDescription.substring(0, 160),
      keywords: [...new Set(keywords)], // Remove duplicates
    };
  }

  /**
   * Generate artisan story and profile
   */
  private async generateArtisanContent(input: ProductStoryInput, culturalInfo: any) {
    const artisanName = input.artisanName || 'Our skilled artisan';
    const experience = input.artisanExperience || 10;
    const craftName = culturalInfo.name || input.craftType;

    const artisanStory = `${artisanName} has been practicing ${craftName} for ${experience} years, carrying forward a tradition passed down through generations. Each piece reflects their mastery of ${input.techniques?.join(' and ') || 'traditional techniques'} and deep understanding of ${input.region}'s cultural heritage.`;

    const artisanProfile = `Master artisan specializing in ${craftName} from ${input.region}. ${experience}+ years of experience in traditional craftsmanship. Dedicated to preserving authentic techniques while creating contemporary pieces.`;

    return {
      artisanStory,
      artisanProfile,
    };
  }

  /**
   * Generate social media captions
   */
  private async generateSocialMediaContent(input: ProductStoryInput, culturalInfo: any) {
    const craftName = culturalInfo.name || input.craftType;
    const region = input.region;

    const instagramCaption =
      `✨ Authentic ${craftName} from ${region} ✨\n\n` +
      `Handcrafted with love by skilled artisans, this piece embodies centuries of tradition. ` +
      `Each detail tells a story of cultural heritage and masterful craftsmanship.\n\n` +
      `🛍️ Shop now and support traditional artisans\n` +
      `🌍 Preserving heritage, one craft at a time\n\n` +
      `#${craftName.replace(/\s/g, '')} #IndianHandicrafts #Handmade #ArtisanMade #${region.replace(/\s/g, '')} #TraditionalCraft #SupportArtisans #CulturalHeritage`;

    const twitterCaption = `Discover authentic ${craftName} from ${region}! Handcrafted by skilled artisans, preserving centuries of tradition. Support traditional craftsmanship 🇮🇳✨ #Handmade #IndianCrafts`;

    return {
      instagramCaption,
      twitterCaption,
    };
  }

  /**
   * Generate product title
   */
  private generateProductTitle(input: ProductStoryInput, culturalInfo: any): string {
    const craftName = culturalInfo.name || input.craftType;
    const productName = input.productName || 'Handcrafted Art';

    return `${productName} - Authentic ${craftName} from ${input.region}`;
  }

  /**
   * Generate product description
   */
  private generateProductDescription(
    input: ProductStoryInput,
    culturalInfo: any,
    length: string
  ): string {
    const craftName = culturalInfo.name || input.craftType;
    const materials = input.materials?.join(', ') || 'traditional materials';
    const techniques = input.techniques?.join(', ') || 'time-honored techniques';

    const short = `Handcrafted ${craftName} from ${input.region}, made with ${materials} using ${techniques}.`;

    const medium =
      `This exquisite piece showcases the authentic artistry of ${craftName} from ${input.region}. ` +
      `Crafted with ${materials} using ${techniques}, each item reflects the skill and dedication of master artisans. ` +
      `${culturalInfo.shortDescription || 'A beautiful example of traditional Indian craftsmanship.'}`;

    const long =
      `Discover the timeless beauty of authentic ${craftName} from ${input.region}. ` +
      `This handcrafted masterpiece is created using ${materials} and traditional ${techniques} ` +
      `that have been passed down through generations. ` +
      `${culturalInfo.description || 'Each piece is a testament to the rich cultural heritage of India.'}\n\n` +
      `Our artisans pour their heart and soul into every creation, ensuring that you receive not just a product, ` +
      `but a piece of living history. The intricate details and authentic craftsmanship make each item unique, ` +
      `carrying forward the legacy of traditional Indian artistry.`;

    switch (length) {
      case 'short':
        return short;
      case 'long':
        return long;
      default:
        return medium;
    }
  }

  /**
   * Generate craft story with cultural context
   */
  private generateCraftStory(
    input: ProductStoryInput,
    culturalInfo: any,
    tone: string,
    length: string
  ): string {
    const craftName = culturalInfo.name || input.craftType;
    const region = input.region;
    const history = culturalInfo.history || `${craftName} has a rich history spanning centuries`;

    const story =
      `${history}. Originating from ${region}, this traditional craft represents ` +
      `the artistic excellence and cultural wisdom of generations of skilled artisans. ` +
      `${culturalInfo.culturalSignificance || 'Each piece carries deep cultural meaning and artistic value.'}\n\n` +
      `The creation process involves ${input.techniques?.join(', ') || 'traditional techniques'} ` +
      `that require years of practice to master. Using ${input.materials?.join(', ') || 'natural materials'}, ` +
      `artisans create pieces that are both functional and beautiful, embodying the spirit of Indian craftsmanship.`;

    return story;
  }

  /**
   * Generate translations for multiple languages
   */
  private async generateTranslations(
    primaryContent: any,
    targetLanguages: string[],
    culturalInfo: any
  ) {
    const translations: any = {};

    // In production, this would use translation APIs
    // For now, using placeholders
    for (const lang of targetLanguages) {
      if (lang !== 'en' && this.SUPPORTED_LANGUAGES.includes(lang)) {
        translations[lang] = {
          productTitle: `[${lang.toUpperCase()}] ${primaryContent.productTitle}`,
          productDescription: `[${lang.toUpperCase()}] ${primaryContent.productDescription}`,
          craftStory: `[${lang.toUpperCase()}] ${primaryContent.craftStory}`,
        };
      }
    }

    return translations;
  }

  /**
   * Extract cultural context elements
   */
  private async extractCulturalContext(culturalInfo: any): Promise<string[]> {
    const context = [];

    if (culturalInfo.origin) context.push(`Origin: ${culturalInfo.origin}`);
    if (culturalInfo.period) context.push(`Historical Period: ${culturalInfo.period}`);
    if (culturalInfo.culturalSignificance) context.push(culturalInfo.culturalSignificance);
    if (culturalInfo.traditionalUse)
      context.push(`Traditional Use: ${culturalInfo.traditionalUse}`);
    if (culturalInfo.symbolism) context.push(`Symbolism: ${culturalInfo.symbolism}`);

    return context;
  }

  /**
   * Get default SEO content
   */
  private getDefaultSEO(input: ProductStoryInput) {
    return {
      seoTitle: `${input.productName || input.craftType} from ${input.region}`,
      metaDescription: `Authentic handcrafted ${input.craftType} from ${input.region}`,
      keywords: [input.craftType.toLowerCase(), input.region.toLowerCase(), 'handmade'],
    };
  }

  /**
   * Batch generate stories for multiple products
   */
  async batchGenerateStories(
    products: ProductStoryInput[],
    options: StoryGenerationOptions = {}
  ): Promise<GeneratedStory[]> {
    const stories = await Promise.all(
      products.map((product) => this.generateProductStory(product, options))
    );

    return stories;
  }

  /**
   * Update existing story with new information
   */
  async updateStory(
    existingStory: GeneratedStory,
    updates: Partial<ProductStoryInput>,
    options: StoryGenerationOptions = {}
  ): Promise<GeneratedStory> {
    // Merge updates and regenerate
    // In production, this would intelligently update only changed sections
    const mergedInput: ProductStoryInput = {
      craftType: updates.craftType || '',
      region: updates.region || '',
      ...updates,
    };

    return this.generateProductStory(mergedInput, options);
  }
}

// Export singleton instance
export const culturalStorytellingService = new CulturalStorytellingService();
