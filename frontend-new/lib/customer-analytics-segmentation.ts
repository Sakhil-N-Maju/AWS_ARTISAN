/**
 * Customer Analytics & Segmentation System
 *
 * Advanced customer behavior analysis, segmentation, lifetime value calculation,
 * churn prediction, and personalization insights.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type CustomerSegment =
  | 'vip'
  | 'high-value'
  | 'loyal'
  | 'at-risk'
  | 'dormant'
  | 'new'
  | 'occasional'
  | 'bargain-hunter';

export type BehaviorType =
  | 'purchase'
  | 'browse'
  | 'search'
  | 'cart-add'
  | 'wishlist'
  | 'review'
  | 'share'
  | 'return';

export type CustomerLifecycleStage =
  | 'prospect'
  | 'first-time'
  | 'active'
  | 'repeat'
  | 'champion'
  | 'at-risk'
  | 'churned'
  | 'reactivated';

export type RFMScore = 1 | 2 | 3 | 4 | 5;

export type ChurnRisk = 'very-low' | 'low' | 'medium' | 'high' | 'very-high';

export type EngagementLevel =
  | 'highly-engaged'
  | 'engaged'
  | 'moderately-engaged'
  | 'low-engagement'
  | 'disengaged';

export interface CustomerProfile {
  userId: string;
  demographics: {
    age?: number;
    gender?: string;
    location?: {
      country: string;
      state?: string;
      city?: string;
      timezone?: string;
    };
    language?: string;
    occupation?: string;
  };
  segments: CustomerSegment[];
  lifecycleStage: CustomerLifecycleStage;
  rfmScore: {
    recency: RFMScore;
    frequency: RFMScore;
    monetary: RFMScore;
    overall: number; // 111-555
    lastCalculated: Date;
  };
  metrics: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lifetimeValue: number;
    predictedLTV: number;
    acquisitionCost: number;
    ltvcacRatio: number;
    daysSinceFirstPurchase: number;
    daysSinceLastPurchase: number;
    purchaseFrequency: number; // days between purchases
  };
  engagement: {
    level: EngagementLevel;
    score: number; // 0-100
    emailEngagement: {
      opens: number;
      clicks: number;
      openRate: number;
      clickRate: number;
    };
    siteEngagement: {
      visits: number;
      pageViews: number;
      avgSessionDuration: number;
      bounceRate: number;
    };
    socialEngagement: {
      shares: number;
      likes: number;
      comments: number;
    };
  };
  churnPrediction: {
    risk: ChurnRisk;
    probability: number; // 0-1
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    preventionActions: string[];
    lastAssessed: Date;
  };
  preferences: {
    categories: Array<{
      category: string;
      affinity: number; // 0-100
      purchases: number;
    }>;
    brands: Array<{
      brand: string;
      affinity: number;
      purchases: number;
    }>;
    priceRange: {
      min: number;
      max: number;
      average: number;
    };
    shoppingPattern: {
      preferredDays: number[]; // 0-6
      preferredHours: number[]; // 0-23
      avgDecisionTime: number; // hours
    };
  };
  behavior: {
    browsing: {
      totalSessions: number;
      productViews: number;
      categoryViews: Record<string, number>;
      searchQueries: string[];
    };
    purchasing: {
      conversionRate: number;
      cartAbandonmentRate: number;
      returnRate: number;
      reviewRate: number;
    };
    loyalty: {
      referrals: number;
      reviewsWritten: number;
      wishlistItems: number;
      repeatPurchaseRate: number;
    };
  };
  recommendations: {
    nextBestAction: string;
    personalizedOffers: string[];
    crossSellOpportunities: string[];
    upsellOpportunities: string[];
  };
  lastUpdated: Date;
}

export interface CustomerSegmentDefinition {
  id: string;
  segment: CustomerSegment;
  name: string;
  description: string;
  priority: number;
  criteria: {
    rules: Array<{
      field: string;
      operator: 'equals' | 'greater-than' | 'less-than' | 'between' | 'in' | 'contains';
      value: any;
      weight?: number;
    }>;
    combineWith: 'AND' | 'OR';
    minScore?: number;
  };
  characteristics: {
    typical: Record<string, any>;
    avgLifetimeValue: number;
    avgOrderValue: number;
    avgPurchaseFrequency: number;
    churnRate: number;
  };
  strategies: {
    retention: string[];
    engagement: string[];
    monetization: string[];
  };
  metrics: {
    size: number;
    growthRate: number; // percentage
    revenueContribution: number; // percentage
    profitability: number;
  };
  lastUpdated: Date;
}

export interface BehaviorEvent {
  id: string;
  userId: string;
  sessionId: string;
  type: BehaviorType;
  timestamp: Date;
  context: {
    productId?: string;
    categoryId?: string;
    searchQuery?: string;
    referrer?: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
    platform: string;
  };
  metadata: {
    duration?: number; // seconds
    value?: number;
    quantity?: number;
    properties?: Record<string, any>;
  };
  attributes: {
    source: string;
    campaign?: string;
    medium?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface CustomerJourney {
  userId: string;
  journeyId: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'abandoned';
  stages: Array<{
    stage: string;
    enteredAt: Date;
    exitedAt?: Date;
    duration?: number; // minutes
    touchpoints: Array<{
      type: string;
      timestamp: Date;
      channel: string;
      interaction: string;
    }>;
    conversions: number;
  }>;
  attribution: {
    firstTouch: {
      channel: string;
      campaign?: string;
      timestamp: Date;
    };
    lastTouch: {
      channel: string;
      campaign?: string;
      timestamp: Date;
    };
    assistedTouches: Array<{
      channel: string;
      timestamp: Date;
      contribution: number; // percentage
    }>;
  };
  outcomes: {
    converted: boolean;
    revenue?: number;
    products?: string[];
    satisfactionScore?: number;
  };
  insights: {
    keyMoments: string[];
    dropoffPoints: string[];
    successFactors: string[];
  };
}

export interface CustomerCohort {
  id: string;
  name: string;
  description: string;
  cohortDate: Date;
  definition: {
    event: string;
    period: 'day' | 'week' | 'month';
    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  size: number;
  metrics: {
    retention: Array<{
      period: number;
      rate: number; // percentage
      absolute: number;
    }>;
    revenue: Array<{
      period: number;
      total: number;
      perCustomer: number;
      cumulative: number;
    }>;
    engagement: Array<{
      period: number;
      activeUsers: number;
      avgSessions: number;
      avgDuration: number;
    }>;
    ltv: Array<{
      period: number;
      value: number;
      projected: number;
    }>;
  };
  comparison: {
    previousCohort?: string;
    benchmark?: string;
    variance?: number; // percentage
  };
  createdAt: Date;
  lastCalculated: Date;
}

export interface PersonalizationProfile {
  userId: string;
  preferences: {
    productRecommendations: Array<{
      productId: string;
      score: number;
      reason: string;
      category: string;
    }>;
    contentRecommendations: Array<{
      contentId: string;
      type: string;
      score: number;
      reason: string;
    }>;
    emailPreferences: {
      frequency: 'daily' | 'weekly' | 'monthly' | 'never';
      topics: string[];
      bestTimeToSend: {
        day: number;
        hour: number;
      };
    };
  };
  affinities: {
    categories: Record<string, number>;
    attributes: Record<string, number>;
    pricePoints: Record<string, number>;
  };
  predictions: {
    nextPurchase: {
      products: string[];
      probability: number;
      estimatedDate?: Date;
      estimatedValue?: number;
    };
    churnProbability: number;
    upsellReadiness: number;
    crossSellOpportunities: Array<{
      product: string;
      basedOn: string;
      confidence: number;
    }>;
  };
  experiments: Array<{
    experimentId: string;
    variant: string;
    enrolledAt: Date;
    converted?: boolean;
  }>;
  lastUpdated: Date;
}

export interface CustomerSatisfactionMetrics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  nps: {
    score: number; // -100 to 100
    category: 'detractor' | 'passive' | 'promoter';
    surveyDate: Date;
    feedback?: string;
  };
  csat: {
    score: number; // 1-5
    surveyCount: number;
    avgScore: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  ces: {
    score: number; // 1-7
    effort: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
    interactions: Array<{
      type: string;
      score: number;
      feedback?: string;
    }>;
  };
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number; // -1 to 1
    sources: Array<{
      source: 'review' | 'support' | 'social' | 'survey';
      sentiment: number;
      text?: string;
    }>;
  };
  supportInteractions: {
    totalTickets: number;
    avgResolutionTime: number; // hours
    firstContactResolution: number; // percentage
    escalations: number;
  };
}

export interface CustomerValueSegmentation {
  userId: string;
  currentValue: {
    actual: number;
    percentile: number;
    rank: number;
  };
  potentialValue: {
    estimated: number;
    percentile: number;
    growthPotential: number; // percentage
  };
  valueDrivers: Array<{
    driver: string;
    contribution: number; // percentage
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
  strategies: {
    retention: {
      priority: 'low' | 'medium' | 'high';
      tactics: string[];
      estimatedROI: number;
    };
    growth: {
      opportunities: string[];
      estimatedValue: number;
      timeline: string;
    };
  };
}

export interface CustomerAnalyticsReport {
  id: string;
  reportType:
    | 'segment-analysis'
    | 'cohort-analysis'
    | 'churn-analysis'
    | 'ltv-analysis'
    | 'behavior-analysis';
  period: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
  data: {
    summary: {
      totalCustomers: number;
      activeCustomers: number;
      newCustomers: number;
      churnedCustomers: number;
      reactivatedCustomers: number;
    };
    segments: Array<{
      segment: CustomerSegment;
      size: number;
      growth: number;
      revenue: number;
      avgLTV: number;
    }>;
    metrics: {
      avgLifetimeValue: number;
      avgOrderValue: number;
      avgPurchaseFrequency: number;
      customerRetentionRate: number;
      churnRate: number;
      reactivationRate: number;
    };
    trends: Array<{
      metric: string;
      current: number;
      previous: number;
      change: number;
      changePercent: number;
    }>;
    insights: Array<{
      type: string;
      description: string;
      impact: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
  };
  visualizations: Array<{
    type: string;
    title: string;
    data: any;
  }>;
}

// ============================================================================
// Main System Class
// ============================================================================

export class CustomerAnalyticsSegmentationSystem {
  private customerProfiles: Map<string, CustomerProfile> = new Map();
  private segmentDefinitions: Map<string, CustomerSegmentDefinition> = new Map();
  private behaviorEvents: BehaviorEvent[] = [];
  private customerJourneys: Map<string, CustomerJourney[]> = new Map();
  private cohorts: Map<string, CustomerCohort> = new Map();
  private personalizationProfiles: Map<string, PersonalizationProfile> = new Map();
  private satisfactionMetrics: Map<string, CustomerSatisfactionMetrics> = new Map();
  private valueSegmentation: Map<string, CustomerValueSegmentation> = new Map();
  private analyticsReports: Map<string, CustomerAnalyticsReport> = new Map();

  constructor() {
    this.initializeSegmentDefinitions();
  }

  // ============================================================================
  // Customer Profile Management
  // ============================================================================

  createCustomerProfile(
    userId: string,
    demographics?: CustomerProfile['demographics']
  ): CustomerProfile {
    const profile: CustomerProfile = {
      userId,
      demographics: demographics || {},
      segments: ['new'],
      lifecycleStage: 'prospect',
      rfmScore: {
        recency: 1,
        frequency: 1,
        monetary: 1,
        overall: 111,
        lastCalculated: new Date(),
      },
      metrics: {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        lifetimeValue: 0,
        predictedLTV: 0,
        acquisitionCost: 0,
        ltvcacRatio: 0,
        daysSinceFirstPurchase: 0,
        daysSinceLastPurchase: 0,
        purchaseFrequency: 0,
      },
      engagement: {
        level: 'disengaged',
        score: 0,
        emailEngagement: {
          opens: 0,
          clicks: 0,
          openRate: 0,
          clickRate: 0,
        },
        siteEngagement: {
          visits: 0,
          pageViews: 0,
          avgSessionDuration: 0,
          bounceRate: 0,
        },
        socialEngagement: {
          shares: 0,
          likes: 0,
          comments: 0,
        },
      },
      churnPrediction: {
        risk: 'very-low',
        probability: 0,
        factors: [],
        preventionActions: [],
        lastAssessed: new Date(),
      },
      preferences: {
        categories: [],
        brands: [],
        priceRange: {
          min: 0,
          max: 0,
          average: 0,
        },
        shoppingPattern: {
          preferredDays: [],
          preferredHours: [],
          avgDecisionTime: 0,
        },
      },
      behavior: {
        browsing: {
          totalSessions: 0,
          productViews: 0,
          categoryViews: {},
          searchQueries: [],
        },
        purchasing: {
          conversionRate: 0,
          cartAbandonmentRate: 0,
          returnRate: 0,
          reviewRate: 0,
        },
        loyalty: {
          referrals: 0,
          reviewsWritten: 0,
          wishlistItems: 0,
          repeatPurchaseRate: 0,
        },
      },
      recommendations: {
        nextBestAction: 'Complete first purchase',
        personalizedOffers: [],
        crossSellOpportunities: [],
        upsellOpportunities: [],
      },
      lastUpdated: new Date(),
    };

    this.customerProfiles.set(userId, profile);
    return profile;
  }

  updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): CustomerProfile {
    const profile = this.customerProfiles.get(userId);
    if (!profile) throw new Error('Customer profile not found');

    Object.assign(profile, updates);
    profile.lastUpdated = new Date();

    // Recalculate segments
    this.assignCustomerSegments(userId);

    // Update RFM score
    this.calculateRFMScore(userId);

    // Update lifecycle stage
    this.updateLifecycleStage(userId);

    // Predict churn
    this.predictChurn(userId);

    return profile;
  }

  // ============================================================================
  // RFM Analysis
  // ============================================================================

  calculateRFMScore(userId: string): CustomerProfile['rfmScore'] {
    const profile = this.customerProfiles.get(userId);
    if (!profile) throw new Error('Customer profile not found');

    // Calculate Recency score (1-5, 5 is best)
    const daysSinceLastPurchase = profile.metrics.daysSinceLastPurchase;
    let recency: RFMScore;
    if (daysSinceLastPurchase <= 30) recency = 5;
    else if (daysSinceLastPurchase <= 60) recency = 4;
    else if (daysSinceLastPurchase <= 90) recency = 3;
    else if (daysSinceLastPurchase <= 180) recency = 2;
    else recency = 1;

    // Calculate Frequency score (1-5, 5 is best)
    const totalOrders = profile.metrics.totalOrders;
    let frequency: RFMScore;
    if (totalOrders >= 20) frequency = 5;
    else if (totalOrders >= 10) frequency = 4;
    else if (totalOrders >= 5) frequency = 3;
    else if (totalOrders >= 2) frequency = 2;
    else frequency = 1;

    // Calculate Monetary score (1-5, 5 is best)
    const totalSpent = profile.metrics.totalSpent;
    let monetary: RFMScore;
    if (totalSpent >= 10000) monetary = 5;
    else if (totalSpent >= 5000) monetary = 4;
    else if (totalSpent >= 2000) monetary = 3;
    else if (totalSpent >= 500) monetary = 2;
    else monetary = 1;

    const overall = parseInt(`${recency}${frequency}${monetary}`);

    profile.rfmScore = {
      recency,
      frequency,
      monetary,
      overall,
      lastCalculated: new Date(),
    };

    return profile.rfmScore;
  }

  // ============================================================================
  // Customer Segmentation
  // ============================================================================

  assignCustomerSegments(userId: string): CustomerSegment[] {
    const profile = this.customerProfiles.get(userId);
    if (!profile) throw new Error('Customer profile not found');

    const segments: CustomerSegment[] = [];

    // VIP segment
    if (profile.metrics.totalSpent > 10000 && profile.metrics.totalOrders > 20) {
      segments.push('vip');
    }

    // High-value segment
    if (profile.metrics.lifetimeValue > 5000 && !segments.includes('vip')) {
      segments.push('high-value');
    }

    // Loyal segment
    if (profile.metrics.totalOrders > 10 && profile.behavior.loyalty.repeatPurchaseRate > 0.7) {
      segments.push('loyal');
    }

    // At-risk segment
    if (profile.churnPrediction.risk === 'high' || profile.churnPrediction.risk === 'very-high') {
      segments.push('at-risk');
    }

    // Dormant segment
    if (profile.metrics.daysSinceLastPurchase > 180 && profile.metrics.totalOrders > 0) {
      segments.push('dormant');
    }

    // New segment
    if (profile.metrics.daysSinceFirstPurchase < 30 && profile.metrics.totalOrders <= 1) {
      segments.push('new');
    }

    // Occasional segment
    if (
      profile.metrics.totalOrders >= 2 &&
      profile.metrics.totalOrders < 5 &&
      !segments.includes('new')
    ) {
      segments.push('occasional');
    }

    // Bargain hunter
    if (profile.preferences.priceRange.average < 50 && profile.metrics.totalOrders > 3) {
      segments.push('bargain-hunter');
    }

    profile.segments = segments.length > 0 ? segments : ['new'];
    return profile.segments;
  }

  createSegmentDefinition(params: {
    segment: CustomerSegment;
    name: string;
    description: string;
    criteria: CustomerSegmentDefinition['criteria'];
  }): CustomerSegmentDefinition {
    const definition: CustomerSegmentDefinition = {
      id: `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      segment: params.segment,
      name: params.name,
      description: params.description,
      priority: 1,
      criteria: params.criteria,
      characteristics: {
        typical: {},
        avgLifetimeValue: 0,
        avgOrderValue: 0,
        avgPurchaseFrequency: 0,
        churnRate: 0,
      },
      strategies: {
        retention: [],
        engagement: [],
        monetization: [],
      },
      metrics: {
        size: 0,
        growthRate: 0,
        revenueContribution: 0,
        profitability: 0,
      },
      lastUpdated: new Date(),
    };

    this.segmentDefinitions.set(definition.id, definition);
    return definition;
  }

  // ============================================================================
  // Lifecycle Stage Management
  // ============================================================================

  updateLifecycleStage(userId: string): CustomerLifecycleStage {
    const profile = this.customerProfiles.get(userId);
    if (!profile) throw new Error('Customer profile not found');

    let stage: CustomerLifecycleStage;

    if (profile.metrics.totalOrders === 0) {
      stage = 'prospect';
    } else if (profile.metrics.totalOrders === 1) {
      stage = 'first-time';
    } else if (profile.metrics.daysSinceLastPurchase > 365) {
      stage = 'churned';
    } else if (profile.metrics.daysSinceLastPurchase > 180) {
      stage = 'at-risk';
    } else if (profile.metrics.totalOrders >= 20 && profile.metrics.totalSpent >= 10000) {
      stage = 'champion';
    } else if (profile.metrics.totalOrders >= 5) {
      stage = 'repeat';
    } else if (profile.metrics.totalOrders >= 2 && profile.metrics.daysSinceLastPurchase <= 90) {
      stage = 'active';
    } else if (profile.lifecycleStage === 'churned' && profile.metrics.daysSinceLastPurchase < 90) {
      stage = 'reactivated';
    } else {
      stage = 'active';
    }

    profile.lifecycleStage = stage;
    return stage;
  }

  // ============================================================================
  // Churn Prediction
  // ============================================================================

  predictChurn(userId: string): CustomerProfile['churnPrediction'] {
    const profile = this.customerProfiles.get(userId);
    if (!profile) throw new Error('Customer profile not found');

    let churnScore = 0;
    const factors: CustomerProfile['churnPrediction']['factors'] = [];

    // Days since last purchase
    if (profile.metrics.daysSinceLastPurchase > 180) {
      churnScore += 30;
      factors.push({
        factor: 'Long time since last purchase',
        impact: 30,
        description: `${profile.metrics.daysSinceLastPurchase} days since last purchase`,
      });
    } else if (profile.metrics.daysSinceLastPurchase > 90) {
      churnScore += 15;
      factors.push({
        factor: 'Moderate time since last purchase',
        impact: 15,
        description: `${profile.metrics.daysSinceLastPurchase} days since last purchase`,
      });
    }

    // Engagement level
    if (
      profile.engagement.level === 'disengaged' ||
      profile.engagement.level === 'low-engagement'
    ) {
      churnScore += 25;
      factors.push({
        factor: 'Low engagement',
        impact: 25,
        description: `Engagement level: ${profile.engagement.level}`,
      });
    }

    // Email engagement
    if (profile.engagement.emailEngagement.openRate < 0.1) {
      churnScore += 15;
      factors.push({
        factor: 'Poor email engagement',
        impact: 15,
        description: `Email open rate: ${(profile.engagement.emailEngagement.openRate * 100).toFixed(1)}%`,
      });
    }

    // Declining purchase frequency
    if (profile.metrics.purchaseFrequency > 90) {
      churnScore += 10;
      factors.push({
        factor: 'Low purchase frequency',
        impact: 10,
        description: `Purchases every ${profile.metrics.purchaseFrequency} days`,
      });
    }

    // Support issues
    const satisfaction = this.satisfactionMetrics.get(userId);
    if (satisfaction?.nps.category === 'detractor') {
      churnScore += 20;
      factors.push({
        factor: 'Negative satisfaction',
        impact: 20,
        description: `NPS score: ${satisfaction.nps.score}`,
      });
    }

    // Determine risk level
    const probability = Math.min(churnScore / 100, 1);
    let risk: ChurnRisk;
    if (probability < 0.2) risk = 'very-low';
    else if (probability < 0.4) risk = 'low';
    else if (probability < 0.6) risk = 'medium';
    else if (probability < 0.8) risk = 'high';
    else risk = 'very-high';

    // Generate prevention actions
    const preventionActions = this.generateChurnPreventionActions(factors);

    profile.churnPrediction = {
      risk,
      probability,
      factors,
      preventionActions,
      lastAssessed: new Date(),
    };

    return profile.churnPrediction;
  }

  private generateChurnPreventionActions(
    factors: CustomerProfile['churnPrediction']['factors']
  ): string[] {
    const actions: string[] = [];
    const factorTypes = new Set(factors.map((f) => f.factor));

    if (factorTypes.has('Long time since last purchase')) {
      actions.push('Send personalized re-engagement email with exclusive offer');
      actions.push('Offer time-limited discount on preferred categories');
    }

    if (factorTypes.has('Low engagement')) {
      actions.push('Reduce email frequency to avoid fatigue');
      actions.push('Send content focused on customer interests');
      actions.push('Reach out via preferred channel');
    }

    if (factorTypes.has('Poor email engagement')) {
      actions.push('Test different email subject lines');
      actions.push('Optimize send time based on past behavior');
      actions.push('Switch to SMS or push notifications');
    }

    if (factorTypes.has('Negative satisfaction')) {
      actions.push('Schedule personal outreach from customer success');
      actions.push('Offer compensation or goodwill gesture');
      actions.push('Request feedback and act on concerns');
    }

    return actions;
  }

  // ============================================================================
  // Behavior Tracking
  // ============================================================================

  trackBehavior(params: {
    userId: string;
    sessionId: string;
    type: BehaviorType;
    context: BehaviorEvent['context'];
    metadata?: BehaviorEvent['metadata'];
    attributes?: BehaviorEvent['attributes'];
  }): BehaviorEvent {
    const event: BehaviorEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      sessionId: params.sessionId,
      type: params.type,
      timestamp: new Date(),
      context: params.context,
      metadata: params.metadata || {},
      attributes: params.attributes || {
        source: 'web',
      },
    };

    this.behaviorEvents.push(event);

    // Update customer profile based on behavior
    this.updateProfileFromBehavior(event);

    return event;
  }

  private updateProfileFromBehavior(event: BehaviorEvent): void {
    const profile = this.customerProfiles.get(event.userId);
    if (!profile) return;

    switch (event.type) {
      case 'browse':
        profile.behavior.browsing.totalSessions++;
        break;

      case 'purchase':
        profile.metrics.totalOrders++;
        if (event.metadata.value) {
          profile.metrics.totalSpent += event.metadata.value;
          profile.metrics.averageOrderValue =
            profile.metrics.totalSpent / profile.metrics.totalOrders;
        }
        break;

      case 'search':
        if (event.context.searchQuery) {
          profile.behavior.browsing.searchQueries.push(event.context.searchQuery);
        }
        break;

      case 'review':
        profile.behavior.loyalty.reviewsWritten++;
        break;

      case 'wishlist':
        profile.behavior.loyalty.wishlistItems++;
        break;
    }

    profile.lastUpdated = new Date();
  }

  // ============================================================================
  // Customer Journey Tracking
  // ============================================================================

  createCustomerJourney(params: {
    userId: string;
    initialChannel: string;
    campaign?: string;
  }): CustomerJourney {
    const journey: CustomerJourney = {
      userId: params.userId,
      journeyId: `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startDate: new Date(),
      status: 'active',
      stages: [],
      attribution: {
        firstTouch: {
          channel: params.initialChannel,
          campaign: params.campaign,
          timestamp: new Date(),
        },
        lastTouch: {
          channel: params.initialChannel,
          campaign: params.campaign,
          timestamp: new Date(),
        },
        assistedTouches: [],
      },
      outcomes: {
        converted: false,
      },
      insights: {
        keyMoments: [],
        dropoffPoints: [],
        successFactors: [],
      },
    };

    const journeys = this.customerJourneys.get(params.userId) || [];
    journeys.push(journey);
    this.customerJourneys.set(params.userId, journeys);

    return journey;
  }

  // ============================================================================
  // Cohort Analysis
  // ============================================================================

  createCohort(params: {
    name: string;
    description: string;
    cohortDate: Date;
    definition: CustomerCohort['definition'];
  }): CustomerCohort {
    const cohort: CustomerCohort = {
      id: `cohort_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      cohortDate: params.cohortDate,
      definition: params.definition,
      size: Math.floor(100 + Math.random() * 900),
      metrics: {
        retention: [],
        revenue: [],
        engagement: [],
        ltv: [],
      },
      createdAt: new Date(),
      lastCalculated: new Date(),
    };

    // Calculate cohort metrics
    this.calculateCohortMetrics(cohort);

    this.cohorts.set(cohort.id, cohort);
    return cohort;
  }

  private calculateCohortMetrics(cohort: CustomerCohort): void {
    let retention = 100;
    let cumulativeRevenue = 0;
    let ltv = 0;

    for (let period = 0; period < 12; period++) {
      // Retention calculation
      retention *= 0.75 + Math.random() * 0.15; // 75-90% retention
      cohort.metrics.retention.push({
        period,
        rate: retention,
        absolute: Math.floor((cohort.size * retention) / 100),
      });

      // Revenue calculation
      const periodRevenue = (50 + Math.random() * 150) * ((cohort.size * retention) / 100);
      cumulativeRevenue += periodRevenue;
      cohort.metrics.revenue.push({
        period,
        total: periodRevenue,
        perCustomer: periodRevenue / ((cohort.size * retention) / 100),
        cumulative: cumulativeRevenue,
      });

      // Engagement calculation
      cohort.metrics.engagement.push({
        period,
        activeUsers: Math.floor((cohort.size * retention) / 100),
        avgSessions: 3 + Math.random() * 7,
        avgDuration: 300 + Math.random() * 600, // 5-15 minutes
      });

      // LTV calculation
      ltv = cumulativeRevenue / cohort.size;
      const projectedLTV = ltv * (1 + 0.1 * (12 - period));
      cohort.metrics.ltv.push({
        period,
        value: ltv,
        projected: projectedLTV,
      });
    }
  }

  // ============================================================================
  // Personalization
  // ============================================================================

  createPersonalizationProfile(userId: string): PersonalizationProfile {
    const customerProfile = this.customerProfiles.get(userId);

    const profile: PersonalizationProfile = {
      userId,
      preferences: {
        productRecommendations: [],
        contentRecommendations: [],
        emailPreferences: {
          frequency: 'weekly',
          topics: [],
          bestTimeToSend: {
            day: 2, // Tuesday
            hour: 10, // 10 AM
          },
        },
      },
      affinities: {
        categories: {},
        attributes: {},
        pricePoints: {},
      },
      predictions: {
        nextPurchase: {
          products: [],
          probability: 0,
        },
        churnProbability: customerProfile?.churnPrediction.probability || 0,
        upsellReadiness: 0,
        crossSellOpportunities: [],
      },
      experiments: [],
      lastUpdated: new Date(),
    };

    this.personalizationProfiles.set(userId, profile);
    return profile;
  }

  generateRecommendations(
    userId: string
  ): PersonalizationProfile['preferences']['productRecommendations'] {
    const profile = this.customerProfiles.get(userId);
    const personalization = this.personalizationProfiles.get(userId);

    if (!profile || !personalization) return [];

    const recommendations: PersonalizationProfile['preferences']['productRecommendations'] = [];

    // Based on purchase history
    profile.preferences.categories.forEach((category, index) => {
      if (index < 5) {
        recommendations.push({
          productId: `prod_${category.category}_${Math.random().toString(36).substr(2, 5)}`,
          score: category.affinity,
          reason: `Based on your interest in ${category.category}`,
          category: category.category,
        });
      }
    });

    return recommendations;
  }

  // ============================================================================
  // Customer Satisfaction Tracking
  // ============================================================================

  recordSatisfactionMetrics(params: {
    userId: string;
    nps?: { score: number; feedback?: string };
    csat?: { score: number };
    ces?: { score: number; type: string; feedback?: string };
  }): CustomerSatisfactionMetrics {
    let metrics = this.satisfactionMetrics.get(params.userId);

    if (!metrics) {
      metrics = {
        userId: params.userId,
        period: {
          start: new Date(),
          end: new Date(),
        },
        nps: {
          score: 0,
          category: 'passive',
          surveyDate: new Date(),
        },
        csat: {
          score: 0,
          surveyCount: 0,
          avgScore: 0,
          trend: 'stable',
        },
        ces: {
          score: 0,
          effort: 'medium',
          interactions: [],
        },
        sentiment: {
          overall: 'neutral',
          score: 0,
          sources: [],
        },
        supportInteractions: {
          totalTickets: 0,
          avgResolutionTime: 0,
          firstContactResolution: 0,
          escalations: 0,
        },
      };
    }

    if (params.nps) {
      metrics.nps = {
        score: params.nps.score,
        category:
          params.nps.score >= 9 ? 'promoter' : params.nps.score >= 7 ? 'passive' : 'detractor',
        surveyDate: new Date(),
        feedback: params.nps.feedback,
      };
    }

    if (params.csat) {
      metrics.csat.surveyCount++;
      metrics.csat.score = params.csat.score;
      metrics.csat.avgScore =
        (metrics.csat.avgScore * (metrics.csat.surveyCount - 1) + params.csat.score) /
        metrics.csat.surveyCount;
    }

    if (params.ces) {
      metrics.ces.score = params.ces.score;
      metrics.ces.effort =
        params.ces.score <= 2
          ? 'very-low'
          : params.ces.score <= 3
            ? 'low'
            : params.ces.score <= 5
              ? 'medium'
              : params.ces.score <= 6
                ? 'high'
                : 'very-high';
      metrics.ces.interactions.push({
        type: params.ces.type,
        score: params.ces.score,
        feedback: params.ces.feedback,
      });
    }

    this.satisfactionMetrics.set(params.userId, metrics);
    return metrics;
  }

  // ============================================================================
  // Analytics & Reporting
  // ============================================================================

  generateCustomerAnalyticsReport(params: {
    reportType: CustomerAnalyticsReport['reportType'];
    period: { start: Date; end: Date };
  }): CustomerAnalyticsReport {
    const profiles = Array.from(this.customerProfiles.values());

    const report: CustomerAnalyticsReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reportType: params.reportType,
      period: params.period,
      generatedAt: new Date(),
      data: {
        summary: {
          totalCustomers: profiles.length,
          activeCustomers: profiles.filter((p) => p.metrics.daysSinceLastPurchase <= 90).length,
          newCustomers: profiles.filter(
            (p) => p.lifecycleStage === 'new' || p.lifecycleStage === 'first-time'
          ).length,
          churnedCustomers: profiles.filter((p) => p.lifecycleStage === 'churned').length,
          reactivatedCustomers: profiles.filter((p) => p.lifecycleStage === 'reactivated').length,
        },
        segments: this.calculateSegmentMetrics(profiles),
        metrics: {
          avgLifetimeValue:
            profiles.reduce((sum, p) => sum + p.metrics.lifetimeValue, 0) / profiles.length,
          avgOrderValue:
            profiles.reduce((sum, p) => sum + p.metrics.averageOrderValue, 0) / profiles.length,
          avgPurchaseFrequency:
            profiles.reduce((sum, p) => sum + p.metrics.purchaseFrequency, 0) / profiles.length,
          customerRetentionRate: 85,
          churnRate: 15,
          reactivationRate: 5,
        },
        trends: [],
        insights: this.generateAnalyticsInsights(profiles),
      },
      visualizations: [],
    };

    this.analyticsReports.set(report.id, report);
    return report;
  }

  private calculateSegmentMetrics(
    profiles: CustomerProfile[]
  ): CustomerAnalyticsReport['data']['segments'] {
    const segmentMetrics: CustomerAnalyticsReport['data']['segments'] = [];
    const segments: CustomerSegment[] = [
      'vip',
      'high-value',
      'loyal',
      'at-risk',
      'dormant',
      'new',
      'occasional',
      'bargain-hunter',
    ];

    segments.forEach((segment) => {
      const segmentProfiles = profiles.filter((p) => p.segments.includes(segment));

      segmentMetrics.push({
        segment,
        size: segmentProfiles.length,
        growth: 10, // Simulated
        revenue: segmentProfiles.reduce((sum, p) => sum + p.metrics.totalSpent, 0),
        avgLTV:
          segmentProfiles.reduce((sum, p) => sum + p.metrics.lifetimeValue, 0) /
          (segmentProfiles.length || 1),
      });
    });

    return segmentMetrics;
  }

  private generateAnalyticsInsights(
    profiles: CustomerProfile[]
  ): CustomerAnalyticsReport['data']['insights'] {
    const insights: CustomerAnalyticsReport['data']['insights'] = [];

    // High churn risk insight
    const highRiskCustomers = profiles.filter(
      (p) => p.churnPrediction.risk === 'high' || p.churnPrediction.risk === 'very-high'
    );
    if (highRiskCustomers.length > profiles.length * 0.15) {
      insights.push({
        type: 'churn-risk',
        description: `${highRiskCustomers.length} customers (${((highRiskCustomers.length / profiles.length) * 100).toFixed(1)}%) are at high risk of churning`,
        impact: 'high',
        recommendation: 'Launch targeted retention campaign with personalized offers',
      });
    }

    // VIP growth opportunity
    const vipCustomers = profiles.filter((p) => p.segments.includes('vip'));
    const highValueCustomers = profiles.filter((p) => p.segments.includes('high-value'));
    if (highValueCustomers.length > vipCustomers.length * 2) {
      insights.push({
        type: 'growth-opportunity',
        description: `${highValueCustomers.length} high-value customers could be converted to VIP status`,
        impact: 'medium',
        recommendation: 'Create VIP program benefits and personalized upgrade path',
      });
    }

    // Engagement decline
    const lowEngagement = profiles.filter(
      (p) => p.engagement.level === 'disengaged' || p.engagement.level === 'low-engagement'
    );
    if (lowEngagement.length > profiles.length * 0.2) {
      insights.push({
        type: 'engagement',
        description: `${((lowEngagement.length / profiles.length) * 100).toFixed(1)}% of customers show low engagement`,
        impact: 'medium',
        recommendation: 'Review content strategy and communication frequency',
      });
    }

    return insights;
  }

  // ============================================================================
  // Initialization Methods
  // ============================================================================

  private initializeSegmentDefinitions(): void {
    this.createSegmentDefinition({
      segment: 'vip',
      name: 'VIP Customers',
      description: 'Highest value customers with significant lifetime value',
      criteria: {
        rules: [
          { field: 'totalSpent', operator: 'greater-than', value: 10000 },
          { field: 'totalOrders', operator: 'greater-than', value: 20 },
        ],
        combineWith: 'AND',
      },
    });

    this.createSegmentDefinition({
      segment: 'at-risk',
      name: 'At-Risk Customers',
      description: 'Customers with high churn probability',
      criteria: {
        rules: [{ field: 'churnPrediction.risk', operator: 'in', value: ['high', 'very-high'] }],
        combineWith: 'AND',
      },
    });

    this.createSegmentDefinition({
      segment: 'loyal',
      name: 'Loyal Customers',
      description: 'Frequent purchasers with high repeat rate',
      criteria: {
        rules: [
          { field: 'totalOrders', operator: 'greater-than', value: 10 },
          { field: 'behavior.loyalty.repeatPurchaseRate', operator: 'greater-than', value: 0.7 },
        ],
        combineWith: 'AND',
      },
    });
  }

  // ============================================================================
  // Query Methods
  // ============================================================================

  getCustomersBySegment(segment: CustomerSegment): CustomerProfile[] {
    return Array.from(this.customerProfiles.values()).filter((profile) =>
      profile.segments.includes(segment)
    );
  }

  getCustomersByLifecycleStage(stage: CustomerLifecycleStage): CustomerProfile[] {
    return Array.from(this.customerProfiles.values()).filter(
      (profile) => profile.lifecycleStage === stage
    );
  }

  getHighValueCustomers(minLTV: number): CustomerProfile[] {
    return Array.from(this.customerProfiles.values())
      .filter((profile) => profile.metrics.lifetimeValue >= minLTV)
      .sort((a, b) => b.metrics.lifetimeValue - a.metrics.lifetimeValue);
  }

  getChurnRiskCustomers(minRisk: ChurnRisk = 'medium'): CustomerProfile[] {
    const riskLevels: Record<ChurnRisk, number> = {
      'very-low': 1,
      low: 2,
      medium: 3,
      high: 4,
      'very-high': 5,
    };

    return Array.from(this.customerProfiles.values())
      .filter((profile) => riskLevels[profile.churnPrediction.risk] >= riskLevels[minRisk])
      .sort((a, b) => b.churnPrediction.probability - a.churnPrediction.probability);
  }

  getSegmentStatistics(): any {
    const profiles = Array.from(this.customerProfiles.values());
    const segments: CustomerSegment[] = [
      'vip',
      'high-value',
      'loyal',
      'at-risk',
      'dormant',
      'new',
      'occasional',
      'bargain-hunter',
    ];

    const stats: any = {
      total: profiles.length,
      bySegment: {},
      byLifecycleStage: {},
      avgMetrics: {
        lifetimeValue:
          profiles.reduce((sum, p) => sum + p.metrics.lifetimeValue, 0) / profiles.length,
        orderValue:
          profiles.reduce((sum, p) => sum + p.metrics.averageOrderValue, 0) / profiles.length,
      },
    };

    segments.forEach((segment) => {
      stats.bySegment[segment] = profiles.filter((p) => p.segments.includes(segment)).length;
    });

    return stats;
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const customerAnalyticsSegmentationSystem = new CustomerAnalyticsSegmentationSystem();
