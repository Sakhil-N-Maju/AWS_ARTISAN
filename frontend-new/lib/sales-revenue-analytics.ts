/**
 * Sales & Revenue Analytics System
 *
 * Comprehensive sales and revenue analytics:
 * - Sales performance tracking
 * - Revenue analysis and forecasting
 * - Product performance analytics
 * - Sales funnel analysis
 * - Discount and promotion analytics
 * - Sales team performance
 * - Channel analytics
 */

export interface SalesMetrics {
  period: {
    start: Date;
    end: Date;
  };

  // Overall sales
  overall: {
    totalSales: number;
    totalOrders: number;
    totalUnits: number;
    averageOrderValue: number;
    averageItemsPerOrder: number;
    conversionRate: number;
  };

  // Growth metrics
  growth: {
    salesGrowth: number; // percentage
    orderGrowth: number;
    aovGrowth: number;
    periodOverPeriod: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
  };

  // Daily breakdown
  daily: {
    date: Date;
    sales: number;
    orders: number;
    units: number;
  }[];

  // Hourly patterns
  hourlyPatterns: {
    hour: number; // 0-23
    averageSales: number;
    averageOrders: number;
    peakIndicator: boolean;
  }[];

  // Day of week patterns
  dayOfWeekPatterns: {
    dayOfWeek: number; // 0-6
    dayName: string;
    averageSales: number;
    averageOrders: number;
  }[];
}

export interface RevenueAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  // Revenue breakdown
  revenue: {
    gross: number;
    net: number;
    refunds: number;
    discounts: number;
    taxes: number;
    shipping: number;
  };

  // Revenue by source
  bySource: {
    source: string;
    revenue: number;
    percentage: number;
    growth: number;
  }[];

  // Revenue by category
  byCategory: {
    category: string;
    revenue: number;
    percentage: number;
    growth: number;
    margin: number;
  }[];

  // Revenue by channel
  byChannel: {
    channel: 'website' | 'mobile' | 'marketplace' | 'social' | 'pos' | 'other';
    revenue: number;
    percentage: number;
    orders: number;
    averageOrderValue: number;
  }[];

  // Revenue by geography
  byGeography: {
    country: string;
    state?: string;
    city?: string;
    revenue: number;
    percentage: number;
    customers: number;
  }[];

  // Revenue by customer segment
  byCustomerSegment: {
    segment: string;
    revenue: number;
    percentage: number;
    customers: number;
    averageRevenuePerCustomer: number;
  }[];

  // Recurring vs one-time
  recurring: {
    recurringRevenue: number;
    oneTimeRevenue: number;
    recurringPercentage: number;
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
  };
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  sku?: string;
  category: string;

  // Sales metrics
  sales: {
    revenue: number;
    units: number;
    orders: number;
    averagePrice: number;
    averageDiscount: number;
  };

  // Performance
  performance: {
    rank: number;
    revenueRank: number;
    unitsRank: number;
    growthRate: number;
    marketShare: number; // percentage of category
  };

  // Profitability
  profitability: {
    cost: number;
    grossProfit: number;
    margin: number; // percentage
    roi: number;
  };

  // Inventory
  inventory: {
    currentStock: number;
    turnoverRate: number;
    daysInStock: number;
    stockoutRate: number;
  };

  // Customer metrics
  customer: {
    uniqueBuyers: number;
    repeatPurchaseRate: number;
    averageRating: number;
    reviewCount: number;
    returnRate: number;
  };
}

export interface SalesFunnel {
  stage: string;
  order: number;

  // Metrics
  metrics: {
    visitors: number;
    conversions: number;
    conversionRate: number;
    dropoffRate: number;
    averageTimeInStage: number; // seconds
  };

  // Revenue
  revenue: {
    total: number;
    average: number;
  };

  // Comparison
  comparison?: {
    previousPeriod: {
      visitors: number;
      conversions: number;
      conversionRate: number;
    };
    change: {
      visitors: number;
      conversions: number;
      conversionRate: number;
    };
  };
}

