/**
 * Advanced Search & Discovery System
 *
 * Comprehensive search and discovery features:
 * - Multi-criteria search
 * - Faceted filtering
 * - Semantic search
 * - Visual search
 * - Voice search integration
 * - Search personalization
 * - Auto-suggestions
 * - Search analytics
 */

export interface SearchQuery {
  id: string;
  userId?: string;

  // Query text
  query: string;
  queryType: 'text' | 'voice' | 'visual' | 'semantic';

  // Filters
  filters: {
    category?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    artisan?: string[];
    region?: string[];
    material?: string[];
    technique?: string[];
    rating?: number;
    availability?: 'in_stock' | 'made_to_order' | 'all';
    sortBy?: 'relevance' | 'price_low' | 'price_high' | 'newest' | 'popular' | 'rating';
  };

  // Pagination
  page: number;
  pageSize: number;

  // Context
  context?: {
    location?: string;
    previousSearches?: string[];
    viewingHistory?: string[];
  };

  // Metadata
  timestamp: Date;
  resultCount?: number;
  processingTime?: number;
}

export interface SearchResult {
  id: string;
  type: 'product' | 'artisan' | 'workshop' | 'story' | 'category';

  // Basic info
  title: string;
  description: string;
  imageUrl: string;

  // Score
  relevanceScore: number; // 0-1

  // Type-specific data
  productData?: {
    price: number;
    currency: string;
    artisanId: string;
    artisanName: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
  };

  artisanData?: {
    specialization: string;
    location: string;
    productsCount: number;
    rating: number;
  };

  workshopData?: {
    date: Date;
    duration: number;
    price: number;
    spotsAvailable: number;
  };

  storyData?: {
    author: string;
    publishDate: Date;
    readTime: number;
  };

  // Highlighting
  highlights?: {
    field: string;
    snippet: string;
  }[];

  // Related items
  relatedItems?: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'product' | 'category' | 'artisan';
  score: number;
  imageUrl?: string;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface SearchFacets {
  categories: FacetOption[];
  priceRanges: {
    min: number;
    max: number;
    count: number;
  }[];
  artisans: FacetOption[];
  regions: FacetOption[];
  materials: FacetOption[];
  techniques: FacetOption[];
  ratings: {
    rating: number;
    count: number;
  }[];
  availability: FacetOption[];
}

export interface VisualSearchQuery {
  id: string;
  userId?: string;

  // Image
  image: {
    url: string;
    width: number;
    height: number;
  };

  // Detection
  detectedObjects?: {
    type: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }[];

  // Colors
  dominantColors?: {
    color: string;
    percentage: number;
  }[];

  // Features
  features?: {
    pattern?: string;
    style?: string;
    material?: string;
  };

  timestamp: Date;
}

export interface SearchPersonalization {
  userId: string;

  // Preferences
  preferences: {
    favoriteCategories: string[];
    favoriteArtisans: string[];
    priceRange: {
      min: number;
      max: number;
    };
    preferredMaterials: string[];
    preferredRegions: string[];
  };

  // Behavior
  behavior: {
    searchHistory: {
      query: string;
      timestamp: Date;
    }[];
    clickedResults: {
      resultId: string;
      query: string;
      position: number;
      timestamp: Date;
    }[];
    purchasedItems: string[];
  };

  // Boost factors
  boostFactors: {
    category: Map<string, number>;
    artisan: Map<string, number>;
    priceRange: number;
  };
}

export interface SearchAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalSearches: number;
    uniqueUsers: number;
    averageResultsPerSearch: number;
    averageClickThroughRate: number;
    averageConversionRate: number;
  };

  topQueries: {
    query: string;
    count: number;
    clickThroughRate: number;
    conversionRate: number;
  }[];

  zeroResultQueries: {
    query: string;
    count: number;
  }[];

  popularFilters: {
    filter: string;
    value: string;
    usage: number;
  }[];

  searchTypes: {
    type: SearchQuery['queryType'];
    count: number;
    percentage: number;
  }[];

  performance: {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  };
}

export class AdvancedSearchSystem {
  private queries: Map<string, SearchQuery>;
  private visualQueries: Map<string, VisualSearchQuery>;
  private personalizations: Map<string, SearchPersonalization>;

