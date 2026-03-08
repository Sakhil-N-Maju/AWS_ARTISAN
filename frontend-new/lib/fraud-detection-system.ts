/**
 * Fraud Detection System
 *
 * Comprehensive fraud detection and prevention:
 * - Transaction fraud detection
 * - Account fraud detection
 * - Payment fraud prevention
 * - Bot and abuse detection
 * - Risk scoring and analysis
 * - Pattern recognition
 * - Machine learning models
 * - Real-time monitoring
 */

export interface FraudCheck {
  id: string;
  timestamp: Date;

  // Entity being checked
  entityType: 'transaction' | 'user' | 'payment' | 'order' | 'login' | 'registration';
  entityId: string;

  // Risk assessment
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  // Fraud indicators
  fraudIndicators: {
    indicator: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number; // 0-1
    description: string;
    weight: number;
  }[];

  // Decision
  decision: 'approve' | 'review' | 'challenge' | 'reject' | 'block';

  // Rules triggered
  rulesTriggered: {
    ruleId: string;
    ruleName: string;
    matched: boolean;
    score: number;
  }[];

  // ML model results
  mlModels?: {
    modelName: string;
    prediction: 'fraud' | 'legitimate';
    confidence: number;
    features: Record<string, any>;
  }[];

  // Recommendation
  recommendation: {
    action: string;
    reason: string;
    alternativeActions?: string[];
  };

  // Context
  context: {
    userId?: string;
    ipAddress?: string;
    deviceId?: string;
    location?: {
      country: string;
      city: string;
      coordinates?: { lat: number; lng: number };
    };
    userAgent?: string;
  };

  // Review
  reviewRequired: boolean;
  reviewed: boolean;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewDecision?: 'approve' | 'reject';
  reviewNotes?: string;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  category:
    | 'transaction'
    | 'account'
    | 'payment'
    | 'behavioral'
    | 'device'
    | 'location'
    | 'velocity';

  // Rule definition
  conditions: {
    field: string;
    operator:
      | 'equals'
      | 'not_equals'
      | 'greater_than'
      | 'less_than'
      | 'contains'
      | 'in'
      | 'not_in'
      | 'matches_pattern';
    value: any;
    timeWindow?: number; // minutes
  }[];

  // Scoring
  riskScore: number; // 0-100
  weight: number; // multiplier

  // Actions
  actions: {
    type: 'flag' | 'review' | 'challenge' | 'block' | 'notify';
    config?: Record<string, any>;
  }[];

  // Status
  enabled: boolean;
  priority: number;

