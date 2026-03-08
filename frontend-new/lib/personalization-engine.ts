/**
 * Personalization Engine
 *
 * Provides personalized experiences based on user behavior, preferences, and context
 * - Product recommendations
 * - Content personalization
 * - UI/UX adaptations
 * - Language and cultural preferences
 */

export interface UserProfile {
  userId: string;

  // Demographics
  age?: number;
  gender?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  language: string;

  // Preferences
  preferences: {
    craftTypes: string[];
    priceRange: { min: number; max: number };
    styles: string[];
    regions: string[];
    colors: string[];
  };

  // Behavior
  behavior: {
    browsingHistory: {
      productId: string;
      timestamp: Date;
      duration: number; // seconds
    }[];
    searchHistory: {
      query: string;
      timestamp: Date;
      resultsClicked: number;
    }[];
    purchaseHistory: {
      productId: string;
      amount: number;
      timestamp: Date;
    }[];
    wishlist: string[];
    cartItems: string[];
  };

  // Engagement
  engagement: {
    lastVisit: Date;
    totalVisits: number;
    avgSessionDuration: number;
    pagesPerSession: number;
    conversionRate: number;
  };

  // Personalization scores
  scores: {
    interests: Record<string, number>; // category -> score (0-100)
    brandAffinity: number; // 0-100
    pricesSensitivity: number; // 0-100
    qualityFocus: number; // 0-100
    sustainabilityScore: number; // 0-100
  };
}

export interface PersonalizedExperience {
  recommendations: {
    products: any[];
    workshops: any[];
    artisans: any[];
    content: any[];
  };

  uiAdaptations: {
    theme: 'light' | 'dark';
    layout: 'grid' | 'list';
    language: string;
    currency: string;
  };

  messaging: {
    welcomeMessage: string;
    promotions: any[];
    notifications: any[];
  };

  pricing: {
    showDiscounts: boolean;
    personalizedOffers: any[];
  };
}

export class PersonalizationEngine {
  private profiles: Map<string, UserProfile>;

  constructor() {
    this.profiles = new Map();
  }

  /**
   * Get or create user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    let profile = this.profiles.get(userId);

    if (!profile) {
      profile = this.createDefaultProfile(userId);
      this.profiles.set(userId, profile);
    }

    return profile;
  }

  /**
   * Update user profile with new data
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);

    Object.assign(profile, updates);
    this.recalculateScores(profile);

    return profile;
  }

  /**
   * Track user behavior
   */
  async trackBehavior(
    userId: string,
    event: {
      type: 'view' | 'search' | 'purchase' | 'add_to_cart' | 'wishlist';
      data: any;
    }
  ): Promise<void> {
    const profile = await this.getUserProfile(userId);

    switch (event.type) {
      case 'view':
        profile.behavior.browsingHistory.push({
          productId: event.data.productId,
          timestamp: new Date(),
          duration: event.data.duration || 0,
        });
        break;

      case 'search':
        profile.behavior.searchHistory.push({
          query: event.data.query,
          timestamp: new Date(),
          resultsClicked: event.data.resultsClicked || 0,
        });
        break;

      case 'purchase':
        profile.behavior.purchaseHistory.push({
          productId: event.data.productId,
          amount: event.data.amount,
          timestamp: new Date(),
        });
        break;

      case 'add_to_cart':
        if (!profile.behavior.cartItems.includes(event.data.productId)) {
          profile.behavior.cartItems.push(event.data.productId);
        }
        break;

      case 'wishlist':
        if (!profile.behavior.wishlist.includes(event.data.productId)) {
          profile.behavior.wishlist.push(event.data.productId);
        }
        break;
    }

    this.recalculateScores(profile);
  }

  /**
   * Generate personalized experience
   */
  async getPersonalizedExperience(userId: string): Promise<PersonalizedExperience> {
    const profile = await this.getUserProfile(userId);

    return {
      recommendations: await this.generateRecommendations(profile),
      uiAdaptations: this.getUIAdaptations(profile),
      messaging: await this.getPersonalizedMessaging(profile),
      pricing: await this.getPersonalizedPricing(profile),
    };
  }

  /**
   * Generate personalized recommendations
   */
  private async generateRecommendations(profile: UserProfile) {
    // Product recommendations based on browsing and purchase history
    const productRecommendations = this.recommendProducts(profile);

    // Workshop recommendations based on interests
    const workshopRecommendations = this.recommendWorkshops(profile);

    // Artisan recommendations based on purchase history
    const artisanRecommendations = this.recommendArtisans(profile);

    // Content recommendations
    const contentRecommendations = this.recommendContent(profile);

    return {
      products: productRecommendations,
      workshops: workshopRecommendations,
      artisans: artisanRecommendations,
      content: contentRecommendations,
    };
  }

