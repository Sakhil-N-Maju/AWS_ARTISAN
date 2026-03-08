/**
 * Mobile Commerce Service
 *
 * Optimized mobile commerce features:
 * - Mobile checkout optimization
 * - One-tap purchasing
 * - Mobile wallet integration
 * - Mobile-specific promotions
 * - Quick reorder
 */

export interface MobileCheckout {
  id: string;
  userId: string;
  deviceId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  shippingAddress?: any;
  billingAddress?: any;
  paymentMethod?: {
    type: 'card' | 'wallet' | 'upi' | 'saved';
    lastFour?: string;
  };
  step: 'cart' | 'shipping' | 'payment' | 'review' | 'confirmed';
  startedAt: Date;
  completedAt?: Date;
  abandonedAt?: Date;
  timeToComplete?: number; // in seconds
}

export interface OneTapPurchase {
  id: string;
  userId: string;
  deviceId: string;
  productId: string;
  quantity: number;
  amount: number;
  shippingAddressId: string;
  paymentMethodId: string;
  timestamp: Date;
  success: boolean;
  orderId?: string;
}

export interface MobileWallet {
  id: string;
  userId: string;
  provider: 'apple_pay' | 'google_pay' | 'samsung_pay' | 'paytm' | 'phonepe';
  token: string;
  isDefault: boolean;
  addedAt: Date;
  lastUsed?: Date;
  transactionCount: number;
}

export interface MobilePromotion {
  id: string;
  name: string;
  type: 'first_mobile_order' | 'app_exclusive' | 'mobile_flash_sale' | 'push_notification';
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minPurchase?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  deviceTypes?: ('ios' | 'android')[];
}

export interface QuickReorder {
  id: string;
  userId: string;
  originalOrderId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  reorderedAt: Date;
  newOrderId?: string;
}

export interface SavedCart {
  id: string;
  userId: string;
  deviceId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  totalAmount: number;
  savedAt: Date;
  expiresAt: Date;
  converted: boolean;
  convertedAt?: Date;
}

export interface MobilePaymentSession {
  id: string;
  userId: string;
  deviceId: string;
  amount: number;
  currency: string;
  provider: 'stripe' | 'razorpay' | 'paypal' | 'wallet';
  status: 'initiated' | 'processing' | 'completed' | 'failed';
  metadata: {
    orderId?: string;
    productIds?: string[];
    biometricVerified?: boolean;
  };
  startedAt: Date;
  completedAt?: Date;
}

export class MobileCommerceService {
  private checkouts: Map<string, MobileCheckout> = new Map();
  private oneTapPurchases: Map<string, OneTapPurchase> = new Map();
  private wallets: Map<string, MobileWallet> = new Map();
  private promotions: Map<string, MobilePromotion> = new Map();
  private reorders: Map<string, QuickReorder> = new Map();
  private savedCarts: Map<string, SavedCart> = new Map();
  private paymentSessions: Map<string, MobilePaymentSession> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Start mobile checkout
   */
  async startCheckout(data: {
    userId: string;
    deviceId: string;
    items: MobileCheckout['items'];
  }): Promise<MobileCheckout> {
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const checkout: MobileCheckout = {
      id: `checkout-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      items: data.items,
      totalAmount,
      step: 'cart',
      startedAt: new Date(),
    };

    this.checkouts.set(checkout.id, checkout);
    return checkout;
  }

  /**
   * Update checkout step
   */
  async updateCheckoutStep(
    checkoutId: string,
    step: MobileCheckout['step'],
    data?: Partial<MobileCheckout>
  ): Promise<MobileCheckout> {
    const checkout = this.checkouts.get(checkoutId);
    if (!checkout) {
      throw new Error('Checkout not found');
    }

    checkout.step = step;
    if (data) {
      Object.assign(checkout, data);
    }

    if (step === 'confirmed') {
      checkout.completedAt = new Date();
      checkout.timeToComplete = Math.floor(
        (checkout.completedAt.getTime() - checkout.startedAt.getTime()) / 1000
      );
    }

    this.checkouts.set(checkoutId, checkout);
    return checkout;
  }

  /**
   * Abandon checkout
   */
  async abandonCheckout(checkoutId: string): Promise<void> {
    const checkout = this.checkouts.get(checkoutId);
    if (checkout) {
      checkout.abandonedAt = new Date();
      this.checkouts.set(checkoutId, checkout);
    }
  }

  /**
   * One-tap purchase
   */
  async oneTapPurchase(data: {
    userId: string;
    deviceId: string;
    productId: string;
    quantity: number;
    amount: number;
    shippingAddressId: string;
    paymentMethodId: string;
  }): Promise<OneTapPurchase> {
    const purchase: OneTapPurchase = {
      id: `otp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      productId: data.productId,
      quantity: data.quantity,
      amount: data.amount,
      shippingAddressId: data.shippingAddressId,
      paymentMethodId: data.paymentMethodId,
      timestamp: new Date(),
      success: true,
      orderId: `order-${Date.now()}`,
    };

    this.oneTapPurchases.set(purchase.id, purchase);
    return purchase;
  }

