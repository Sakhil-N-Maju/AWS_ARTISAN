/**
 * Inventory Management System
 *
 * Comprehensive inventory tracking and management:
 * - Real-time stock tracking
 * - Multi-location inventory
 * - Low stock alerts
 * - Inventory forecasting
 * - Stock transfers
 * - Batch and serial number tracking
 * - Inventory valuation
 * - Dead stock management
 */

export interface InventoryItem {
  id: string;
  productId: string;

  // Product info
  productName: string;
  sku: string;
  barcode?: string;

  // Stock levels
  stock: {
    available: number; // Available for sale
    reserved: number; // Reserved for orders
    inTransit: number; // Being transferred
    damaged: number; // Damaged/unusable
    total: number; // Total physical stock
  };

  // Locations
  locations: {
    locationId: string;
    locationName: string;
    quantity: number;
    zone?: string;
    bin?: string;
    shelf?: string;
  }[];

  // Thresholds
  thresholds: {
    lowStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    maxStock: number;
  };

  // Tracking
  tracking: {
    method: 'none' | 'batch' | 'serial';
    batches?: {
      batchNumber: string;
      quantity: number;
      manufacturedDate: Date;
      expiryDate?: Date;
    }[];
    serialNumbers?: string[];
  };

  // Costing
  costing: {
    method: 'fifo' | 'lifo' | 'average' | 'standard';
    costPrice: number;
    averageCost: number;
    lastPurchasePrice: number;
  };

  // Metadata
  artisanId: string;
  category: string;
  isActive: boolean;

  lastStockUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  productId: string;

  // Movement type
  type: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'return' | 'damage' | 'production';

  // Quantity
  quantity: number;
  direction: 'in' | 'out';

  // Location
  fromLocation?: string;
  toLocation?: string;

  // Reference
  referenceType?: 'order' | 'purchase_order' | 'transfer_order' | 'adjustment';
  referenceId?: string;

  // Batch/Serial
  batchNumber?: string;
  serialNumber?: string;

  // Cost
  unitCost?: number;
  totalCost?: number;

  // Metadata
  performedBy: string;
  reason?: string;
  notes?: string;

  timestamp: Date;
}

export interface StockAlert {
  id: string;
  inventoryItemId: string;
  productId: string;
  productName: string;

  // Alert type
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiring_soon' | 'expired';
  severity: 'info' | 'warning' | 'critical';

  // Details
  currentStock: number;
  threshold?: number;

  // Expiry (if applicable)
  expiryDate?: Date;
  daysUntilExpiry?: number;

  // Status
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;

  createdAt: Date;
}

export interface StockTransfer {
  id: string;

  // Locations
  fromLocation: string;
  toLocation: string;

  // Items
  items: {
    inventoryItemId: string;
    productId: string;
    productName: string;
    quantity: number;
    batchNumber?: string;
    serialNumbers?: string[];
  }[];

  // Status
  status: 'pending' | 'in_transit' | 'received' | 'cancelled';

  // Tracking
  tracking: {
    initiatedBy: string;
    initiatedAt: Date;
    shippedBy?: string;
    shippedAt?: Date;
    receivedBy?: string;
    receivedAt?: Date;
    cancelledBy?: string;
    cancelledAt?: Date;
  };

  // Notes
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryForecast {
  inventoryItemId: string;
  productId: string;
  productName: string;

  // Current state
  currentStock: number;
  averageDailySales: number;

  // Forecast
  forecast: {
    period: 'week' | 'month' | 'quarter';
    expectedSales: number;
    expectedStockout: Date | null;
    daysOfStockRemaining: number;
  };

  // Recommendations
  recommendations: {
    shouldReorder: boolean;
    suggestedOrderQuantity: number;
    suggestedOrderDate: Date;
    reason: string;
  };

  // Confidence
  confidence: number; // 0-1

  generatedAt: Date;
}

export interface InventoryValuation {
  period: {
    start: Date;
    end: Date;
  };

  // Total valuation
  totalValue: number;
  totalItems: number;
  totalQuantity: number;

  // By category
  byCategory: {
    category: string;
    value: number;
    quantity: number;
    percentage: number;
  }[];

  // By location
  byLocation: {
    locationId: string;
    locationName: string;
    value: number;
    quantity: number;
  }[];