  /**
   * Recommend products using collaborative and content-based filtering
   */
  private recommendProducts(profile: UserProfile): any[] {
    const recommendations: any[] = [];

    // Based on browsing history
    const recentlyViewed = profile.behavior.browsingHistory.slice(-10).map((h) => h.productId);

    // Based on purchase history
    const previousPurchases = profile.behavior.purchaseHistory.map((h) => h.productId);

    // Based on wishlist
    const wishlistItems = profile.behavior.wishlist;

    // Based on preferred craft types
    const preferredCrafts = profile.preferences.craftTypes;

    // Combine and score recommendations
    const scoredRecommendations = this.scoreRecommendations({
      recentlyViewed,
      previousPurchases,
      wishlistItems,
      preferredCrafts,
      priceRange: profile.preferences.priceRange,
    });

    return scoredRecommendations.slice(0, 20);
  }

  /**
   * Recommend workshops based on user interests
   */
  private recommendWorkshops(profile: UserProfile): any[] {
    const recommendations: any[] = [];

    // Get top interests
    const topInterests = Object.entries(profile.scores.interests)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([interest]) => interest);

    // Match workshops to interests
    const matchedWorkshops = topInterests.map((interest) => ({
      workshopId: `workshop-${interest}`,
      craftType: interest,
      score: profile.scores.interests[interest],
      reason: `Based on your interest in ${interest}`,
    }));

