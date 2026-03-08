/**
 * Smart Recommendations Engine
 *
 * AI-powered personalized recommendations:
 * - Collaborative filtering
 * - Content-based recommendations
 * - Hybrid recommendations
 * - Context-aware suggestions
 * - Real-time personalization
 * - Similar items
 * - Trending products
 * - Cross-sell & upsell
 */

export interface RecommendationContext {
  userId?: string;
  sessionId: string;

  // Current context
  currentPage?: {
    type: 'home' | 'product' | 'category' | 'artisan' | 'cart' | 'search';
    id?: string;
  };

  // User data
  userData?: {
    purchaseHistory: string[];
    viewHistory: string[];
    favorites: string[];
    cart: string[];
    searchHistory: string[];
  };

  // Session data
  sessionData: {
    duration: number;
    pagesViewed: string[];
    productsViewed: string[];
    lastAction: Date;
  };

  // Demographics
  demographics?: {
    location?: string;
    ageGroup?: string;
    interests?: string[];
  };

  timestamp: Date;
}

export interface Recommendation {
  id: string;
  type: 'product' | 'artisan' | 'workshop' | 'category' | 'story';
  itemId: string;

  // Score
  score: number; // 0-1
  confidence: number; // 0-1

  // Reason
  reason: {
    type:
      | 'similar_to_viewed'
      | 'purchased_together'
      | 'trending'
      | 'personalized'
      | 'popular'
      | 'new_arrival'
      | 'based_on_favorites'
      | 'frequently_bought';
    explanation: string;
    referenceItems?: string[];
  };

  // Item data
  item: {
    title: string;
    description: string;
    imageUrl: string;
    price?: number;
    rating?: number;
    category?: string;
  };

  // Position
  position: number;
  slot: string; // e.g., 'homepage_hero', 'product_page_similar', 'cart_upsell'
}

export interface RecommendationStrategy {
  id: string;
  name: string;
  type: 'collaborative' | 'content_based' | 'hybrid' | 'trending' | 'rule_based';

  // Configuration
  config: {
    weight: number; // 0-1
    minScore: number;
    maxResults: number;
    diversityFactor?: number; // 0-1
    recencyBias?: number; // 0-1
  };

  // Filters
  filters?: {
    categories?: string[];
    priceRange?: { min: number; max: number };
    minRating?: number;
    excludeOutOfStock?: boolean;
  };

  isActive: boolean;
}

export interface UserProfile {
  userId: string;

  // Preferences (learned)
  preferences: {
    categories: Map<string, number>; // category -> preference score
    artisans: Map<string, number>;
    priceRange: {
      min: number;
      max: number;
      average: number;
    };
    materials: Map<string, number>;
    styles: Map<string, number>;
  };

  // Behavior patterns
  behavior: {
    purchaseFrequency: number; // purchases per month
    averageOrderValue: number;
    browsingPattern: 'explorer' | 'focused' | 'bargain_hunter' | 'impulse';
    preferredTime: string; // time of day
    devicePreference: 'mobile' | 'desktop' | 'tablet';
  };

  // Embeddings (vector representation)
  embedding?: number[];

  lastUpdated: Date;
}

export interface SimilarityMatrix {
  itemId: string;
  similarItems: {
    itemId: string;
    similarity: number; // 0-1
    reason: string;
  }[];
}

export interface TrendingItem {
  itemId: string;
  type: 'product' | 'artisan' | 'workshop';

  // Metrics
  metrics: {
    viewCount: number;
    purchaseCount: number;
    addToCartCount: number;
    shareCount: number;
    trendScore: number; // 0-1
  };

  // Time period
  period: {
    start: Date;
    end: Date;
  };

  // Growth
  growth: {
    viewGrowth: number; // percentage
    purchaseGrowth: number;
    trending: 'rising' | 'stable' | 'falling';
  };
}

export interface RecommendationPerformance {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalRecommendations: number;
    uniqueUsers: number;
    clickThroughRate: number;
    conversionRate: number;
    revenueFromRecommendations: number;
  };

  byStrategy: {
    strategyId: string;
    strategyName: string;
    recommendations: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    conversionRate: number;
  }[];

  bySlot: {
    slot: string;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  }[];

  topRecommendedItems: {
    itemId: string;
    title: string;
    recommendations: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
}