export interface DiscountAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  // Overall impact
  overall: {
    totalDiscounts: number;
    discountedOrders: number;
    discountedOrdersPercentage: number;
    averageDiscountAmount: number;
    averageDiscountPercentage: number;
  };

  // By discount type
  byType: {
    type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping' | 'bundle' | 'other';
    discountAmount: number;
    orders: number;
    revenue: number;
    effectiveness: number; // ROI
  }[];

  // By promotion
  byPromotion: {
    promotionId: string;
    promotionName: string;
    code?: string;
    discountAmount: number;
    orders: number;
    revenue: number;
    newCustomers: number;
    redemptionRate: number;
    roi: number;
  }[];

  // Impact analysis
  impact: {
    incrementalRevenue: number;
    incrementalOrders: number;
    averageOrderValueImpact: number;
    profitMarginImpact: number;
  };
}

export interface SalesTeamPerformance {
  teamMemberId: string;
  teamMemberName: string;
  role: string;
  territory?: string;

  // Sales metrics
  sales: {
    revenue: number;
    orders: number;
    units: number;
    averageOrderValue: number;
  };

  // Performance
  performance: {
    quota: number;
    quotaAttainment: number; // percentage
    rank: number;
    winRate: number; // percentage
    averageDealSize: number;
    salesCycleLength: number; // days
  };

  // Activity
  activity: {
    calls: number;
    emails: number;
    meetings: number;
    proposals: number;
    demos: number;
  };

  // Customer metrics
  customer: {
    newCustomers: number;
    activeCustomers: number;
    customerSatisfaction: number;
    retentionRate: number;
  };

  // Targets
  targets: {
    monthly: number;
    quarterly: number;
    yearly: number;
    achieved: {
      monthly: boolean;
      quarterly: boolean;
      yearly: boolean;
    };
  };
}

export interface RevenueForecast {
  period: {
    start: Date;
    end: Date;
  };

  // Forecast data
  forecast: {
    date: Date;
    predicted: number;
    confidence: {
      low: number;
      high: number;
      level: number; // percentage (e.g., 95%)
    };
  }[];

  // Actual vs forecast
  comparison: {
    date: Date;
    actual: number;
    forecast: number;
    variance: number;
    variancePercentage: number;
  }[];

  // Model info
  model: {
    type: 'linear' | 'exponential' | 'arima' | 'prophet' | 'ensemble';
    accuracy: number; // percentage
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
    lastTrainedAt: Date;
  };

  // Factors
  factors: {
    seasonality: {
      detected: boolean;
      pattern: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
      impact: number;
    };
    trend: {
      direction: 'up' | 'down' | 'stable';
      strength: number;
    };
    externalFactors?: {
      name: string;
      impact: number;
      confidence: number;
    }[];
  };
}

export interface ChannelAnalytics {
  channel: string;

  // Performance
  performance: {
    revenue: number;
    orders: number;
    units: number;
    visitors: number;
    conversionRate: number;
    averageOrderValue: number;
  };

  // Growth
  growth: {
    revenueGrowth: number;
    orderGrowth: number;
    visitorGrowth: number;
  };

  // Customer acquisition
  acquisition: {
    newCustomers: number;
    acquisitionCost: number;
    customerLifetimeValue: number;
    ltvcacRatio: number;
  };

  // Profitability
  profitability: {
    grossProfit: number;
    margin: number;
    roi: number;
  };

  // Behavior
  behavior: {
    averageSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
    returnVisitorRate: number;
  };
}

export class SalesRevenueAnalytics {
  private salesData: Map<string, any>;
  private revenueData: Map<string, any>;
  private productPerformance: Map<string, ProductPerformance>;
  private forecasts: Map<string, RevenueForecast>;

  constructor() {
    this.salesData = new Map();
    this.revenueData = new Map();
    this.productPerformance = new Map();
    this.forecasts = new Map();

    // Initialize with mock data
    this.initializeMockData();
  }

