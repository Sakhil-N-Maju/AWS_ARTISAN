/**
 * Admin Order Management System
 *
 * Comprehensive admin order management:
 * - Order processing and tracking
 * - Order modification and cancellation
 * - Dispute resolution
 * - Refund and return management
 * - Bulk order operations
 */

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'disputed';
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_refunded';
  shippingAddress: any;
  createdAt: Date;
  updatedAt: Date;
  notes: {
    addedBy: string;
    note: string;
    timestamp: Date;
  }[];
  flags: string[];
}

export interface OrderDispute {
  id: string;
  orderId: string;
  userId: string;
  reason: 'not_received' | 'damaged' | 'wrong_item' | 'not_as_described' | 'other';
  description: string;
  evidence: string[];
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: {
    action: 'refund' | 'replacement' | 'partial_refund' | 'no_action';
    amount?: number;
    note: string;
  };
}

export interface BulkOperation {
  id: string;
  type: 'status_update' | 'export' | 'refund' | 'cancel';
  orderIds: string[];
  parameters: any;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  results?: {
    successful: number;
    failed: number;
    errors: string[];
  };
}

export class AdminOrderManagementSystem {
  private orders: Map<string, AdminOrder> = new Map();
  private disputes: Map<string, OrderDispute> = new Map();
  private bulkOperations: Map<string, BulkOperation> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  async getOrder(orderId: string): Promise<AdminOrder | null> {
    return this.orders.get(orderId) || null;
  }

  async searchOrders(query: {
    orderNumber?: string;
    userId?: string;
    status?: AdminOrder['status'];
    dateFrom?: Date;
    dateTo?: Date;
    minAmount?: number;
    maxAmount?: number;
    limit?: number;
  }): Promise<AdminOrder[]> {
    let results = Array.from(this.orders.values());

    if (query.orderNumber) {
      results = results.filter((o) => o.orderNumber.includes(query.orderNumber!));
    }
    if (query.userId) {
      results = results.filter((o) => o.userId === query.userId);
    }
    if (query.status) {
      results = results.filter((o) => o.status === query.status);
    }
    if (query.dateFrom) {
      results = results.filter((o) => o.createdAt >= query.dateFrom!);
    }
    if (query.dateTo) {
      results = results.filter((o) => o.createdAt <= query.dateTo!);
    }
    if (query.minAmount) {
      results = results.filter((o) => o.totalAmount >= query.minAmount!);
    }
    if (query.maxAmount) {
      results = results.filter((o) => o.totalAmount <= query.maxAmount!);
    }

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  async updateOrderStatus(
    orderId: string,
    status: AdminOrder['status'],
    adminId: string
  ): Promise<AdminOrder> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    order.status = status;
    order.updatedAt = new Date();
    order.notes.push({
      addedBy: adminId,
      note: `Status updated to ${status}`,
      timestamp: new Date(),
    });

    this.orders.set(orderId, order);
    return order;
  }

  async addOrderNote(orderId: string, adminId: string, note: string): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error('Order not found');

    order.notes.push({
      addedBy: adminId,
      note,
      timestamp: new Date(),
    });