export class SmartRecommendationEngine {
  private strategies: Map<string, RecommendationStrategy>;
  private userProfiles: Map<string, UserProfile>;
  private similarityMatrices: Map<string, SimilarityMatrix>;
  private trendingItems: Map<string, TrendingItem>;
  private recommendationLog: Map<string, Recommendation[]>;

  constructor() {
    this.strategies = new Map();
    this.userProfiles = new Map();
    this.similarityMatrices = new Map();
    this.trendingItems = new Map();
    this.recommendationLog = new Map();
    this.initializeStrategies();
  }

  /**
   * Initialize recommendation strategies
   */
  private initializeStrategies() {
    const strategies: RecommendationStrategy[] = [
      {
        id: 'collaborative',
        name: 'Collaborative Filtering',
        type: 'collaborative',
        config: {
          weight: 0.4,
          minScore: 0.3,
          maxResults: 20,
          diversityFactor: 0.7,
        },
        filters: {
          excludeOutOfStock: true,
        },
        isActive: true,
      },
      {
        id: 'content_based',
        name: 'Content-Based',
        type: 'content_based',
        config: {
          weight: 0.3,
          minScore: 0.4,
          maxResults: 15,
          diversityFactor: 0.5,
        },
        isActive: true,
      },
      {
        id: 'trending',
        name: 'Trending Items',
        type: 'trending',
        config: {
          weight: 0.2,
          minScore: 0.5,
          maxResults: 10,
          recencyBias: 0.8,
        },
        isActive: true,
      },
      {
        id: 'hybrid',
        name: 'Hybrid Recommendations',
        type: 'hybrid',
        config: {
          weight: 0.1,
          minScore: 0.35,
          maxResults: 25,
          diversityFactor: 0.6,
        },
        isActive: true,
      },
    ];

    strategies.forEach((s) => this.strategies.set(s.id, s));
  }

  /**
   * Get personalized recommendations
   */
  async getRecommendations(params: {
    context: RecommendationContext;
    slot: string;
    limit?: number;
  }): Promise<Recommendation[]> {
    const { context, slot, limit = 10 } = params;

    let recommendations: Recommendation[] = [];

    // Get user profile if available
    let userProfile: UserProfile | undefined;
    if (context.userId) {
      userProfile = await this.getUserProfile(context.userId);
    }

    // Apply different strategies based on context
    if (context.currentPage?.type === 'product' && context.currentPage.id) {
      // Similar products
      recommendations = await this.getSimilarProducts(context.currentPage.id, slot, limit);
    } else if (context.currentPage?.type === 'cart') {
      // Cross-sell recommendations
      recommendations = await this.getCartRecommendations(context, slot, limit);
    } else if (context.userId && userProfile) {
      // Personalized recommendations
      recommendations = await this.getPersonalizedRecommendations(
        userProfile,
        context,
        slot,
        limit
      );
    } else {
      // Trending/popular items for new users
      recommendations = await this.getTrendingRecommendations(slot, limit);
    }

    // Log recommendations
    const logKey = `${context.sessionId}-${slot}`;
    this.recommendationLog.set(logKey, recommendations);

    return recommendations;
  }

  /**
   * Get similar products
   */
  private async getSimilarProducts(
    productId: string,
    slot: string,
    limit: number
  ): Promise<Recommendation[]> {
    let similarity = this.similarityMatrices.get(productId);

    if (!similarity) {
      // Generate similarity on-the-fly (in production, pre-compute)
      similarity = await this.calculateSimilarity(productId);
      this.similarityMatrices.set(productId, similarity);
    }

    return similarity.similarItems.slice(0, limit).map((item, index) => ({
      id: `rec-${Date.now()}-${index}`,
      type: 'product' as const,
      itemId: item.itemId,
      score: item.similarity,
      confidence: 0.85,
      reason: {
        type: 'similar_to_viewed' as const,
        explanation: item.reason,
        referenceItems: [productId],
      },
      item: {
        title: `Product ${item.itemId}`,
        description: 'Similar handcrafted item',
        imageUrl: `/images/product-${item.itemId}.jpg`,
        price: 2500,
        rating: 4.5,
      },
      position: index,
      slot,
    }));
  }