  /**
   * Initialize mock data
   */
  private initializeMockData(): void {
    // Mock product performance data
    const products: Omit<ProductPerformance, 'productId'>[] = [
      {
        productName: 'Handwoven Silk Saree',
        sku: 'HSS-001',
        category: 'Textiles',
        sales: {
          revenue: 125000,
          units: 250,
          orders: 215,
          averagePrice: 500,
          averageDiscount: 50,
        },
        performance: {
          rank: 1,
          revenueRank: 1,
          unitsRank: 3,
          growthRate: 15.5,
          marketShare: 27.8,
        },
        profitability: {
          cost: 300,
          grossProfit: 50000,
          margin: 40,
          roi: 166.7,
        },
        inventory: {
          currentStock: 125,
          turnoverRate: 8.5,
          daysInStock: 43,
          stockoutRate: 2.3,
        },
        customer: {
          uniqueBuyers: 198,
          repeatPurchaseRate: 8.1,
          averageRating: 4.7,
          reviewCount: 156,
          returnRate: 3.2,
        },
      },
      {
        productName: 'Terracotta Vase Set',
        sku: 'TVS-002',
        category: 'Pottery',
        sales: {
          revenue: 98000,
          units: 490,
          orders: 412,
          averagePrice: 200,
          averageDiscount: 20,
        },
        performance: {
          rank: 2,
          revenueRank: 2,
          unitsRank: 1,
          growthRate: 22.3,
          marketShare: 30.2,
        },
        profitability: {
          cost: 120,
          grossProfit: 39200,
          margin: 40,
          roi: 133.3,
        },
        inventory: {
          currentStock: 280,
          turnoverRate: 12.5,
          daysInStock: 29,
          stockoutRate: 5.1,
        },
        customer: {
          uniqueBuyers: 385,
          repeatPurchaseRate: 7.0,
          averageRating: 4.5,
          reviewCount: 203,
          returnRate: 4.8,
        },
      },
      {
        productName: 'Silver Jewelry Collection',
        sku: 'SJC-003',
        category: 'Jewelry',
        sales: {
          revenue: 87500,
          units: 175,
          orders: 165,
          averagePrice: 500,
          averageDiscount: 0,
        },
        performance: {
          rank: 3,
          revenueRank: 3,
          unitsRank: 5,
          growthRate: 8.2,
          marketShare: 31.3,
        },
        profitability: {
          cost: 300,
          grossProfit: 35000,
          margin: 40,
          roi: 116.7,
        },
        inventory: {
          currentStock: 95,
          turnoverRate: 7.2,
          daysInStock: 51,
          stockoutRate: 1.5,
        },
        customer: {
          uniqueBuyers: 152,
          repeatPurchaseRate: 8.6,
          averageRating: 4.8,
          reviewCount: 128,
          returnRate: 2.1,
        },
      },
    ];

    products.forEach((product, index) => {
      const id = `prod-${index + 1}`;
      this.productPerformance.set(id, { ...product, productId: id });
    });
  }

