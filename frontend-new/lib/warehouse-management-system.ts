/**
 * Warehouse Management System
 *
 * Comprehensive warehouse operations management:
 * - Multi-warehouse support
 * - Receiving and putaway
 * - Cycle counting
 * - Zone and bin management
 * - Warehouse capacity planning
 * - Cross-docking
 * - Warehouse performance metrics
 */

export interface Warehouse {
  id: string;
  name: string;
  code: string;

  // Location
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  // Type
  type: 'distribution_center' | 'fulfillment_center' | 'storage' | 'retail' | 'dark_store';

  // Capacity
  capacity: {
    totalArea: number; // square meters
    usedArea: number;
    availableArea: number;
    maxPallets: number;
    currentPallets: number;
    maxWeight: number; // kg
    currentWeight: number;
  };

  // Operating hours
  operating: {
    timezone: string;
    hours: {
      [key: string]: {
        // day of week
        open: string; // HH:MM
        close: string; // HH:MM
      };
    };
    is24x7: boolean;
  };

  // Zones
  zones: {
    id: string;
    name: string;
    type: 'receiving' | 'storage' | 'picking' | 'packing' | 'shipping' | 'quarantine' | 'returns';
    area: number;
    temperature?: 'ambient' | 'refrigerated' | 'frozen';
  }[];

  // Status
  status: 'active' | 'inactive' | 'maintenance';

  // Staff
  staff: {
    managerId: string;
    totalStaff: number;
    currentShift: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface StorageLocation {
  id: string;
  warehouseId: string;

  // Location hierarchy
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;

  // Full location code
  locationCode: string; // e.g., "A-01-R3-S2-B5"

  // Capacity
  capacity: {
    maxItems: number;
    currentItems: number;
    maxWeight: number; // kg
    currentWeight: number;
    maxVolume: number; // cubic meters
    currentVolume: number;
  };

  // Dimensions
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'meter';
  };

  // Restrictions
  restrictions?: {
    itemTypes?: string[];
    temperatureControlled?: boolean;
    hazmat?: boolean;
    fragile?: boolean;
  };

  // Current inventory
  inventory: {
    productId: string;
    quantity: number;
    lastUpdated: Date;
  }[];

  // Status
  status: 'available' | 'occupied' | 'reserved' | 'maintenance' | 'damaged';

  lastInventoryCheck?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceivingOrder {
  id: string;
  warehouseId: string;

  // Source
  source: {
    type: 'purchase_order' | 'transfer' | 'return' | 'production';
    referenceId: string;
    supplierId?: string;
    supplierName?: string;
  };

  // Expected items
  expectedItems: {
    productId: string;
    productName: string;
    sku: string;
    expectedQuantity: number;
    receivedQuantity: number;
    damagedQuantity: number;
    discrepancy: number;
  }[];

  // Receiving details
  receiving: {
    expectedDate: Date;
    receivedDate?: Date;
    receivedBy?: string;
    dock?: string;
    containerNumber?: string;
    sealNumber?: string;
  };

  // Quality check
  qualityCheck?: {
    performed: boolean;
    passedQuantity: number;
    failedQuantity: number;
    notes?: string;
    inspector?: string;
    inspectionDate?: Date;
  };

  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'discrepancy' | 'cancelled';

  // Documents
  documents: {
    type: 'packing_list' | 'invoice' | 'quality_report' | 'photos';
    url: string;
  }[];

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface PutawayTask {
  id: string;
  warehouseId: string;
  receivingOrderId: string;

  // Items to putaway
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    fromLocation: string; // receiving dock
    suggestedLocation: string;
    actualLocation?: string;
    completedQuantity: number;
  }[];

  // Assignment
  assignedTo?: string;
  assignedAt?: Date;

  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  // Priority
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Timing
  startedAt?: Date;
  completedAt?: Date;

  createdAt: Date;
}

export interface CycleCount {
  id: string;
  warehouseId: string;

  // Count details
  count: {
    type: 'full' | 'partial' | 'abc' | 'random';
    schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'ad_hoc';
    locations: string[]; // Location IDs
  };

  // Items counted
  items: {
    productId: string;
    productName: string;
    sku: string;
    location: string;
    systemQuantity: number;
    countedQuantity: number;
    variance: number;
    variancePercentage: number;
    notes?: string;
  }[];

  // Assignment
  assignedTo: string;
  assignedAt: Date;

  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'review' | 'approved';

  // Results
  results?: {
    totalItems: number;
    itemsCounted: number;
    itemsWithVariance: number;
    totalVariance: number;
    accuracy: number; // percentage
  };

  // Approval
  approvedBy?: string;
  approvedAt?: Date;

  // Timing
  scheduledDate: Date;
  startedAt?: Date;
  completedAt?: Date;

  createdAt: Date;
}

export interface CrossDockOperation {
  id: string;
  warehouseId: string;

  // Inbound
  inbound: {
    receivingOrderId: string;
    arrivalTime: Date;
    dock: string;
  };

  // Outbound
  outbound: {
    fulfillmentOrderIds: string[];
    departureTime: Date;
    dock: string;
  };

  // Items
  items: {
    productId: string;
    quantity: number;
    fromDock: string;
    toDock: string;
  }[];

  // Status
  status: 'scheduled' | 'receiving' | 'transferring' | 'shipping' | 'completed';

  // Performance
  performance?: {
    dwellTime: number; // minutes
    targetDwellTime: number;
    onTime: boolean;
  };

  createdAt: Date;
  completedAt?: Date;
}

export interface WarehouseTask {
  id: string;
  warehouseId: string;

  // Task details
  type:
    | 'receiving'
    | 'putaway'
    | 'picking'
    | 'packing'
    | 'shipping'
    | 'cycle_count'
    | 'inventory_adjustment'
    | 'cleaning'
    | 'maintenance';
  title: string;
  description?: string;

  // Assignment
  assignedTo?: string;
  assignedAt?: Date;

  // Priority
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Location
  location?: string;
  zone?: string;

  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';

  // Due date
  dueDate?: Date;

  // Timing
  estimatedDuration?: number; // minutes
  actualDuration?: number;
  startedAt?: Date;
  completedAt?: Date;

  // Notes
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface WarehouseMetrics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalWarehouses: number;
    activeWarehouses: number;
    totalArea: number; // square meters
    utilizationRate: number; // percentage
    inventoryValue: number;
  };

  capacity: {
    warehouseId: string;
    warehouseName: string;
    totalArea: number;
    usedArea: number;
    utilizationRate: number;
    palletUtilization: number;
  }[];

  operations: {
    totalReceivingOrders: number;
    totalPutaways: number;
    averagePutawayTime: number; // minutes
    receivingAccuracy: number; // percentage
    cycleCountsCompleted: number;
    inventoryAccuracy: number; // percentage
  };

  productivity: {
    itemsReceived: number;
    itemsPutaway: number;
    itemsPicked: number;
    itemsShipped: number;
    averageItemsPerLabor: number;
  };

  performance: {
    averageDockToStockTime: number; // hours
    orderFillRate: number; // percentage
    crossDockEfficiency: number; // percentage
    onTimeShipmentRate: number; // percentage
  };
}

export class WarehouseManagementSystem {
  private warehouses: Map<string, Warehouse>;
  private locations: Map<string, StorageLocation>;
  private receivingOrders: Map<string, ReceivingOrder>;
  private putawayTasks: Map<string, PutawayTask>;
  private cycleCounts: Map<string, CycleCount>;
  private crossDockOps: Map<string, CrossDockOperation>;
  private tasks: Map<string, WarehouseTask>;