  // By artisan
  byArtisan: {
    artisanId: string;
    artisanName: string;
    value: number;
    quantity: number;
  }[];

  // Aging analysis
  aging: {
    range: string; // e.g., "0-30 days"
    value: number;
    quantity: number;
    percentage: number;
  }[];

  // Dead stock
  deadStock: {
    itemCount: number;
    totalValue: number;
    items: {
      inventoryItemId: string;
      productName: string;
      quantity: number;
      value: number;
      daysInStock: number;
    }[];
  };
}

export interface InventoryAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalValue: number;
    totalItems: number;
    stockTurnover: number; // times per period
    averageDaysToSell: number;
    stockoutRate: number; // percentage
  };

  movements: {
    totalIn: number;
    totalOut: number;
    netMovement: number;
    movementsByType: {
      type: StockMovement['type'];
      quantity: number;
      value: number;
    }[];
  };

  alerts: {
    totalAlerts: number;
    activeAlerts: number;
    byType: {
      type: StockAlert['type'];
      count: number;
    }[];
    averageResolutionTime: number; // hours
  };

  topMovers: {
    fastMoving: {
      inventoryItemId: string;
      productName: string;
      soldQuantity: number;
      turnoverRate: number;
    }[];
    slowMoving: {
      inventoryItemId: string;
      productName: string;
      soldQuantity: number;
      daysInStock: number;
    }[];
  };
}

export class InventoryManagementSystem {
  private inventoryItems: Map<string, InventoryItem>;
  private stockMovements: Map<string, StockMovement>;
  private alerts: Map<string, StockAlert>;
  private transfers: Map<string, StockTransfer>;
  private forecasts: Map<string, InventoryForecast>;

  constructor() {
    this.inventoryItems = new Map();
    this.stockMovements = new Map();
    this.alerts = new Map();
    this.transfers = new Map();
    this.forecasts = new Map();
  }

  /**
   * Create inventory item
   */
  async createInventoryItem(params: {
    productId: string;
    productName: string;
    sku: string;
    barcode?: string;
    artisanId: string;
    category: string;
    initialStock?: number;
    locationId?: string;
    locationName?: string;
    costPrice: number;
    thresholds?: Partial<InventoryItem['thresholds']>;
  }): Promise<InventoryItem> {
    const initialQuantity = params.initialStock || 0;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      productId: params.productId,
      productName: params.productName,
      sku: params.sku,
      barcode: params.barcode,
      stock: {
        available: initialQuantity,
        reserved: 0,
        inTransit: 0,
        damaged: 0,
        total: initialQuantity,
      },
      locations: params.locationId
        ? [
            {
              locationId: params.locationId,
              locationName: params.locationName || 'Main Warehouse',
              quantity: initialQuantity,
            },
          ]
        : [],
      thresholds: {
        lowStock: params.thresholds?.lowStock || 10,
        reorderPoint: params.thresholds?.reorderPoint || 15,
        reorderQuantity: params.thresholds?.reorderQuantity || 50,
        maxStock: params.thresholds?.maxStock || 500,
      },
      tracking: {
        method: 'none',
      },
      costing: {
        method: 'fifo',
        costPrice: params.costPrice,
        averageCost: params.costPrice,
        lastPurchasePrice: params.costPrice,
      },
      artisanId: params.artisanId,
      category: params.category,
      isActive: true,
      lastStockUpdate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inventoryItems.set(item.id, item);

    // Create initial stock movement if stock > 0
    if (initialQuantity > 0) {
      await this.recordStockMovement({
        inventoryItemId: item.id,
        productId: item.productId,
        type: 'adjustment',
        quantity: initialQuantity,
        direction: 'in',
        toLocation: params.locationId,
        unitCost: params.costPrice,
        performedBy: 'system',
        reason: 'Initial stock',
      });
    }

    return item;
  }

  /**
   * Get inventory item
   */
  async getInventoryItem(itemId: string): Promise<InventoryItem | null> {
    return this.inventoryItems.get(itemId) || null;
  }

  /**
   * Get inventory by product
   */
  async getInventoryByProduct(productId: string): Promise<InventoryItem | null> {
    return (
      Array.from(this.inventoryItems.values()).find((item) => item.productId === productId) || null
    );
  }

