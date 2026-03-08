/**
 * Supplier Management System
 *
 * Comprehensive supplier and vendor management:
 * - Supplier profiles and onboarding
 * - Purchase order management
 * - Supplier performance tracking
 * - Quality control
 * - Payment terms and invoicing
 * - Supplier collaboration
 * - Sourcing and RFQ management
 */

export interface Supplier {
  id: string;
  code: string; // Unique supplier code

  // Basic info
  name: string;
  legalName: string;
  type: 'manufacturer' | 'wholesaler' | 'distributor' | 'artisan' | 'cooperative' | 'other';

  // Contact
  contact: {
    primaryContact: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    website?: string;
  };

  // Address
  addresses: {
    type: 'billing' | 'shipping' | 'registered';
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isPrimary: boolean;
  }[];

  // Business details
  business: {
    registrationNumber?: string;
    taxId?: string;
    gstNumber?: string;
    panNumber?: string;
    yearsInBusiness: number;
    certifications?: string[];
  };

  // Products/Categories
  categories: string[];
  specializations: string[];

  // Terms
  terms: {
    paymentTerms: 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'cod' | 'advance' | 'custom';
    customPaymentDays?: number;
    currency: string;
    minimumOrderValue?: number;
    leadTimeDays: number;
    returnPolicy?: string;
  };

  // Banking
  banking?: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    ifscCode?: string;
    swiftCode?: string;
    routingNumber?: string;
  };

  // Performance
  performance: {
    rating: number; // 0-5
    totalOrders: number;
    onTimeDeliveryRate: number; // percentage
    qualityScore: number; // 0-100
    responseTime: number; // hours
  };

  // Status
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval' | 'blacklisted';
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';

  // Relationships
  assignedBuyer?: string;

  // Documents
  documents: {
    type: 'contract' | 'license' | 'certificate' | 'tax_document' | 'insurance' | 'other';
    name: string;
    url: string;
    expiryDate?: Date;
    verified: boolean;
  }[];

  // Notes
  notes?: string;
  internalNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;

  // Supplier
  supplierId: string;
  supplierName: string;

  // Buyer
  buyerId: string;
  buyerName: string;

  // Items
  items: {
    id: string;
    productId?: string;
    productName: string;
    sku?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    discount: number;
    totalPrice: number;
    expectedDeliveryDate?: Date;
    receivedQuantity: number;
    status: 'pending' | 'partial' | 'received' | 'cancelled';
  }[];

  // Pricing
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    adjustments: number;
    total: number;
    currency: string;
  };

  // Shipping
  shipping: {
    address: Supplier['addresses'][0];
    method: string;
    carrier?: string;
    estimatedDeliveryDate: Date;
    trackingNumber?: string;
  };

  // Status
  status:
    | 'draft'
    | 'pending_approval'
    | 'approved'
    | 'sent'
    | 'acknowledged'
    | 'in_production'
    | 'shipped'
    | 'received'
    | 'cancelled'
    | 'completed';

  // Workflow
  workflow: {
    createdBy: string;
    createdAt: Date;
    approvedBy?: string;
    approvedAt?: Date;
    sentAt?: Date;
    acknowledgedAt?: Date;
    receivedAt?: Date;
    completedAt?: Date;
    cancelledBy?: string;
    cancelledAt?: Date;
    cancellationReason?: string;
  };

  // Payment
  payment: {
    terms: Supplier['terms']['paymentTerms'];
    dueDate?: Date;
    status: 'pending' | 'partial' | 'paid' | 'overdue';
    paidAmount: number;
    paidAt?: Date;
  };

  // References
  requisitionId?: string;
  rfqId?: string;

  // Notes
  notes?: string;
  internalNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;

  // Supplier
  supplierId: string;
  supplierName: string;

  // PO reference
  purchaseOrderId: string;
  poNumber: string;

  // Invoice details
  invoiceDate: Date;
  dueDate: Date;

  // Amounts
  amounts: {
    subtotal: number;
    tax: number;
    shipping: number;
    adjustments: number;
    total: number;
    currency: string;
  };

  // Payment
  payment: {
    status: 'pending' | 'partial' | 'paid' | 'overdue' | 'disputed';
    paidAmount: number;
    remainingAmount: number;
    paidAt?: Date;
    paymentMethod?: string;
    transactionId?: string;
  };

  // Status
  status: 'received' | 'under_review' | 'approved' | 'rejected' | 'paid';

  // Approval
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;

  // Documents
  documentUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierPerformanceReview {
  id: string;
  supplierId: string;
  supplierName: string;

  // Review period
  period: {
    start: Date;
    end: Date;
  };

  // Metrics
  metrics: {
    totalOrders: number;
    totalValue: number;
    onTimeDeliveries: number;
    lateDeliveries: number;
    onTimeDeliveryRate: number; // percentage
    qualityIssues: number;
    qualityAcceptanceRate: number; // percentage
    averageLeadTime: number; // days
    responseTime: number; // hours
  };

  // Scores (0-100)
  scores: {
    quality: number;
    delivery: number;
    pricing: number;
    communication: number;
    compliance: number;
    overall: number;
  };

  // Feedback
  strengths: string[];
  improvements: string[];
  issues: {
    type: 'quality' | 'delivery' | 'pricing' | 'communication' | 'compliance';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    date: Date;
    resolved: boolean;
  }[];

  // Reviewer
  reviewedBy: string;
  reviewedAt: Date;

  // Recommendations
  recommendation: 'continue' | 'improve' | 'reduce_orders' | 'discontinue';
  actionItems?: string[];

  createdAt: Date;
}