  // Mock data stores
  private products: any[];
  private artisans: any[];
  private workshops: any[];
  private stories: any[];

  constructor() {
    this.queries = new Map();
    this.visualQueries = new Map();
    this.personalizations = new Map();

    this.products = [];
    this.artisans = [];
    this.workshops = [];
    this.stories = [];

    this.initializeMockData();
  }

  /**
   * Initialize mock data
   */
  private initializeMockData() {
    // Add sample products
    this.products = [
      {
        id: 'prod-1',
        title: 'Handwoven Banarasi Silk Saree',
        description: 'Exquisite pure silk saree with traditional gold zari work',
        imageUrl: '/images/saree-1.jpg',
        price: 8500,
        currency: 'INR',
        category: 'sarees',
        artisanId: 'art-1',
        artisanName: 'Ramesh Kumar',
        region: 'Varanasi',
        material: 'silk',
        technique: 'handloom',
        rating: 4.8,
        reviewCount: 124,
        inStock: true,
        keywords: ['saree', 'silk', 'banarasi', 'handwoven', 'traditional', 'wedding'],
      },
      {
        id: 'prod-2',
        title: 'Blue Pottery Ceramic Bowl',
        description: 'Hand-painted ceramic bowl with traditional Jaipur blue pottery design',
        imageUrl: '/images/pottery-1.jpg',
        price: 1200,
        currency: 'INR',
        category: 'home_decor',
        artisanId: 'art-2',
        artisanName: 'Meera Sharma',
        region: 'Jaipur',
        material: 'ceramic',
        technique: 'hand_painting',
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        keywords: ['pottery', 'ceramic', 'bowl', 'blue', 'jaipur', 'handpainted', 'decor'],
      },
      {
        id: 'prod-3',
        title: 'Pashmina Wool Shawl',
        description: 'Luxurious hand-embroidered Kashmiri pashmina shawl',
        imageUrl: '/images/shawl-1.jpg',
        price: 5500,
        currency: 'INR',
        category: 'accessories',
        artisanId: 'art-3',
        artisanName: 'Aisha Khan',
        region: 'Kashmir',
        material: 'pashmina',
        technique: 'embroidery',
        rating: 4.9,
        reviewCount: 156,
        inStock: true,
        keywords: ['shawl', 'pashmina', 'kashmir', 'embroidered', 'luxury', 'wool'],
      },
    ];

    // Add sample artisans
    this.artisans = [
      {
        id: 'art-1',
        name: 'Ramesh Kumar',
        specialization: 'Handloom Weaving',
        location: 'Varanasi, Uttar Pradesh',
        productsCount: 45,
        rating: 4.8,
        imageUrl: '/images/artisan-1.jpg',
      },
      {
        id: 'art-2',
        name: 'Meera Sharma',
        specialization: 'Blue Pottery',
        location: 'Jaipur, Rajasthan',
        productsCount: 32,
        rating: 4.7,
        imageUrl: '/images/artisan-2.jpg',
      },
    ];
  }

  /**
   * Perform search
   */
  async search(params: {
    query: string;
    queryType?: SearchQuery['queryType'];
    filters?: SearchQuery['filters'];
    userId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    results: SearchResult[];
    facets: SearchFacets;
    total: number;
    query: SearchQuery;
  }> {
    const startTime = Date.now();

    const query: SearchQuery = {
      id: `search-${Date.now()}`,
      userId: params.userId,
      query: params.query,
      queryType: params.queryType || 'text',
      filters: params.filters || {},
      page: params.page || 1,
      pageSize: params.pageSize || 20,
      timestamp: new Date(),
    };

    // Get personalization if available
    let personalization: SearchPersonalization | undefined;
    if (params.userId) {
      personalization = this.personalizations.get(params.userId);
      if (personalization) {
        personalization.behavior.searchHistory.push({
          query: params.query,
          timestamp: new Date(),
        });
      }
    }

    // Perform search
    const results = await this.executeSearch(query, personalization);

    // Generate facets
    const facets = await this.generateFacets(results, query.filters);

    // Apply pagination
    const startIndex = (query.page - 1) * query.pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + query.pageSize);

    query.resultCount = results.length;
    query.processingTime = Date.now() - startTime;

    this.queries.set(query.id, query);

    return {
      results: paginatedResults,
      facets,
      total: results.length,
      query,
    };
  }