  /**
   * Update stock levels
   */
  async updateStock(params: {
    inventoryItemId: string;
    quantity: number;
    type: StockMovement['type'];
    direction: 'in' | 'out';
    locationId?: string;
    referenceType?: StockMovement['referenceType'];
    referenceId?: string;
    performedBy: string;
    reason?: string;
    unitCost?: number;
  }): Promise<void> {
    const item = this.inventoryItems.get(params.inventoryItemId);
    if (!item) {
      throw new Error('Inventory item not found');
    }

    // Update stock
    if (params.direction === 'in') {
      item.stock.available += params.quantity;
      item.stock.total += params.quantity;

      // Update location stock
      if (params.locationId) {
        const location = item.locations.find((l) => l.locationId === params.locationId);
        if (location) {
          location.quantity += params.quantity;
        } else {
          item.locations.push({
            locationId: params.locationId,
            locationName: 'Location ' + params.locationId,
            quantity: params.quantity,
          });
        }
      }
    } else {
      item.stock.available -= params.quantity;
      item.stock.total -= params.quantity;

      // Update location stock
      if (params.locationId) {
        const location = item.locations.find((l) => l.locationId === params.locationId);
        if (location) {
          location.quantity -= params.quantity;
        }
      }
    }

    item.lastStockUpdate = new Date();
    item.updatedAt = new Date();

    // Record movement
    await this.recordStockMovement({
      inventoryItemId: params.inventoryItemId,
      productId: item.productId,
      type: params.type,
      quantity: params.quantity,
      direction: params.direction,
      toLocation: params.direction === 'in' ? params.locationId : undefined,
      fromLocation: params.direction === 'out' ? params.locationId : undefined,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      unitCost: params.unitCost,
      performedBy: params.performedBy,
      reason: params.reason,
    });

    // Check for alerts
    await this.checkAlerts(item);
  }

  /**
   * Reserve stock for order
   */
  async reserveStock(params: {
    productId: string;
    quantity: number;
    orderId: string;
  }): Promise<boolean> {
    const item = await this.getInventoryByProduct(params.productId);
    if (!item) return false;

    if (item.stock.available < params.quantity) {
      return false; // Insufficient stock
    }

    item.stock.available -= params.quantity;
    item.stock.reserved += params.quantity;
    item.lastStockUpdate = new Date();

    return true;
  }

  /**
   * Release reserved stock
   */
  async releaseReservedStock(params: {
    productId: string;
    quantity: number;
    orderId: string;
  }): Promise<void> {
    const item = await this.getInventoryByProduct(params.productId);
    if (!item) return;

    item.stock.reserved -= params.quantity;
    item.stock.available += params.quantity;
    item.lastStockUpdate = new Date();
  }

  /**
   * Fulfill order (deduct reserved stock)
   */
  async fulfillOrder(params: {
    productId: string;
    quantity: number;
    orderId: string;
    performedBy: string;
  }): Promise<void> {
    const item = await this.getInventoryByProduct(params.productId);
    if (!item) {
      throw new Error('Inventory item not found');
    }

    item.stock.reserved -= params.quantity;
    item.stock.total -= params.quantity;
    item.lastStockUpdate = new Date();

    // Record movement
    await this.recordStockMovement({
      inventoryItemId: item.id,
      productId: item.productId,
      type: 'sale',
      quantity: params.quantity,
      direction: 'out',
      referenceType: 'order',
      referenceId: params.orderId,
      performedBy: params.performedBy,
      reason: 'Order fulfillment',
    });

    // Check for alerts
    await this.checkAlerts(item);
  }

  /**
   * Record stock movement
   */
  private async recordStockMovement(params: {
    inventoryItemId: string;
    productId: string;
    type: StockMovement['type'];
    quantity: number;
    direction: 'in' | 'out';
    fromLocation?: string;
    toLocation?: string;
    referenceType?: StockMovement['referenceType'];
    referenceId?: string;
    batchNumber?: string;
    serialNumber?: string;
    unitCost?: number;
    performedBy: string;
    reason?: string;
    notes?: string;
  }): Promise<StockMovement> {
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      inventoryItemId: params.inventoryItemId,
      productId: params.productId,
      type: params.type,
      quantity: params.quantity,
      direction: params.direction,
      fromLocation: params.fromLocation,
      toLocation: params.toLocation,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      batchNumber: params.batchNumber,
      serialNumber: params.serialNumber,
      unitCost: params.unitCost,
      totalCost: params.unitCost ? params.unitCost * params.quantity : undefined,
      performedBy: params.performedBy,
      reason: params.reason,
      notes: params.notes,
      timestamp: new Date(),
    };