    this.orders.set(orderId, order);
  }

  async createDispute(data: {
    orderId: string;
    userId: string;
    reason: OrderDispute['reason'];
    description: string;
    evidence?: string[];
  }): Promise<OrderDispute> {
    const dispute: OrderDispute = {
      id: `dispute-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      orderId: data.orderId,
      userId: data.userId,
      reason: data.reason,
      description: data.description,
      evidence: data.evidence || [],
      status: 'open',
      createdAt: new Date(),
    };

    this.disputes.set(dispute.id, dispute);

    // Flag the order
    const order = this.orders.get(data.orderId);
    if (order) {
      order.flags.push('disputed');
      order.status = 'disputed';
      this.orders.set(data.orderId, order);
    }

    return dispute;
  }

  async resolveDispute(data: {
    disputeId: string;
    adminId: string;
    action: 'refund' | 'replacement' | 'partial_refund' | 'no_action';
    amount?: number;
    note: string;
  }): Promise<OrderDispute> {
    const dispute = this.disputes.get(data.disputeId);
    if (!dispute) throw new Error('Dispute not found');

    dispute.status = 'resolved';
    dispute.resolvedAt = new Date();
    dispute.resolution = {
      action: data.action,
      amount: data.amount,
      note: data.note,
    };

    this.disputes.set(data.disputeId, dispute);

    // Update order
    const order = this.orders.get(dispute.orderId);
    if (order) {
      order.flags = order.flags.filter((f) => f !== 'disputed');
      if (data.action === 'refund' || data.action === 'partial_refund') {
        order.paymentStatus = data.action === 'refund' ? 'refunded' : 'partially_refunded';
      }
      this.orders.set(dispute.orderId, order);
    }

    return dispute;
  }

  async createBulkOperation(data: {
    type: BulkOperation['type'];
    orderIds: string[];
    parameters: any;
  }): Promise<BulkOperation> {
    const operation: BulkOperation = {
      id: `bulk-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: data.type,
      orderIds: data.orderIds,
      parameters: data.parameters,
      status: 'queued',
      progress: 0,
      startedAt: new Date(),
    };

    this.bulkOperations.set(operation.id, operation);

    // Process async
    setTimeout(() => this.processBulkOperation(operation.id), 100);

    return operation;
  }

  private async processBulkOperation(operationId: string): Promise<void> {
    const operation = this.bulkOperations.get(operationId);
    if (!operation) return;

    operation.status = 'processing';
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < operation.orderIds.length; i++) {
      try {
        // Simulate processing
        successful++;
      } catch (error) {
        failed++;
        errors.push(`Failed to process order ${operation.orderIds[i]}`);
      }
      operation.progress = Math.round(((i + 1) / operation.orderIds.length) * 100);
    }

    operation.status = 'completed';
    operation.completedAt = new Date();
    operation.results = { successful, failed, errors };
    this.bulkOperations.set(operationId, operation);
  }

  async getAnalytics(): Promise<{
    orders: {
      total: number;
      byStatus: Record<string, number>;
      flagged: number;
      averageValue: number;
    };
    disputes: {
      open: number;
      resolved: number;
      resolutionRate: number;
    };
  }> {
    const orders = Array.from(this.orders.values());
    const byStatus = orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const flagged = orders.filter((o) => o.flags.length > 0).length;
    const avgValue =
      orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0;

    const disputes = Array.from(this.disputes.values());
    const openDisputes = disputes.filter(
      (d) => d.status === 'open' || d.status === 'investigating'
    ).length;
    const resolvedDisputes = disputes.filter((d) => d.status === 'resolved').length;
    const resolutionRate = disputes.length > 0 ? (resolvedDisputes / disputes.length) * 100 : 0;

    return {
      orders: {
        total: orders.length,
        byStatus,
        flagged,
        averageValue: Math.round(avgValue),
      },
      disputes: {
        open: openDisputes,
        resolved: resolvedDisputes,
        resolutionRate: Math.round(resolutionRate * 100) / 100,
      },
    };
  }

  private initializeDefaultData(): void {
    const sampleOrder: AdminOrder = {
      id: 'order-1',
      orderNumber: 'ORD-2024-001',
      userId: 'user-1',
      status: 'confirmed',
      items: [{ productId: 'prod-1', name: 'Handwoven Scarf', quantity: 1, price: 1500 }],
      totalAmount: 1500,
      paymentStatus: 'paid',
      shippingAddress: {},
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
      notes: [],
      flags: [],
    };
    this.orders.set(sampleOrder.id, sampleOrder);
  }
}

export const adminOrderManagementSystem = new AdminOrderManagementSystem();