  constructor() {
    this.warehouses = new Map();
    this.locations = new Map();
    this.receivingOrders = new Map();
    this.putawayTasks = new Map();
    this.cycleCounts = new Map();
    this.crossDockOps = new Map();
    this.tasks = new Map();
    this.initializeDefaultWarehouse();
  }

  /**
   * Initialize default warehouse
   */
  private initializeDefaultWarehouse() {
    const warehouse: Warehouse = {
      id: 'wh-main',
      name: 'Main Distribution Center',
      code: 'MDC-01',
      address: {
        street: '123 Warehouse District',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
      type: 'fulfillment_center',
      capacity: {
        totalArea: 5000,
        usedArea: 3200,
        availableArea: 1800,
        maxPallets: 1000,
        currentPallets: 650,
        maxWeight: 500000,
        currentWeight: 325000,
      },
      operating: {
        timezone: 'Asia/Kolkata',
        hours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '08:00', close: '14:00' },
        },
        is24x7: false,
      },
      zones: [
        {
          id: 'zone-receiving',
          name: 'Receiving',
          type: 'receiving',
          area: 500,
          temperature: 'ambient',
        },
        {
          id: 'zone-storage-a',
          name: 'Storage A',
          type: 'storage',
          area: 2000,
          temperature: 'ambient',
        },
        {
          id: 'zone-storage-b',
          name: 'Storage B',
          type: 'storage',
          area: 1500,
          temperature: 'ambient',
        },
        { id: 'zone-picking', name: 'Picking', type: 'picking', area: 600 },
        { id: 'zone-packing', name: 'Packing', type: 'packing', area: 300 },
        { id: 'zone-shipping', name: 'Shipping', type: 'shipping', area: 400 },
      ],
      status: 'active',
      staff: {
        managerId: 'mgr-001',
        totalStaff: 50,
        currentShift: 25,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.warehouses.set(warehouse.id, warehouse);
  }

  /**
   * Create storage location
   */
  async createStorageLocation(params: {
    warehouseId: string;
    zone: string;
    aisle: string;
    rack: string;
    shelf: string;
    bin: string;
    capacity: StorageLocation['capacity'];
    dimensions?: StorageLocation['dimensions'];
    restrictions?: StorageLocation['restrictions'];
  }): Promise<StorageLocation> {
    const locationCode = `${params.zone}-${params.aisle}-${params.rack}-${params.shelf}-${params.bin}`;

    const location: StorageLocation = {
      id: `loc-${Date.now()}`,
      warehouseId: params.warehouseId,
      zone: params.zone,
      aisle: params.aisle,
      rack: params.rack,
      shelf: params.shelf,
      bin: params.bin,
      locationCode,
      capacity: params.capacity,
      dimensions: params.dimensions,
      restrictions: params.restrictions,
      inventory: [],
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.locations.set(location.id, location);
    return location;
  }

  /**
   * Create receiving order
   */
  async createReceivingOrder(params: {
    warehouseId: string;
    source: ReceivingOrder['source'];
    expectedItems: Omit<
      ReceivingOrder['expectedItems'][0],
      'receivedQuantity' | 'damagedQuantity' | 'discrepancy'
    >[];
    expectedDate: Date;
    dock?: string;
    notes?: string;
  }): Promise<ReceivingOrder> {
    const order: ReceivingOrder = {
      id: `rcv-${Date.now()}`,
      warehouseId: params.warehouseId,
      source: params.source,
      expectedItems: params.expectedItems.map((item) => ({
        ...item,
        receivedQuantity: 0,
        damagedQuantity: 0,
        discrepancy: 0,
      })),
      receiving: {
        expectedDate: params.expectedDate,
        dock: params.dock,
      },
      status: 'scheduled',
      documents: [],
      notes: params.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.receivingOrders.set(order.id, order);
    return order;
  }

  /**
   * Receive items
   */
  async receiveItems(params: {
    receivingOrderId: string;
    receivedBy: string;
    items: {
      productId: string;
      receivedQuantity: number;
      damagedQuantity: number;
    }[];
    qualityCheck?: Omit<ReceivingOrder['qualityCheck'], 'performed'>;
  }): Promise<void> {
    const order = this.receivingOrders.get(params.receivingOrderId);
    if (!order) return;

    order.status = 'in_progress';
    order.receiving.receivedBy = params.receivedBy;
    order.receiving.receivedDate = new Date();

    // Update received quantities
    params.items.forEach((item) => {
      const expectedItem = order.expectedItems.find((e) => e.productId === item.productId);
      if (expectedItem) {
        expectedItem.receivedQuantity = item.receivedQuantity;
        expectedItem.damagedQuantity = item.damagedQuantity;
        expectedItem.discrepancy = expectedItem.expectedQuantity - item.receivedQuantity;
      }
    });

    // Quality check
    if (params.qualityCheck) {
      order.qualityCheck = {
        ...params.qualityCheck,
        performed: true,
      };
    }

    // Check for discrepancies
    const hasDiscrepancy = order.expectedItems.some((item) => item.discrepancy !== 0);
    order.status = hasDiscrepancy ? 'discrepancy' : 'completed';

    order.updatedAt = new Date();

    // Auto-create putaway task
    if (!hasDiscrepancy) {
      await this.createPutawayTask(order.id);
    }
  }

  /**
   * Create putaway task
   */
  async createPutawayTask(receivingOrderId: string): Promise<PutawayTask> {
    const receivingOrder = this.receivingOrders.get(receivingOrderId);
    if (!receivingOrder) {
      throw new Error('Receiving order not found');
    }

    // Suggest locations for items
    const items = receivingOrder.expectedItems.map((item) => {
      const suggestedLocation = this.suggestStorageLocation(
        receivingOrder.warehouseId,
        item.productId
      );

      return {
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.receivedQuantity - item.damagedQuantity,
        fromLocation: receivingOrder.receiving.dock || 'DOCK-1',
        suggestedLocation: suggestedLocation || 'A-01-R1-S1-B1',
        completedQuantity: 0,
      };
    });

    const task: PutawayTask = {
      id: `putaway-${Date.now()}`,
      warehouseId: receivingOrder.warehouseId,
      receivingOrderId,
      items,
      status: 'pending',
      priority: 'normal',
      createdAt: new Date(),
    };

    this.putawayTasks.set(task.id, task);
    return task;
  }

  /**
   * Suggest storage location
   */
  private suggestStorageLocation(warehouseId: string, productId: string): string | null {
    // Find available locations
    const availableLocations = Array.from(this.locations.values()).filter(
      (loc) =>
        loc.warehouseId === warehouseId &&
        loc.status === 'available' &&
        loc.capacity.currentItems < loc.capacity.maxItems
    );

    if (availableLocations.length === 0) return null;

    // Return first available location (in production, use optimization algorithm)
    return availableLocations[0].locationCode;
  }

  /**
   * Complete putaway
   */
  async completePutaway(params: {
    taskId: string;
    items: {
      productId: string;
      actualLocation: string;
      quantity: number;
    }[];
    completedBy: string;
  }): Promise<void> {
    const task = this.putawayTasks.get(params.taskId);
    if (!task) return;

    // Update task items
    params.items.forEach((item) => {
      const taskItem = task.items.find((i) => i.productId === item.productId);
      if (taskItem) {
        taskItem.actualLocation = item.actualLocation;
        taskItem.completedQuantity = item.quantity;
      }

      // Update storage location inventory
      const location = Array.from(this.locations.values()).find(
        (loc) => loc.locationCode === item.actualLocation && loc.warehouseId === task.warehouseId
      );

      if (location) {
        const existing = location.inventory.find((inv) => inv.productId === item.productId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.lastUpdated = new Date();
        } else {
          location.inventory.push({
            productId: item.productId,
            quantity: item.quantity,
            lastUpdated: new Date(),
          });
        }

        location.capacity.currentItems += item.quantity;
        location.status = 'occupied';
        location.updatedAt = new Date();
      }
    });

    // Check if all items completed
    const allCompleted = task.items.every((i) => i.completedQuantity === i.quantity);
    if (allCompleted) {
      task.status = 'completed';
      task.completedAt = new Date();
    }
  }

  /**
   * Schedule cycle count
   */
  async scheduleCycleCount(params: {
    warehouseId: string;
    type: CycleCount['count']['type'];
    schedule: CycleCount['count']['schedule'];
    locations: string[];
    assignedTo: string;
    scheduledDate: Date;
  }): Promise<CycleCount> {
    const cycleCount: CycleCount = {
      id: `cc-${Date.now()}`,
      warehouseId: params.warehouseId,
      count: {
        type: params.type,
        schedule: params.schedule,
        locations: params.locations,
      },
      items: [],
      assignedTo: params.assignedTo,
      assignedAt: new Date(),
      status: 'scheduled',
      scheduledDate: params.scheduledDate,
      createdAt: new Date(),
    };

    this.cycleCounts.set(cycleCount.id, cycleCount);
    return cycleCount;
  }

  /**
   * Perform cycle count
   */
  async performCycleCount(params: {
    cycleCountId: string;
    counts: {
      productId: string;
      productName: string;
      sku: string;
      location: string;
      systemQuantity: number;
      countedQuantity: number;
      notes?: string;
    }[];
  }): Promise<void> {
    const cycleCount = this.cycleCounts.get(params.cycleCountId);
    if (!cycleCount) return;

    cycleCount.status = 'in_progress';
    cycleCount.startedAt = new Date();

    // Process counts
    cycleCount.items = params.counts.map((count) => ({
      ...count,
      variance: count.countedQuantity - count.systemQuantity,
      variancePercentage:
        count.systemQuantity > 0
          ? ((count.countedQuantity - count.systemQuantity) / count.systemQuantity) * 100
          : 0,
    }));

    cycleCount.completedAt = new Date();
    cycleCount.status = 'completed';

    // Calculate results
    const itemsWithVariance = cycleCount.items.filter((i) => i.variance !== 0).length;
    const totalVariance = cycleCount.items.reduce((sum, i) => sum + Math.abs(i.variance), 0);
    const accuracy =
      cycleCount.items.length > 0
        ? ((cycleCount.items.length - itemsWithVariance) / cycleCount.items.length) * 100
        : 100;

    cycleCount.results = {
      totalItems: cycleCount.items.length,
      itemsCounted: cycleCount.items.length,
      itemsWithVariance,
      totalVariance,
      accuracy: Number(accuracy.toFixed(2)),
    };

    // Auto-approve if accuracy > 98%
    if (accuracy > 98) {
      cycleCount.status = 'approved';
      cycleCount.approvedBy = 'system';
      cycleCount.approvedAt = new Date();
    } else {
      cycleCount.status = 'review';
    }
  }

  /**
   * Create cross-dock operation
   */
  async createCrossDock(params: {
    warehouseId: string;
    receivingOrderId: string;
    fulfillmentOrderIds: string[];
    arrivalTime: Date;
    departureTime: Date;
    items: CrossDockOperation['items'];
  }): Promise<CrossDockOperation> {
    const operation: CrossDockOperation = {
      id: `xdock-${Date.now()}`,
      warehouseId: params.warehouseId,
      inbound: {
        receivingOrderId: params.receivingOrderId,
        arrivalTime: params.arrivalTime,
        dock: 'DOCK-IN-1',
      },
      outbound: {
        fulfillmentOrderIds: params.fulfillmentOrderIds,
        departureTime: params.departureTime,
        dock: 'DOCK-OUT-1',
      },
      items: params.items,
      status: 'scheduled',
      createdAt: new Date(),
    };

    this.crossDockOps.set(operation.id, operation);
    return operation;
  }

  /**
   * Get warehouse metrics
   */
  async getMetrics(period: { start: Date; end: Date }): Promise<WarehouseMetrics> {
    const warehouses = Array.from(this.warehouses.values());
    const activeWarehouses = warehouses.filter((w) => w.status === 'active');

    const totalArea = warehouses.reduce((sum, w) => sum + w.capacity.totalArea, 0);
    const usedArea = warehouses.reduce((sum, w) => sum + w.capacity.usedArea, 0);
    const utilizationRate = totalArea > 0 ? (usedArea / totalArea) * 100 : 0;

    const receivingOrders = Array.from(this.receivingOrders.values()).filter(
      (r) => r.createdAt >= period.start && r.createdAt <= period.end
    );

    const putawayTasks = Array.from(this.putawayTasks.values()).filter(
      (p) => p.createdAt >= period.start && p.createdAt <= period.end
    );

    const cycleCounts = Array.from(this.cycleCounts.values()).filter(
      (c) => c.scheduledDate >= period.start && c.scheduledDate <= period.end
    );

    const completedCycleCounts = cycleCounts.filter(
      (c) => c.status === 'completed' || c.status === 'approved'
    );
    const averageAccuracy =
      completedCycleCounts.length > 0
        ? completedCycleCounts.reduce((sum, c) => sum + (c.results?.accuracy || 0), 0) /
          completedCycleCounts.length
        : 0;

    return {
      period,
      overview: {
        totalWarehouses: warehouses.length,
        activeWarehouses: activeWarehouses.length,
        totalArea: Number(totalArea.toFixed(2)),
        utilizationRate: Number(utilizationRate.toFixed(2)),
        inventoryValue: 5250000, // Mock
      },
      capacity: warehouses.map((w) => ({
        warehouseId: w.id,
        warehouseName: w.name,
        totalArea: w.capacity.totalArea,
        usedArea: w.capacity.usedArea,
        utilizationRate: Number(((w.capacity.usedArea / w.capacity.totalArea) * 100).toFixed(2)),
        palletUtilization: Number(
          ((w.capacity.currentPallets / w.capacity.maxPallets) * 100).toFixed(2)
        ),
      })),
      operations: {
        totalReceivingOrders: receivingOrders.length,
        totalPutaways: putawayTasks.length,
        averagePutawayTime: 25.5, // Mock
        receivingAccuracy: 97.8, // Mock
        cycleCountsCompleted: completedCycleCounts.length,
        inventoryAccuracy: Number(averageAccuracy.toFixed(2)),
      },
      productivity: {
        itemsReceived: receivingOrders.reduce(
          (sum, r) => sum + r.expectedItems.reduce((s, i) => s + i.receivedQuantity, 0),
          0
        ),
        itemsPutaway: putawayTasks.reduce(
          (sum, p) => sum + p.items.reduce((s, i) => s + i.completedQuantity, 0),
          0
        ),
        itemsPicked: 1250, // Mock
        itemsShipped: 1180, // Mock
        averageItemsPerLabor: 45, // Mock
      },
      performance: {
        averageDockToStockTime: 4.2, // Mock
        orderFillRate: 98.5, // Mock
        crossDockEfficiency: 92.3, // Mock
        onTimeShipmentRate: 96.7, // Mock
      },
    };
  }

  /**
   * Get warehouse
   */
  async getWarehouse(warehouseId: string): Promise<Warehouse | null> {
    return this.warehouses.get(warehouseId) || null;
  }

  /**
   * Get all warehouses
   */
  async getAllWarehouses(): Promise<Warehouse[]> {
    return Array.from(this.warehouses.values());
  }
}

// Export singleton instance
export const warehouseManagementSystem = new WarehouseManagementSystem();