  /**
   * Get sales metrics
   */
  async getSalesMetrics(period: { start: Date; end: Date }): Promise<SalesMetrics> {
    // Mock daily data for the period
    const days = Math.ceil((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24));
    const daily = Array.from({ length: days }, (_, i) => {
      const date = new Date(period.start);
      date.setDate(date.getDate() + i);
      return {
        date,
        sales: 35000 + Math.random() * 15000,
        orders: 70 + Math.floor(Math.random() * 30),
        units: 150 + Math.floor(Math.random() * 100),
      };
    });

    const totalSales = daily.reduce((sum, d) => sum + d.sales, 0);
    const totalOrders = daily.reduce((sum, d) => sum + d.orders, 0);
    const totalUnits = daily.reduce((sum, d) => sum + d.units, 0);

    return {
      period,
      overall: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalUnits,
        averageOrderValue: Number((totalSales / totalOrders).toFixed(2)),
        averageItemsPerOrder: Number((totalUnits / totalOrders).toFixed(2)),
        conversionRate: 2.85,
      },
      growth: {
        salesGrowth: 12.5,
        orderGrowth: 8.3,
        aovGrowth: 3.8,
        periodOverPeriod: {
          current: totalSales,
          previous: totalSales * 0.875,
          change: totalSales * 0.125,
          changePercentage: 12.5,
        },
      },
      daily,
      hourlyPatterns: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        averageSales:
          hour >= 9 && hour <= 21 ? 1500 + Math.random() * 500 : 500 + Math.random() * 200,
        averageOrders: hour >= 9 && hour <= 21 ? 3 + Math.floor(Math.random() * 2) : 1,
        peakIndicator: hour >= 19 && hour <= 21,
      })),
      dayOfWeekPatterns: [
        { dayOfWeek: 0, dayName: 'Sunday', averageSales: 32000, averageOrders: 65 },
        { dayOfWeek: 1, dayName: 'Monday', averageSales: 38000, averageOrders: 75 },
        { dayOfWeek: 2, dayName: 'Tuesday', averageSales: 41000, averageOrders: 82 },
        { dayOfWeek: 3, dayName: 'Wednesday', averageSales: 43000, averageOrders: 85 },
        { dayOfWeek: 4, dayName: 'Thursday', averageSales: 45000, averageOrders: 88 },
        { dayOfWeek: 5, dayName: 'Friday', averageSales: 48000, averageOrders: 95 },
        { dayOfWeek: 6, dayName: 'Saturday', averageSales: 52000, averageOrders: 102 },
      ],
    };
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(period: { start: Date; end: Date }): Promise<RevenueAnalytics> {
    const grossRevenue = 1250000;

    return {
      period,
      revenue: {
        gross: grossRevenue,
        net: 1187500,
        refunds: 37500,
        discounts: 62500,
        taxes: 150000,
        shipping: 75000,
      },
      bySource: [
        { source: 'Organic Search', revenue: 437500, percentage: 35, growth: 18.5 },
        { source: 'Paid Ads', revenue: 312500, percentage: 25, growth: 8.2 },
        { source: 'Social Media', revenue: 250000, percentage: 20, growth: 25.3 },
        { source: 'Direct', revenue: 187500, percentage: 15, growth: 5.1 },
        { source: 'Referral', revenue: 62500, percentage: 5, growth: 32.8 },
      ],
      byCategory: [
        { category: 'Textiles', revenue: 450000, percentage: 36, growth: 15.2, margin: 42 },
        { category: 'Pottery', revenue: 325000, percentage: 26, growth: 22.3, margin: 40 },
        { category: 'Jewelry', revenue: 280000, percentage: 22.4, growth: 8.5, margin: 45 },
        { category: 'Woodwork', revenue: 195000, percentage: 15.6, growth: 5.8, margin: 38 },
      ],
      byChannel: [
        {
          channel: 'website',
          revenue: 875000,
          percentage: 70,
          orders: 1715,
          averageOrderValue: 510.2,
        },
        {
          channel: 'mobile',
          revenue: 250000,
          percentage: 20,
          orders: 490,
          averageOrderValue: 510.2,
        },
        {
          channel: 'marketplace',
          revenue: 125000,
          percentage: 10,
          orders: 245,
          averageOrderValue: 510.2,
        },
        { channel: 'social', revenue: 0, percentage: 0, orders: 0, averageOrderValue: 0 },
        { channel: 'pos', revenue: 0, percentage: 0, orders: 0, averageOrderValue: 0 },
        { channel: 'other', revenue: 0, percentage: 0, orders: 0, averageOrderValue: 0 },
      ],
      byGeography: [
        {
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          revenue: 375000,
          percentage: 30,
          customers: 4569,
        },
        {
          country: 'India',
          state: 'Karnataka',
          city: 'Bangalore',
          revenue: 312500,
          percentage: 25,
          customers: 3808,
        },
        { country: 'India', state: 'Delhi', revenue: 250000, percentage: 20, customers: 3046 },
        { country: 'USA', revenue: 187500, percentage: 15, customers: 1523 },
        { country: 'UK', revenue: 125000, percentage: 10, customers: 1015 },
      ],
      byCustomerSegment: [
        {
          segment: 'VIP',
          revenue: 437500,
          percentage: 35,
          customers: 1523,
          averageRevenuePerCustomer: 287.24,
        },
        {
          segment: 'Regular',
          revenue: 562500,
          percentage: 45,
          customers: 7615,
          averageRevenuePerCustomer: 73.88,
        },
        {
          segment: 'New',
          revenue: 250000,
          percentage: 20,
          customers: 6092,
          averageRevenuePerCustomer: 41.04,
        },
      ],
      recurring: {
        recurringRevenue: 187500,
        oneTimeRevenue: 1062500,
        recurringPercentage: 15,
        mrr: 125000,
        arr: 1500000,
      },
    };
  }

  /**
   * Get product performance
   */
  async getProductPerformance(limit?: number): Promise<ProductPerformance[]> {
    let products = Array.from(this.productPerformance.values());

    // Sort by revenue rank
    products.sort((a, b) => a.performance.revenueRank - b.performance.revenueRank);

    if (limit) {
      products = products.slice(0, limit);
    }

    return products;
  }

  /**
   * Get sales funnel
   */
  async getSalesFunnel(period: { start: Date; end: Date }): Promise<SalesFunnel[]> {
    return [
      {
        stage: 'Visitors',
        order: 1,
        metrics: {
          visitors: 125000,
          conversions: 85000,
          conversionRate: 68.0,
          dropoffRate: 32.0,
          averageTimeInStage: 0,
        },
        revenue: { total: 0, average: 0 },
        comparison: {
          previousPeriod: { visitors: 115000, conversions: 78000, conversionRate: 67.8 },
          change: { visitors: 10000, conversions: 7000, conversionRate: 0.2 },
        },
      },
      {
        stage: 'Product Views',
        order: 2,
        metrics: {
          visitors: 85000,
          conversions: 12750,
          conversionRate: 15.0,
          dropoffRate: 85.0,
          averageTimeInStage: 45,
        },
        revenue: { total: 0, average: 0 },
        comparison: {
          previousPeriod: { visitors: 78000, conversions: 11700, conversionRate: 15.0 },
          change: { visitors: 7000, conversions: 1050, conversionRate: 0 },
        },
      },
      {
        stage: 'Add to Cart',
        order: 3,
        metrics: {
          visitors: 12750,
          conversions: 4913,
          conversionRate: 38.5,
          dropoffRate: 61.5,
          averageTimeInStage: 120,
        },
        revenue: { total: 0, average: 0 },
        comparison: {
          previousPeriod: { visitors: 11700, conversions: 4446, conversionRate: 38.0 },
          change: { visitors: 1050, conversions: 467, conversionRate: 0.5 },
        },
      },
      {
        stage: 'Checkout',
        order: 4,
        metrics: {
          visitors: 4913,
          conversions: 2450,
          conversionRate: 49.9,
          dropoffRate: 50.1,
          averageTimeInStage: 180,
        },
        revenue: { total: 1250000, average: 510.2 },
        comparison: {
          previousPeriod: { visitors: 4446, conversions: 2223, conversionRate: 50.0 },
          change: { visitors: 467, conversions: 227, conversionRate: -0.1 },
        },
      },
    ];
  }

  /**
   * Get discount analytics
   */
  async getDiscountAnalytics(period: { start: Date; end: Date }): Promise<DiscountAnalytics> {
    return {
      period,
      overall: {
        totalDiscounts: 62500,
        discountedOrders: 980,
        discountedOrdersPercentage: 40.0,
        averageDiscountAmount: 63.78,
        averageDiscountPercentage: 12.5,
      },
      byType: [
        {
          type: 'percentage',
          discountAmount: 31250,
          orders: 490,
          revenue: 250000,
          effectiveness: 3.2,
        },
        { type: 'fixed', discountAmount: 18750, orders: 294, revenue: 150000, effectiveness: 2.8 },
        {
          type: 'free_shipping',
          discountAmount: 9375,
          orders: 147,
          revenue: 75000,
          effectiveness: 2.5,
        },
        { type: 'bogo', discountAmount: 2500, orders: 39, revenue: 20000, effectiveness: 3.5 },
        { type: 'bundle', discountAmount: 625, orders: 10, revenue: 5000, effectiveness: 4.0 },
        { type: 'other', discountAmount: 0, orders: 0, revenue: 0, effectiveness: 0 },
      ],
      byPromotion: [
        {
          promotionId: 'promo-1',
          promotionName: 'Diwali Festival Sale',
          code: 'DIWALI25',
          discountAmount: 25000,
          orders: 392,
          revenue: 200000,
          newCustomers: 118,
          redemptionRate: 78.4,
          roi: 3.2,
        },
        {
          promotionId: 'promo-2',
          promotionName: 'First Purchase Discount',
          code: 'FIRST10',
          discountAmount: 15000,
          orders: 245,
          revenue: 150000,
          newCustomers: 245,
          redemptionRate: 100.0,
          roi: 4.0,
        },
      ],
      impact: {
        incrementalRevenue: 187500,
        incrementalOrders: 490,
        averageOrderValueImpact: 63.78,
        profitMarginImpact: -5.0,
      },
    };
  }

  /**
   * Get sales team performance
   */
  async getSalesTeamPerformance(): Promise<SalesTeamPerformance[]> {
    return [
      {
        teamMemberId: 'sales-1',
        teamMemberName: 'Rajesh Kumar',
        role: 'Senior Sales Manager',
        territory: 'North India',
        sales: {
          revenue: 450000,
          orders: 882,
          units: 1890,
          averageOrderValue: 510.2,
        },
        performance: {
          quota: 400000,
          quotaAttainment: 112.5,
          rank: 1,
          winRate: 68.5,
          averageDealSize: 510.2,
          salesCycleLength: 7,
        },
        activity: {
          calls: 250,
          emails: 420,
          meetings: 85,
          proposals: 120,
          demos: 65,
        },
        customer: {
          newCustomers: 215,
          activeCustomers: 650,
          customerSatisfaction: 4.6,
          retentionRate: 72.5,
        },
        targets: {
          monthly: 150000,
          quarterly: 450000,
          yearly: 1800000,
          achieved: { monthly: true, quarterly: true, yearly: false },
        },
      },
      {
        teamMemberId: 'sales-2',
        teamMemberName: 'Priya Sharma',
        role: 'Sales Manager',
        territory: 'South India',
        sales: {
          revenue: 375000,
          orders: 735,
          units: 1575,
          averageOrderValue: 510.2,
        },
        performance: {
          quota: 350000,
          quotaAttainment: 107.1,
          rank: 2,
          winRate: 65.2,
          averageDealSize: 510.2,
          salesCycleLength: 8,
        },
        activity: {
          calls: 220,
          emails: 380,
          meetings: 75,
          proposals: 105,
          demos: 58,
        },
        customer: {
          newCustomers: 185,
          activeCustomers: 520,
          customerSatisfaction: 4.5,
          retentionRate: 68.3,
        },
        targets: {
          monthly: 125000,
          quarterly: 375000,
          yearly: 1500000,
          achieved: { monthly: true, quarterly: true, yearly: false },
        },
      },
    ];
  }

  /**
   * Get revenue forecast
   */
  async getRevenueForecast(months: number): Promise<RevenueForecast> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    // Generate forecast data
    const forecast = Array.from({ length: months * 30 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const baseValue = 42000;
      const trend = i * 150;
      const seasonality = Math.sin((i / 30) * Math.PI) * 5000;
      const predicted = baseValue + trend + seasonality;

      return {
        date,
        predicted: Number(predicted.toFixed(2)),
        confidence: {
          low: Number((predicted * 0.85).toFixed(2)),
          high: Number((predicted * 1.15).toFixed(2)),
          level: 95,
        },
      };
    });

    return {
      period: { start: startDate, end: endDate },
      forecast,
      comparison: [],
      model: {
        type: 'prophet',
        accuracy: 92.5,
        mape: 7.5,
        rmse: 3200,
        lastTrainedAt: new Date(),
      },
      factors: {
        seasonality: {
          detected: true,
          pattern: 'monthly',
          impact: 0.15,
        },
        trend: {
          direction: 'up',
          strength: 0.75,
        },
        externalFactors: [
          { name: 'Festival Season', impact: 0.25, confidence: 0.85 },
          { name: 'Marketing Campaigns', impact: 0.18, confidence: 0.78 },
        ],
      },
    };
  }

  /**
   * Get channel analytics
   */
  async getChannelAnalytics(): Promise<ChannelAnalytics[]> {
    return [
      {
        channel: 'Website',
        performance: {
          revenue: 875000,
          orders: 1715,
          units: 3675,
          visitors: 85000,
          conversionRate: 2.02,
          averageOrderValue: 510.2,
        },
        growth: {
          revenueGrowth: 12.5,
          orderGrowth: 8.3,
          visitorGrowth: 15.2,
        },
        acquisition: {
          newCustomers: 1715,
          acquisitionCost: 125,
          customerLifetimeValue: 2850,
          ltvcacRatio: 22.8,
        },
        profitability: {
          grossProfit: 367500,
          margin: 42.0,
          roi: 7.0,
        },
        behavior: {
          averageSessionDuration: 245,
          pagesPerSession: 5.2,
          bounceRate: 38.5,
          returnVisitorRate: 42.3,
        },
      },
      {
        channel: 'Mobile App',
        performance: {
          revenue: 250000,
          orders: 490,
          units: 1050,
          visitors: 28000,
          conversionRate: 1.75,
          averageOrderValue: 510.2,
        },
        growth: {
          revenueGrowth: 25.8,
          orderGrowth: 22.3,
          visitorGrowth: 32.5,
        },
        acquisition: {
          newCustomers: 490,
          acquisitionCost: 95,
          customerLifetimeValue: 3200,
          ltvcacRatio: 33.7,
        },
        profitability: {
          grossProfit: 105000,
          margin: 42.0,
          roi: 11.2,
        },
        behavior: {
          averageSessionDuration: 180,
          pagesPerSession: 3.8,
          bounceRate: 32.5,
          returnVisitorRate: 58.2,
        },
      },
    ];
  }
}

// Export singleton instance
export const salesRevenueAnalytics = new SalesRevenueAnalytics();