  /**
   * Calculate item similarity
   */
  private async calculateSimilarity(productId: string): Promise<SimilarityMatrix> {
    // Mock similarity calculation (in production, use ML model or vector database)
    const similarItems = [
      { itemId: `sim-${productId}-1`, similarity: 0.92, reason: 'Same category and style' },
      { itemId: `sim-${productId}-2`, similarity: 0.88, reason: 'Similar craftsmanship technique' },
      { itemId: `sim-${productId}-3`, similarity: 0.85, reason: 'Same artisan region' },
      {
        itemId: `sim-${productId}-4`,
        similarity: 0.8,
        reason: 'Similar price range and materials',
      },
      { itemId: `sim-${productId}-5`, similarity: 0.75, reason: 'Frequently viewed together' },
    ];

    return {
      itemId: productId,
      similarItems,
    };
  }

  /**
   * Get cart-based recommendations (upsell/cross-sell)
   */
  private async getCartRecommendations(
    context: RecommendationContext,
    slot: string,
    limit: number
  ): Promise<Recommendation[]> {
    const cartItems = context.userData?.cart || [];
    if (cartItems.length === 0) return [];

    // Mock complementary items
    const recommendations: Recommendation[] = cartItems.slice(0, 3).flatMap((itemId, cartIndex) =>
      Array.from({ length: 2 }, (_, i) => ({
        id: `rec-cart-${Date.now()}-${cartIndex}-${i}`,
        type: 'product' as const,
        itemId: `complement-${itemId}-${i}`,
        score: 0.9 - i * 0.1,
        confidence: 0.82,
        reason: {
          type: 'purchased_together' as const,
          explanation: 'Customers who bought this also bought',
          referenceItems: [itemId],
        },
        item: {
          title: `Complementary Item ${i + 1}`,
          description: 'Perfect match for your selection',
          imageUrl: `/images/complement-${i}.jpg`,
          price: 1500 + i * 500,
          rating: 4.6,
        },
        position: cartIndex * 2 + i,
        slot,
      }))
    );

    return recommendations.slice(0, limit);
  }

  /**
   * Get personalized recommendations
   */
  private async getPersonalizedRecommendations(
    profile: UserProfile,
    context: RecommendationContext,
    slot: string,
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get top categories from user preferences
    const topCategories = Array.from(profile.preferences.categories.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => cat);

    // Generate recommendations based on preferences
    topCategories.forEach((category, catIndex) => {
      const categoryRecs = Array.from({ length: 3 }, (_, i) => ({
        id: `rec-pers-${Date.now()}-${catIndex}-${i}`,
        type: 'product' as const,
        itemId: `pers-${category}-${i}`,
        score: 0.95 - i * 0.05,
        confidence: 0.88,
        reason: {
          type: 'personalized' as const,
          explanation: `Based on your interest in ${category}`,
          referenceItems: context.userData?.viewHistory?.slice(0, 3) || [],
        },
        item: {
          title: `${category} Item ${i + 1}`,
          description: 'Curated for you based on your preferences',
          imageUrl: `/images/${category}-${i}.jpg`,
          price: 3000 + i * 1000,
          rating: 4.7,
          category,
        },
        position: catIndex * 3 + i,
        slot,
      }));

      recommendations.push(...categoryRecs);
    });

    // Add some trending items for diversity
    const trending = await this.getTrendingRecommendations(slot, 3);
    recommendations.push(
      ...trending.map((rec, i) => ({
        ...rec,
        position: recommendations.length + i,
      }))
    );

    return recommendations.slice(0, limit);
  }

