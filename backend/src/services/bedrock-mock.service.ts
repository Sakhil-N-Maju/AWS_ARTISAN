/**
 * Mock Bedrock Service
 * Generates realistic product listings without calling AWS Bedrock
 * Use this while waiting for AWS Support to resolve Bedrock access
 */

import { logger } from '../utils/logger';

export interface ProductListing {
  title: string;
  description: string;
  tags: string[];
  suggestedPrice: {
    min: number;
    max: number;
  };
  material: string[]; // Changed from string to string[]
  culturalContext: string;
  artisanStory: string;
  dimensions?: string;
}

export interface ArtisanContext {
  name: string;
  craftType: string;
  region: string;
  language: string;
}

export interface ImageAnalysis {
  labels: string[];
  colors: string[];
  dominantColor?: string;
}

export class MockBedrockService {
  /**
   * Generate product listing (mock version)
   */
  async generateListing(
    transcription: string,
    imageAnalysis: ImageAnalysis,
    artisan: ArtisanContext
  ): Promise<ProductListing> {
    logger.info('Using mock Bedrock service (AWS Bedrock not available)');

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate realistic product listing based on inputs
    const craftType = artisan.craftType.toLowerCase();
    const region = artisan.region;
    
    // Extract key information from transcription
    const hasHandmade = transcription.toLowerCase().includes('handmade') || 
                       transcription.toLowerCase().includes('hand made');
    const hasTraditional = transcription.toLowerCase().includes('traditional');
    const hasUnique = transcription.toLowerCase().includes('unique');

    // Generate title
    const title = this.generateTitle(craftType, region, imageAnalysis, hasHandmade, hasTraditional);

    // Generate description
    const description = this.generateDescription(
      craftType,
      region,
      artisan.name,
      transcription,
      imageAnalysis,
      hasHandmade,
      hasTraditional,
      hasUnique
    );

    // Generate tags
    const tags = this.generateTags(craftType, region, imageAnalysis);

    // Generate pricing
    const suggestedPrice = this.generatePricing(craftType);

    // Determine material
    const material = this.determineMaterial(craftType, imageAnalysis);

    // Generate cultural context
    const culturalContext = this.generateCulturalContext(craftType, region);

    // Generate artisan story
    const artisanStory = this.generateArtisanStory(artisan.name, craftType, region);

    return {
      title,
      description,
      tags,
      suggestedPrice,
      material,
      culturalContext,
      artisanStory,
      dimensions: this.generateDimensions(craftType)
    };
  }

  private generateTitle(
    craftType: string,
    region: string,
    imageAnalysis: ImageAnalysis,
    hasHandmade: boolean,
    hasTraditional: boolean
  ): string {
    const prefix = hasHandmade ? 'Handcrafted' : hasTraditional ? 'Traditional' : 'Authentic';
    const regionPrefix = region ? `${region} ` : '';
    
    const craftNames: Record<string, string> = {
      pottery: 'Terracotta Pottery',
      textile: 'Handwoven Textile',
      jewelry: 'Traditional Jewelry',
      woodwork: 'Carved Wooden Art',
      metalwork: 'Brass Metalwork',
      painting: 'Hand-Painted Art',
      embroidery: 'Embroidered Fabric',
      weaving: 'Handwoven Textile'
    };

    const craftName = craftNames[craftType] || `${craftType.charAt(0).toUpperCase() + craftType.slice(1)} Craft`;
    
    return `${prefix} ${regionPrefix}${craftName}`;
  }

  private generateDescription(
    craftType: string,
    region: string,
    artisanName: string,
    transcription: string,
    imageAnalysis: ImageAnalysis,
    hasHandmade: boolean,
    hasTraditional: boolean,
    hasUnique: boolean
  ): string {
    const intro = hasHandmade 
      ? `This exquisite handcrafted ${craftType} piece showcases the timeless artistry of ${region}.`
      : `This authentic ${craftType} creation embodies the rich cultural heritage of ${region}.`;

    const craftsmanship = hasTraditional
      ? `Crafted using traditional techniques passed down through generations, each piece tells a story of dedication and skill.`
      : `Created with meticulous attention to detail, this piece reflects the artisan's mastery of their craft.`;

    const uniqueness = hasUnique
      ? `Every item is one-of-a-kind, bearing the unique touch of the artisan's hand.`
      : `Each piece is carefully handmade, ensuring exceptional quality and authenticity.`;

    const colors = imageAnalysis.colors.length > 0
      ? `The beautiful ${imageAnalysis.colors.slice(0, 2).join(' and ')} tones add warmth and character to this piece.`
      : `The natural colors and textures make this a stunning addition to any collection.`;

    const artisan = `Crafted by ${artisanName}, a skilled artisan from ${region}, this piece represents years of expertise and cultural knowledge.`;

    const closing = `Perfect for those who appreciate authentic handcrafted art and wish to support traditional artisans. This piece brings a touch of ${region}'s rich cultural heritage into your home.`;

    return `${intro} ${craftsmanship} ${uniqueness}\n\n${colors} ${artisan}\n\n${closing}`;
  }

