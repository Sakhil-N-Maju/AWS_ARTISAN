/**
 * Customer Analytics System
 *
 * Comprehensive customer intelligence and analytics:
 * - Customer segmentation
 * - Behavioral analytics
 * - Lifetime value analysis
 * - Churn prediction
 * - Customer journey mapping
 * - Cohort analysis
 * - RFM analysis
 */

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;

  // Segmentation criteria
  criteria: {
    type: 'demographic' | 'behavioral' | 'psychographic' | 'geographic' | 'value-based';
    rules: {
      field: string;
      operator:
        | 'equals'
        | 'not_equals'
        | 'contains'
        | 'greater_than'
        | 'less_than'
        | 'in'
        | 'between';
      value: any;
    }[];
  };

  // Segment metrics
  metrics: {
    customerCount: number;
    percentage: number;
    totalRevenue: number;
    averageOrderValue: number;
    averageLifetimeValue: number;
    conversionRate: number;
    retentionRate: number;
    churnRate: number;
  };

  // Characteristics
  characteristics: {
    averageAge?: number;
    genderDistribution?: { male: number; female: number; other: number };
    topLocations?: { city: string; count: number }[];
    topProducts?: { productId: string; productName: string; purchases: number }[];
    preferredChannels?: { channel: string; percentage: number }[];
  };

  // Recommendations
  recommendations: {
    marketingStrategy: string[];
    productRecommendations: string[];
    communicationPreferences: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerBehavior {
  customerId: string;

  // Purchase behavior
  purchase: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    firstPurchaseDate: Date;
    lastPurchaseDate: Date;
    daysSinceLastPurchase: number;
    purchaseFrequency: number; // orders per month
    favoriteCategories: { category: string; purchases: number }[];
    favoriteProducts: { productId: string; productName: string; purchases: number }[];
  };

  // Browsing behavior
  browsing: {
    totalSessions: number;
    totalPageViews: number;
    averageSessionDuration: number;
    averagePagesPerSession: number;
    bounceRate: number;
    topPages: { url: string; views: number }[];
    devicePreference: 'desktop' | 'mobile' | 'tablet';
  };

  // Engagement
  engagement: {
    emailOpenRate: number;
    emailClickRate: number;
    smsResponseRate: number;
    pushNotificationEngagement: number;
    socialMediaInteractions: number;
    reviewsWritten: number;
    referralsMade: number;
  };

  // Cart behavior
  cart: {
    abandonmentRate: number;
    averageCartValue: number;
    averageItemsInCart: number;
    abandonedCarts: number;
  };

  // Channel preference
  channelPreference: {
    preferredChannel: string;
    channelUsage: { channel: string; percentage: number }[];
  };
}

export interface CustomerLifetimeValue {
  customerId: string;
  customerName: string;

  // CLV metrics
  clv: {
    historical: number;
    predicted: number;
    potential: number;
  };

  // Components
  components: {
    averageOrderValue: number;
    purchaseFrequency: number; // per year
    customerLifespan: number; // years
    grossMargin: number;
    retentionRate: number;
  };

  // Breakdown
  breakdown: {
    productRevenue: number;
    subscriptionRevenue: number;
    serviceRevenue: number;
    referralValue: number;
  };

  // Cohort comparison
  cohort: {
    cohortName: string;
    cohortAverage: number;
    percentile: number;
  };

  // Profitability
  profitability: {
    acquisitionCost: number;
    totalProfit: number;
    profitMargin: number;
    roi: number;
  };

  // Risk assessment
  risk: {
    churnProbability: number;
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
  };
}

export interface ChurnPrediction {
  customerId: string;
  customerName: string;

  // Prediction
  prediction: {
    churnProbability: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidenceScore: number;
    predictedChurnDate?: Date;
  };

  // Risk factors
  riskFactors: {
    factor: string;
    impact: number; // 0-1
    severity: 'low' | 'medium' | 'high';
  }[];

