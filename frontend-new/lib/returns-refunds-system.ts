/**
 * Returns & Refunds System
 *
 * Comprehensive returns and refunds management:
 * - Return request processing
 * - Return merchandise authorization (RMA)
 * - Refund processing
 * - Exchange management
 * - Return shipping
 * - Restocking and inspection
 * - Return analytics
 */

export interface ReturnRequest {
  id: string;
  rmaNumber: string; // Return Merchandise Authorization

  // Order details
  orderId: string;
  customerId: string;
  customerName: string;

  // Items to return
  items: {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    reason:
      | 'defective'
      | 'damaged'
      | 'wrong_item'
      | 'not_as_described'
      | 'changed_mind'
      | 'size_issue'
      | 'quality_issue'
      | 'other';
    reasonDescription?: string;
    images?: string[];
  }[];

  // Return type
  returnType: 'refund' | 'exchange' | 'store_credit';

  // Exchange details (if applicable)
  exchange?: {
    newProductId: string;
    newProductName: string;
    priceDifference: number;
  };

  // Shipping
  returnShipping: {
    method: 'customer_ships' | 'pickup_arranged' | 'prepaid_label';
    carrier?: string;
    trackingNumber?: string;
    shippingCost: number;
    refundShipping: boolean; // Should shipping cost be refunded?
  };

  // Status
  status:
    | 'pending_approval'
    | 'approved'
    | 'rejected'
    | 'shipping'
    | 'received'
    | 'inspecting'
    | 'completed'
    | 'cancelled';

  // Workflow
  workflow: {
    requestedAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    rejectedBy?: string;
    rejectedAt?: Date;
    rejectionReason?: string;
    shippedAt?: Date;
    receivedAt?: Date;
    inspectedBy?: string;
    inspectedAt?: Date;
    completedAt?: Date;
  };

  // Policy compliance
  policy: {
    withinReturnWindow: boolean;
    returnWindowDays: number;
    restockingFeeApplicable: boolean;
    restockingFeePercentage: number;
  };

  // Customer contact
  customerEmail: string;
  customerPhone?: string;

  // Notes
  notes?: string;
  internalNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnInspection {
  id: string;
  returnRequestId: string;
  rmaNumber: string;

  // Inspector
  inspectedBy: string;
  inspectionDate: Date;

  // Items inspected
  items: {
    productId: string;
    productName: string;
    quantityReceived: number;
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor' | 'damaged' | 'defective';
    conditionNotes?: string;
    canRestock: boolean;
    restockLocation?: string;
    images?: string[];
  }[];

  // Overall assessment
  assessment: {
    allItemsReceived: boolean;
    conditionAsExpected: boolean;
    approvedForRefund: boolean;
    approvedForExchange: boolean;
    requiresManualReview: boolean;
    reviewReason?: string;
  };

  // Actions
  actions: {
    refundAmount: number;
    restockingFee: number;
    shippingRefund: number;
    totalRefund: number;
    restockQuantity: number;
    disposeQuantity: number;
  };

  // Documentation
  photos?: string[];
  notes?: string;

  createdAt: Date;
}

export interface Refund {
  id: string;
  returnRequestId: string;
  orderId: string;
  customerId: string;

  // Refund details
  refund: {
    subtotal: number;
    shippingRefund: number;
    restockingFee: number;
    adjustments: number;
    totalAmount: number;
    currency: string;
  };

  // Payment method
  paymentMethod: {
    type: 'original' | 'store_credit' | 'bank_transfer' | 'check';
    originalPaymentMethod?: string;
    accountDetails?: string;
  };

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

  // Processing
  processing: {
    initiatedBy: string;
    initiatedAt: Date;
    processedAt?: Date;
    failedAt?: Date;
    failureReason?: string;
    transactionId?: string;
  };

  // Notifications
  customerNotified: boolean;
  notificationSentAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface Exchange {
  id: string;
  returnRequestId: string;
  originalOrderId: string;
  customerId: string;

  // Original items
  returnedItems: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];

  // New items
  exchangeItems: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];

  // Price difference
  priceDifference: number;
  paymentRequired: boolean;
  refundDue: boolean;

  // New order
  newOrderId?: string;