  /**
   * Add mobile wallet
   */
  async addWallet(data: {
    userId: string;
    provider: MobileWallet['provider'];
    token: string;
    isDefault?: boolean;
  }): Promise<MobileWallet> {
    // Set other wallets to non-default if this is default
    if (data.isDefault) {
      Array.from(this.wallets.values())
        .filter((w) => w.userId === data.userId && w.isDefault)
        .forEach((w) => {
          w.isDefault = false;
          this.wallets.set(w.id, w);
        });
    }

    const wallet: MobileWallet = {
      id: `wallet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      provider: data.provider,
      token: data.token,
      isDefault: data.isDefault || false,
      addedAt: new Date(),
      transactionCount: 0,
    };

    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  /**
   * Use wallet for payment
   */
  async useWallet(walletId: string): Promise<void> {
    const wallet = this.wallets.get(walletId);
    if (wallet) {
      wallet.lastUsed = new Date();
      wallet.transactionCount++;
      this.wallets.set(walletId, wallet);
    }
  }

  /**
   * Get user's wallets
   */
  async getUserWallets(userId: string): Promise<MobileWallet[]> {
    return Array.from(this.wallets.values())
      .filter((w) => w.userId === userId)
      .sort((a, b) => {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return b.addedAt.getTime() - a.addedAt.getTime();
      });
  }

  /**
   * Create mobile promotion
   */
  async createPromotion(data: {
    name: string;
    type: MobilePromotion['type'];
    discountType: MobilePromotion['discountType'];
    discountValue: number;
    minPurchase?: number;
    validFrom: Date;
    validUntil: Date;
    usageLimit?: number;
    deviceTypes?: MobilePromotion['deviceTypes'];
  }): Promise<MobilePromotion> {
    const promotion: MobilePromotion = {
      id: `promo-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      type: data.type,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minPurchase: data.minPurchase,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      usageLimit: data.usageLimit,
      usageCount: 0,
      active: true,
      deviceTypes: data.deviceTypes,
    };

    this.promotions.set(promotion.id, promotion);
    return promotion;
  }