  /**
   * Get trending recommendations
   */
  private async getTrendingRecommendations(slot: string, limit: number): Promise<Recommendation[]> {
    // Mock trending items
    return Array.from({ length: limit }, (_, i) => ({
      id: `rec-trend-${Date.now()}-${i}`,
      type: 'product' as const,
      itemId: `trending-${i}`,
      score: 0.9 - i * 0.05,
      confidence: 0.8,
      reason: {
        type: 'trending' as const,
        explanation: 'Popular this week',
      },
      item: {
        title: `Trending Artisan Product ${i + 1}`,
        description: 'Loved by customers',
        imageUrl: `/images/trending-${i}.jpg`,
        price: 2000 + i * 800,
        rating: 4.8,
      },
      position: i,
      slot,
    }));
  }

  /**
   * Get or create user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    let profile = this.userProfiles.get(userId);

    if (!profile) {
      profile = {
        userId,
        preferences: {
          categories: new Map(),
          artisans: new Map(),
          priceRange: {
            min: 0,
            max: 50000,
            average: 5000,
          },
          materials: new Map(),
          styles: new Map(),
        },
        behavior: {
          purchaseFrequency: 0,
          averageOrderValue: 0,
          browsingPattern: 'explorer',
          preferredTime: 'evening',
          devicePreference: 'mobile',
        },
        lastUpdated: new Date(),
      };
      this.userProfiles.set(userId, profile);
    }

    return profile;
  }

  /**
   * Update user profile based on interaction
   */
  async updateProfile(params: {
    userId: string;
    action: 'view' | 'purchase' | 'favorite' | 'cart_add';
    itemId: string;
    itemData: {
      category?: string;
      artisan?: string;
      price?: number;
      material?: string;
      style?: string;
    };
  }): Promise<void> {
    const profile = await this.getUserProfile(params.userId);

    // Update category preference
    if (params.itemData.category) {
      const currentScore = profile.preferences.categories.get(params.itemData.category) || 0;
      const increment =
        params.action === 'purchase' ? 0.5 : params.action === 'favorite' ? 0.3 : 0.1;
      profile.preferences.categories.set(params.itemData.category, currentScore + increment);
    }

    // Update artisan preference
    if (params.itemData.artisan) {
      const currentScore = profile.preferences.artisans.get(params.itemData.artisan) || 0;
      const increment = params.action === 'purchase' ? 0.5 : 0.2;
      profile.preferences.artisans.set(params.itemData.artisan, currentScore + increment);
    }

    // Update price range
    if (params.itemData.price) {
      const prices = [profile.preferences.priceRange.average, params.itemData.price];
      profile.preferences.priceRange.average = prices.reduce((a, b) => a + b) / prices.length;
      profile.preferences.priceRange.min = Math.min(
        profile.preferences.priceRange.min,
        params.itemData.price
      );
      profile.preferences.priceRange.max = Math.max(
        profile.preferences.priceRange.max,
        params.itemData.price
      );
    }

    // Update material preference
    if (params.itemData.material) {
      const currentScore = profile.preferences.materials.get(params.itemData.material) || 0;
      profile.preferences.materials.set(params.itemData.material, currentScore + 0.2);
    }

    // Update style preference
    if (params.itemData.style) {
      const currentScore = profile.preferences.styles.get(params.itemData.style) || 0;
      profile.preferences.styles.set(params.itemData.style, currentScore + 0.2);
    }

    profile.lastUpdated = new Date();
  }

  /**
   * Track trending items
   */
  async trackTrending(params: {
    itemId: string;
    type: TrendingItem['type'];
    action: 'view' | 'purchase' | 'cart_add' | 'share';
  }): Promise<void> {
    const period = {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      end: new Date(),
    };

    let trending = this.trendingItems.get(params.itemId);

    if (!trending) {
      trending = {
        itemId: params.itemId,
        type: params.type,
        metrics: {
          viewCount: 0,
          purchaseCount: 0,
          addToCartCount: 0,
          shareCount: 0,
          trendScore: 0,
        },
        period,
        growth: {
          viewGrowth: 0,
          purchaseGrowth: 0,
          trending: 'stable',
        },
      };
      this.trendingItems.set(params.itemId, trending);
    }

    // Update metrics
    switch (params.action) {
      case 'view':
        trending.metrics.viewCount++;
        break;
      case 'purchase':
        trending.metrics.purchaseCount++;
        break;
      case 'cart_add':
        trending.metrics.addToCartCount++;
        break;
      case 'share':
        trending.metrics.shareCount++;
        break;
    }

    // Calculate trend score
    trending.metrics.trendScore =
      trending.metrics.viewCount * 0.2 +
      trending.metrics.addToCartCount * 0.3 +
      trending.metrics.purchaseCount * 0.4 +
      trending.metrics.shareCount * 0.1;

    // Normalize to 0-1
    trending.metrics.trendScore = Math.min(trending.metrics.trendScore / 100, 1);
  }