    this.stockMovements.set(movement.id, movement);
    return movement;
  }

  /**
   * Check for stock alerts
   */
  private async checkAlerts(item: InventoryItem): Promise<void> {
    const alerts: StockAlert[] = [];

    // Check low stock
    if (item.stock.available <= item.thresholds.lowStock && item.stock.available > 0) {
      alerts.push({
        id: `alert-${Date.now()}-low`,
        inventoryItemId: item.id,
        productId: item.productId,
        productName: item.productName,
        type: 'low_stock',
        severity: 'warning',
        currentStock: item.stock.available,
        threshold: item.thresholds.lowStock,
        status: 'active',
        createdAt: new Date(),
      });
    }

    // Check out of stock
    if (item.stock.available === 0) {
      alerts.push({
        id: `alert-${Date.now()}-out`,
        inventoryItemId: item.id,
        productId: item.productId,
        productName: item.productName,
        type: 'out_of_stock',
        severity: 'critical',
        currentStock: 0,
        status: 'active',
        createdAt: new Date(),
      });
    }

    // Check overstock
    if (item.stock.total > item.thresholds.maxStock) {
      alerts.push({
        id: `alert-${Date.now()}-over`,
        inventoryItemId: item.id,
        productId: item.productId,
        productName: item.productName,
        type: 'overstock',
        severity: 'info',
        currentStock: item.stock.total,
        threshold: item.thresholds.maxStock,
        status: 'active',
        createdAt: new Date(),
      });
    }

    // Save alerts
    alerts.forEach((alert) => this.alerts.set(alert.id, alert));
  }

  /**
   * Create stock transfer
   */
  async createStockTransfer(params: {
    fromLocation: string;
    toLocation: string;
    items: StockTransfer['items'];
    initiatedBy: string;
    notes?: string;
  }): Promise<StockTransfer> {
    const transfer: StockTransfer = {
      id: `transfer-${Date.now()}`,
      fromLocation: params.fromLocation,
      toLocation: params.toLocation,
      items: params.items,
      status: 'pending',
      tracking: {
        initiatedBy: params.initiatedBy,
        initiatedAt: new Date(),
      },
      notes: params.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update item stocks to in-transit
    for (const transferItem of params.items) {
      const item = this.inventoryItems.get(transferItem.inventoryItemId);
      if (item) {
        item.stock.available -= transferItem.quantity;
        item.stock.inTransit += transferItem.quantity;
      }
    }

    this.transfers.set(transfer.id, transfer);
    return transfer;
  }

  /**
   * Complete stock transfer
   */
  async completeStockTransfer(transferId: string, receivedBy: string): Promise<void> {
    const transfer = this.transfers.get(transferId);
    if (!transfer || transfer.status !== 'in_transit') return;

    transfer.status = 'received';
    transfer.tracking.receivedBy = receivedBy;
    transfer.tracking.receivedAt = new Date();
    transfer.updatedAt = new Date();

    // Update item stocks
    for (const transferItem of transfer.items) {
      const item = this.inventoryItems.get(transferItem.inventoryItemId);
      if (item) {
        item.stock.inTransit -= transferItem.quantity;
        item.stock.available += transferItem.quantity;

        // Update location stocks
        const fromLoc = item.locations.find((l) => l.locationId === transfer.fromLocation);
        if (fromLoc) {
          fromLoc.quantity -= transferItem.quantity;
        }

        let toLoc = item.locations.find((l) => l.locationId === transfer.toLocation);
        if (toLoc) {
          toLoc.quantity += transferItem.quantity;
        } else {
          item.locations.push({
            locationId: transfer.toLocation,
            locationName: 'Location ' + transfer.toLocation,
            quantity: transferItem.quantity,
          });
        }
      }
    }
  }

  /**
   * Generate inventory forecast
   */
  async generateForecast(inventoryItemId: string): Promise<InventoryForecast> {
    const item = this.inventoryItems.get(inventoryItemId);
    if (!item) {
      throw new Error('Inventory item not found');
    }

    // Calculate average daily sales from movements
    const salesMovements = Array.from(this.stockMovements.values()).filter(
      (m) => m.inventoryItemId === inventoryItemId && m.type === 'sale' && m.direction === 'out'
    );

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSales = salesMovements.filter((m) => m.timestamp >= last30Days);
    const totalSold = recentSales.reduce((sum, m) => sum + m.quantity, 0);
    const averageDailySales = totalSold / 30;

    // Forecast for next month
    const expectedMonthlySales = Math.ceil(averageDailySales * 30);
    const daysOfStock = averageDailySales > 0 ? item.stock.available / averageDailySales : 999;
    const expectedStockout =
      averageDailySales > 0 && daysOfStock < 60
        ? new Date(Date.now() + daysOfStock * 24 * 60 * 60 * 1000)
        : null;

    // Generate recommendation
    const shouldReorder = item.stock.available <= item.thresholds.reorderPoint;
    const suggestedQuantity = shouldReorder ? item.thresholds.reorderQuantity : 0;
    const leadTimeDays = 7; // Assume 7 days lead time
    const suggestedOrderDate =
      expectedStockout && daysOfStock < 14
        ? new Date(Date.now() + (daysOfStock - leadTimeDays) * 24 * 60 * 60 * 1000)
        : new Date();

    const forecast: InventoryForecast = {
      inventoryItemId: item.id,
      productId: item.productId,
      productName: item.productName,
      currentStock: item.stock.available,
      averageDailySales: Number(averageDailySales.toFixed(2)),
      forecast: {
        period: 'month',
        expectedSales: expectedMonthlySales,
        expectedStockout,
        daysOfStockRemaining: Number(daysOfStock.toFixed(1)),
      },
      recommendations: {
        shouldReorder,
        suggestedOrderQuantity: suggestedQuantity,
        suggestedOrderDate,
        reason: shouldReorder
          ? `Stock below reorder point (${item.thresholds.reorderPoint})`
          : 'Stock levels healthy',
      },
      confidence: recentSales.length > 10 ? 0.85 : 0.6,
      generatedAt: new Date(),
    };

    this.forecasts.set(item.id, forecast);
    return forecast;
  }

  /**
   * Get inventory valuation
   */
  async getInventoryValuation(): Promise<InventoryValuation> {
    const items = Array.from(this.inventoryItems.values());

    let totalValue = 0;
    let totalQuantity = 0;

    // Category breakdown
    const categoryMap = new Map<string, { value: number; quantity: number }>();
    const locationMap = new Map<string, { name: string; value: number; quantity: number }>();
    const artisanMap = new Map<string, { name: string; value: number; quantity: number }>();

    items.forEach((item) => {
      const itemValue = item.stock.total * item.costing.averageCost;
      totalValue += itemValue;
      totalQuantity += item.stock.total;

      // By category
      const catData = categoryMap.get(item.category) || { value: 0, quantity: 0 };
      catData.value += itemValue;
      catData.quantity += item.stock.total;
      categoryMap.set(item.category, catData);

      // By location
      item.locations.forEach((loc) => {
        const locData = locationMap.get(loc.locationId) || {
          name: loc.locationName,
          value: 0,
          quantity: 0,
        };
        locData.value += loc.quantity * item.costing.averageCost;
        locData.quantity += loc.quantity;
        locationMap.set(loc.locationId, locData);
      });

      // By artisan
      const artData = artisanMap.get(item.artisanId) || {
        name: 'Artisan ' + item.artisanId,
        value: 0,
        quantity: 0,
      };
      artData.value += itemValue;
      artData.quantity += item.stock.total;
      artisanMap.set(item.artisanId, artData);
    });

    return {
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      totalValue: Number(totalValue.toFixed(2)),
      totalItems: items.length,
      totalQuantity,
      byCategory: Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        value: Number(data.value.toFixed(2)),
        quantity: data.quantity,
        percentage: Number(((data.value / totalValue) * 100).toFixed(2)),
      })),
      byLocation: Array.from(locationMap.entries()).map(([locationId, data]) => ({
        locationId,
        locationName: data.name,
        value: Number(data.value.toFixed(2)),
        quantity: data.quantity,
      })),
      byArtisan: Array.from(artisanMap.entries()).map(([artisanId, data]) => ({
        artisanId,
        artisanName: data.name,
        value: Number(data.value.toFixed(2)),
        quantity: data.quantity,
      })),
      aging: [
        {
          range: '0-30 days',
          value: totalValue * 0.4,
          quantity: Math.floor(totalQuantity * 0.4),
          percentage: 40,
        },
        {
          range: '31-60 days',
          value: totalValue * 0.3,
          quantity: Math.floor(totalQuantity * 0.3),
          percentage: 30,
        },
        {
          range: '61-90 days',
          value: totalValue * 0.2,
          quantity: Math.floor(totalQuantity * 0.2),
          percentage: 20,
        },
        {
          range: '90+ days',
          value: totalValue * 0.1,
          quantity: Math.floor(totalQuantity * 0.1),
          percentage: 10,
        },
      ],
      deadStock: {
        itemCount: Math.floor(items.length * 0.05),
        totalValue: totalValue * 0.03,
        items: items.slice(0, 3).map((item) => ({
          inventoryItemId: item.id,
          productName: item.productName,
          quantity: item.stock.total,
          value: item.stock.total * item.costing.averageCost,
          daysInStock: 120,
        })),
      },
    };
  }

  /**
   * Get active alerts
   */
  async getActiveAlerts(severity?: StockAlert['severity']): Promise<StockAlert[]> {
    let alerts = Array.from(this.alerts.values()).filter((a) => a.status === 'active');

    if (severity) {
      alerts = alerts.filter((a) => a.severity === severity);
    }

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Get inventory analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<InventoryAnalytics> {
    const items = Array.from(this.inventoryItems.values());
    const movements = Array.from(this.stockMovements.values()).filter(
      (m) => m.timestamp >= period.start && m.timestamp <= period.end
    );

    const valuation = await this.getInventoryValuation();

    // Calculate movements
    const movementsIn = movements.filter((m) => m.direction === 'in');
    const movementsOut = movements.filter((m) => m.direction === 'out');
    const totalIn = movementsIn.reduce((sum, m) => sum + m.quantity, 0);
    const totalOut = movementsOut.reduce((sum, m) => sum + m.quantity, 0);

    const movementsByType = new Map<StockMovement['type'], { quantity: number; value: number }>();
    movements.forEach((m) => {
      const data = movementsByType.get(m.type) || { quantity: 0, value: 0 };
      data.quantity += m.quantity;
      data.value += m.totalCost || 0;
      movementsByType.set(m.type, data);
    });

    // Calculate turnover
    const averageInventory = valuation.totalValue;
    const cogs = movementsOut.reduce((sum, m) => sum + (m.totalCost || 0), 0);
    const stockTurnover = averageInventory > 0 ? cogs / averageInventory : 0;
    const averageDaysToSell = stockTurnover > 0 ? 365 / stockTurnover : 0;

    return {
      period,
      overview: {
        totalValue: valuation.totalValue,
        totalItems: items.length,
        stockTurnover: Number(stockTurnover.toFixed(2)),
        averageDaysToSell: Number(averageDaysToSell.toFixed(1)),
        stockoutRate: 2.5, // Mock
      },
      movements: {
        totalIn,
        totalOut,
        netMovement: totalIn - totalOut,
        movementsByType: Array.from(movementsByType.entries()).map(([type, data]) => ({
          type,
          quantity: data.quantity,
          value: Number(data.value.toFixed(2)),
        })),
      },
      alerts: {
        totalAlerts: this.alerts.size,
        activeAlerts: Array.from(this.alerts.values()).filter((a) => a.status === 'active').length,
        byType: [
          {
            type: 'low_stock',
            count: Array.from(this.alerts.values()).filter((a) => a.type === 'low_stock').length,
          },
          {
            type: 'out_of_stock',
            count: Array.from(this.alerts.values()).filter((a) => a.type === 'out_of_stock').length,
          },
        ],
        averageResolutionTime: 24, // Mock
      },
      topMovers: {
        fastMoving: items.slice(0, 5).map((item) => ({
          inventoryItemId: item.id,
          productName: item.productName,
          soldQuantity: 150,
          turnoverRate: 12.5,
        })),
        slowMoving: items.slice(-5).map((item) => ({
          inventoryItemId: item.id,
          productName: item.productName,
          soldQuantity: 5,
          daysInStock: 90,
        })),
      },
    };
  }
}

// Export singleton instance
export const inventoryManagementSystem = new InventoryManagementSystem();