  // Behavioral signals
  signals: {
    decreasedEngagement: boolean;
    decreasedPurchaseFrequency: boolean;
    increasedComplaints: boolean;
    negativeReviews: boolean;
    cartAbandonment: boolean;
    unsubscribedFromEmails: boolean;
    longTimeSinceLastPurchase: boolean;
  };

  // Recommendations
  recommendations: {
    action: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    expectedImpact: number;
    effort: 'low' | 'medium' | 'high';
  }[];

  // Historical comparison
  historical: {
    currentScore: number;
    thirtyDaysAgo: number;
    sixtyDaysAgo: number;
    ninetyDaysAgo: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}

export interface CustomerJourney {
  customerId: string;

  // Journey stages
  stages: {
    stage: 'awareness' | 'consideration' | 'purchase' | 'retention' | 'advocacy';
    enteredAt: Date;
    exitedAt?: Date;
    duration?: number; // days
    touchpoints: {
      type: string;
      channel: string;
      timestamp: Date;
      action: string;
      outcome?: string;
    }[];
  }[];

  // Current stage
  currentStage: {
    stage: CustomerJourney['stages'][0]['stage'];
    daysInStage: number;
    completionPercentage: number;
    nextAction?: string;
  };

  // Journey metrics
  metrics: {
    totalTouchpoints: number;
    averageTimeToConversion: number; // days
    conversionRate: number;
    dropoffPoints: { stage: string; rate: number }[];
  };

  // Path analysis
  path: {
    commonPaths: { path: string[]; frequency: number }[];
    uniquePath: string[];
    pathEfficiency: number;
  };
}

export interface CohortAnalysis {
  cohortName: string;
  cohortType:
    | 'acquisition_month'
    | 'acquisition_quarter'
    | 'first_product'
    | 'customer_segment'
    | 'custom';

  // Cohort definition
  definition: {
    startDate: Date;
    endDate: Date;
    size: number;
    criteria?: Record<string, any>;
  };

  // Retention
  retention: {
    month: number;
    customers: number;
    retentionRate: number;
    revenue: number;
    cumulativeRevenue: number;
  }[];

  // Performance
  performance: {
    totalRevenue: number;
    averageRevenuePerCustomer: number;
    averageLifetimeValue: number;
    churnRate: number;
    activeRate: number;
  };

  // Comparison
  comparison?: {
    industryBenchmark: number;
    companyAverage: number;
    performanceRating: 'excellent' | 'good' | 'average' | 'poor';
  };
}

export interface RFMAnalysis {
  customerId: string;
  customerName: string;

  // RFM scores
  scores: {
    recency: number; // 1-5
    frequency: number; // 1-5
    monetary: number; // 1-5
    total: number; // 3-15
  };

  // Raw values
  values: {
    recency: number; // days since last purchase
    frequency: number; // number of purchases
    monetary: number; // total spent
  };

  // Segment
  segment: {
    name: string;
    description: string;
    type:
      | 'champions'
      | 'loyal'
      | 'potential_loyalist'
      | 'new_customers'
      | 'promising'
      | 'need_attention'
      | 'about_to_sleep'
      | 'at_risk'
      | 'cant_lose'
      | 'hibernating'
      | 'lost';
    priority: 'high' | 'medium' | 'low';
  };

  // Recommendations
  recommendations: {
    action: string;
    channel: string;
    message: string;
    offer?: string;
  }[];

  lastUpdated: Date;
}

export interface CustomerInsights {
  period: {
    start: Date;
    end: Date;
  };

  // Overview
  overview: {
    totalCustomers: number;
    activeCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    lostCustomers: number;
    averageLifetimeValue: number;
    averageAcquisitionCost: number;
  };