  // Status
  status: 'pending' | 'payment_required' | 'processing' | 'shipped' | 'completed' | 'cancelled';

  // Workflow
  workflow: {
    createdAt: Date;
    paymentReceivedAt?: Date;
    refundProcessedAt?: Date;
    shippedAt?: Date;
    completedAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnPolicy {
  id: string;
  name: string;

  // Timeframe
  returnWindow: number; // days from delivery

  // Eligible conditions
  eligibleConditions: {
    allowDefective: boolean;
    allowChangedMind: boolean;
    allowWrongItem: boolean;
    requiresOriginalPackaging: boolean;
    requiresUnusedCondition: boolean;
    requiresTags: boolean;
  };

  // Costs
  costs: {
    restockingFeePercentage: number;
    customerPaysShipping: boolean;
    providePrepaidLabel: boolean;
    shippingFeeRefundable: boolean;
  };

  // Categories
  applicableCategories?: string[];
  excludedCategories?: string[];

  // Special items
  nonReturnable?: string[]; // product IDs or categories

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalReturns: number;
    totalReturnValue: number;
    returnRate: number; // percentage of orders
    averageReturnValue: number;
    totalRefunded: number;
  };

  byReason: {
    reason: ReturnRequest['items'][0]['reason'];
    count: number;
    percentage: number;
    value: number;
  }[];

  byProduct: {
    productId: string;
    productName: string;
    returnCount: number;
    returnRate: number; // percentage
    primaryReason: string;
  }[];

  byStatus: {
    status: ReturnRequest['status'];
    count: number;
    percentage: number;
  }[];

  processing: {
    averageApprovalTime: number; // hours
    averageInspectionTime: number; // hours
    averageRefundTime: number; // hours
    averageTotalProcessingTime: number; // hours
  };

  financial: {
    totalRefunds: number;
    totalRestockingFees: number;
    totalShippingCosts: number;
    netReturnCost: number;
  };

  restocking: {
    itemsRestocked: number;
    itemsDisposed: number;
    restockingRate: number; // percentage
  };
}

export class ReturnsRefundsSystem {
  private returnRequests: Map<string, ReturnRequest>;
  private inspections: Map<string, ReturnInspection>;
  private refunds: Map<string, Refund>;
  private exchanges: Map<string, Exchange>;
  private policies: Map<string, ReturnPolicy>;

  constructor() {
    this.returnRequests = new Map();
    this.inspections = new Map();
    this.refunds = new Map();
    this.exchanges = new Map();
    this.policies = new Map();
    this.initializeDefaultPolicy();
  }