  private generateTags(craftType: string, region: string, imageAnalysis: ImageAnalysis): string[] {
    const baseTags = [
      'handmade',
      'handcrafted',
      'artisan',
      'traditional',
      'authentic',
      'indian-art',
      craftType,
      region.toLowerCase().replace(/\s+/g, '-')
    ];

    const craftTags: Record<string, string[]> = {
      pottery: ['terracotta', 'ceramic', 'clay', 'pottery-art'],
      textile: ['handwoven', 'fabric', 'textile-art', 'weaving'],
      jewelry: ['traditional-jewelry', 'handmade-jewelry', 'ethnic-jewelry'],
      woodwork: ['wood-carving', 'wooden-art', 'carved-wood'],
      metalwork: ['brass', 'metal-art', 'metalwork'],
      painting: ['hand-painted', 'art', 'painting'],
      embroidery: ['embroidered', 'needlework', 'textile-art'],
      weaving: ['handwoven', 'woven', 'textile']
    };

    const specificTags = craftTags[craftType] || [];
    const colorTags = imageAnalysis.colors.slice(0, 2).map(c => c.toLowerCase());

    return [...new Set([...baseTags, ...specificTags, ...colorTags])].slice(0, 15);
  }

  private generatePricing(craftType: string): { min: number; max: number } {
    const priceRanges: Record<string, { min: number; max: number }> = {
      pottery: { min: 500, max: 2000 },
      textile: { min: 1000, max: 5000 },
      jewelry: { min: 1500, max: 8000 },
      woodwork: { min: 800, max: 4000 },
      metalwork: { min: 1200, max: 6000 },
      painting: { min: 2000, max: 10000 },
      embroidery: { min: 1500, max: 7000 },
      weaving: { min: 1000, max: 5000 }
    };

    return priceRanges[craftType] || { min: 1000, max: 5000 };
  }

  private determineMaterial(craftType: string, imageAnalysis: ImageAnalysis): string[] {
    const materials: Record<string, string[]> = {
      pottery: ['Terracotta Clay'],
      textile: ['Cotton', 'Silk'],
      jewelry: ['Silver', 'Semi-precious Stones'],
      woodwork: ['Teak Wood'],
      metalwork: ['Brass', 'Copper'],
      painting: ['Natural Pigments', 'Canvas'],
      embroidery: ['Cotton Fabric', 'Silk Thread'],
      weaving: ['Handspun Cotton']
    };

    return materials[craftType] || ['Natural Materials'];
  }

  private generateCulturalContext(craftType: string, region: string): string {
    return `This ${craftType} tradition from ${region} has been practiced for centuries, representing an important part of India's cultural heritage. The techniques used have been preserved and passed down through generations of skilled artisans, making each piece a connection to the past and a celebration of traditional craftsmanship.`;
  }

  private generateArtisanStory(name: string, craftType: string, region: string): string {
    return `${name} is a dedicated artisan from ${region} who has been practicing the art of ${craftType} for many years. Learning the craft from family elders, ${name} continues the tradition while adding their own creative touch to each piece. By supporting ${name}'s work, you help preserve traditional crafts and provide sustainable livelihoods for artisan communities.`;
  }

  private generateDimensions(craftType: string): string {
    const dimensions: Record<string, string> = {
      pottery: 'Approximately 15cm diameter x 8cm height',
      textile: 'Approximately 200cm x 100cm',
      jewelry: 'Adjustable, fits most sizes',
      woodwork: 'Approximately 30cm x 20cm x 5cm',
      metalwork: 'Approximately 25cm x 15cm',
      painting: 'Approximately 40cm x 30cm',
      embroidery: 'Approximately 150cm x 100cm',
      weaving: 'Approximately 180cm x 90cm'
    };

    return dimensions[craftType] || 'Dimensions vary by piece';
  }
}

export const mockBedrockService = new MockBedrockService();