  /**
   * Get recommendation performance analytics
   */
  async getPerformance(period: { start: Date; end: Date }): Promise<RecommendationPerformance> {
    // Mock analytics data
    const totalRecommendations = 15420;
    const uniqueUsers = 3240;
    const clicks = 2105;
    const conversions = 456;
    const revenue = 1234500;

    const byStrategy = Array.from(this.strategies.values()).map((strategy) => ({
      strategyId: strategy.id,
      strategyName: strategy.name,
      recommendations: Math.floor(totalRecommendations * strategy.config.weight),
      clicks: Math.floor(clicks * strategy.config.weight),
      conversions: Math.floor(conversions * strategy.config.weight),
      revenue: revenue * strategy.config.weight,
      ctr: 0.136,
      conversionRate: 0.216,
    }));

    const slots = ['homepage_hero', 'product_page_similar', 'cart_upsell', 'category_trending'];
    const bySlot = slots.map((slot, i) => ({
      slot,
      impressions: Math.floor(totalRecommendations * (0.4 - i * 0.08)),
      clicks: Math.floor(clicks * (0.35 - i * 0.07)),
      conversions: Math.floor(conversions * (0.3 - i * 0.06)),
      ctr: 0.14 - i * 0.02,
    }));

    return {
      period,
      overview: {
        totalRecommendations,
        uniqueUsers,
        clickThroughRate: Number(((clicks / totalRecommendations) * 100).toFixed(2)),
        conversionRate: Number(((conversions / clicks) * 100).toFixed(2)),
        revenueFromRecommendations: revenue,
      },
      byStrategy,
      bySlot,
      topRecommendedItems: [
        {
          itemId: 'prod-1',
          title: 'Handwoven Silk Saree',
          recommendations: 1250,
          clicks: 180,
          conversions: 45,
          revenue: 382500,
        },
        {
          itemId: 'prod-2',
          title: 'Blue Pottery Bowl',
          recommendations: 980,
          clicks: 145,
          conversions: 38,
          revenue: 45600,
        },
        {
          itemId: 'prod-3',
          title: 'Pashmina Shawl',
          recommendations: 875,
          clicks: 132,
          conversions: 35,
          revenue: 192500,
        },
      ],
    };
  }

  /**
   * A/B test recommendation strategies
   */
  async testStrategy(params: {
    strategyId: string;
    variant: 'control' | 'test';
    config: Partial<RecommendationStrategy['config']>;
  }): Promise<void> {
    const strategy = this.strategies.get(params.strategyId);
    if (!strategy) return;

    if (params.variant === 'test') {
      // Update config for test variant
      strategy.config = { ...strategy.config, ...params.config };
    }
  }

  /**
   * Get similar artisans
   */
  async getSimilarArtisans(artisanId: string, limit: number = 5): Promise<Recommendation[]> {
    // Mock similar artisans
    return Array.from({ length: limit }, (_, i) => ({
      id: `rec-artisan-${Date.now()}-${i}`,
      type: 'artisan' as const,
      itemId: `artisan-sim-${artisanId}-${i}`,
      score: 0.9 - i * 0.1,
      confidence: 0.83,
      reason: {
        type: 'similar_to_viewed' as const,
        explanation: 'Similar craft specialization',
        referenceItems: [artisanId],
      },
      item: {
        title: `Similar Artisan ${i + 1}`,
        description: 'Master craftsperson with similar style',
        imageUrl: `/images/artisan-${i}.jpg`,
      },
      position: i,
      slot: 'artisan_page_similar',
    }));
  }
}

// Export singleton instance
export const smartRecommendationEngine = new SmartRecommendationEngine();