export interface RequestForQuotation {
  id: string;
  rfqNumber: string;

  // Requestor
  requestedBy: string;
  department?: string;

  // Items
  items: {
    id: string;
    productName: string;
    description: string;
    specifications?: string;
    quantity: number;
    unit: string;
    targetPrice?: number;
    preferredBrand?: string;
  }[];

  // Requirements
  requirements: {
    deliveryDate: Date;
    deliveryLocation: string;
    qualityStandards?: string;
    certifications?: string[];
    sampleRequired: boolean;
  };

  // Suppliers invited
  suppliers: {
    supplierId: string;
    supplierName: string;
    invitedAt: Date;
    respondedAt?: Date;
    status: 'invited' | 'responded' | 'declined' | 'no_response';
  }[];

  // Status
  status: 'draft' | 'sent' | 'responses_received' | 'evaluating' | 'awarded' | 'cancelled';

  // Timeline
  timeline: {
    issueDate: Date;
    responseDeadline: Date;
    evaluationCompleteBy: Date;
    awardedDate?: Date;
  };

  // Awarded supplier
  awardedSupplierId?: string;
  awardedQuoteId?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierQuote {
  id: string;
  rfqId: string;
  rfqNumber: string;

  // Supplier
  supplierId: string;
  supplierName: string;

  // Quote details
  items: {
    rfqItemId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    leadTimeDays: number;
    totalPrice: number;
    notes?: string;
  }[];

  // Pricing
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    currency: string;
  };

  // Terms
  terms: {
    paymentTerms: string;
    validityDays: number;
    deliveryTerms: string;
    warranty?: string;
  };

  // Status
  status: 'submitted' | 'under_review' | 'shortlisted' | 'accepted' | 'rejected';

  // Evaluation
  evaluation?: {
    priceScore: number; // 0-100
    qualityScore: number;
    deliveryScore: number;
    termsScore: number;
    overallScore: number;
    evaluatedBy: string;
    evaluatedAt: Date;
    notes?: string;
  };

  // Documents
  documents?: {
    type: string;
    url: string;
  }[];

  submittedAt: Date;
  createdAt: Date;
}

export interface SupplierAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalSuppliers: number;
    activeSuppliers: number;
    newSuppliers: number;
    totalPurchaseValue: number;
    averageOrderValue: number;
  };

  byTier: {
    tier: Supplier['tier'];
    count: number;
    purchaseValue: number;
    percentage: number;
  }[];

  byCategory: {
    category: string;
    suppliers: number;
    purchaseOrders: number;
    value: number;
  }[];

  performance: {
    averageOnTimeDelivery: number; // percentage
    averageQualityScore: number;
    averageResponseTime: number; // hours
    averageLeadTime: number; // days
  };

  topSuppliers: {
    supplierId: string;
    supplierName: string;
    purchaseValue: number;
    orders: number;
    performanceScore: number;
  }[];

  purchaseOrders: {
    total: number;
    byStatus: {
      status: PurchaseOrder['status'];
      count: number;
      value: number;
    }[];
    averageProcessingTime: number; // days
  };

  savings: {
    totalDiscount: number;
    volumeDiscounts: number;
    negotiatedSavings: number;
  };
}

export class SupplierManagementSystem {
  private suppliers: Map<string, Supplier>;
  private purchaseOrders: Map<string, PurchaseOrder>;
  private invoices: Map<string, SupplierInvoice>;
  private performanceReviews: Map<string, SupplierPerformanceReview>;
  private rfqs: Map<string, RequestForQuotation>;
  private quotes: Map<string, SupplierQuote>;

