/**
 * Payment Gateway Integration System
 *
 * Multi-gateway payment processing with support for Stripe, PayPal, Razorpay,
 * and other payment providers. Includes tokenization, refunds, disputes, and webhooks.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type PaymentGateway =
  | 'stripe'
  | 'paypal'
  | 'razorpay'
  | 'square'
  | 'braintree'
  | 'authorize-net'
  | 'adyen'
  | 'worldpay';

export type PaymentMethod =
  | 'card'
  | 'wallet'
  | 'bank-transfer'
  | 'upi'
  | 'net-banking'
  | 'buy-now-pay-later'
  | 'crypto';

export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | 'unionpay'
  | 'rupay';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'authorized'
  | 'captured'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially-refunded';

export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type DisputeStatus =
  | 'warning'
  | 'needs-response'
  | 'under-review'
  | 'won'
  | 'lost'
  | 'closed';

export type WebhookEventType =
  | 'payment.created'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.captured'
  | 'refund.created'
  | 'refund.completed'
  | 'dispute.created'
  | 'dispute.updated'
  | 'payout.created'
  | 'payout.paid';

export interface GatewayConfiguration {
  id: string;
  gateway: PaymentGateway;
  name: string;
  enabled: boolean;

  credentials: {
    apiKey: string;
    apiSecret: string;
    merchantId?: string;
    publicKey?: string;
    webhookSecret?: string;
    environment: 'sandbox' | 'production';
  };

  settings: {
    currency: string;
    supportedCurrencies: string[];
    supportedCountries: string[];
    supportedPaymentMethods: PaymentMethod[];

    autoCapture: boolean;
    captureDelay?: number; // hours

    threeDSecure: {
      enabled: boolean;
      required: boolean;
    };

    limits: {
      minAmount: number;
      maxAmount: number;
      dailyLimit?: number;
      monthlyLimit?: number;
    };
  };

  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };

  routing: {
    priority: number;
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    fallbackGateway?: PaymentGateway;
  };

  webhooks: {
    url: string;
    events: WebhookEventType[];
    retryPolicy: {
      maxAttempts: number;
      backoffMultiplier: number;
    };
  };

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastHealthCheck?: Date;
    healthStatus: 'healthy' | 'degraded' | 'down';
  };
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerId: string;

  gateway: {
    provider: PaymentGateway;
    transactionId: string;
    reference?: string;
  };

  amount: {
    total: number;
    currency: string;
    breakdown: {
      subtotal: number;
      tax: number;
      shipping: number;
      discount: number;
      fees: number;
    };
  };

  paymentMethod: {
    type: PaymentMethod;

    card?: {
      brand: CardBrand;
      last4: string;
      expiryMonth: number;
      expiryYear: number;
      fingerprint: string;
      funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
      country: string;
    };

    wallet?: {
      provider: 'google-pay' | 'apple-pay' | 'samsung-pay' | 'paypal';
      email?: string;
    };

    bank?: {
      name: string;
      accountNumber: string; // last 4 digits
      routingNumber?: string;
      accountType: 'checking' | 'savings';
    };

    upi?: {
      vpa: string;
    };
  };

  status: PaymentStatus;

  timeline: {
    created: Date;
    authorized?: Date;
    captured?: Date;
    completed?: Date;
    failed?: Date;
    cancelled?: Date;
  };

  authorization: {
    code?: string;
    expiresAt?: Date;
    capturedAmount?: number;
    remainingAmount?: number;
  };

  security: {
    cvvCheck: 'pass' | 'fail' | 'unavailable' | 'not-checked';
    avsCheck: 'pass' | 'fail' | 'unavailable' | 'not-checked';
    threeDSecure: {
      authenticated: boolean;
      version?: string;
      transactionId?: string;
    };
    riskScore?: number; // 0-100
    fraudCheck?: {
      status: 'pass' | 'review' | 'fail';
      rules: string[];
    };
  };

  refunds: Array<{
    refundId: string;
    amount: number;
    reason: string;
    status: RefundStatus;
    createdAt: Date;
  }>;

  disputes: Array<{
    disputeId: string;
    amount: number;
    reason: string;
    status: DisputeStatus;
    createdAt: Date;
  }>;

  fees: {
    gateway: number;
    processing: number;
    total: number;
  };

  metadata: {
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    sessionId?: string;
    custom?: Record<string, any>;
  };

  attempts: number;
  lastAttemptAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentIntent {
  id: string;
  orderId: string;
  customerId: string;

  amount: {
    value: number;
    currency: string;
  };

  preferredGateway?: PaymentGateway;
  allowedPaymentMethods?: PaymentMethod[];

  returnUrl?: string;
  cancelUrl?: string;

  status:
    | 'created'
    | 'requires-payment-method'
    | 'requires-confirmation'
    | 'processing'
    | 'succeeded'
    | 'cancelled';

  clientSecret?: string;

  expiresAt: Date;
  createdAt: Date;
}

export interface PaymentRefund {
  id: string;
  transactionId: string;
  orderId: string;

  amount: {
    requested: number;
    approved: number;
    currency: string;
  };

  reason: string;
  type: 'full' | 'partial';

  gateway: {
    provider: PaymentGateway;
    refundId: string;
    reference?: string;
  };

  status: RefundStatus;

  timeline: {
    requested: Date;
    approved?: Date;
    processed?: Date;
    completed?: Date;
    failed?: Date;
  };

  initiatedBy: {
    userId: string;
    role: 'customer' | 'admin' | 'system';
    reason: string;
  };

  financials: {
    refundAmount: number;
    feesRefunded: number;
    netRefund: number;
  };

  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDispute {
  id: string;
  transactionId: string;
  orderId: string;

  gateway: {
    provider: PaymentGateway;
    disputeId: string;
    caseId?: string;
  };

  amount: {
    disputed: number;
    currency: string;
  };

  reason: string;
  category:
    | 'fraudulent'
    | 'duplicate'
    | 'product-not-received'
    | 'product-unacceptable'
    | 'subscription-cancelled'
    | 'general';

  status: DisputeStatus;

  timeline: {
    created: Date;
    responseBy?: Date;
    responded?: Date;
    resolved?: Date;
    evidenceSubmittedAt?: Date;
  };

  evidence: {
    customerCommunication?: string[];
    shippingDocumentation?: string[];
    receipt?: string;
    refundPolicy?: string;
    customerSignature?: string;
    duplicateChargeDocumentation?: string;
    customText?: string;
  };

  resolution: {
    outcome?: 'won' | 'lost' | 'accepted';
    amount?: number;
    resolvedAt?: Date;
    notes?: string;
  };

  networkReasonCode?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface SavedPaymentMethod {
  id: string;
  customerId: string;

  type: PaymentMethod;

  gateway: {
    provider: PaymentGateway;
    tokenId: string;
  };

  details: {
    card?: {
      brand: CardBrand;
      last4: string;
      expiryMonth: number;
      expiryYear: number;
      holderName?: string;
    };

    wallet?: {
      provider: string;
      email?: string;
    };

    bank?: {
      name: string;
      accountNumber: string; // masked
    };
  };

  isDefault: boolean;
  isExpired: boolean;

  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  verification: {
    verified: boolean;
    verifiedAt?: Date;
    method?: 'micro-deposit' | 'instant' | 'manual';
  };

  usage: {
    lastUsed?: Date;
    timesUsed: number;
    totalAmount: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentWebhook {
  id: string;
  gateway: PaymentGateway;
  eventType: WebhookEventType;

  payload: {
    raw: string;
    parsed: any;
  };

  signature: {
    received: string;
    verified: boolean;
  };

  processing: {
    status: 'pending' | 'processing' | 'processed' | 'failed';
    attempts: number;
    lastAttemptAt?: Date;
    processedAt?: Date;
    error?: string;
  };

  relatedEntity?: {
    type: 'transaction' | 'refund' | 'dispute';
    id: string;
  };

  receivedAt: Date;
  createdAt: Date;
}

export interface PaymentAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalTransactions: number;
    totalAmount: number;
    successfulTransactions: number;
    failedTransactions: number;
    successRate: number;
    averageTransactionValue: number;
  };

  byGateway: Array<{
    gateway: PaymentGateway;
    transactions: number;
    amount: number;
    successRate: number;
    averageProcessingTime: number;
    fees: number;
  }>;

  byPaymentMethod: Array<{
    method: PaymentMethod;
    transactions: number;
    amount: number;
    successRate: number;
  }>;

  byCountry: Array<{
    country: string;
    transactions: number;
    amount: number;
  }>;

  refunds: {
    total: number;
    amount: number;
    rate: number; // percentage
  };

  disputes: {
    total: number;
    amount: number;
    won: number;
    lost: number;
    winRate: number;
  };

  fees: {
    total: number;
    byGateway: Record<PaymentGateway, number>;
  };

  trends: {
    daily: Array<{ date: Date; amount: number; transactions: number }>;
    hourly: Array<{ hour: number; amount: number; transactions: number }>;
  };
}

export interface GatewayHealthCheck {
  gateway: PaymentGateway;
  timestamp: Date;

  status: 'healthy' | 'degraded' | 'down';

  checks: {
    connectivity: {
      status: 'pass' | 'fail';
      responseTime: number;
      error?: string;
    };

    authentication: {
      status: 'pass' | 'fail';
      error?: string;
    };

    transaction: {
      status: 'pass' | 'fail';
      responseTime: number;
      error?: string;
    };
  };

  metrics: {
    uptime: number; // percentage
    avgResponseTime: number;
    errorRate: number;
  };

  incidents: Array<{
    timestamp: Date;
    type: string;
    message: string;
    resolved: boolean;
  }>;
}

// ============================================================================
// Main System Class
// ============================================================================

export class PaymentGatewayIntegrationSystem {
  private configurations: Map<PaymentGateway, GatewayConfiguration> = new Map();
  private transactions: Map<string, PaymentTransaction> = new Map();
  private paymentIntents: Map<string, PaymentIntent> = new Map();
  private refunds: Map<string, PaymentRefund> = new Map();
  private disputes: Map<string, PaymentDispute> = new Map();
  private savedPaymentMethods: Map<string, SavedPaymentMethod> = new Map();
  private webhooks: Map<string, PaymentWebhook> = new Map();
  private healthChecks: Map<PaymentGateway, GatewayHealthCheck> = new Map();

  constructor() {
    this.initializeGateways();
  }

  // ============================================================================
  // Gateway Configuration
  // ============================================================================

  configureGateway(params: {
    gateway: PaymentGateway;
    name: string;
    credentials: GatewayConfiguration['credentials'];
    settings: GatewayConfiguration['settings'];
  }): GatewayConfiguration {
    const config: GatewayConfiguration = {
      id: `config_${params.gateway}_${Date.now()}`,
      gateway: params.gateway,
      name: params.name,
      enabled: false,
      credentials: params.credentials,
      settings: params.settings,
      fees: {
        percentage: 2.9,
        fixed: 0.3,
        currency: 'USD',
      },
      routing: {
        priority: 1,
      },
      webhooks: {
        url: `https://api.example.com/webhooks/${params.gateway}`,
        events: ['payment.succeeded', 'payment.failed', 'refund.completed', 'dispute.created'],
        retryPolicy: {
          maxAttempts: 3,
          backoffMultiplier: 2,
        },
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        healthStatus: 'healthy',
      },
    };

    this.configurations.set(params.gateway, config);
    return config;
  }

  enableGateway(gateway: PaymentGateway): GatewayConfiguration {
    const config = this.configurations.get(gateway);
    if (!config) throw new Error('Gateway not configured');

    config.enabled = true;
    config.metadata.updatedAt = new Date();

    return config;
  }

  disableGateway(gateway: PaymentGateway): GatewayConfiguration {
    const config = this.configurations.get(gateway);
    if (!config) throw new Error('Gateway not configured');

    config.enabled = false;
    config.metadata.updatedAt = new Date();

    return config;
  }

  // ============================================================================
  // Payment Processing
  // ============================================================================

  createPaymentIntent(params: {
    orderId: string;
    customerId: string;
    amount: number;
    currency: string;
    preferredGateway?: PaymentGateway;
  }): PaymentIntent {
    const intent: PaymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: params.orderId,
      customerId: params.customerId,
      amount: {
        value: params.amount,
        currency: params.currency,
      },
      preferredGateway: params.preferredGateway,
      status: 'created',
      clientSecret: `secret_${Math.random().toString(36).substr(2, 32)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
    };

    this.paymentIntents.set(intent.id, intent);
    return intent;
  }

  async processPayment(params: {
    orderId: string;
    customerId: string;
    amount: number;
    currency: string;
    paymentMethod: SavedPaymentMethod | { type: PaymentMethod; details: any };
    gateway?: PaymentGateway;
  }): Promise<PaymentTransaction> {
    // Select gateway
    const gateway = params.gateway || this.selectOptimalGateway(params.amount, params.currency);
    const config = this.configurations.get(gateway);

    if (!config || !config.enabled) {
      throw new Error('Gateway not available');
    }

    // Create transaction
    const transaction: PaymentTransaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: params.orderId,
      customerId: params.customerId,
      gateway: {
        provider: gateway,
        transactionId: `${gateway}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      amount: {
        total: params.amount,
        currency: params.currency,
        breakdown: {
          subtotal: params.amount * 0.85,
          tax: params.amount * 0.1,
          shipping: params.amount * 0.05,
          discount: 0,
          fees: 0,
        },
      },
      paymentMethod: this.extractPaymentMethodDetails(params.paymentMethod),
      status: 'pending',
      timeline: {
        created: new Date(),
      },
      authorization: {},
      security: {
        cvvCheck: 'pass',
        avsCheck: 'pass',
        threeDSecure: {
          authenticated: true,
          version: '2.0',
        },
        riskScore: 15 + Math.random() * 30,
      },
      refunds: [],
      disputes: [],
      fees: {
        gateway: params.amount * (config.fees.percentage / 100) + config.fees.fixed,
        processing: 0,
        total: 0,
      },
      metadata: {},
      attempts: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transaction.fees.total = transaction.fees.gateway + transaction.fees.processing;

    // Simulate payment processing
    await this.executePaymentWithGateway(transaction, config);

    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  private async executePaymentWithGateway(
    transaction: PaymentTransaction,
    config: GatewayConfiguration
  ): Promise<void> {
    // Simulate API call to payment gateway
    await this.delay(1000 + Math.random() * 2000);

    transaction.status = 'processing';
    transaction.timeline.authorized = new Date();

    // Simulate success/failure
    const success = Math.random() > 0.05; // 95% success rate

    if (success) {
      if (config.settings.autoCapture) {
        transaction.status = 'captured';
        transaction.timeline.captured = new Date();
        transaction.timeline.completed = new Date();
        transaction.authorization.capturedAmount = transaction.amount.total;
      } else {
        transaction.status = 'authorized';
        transaction.authorization.code = `AUTH_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        transaction.authorization.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        transaction.authorization.remainingAmount = transaction.amount.total;
      }
    } else {
      transaction.status = 'failed';
      transaction.timeline.failed = new Date();
    }

    transaction.updatedAt = new Date();
  }

  capturePayment(transactionId: string, amount?: number): PaymentTransaction {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'authorized') throw new Error('Transaction not authorized');

    const captureAmount = amount || transaction.authorization.remainingAmount || 0;

    transaction.status =
      captureAmount === transaction.amount.total ? 'captured' : 'partially-refunded';
    transaction.timeline.captured = new Date();
    transaction.authorization.capturedAmount =
      (transaction.authorization.capturedAmount || 0) + captureAmount;
    transaction.authorization.remainingAmount =
      (transaction.authorization.remainingAmount || 0) - captureAmount;

    if (transaction.authorization.remainingAmount === 0) {
      transaction.timeline.completed = new Date();
      transaction.status = 'completed';
    }

    transaction.updatedAt = new Date();
    return transaction;
  }

  cancelPayment(transactionId: string): PaymentTransaction {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'authorized' && transaction.status !== 'pending') {
      throw new Error('Transaction cannot be cancelled');
    }

    transaction.status = 'cancelled';
    transaction.timeline.cancelled = new Date();
    transaction.updatedAt = new Date();

    return transaction;
  }

  // ============================================================================
  // Refund Management
  // ============================================================================

  createRefund(params: {
    transactionId: string;
    amount: number;
    reason: string;
    initiatedBy: PaymentRefund['initiatedBy'];
  }): PaymentRefund {
    const transaction = this.transactions.get(params.transactionId);
    if (!transaction) throw new Error('Transaction not found');
    if (transaction.status !== 'completed' && transaction.status !== 'captured') {
      throw new Error('Transaction cannot be refunded');
    }

    const alreadyRefunded = transaction.refunds.reduce((sum, r) => sum + r.amount, 0);
    const availableForRefund = transaction.amount.total - alreadyRefunded;

    if (params.amount > availableForRefund) {
      throw new Error('Refund amount exceeds available amount');
    }

    const refund: PaymentRefund = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: params.transactionId,
      orderId: transaction.orderId,
      amount: {
        requested: params.amount,
        approved: params.amount,
        currency: transaction.amount.currency,
      },
      reason: params.reason,
      type: params.amount === transaction.amount.total ? 'full' : 'partial',
      gateway: {
        provider: transaction.gateway.provider,
        refundId: `${transaction.gateway.provider}_ref_${Date.now()}`,
      },
      status: 'pending',
      timeline: {
        requested: new Date(),
      },
      initiatedBy: params.initiatedBy,
      financials: {
        refundAmount: params.amount,
        feesRefunded: (params.amount / transaction.amount.total) * transaction.fees.total,
        netRefund: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    refund.financials.netRefund = refund.financials.refundAmount - refund.financials.feesRefunded;

    // Process refund
    this.processRefund(refund);

    // Update transaction
    transaction.refunds.push({
      refundId: refund.id,
      amount: params.amount,
      reason: params.reason,
      status: refund.status,
      createdAt: new Date(),
    });

    if (alreadyRefunded + params.amount === transaction.amount.total) {
      transaction.status = 'refunded';
    } else {
      transaction.status = 'partially-refunded';
    }

    this.refunds.set(refund.id, refund);
    return refund;
  }

  private async processRefund(refund: PaymentRefund): Promise<void> {
    refund.status = 'processing';
    refund.timeline.approved = new Date();

    // Simulate refund processing
    setTimeout(() => {
      refund.status = 'completed';
      refund.timeline.processed = new Date();
      refund.timeline.completed = new Date();
      refund.updatedAt = new Date();
    }, 3000);
  }

  // ============================================================================
  // Dispute Management
  // ============================================================================

  createDispute(params: {
    transactionId: string;
    amount: number;
    reason: string;
    category: PaymentDispute['category'];
  }): PaymentDispute {
    const transaction = this.transactions.get(params.transactionId);
    if (!transaction) throw new Error('Transaction not found');

    const dispute: PaymentDispute = {
      id: `disp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: params.transactionId,
      orderId: transaction.orderId,
      gateway: {
        provider: transaction.gateway.provider,
        disputeId: `${transaction.gateway.provider}_disp_${Date.now()}`,
      },
      amount: {
        disputed: params.amount,
        currency: transaction.amount.currency,
      },
      reason: params.reason,
      category: params.category,
      status: 'needs-response',
      timeline: {
        created: new Date(),
        responseBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      evidence: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update transaction
    transaction.disputes.push({
      disputeId: dispute.id,
      amount: params.amount,
      reason: params.reason,
      status: dispute.status,
      createdAt: new Date(),
    });

    this.disputes.set(dispute.id, dispute);
    return dispute;
  }

  submitDisputeEvidence(disputeId: string, evidence: PaymentDispute['evidence']): PaymentDispute {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    dispute.evidence = { ...dispute.evidence, ...evidence };
    dispute.status = 'under-review';
    dispute.timeline.evidenceSubmittedAt = new Date();
    dispute.timeline.responded = new Date();
    dispute.updatedAt = new Date();

    return dispute;
  }

  resolveDispute(
    disputeId: string,
    outcome: 'won' | 'lost' | 'accepted',
    notes?: string
  ): PaymentDispute {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    dispute.status = outcome === 'won' ? 'won' : outcome === 'lost' ? 'lost' : 'closed';
    dispute.resolution = {
      outcome,
      amount: outcome === 'lost' ? dispute.amount.disputed : 0,
      resolvedAt: new Date(),
      notes,
    };
    dispute.timeline.resolved = new Date();
    dispute.updatedAt = new Date();

    return dispute;
  }

  // ============================================================================
  // Saved Payment Methods
  // ============================================================================

  savePaymentMethod(params: {
    customerId: string;
    type: PaymentMethod;
    gateway: PaymentGateway;
    details: any;
    isDefault?: boolean;
  }): SavedPaymentMethod {
    const saved: SavedPaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: params.customerId,
      type: params.type,
      gateway: {
        provider: params.gateway,
        tokenId: `tok_${Math.random().toString(36).substr(2, 24)}`,
      },
      details: params.details,
      isDefault: params.isDefault || false,
      isExpired: false,
      verification: {
        verified: true,
        verifiedAt: new Date(),
        method: 'instant',
      },
      usage: {
        timesUsed: 0,
        totalAmount: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.savedPaymentMethods.set(saved.id, saved);
    return saved;
  }

  deletePaymentMethod(paymentMethodId: string): void {
    this.savedPaymentMethods.delete(paymentMethodId);
  }

  setDefaultPaymentMethod(customerId: string, paymentMethodId: string): SavedPaymentMethod {
    const method = this.savedPaymentMethods.get(paymentMethodId);
    if (!method || method.customerId !== customerId) {
      throw new Error('Payment method not found');
    }

    // Unset other defaults
    this.savedPaymentMethods.forEach((pm) => {
      if (pm.customerId === customerId && pm.id !== paymentMethodId) {
        pm.isDefault = false;
      }
    });

    method.isDefault = true;
    method.updatedAt = new Date();

    return method;
  }

  // ============================================================================
  // Webhook Handling
  // ============================================================================

  handleWebhook(params: {
    gateway: PaymentGateway;
    eventType: WebhookEventType;
    payload: string;
    signature: string;
  }): PaymentWebhook {
    const webhook: PaymentWebhook = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gateway: params.gateway,
      eventType: params.eventType,
      payload: {
        raw: params.payload,
        parsed: JSON.parse(params.payload),
      },
      signature: {
        received: params.signature,
        verified: this.verifyWebhookSignature(params.gateway, params.payload, params.signature),
      },
      processing: {
        status: 'pending',
        attempts: 0,
      },
      receivedAt: new Date(),
      createdAt: new Date(),
    };

    this.webhooks.set(webhook.id, webhook);

    // Process webhook asynchronously
    this.processWebhook(webhook);

    return webhook;
  }

  private verifyWebhookSignature(
    gateway: PaymentGateway,
    payload: string,
    signature: string
  ): boolean {
    const config = this.configurations.get(gateway);
    if (!config?.credentials.webhookSecret) return false;

    // Simulate signature verification
    return signature.length > 0;
  }

  private async processWebhook(webhook: PaymentWebhook): Promise<void> {
    webhook.processing.status = 'processing';
    webhook.processing.attempts++;
    webhook.processing.lastAttemptAt = new Date();

    try {
      // Process based on event type
      switch (webhook.eventType) {
        case 'payment.succeeded':
          // Update transaction status
          break;
        case 'payment.failed':
          // Handle failed payment
          break;
        case 'refund.completed':
          // Update refund status
          break;
        case 'dispute.created':
          // Create dispute record
          break;
      }

      webhook.processing.status = 'processed';
      webhook.processing.processedAt = new Date();
    } catch (error) {
      webhook.processing.status = 'failed';
      webhook.processing.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  // ============================================================================
  // Analytics & Reporting
  // ============================================================================

  getPaymentAnalytics(period: { start: Date; end: Date }): PaymentAnalytics {
    const transactionsInPeriod = Array.from(this.transactions.values()).filter(
      (t) => t.createdAt >= period.start && t.createdAt <= period.end
    );

    const successful = transactionsInPeriod.filter(
      (t) => t.status === 'completed' || t.status === 'captured'
    );
    const failed = transactionsInPeriod.filter((t) => t.status === 'failed');

    const analytics: PaymentAnalytics = {
      period,
      overview: {
        totalTransactions: transactionsInPeriod.length,
        totalAmount: transactionsInPeriod.reduce((sum, t) => sum + t.amount.total, 0),
        successfulTransactions: successful.length,
        failedTransactions: failed.length,
        successRate: (successful.length / transactionsInPeriod.length) * 100 || 0,
        averageTransactionValue:
          transactionsInPeriod.reduce((sum, t) => sum + t.amount.total, 0) /
            transactionsInPeriod.length || 0,
      },
      byGateway: [],
      byPaymentMethod: [],
      byCountry: [],
      refunds: {
        total: Array.from(this.refunds.values()).filter((r) => r.status === 'completed').length,
        amount: Array.from(this.refunds.values()).reduce((sum, r) => sum + r.amount.approved, 0),
        rate: 0,
      },
      disputes: {
        total: this.disputes.size,
        amount: Array.from(this.disputes.values()).reduce((sum, d) => sum + d.amount.disputed, 0),
        won: Array.from(this.disputes.values()).filter((d) => d.status === 'won').length,
        lost: Array.from(this.disputes.values()).filter((d) => d.status === 'lost').length,
        winRate: 0,
      },
      fees: {
        total: transactionsInPeriod.reduce((sum, t) => sum + t.fees.total, 0),
        byGateway: {} as Record<PaymentGateway, number>,
      },
      trends: {
        daily: [],
        hourly: [],
      },
    };

    analytics.refunds.rate =
      (analytics.refunds.total / analytics.overview.totalTransactions) * 100 || 0;
    analytics.disputes.winRate = (analytics.disputes.won / analytics.disputes.total) * 100 || 0;

    return analytics;
  }

  // ============================================================================
  // Health Checks
  // ============================================================================

  async performHealthCheck(gateway: PaymentGateway): Promise<GatewayHealthCheck> {
    const healthCheck: GatewayHealthCheck = {
      gateway,
      timestamp: new Date(),
      status: 'healthy',
      checks: {
        connectivity: {
          status: 'pass',
          responseTime: 50 + Math.random() * 150,
        },
        authentication: {
          status: 'pass',
        },
        transaction: {
          status: 'pass',
          responseTime: 100 + Math.random() * 300,
        },
      },
      metrics: {
        uptime: 99.5 + Math.random() * 0.5,
        avgResponseTime: 100 + Math.random() * 200,
        errorRate: Math.random() * 2,
      },
      incidents: [],
    };

    // Determine overall status
    const failedChecks = Object.values(healthCheck.checks).filter(
      (c) => c.status === 'fail'
    ).length;
    if (failedChecks > 1) {
      healthCheck.status = 'down';
    } else if (failedChecks === 1) {
      healthCheck.status = 'degraded';
    }

    this.healthChecks.set(gateway, healthCheck);

    // Update gateway configuration
    const config = this.configurations.get(gateway);
    if (config) {
      config.metadata.lastHealthCheck = new Date();
      config.metadata.healthStatus = healthCheck.status;
    }

    return healthCheck;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private selectOptimalGateway(amount: number, currency: string): PaymentGateway {
    const enabledGateways = Array.from(this.configurations.values())
      .filter((c) => c.enabled && c.settings.supportedCurrencies.includes(currency))
      .sort((a, b) => a.routing.priority - b.routing.priority);

    if (enabledGateways.length === 0) {
      throw new Error('No available payment gateway');
    }

    return enabledGateways[0].gateway;
  }

  private extractPaymentMethodDetails(method: any): PaymentTransaction['paymentMethod'] {
    if ('type' in method) {
      return {
        type: method.type,
        ...method.details,
      };
    } else {
      return {
        type: method.type,
        ...method.details,
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  private initializeGateways(): void {
    // Configure Stripe
    this.configureGateway({
      gateway: 'stripe',
      name: 'Stripe',
      credentials: {
        apiKey: 'sk_test_...',
        apiSecret: 'whsec_...',
        publicKey: 'pk_test_...',
        webhookSecret: 'whsec_...',
        environment: 'sandbox',
      },
      settings: {
        currency: 'USD',
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
        supportedCountries: ['US', 'GB', 'IN'],
        supportedPaymentMethods: ['card', 'wallet'],
        autoCapture: true,
        threeDSecure: {
          enabled: true,
          required: false,
        },
        limits: {
          minAmount: 0.5,
          maxAmount: 999999.99,
        },
      },
    });
    this.enableGateway('stripe');

    // Configure Razorpay
    this.configureGateway({
      gateway: 'razorpay',
      name: 'Razorpay',
      credentials: {
        apiKey: 'rzp_test_...',
        apiSecret: 'secret_...',
        environment: 'sandbox',
      },
      settings: {
        currency: 'INR',
        supportedCurrencies: ['INR', 'USD'],
        supportedCountries: ['IN'],
        supportedPaymentMethods: ['card', 'upi', 'net-banking', 'wallet'],
        autoCapture: true,
        threeDSecure: {
          enabled: true,
          required: false,
        },
        limits: {
          minAmount: 1.0,
          maxAmount: 10000000.0,
        },
      },
    });
    this.enableGateway('razorpay');
  }

  // ============================================================================
  // Query Methods
  // ============================================================================

  getTransactionsByCustomer(customerId: string): PaymentTransaction[] {
    return Array.from(this.transactions.values())
      .filter((t) => t.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getTransactionsByOrder(orderId: string): PaymentTransaction[] {
    return Array.from(this.transactions.values()).filter((t) => t.orderId === orderId);
  }

  getRefundsByTransaction(transactionId: string): PaymentRefund[] {
    return Array.from(this.refunds.values()).filter((r) => r.transactionId === transactionId);
  }

  getDisputesByStatus(status: DisputeStatus): PaymentDispute[] {
    return Array.from(this.disputes.values()).filter((d) => d.status === status);
  }

  getSavedPaymentMethods(customerId: string): SavedPaymentMethod[] {
    return Array.from(this.savedPaymentMethods.values()).filter(
      (pm) => pm.customerId === customerId && !pm.isExpired
    );
  }

  getPendingWebhooks(): PaymentWebhook[] {
    return Array.from(this.webhooks.values()).filter(
      (w) => w.processing.status === 'pending' || w.processing.status === 'processing'
    );
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const paymentGatewayIntegration = new PaymentGatewayIntegrationSystem();