  /**
   * Execute search logic
   */
  private async executeSearch(
    query: SearchQuery,
    personalization?: SearchPersonalization
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const queryLower = query.query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    // Search products
    this.products.forEach((product) => {
      let score = 0;

      // Text matching
      const text =
        `${product.title} ${product.description} ${product.keywords.join(' ')}`.toLowerCase();
      queryWords.forEach((word) => {
        if (text.includes(word)) score += 0.2;
        if (product.title.toLowerCase().includes(word)) score += 0.3;
      });

      // Apply filters
      if (query.filters.category && !query.filters.category.includes(product.category)) return;
      if (query.filters.priceRange) {
        if (
          product.price < query.filters.priceRange.min ||
          product.price > query.filters.priceRange.max
        )
          return;
      }
      if (query.filters.artisan && !query.filters.artisan.includes(product.artisanId)) return;
      if (query.filters.region && !query.filters.region.includes(product.region)) return;
      if (query.filters.material && !query.filters.material.includes(product.material)) return;
      if (query.filters.technique && !query.filters.technique.includes(product.technique)) return;
      if (query.filters.rating && product.rating < query.filters.rating) return;
      if (query.filters.availability === 'in_stock' && !product.inStock) return;

      // Personalization boost
      if (personalization) {
        const categoryBoost = personalization.boostFactors.category.get(product.category) || 1;
        const artisanBoost = personalization.boostFactors.artisan.get(product.artisanId) || 1;
        score *= categoryBoost * artisanBoost;
      }

      if (score > 0) {
        results.push({
          id: product.id,
          type: 'product',
          title: product.title,
          description: product.description,
          imageUrl: product.imageUrl,
          relevanceScore: Math.min(score, 1),
          productData: {
            price: product.price,
            currency: product.currency,
            artisanId: product.artisanId,
            artisanName: product.artisanName,
            rating: product.rating,
            reviewCount: product.reviewCount,
            inStock: product.inStock,
          },
        });
      }
    });

    // Search artisans
    this.artisans.forEach((artisan) => {
      let score = 0;
      const text = `${artisan.name} ${artisan.specialization} ${artisan.location}`.toLowerCase();

      queryWords.forEach((word) => {
        if (text.includes(word)) score += 0.3;
      });

      if (score > 0) {
        results.push({
          id: artisan.id,
          type: 'artisan',
          title: artisan.name,
          description: artisan.specialization,
          imageUrl: artisan.imageUrl,
          relevanceScore: Math.min(score, 1),
          artisanData: {
            specialization: artisan.specialization,
            location: artisan.location,
            productsCount: artisan.productsCount,
            rating: artisan.rating,
          },
        });
      }
    });

    // Sort by relevance or filter
    this.sortResults(results, query.filters.sortBy || 'relevance');

    return results;
  }

