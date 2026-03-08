/**
 * Subscription Service
 *
 * Manages recurring subscription plans:
 * - Product subscriptions (curated boxes)
 * - Membership tiers
 * - Recurring workshops
 * - Artisan support programs
 * - Premium features access
 * - Flexible billing cycles
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;

  // Type
  type: 'product_box' | 'membership' | 'workshop_series' | 'artisan_support' | 'premium_access';

  // Pricing
  pricing: {
    basePrice: number;
    currency: string;
    billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    discountPercentage?: number; // vs. one-time purchase
    setupFee?: number;
  };

  // Benefits
  benefits: {
    type:
      | 'product_delivery'
      | 'workshop_access'
      | 'exclusive_content'
      | 'discount'
      | 'early_access'
      | 'free_shipping'
      | 'priority_support';
    description: string;
    value?: string;
  }[];

  // Customization options
  customization?: {
    canSelectCategories: boolean;
    canSelectArtisans: boolean;
    canChooseDeliveryDate: boolean;
    preferencesRequired: string[];
  };

  // Limits
  limits?: {
    itemsPerDelivery?: number;
    workshopsPerMonth?: number;
    discountPercentage?: number;
    maxValue?: number;
  };

  // Trial
  trial?: {
    available: boolean;
    durationDays: number;
    price: number;
  };

  // Status
  isActive: boolean;
  isPopular: boolean;

  // Stats
  stats: {
    totalSubscribers: number;
    averageRating: number;
    retentionRate: number; // percentage
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;

  // Status
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending' | 'past_due';

  // Dates
  startDate: Date;
  nextBillingDate?: Date;
  pausedUntil?: Date;
  cancelledAt?: Date;
  endDate?: Date;

  // Payment
  payment: {
    method: string; // payment method ID
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    nextPaymentAmount: number;
    failedPaymentAttempts: number;
  };

  // Customization
  preferences?: {
    categories?: string[];
    artisans?: string[];
    deliveryDay?: string;
    customNotes?: string;
  };

  // Delivery tracking
  deliveries: string[]; // Delivery IDs
  upcomingDelivery?: {
    scheduledDate: Date;
    status: 'preparing' | 'packed' | 'shipped' | 'delivered';
  };

  // Billing history
  billingHistory: {
    date: Date;
    amount: number;
    status: 'paid' | 'failed' | 'refunded';
    invoiceId: string;
  }[];

  // Notifications
  notifications: {
    upcomingBilling: boolean;
    deliveryUpdates: boolean;
    newProducts: boolean;
    pauseReminders: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionDelivery {
  id: string;
  subscriptionId: string;
  userId: string;

  // Delivery info
  deliveryNumber: number;
  scheduledDate: Date;
  actualDeliveryDate?: Date;

  // Contents
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    artisanId: string;
    imageUrl: string;
  }[];

  // Value
  totalValue: number;
  discountApplied: number;

  // Status
  status: 'scheduled' | 'curating' | 'packed' | 'shipped' | 'delivered' | 'failed';

  // Shipping
  shipping?: {
    trackingNumber: string;
    carrier: string;
    shippedDate: Date;
    estimatedDeliveryDate: Date;
  };

  // Feedback
  feedback?: {
    rating: number;
    items: {
      productId: string;
      liked: boolean;
      comment?: string;
    }[];
    generalFeedback?: string;
    submittedAt: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipTier {
  id: string;
  name: string;
  level: number; // 1=basic, 2=premium, 3=elite

  // Requirements
  requirements: {
    minMonthlySpend?: number;
    minPurchases?: number;
    subscriptionRequired?: boolean;
  };

  // Perks
  perks: {
    discountPercentage: number;
    freeShipping: boolean;
    prioritySupport: boolean;
    earlyAccess: boolean;
    exclusiveProducts: boolean;
    workshopDiscount: number;
    bonusPoints: number; // % bonus on purchases
  };

  // Branding
  badge: {
    icon: string;
    color: string;
  };
}

export interface SubscriptionBox {
  id: string;
  name: string;
  theme: string;

  // Curation
  curation: {
    category: string;
    region?: string;
    priceRange: {
      min: number;
      max: number;
    };
    itemCount: number;
    curatedBy: string; // curator ID
  };

  // Contents (for preview)
  previewItems: {
    productId: string;
    imageUrl: string;
    description: string;
  }[];

  // Availability
  availableForPlans: string[]; // plan IDs
  limitedEdition: boolean;
  spotsRemaining?: number;
}

export interface SubscriptionAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    newSubscriptions: number;
    cancelledSubscriptions: number;
    pausedSubscriptions: number;
  };

  revenue: {
    totalRevenue: number;
    recurringRevenue: number; // MRR
    averageSubscriptionValue: number;
    churnRate: number; // percentage
  };

  plans: {
    planId: string;
    planName: string;
    subscribers: number;
    revenue: number;
    churnRate: number;
  }[];

  retention: {
    month1: number;
    month3: number;
    month6: number;
    month12: number;
  };

  deliveries: {
    totalDeliveries: number;
    onTimeDeliveries: number;
    averageRating: number;
    failureRate: number;
  };
}

export class SubscriptionService {
  private plans: Map<string, SubscriptionPlan>;
  private subscriptions: Map<string, Subscription>;
  private deliveries: Map<string, SubscriptionDelivery>;
  private membershipTiers: Map<string, MembershipTier>;
  private subscriptionBoxes: Map<string, SubscriptionBox>;

  constructor() {
    this.plans = new Map();
    this.subscriptions = new Map();
    this.deliveries = new Map();
    this.membershipTiers = new Map();
    this.subscriptionBoxes = new Map();
    this.initializeDefaultPlans();
    this.initializeMembershipTiers();
  }

  /**
   * Initialize default subscription plans
   */
  private initializeDefaultPlans() {
    const plans: SubscriptionPlan[] = [
      {
        id: 'artisan-box-monthly',
        name: 'Artisan Discovery Box',
        description: 'Monthly curated box of handcrafted treasures from different artisans',
        type: 'product_box',
        pricing: {
          basePrice: 2999,
          currency: 'INR',
          billingCycle: 'monthly',
          discountPercentage: 15,
        },
        benefits: [
          {
            type: 'product_delivery',
            description: '3-5 handpicked artisan products',
            value: '₹4000+ worth',
          },
          { type: 'exclusive_content', description: 'Artisan stories and craft insights' },
          { type: 'free_shipping', description: 'Free shipping on all deliveries' },
        ],
        customization: {
          canSelectCategories: true,
          canSelectArtisans: false,
          canChooseDeliveryDate: true,
          preferencesRequired: ['categories', 'priceRange'],
        },
        limits: {
          itemsPerDelivery: 5,
        },
        trial: {
          available: true,
          durationDays: 14,
          price: 999,
        },
        isActive: true,
        isPopular: true,
        stats: {
          totalSubscribers: 0,
          averageRating: 0,
          retentionRate: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'premium-membership',
        name: 'Premium Membership',
        description: 'Exclusive access to premium features and benefits',
        type: 'premium_access',
        pricing: {
          basePrice: 499,
          currency: 'INR',
          billingCycle: 'monthly',
        },
        benefits: [
          { type: 'discount', description: '10% discount on all purchases' },
          { type: 'early_access', description: 'Early access to new collections' },
          { type: 'free_shipping', description: 'Free shipping on orders above ₹500' },
          { type: 'priority_support', description: 'Priority customer support' },
          { type: 'workshop_access', description: 'Exclusive workshop discounts' },
        ],
        isActive: true,
        isPopular: false,
        stats: {
          totalSubscribers: 0,
          averageRating: 0,
          retentionRate: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'workshop-unlimited',
        name: 'Workshop Unlimited',
        description: 'Unlimited access to online workshops and masterclasses',
        type: 'workshop_series',
        pricing: {
          basePrice: 1999,
          currency: 'INR',
          billingCycle: 'monthly',
        },
        benefits: [
          { type: 'workshop_access', description: 'Unlimited live workshop access' },
          { type: 'exclusive_content', description: 'Access to recorded sessions library' },
          { type: 'discount', description: '20% off on workshop materials' },
        ],
        limits: {
          workshopsPerMonth: 999, // unlimited
        },
        isActive: true,
        isPopular: false,
        stats: {
          totalSubscribers: 0,
          averageRating: 0,
          retentionRate: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'artisan-supporter',
        name: 'Artisan Supporter',
        description: 'Support artisan communities with monthly contributions',
        type: 'artisan_support',
        pricing: {
          basePrice: 500,
          currency: 'INR',
          billingCycle: 'monthly',
        },
        benefits: [
          { type: 'exclusive_content', description: 'Behind-the-scenes artisan updates' },
          { type: 'discount', description: '5% discount on supported artisan products' },
          { type: 'exclusive_content', description: 'Monthly impact reports' },
        ],
        isActive: true,
        isPopular: false,
        stats: {
          totalSubscribers: 0,
          averageRating: 0,
          retentionRate: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    plans.forEach((plan) => this.plans.set(plan.id, plan));
  }

  /**
   * Initialize membership tiers
   */
  private initializeMembershipTiers() {
    const tiers: MembershipTier[] = [
      {
        id: 'basic',
        name: 'Explorer',
        level: 1,
        requirements: {},
        perks: {
          discountPercentage: 0,
          freeShipping: false,
          prioritySupport: false,
          earlyAccess: false,
          exclusiveProducts: false,
          workshopDiscount: 0,
          bonusPoints: 1,
        },
        badge: {
          icon: '🌱',
          color: '#22c55e',
        },
      },
      {
        id: 'premium',
        name: 'Curator',
        level: 2,
        requirements: {
          minMonthlySpend: 5000,
          subscriptionRequired: false,
        },
        perks: {
          discountPercentage: 5,
          freeShipping: true,
          prioritySupport: true,
          earlyAccess: true,
          exclusiveProducts: false,
          workshopDiscount: 10,
          bonusPoints: 1.5,
        },
        badge: {
          icon: '⭐',
          color: '#f59e0b',
        },
      },
      {
        id: 'elite',
        name: 'Patron',
        level: 3,
        requirements: {
          minMonthlySpend: 15000,
          subscriptionRequired: true,
        },
        perks: {
          discountPercentage: 10,
          freeShipping: true,
          prioritySupport: true,
          earlyAccess: true,
          exclusiveProducts: true,
          workshopDiscount: 25,
          bonusPoints: 2,
        },
        badge: {
          icon: '👑',
          color: '#8b5cf6',
        },
      },
    ];

    tiers.forEach((tier) => this.membershipTiers.set(tier.id, tier));
  }

  /**
   * Get all subscription plans
   */
  async getPlans(type?: SubscriptionPlan['type']): Promise<SubscriptionPlan[]> {
    let plans = Array.from(this.plans.values()).filter((p) => p.isActive);

    if (type) {
      plans = plans.filter((p) => p.type === type);
    }

    return plans;
  }

  /**
   * Get plan by ID
   */
  async getPlan(planId: string): Promise<SubscriptionPlan | null> {
    return this.plans.get(planId) || null;
  }

  /**
   * Subscribe to a plan
   */
  async subscribe(params: {
    userId: string;
    planId: string;
    paymentMethod: string;
    preferences?: Subscription['preferences'];
  }): Promise<Subscription> {
    const plan = await this.getPlan(params.planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const now = new Date();
    const nextBillingDate = this.calculateNextBillingDate(now, plan.pricing.billingCycle);

    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      userId: params.userId,
      planId: params.planId,
      status: 'active',
      startDate: now,
      nextBillingDate,
      payment: {
        method: params.paymentMethod,
        nextPaymentAmount: plan.pricing.basePrice,
        failedPaymentAttempts: 0,
      },
      preferences: params.preferences,
      deliveries: [],
      billingHistory: [],
      notifications: {
        upcomingBilling: true,
        deliveryUpdates: true,
        newProducts: true,
        pauseReminders: true,
      },
      createdAt: now,
      updatedAt: now,
    };

    this.subscriptions.set(subscription.id, subscription);

    // Update plan stats
    plan.stats.totalSubscribers++;

    // Schedule first delivery for product boxes
    if (plan.type === 'product_box') {
      await this.scheduleDelivery(subscription.id);
    }

    return subscription;
  }

  /**
   * Calculate next billing date
   */
  private calculateNextBillingDate(
    from: Date,
    cycle: SubscriptionPlan['pricing']['billingCycle']
  ): Date {
    const next = new Date(from);

    switch (cycle) {
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'annually':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    return next;
  }

  /**
   * Schedule delivery
   */
  private async scheduleDelivery(subscriptionId: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    const plan = await this.getPlan(subscription.planId);
    if (!plan || plan.type !== 'product_box') return;

    const deliveryNumber = subscription.deliveries.length + 1;
    const scheduledDate = subscription.nextBillingDate || new Date();

    const delivery: SubscriptionDelivery = {
      id: `del-${Date.now()}`,
      subscriptionId,
      userId: subscription.userId,
      deliveryNumber,
      scheduledDate,
      items: [], // Will be curated later
      totalValue: 0,
      discountApplied: 0,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.deliveries.set(delivery.id, delivery);
    subscription.deliveries.push(delivery.id);
    subscription.upcomingDelivery = {
      scheduledDate,
      status: 'preparing',
    };
  }

  /**
   * Pause subscription
   */
  async pauseSubscription(subscriptionId: string, pauseUntil: Date): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    subscription.status = 'paused';
    subscription.pausedUntil = pauseUntil;
    subscription.updatedAt = new Date();
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    subscription.status = 'active';
    subscription.pausedUntil = undefined;
    subscription.updatedAt = new Date();
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.endDate = subscription.nextBillingDate;
    subscription.updatedAt = new Date();

    // Update plan stats
    const plan = await this.getPlan(subscription.planId);
    if (plan) {
      plan.stats.totalSubscribers--;
    }
  }

  /**
   * Process billing
   */
  async processBilling(subscriptionId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    const plan = await this.getPlan(subscription.planId);
    if (!plan) return false;

    try {
      // Simulate payment processing
      const paymentSuccess = Math.random() > 0.1; // 90% success rate

      if (paymentSuccess) {
        subscription.payment.lastPaymentDate = new Date();
        subscription.payment.lastPaymentAmount = plan.pricing.basePrice;
        subscription.payment.failedPaymentAttempts = 0;
        subscription.nextBillingDate = this.calculateNextBillingDate(
          new Date(),
          plan.pricing.billingCycle
        );

        subscription.billingHistory.push({
          date: new Date(),
          amount: plan.pricing.basePrice,
          status: 'paid',
          invoiceId: `inv-${Date.now()}`,
        });

        // Schedule next delivery for product boxes
        if (plan.type === 'product_box') {
          await this.scheduleDelivery(subscriptionId);
        }

        return true;
      } else {
        subscription.payment.failedPaymentAttempts++;

        subscription.billingHistory.push({
          date: new Date(),
          amount: plan.pricing.basePrice,
          status: 'failed',
          invoiceId: `inv-${Date.now()}`,
        });

        if (subscription.payment.failedPaymentAttempts >= 3) {
          subscription.status = 'past_due';
        }

        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user subscriptions
   */
  async getUserSubscriptions(
    userId: string,
    status?: Subscription['status']
  ): Promise<Subscription[]> {
    let subs = Array.from(this.subscriptions.values()).filter((s) => s.userId === userId);

    if (status) {
      subs = subs.filter((s) => s.status === status);
    }

    return subs;
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    return this.subscriptions.get(subscriptionId) || null;
  }

  /**
   * Update subscription preferences
   */
  async updatePreferences(
    subscriptionId: string,
    preferences: Subscription['preferences']
  ): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    subscription.preferences = { ...subscription.preferences, ...preferences };
    subscription.updatedAt = new Date();
  }

  /**
   * Get delivery details
   */
  async getDelivery(deliveryId: string): Promise<SubscriptionDelivery | null> {
    return this.deliveries.get(deliveryId) || null;
  }

  /**
   * Submit delivery feedback
   */
  async submitDeliveryFeedback(
    deliveryId: string,
    feedback: SubscriptionDelivery['feedback']
  ): Promise<void> {
    const delivery = this.deliveries.get(deliveryId);
    if (!delivery) return;

    delivery.feedback = feedback;
    delivery.updatedAt = new Date();
  }

  /**
   * Get membership tiers
   */
  async getMembershipTiers(): Promise<MembershipTier[]> {
    return Array.from(this.membershipTiers.values()).sort((a, b) => a.level - b.level);
  }

  /**
   * Get user membership tier
   */
  async getUserTier(
    userId: string,
    monthlySpend: number,
    hasSubscription: boolean
  ): Promise<MembershipTier> {
    const tiers = await this.getMembershipTiers();

    // Find highest tier user qualifies for
    for (let i = tiers.length - 1; i >= 0; i--) {
      const tier = tiers[i];
      const meetsSpend =
        !tier.requirements.minMonthlySpend || monthlySpend >= tier.requirements.minMonthlySpend;
      const meetsSubscription = !tier.requirements.subscriptionRequired || hasSubscription;

      if (meetsSpend && meetsSubscription) {
        return tier;
      }
    }

    return tiers[0]; // Return basic tier
  }

  /**
   * Get subscription analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<SubscriptionAnalytics> {
    const allSubscriptions = Array.from(this.subscriptions.values());
    const periodSubscriptions = allSubscriptions.filter(
      (s) => s.createdAt >= period.start && s.createdAt <= period.end
    );

    const activeSubscriptions = allSubscriptions.filter((s) => s.status === 'active');
    const cancelledInPeriod = allSubscriptions.filter(
      (s) => s.cancelledAt && s.cancelledAt >= period.start && s.cancelledAt <= period.end
    );
    const pausedSubscriptions = allSubscriptions.filter((s) => s.status === 'paused');

    // Revenue calculations
    const totalRevenue = periodSubscriptions.reduce((sum, sub) => {
      return (
        sum +
        sub.billingHistory
          .filter((b) => b.status === 'paid' && b.date >= period.start && b.date <= period.end)
          .reduce((s, b) => s + b.amount, 0)
      );
    }, 0);

    const recurringRevenue = activeSubscriptions.reduce((sum, sub) => {
      return sum + (sub.payment.nextPaymentAmount || 0);
    }, 0);

    const averageSubscriptionValue =
      activeSubscriptions.length > 0 ? recurringRevenue / activeSubscriptions.length : 0;

    const churnRate =
      allSubscriptions.length > 0 ? (cancelledInPeriod.length / allSubscriptions.length) * 100 : 0;

    // Plan breakdown
    const planStats = new Map<string, any>();
    allSubscriptions.forEach((sub) => {
      if (!planStats.has(sub.planId)) {
        const plan = this.plans.get(sub.planId);
        planStats.set(sub.planId, {
          planId: sub.planId,
          planName: plan?.name || 'Unknown',
          subscribers: 0,
          revenue: 0,
          cancelled: 0,
        });
      }

      const stats = planStats.get(sub.planId);
      if (sub.status === 'active') stats.subscribers++;
      stats.revenue += sub.payment.lastPaymentAmount || 0;
      if (sub.status === 'cancelled') stats.cancelled++;
    });

    const plans = Array.from(planStats.values()).map((p) => ({
      planId: p.planId,
      planName: p.planName,
      subscribers: p.subscribers,
      revenue: p.revenue,
      churnRate: p.subscribers > 0 ? (p.cancelled / (p.subscribers + p.cancelled)) * 100 : 0,
    }));

    // Retention (simplified)
    const retention = {
      month1: 95,
      month3: 85,
      month6: 75,
      month12: 65,
    };

    // Deliveries
    const allDeliveries = Array.from(this.deliveries.values());
    const periodDeliveries = allDeliveries.filter(
      (d) => d.createdAt >= period.start && d.createdAt <= period.end
    );

    const onTimeDeliveries = periodDeliveries.filter(
      (d) =>
        d.status === 'delivered' && d.actualDeliveryDate && d.actualDeliveryDate <= d.scheduledDate
    ).length;

    const deliveriesWithRatings = periodDeliveries.filter((d) => d.feedback?.rating);
    const averageRating =
      deliveriesWithRatings.length > 0
        ? deliveriesWithRatings.reduce((sum, d) => sum + (d.feedback?.rating || 0), 0) /
          deliveriesWithRatings.length
        : 0;

    const failedDeliveries = periodDeliveries.filter((d) => d.status === 'failed').length;
    const failureRate =
      periodDeliveries.length > 0 ? (failedDeliveries / periodDeliveries.length) * 100 : 0;

    return {
      period,
      overview: {
        totalSubscriptions: allSubscriptions.length,
        activeSubscriptions: activeSubscriptions.length,
        newSubscriptions: periodSubscriptions.length,
        cancelledSubscriptions: cancelledInPeriod.length,
        pausedSubscriptions: pausedSubscriptions.length,
      },
      revenue: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        recurringRevenue: Number(recurringRevenue.toFixed(2)),
        averageSubscriptionValue: Number(averageSubscriptionValue.toFixed(2)),
        churnRate: Number(churnRate.toFixed(2)),
      },
      plans,
      retention,
      deliveries: {
        totalDeliveries: periodDeliveries.length,
        onTimeDeliveries,
        averageRating: Number(averageRating.toFixed(2)),
        failureRate: Number(failureRate.toFixed(2)),
      },
    };
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
