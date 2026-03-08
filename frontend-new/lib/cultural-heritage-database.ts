/**
 * Cultural Heritage Database
 *
 * Comprehensive database of Indian crafts with:
 * - GI (Geographical Indication) tags
 * - UNESCO heritage status
 * - Historical context
 * - Cultural significance
 * - Traditional techniques
 * - Regional information
 */

export interface CraftInfo {
  id: string;
  name: string;
  localName?: string;
  region: string;
  state: string;
  category: string;

  // Heritage Status
  giTag?: string;
  giRegistrationNumber?: string;
  unescoStatus?: string;

  // Descriptions
  shortDescription: string;
  description: string;
  history: string;

  // Cultural Context
  origin: string;
  period?: string;
  culturalSignificance: string;
  traditionalUse?: string;
  symbolism?: string;

  // Craft Details
  materials: string[];
  techniques: string[];
  typicalProducts: string[];

  // Related Information
  relatedCrafts: string[];
  keywords: string[];

  // Media
  images?: string[];
  videos?: string[];
}

export class CulturalHeritageDatabase {
  private craftsDatabase: Map<string, CraftInfo>;

  constructor() {
    this.craftsDatabase = new Map();
    this.initializeDatabase();
  }

  /**
   * Initialize database with Indian crafts
   */
  private initializeDatabase() {
    const crafts: CraftInfo[] = [
      // Textiles
      {
        id: 'banarasi-silk',
        name: 'Banarasi Silk',
        localName: 'बनारसी रेशम',
        region: 'Varanasi',
        state: 'Uttar Pradesh',
        category: 'Textiles',
        giTag: 'Banaras Brocades and Sarees',
        giRegistrationNumber: 'GI-51',
        shortDescription: 'Luxurious silk fabric with intricate brocade work',
        description:
          'Banarasi silk is a fine variant of silk originating from Varanasi. The sarees are among the finest sarees in India and are known for their gold and silver brocade or zari, fine silk and opulent embroidery.',
        history:
          'The art of weaving developed during the Mughal period. The weavers from Gujarat migrated during the Mughal reign and settled in Varanasi.',
        origin: 'Varanasi, Uttar Pradesh',
        period: 'Mughal Era (14th Century)',
        culturalSignificance:
          'Considered sacred and auspicious, worn during weddings and religious ceremonies',
        traditionalUse: 'Bridal wear, ceremonial attire',
        symbolism: 'Prosperity, tradition, and cultural heritage',
        materials: ['Silk', 'Gold thread (Zari)', 'Silver thread'],
        techniques: ['Brocade weaving', 'Zari work', 'Kadwa technique', 'Meenakari'],
        typicalProducts: ['Sarees', 'Dupattas', 'Fabric'],
        relatedCrafts: ['Kanchipuram Silk', 'Chanderi Silk'],
        keywords: ['banarasi', 'silk', 'zari', 'brocade', 'wedding saree', 'traditional'],
      },
      {
        id: 'kanchipuram-silk',
        name: 'Kanchipuram Silk',
        localName: 'காஞ்சிபுரம் பட்டு',
        region: 'Kanchipuram',
        state: 'Tamil Nadu',
        category: 'Textiles',
        giTag: 'Kanchipuram Silk',
        giRegistrationNumber: 'GI-145',
        shortDescription: 'Handwoven silk sarees with temple-inspired motifs',
        description:
          'Kanchipuram silk sarees are woven from pure mulberry silk thread with a thick warp and weft creating a durable fabric with rich texture.',
        history:
          'The silk weavers of Kanchipuram are descendants of sage Markanda, with traditions dating back 400 years.',
        origin: 'Kanchipuram, Tamil Nadu',
        period: '400+ years',
        culturalSignificance: 'Associated with South Indian temples and traditional ceremonies',
        traditionalUse: 'Wedding wear, temple visits, classical dance',
        symbolism: 'Divine grace, prosperity, Tamil cultural pride',
        materials: ['Pure Mulberry Silk', 'Gold Zari'],
        techniques: ['Handloom weaving', 'Temple border', 'Contrast pallu'],
        typicalProducts: ['Sarees', 'Wedding silk'],
        relatedCrafts: ['Banarasi Silk', 'Mysore Silk'],
        keywords: ['kanchipuram', 'kanjeevaram', 'silk saree', 'temple border', 'south indian'],
      },
      {
        id: 'chanderi-fabric',
        name: 'Chanderi Fabric',
        localName: 'चंदेरी',
        region: 'Chanderi',
        state: 'Madhya Pradesh',
        category: 'Textiles',
        giTag: 'Chanderi Fabric',
        giRegistrationNumber: 'GI-124',
        shortDescription: 'Lightweight fabric with traditional motifs',
        description:
          'Chanderi fabric is characterized by its lightweight, sheer texture and fine luxurious feel.',
        history:
          'The tradition dates back to the 2nd century and was mentioned in the Vedic texts.',
        origin: 'Chanderi, Madhya Pradesh',
        period: '2nd Century',
        culturalSignificance: 'Mentioned in Vedic literature, patronized by Mughal royalty',
        materials: ['Cotton', 'Silk', 'Zari'],
        techniques: ['Handloom weaving', 'Butis (motifs)'],
        typicalProducts: ['Sarees', 'Dupattas', 'Dress materials'],
        relatedCrafts: ['Maheshwari', 'Tussar Silk'],
        keywords: ['chanderi', 'lightweight', 'sheer', 'traditional weaving'],
      },

      // Pottery & Ceramics
      {
        id: 'blue-pottery',
        name: 'Blue Pottery',
        localName: 'नीली मिट्टी के बर्तन',
        region: 'Jaipur',
        state: 'Rajasthan',
        category: 'Pottery',
        giTag: 'Jaipur Blue Pottery',
        giRegistrationNumber: 'GI-52',
        shortDescription: 'Distinctive blue-glazed pottery',
        description:
          'Blue Pottery is widely recognized as a traditional craft of Jaipur, characterized by its eye-catching cobalt blue dye.',
        history: 'Introduced to Jaipur from Persia and Afghanistan in the 14th century.',
        origin: 'Jaipur, Rajasthan',
        period: '14th Century',
        culturalSignificance: 'Represents the artistic fusion of Persian and Indian traditions',
        materials: ['Quartz', 'Glass', "Fuller's earth", 'Gum'],
        techniques: ['Hand molding', 'Glazing', 'Low-fire pottery'],
        typicalProducts: ['Vases', 'Bowls', 'Tiles', 'Decorative items'],
        relatedCrafts: ['Terracotta', 'Khurja Pottery'],
        keywords: ['blue pottery', 'jaipur', 'ceramic', 'glazed'],
      },
      {
        id: 'khurja-pottery',
        name: 'Khurja Pottery',
        region: 'Khurja',
        state: 'Uttar Pradesh',
        category: 'Pottery',
        giTag: 'Khurja Pottery',
        shortDescription: 'Glazed ceramic pottery and tableware',
        description:
          'Khurja is famous for its ceramic pottery and is known as the "Ceramic City" of India.',
        history: 'The craft began during the Mughal period with Persian artisans',
        origin: 'Khurja, Uttar Pradesh',
        culturalSignificance: 'Major ceramic production center of India',
        materials: ['Clay', 'Glaze', 'Minerals'],
        techniques: ['Wheel throwing', 'Glazing', 'Firing'],
        typicalProducts: ['Tableware', 'Decorative items', 'Tiles'],
        relatedCrafts: ['Blue Pottery'],
        keywords: ['khurja', 'ceramic', 'pottery', 'tableware'],
      },

      // Metalwork
      {
        id: 'bidriware',
        name: 'Bidriware',
        localName: 'बिदरी',
        region: 'Bidar',
        state: 'Karnataka',
        category: 'Metalwork',
        giTag: 'Bidriware',
        giRegistrationNumber: 'GI-34',
        unescoStatus: 'Intangible Cultural Heritage',
        shortDescription: 'Metal handicraft with silver inlay work',
        description:
          'Bidriware is a metal handicraft from Bidar known for its unique silver inlay work on a blackened alloy of zinc and copper.',
        history: 'Originated in the 14th century during the Bahmani Sultanate',
        origin: 'Bidar, Karnataka',
        period: '14th Century',
        culturalSignificance: 'Represents Islamic artistic traditions in India',
        materials: ['Zinc', 'Copper', 'Silver', 'Pure silver wire'],
        techniques: ['Casting', 'Inlay work', 'Oxidation'],
        typicalProducts: ['Vases', 'Boxes', 'Trays', 'Decorative items'],
        relatedCrafts: ['Damascene work', 'Meenakari'],
        keywords: ['bidri', 'metal craft', 'silver inlay', 'bidar'],
      },
      {
        id: 'dokra',
        name: 'Dokra Art',
        localName: 'ढोकरा',
        region: 'West Bengal, Odisha, Chhattisgarh',
        state: 'West Bengal',
        category: 'Metalwork',
        giTag: 'Dhokra Metal Craft',
        shortDescription: 'Ancient bell metal craft using lost-wax casting',
        description:
          'Dokra is a traditional metal casting art using the lost-wax technique, creating unique non-ferrous metal sculptures.',
        history: 'Dates back over 4,000 years to the Indus Valley Civilization',
        origin: 'Eastern India',
        period: '4000+ years',
        culturalSignificance: 'One of the oldest metal casting techniques',
        traditionalUse: 'Tribal deity figures, decorative items',
        materials: ['Bell metal', 'Brass', 'Beeswax'],
        techniques: ['Lost-wax casting', 'Tribal designs'],
        typicalProducts: ['Figurines', 'Jewelry', 'Utensils'],
        relatedCrafts: ['Bronze casting'],
        keywords: ['dokra', 'dhokra', 'lost wax', 'tribal art', 'metal casting'],
      },

      // Wood Crafts
      {
        id: 'sandalwood-carving',
        name: 'Sandalwood Carving',
        localName: 'ಶ್ರೀಗಂಧದ ಕೆತ್ತನೆ',
        region: 'Mysore',
        state: 'Karnataka',
        category: 'Wood Craft',
        giTag: 'Mysore Traditional Paintings',
        shortDescription: 'Intricate carvings on fragrant sandalwood',
        description:
          'Mysore sandalwood carving is known for its exquisite detail and the aromatic quality of the wood.',
        history: 'The craft flourished under the patronage of Mysore royalty',
        origin: 'Mysore, Karnataka',
        culturalSignificance: 'Associated with religious artifacts and royal craftsmanship',
        materials: ['Sandalwood', 'Rosewood'],
        techniques: ['Fine carving', 'Detailed sculptural work'],
        typicalProducts: ['Sculptures', 'Boxes', 'Figurines', 'Religious items'],
        relatedCrafts: ['Ivory carving', 'Wood inlay'],
        keywords: ['sandalwood', 'mysore', 'carving', 'aromatic wood'],
      },

      // Paintings
      {
        id: 'madhubani',
        name: 'Madhubani Painting',
        localName: 'मधुबनी चित्रकला',
        region: 'Madhubani',
        state: 'Bihar',
        category: 'Painting',
        giTag: 'Madhubani Painting',
        giRegistrationNumber: 'GI-80',
        shortDescription: 'Traditional folk art with geometric patterns',
        description:
          'Madhubani art is characterized by eye-catching geometrical patterns, vibrant colors and line drawings.',
        history: 'Practiced since the time of Ramayana, traditionally by women',
        origin: 'Madhubani, Bihar',
        period: 'Ancient (Ramayana era)',
        culturalSignificance: "Traditional women's art form, wedding and ritual art",
        materials: ['Natural dyes', 'Rice paste', 'Bamboo sticks'],
        techniques: ['Line drawing', 'Natural colors', 'Geometric patterns'],
        typicalProducts: ['Wall paintings', 'Sarees', 'Paper art'],
        relatedCrafts: ['Warli', 'Pattachitra'],
        keywords: ['madhubani', 'mithila', 'folk art', 'bihar'],
      },
      {
        id: 'warli',
        name: 'Warli Painting',
        localName: 'वारली चित्रकला',
        region: 'Thane',
        state: 'Maharashtra',
        category: 'Painting',
        giTag: 'Warli Painting',
        shortDescription: 'Tribal art with simple pictorial language',
        description:
          'Warli is a tribal art form characterized by simplistic representations of daily life using basic geometric shapes.',
        history: 'Dating back to 10th century AD, practiced by Warli tribes',
        origin: 'Maharashtra',
        period: '10th Century AD',
        culturalSignificance: 'Depicts tribal life, nature worship, and social ceremonies',
        materials: ['Rice paste', 'Gum', 'Natural colors'],
        techniques: ['Stick figure drawing', 'Geometric patterns'],
        typicalProducts: ['Wall art', 'Canvas', 'Decorative items'],
        relatedCrafts: ['Madhubani', 'Tribal art'],
        keywords: ['warli', 'tribal', 'folk art', 'maharashtra'],
      },
      {
        id: 'pattachitra',
        name: 'Pattachitra',
        localName: 'ପଟ୍ଟଚିତ୍ର',
        region: 'Puri, Raghurajpur',
        state: 'Odisha',
        category: 'Painting',
        giTag: 'Orissa Pattachitra',
        giRegistrationNumber: 'GI-201',
        shortDescription: 'Traditional cloth-based scroll painting',
        description:
          'Pattachitra is a general term for traditional, cloth-based scroll painting based in Odisha, depicting mythological narratives.',
        history: 'Associated with the Jagannath temple tradition',
        origin: 'Odisha',
        culturalSignificance: 'Temple art depicting Hindu mythology',
        materials: ['Cloth', 'Natural colors', 'Stone colors'],
        techniques: ['Cloth painting', 'Border work', 'Fine detailing'],
        typicalProducts: ['Scroll paintings', 'Wall hangings'],
        relatedCrafts: ['Kalamkari', 'Miniature painting'],
        keywords: ['pattachitra', 'odisha', 'scroll painting', 'jagannath'],
      },

      // Carpets & Rugs
      {
        id: 'kashmir-carpet',
        name: 'Kashmiri Carpet',
        localName: 'کشمیری قالین',
        region: 'Kashmir Valley',
        state: 'Jammu & Kashmir',
        category: 'Carpets',
        giTag: 'Kashmir Carpet',
        giRegistrationNumber: 'GI-55',
        shortDescription: 'Hand-knotted carpets with Persian designs',
        description:
          'Kashmiri carpets are known for their intricate designs, fine quality, and are hand-knotted using Persian knots.',
        history: "Introduced in the 15th century during Sultan Zain-ul-Abidin's reign",
        origin: 'Kashmir',
        period: '15th Century',
        culturalSignificance: 'Symbol of Kashmiri craftsmanship excellence',
        materials: ['Silk', 'Wool', 'Cotton base'],
        techniques: ['Hand-knotting', 'Persian knot', 'Talim reading'],
        typicalProducts: ['Carpets', 'Rugs', 'Prayer mats'],
        relatedCrafts: ['Persian carpets'],
        keywords: ['kashmir', 'carpet', 'hand-knotted', 'silk rug'],
      },

      // Jewelry
      {
        id: 'meenakari',
        name: 'Meenakari',
        localName: 'मीनाकारी',
        region: 'Jaipur',
        state: 'Rajasthan',
        category: 'Jewelry',
        giTag: 'Jaipur Meenakari',
        shortDescription: 'Colorful enamel work on metal',
        description:
          'Meenakari is the art of coloring and ornamenting the surface of metals by fusing brilliant colors.',
        history: 'Introduced to India by Raja Man Singh I of Amer',
        origin: 'Jaipur, Rajasthan',
        culturalSignificance: 'Royal craft patronized by Mughal emperors',
        materials: ['Gold', 'Silver', 'Copper', 'Colored enamels'],
        techniques: ['Enameling', 'Engraving', 'Polishing'],
        typicalProducts: ['Jewelry', 'Decorative items', 'Utensils'],
        relatedCrafts: ['Kundan work', 'Thewa'],
        keywords: ['meenakari', 'enamel', 'jaipur jewelry', 'colored metal'],
      },
    ];

    // Populate the database
    crafts.forEach((craft) => {
      this.craftsDatabase.set(craft.id, craft);
      // Also index by name for easy lookup
      this.craftsDatabase.set(craft.name.toLowerCase(), craft);
    });
  }