  // Segmentation
  segmentation: {
    byValue: {
      high: { count: number; revenue: number; percentage: number };
      medium: { count: number; revenue: number; percentage: number };
      low: { count: number; revenue: number; percentage: number };
    };
    byLoyalty: {
      champions: number;
      loyal: number;
      atrisk: number;
      lost: number;
    };
    byEngagement: {
      highly_engaged: number;
      moderately_engaged: number;
      low_engagement: number;
      inactive: number;
    };
  };

  // Trends
  trends: {
    customerGrowth: number; // percentage
    retentionRate: number;
    churnRate: number;
    reactivationRate: number;
    referralRate: number;
  };

  // Top customers
  topCustomers: {
    customerId: string;
    customerName: string;
    totalSpent: number;
    orders: number;
    lifetimeValue: number;
  }[];
}

export class CustomerAnalyticsSystem {
  private segments: Map<string, CustomerSegment>;
  private behaviors: Map<string, CustomerBehavior>;
  private clvData: Map<string, CustomerLifetimeValue>;
  private churnPredictions: Map<string, ChurnPrediction>;
  private journeys: Map<string, CustomerJourney>;
  private cohorts: Map<string, CohortAnalysis>;
  private rfmAnalysis: Map<string, RFMAnalysis>;

  constructor() {
    this.segments = new Map();
    this.behaviors = new Map();
    this.clvData = new Map();
    this.churnPredictions = new Map();
    this.journeys = new Map();
    this.cohorts = new Map();
    this.rfmAnalysis = new Map();

    // Initialize default segments
    this.initializeDefaultSegments();
  }

  /**
   * Initialize default customer segments
   */
  private initializeDefaultSegments(): void {
    const segments: Omit<CustomerSegment, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'VIP Customers',
        description: 'High-value customers with frequent purchases',
        criteria: {
          type: 'value-based',
          rules: [
            { field: 'lifetime_value', operator: 'greater_than', value: 5000 },
            { field: 'orders', operator: 'greater_than', value: 10 },
          ],
        },
        metrics: {
          customerCount: 1523,
          percentage: 10,
          totalRevenue: 437500,
          averageOrderValue: 650,
          averageLifetimeValue: 8500,
          conversionRate: 12.5,
          retentionRate: 92.3,
          churnRate: 7.7,
        },
        characteristics: {
          averageAge: 38,
          genderDistribution: { male: 45, female: 52, other: 3 },
          topLocations: [
            { city: 'Mumbai', count: 380 },
            { city: 'Bangalore', count: 305 },
            { city: 'Delhi', count: 228 },
          ],
          topProducts: [
            { productId: 'prod-1', productName: 'Handwoven Silk Saree', purchases: 456 },
            { productId: 'prod-3', productName: 'Silver Jewelry Collection', purchases: 389 },
          ],
          preferredChannels: [
            { channel: 'Mobile App', percentage: 65 },
            { channel: 'Website', percentage: 35 },
          ],
        },
        recommendations: {
          marketingStrategy: [
            'Exclusive VIP events and previews',
            'Personalized concierge service',
            'Premium loyalty rewards',
          ],
          productRecommendations: [
            'Limited edition collections',
            'High-end artisan pieces',
            'Custom-made products',
          ],
          communicationPreferences: [
            'Personalized email campaigns',
            'SMS for exclusive offers',
            'WhatsApp for order updates',
          ],
        },
      },
      {
        name: 'At-Risk Customers',
        description: 'Previously active customers showing declining engagement',
        criteria: {
          type: 'behavioral',
          rules: [
            { field: 'days_since_last_purchase', operator: 'greater_than', value: 90 },
            { field: 'lifetime_value', operator: 'greater_than', value: 1000 },
          ],
        },
        metrics: {
          customerCount: 2284,
          percentage: 15,
          totalRevenue: 187500,
          averageOrderValue: 510,
          averageLifetimeValue: 2850,
          conversionRate: 3.2,
          retentionRate: 45.5,
          churnRate: 54.5,
        },
        characteristics: {
          averageAge: 35,
          genderDistribution: { male: 48, female: 50, other: 2 },
          topLocations: [
            { city: 'Mumbai', count: 570 },
            { city: 'Delhi', count: 457 },
            { city: 'Bangalore', count: 342 },
          ],
        },
        recommendations: {
          marketingStrategy: [
            'Win-back campaigns with special offers',
            'Re-engagement email series',
            'Personalized product recommendations',
          ],
          productRecommendations: [
            'Products similar to past purchases',
            'New arrivals in favorite categories',
            'Trending products',
          ],
          communicationPreferences: [
            'Email with incentive offers',
            'Retargeting ads',
            'SMS reminders',
          ],
        },
      },
      {
        name: 'New Customers',
        description: 'Recent customers who made their first purchase',
        criteria: {
          type: 'behavioral',
          rules: [
            { field: 'days_since_first_purchase', operator: 'less_than', value: 30 },
            { field: 'orders', operator: 'equals', value: 1 },
          ],
        },
        metrics: {
          customerCount: 2450,
          percentage: 16.1,
          totalRevenue: 125000,
          averageOrderValue: 510,
          averageLifetimeValue: 510,
          conversionRate: 2.5,
          retentionRate: 0,
          churnRate: 0,
        },
        characteristics: {
          averageAge: 29,
          genderDistribution: { male: 42, female: 55, other: 3 },
        },
        recommendations: {
          marketingStrategy: [
            'Welcome series to build relationship',
            'First repeat purchase incentive',
            'Educational content about artisan stories',
          ],
          productRecommendations: [
            'Complementary products',
            'Popular bestsellers',
            'Beginner-friendly items',
          ],
          communicationPreferences: [
            'Welcome email series',
            'Onboarding tutorials',
            'Social media engagement',
          ],
        },
      },
    ];