  /**
   * Initialize default return policy
   */
  private initializeDefaultPolicy() {
    const policy: ReturnPolicy = {
      id: 'policy-standard',
      name: 'Standard Return Policy',
      returnWindow: 30,
      eligibleConditions: {
        allowDefective: true,
        allowChangedMind: true,
        allowWrongItem: true,
        requiresOriginalPackaging: true,
        requiresUnusedCondition: false,
        requiresTags: false,
      },
      costs: {
        restockingFeePercentage: 10,
        customerPaysShipping: false,
        providePrepaidLabel: true,
        shippingFeeRefundable: true,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.policies.set(policy.id, policy);
  }

  /**
   * Create return request
   */
  async createReturnRequest(params: {
    orderId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: Omit<ReturnRequest['items'][0], 'id'>[];
    returnType: ReturnRequest['returnType'];
    exchange?: ReturnRequest['exchange'];
    notes?: string;
  }): Promise<ReturnRequest> {
    const policy = this.policies.get('policy-standard')!;
    const rmaNumber = `RMA-${Date.now()}`;

    // Calculate if within return window (mock - would check actual order date)
    const withinReturnWindow = true; // Mock
    const returnWindowDays = policy.returnWindow;

    const request: ReturnRequest = {
      id: `return-${Date.now()}`,
      rmaNumber,
      orderId: params.orderId,
      customerId: params.customerId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      items: params.items.map((item, index) => ({
        ...item,
        id: `item-${index + 1}`,
      })),
      returnType: params.returnType,
      exchange: params.exchange,
      returnShipping: {
        method: policy.costs.providePrepaidLabel ? 'prepaid_label' : 'customer_ships',
        shippingCost: 0,
        refundShipping: policy.costs.shippingFeeRefundable,
      },
      status: 'pending_approval',
      workflow: {
        requestedAt: new Date(),
      },
      policy: {
        withinReturnWindow,
        returnWindowDays,
        restockingFeeApplicable: policy.costs.restockingFeePercentage > 0,
        restockingFeePercentage: policy.costs.restockingFeePercentage,
      },
      notes: params.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.returnRequests.set(request.id, request);

    // Auto-approve if within policy
    if (withinReturnWindow && this.isEligibleForReturn(request, policy)) {
      await this.approveReturn(request.id, 'system');
    }

    return request;
  }

  /**
   * Check if return is eligible
   */
  private isEligibleForReturn(request: ReturnRequest, policy: ReturnPolicy): boolean {
    // Check if all reasons are allowed
    return request.items.every((item) => {
      if (item.reason === 'defective' && policy.eligibleConditions.allowDefective) return true;
      if (item.reason === 'wrong_item' && policy.eligibleConditions.allowWrongItem) return true;
      if (item.reason === 'changed_mind' && policy.eligibleConditions.allowChangedMind) return true;
      return false;
    });
  }

  /**
   * Approve return
   */
  async approveReturn(requestId: string, approvedBy: string): Promise<void> {
    const request = this.returnRequests.get(requestId);
    if (!request) return;

    request.status = 'approved';
    request.workflow.approvedBy = approvedBy;
    request.workflow.approvedAt = new Date();
    request.updatedAt = new Date();

    // Generate prepaid shipping label if applicable
    if (request.returnShipping.method === 'prepaid_label') {
      request.returnShipping.trackingNumber = `TRK-RET-${Date.now()}`;
      request.returnShipping.carrier = 'Standard Carrier';
    }
  }

  /**
   * Reject return
   */
  async rejectReturn(requestId: string, rejectedBy: string, reason: string): Promise<void> {
    const request = this.returnRequests.get(requestId);
    if (!request) return;

    request.status = 'rejected';
    request.workflow.rejectedBy = rejectedBy;
    request.workflow.rejectedAt = new Date();
    request.workflow.rejectionReason = reason;
    request.updatedAt = new Date();
  }

  /**
   * Mark return as shipped
   */
  async markReturnShipped(requestId: string, trackingNumber?: string): Promise<void> {
    const request = this.returnRequests.get(requestId);
    if (!request) return;

    request.status = 'shipping';
    request.workflow.shippedAt = new Date();

    if (trackingNumber) {
      request.returnShipping.trackingNumber = trackingNumber;
    }

    request.updatedAt = new Date();
  }

  /**
   * Receive return
   */
  async receiveReturn(requestId: string): Promise<void> {
    const request = this.returnRequests.get(requestId);
    if (!request) return;

    request.status = 'received';
    request.workflow.receivedAt = new Date();
    request.updatedAt = new Date();

    // Move to inspection
    request.status = 'inspecting';
  }

  /**
   * Inspect returned items
   */
  async inspectReturn(params: {
    returnRequestId: string;
    inspectedBy: string;
    items: ReturnInspection['items'];
    notes?: string;
    photos?: string[];
  }): Promise<ReturnInspection> {
    const request = this.returnRequests.get(params.returnRequestId);
    if (!request) {
      throw new Error('Return request not found');
    }

    // Calculate refund amount
    const subtotal = request.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const restockingFee = request.policy.restockingFeeApplicable
      ? subtotal * (request.policy.restockingFeePercentage / 100)
      : 0;
    const shippingRefund = request.returnShipping.refundShipping
      ? request.returnShipping.shippingCost
      : 0;
    const totalRefund = subtotal - restockingFee + shippingRefund;

    // Count restock vs dispose
    const restockQuantity = params.items
      .filter((i) => i.canRestock)
      .reduce((sum, i) => sum + i.quantityReceived, 0);
    const disposeQuantity = params.items
      .filter((i) => !i.canRestock)
      .reduce((sum, i) => sum + i.quantityReceived, 0);

    // Assessment
    const allItemsReceived = params.items.every((i) => i.quantityReceived > 0);
    const conditionAsExpected = params.items.every((i) =>
      ['new', 'like_new', 'good'].includes(i.condition)
    );
    const approvedForRefund = allItemsReceived && conditionAsExpected;

    const inspection: ReturnInspection = {
      id: `inspect-${Date.now()}`,
      returnRequestId: params.returnRequestId,
      rmaNumber: request.rmaNumber,
      inspectedBy: params.inspectedBy,
      inspectionDate: new Date(),
      items: params.items,
      assessment: {
        allItemsReceived,
        conditionAsExpected,
        approvedForRefund,
        approvedForExchange: request.returnType === 'exchange' && approvedForRefund,
        requiresManualReview: !approvedForRefund,
        reviewReason: !approvedForRefund ? 'Items not in expected condition' : undefined,
      },
      actions: {
        refundAmount: subtotal,
        restockingFee,
        shippingRefund,
        totalRefund: Number(totalRefund.toFixed(2)),
        restockQuantity,
        disposeQuantity,
      },
      photos: params.photos,
      notes: params.notes,
      createdAt: new Date(),
    };

    this.inspections.set(inspection.id, inspection);

    request.workflow.inspectedBy = params.inspectedBy;
    request.workflow.inspectedAt = new Date();

    // Auto-process refund if approved
    if (approvedForRefund && request.returnType === 'refund') {
      await this.processRefund(params.returnRequestId, inspection, params.inspectedBy);
    }

    // Process exchange if approved
    if (inspection.assessment.approvedForExchange && request.exchange) {
      await this.processExchange(params.returnRequestId, params.inspectedBy);
    }

    return inspection;
  }

  /**
   * Process refund
   */
  private async processRefund(
    returnRequestId: string,
    inspection: ReturnInspection,
    initiatedBy: string
  ): Promise<Refund> {
    const request = this.returnRequests.get(returnRequestId);
    if (!request) {
      throw new Error('Return request not found');
    }

    const refund: Refund = {
      id: `refund-${Date.now()}`,
      returnRequestId,
      orderId: request.orderId,
      customerId: request.customerId,
      refund: {
        subtotal: inspection.actions.refundAmount,
        shippingRefund: inspection.actions.shippingRefund,
        restockingFee: inspection.actions.restockingFee,
        adjustments: 0,
        totalAmount: inspection.actions.totalRefund,
        currency: 'INR',
      },
      paymentMethod: {
        type: request.returnType === 'store_credit' ? 'store_credit' : 'original',
      },
      status: 'processing',
      processing: {
        initiatedBy,
        initiatedAt: new Date(),
      },
      customerNotified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate refund processing
    setTimeout(() => {
      refund.status = 'completed';
      refund.processing.processedAt = new Date();
      refund.processing.transactionId = `TXN-${Date.now()}`;
      refund.customerNotified = true;
      refund.notificationSentAt = new Date();

      request.status = 'completed';
      request.workflow.completedAt = new Date();
    }, 100);

    this.refunds.set(refund.id, refund);
    return refund;
  }

  /**
   * Process exchange
   */
  private async processExchange(returnRequestId: string, initiatedBy: string): Promise<Exchange> {
    const request = this.returnRequests.get(returnRequestId);
    if (!request || !request.exchange) {
      throw new Error('Return request or exchange details not found');
    }

    const exchange: Exchange = {
      id: `exchange-${Date.now()}`,
      returnRequestId,
      originalOrderId: request.orderId,
      customerId: request.customerId,
      returnedItems: request.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      exchangeItems: [
        {
          productId: request.exchange.newProductId,
          productName: request.exchange.newProductName,
          quantity: 1,
          price: request.items[0].price + request.exchange.priceDifference,
        },
      ],
      priceDifference: request.exchange.priceDifference,
      paymentRequired: request.exchange.priceDifference > 0,
      refundDue: request.exchange.priceDifference < 0,
      status: request.exchange.priceDifference > 0 ? 'payment_required' : 'processing',
      workflow: {
        createdAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If no payment required, auto-process
    if (!exchange.paymentRequired) {
      exchange.newOrderId = `order-ex-${Date.now()}`;
      exchange.status = 'processing';
    }

    this.exchanges.set(exchange.id, exchange);
    return exchange;
  }

  /**
   * Get return analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<ReturnAnalytics> {
    const returns = Array.from(this.returnRequests.values()).filter(
      (r) => r.createdAt >= period.start && r.createdAt <= period.end
    );

    const totalReturnValue = returns.reduce(
      (sum, r) => sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0),
      0
    );

    const refunds = Array.from(this.refunds.values()).filter(
      (r) => r.createdAt >= period.start && r.createdAt <= period.end
    );

    const totalRefunded = refunds
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.refund.totalAmount, 0);

    // Return reasons
    const reasonCounts = new Map<string, { count: number; value: number }>();
    returns.forEach((r) => {
      r.items.forEach((item) => {
        const data = reasonCounts.get(item.reason) || { count: 0, value: 0 };
        data.count++;
        data.value += item.price * item.quantity;
        reasonCounts.set(item.reason, data);
      });
    });

    const byReason = Array.from(reasonCounts.entries()).map(([reason, data]) => ({
      reason: reason as ReturnRequest['items'][0]['reason'],
      count: data.count,
      percentage: (data.count / returns.length) * 100,
      value: data.value,
    }));

    // Status breakdown
    const statusCounts = new Map<ReturnRequest['status'], number>();
    returns.forEach((r) => {
      statusCounts.set(r.status, (statusCounts.get(r.status) || 0) + 1);
    });

    const byStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: (count / returns.length) * 100,
    }));

    // Processing times
    const inspections = Array.from(this.inspections.values()).filter(
      (i) => i.createdAt >= period.start && i.createdAt <= period.end
    );

    const restockingRate =
      inspections.length > 0
        ? (inspections.reduce((sum, i) => sum + i.actions.restockQuantity, 0) /
            inspections.reduce(
              (sum, i) => sum + i.actions.restockQuantity + i.actions.disposeQuantity,
              0
            )) *
          100
        : 0;

    return {
      period,
      overview: {
        totalReturns: returns.length,
        totalReturnValue: Number(totalReturnValue.toFixed(2)),
        returnRate: 3.5, // Mock - would calculate against total orders
        averageReturnValue:
          returns.length > 0 ? Number((totalReturnValue / returns.length).toFixed(2)) : 0,
        totalRefunded: Number(totalRefunded.toFixed(2)),
      },
      byReason,
      byProduct: [
        {
          productId: 'prod-1',
          productName: 'Product 1',
          returnCount: 5,
          returnRate: 2.5,
          primaryReason: 'size_issue',
        },
        {
          productId: 'prod-2',
          productName: 'Product 2',
          returnCount: 3,
          returnRate: 1.8,
          primaryReason: 'quality_issue',
        },
      ],
      byStatus,
      processing: {
        averageApprovalTime: 2.5,
        averageInspectionTime: 4.2,
        averageRefundTime: 24,
        averageTotalProcessingTime: 36.5,
      },
      financial: {
        totalRefunds: Number(totalRefunded.toFixed(2)),
        totalRestockingFees: refunds.reduce((sum, r) => sum + r.refund.restockingFee, 0),
        totalShippingCosts: returns.reduce((sum, r) => sum + r.returnShipping.shippingCost, 0),
        netReturnCost: Number((totalRefunded + 500).toFixed(2)), // Mock additional costs
      },
      restocking: {
        itemsRestocked: inspections.reduce((sum, i) => sum + i.actions.restockQuantity, 0),
        itemsDisposed: inspections.reduce((sum, i) => sum + i.actions.disposeQuantity, 0),
        restockingRate: Number(restockingRate.toFixed(2)),
      },
    };
  }

  /**
   * Get return request
   */
  async getReturnRequest(requestId: string): Promise<ReturnRequest | null> {
    return this.returnRequests.get(requestId) || null;
  }

  /**
   * Get returns by customer
   */
  async getReturnsByCustomer(customerId: string): Promise<ReturnRequest[]> {
    return Array.from(this.returnRequests.values()).filter((r) => r.customerId === customerId);
  }
}

// Export singleton instance
export const returnsRefundsSystem = new ReturnsRefundsSystem();