  /**
   * Get craft information by type and region
   */
  async getCraftInfo(craftType: string, region?: string): Promise<any> {
    const key = craftType.toLowerCase();
    let craftInfo = this.craftsDatabase.get(key);

    // If not found by key, search by name
    if (!craftInfo) {
      craftInfo = this.searchCrafts(craftType)[0];
    }

    // If still not found, return generic craft info
    if (!craftInfo) {
      return this.getGenericCraftInfo(craftType, region);
    }

    return craftInfo;
  }

  /**
   * Search crafts by keyword
   */
  searchCrafts(query: string): CraftInfo[] {
    const searchTerm = query.toLowerCase();
    const results: CraftInfo[] = [];

    this.craftsDatabase.forEach((craft) => {
      if (
        craft.name.toLowerCase().includes(searchTerm) ||
        craft.keywords.some((k) => k.includes(searchTerm)) ||
        craft.region.toLowerCase().includes(searchTerm) ||
        craft.category.toLowerCase().includes(searchTerm)
      ) {
        results.push(craft);
      }
    });

    return results;
  }

  /**
   * Get crafts by category
   */
  getCraftsByCategory(category: string): CraftInfo[] {
    const results: CraftInfo[] = [];

    this.craftsDatabase.forEach((craft) => {
      if (craft.category.toLowerCase() === category.toLowerCase()) {
        results.push(craft);
      }
    });

    return results;
  }