  // Statistics
  stats: {
    totalMatches: number;
    truePositives: number;
    falsePositives: number;
    accuracy: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFraud {
  transactionId: string;

  // Transaction details
  amount: number;
  currency: string;
  paymentMethod: string;

  // Parties
  buyer: {
    id: string;
    accountAge: number; // days
    totalOrders: number;
    totalSpent: number;
    riskScore: number;
  };

  seller?: {
    id: string;
    accountAge: number;
    totalSales: number;
    rating: number;
    riskScore: number;
  };

  // Fraud signals
  signals: {
    // Amount signals
    unusualAmount: boolean;
    amountDeviation: number; // percentage from user's average

    // Velocity signals
    transactionsInLastHour: number;
    transactionsInLastDay: number;
    totalAmountInLastDay: number;

    // Payment signals
    newPaymentMethod: boolean;
    paymentMethodMismatch: boolean;
    billingAddressMismatch: boolean;

    // Device signals
    newDevice: boolean;
    deviceFingerprint?: string;
    multipleAccounts: boolean;

    // Location signals
    locationChange: boolean;
    distanceFromLastTransaction?: number; // km
    highRiskCountry: boolean;
    vpnDetected: boolean;

    // Behavioral signals
    unusualTimeOfDay: boolean;
    rapidClicking: boolean;
    suspiciousPatterns: string[];
  };

  // Risk assessment
  riskFactors: {
    factor: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
  }[];
}

export interface AccountFraud {
  accountId: string;
  accountType: 'customer' | 'artisan' | 'vendor';

  // Account details
  createdAt: Date;
  accountAge: number; // days

  // Verification status
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;

  // Fraud signals
  signals: {
    // Registration signals
    disposableEmail: boolean;
    suspiciousEmailPattern: boolean;
    phoneNumberRisk: number; // 0-1

    // Identity signals
    identityTheftRisk: number; // 0-1
    syntheticIdentity: boolean;
    duplicateIdentity: boolean;

    // Behavioral signals
    rapidAccountCreation: boolean;
    multipleAccountsFromIP: number;
    multipleAccountsFromDevice: number;

    // Activity signals
    unusualActivityPattern: boolean;
    dormantThenActive: boolean;
    bulkActions: boolean;

    // Reputation signals
    chargebackHistory: number;
    disputeHistory: number;
    negativeReviews: number;
    reportedByUsers: number;
  };

  // Risk score
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  // Trust score
  trustScore: number; // 0-100
  trustFactors: {
    factor: string;
    weight: number;
    value: number;
  }[];
}

export interface PaymentFraud {
  paymentId: string;

  // Payment details
  amount: number;
  currency: string;
  method: 'card' | 'bank_transfer' | 'wallet' | 'upi' | 'netbanking';

  // Card details (if applicable)
  card?: {
    bin: string; // First 6 digits
    last4: string;
    brand: string;
    country: string;
    cardType: 'credit' | 'debit' | 'prepaid';

    // Fraud signals
    stolenCard: boolean;
    cardTestingDetected: boolean;
    binRisk: number; // 0-1
    velocityExceeded: boolean;
  };

  // 3DS verification
  threeDSecure?: {
    enrolled: boolean;
    authenticated: boolean;
    version: string;
    eci: string;
    cavv?: string;
  };

  // AVS check
  avsCheck?: {
    addressMatch: boolean;
    postalCodeMatch: boolean;
    result: string;
  };

  // CVV check
  cvvCheck?: {
    provided: boolean;
    match: boolean;
    result: string;
  };

  // Gateway response
  gatewayResponse?: {
    approved: boolean;
    responseCode: string;
    message: string;
    fraudScore?: number;
  };

  // Fraud assessment
  fraudProbability: number; // 0-1
  fraudReasons: string[];
}

export interface BotDetection {
  sessionId: string;

  // Detection signals
  signals: {
    // Behavioral signals
    mouseMovement: {
      natural: boolean;
      entropy: number;
      pattern: string;
    };

    keyboardInput: {
      natural: boolean;
      timingVariance: number;
      copypaste: boolean;
    };

    // Browser signals
    browserFingerprint: string;
    headlessBrowser: boolean;
    automationDetected: boolean;
    webDriverDetected: boolean;

    // Network signals
    ipReputation: number; // 0-1
    datacenterIP: boolean;
    torNode: boolean;
    proxy: boolean;
    vpn: boolean;

    // Request signals
    requestRate: number; // requests per minute
    honeypotTriggered: boolean;
    javascriptDisabled: boolean;
    cookiesDisabled: boolean;

    // Timing signals
    pageLoadSpeed: number;
    actionSpeed: number;
    suspiciouslyFast: boolean;
  };

  // Bot score
  botScore: number; // 0-1, higher = more likely bot
  botType?: 'scraper' | 'account_takeover' | 'credential_stuffing' | 'spam' | 'ddos' | 'unknown';

  // Decision
  isBot: boolean;
  confidence: number; // 0-1

  // Captcha
  captchaRequired: boolean;
  captchaSolved: boolean;
  captchaScore?: number;
}

export interface FraudPattern {
  id: string;
  name: string;
  description: string;

  // Pattern type
  type:
    | 'account_takeover'
    | 'payment_fraud'
    | 'friendly_fraud'
    | 'refund_abuse'
    | 'promo_abuse'
    | 'identity_theft'
    | 'synthetic_identity'
    | 'card_testing'
    | 'triangulation_fraud';

  // Pattern characteristics
  characteristics: {
    timeWindow: number; // minutes
    minimumOccurrences: number;
    indicators: string[];
  };

  // Detection
  detectionMethod: 'rule_based' | 'ml_based' | 'anomaly_detection' | 'graph_analysis';

  // Instances
  instances: {
    detectedAt: Date;
    entities: string[];
    confidence: number;
    status: 'investigating' | 'confirmed' | 'false_positive';
  }[];

  // Statistics
  totalDetections: number;
  confirmedCases: number;
  falsePositives: number;

  // Impact
  estimatedLoss: number;
  preventedLoss: number;
}

export interface FraudAlert {
  id: string;
  timestamp: Date;

  // Alert details
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  title: string;
  description: string;

  // Entity
  entityType: string;
  entityId: string;

  // Evidence
  evidence: {
    type: string;
    description: string;
    data: any;
  }[];

  // Status
  status: 'new' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';

  // Assignment
  assignedTo?: string;
  investigatedBy?: string;

  // Resolution
  resolvedAt?: Date;
  resolution?: {
    action: string;
    notes: string;
    preventiveMeasures?: string[];
  };

  // Actions taken
  actionsTaken: {
    timestamp: Date;
    action: string;
    performedBy: string;
    result: string;
  }[];
}

export interface RiskProfile {
  userId: string;

  // Overall risk
  overallRiskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  // Risk factors
  factors: {
    category: 'account' | 'transaction' | 'behavior' | 'reputation' | 'device' | 'location';
    factor: string;
    score: number;
    weight: number;
    description: string;
  }[];

  // Historical data
  history: {
    totalTransactions: number;
    totalAmount: number;
    averageTransactionAmount: number;
    fraudAttempts: number;
    chargebacks: number;
    disputes: number;
  };

  // Behavioral patterns
  patterns: {
    normalTransactionRange: { min: number; max: number };
    typicalTransactionTimes: number[]; // hours
    preferredPaymentMethods: string[];
    commonLocations: string[];
    averageSessionDuration: number;
  };

  // Trust indicators
  trustIndicators: {
    accountAge: number;
    verificationLevel: number;
    positiveReviews: number;
    successfulTransactions: number;
    communityReputation: number;
  };

  // Velocity metrics
  velocity: {
    transactionsLast24h: number;
    amountLast24h: number;
    newDevicesLast7d: number;
    locationChangesLast30d: number;
  };

  lastUpdated: Date;
}

export interface FraudInvestigation {
  id: string;
  caseNumber: string;

  // Case details
  title: string;
  description: string;
  category: 'transaction_fraud' | 'account_fraud' | 'payment_fraud' | 'identity_theft' | 'other';

  // Status
  status: 'open' | 'investigating' | 'pending_info' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // Involved entities
  entities: {
    type: string;
    id: string;
    role: 'suspect' | 'victim' | 'witness' | 'related';
  }[];

  // Timeline
  createdAt: Date;
  assignedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;

  // Assignment
  assignedTo?: string;
  team?: string;

  // Evidence
  evidence: {
    id: string;
    type: 'document' | 'screenshot' | 'log' | 'communication' | 'transaction';
    description: string;
    url?: string;
    metadata?: Record<string, any>;
    collectedAt: Date;
  }[];

  // Actions
  actions: {
    timestamp: Date;
    action: string;
    performedBy: string;
    notes: string;
  }[];

  // Outcome
  outcome?: {
    decision: 'fraud_confirmed' | 'no_fraud' | 'inconclusive';
    amountRecovered?: number;
    accountsBlocked?: string[];
    notes: string;
  };
}

export class FraudDetectionSystem {
  private fraudChecks: Map<string, FraudCheck>;
  private fraudRules: Map<string, FraudRule>;
  private fraudAlerts: Map<string, FraudAlert>;
  private riskProfiles: Map<string, RiskProfile>;
  private fraudPatterns: Map<string, FraudPattern>;
  private investigations: Map<string, FraudInvestigation>;
  private blocklist: Set<string>;
  private whitelist: Set<string>;

  constructor() {
    this.fraudChecks = new Map();
    this.fraudRules = new Map();
    this.fraudAlerts = new Map();
    this.riskProfiles = new Map();
    this.fraudPatterns = new Map();
    this.investigations = new Map();
    this.blocklist = new Set();
    this.whitelist = new Set();

    // Initialize default rules and patterns
    this.initializeDefaults();
  }

  /**
   * Initialize default fraud rules and patterns
   */
  private initializeDefaults(): void {
    // Default fraud rules
    const defaultRules: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'High Value Transaction',
        description: 'Flag transactions above ₹50,000',
        category: 'transaction',
        conditions: [{ field: 'amount', operator: 'greater_than', value: 50000 }],
        riskScore: 50,
        weight: 1.0,
        actions: [{ type: 'review' }, { type: 'notify', config: { channels: ['email', 'slack'] } }],
        enabled: true,
        priority: 5,
        stats: {
          totalMatches: 245,
          truePositives: 12,
          falsePositives: 233,
          accuracy: 0.95,
        },
      },
      {
        name: 'Multiple Failed Payments',
        description: 'Detect multiple failed payment attempts in short time',
        category: 'payment',
        conditions: [
          { field: 'failed_payments', operator: 'greater_than', value: 3, timeWindow: 60 },
        ],
        riskScore: 70,
        weight: 1.5,
        actions: [{ type: 'challenge' }, { type: 'block' }],
        enabled: true,
        priority: 8,
        stats: {
          totalMatches: 89,
          truePositives: 76,
          falsePositives: 13,
          accuracy: 0.85,
        },
      },
      {
        name: 'New Account High Spend',
        description: 'New account making large purchase',
        category: 'account',
        conditions: [
          { field: 'account_age_days', operator: 'less_than', value: 7 },
          { field: 'transaction_amount', operator: 'greater_than', value: 10000 },
        ],
        riskScore: 80,
        weight: 2.0,
        actions: [{ type: 'review' }, { type: 'challenge' }],
        enabled: true,
        priority: 9,
        stats: {
          totalMatches: 156,
          truePositives: 42,
          falsePositives: 114,
          accuracy: 0.73,
        },
      },
      {
        name: 'Velocity Check - Transactions',
        description: 'Too many transactions in short period',
        category: 'velocity',
        conditions: [
          { field: 'transactions_count', operator: 'greater_than', value: 10, timeWindow: 60 },
        ],
        riskScore: 60,
        weight: 1.2,
        actions: [{ type: 'flag' }, { type: 'review' }],
        enabled: true,
        priority: 7,
        stats: {
          totalMatches: 67,
          truePositives: 45,
          falsePositives: 22,
          accuracy: 0.67,
        },
      },
      {
        name: 'Location Anomaly',
        description: 'Transaction from unusual location',
        category: 'location',
        conditions: [
          { field: 'location_distance_km', operator: 'greater_than', value: 1000 },
          { field: 'time_since_last_transaction_minutes', operator: 'less_than', value: 60 },
        ],
        riskScore: 75,
        weight: 1.8,
        actions: [{ type: 'challenge' }, { type: 'notify' }],
        enabled: true,
        priority: 8,
        stats: {
          totalMatches: 234,
          truePositives: 28,
          falsePositives: 206,
          accuracy: 0.88,
        },
      },
      {
        name: 'High Risk Country',
        description: 'Transaction from high-risk country',
        category: 'location',
        conditions: [{ field: 'country_risk_score', operator: 'greater_than', value: 0.7 }],
        riskScore: 65,
        weight: 1.3,
        actions: [{ type: 'review' }],
        enabled: true,
        priority: 6,
        stats: {
          totalMatches: 445,
          truePositives: 89,
          falsePositives: 356,
          accuracy: 0.8,
        },
      },
      {
        name: 'Device Fingerprint Mismatch',
        description: 'Different device for same account',
        category: 'device',
        conditions: [
          { field: 'new_device', operator: 'equals', value: true },
          { field: 'account_age_days', operator: 'less_than', value: 30 },
        ],
        riskScore: 55,
        weight: 1.1,
        actions: [{ type: 'challenge' }],
        enabled: true,
        priority: 5,
        stats: {
          totalMatches: 892,
          truePositives: 67,
          falsePositives: 825,
          accuracy: 0.92,
        },
      },
    ];

    defaultRules.forEach((rule, index) => {
      const id = `rule-${Date.now()}-${index}`;
      this.fraudRules.set(id, {
        ...rule,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Default fraud patterns
    const defaultPatterns: Omit<FraudPattern, 'id'>[] = [
      {
        name: 'Card Testing Pattern',
        description: 'Multiple small transactions to test stolen cards',
        type: 'card_testing',
        characteristics: {
          timeWindow: 30,
          minimumOccurrences: 5,
          indicators: ['small_amount', 'multiple_cards', 'rapid_succession'],
        },
        detectionMethod: 'rule_based',
        instances: [],
        totalDetections: 0,
        confirmedCases: 0,
        falsePositives: 0,
        estimatedLoss: 0,
        preventedLoss: 0,
      },
      {
        name: 'Account Takeover Pattern',
        description: 'Suspicious activity after account access',
        type: 'account_takeover',
        characteristics: {
          timeWindow: 60,
          minimumOccurrences: 1,
          indicators: ['password_change', 'new_device', 'unusual_location', 'large_purchase'],
        },
        detectionMethod: 'ml_based',
        instances: [],
        totalDetections: 0,
        confirmedCases: 0,
        falsePositives: 0,
        estimatedLoss: 0,
        preventedLoss: 0,
      },
      {
        name: 'Refund Abuse Pattern',
        description: 'Pattern of ordering and requesting refunds',
        type: 'refund_abuse',
        characteristics: {
          timeWindow: 10080, // 7 days
          minimumOccurrences: 3,
          indicators: ['high_refund_rate', 'similar_products', 'same_reason'],
        },
        detectionMethod: 'anomaly_detection',
        instances: [],
        totalDetections: 0,
        confirmedCases: 0,
        falsePositives: 0,
        estimatedLoss: 0,
        preventedLoss: 0,
      },
    ];

    defaultPatterns.forEach((pattern, index) => {
      const id = `pattern-${Date.now()}-${index}`;
      this.fraudPatterns.set(id, { ...pattern, id });
    });
  }

  /**
   * Check transaction for fraud
   */
  async checkTransaction(params: {
    transactionId: string;
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    ipAddress: string;
    deviceId?: string;
    location?: { country: string; city: string };
    context?: Record<string, any>;
  }): Promise<FraudCheck> {
    const fraudIndicators: FraudCheck['fraudIndicators'] = [];
    let totalRiskScore = 0;
    const rulesTriggered: FraudCheck['rulesTriggered'] = [];

    // Get user risk profile
    const userProfile = await this.getUserRiskProfile(params.userId);

    // Check against fraud rules
    for (const rule of this.fraudRules.values()) {
      if (!rule.enabled) continue;

      const matched = this.evaluateRule(rule, {
        ...params,
        userProfile,
      });

      rulesTriggered.push({
        ruleId: rule.id,
        ruleName: rule.name,
        matched,
        score: matched ? rule.riskScore * rule.weight : 0,
      });

      if (matched) {
        totalRiskScore += rule.riskScore * rule.weight;

        fraudIndicators.push({
          indicator: rule.name,
          severity: rule.riskScore > 70 ? 'high' : rule.riskScore > 50 ? 'medium' : 'low',
          confidence: 0.8,
          description: rule.description,
          weight: rule.weight,
        });
      }
    }

    // Normalize risk score
    const normalizedScore = Math.min(100, totalRiskScore / 5);

    // Determine risk level
    let riskLevel: FraudCheck['riskLevel'];
    if (normalizedScore >= 80) riskLevel = 'critical';
    else if (normalizedScore >= 60) riskLevel = 'high';
    else if (normalizedScore >= 40) riskLevel = 'medium';
    else riskLevel = 'low';

    // Make decision
    let decision: FraudCheck['decision'];
    if (normalizedScore >= 80) decision = 'block';
    else if (normalizedScore >= 60) decision = 'review';
    else if (normalizedScore >= 40) decision = 'challenge';
    else decision = 'approve';

    const fraudCheck: FraudCheck = {
      id: `check-${Date.now()}`,
      timestamp: new Date(),
      entityType: 'transaction',
      entityId: params.transactionId,
      riskScore: normalizedScore,
      riskLevel,
      fraudIndicators,
      decision,
      rulesTriggered,
      recommendation: {
        action:
          decision === 'approve'
            ? 'Process transaction'
            : decision === 'challenge'
              ? 'Request additional verification'
              : decision === 'review'
                ? 'Hold for manual review'
                : 'Block transaction',
        reason:
          fraudIndicators.length > 0
            ? `${fraudIndicators.length} fraud indicators detected`
            : 'Transaction appears legitimate',
        alternativeActions:
          decision === 'block' ? ['Contact customer', 'Request verification'] : undefined,
      },
      context: {
        userId: params.userId,
        ipAddress: params.ipAddress,
        deviceId: params.deviceId,
        location: params.location,
      },
      reviewRequired: decision === 'review' || decision === 'block',
      reviewed: false,
    };

    this.fraudChecks.set(fraudCheck.id, fraudCheck);

    // Create alert if high risk
    if (riskLevel === 'high' || riskLevel === 'critical') {
      await this.createAlert({
        severity: riskLevel === 'critical' ? 'critical' : 'high',
        type: 'transaction_fraud',
        title: `High Risk Transaction Detected`,
        description: `Transaction ${params.transactionId} flagged with risk score ${normalizedScore.toFixed(1)}`,
        entityType: 'transaction',
        entityId: params.transactionId,
        evidence: fraudIndicators.map((fi) => ({
          type: 'fraud_indicator',
          description: fi.description,
          data: fi,
        })),
      });
    }

    return fraudCheck;
  }

  /**
   * Evaluate fraud rule
   */
  private evaluateRule(rule: FraudRule, data: any): boolean {
    return rule.conditions.every((condition) => {
      const value = this.getNestedValue(data, condition.field);

      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not_equals':
          return value !== condition.value;
        case 'greater_than':
          return value > condition.value;
        case 'less_than':
          return value < condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(value);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(value);
        default:
          return false;
      }
    });
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
  }

  /**
   * Detect bots
   */
  async detectBot(params: {
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    behaviorSignals?: Partial<BotDetection['signals']>;
  }): Promise<BotDetection> {
    let botScore = 0;
    const signals: BotDetection['signals'] = {
      mouseMovement: params.behaviorSignals?.mouseMovement || {
        natural: true,
        entropy: 0.8,
        pattern: 'normal',
      },
      keyboardInput: params.behaviorSignals?.keyboardInput || {
        natural: true,
        timingVariance: 0.5,
        copypaste: false,
      },
      browserFingerprint: params.sessionId,
      headlessBrowser: false,
      automationDetected: false,
      webDriverDetected: false,
      ipReputation: 0.9,
      datacenterIP: false,
      torNode: false,
      proxy: false,
      vpn: false,
      requestRate: 5,
      honeypotTriggered: false,
      javascriptDisabled: false,
      cookiesDisabled: false,
      pageLoadSpeed: 1200,
      actionSpeed: 500,
      suspiciouslyFast: false,
    };

    // Calculate bot score
    if (!signals.mouseMovement.natural) botScore += 0.3;
    if (!signals.keyboardInput.natural) botScore += 0.3;
    if (signals.headlessBrowser) botScore += 0.4;
    if (signals.automationDetected) botScore += 0.5;
    if (signals.webDriverDetected) botScore += 0.5;
    if (signals.datacenterIP) botScore += 0.2;
    if (signals.torNode) botScore += 0.3;
    if (signals.requestRate > 30) botScore += 0.4;
    if (signals.honeypotTriggered) botScore += 0.8;
    if (signals.suspiciouslyFast) botScore += 0.3;

    const isBot = botScore > 0.6;

    return {
      sessionId: params.sessionId,
      signals,
      botScore: Math.min(1, botScore),
      botType: isBot ? 'scraper' : undefined,
      isBot,
      confidence: Math.min(1, botScore * 1.2),
      captchaRequired: botScore > 0.4,
      captchaSolved: false,
    };
  }

  /**
   * Get user risk profile
   */
  async getUserRiskProfile(userId: string): Promise<RiskProfile> {
    let profile = this.riskProfiles.get(userId);

    if (!profile) {
      profile = {
        userId,
        overallRiskScore: 30,
        riskLevel: 'low',
        factors: [],
        history: {
          totalTransactions: 0,
          totalAmount: 0,
          averageTransactionAmount: 0,
          fraudAttempts: 0,
          chargebacks: 0,
          disputes: 0,
        },
        patterns: {
          normalTransactionRange: { min: 0, max: 5000 },
          typicalTransactionTimes: [9, 10, 11, 14, 15, 16, 19, 20],
          preferredPaymentMethods: ['card', 'upi'],
          commonLocations: ['Mumbai', 'Delhi'],
          averageSessionDuration: 900,
        },
        trustIndicators: {
          accountAge: 90,
          verificationLevel: 3,
          positiveReviews: 15,
          successfulTransactions: 45,
          communityReputation: 85,
        },
        velocity: {
          transactionsLast24h: 0,
          amountLast24h: 0,
          newDevicesLast7d: 0,
          locationChangesLast30d: 0,
        },
        lastUpdated: new Date(),
      };

      this.riskProfiles.set(userId, profile);
    }

    return profile;
  }

  /**
   * Create fraud alert
   */
  async createAlert(params: {
    severity: FraudAlert['severity'];
    type: string;
    title: string;
    description: string;
    entityType: string;
    entityId: string;
    evidence: FraudAlert['evidence'];
  }): Promise<FraudAlert> {
    const alert: FraudAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
      severity: params.severity,
      type: params.type,
      title: params.title,
      description: params.description,
      entityType: params.entityType,
      entityId: params.entityId,
      evidence: params.evidence,
      status: 'new',
      actionsTaken: [],
    };

    this.fraudAlerts.set(alert.id, alert);
    return alert;
  }

  /**
   * Create fraud investigation
   */
  async createInvestigation(params: {
    title: string;
    description: string;
    category: FraudInvestigation['category'];
    priority: FraudInvestigation['priority'];
    entities: FraudInvestigation['entities'];
  }): Promise<FraudInvestigation> {
    const investigation: FraudInvestigation = {
      id: `inv-${Date.now()}`,
      caseNumber: `CASE-${Date.now()}`,
      title: params.title,
      description: params.description,
      category: params.category,
      status: 'open',
      priority: params.priority,
      entities: params.entities,
      createdAt: new Date(),
      evidence: [],
      actions: [],
    };

    this.investigations.set(investigation.id, investigation);
    return investigation;
  }

  /**
   * Block entity
   */
  async blockEntity(entityId: string, reason: string): Promise<void> {
    this.blocklist.add(entityId);

    await this.createAlert({
      severity: 'critical',
      type: 'entity_blocked',
      title: `Entity Blocked: ${entityId}`,
      description: `Entity has been added to blocklist. Reason: ${reason}`,
      entityType: 'user',
      entityId,
      evidence: [
        {
          type: 'document',
          description: `Block reason: ${reason}`,
          data: { reason },
        },
      ],
    });
  }

  /**
   * Whitelist entity
   */
  async whitelistEntity(entityId: string): Promise<void> {
    this.whitelist.add(entityId);
    this.blocklist.delete(entityId);
  }

  /**
   * Check if entity is blocked
   */
  isBlocked(entityId: string): boolean {
    return this.blocklist.has(entityId);
  }

  /**
   * Check if entity is whitelisted
   */
  isWhitelisted(entityId: string): boolean {
    return this.whitelist.has(entityId);
  }

  /**
   * Get fraud checks
   */
  async getFraudChecks(params: {
    entityType?: string;
    riskLevel?: FraudCheck['riskLevel'];
    decision?: FraudCheck['decision'];
    reviewRequired?: boolean;
    limit?: number;
  }): Promise<FraudCheck[]> {
    let checks = Array.from(this.fraudChecks.values());

    if (params.entityType) {
      checks = checks.filter((c) => c.entityType === params.entityType);
    }

    if (params.riskLevel) {
      checks = checks.filter((c) => c.riskLevel === params.riskLevel);
    }

    if (params.decision) {
      checks = checks.filter((c) => c.decision === params.decision);
    }

    if (params.reviewRequired !== undefined) {
      checks = checks.filter((c) => c.reviewRequired === params.reviewRequired);
    }

    checks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (params.limit) {
      checks = checks.slice(0, params.limit);
    }

    return checks;
  }

  /**
   * Get fraud alerts
   */
  async getFraudAlerts(params: {
    severity?: FraudAlert['severity'];
    status?: FraudAlert['status'];
    limit?: number;
  }): Promise<FraudAlert[]> {
    let alerts = Array.from(this.fraudAlerts.values());

    if (params.severity) {
      alerts = alerts.filter((a) => a.severity === params.severity);
    }

    if (params.status) {
      alerts = alerts.filter((a) => a.status === params.status);
    }

    alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (params.limit) {
      alerts = alerts.slice(0, params.limit);
    }

    return alerts;
  }

  /**
   * Get fraud rules
   */
  async getFraudRules(enabled?: boolean): Promise<FraudRule[]> {
    let rules = Array.from(this.fraudRules.values());

    if (enabled !== undefined) {
      rules = rules.filter((r) => r.enabled === enabled);
    }

    return rules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get investigations
   */
  async getInvestigations(status?: FraudInvestigation['status']): Promise<FraudInvestigation[]> {
    let investigations = Array.from(this.investigations.values());

    if (status) {
      investigations = investigations.filter((i) => i.status === status);
    }

    return investigations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Export singleton instance
export const fraudDetectionSystem = new FraudDetectionSystem();