  constructor() {
    this.suppliers = new Map();
    this.purchaseOrders = new Map();
    this.invoices = new Map();
    this.performanceReviews = new Map();
    this.rfqs = new Map();
    this.quotes = new Map();
  }

  /**
   * Create supplier
   */
  async createSupplier(params: {
    name: string;
    legalName: string;
    type: Supplier['type'];
    contact: Supplier['contact'];
    addresses: Supplier['addresses'];
    business?: Partial<Supplier['business']>;
    categories: string[];
    terms: Supplier['terms'];
    assignedBuyer?: string;
  }): Promise<Supplier> {
    const supplier: Supplier = {
      id: `sup-${Date.now()}`,
      code: `SUP-${String(this.suppliers.size + 1).padStart(6, '0')}`,
      name: params.name,
      legalName: params.legalName,
      type: params.type,
      contact: params.contact,
      addresses: params.addresses,
      business: {
        yearsInBusiness: params.business?.yearsInBusiness || 0,
        ...params.business,
      },
      categories: params.categories,
      specializations: [],
      terms: params.terms,
      performance: {
        rating: 0,
        totalOrders: 0,
        onTimeDeliveryRate: 0,
        qualityScore: 0,
        responseTime: 0,
      },
      status: 'pending_approval',
      tier: 'bronze',
      assignedBuyer: params.assignedBuyer,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.suppliers.set(supplier.id, supplier);
    return supplier;
  }

  /**
   * Create purchase order
   */
  async createPurchaseOrder(params: {
    supplierId: string;
    buyerId: string;
    buyerName: string;
    items: Omit<PurchaseOrder['items'][0], 'id' | 'receivedQuantity' | 'status'>[];
    shipping: PurchaseOrder['shipping'];
    notes?: string;
  }): Promise<PurchaseOrder> {
    const supplier = this.suppliers.get(params.supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    // Calculate pricing
    let subtotal = 0;
    let totalTax = 0;

    const items = params.items.map((item, index) => {
      const itemSubtotal = item.quantity * item.unitPrice - item.discount;
      const itemTax = itemSubtotal * (item.tax / 100);
      const itemTotal = itemSubtotal + itemTax;

      subtotal += itemSubtotal;
      totalTax += itemTax;

      return {
        ...item,
        id: `item-${index + 1}`,
        totalPrice: Number(itemTotal.toFixed(2)),
        receivedQuantity: 0,
        status: 'pending' as const,
      };
    });

    const total = subtotal + totalTax;

    // Calculate due date
    const dueDate = new Date();
    if (supplier.terms.paymentTerms.startsWith('net_')) {
      const days = parseInt(supplier.terms.paymentTerms.split('_')[1]);
      dueDate.setDate(dueDate.getDate() + days);
    }

    const po: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${Date.now()}`,
      supplierId: params.supplierId,
      supplierName: supplier.name,
      buyerId: params.buyerId,
      buyerName: params.buyerName,
      items,
      pricing: {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(totalTax.toFixed(2)),
        shipping: 0,
        discount: 0,
        adjustments: 0,
        total: Number(total.toFixed(2)),
        currency: supplier.terms.currency,
      },
      shipping: params.shipping,
      status: 'draft',
      workflow: {
        createdBy: params.buyerId,
        createdAt: new Date(),
      },
      payment: {
        terms: supplier.terms.paymentTerms,
        dueDate,
        status: 'pending',
        paidAmount: 0,
      },
      notes: params.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.purchaseOrders.set(po.id, po);
    return po;
  }

  /**
   * Approve purchase order
   */
  async approvePurchaseOrder(poId: string, approvedBy: string): Promise<void> {
    const po = this.purchaseOrders.get(poId);
    if (!po) return;

    po.status = 'approved';
    po.workflow.approvedBy = approvedBy;
    po.workflow.approvedAt = new Date();
    po.updatedAt = new Date();
  }

  /**
   * Send purchase order
   */
  async sendPurchaseOrder(poId: string): Promise<void> {
    const po = this.purchaseOrders.get(poId);
    if (!po || po.status !== 'approved') return;

    po.status = 'sent';
    po.workflow.sentAt = new Date();
    po.updatedAt = new Date();
  }

  /**
   * Receive purchase order
   */
  async receivePurchaseOrder(params: {
    poId: string;
    items: {
      itemId: string;
      receivedQuantity: number;
    }[];
  }): Promise<void> {
    const po = this.purchaseOrders.get(params.poId);
    if (!po) return;

    // Update received quantities
    params.items.forEach((item) => {
      const poItem = po.items.find((i) => i.id === item.itemId);
      if (poItem) {
        poItem.receivedQuantity += item.receivedQuantity;

        if (poItem.receivedQuantity >= poItem.quantity) {
          poItem.status = 'received';
        } else if (poItem.receivedQuantity > 0) {
          poItem.status = 'partial';
        }
      }
    });

    // Check if PO fully received
    const allReceived = po.items.every((i) => i.status === 'received');
    if (allReceived) {
      po.status = 'completed';
      po.workflow.completedAt = new Date();

      // Update supplier performance
      const supplier = this.suppliers.get(po.supplierId);
      if (supplier) {
        supplier.performance.totalOrders++;
      }
    } else {
      po.status = 'received';
      po.workflow.receivedAt = new Date();
    }

    po.updatedAt = new Date();
  }

  /**
   * Create RFQ
   */
  async createRFQ(params: {
    requestedBy: string;
    department?: string;
    items: RequestForQuotation['items'];
    requirements: RequestForQuotation['requirements'];
    supplierIds: string[];
    responseDeadline: Date;
  }): Promise<RequestForQuotation> {
    const rfq: RequestForQuotation = {
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-${Date.now()}`,
      requestedBy: params.requestedBy,
      department: params.department,
      items: params.items,
      requirements: params.requirements,
      suppliers: params.supplierIds.map((supplierId) => {
        const supplier = this.suppliers.get(supplierId);
        return {
          supplierId,
          supplierName: supplier?.name || 'Unknown',
          invitedAt: new Date(),
          status: 'invited' as const,
        };
      }),
      status: 'draft',
      timeline: {
        issueDate: new Date(),
        responseDeadline: params.responseDeadline,
        evaluationCompleteBy: new Date(params.responseDeadline.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.rfqs.set(rfq.id, rfq);
    return rfq;
  }

  /**
   * Submit supplier quote
   */
  async submitQuote(params: {
    rfqId: string;
    supplierId: string;
    items: SupplierQuote['items'];
    pricing: SupplierQuote['pricing'];
    terms: SupplierQuote['terms'];
    documents?: SupplierQuote['documents'];
  }): Promise<SupplierQuote> {
    const rfq = this.rfqs.get(params.rfqId);
    if (!rfq) {
      throw new Error('RFQ not found');
    }

    const supplier = this.suppliers.get(params.supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    const quote: SupplierQuote = {
      id: `quote-${Date.now()}`,
      rfqId: params.rfqId,
      rfqNumber: rfq.rfqNumber,
      supplierId: params.supplierId,
      supplierName: supplier.name,
      items: params.items,
      pricing: params.pricing,
      terms: params.terms,
      status: 'submitted',
      documents: params.documents,
      submittedAt: new Date(),
      createdAt: new Date(),
    };

    this.quotes.set(quote.id, quote);

    // Update RFQ supplier status
    const rfqSupplier = rfq.suppliers.find((s) => s.supplierId === params.supplierId);
    if (rfqSupplier) {
      rfqSupplier.status = 'responded';
      rfqSupplier.respondedAt = new Date();
    }

    return quote;
  }

  /**
   * Create performance review
   */
  async createPerformanceReview(params: {
    supplierId: string;
    period: { start: Date; end: Date };
    metrics: SupplierPerformanceReview['metrics'];
    scores: SupplierPerformanceReview['scores'];
    strengths: string[];
    improvements: string[];
    issues: SupplierPerformanceReview['issues'];
    recommendation: SupplierPerformanceReview['recommendation'];
    reviewedBy: string;
  }): Promise<SupplierPerformanceReview> {
    const supplier = this.suppliers.get(params.supplierId);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    const review: SupplierPerformanceReview = {
      id: `review-${Date.now()}`,
      supplierId: params.supplierId,
      supplierName: supplier.name,
      period: params.period,
      metrics: params.metrics,
      scores: params.scores,
      strengths: params.strengths,
      improvements: params.improvements,
      issues: params.issues,
      reviewedBy: params.reviewedBy,
      reviewedAt: new Date(),
      recommendation: params.recommendation,
      createdAt: new Date(),
    };

    this.performanceReviews.set(review.id, review);

    // Update supplier performance
    supplier.performance = {
      rating: params.scores.overall / 20, // Convert 0-100 to 0-5
      totalOrders: params.metrics.totalOrders,
      onTimeDeliveryRate: params.metrics.onTimeDeliveryRate,
      qualityScore: params.scores.quality,
      responseTime: params.metrics.responseTime,
    };

    // Update tier based on performance
    if (params.scores.overall >= 90) supplier.tier = 'platinum';
    else if (params.scores.overall >= 75) supplier.tier = 'gold';
    else if (params.scores.overall >= 60) supplier.tier = 'silver';
    else supplier.tier = 'bronze';

    return review;
  }

  /**
   * Get supplier analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<SupplierAnalytics> {
    const suppliers = Array.from(this.suppliers.values());
    const activeSuppliers = suppliers.filter((s) => s.status === 'active');
    const newSuppliers = suppliers.filter(
      (s) => s.createdAt >= period.start && s.createdAt <= period.end
    );

    const purchaseOrders = Array.from(this.purchaseOrders.values()).filter(
      (po) => po.createdAt >= period.start && po.createdAt <= period.end
    );

    const totalPurchaseValue = purchaseOrders.reduce((sum, po) => sum + po.pricing.total, 0);
    const averageOrderValue =
      purchaseOrders.length > 0 ? totalPurchaseValue / purchaseOrders.length : 0;

    // Tier distribution
    const tierCounts = new Map<Supplier['tier'], { count: number; value: number }>();
    suppliers.forEach((s) => {
      const data = tierCounts.get(s.tier) || { count: 0, value: 0 };
      data.count++;
      tierCounts.set(s.tier, data);
    });

    const byTier = Array.from(tierCounts.entries()).map(([tier, data]) => ({
      tier,
      count: data.count,
      purchaseValue: data.value,
      percentage: (data.count / suppliers.length) * 100,
    }));

    // PO status breakdown
    const statusCounts = new Map<PurchaseOrder['status'], { count: number; value: number }>();
    purchaseOrders.forEach((po) => {
      const data = statusCounts.get(po.status) || { count: 0, value: 0 };
      data.count++;
      data.value += po.pricing.total;
      statusCounts.set(po.status, data);
    });

    const byStatus = Array.from(statusCounts.entries()).map(([status, data]) => ({
      status,
      count: data.count,
      value: data.value,
    }));

    // Performance averages
    const avgOnTimeDelivery =
      activeSuppliers.length > 0
        ? activeSuppliers.reduce((sum, s) => sum + s.performance.onTimeDeliveryRate, 0) /
          activeSuppliers.length
        : 0;

    const avgQualityScore =
      activeSuppliers.length > 0
        ? activeSuppliers.reduce((sum, s) => sum + s.performance.qualityScore, 0) /
          activeSuppliers.length
        : 0;

    const avgResponseTime =
      activeSuppliers.length > 0
        ? activeSuppliers.reduce((sum, s) => sum + s.performance.responseTime, 0) /
          activeSuppliers.length
        : 0;

    return {
      period,
      overview: {
        totalSuppliers: suppliers.length,
        activeSuppliers: activeSuppliers.length,
        newSuppliers: newSuppliers.length,
        totalPurchaseValue: Number(totalPurchaseValue.toFixed(2)),
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
      },
      byTier,
      byCategory: [
        { category: 'Textiles', suppliers: 15, purchaseOrders: 45, value: 450000 },
        { category: 'Pottery', suppliers: 8, purchaseOrders: 22, value: 180000 },
      ],
      performance: {
        averageOnTimeDelivery: Number(avgOnTimeDelivery.toFixed(2)),
        averageQualityScore: Number(avgQualityScore.toFixed(2)),
        averageResponseTime: Number(avgResponseTime.toFixed(1)),
        averageLeadTime: 14, // Mock
      },
      topSuppliers: suppliers
        .sort((a, b) => b.performance.totalOrders - a.performance.totalOrders)
        .slice(0, 10)
        .map((s) => ({
          supplierId: s.id,
          supplierName: s.name,
          purchaseValue: 0, // Would calculate from POs
          orders: s.performance.totalOrders,
          performanceScore: s.performance.qualityScore,
        })),
      purchaseOrders: {
        total: purchaseOrders.length,
        byStatus,
        averageProcessingTime: 5.5, // Mock
      },
      savings: {
        totalDiscount: purchaseOrders.reduce((sum, po) => sum + po.pricing.discount, 0),
        volumeDiscounts: 25000, // Mock
        negotiatedSavings: 15000, // Mock
      },
    };
  }

  /**
   * Get supplier
   */
  async getSupplier(supplierId: string): Promise<Supplier | null> {
    return this.suppliers.get(supplierId) || null;
  }

  /**
   * Get all suppliers
   */
  async getAllSuppliers(status?: Supplier['status']): Promise<Supplier[]> {
    let suppliers = Array.from(this.suppliers.values());

    if (status) {
      suppliers = suppliers.filter((s) => s.status === status);
    }

    return suppliers;
  }
}

// Export singleton instance
export const supplierManagementSystem = new SupplierManagementSystem();