  /**
   * Get crafts by region
   */
  getCraftsByRegion(region: string): CraftInfo[] {
    const results: CraftInfo[] = [];

    this.craftsDatabase.forEach((craft) => {
      if (
        craft.region.toLowerCase().includes(region.toLowerCase()) ||
        craft.state.toLowerCase().includes(region.toLowerCase())
      ) {
        results.push(craft);
      }
    });

    return results;
  }

  /**
   * Get all GI tagged crafts
   */
  getGITaggedCrafts(): CraftInfo[] {
    const results: CraftInfo[] = [];

    this.craftsDatabase.forEach((craft) => {
      if (craft.giTag) {
        results.push(craft);
      }
    });

    return results;
  }

  /**
   * Get UNESCO heritage crafts
   */
  getUNESCOCrafts(): CraftInfo[] {
    const results: CraftInfo[] = [];

    this.craftsDatabase.forEach((craft) => {
      if (craft.unescoStatus) {
        results.push(craft);
      }
    });

    return results;
  }

  /**
   * Get generic craft info for unknown crafts
   */
  private getGenericCraftInfo(craftType: string, region?: string): any {
    return {
      name: craftType,
      region: region || 'India',
      shortDescription: `Traditional ${craftType} from ${region || 'India'}`,
      description: `${craftType} is a traditional Indian handicraft known for its artistic excellence and cultural significance.`,
      history: `${craftType} has been practiced by skilled artisans for generations, preserving traditional techniques and cultural heritage.`,
      culturalSignificance: 'Represents the rich artistic traditions of India',
      materials: ['Traditional materials'],
      techniques: ['Traditional techniques'],
      typicalProducts: ['Handcrafted items'],
      relatedCrafts: [],
      keywords: [craftType.toLowerCase(), 'handmade', 'traditional'],
    };
  }

  /**
   * Get total number of crafts in database
   */
  getTotalCrafts(): number {
    const uniqueCrafts = new Set<string>();
    this.craftsDatabase.forEach((craft) => {
      uniqueCrafts.add(craft.id);
    });
    return uniqueCrafts.size;
  }

  /**
   * Get all categories
   */
  getAllCategories(): string[] {
    const categories = new Set<string>();
    this.craftsDatabase.forEach((craft) => {
      categories.add(craft.category);
    });
    return Array.from(categories);
  }
}

// Export singleton instance
export const culturalHeritageDatabase = new CulturalHeritageDatabase();