    return matchedWorkshops;
  }

  /**
   * Recommend artisans based on purchase patterns
   */
  private recommendArtisans(profile: UserProfile): any[] {
    const recommendations: any[] = [];

    // Get artisans from purchase history
    const purchasedArtisans = profile.behavior.purchaseHistory.map((h) => ({
      artisanId: `artisan-${h.productId}`,
      productId: h.productId,
    }));

    // Find similar artisans
    const similarArtisans = purchasedArtisans.map((a) => ({
      artisanId: a.artisanId,
      reason: 'Based on your previous purchases',
      score: 85,
    }));

    return similarArtisans.slice(0, 10);
  }

  /**
   * Recommend content (blogs, stories, etc.)
   */
  private recommendContent(profile: UserProfile): any[] {
    const recommendations: any[] = [];

    const topInterests = Object.entries(profile.scores.interests)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    topInterests.forEach(([interest, score]) => {
      recommendations.push({
        contentId: `content-${interest}`,
        type: 'article',
        title: `Discover the Art of ${interest}`,
        score,
      });
    });

    return recommendations;
  }

  /**
   * Get UI adaptations based on user preferences
   */
  private getUIAdaptations(profile: UserProfile) {
    return {
      theme: 'light' as const, // Could be based on user preference
      layout: profile.behavior.browsingHistory.length > 50 ? ('list' as const) : ('grid' as const),
      language: profile.language,
      currency: profile.location?.country === 'India' ? 'INR' : 'USD',
    };
  }

  /**
   * Get personalized messaging
   */
  private async getPersonalizedMessaging(profile: UserProfile) {
    const timeOfDay = new Date().getHours();
    const greeting =
      timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';

    const name = profile.userId; // In production, would use actual name
    const topInterest =
      Object.entries(profile.scores.interests).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'handcrafted products';

    const welcomeMessage = `${greeting}, ${name}! Ready to explore more ${topInterest}?`;

    const promotions = await this.getPersonalizedPromotions(profile);
    const notifications = await this.getPersonalizedNotifications(profile);

    return {
      welcomeMessage,
      promotions,
      notifications,
    };
  }

  /**
   * Get personalized promotions
   */
  private async getPersonalizedPromotions(profile: UserProfile): Promise<any[]> {
    const promotions: any[] = [];

    // Cart abandonment
    if (profile.behavior.cartItems.length > 0) {
      promotions.push({
        type: 'cart_recovery',
        message: 'You have items waiting in your cart. Complete your purchase now!',
        discount: 10,
      });
    }

    // Wishlist items
    if (profile.behavior.wishlist.length > 0) {
      promotions.push({
        type: 'wishlist_sale',
        message: 'Items in your wishlist are now on sale!',
        discount: 15,
      });
    }

    // First-time buyer
    if (profile.behavior.purchaseHistory.length === 0) {
      promotions.push({
        type: 'first_purchase',
        message: 'Welcome! Get 20% off on your first purchase',
        discount: 20,
      });
    }

    return promotions;
  }

  /**
   * Get personalized notifications
   */
  private async getPersonalizedNotifications(profile: UserProfile): Promise<any[]> {
    const notifications: any[] = [];

    // New products in preferred categories
    const topInterests = Object.entries(profile.scores.interests)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([interest]) => interest);

    topInterests.forEach((interest) => {
      notifications.push({
        type: 'new_product',
        message: `New ${interest} products just arrived!`,
        category: interest,
      });
    });

    return notifications;
  }

  /**
   * Get personalized pricing
   */
  private async getPersonalizedPricing(profile: UserProfile) {
    const showDiscounts = profile.scores.pricesSensitivity > 60;

    const personalizedOffers: any[] = [];

    if (profile.scores.brandAffinity > 80) {
      personalizedOffers.push({
        type: 'loyalty',
        discount: 15,
        message: 'Thank you for being a valued customer!',
      });
    }

    if (profile.behavior.purchaseHistory.length > 5) {
      personalizedOffers.push({
        type: 'frequent_buyer',
        discount: 10,
        message: 'Frequent buyer discount',
      });
    }

    return {
      showDiscounts,
      personalizedOffers,
    };
  }

  /**
   * Create default user profile
   */
  private createDefaultProfile(userId: string): UserProfile {
    return {
      userId,
      language: 'en',
      preferences: {
        craftTypes: [],
        priceRange: { min: 0, max: 100000 },
        styles: [],
        regions: [],
        colors: [],
      },
      behavior: {
        browsingHistory: [],
        searchHistory: [],
        purchaseHistory: [],
        wishlist: [],
        cartItems: [],
      },
      engagement: {
        lastVisit: new Date(),
        totalVisits: 1,
        avgSessionDuration: 0,
        pagesPerSession: 1,
        conversionRate: 0,
      },
      scores: {
        interests: {},
        brandAffinity: 50,
        pricesSensitivity: 50,
        qualityFocus: 50,
        sustainabilityScore: 50,
      },
    };
  }

  /**
   * Recalculate user scores based on behavior
   */
  private recalculateScores(profile: UserProfile): void {
    // Interest scores based on browsing and purchases
    const interests: Record<string, number> = {};

    profile.behavior.browsingHistory.forEach((item) => {
      const category = this.getCategoryFromProduct(item.productId);
      interests[category] = (interests[category] || 0) + 1;
    });

    profile.behavior.purchaseHistory.forEach((item) => {
      const category = this.getCategoryFromProduct(item.productId);
      interests[category] = (interests[category] || 0) + 5; // Purchases weighted higher
    });

    // Normalize scores to 0-100
    const maxScore = Math.max(...Object.values(interests), 1);
    Object.keys(interests).forEach((key) => {
      interests[key] = (interests[key] / maxScore) * 100;
    });

    profile.scores.interests = interests;

    // Brand affinity based on repeat purchases
    profile.scores.brandAffinity = Math.min(50 + profile.behavior.purchaseHistory.length * 5, 100);

    // Price sensitivity based on purchase patterns
    if (profile.behavior.purchaseHistory.length > 0) {
      const avgPurchase =
        profile.behavior.purchaseHistory.reduce((sum, p) => sum + p.amount, 0) /
        profile.behavior.purchaseHistory.length;
      profile.scores.pricesSensitivity = avgPurchase < 5000 ? 80 : avgPurchase < 10000 ? 50 : 20;
    }

    // Quality focus based on premium purchases
    const premiumPurchases = profile.behavior.purchaseHistory.filter(
      (p) => p.amount > 10000
    ).length;
    profile.scores.qualityFocus = Math.min(30 + premiumPurchases * 15, 100);
  }

  /**
   * Score and rank recommendations
   */
  private scoreRecommendations(context: any): any[] {
    const scored: any[] = [];

    // Simple scoring algorithm
    // In production, this would use ML models

    return scored.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  /**
   * Helper: Get category from product ID
   */
  private getCategoryFromProduct(productId: string): string {
    // Simplified category extraction
    // In production, this would query product database
    return 'handcraft';
  }

  /**
   * Get personalization statistics
   */
  getStats() {
    const profiles = Array.from(this.profiles.values());

    return {
      totalUsers: profiles.length,
      activeUsers: profiles.filter((p) => {
        const daysSinceLastVisit =
          (Date.now() - p.engagement.lastVisit.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastVisit <= 30;
      }).length,
      avgEngagement:
        profiles.reduce((sum, p) => sum + p.engagement.conversionRate, 0) /
        Math.max(profiles.length, 1),
      topInterests: this.getTopInterestsAcrossUsers(profiles),
    };
  }

  /**
   * Get top interests across all users
   */
  private getTopInterestsAcrossUsers(profiles: UserProfile[]): Record<string, number> {
    const interests: Record<string, number> = {};

    profiles.forEach((profile) => {
      Object.entries(profile.scores.interests).forEach(([interest, score]) => {
        interests[interest] = (interests[interest] || 0) + score;
      });
    });

    return interests;
  }
}

// Export singleton instance
export const personalizationEngine = new PersonalizationEngine();