  /**
   * Get active promotions
   */
  async getActivePromotions(deviceType?: 'ios' | 'android'): Promise<MobilePromotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values())
      .filter((p) => {
        if (!p.active) return false;
        if (p.validFrom > now || p.validUntil < now) return false;
        if (p.usageLimit && p.usageCount >= p.usageLimit) return false;
        if (deviceType && p.deviceTypes && !p.deviceTypes.includes(deviceType)) return false;
        return true;
      })
      .sort((a, b) => b.discountValue - a.discountValue);
  }

  /**
   * Apply promotion
   */
  async applyPromotion(
    promotionId: string,
    orderAmount: number
  ): Promise<{
    valid: boolean;
    discount: number;
    finalAmount: number;
  }> {
    const promotion = this.promotions.get(promotionId);

    if (!promotion || !promotion.active) {
      return { valid: false, discount: 0, finalAmount: orderAmount };
    }

    if (promotion.minPurchase && orderAmount < promotion.minPurchase) {
      return { valid: false, discount: 0, finalAmount: orderAmount };
    }

    const now = new Date();
    if (promotion.validFrom > now || promotion.validUntil < now) {
      return { valid: false, discount: 0, finalAmount: orderAmount };
    }

    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return { valid: false, discount: 0, finalAmount: orderAmount };
    }

    let discount = 0;
    if (promotion.discountType === 'percentage') {
      discount = (orderAmount * promotion.discountValue) / 100;
    } else if (promotion.discountType === 'fixed') {
      discount = promotion.discountValue;
    }

    promotion.usageCount++;
    this.promotions.set(promotionId, promotion);

    return {
      valid: true,
      discount,
      finalAmount: orderAmount - discount,
    };
  }

  /**
   * Quick reorder
   */
  async quickReorder(data: {
    userId: string;
    originalOrderId: string;
    items: QuickReorder['items'];
  }): Promise<QuickReorder> {
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const reorder: QuickReorder = {
      id: `reorder-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      originalOrderId: data.originalOrderId,
      items: data.items,
      totalAmount,
      reorderedAt: new Date(),
      newOrderId: `order-${Date.now()}`,
    };

    this.reorders.set(reorder.id, reorder);
    return reorder;
  }

  /**
   * Save cart
   */
  async saveCart(data: {
    userId: string;
    deviceId: string;
    items: SavedCart['items'];
  }): Promise<SavedCart> {
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    const cart: SavedCart = {
      id: `saved-cart-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      items: data.items,
      totalAmount,
      savedAt: new Date(),
      expiresAt,
      converted: false,
    };

    this.savedCarts.set(cart.id, cart);
    return cart;
  }

  /**
   * Get saved carts
   */
  async getSavedCarts(userId: string): Promise<SavedCart[]> {
    const now = new Date();
    return Array.from(this.savedCarts.values())
      .filter((c) => c.userId === userId && c.expiresAt > now && !c.converted)
      .sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
  }

  /**
   * Convert saved cart
   */
  async convertSavedCart(cartId: string): Promise<void> {
    const cart = this.savedCarts.get(cartId);
    if (cart) {
      cart.converted = true;
      cart.convertedAt = new Date();
      this.savedCarts.set(cartId, cart);
    }
  }

  /**
   * Initiate payment session
   */
  async initiatePayment(data: {
    userId: string;
    deviceId: string;
    amount: number;
    currency: string;
    provider: MobilePaymentSession['provider'];
    metadata: MobilePaymentSession['metadata'];
  }): Promise<MobilePaymentSession> {
    const session: MobilePaymentSession = {
      id: `payment-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      amount: data.amount,
      currency: data.currency,
      provider: data.provider,
      status: 'initiated',
      metadata: data.metadata,
      startedAt: new Date(),
    };

    this.paymentSessions.set(session.id, session);
    return session;
  }

  /**
   * Complete payment
   */
  async completePayment(sessionId: string, success: boolean): Promise<MobilePaymentSession> {
    const session = this.paymentSessions.get(sessionId);
    if (!session) {
      throw new Error('Payment session not found');
    }

    session.status = success ? 'completed' : 'failed';
    session.completedAt = new Date();
    this.paymentSessions.set(sessionId, session);

    return session;
  }

  /**
   * Get mobile commerce analytics
   */
  async getAnalytics(period: 'day' | 'week' | 'month' = 'week'): Promise<{
    checkouts: {
      started: number;
      completed: number;
      abandoned: number;
      conversionRate: number;
      averageTimeToComplete: number;
    };
    oneTapPurchases: {
      total: number;
      successRate: number;
      averageValue: number;
    };
    wallets: {
      totalAdded: number;
      mostUsedProvider: string;
      transactionCount: number;
    };
    promotions: {
      active: number;
      totalUsage: number;
      totalDiscountGiven: number;
    };
    reorders: {
      total: number;
      reorderRate: number;
    };
    savedCarts: {
      total: number;
      converted: number;
      conversionRate: number;
    };
  }> {
    const now = new Date();
    const periodMs = period === 'day' ? 86400000 : period === 'week' ? 604800000 : 2592000000;
    const cutoff = new Date(now.getTime() - periodMs);

    // Checkout analytics
    const recentCheckouts = Array.from(this.checkouts.values()).filter(
      (c) => c.startedAt >= cutoff
    );
    const completedCheckouts = recentCheckouts.filter((c) => c.completedAt);
    const abandonedCheckouts = recentCheckouts.filter((c) => c.abandonedAt);

    const avgTimeToComplete =
      completedCheckouts.length > 0
        ? completedCheckouts.reduce((sum, c) => sum + (c.timeToComplete || 0), 0) /
          completedCheckouts.length
        : 0;

    // One-tap analytics
    const recentOneTap = Array.from(this.oneTapPurchases.values()).filter(
      (o) => o.timestamp >= cutoff
    );
    const successfulOneTap = recentOneTap.filter((o) => o.success);
    const avgOneTapValue =
      recentOneTap.length > 0
        ? recentOneTap.reduce((sum, o) => sum + o.amount, 0) / recentOneTap.length
        : 0;

    // Wallet analytics
    const recentWallets = Array.from(this.wallets.values()).filter((w) => w.addedAt >= cutoff);
    const providerCounts = new Map<string, number>();
    Array.from(this.wallets.values()).forEach((w) => {
      providerCounts.set(w.provider, (providerCounts.get(w.provider) || 0) + w.transactionCount);
    });
    const mostUsedProvider =
      Array.from(providerCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    const totalWalletTransactions = Array.from(this.wallets.values()).reduce(
      (sum, w) => sum + w.transactionCount,
      0
    );

    // Promotion analytics
    const activePromotions = Array.from(this.promotions.values()).filter(
      (p) => p.active && p.validFrom <= now && p.validUntil >= now
    );
    const totalPromotionUsage = Array.from(this.promotions.values()).reduce(
      (sum, p) => sum + p.usageCount,
      0
    );

    // Reorder analytics
    const recentReorders = Array.from(this.reorders.values()).filter(
      (r) => r.reorderedAt >= cutoff
    );

    // Saved cart analytics
    const recentSavedCarts = Array.from(this.savedCarts.values()).filter(
      (c) => c.savedAt >= cutoff
    );
    const convertedCarts = recentSavedCarts.filter((c) => c.converted);

    return {
      checkouts: {
        started: recentCheckouts.length,
        completed: completedCheckouts.length,
        abandoned: abandonedCheckouts.length,
        conversionRate:
          recentCheckouts.length > 0
            ? (completedCheckouts.length / recentCheckouts.length) * 100
            : 0,
        averageTimeToComplete: Math.round(avgTimeToComplete),
      },
      oneTapPurchases: {
        total: recentOneTap.length,
        successRate:
          recentOneTap.length > 0 ? (successfulOneTap.length / recentOneTap.length) * 100 : 0,
        averageValue: Math.round(avgOneTapValue),
      },
      wallets: {
        totalAdded: recentWallets.length,
        mostUsedProvider,
        transactionCount: totalWalletTransactions,
      },
      promotions: {
        active: activePromotions.length,
        totalUsage: totalPromotionUsage,
        totalDiscountGiven: 0, // Would calculate from actual usage
      },
      reorders: {
        total: recentReorders.length,
        reorderRate: 0, // Would calculate against total orders
      },
      savedCarts: {
        total: recentSavedCarts.length,
        converted: convertedCarts.length,
        conversionRate:
          recentSavedCarts.length > 0 ? (convertedCarts.length / recentSavedCarts.length) * 100 : 0,
      },
    };
  }

  /**
   * Initialize default data
   */
  private initializeDefaultData(): void {
    // Create sample mobile promotions
    this.createPromotion({
      name: 'First Mobile Order - 20% Off',
      type: 'first_mobile_order',
      discountType: 'percentage',
      discountValue: 20,
      minPurchase: 500,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 86400000),
      usageLimit: 1000,
    });

    this.createPromotion({
      name: 'App Exclusive - Free Shipping',
      type: 'app_exclusive',
      discountType: 'free_shipping',
      discountValue: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 86400000),
    });

    this.createPromotion({
      name: 'Mobile Flash Sale - ₹500 Off',
      type: 'mobile_flash_sale',
      discountType: 'fixed',
      discountValue: 500,
      minPurchase: 2000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 86400000),
      usageLimit: 500,
    });
  }
}

// Singleton instance
export const mobileCommerceService = new MobileCommerceService();