    segments.forEach((segment, index) => {
      const id = `seg-${Date.now()}-${index}`;
      this.segments.set(id, {
        ...segment,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  /**
   * Create customer segment
   */
  async createSegment(
    params: Omit<CustomerSegment, 'id' | 'metrics' | 'createdAt' | 'updatedAt'>
  ): Promise<CustomerSegment> {
    const segment: CustomerSegment = {
      ...params,
      id: `seg-${Date.now()}`,
      metrics: {
        customerCount: 0,
        percentage: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        averageLifetimeValue: 0,
        conversionRate: 0,
        retentionRate: 0,
        churnRate: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.segments.set(segment.id, segment);
    return segment;
  }

  /**
   * Analyze customer behavior
   */
  async analyzeCustomerBehavior(customerId: string): Promise<CustomerBehavior> {
    // Mock behavior data
    const behavior: CustomerBehavior = {
      customerId,
      purchase: {
        totalOrders: 12,
        totalSpent: 6850,
        averageOrderValue: 570.83,
        firstPurchaseDate: new Date('2024-06-15'),
        lastPurchaseDate: new Date('2025-11-28'),
        daysSinceLastPurchase: 14,
        purchaseFrequency: 2.2,
        favoriteCategories: [
          { category: 'Textiles', purchases: 6 },
          { category: 'Jewelry', purchases: 4 },
        ],
        favoriteProducts: [
          { productId: 'prod-1', productName: 'Handwoven Silk Saree', purchases: 3 },
          { productId: 'prod-3', productName: 'Silver Jewelry Collection', purchases: 2 },
        ],
      },
      browsing: {
        totalSessions: 45,
        totalPageViews: 285,
        averageSessionDuration: 245,
        averagePagesPerSession: 6.3,
        bounceRate: 22.5,
        topPages: [
          { url: '/products/textiles', views: 68 },
          { url: '/artisans', views: 52 },
        ],
        devicePreference: 'mobile',
      },
      engagement: {
        emailOpenRate: 68.5,
        emailClickRate: 28.3,
        smsResponseRate: 15.2,
        pushNotificationEngagement: 42.5,
        socialMediaInteractions: 18,
        reviewsWritten: 8,
        referralsMade: 3,
      },
      cart: {
        abandonmentRate: 35.5,
        averageCartValue: 725,
        averageItemsInCart: 2.8,
        abandonedCarts: 5,
      },
      channelPreference: {
        preferredChannel: 'Mobile App',
        channelUsage: [
          { channel: 'Mobile App', percentage: 65 },
          { channel: 'Website', percentage: 30 },
          { channel: 'Marketplace', percentage: 5 },
        ],
      },
    };

    this.behaviors.set(customerId, behavior);
    return behavior;
  }

  /**
   * Calculate customer lifetime value
   */
  async calculateCLV(customerId: string): Promise<CustomerLifetimeValue> {
    const clv: CustomerLifetimeValue = {
      customerId,
      customerName: 'Customer ' + customerId,
      clv: {
        historical: 6850,
        predicted: 12500,
        potential: 18000,
      },
      components: {
        averageOrderValue: 570.83,
        purchaseFrequency: 2.2,
        customerLifespan: 3.5,
        grossMargin: 0.42,
        retentionRate: 0.75,
      },
      breakdown: {
        productRevenue: 6350,
        subscriptionRevenue: 500,
        serviceRevenue: 0,
        referralValue: 850,
      },
      cohort: {
        cohortName: 'June 2024',
        cohortAverage: 8500,
        percentile: 58,
      },
      profitability: {
        acquisitionCost: 185,
        totalProfit: 2877,
        profitMargin: 42.0,
        roi: 15.6,
      },
      risk: {
        churnProbability: 0.15,
        riskLevel: 'low',
        riskFactors: [],
      },
    };

    this.clvData.set(customerId, clv);
    return clv;
  }

  /**
   * Predict churn
   */
  async predictChurn(customerId: string): Promise<ChurnPrediction> {
    const prediction: ChurnPrediction = {
      customerId,
      customerName: 'Customer ' + customerId,
      prediction: {
        churnProbability: 0.32,
        riskLevel: 'medium',
        confidenceScore: 0.85,
        predictedChurnDate: new Date('2026-03-15'),
      },
      riskFactors: [
        { factor: 'Decreased purchase frequency', impact: 0.45, severity: 'high' },
        { factor: 'Longer time since last purchase', impact: 0.35, severity: 'medium' },
        { factor: 'Lower email engagement', impact: 0.2, severity: 'low' },
      ],
      signals: {
        decreasedEngagement: true,
        decreasedPurchaseFrequency: true,
        increasedComplaints: false,
        negativeReviews: false,
        cartAbandonment: true,
        unsubscribedFromEmails: false,
        longTimeSinceLastPurchase: false,
      },
      recommendations: [
        {
          action: 'Send personalized win-back offer',
          priority: 'high',
          expectedImpact: 0.65,
          effort: 'low',
        },
        {
          action: 'Reach out with satisfaction survey',
          priority: 'medium',
          expectedImpact: 0.45,
          effort: 'low',
        },
        {
          action: 'Offer exclusive preview of new collection',
          priority: 'medium',
          expectedImpact: 0.55,
          effort: 'medium',
        },
      ],
      historical: {
        currentScore: 0.32,
        thirtyDaysAgo: 0.25,
        sixtyDaysAgo: 0.18,
        ninetyDaysAgo: 0.12,
        trend: 'declining',
      },
    };

    this.churnPredictions.set(customerId, prediction);
    return prediction;
  }

  /**
   * Perform RFM analysis
   */
  async performRFMAnalysis(customerId: string): Promise<RFMAnalysis> {
    const rfm: RFMAnalysis = {
      customerId,
      customerName: 'Customer ' + customerId,
      scores: {
        recency: 4,
        frequency: 4,
        monetary: 4,
        total: 12,
      },
      values: {
        recency: 14,
        frequency: 12,
        monetary: 6850,
      },
      segment: {
        name: 'Champions',
        description: 'Best customers who buy frequently and recently',
        type: 'champions',
        priority: 'high',
      },
      recommendations: [
        {
          action: 'Invite to VIP program',
          channel: 'Email',
          message: 'Exclusive invitation to our VIP Circle',
          offer: 'Early access to new collections + 15% discount',
        },
        {
          action: 'Request referrals',
          channel: 'In-app',
          message: 'Share the love, get rewards',
          offer: '₹500 for each successful referral',
        },
      ],
      lastUpdated: new Date(),
    };

    this.rfmAnalysis.set(customerId, rfm);
    return rfm;
  }

  /**
   * Create cohort analysis
   */
  async createCohortAnalysis(params: {
    cohortName: string;
    cohortType: CohortAnalysis['cohortType'];
    definition: CohortAnalysis['definition'];
  }): Promise<CohortAnalysis> {
    const cohort: CohortAnalysis = {
      cohortName: params.cohortName,
      cohortType: params.cohortType,
      definition: params.definition,
      retention: Array.from({ length: 12 }, (_, i) => ({
        month: i,
        customers: params.definition.size * Math.pow(0.85, i),
        retentionRate: Math.pow(0.85, i) * 100,
        revenue: params.definition.size * Math.pow(0.85, i) * 500,
        cumulativeRevenue:
          params.definition.size * 500 * ((1 - Math.pow(0.85, i + 1)) / (1 - 0.85)),
      })),
      performance: {
        totalRevenue: params.definition.size * 6850,
        averageRevenuePerCustomer: 6850,
        averageLifetimeValue: 8500,
        churnRate: 15,
        activeRate: 85,
      },
      comparison: {
        industryBenchmark: 7500,
        companyAverage: 8200,
        performanceRating: 'good',
      },
    };

    this.cohorts.set(params.cohortName, cohort);
    return cohort;
  }

  /**
   * Get customer insights
   */
  async getCustomerInsights(period: { start: Date; end: Date }): Promise<CustomerInsights> {
    return {
      period,
      overview: {
        totalCustomers: 15230,
        activeCustomers: 10661,
        newCustomers: 2450,
        returningCustomers: 8211,
        lostCustomers: 1523,
        averageLifetimeValue: 2850,
        averageAcquisitionCost: 185,
      },
      segmentation: {
        byValue: {
          high: { count: 1523, revenue: 437500, percentage: 35 },
          medium: { count: 4569, revenue: 562500, percentage: 45 },
          low: { count: 9138, revenue: 250000, percentage: 20 },
        },
        byLoyalty: {
          champions: 1523,
          loyal: 4569,
          atrisk: 2284,
          lost: 1523,
        },
        byEngagement: {
          highly_engaged: 3046,
          moderately_engaged: 6092,
          low_engagement: 4569,
          inactive: 1523,
        },
      },
      trends: {
        customerGrowth: 15.2,
        retentionRate: 68.5,
        churnRate: 31.5,
        reactivationRate: 12.3,
        referralRate: 8.5,
      },
      topCustomers: [
        {
          customerId: 'cust-1',
          customerName: 'Priya Sharma',
          totalSpent: 25600,
          orders: 38,
          lifetimeValue: 32000,
        },
        {
          customerId: 'cust-2',
          customerName: 'Rajesh Kumar',
          totalSpent: 22400,
          orders: 35,
          lifetimeValue: 28000,
        },
        {
          customerId: 'cust-3',
          customerName: 'Anita Desai',
          totalSpent: 19800,
          orders: 32,
          lifetimeValue: 24500,
        },
      ],
    };
  }

  /**
   * Get all segments
   */
  async getAllSegments(): Promise<CustomerSegment[]> {
    return Array.from(this.segments.values());
  }

  /**
   * Get segment by ID
   */
  async getSegment(segmentId: string): Promise<CustomerSegment | null> {
    return this.segments.get(segmentId) || null;
  }
}

// Export singleton instance
export const customerAnalyticsSystem = new CustomerAnalyticsSystem();