  /**
   * Sort results
   */
  private sortResults(results: SearchResult[], sortBy: string): void {
    switch (sortBy) {
      case 'price_low':
        results.sort((a, b) => (a.productData?.price || 0) - (b.productData?.price || 0));
        break;
      case 'price_high':
        results.sort((a, b) => (b.productData?.price || 0) - (a.productData?.price || 0));
        break;
      case 'rating':
        results.sort((a, b) => (b.productData?.rating || 0) - (a.productData?.rating || 0));
        break;
      case 'popular':
        results.sort(
          (a, b) => (b.productData?.reviewCount || 0) - (a.productData?.reviewCount || 0)
        );
        break;
      case 'relevance':
      default:
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
  }

  /**
   * Generate facets
   */
  private async generateFacets(
    results: SearchResult[],
    appliedFilters: SearchQuery['filters']
  ): Promise<SearchFacets> {
    const productResults = results.filter((r) => r.type === 'product');

    // Categories
    const categoryCounts = new Map<string, number>();
    const artisanCounts = new Map<string, number>();
    const regionCounts = new Map<string, number>();
    const materialCounts = new Map<string, number>();
    const techniqueCounts = new Map<string, number>();
    const ratingCounts = new Map<number, number>();

    this.products.forEach((p) => {
      categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
      artisanCounts.set(p.artisanId, (artisanCounts.get(p.artisanId) || 0) + 1);
      regionCounts.set(p.region, (regionCounts.get(p.region) || 0) + 1);
      materialCounts.set(p.material, (materialCounts.get(p.material) || 0) + 1);
      techniqueCounts.set(p.technique, (techniqueCounts.get(p.technique) || 0) + 1);

      const ratingBucket = Math.floor(p.rating);
      ratingCounts.set(ratingBucket, (ratingCounts.get(ratingBucket) || 0) + 1);
    });

    return {
      categories: Array.from(categoryCounts.entries()).map(([value, count]) => ({
        value,
        label: value.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        count,
        selected: appliedFilters.category?.includes(value) || false,
      })),
      priceRanges: [
        { min: 0, max: 1000, count: this.products.filter((p) => p.price <= 1000).length },
        {
          min: 1000,
          max: 5000,
          count: this.products.filter((p) => p.price > 1000 && p.price <= 5000).length,
        },
        {
          min: 5000,
          max: 10000,
          count: this.products.filter((p) => p.price > 5000 && p.price <= 10000).length,
        },
        { min: 10000, max: 999999, count: this.products.filter((p) => p.price > 10000).length },
      ],
      artisans: Array.from(artisanCounts.entries())
        .slice(0, 10)
        .map(([value, count]) => {
          const artisan = this.artisans.find((a) => a.id === value);
          return {
            value,
            label: artisan?.name || value,
            count,
            selected: appliedFilters.artisan?.includes(value) || false,
          };
        }),
      regions: Array.from(regionCounts.entries()).map(([value, count]) => ({
        value,
        label: value,
        count,
        selected: appliedFilters.region?.includes(value) || false,
      })),
      materials: Array.from(materialCounts.entries()).map(([value, count]) => ({
        value,
        label: value.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        count,
        selected: appliedFilters.material?.includes(value) || false,
      })),
      techniques: Array.from(techniqueCounts.entries()).map(([value, count]) => ({
        value,
        label: value.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        count,
        selected: appliedFilters.technique?.includes(value) || false,
      })),
      ratings: Array.from(ratingCounts.entries())
        .sort(([a], [b]) => b - a)
        .map(([rating, count]) => ({ rating, count })),
      availability: [
        {
          value: 'in_stock',
          label: 'In Stock',
          count: this.products.filter((p) => p.inStock).length,
          selected: appliedFilters.availability === 'in_stock',
        },
        {
          value: 'all',
          label: 'All',
          count: this.products.length,
          selected: appliedFilters.availability === 'all',
        },
      ],
    };
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string, limit: number = 10): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Product suggestions
    this.products.forEach((product) => {
      if (product.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: product.title,
          type: 'product',
          score: 0.9,
          imageUrl: product.imageUrl,
        });
      }
    });

    // Category suggestions
    const categories = ['sarees', 'jewelry', 'home_decor', 'accessories', 'pottery', 'textiles'];
    categories.forEach((cat) => {
      if (cat.includes(queryLower)) {
        suggestions.push({
          text: cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          type: 'category',
          score: 0.8,
        });
      }
    });

    // Artisan suggestions
    this.artisans.forEach((artisan) => {
      if (artisan.name.toLowerCase().includes(queryLower)) {
        suggestions.push({
          text: artisan.name,
          type: 'artisan',
          score: 0.7,
          imageUrl: artisan.imageUrl,
        });
      }
    });

    // Sort by score and limit
    return suggestions.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Visual search
   */
  async visualSearch(params: { imageUrl: string; userId?: string }): Promise<SearchResult[]> {
    const visualQuery: VisualSearchQuery = {
      id: `visual-${Date.now()}`,
      userId: params.userId,
      image: {
        url: params.imageUrl,
        width: 800,
        height: 600,
      },
      timestamp: new Date(),
    };

    // Simulate visual search (in production, use computer vision API)
    // Mock: return similar products based on category
    const results = this.products.slice(0, 5).map((product, index) => ({
      id: product.id,
      type: 'product' as const,
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      relevanceScore: 0.9 - index * 0.1,
      productData: {
        price: product.price,
        currency: product.currency,
        artisanId: product.artisanId,
        artisanName: product.artisanName,
        rating: product.rating,
        reviewCount: product.reviewCount,
        inStock: product.inStock,
      },
    }));

    this.visualQueries.set(visualQuery.id, visualQuery);
    return results;
  }

  /**
   * Track search interaction
   */
  async trackInteraction(params: {
    queryId: string;
    resultId: string;
    position: number;
    action: 'click' | 'add_to_cart' | 'purchase';
  }): Promise<void> {
    const query = this.queries.get(params.queryId);
    if (!query || !query.userId) return;

    let personalization = this.personalizations.get(query.userId);
    if (!personalization) {
      personalization = {
        userId: query.userId,
        preferences: {
          favoriteCategories: [],
          favoriteArtisans: [],
          priceRange: { min: 0, max: 999999 },
          preferredMaterials: [],
          preferredRegions: [],
        },
        behavior: {
          searchHistory: [],
          clickedResults: [],
          purchasedItems: [],
        },
        boostFactors: {
          category: new Map(),
          artisan: new Map(),
          priceRange: 1,
        },
      };
      this.personalizations.set(query.userId, personalization);
    }

    // Track click
    personalization.behavior.clickedResults.push({
      resultId: params.resultId,
      query: query.query,
      position: params.position,
      timestamp: new Date(),
    });

    // Track purchase
    if (params.action === 'purchase') {
      personalization.behavior.purchasedItems.push(params.resultId);
    }
  }

  /**
   * Get search analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<SearchAnalytics> {
    const queries = Array.from(this.queries.values()).filter(
      (q) => q.timestamp >= period.start && q.timestamp <= period.end
    );

    const uniqueUsers = new Set(queries.filter((q) => q.userId).map((q) => q.userId!)).size;
    const averageResults =
      queries.length > 0
        ? queries.reduce((sum, q) => sum + (q.resultCount || 0), 0) / queries.length
        : 0;

    // Calculate query frequencies
    const queryCounts = new Map<string, number>();
    queries.forEach((q) => {
      const normalized = q.query.toLowerCase();
      queryCounts.set(normalized, (queryCounts.get(normalized) || 0) + 1);
    });

    const topQueries = Array.from(queryCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([query, count]) => ({
        query,
        count,
        clickThroughRate: 0.65, // Mock
        conversionRate: 0.12, // Mock
      }));

    // Zero result queries
    const zeroResultQueries = Array.from(
      queries
        .filter((q) => q.resultCount === 0)
        .reduce((map, q) => {
          const normalized = q.query.toLowerCase();
          map.set(normalized, (map.get(normalized) || 0) + 1);
          return map;
        }, new Map<string, number>())
        .entries()
    )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    // Search types
    const typeCounts = new Map<SearchQuery['queryType'], number>();
    queries.forEach((q) => {
      typeCounts.set(q.queryType, (typeCounts.get(q.queryType) || 0) + 1);
    });

    const searchTypes = Array.from(typeCounts.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: (count / queries.length) * 100,
    }));

    // Performance
    const processingTimes = queries.map((q) => q.processingTime || 0).filter((t) => t > 0);
    const averageResponseTime =
      processingTimes.length > 0
        ? processingTimes.reduce((sum, t) => sum + t, 0) / processingTimes.length
        : 0;

    const sortedTimes = processingTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);

    return {
      period,
      overview: {
        totalSearches: queries.length,
        uniqueUsers,
        averageResultsPerSearch: Number(averageResults.toFixed(1)),
        averageClickThroughRate: 0.65, // Mock
        averageConversionRate: 0.12, // Mock
      },
      topQueries,
      zeroResultQueries,
      popularFilters: [
        { filter: 'category', value: 'sarees', usage: 450 },
        { filter: 'priceRange', value: '1000-5000', usage: 320 },
        { filter: 'material', value: 'silk', usage: 280 },
      ],
      searchTypes,
      performance: {
        averageResponseTime: Number(averageResponseTime.toFixed(0)),
        p95ResponseTime: sortedTimes[p95Index] || 0,
        p99ResponseTime: sortedTimes[p99Index] || 0,
      },
    };
  }
}

// Export singleton instance
export const advancedSearchSystem = new AdvancedSearchSystem();
