/**
 * Shipping & Logistics Integration System
 *
 * Multi-carrier shipping integration with rate calculation, label generation,
 * tracking, fulfillment, and warehouse management.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ShippingCarrier =
  | 'usps'
  | 'fedex'
  | 'ups'
  | 'dhl'
  | 'amazon-shipping'
  | 'canada-post'
  | 'royal-mail'
  | 'australia-post'
  | 'india-post'
  | 'local-courier';

export type ServiceLevel =
  | 'standard'
  | 'express'
  | 'overnight'
  | 'two-day'
  | 'same-day'
  | 'economy'
  | 'priority'
  | 'international';

export type PackageType = 'envelope' | 'pak' | 'box' | 'tube' | 'pallet' | 'custom';

export type ShipmentStatus =
  | 'pending'
  | 'label-created'
  | 'picked-up'
  | 'in-transit'
  | 'out-for-delivery'
  | 'delivered'
  | 'failed-delivery'
  | 'returned'
  | 'cancelled';

export type FulfillmentStatus =
  | 'pending'
  | 'processing'
  | 'picked'
  | 'packed'
  | 'shipped'
  | 'partially-fulfilled'
  | 'fulfilled'
  | 'cancelled';

export type TrackingEventType =
  | 'label-created'
  | 'picked-up'
  | 'in-transit'
  | 'arrival-scan'
  | 'departure-scan'
  | 'out-for-delivery'
  | 'delivered'
  | 'delivery-attempted'
  | 'exception'
  | 'returned';

export interface Address {
  name: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;

  residential: boolean;

  validation?: {
    validated: boolean;
    validatedAt?: Date;
    suggestions?: Address[];
    issues?: string[];
  };
}

export interface CarrierConfiguration {
  id: string;
  carrier: ShippingCarrier;
  name: string;
  enabled: boolean;

  credentials: {
    accountNumber: string;
    apiKey: string;
    apiSecret?: string;
    userId?: string;
    password?: string;
    environment: 'sandbox' | 'production';
  };

  services: Array<{
    code: string;
    name: string;
    serviceLevel: ServiceLevel;
    estimatedDays: number;
    enabled: boolean;
  }>;

  features: {
    tracking: boolean;
    labelGeneration: boolean;
    rateQuotes: boolean;
    pickupScheduling: boolean;
    signatureRequired: boolean;
    insuranceAvailable: boolean;
    internationalShipping: boolean;
  };

  settings: {
    defaultPackageType: PackageType;
    defaultServiceLevel: ServiceLevel;

    insurance: {
      enabled: boolean;
      maxValue: number;
      feePercentage: number;
    };

    signature: {
      available: boolean;
      fee: number;
    };

    packaging: {
      ownPackaging: boolean;
      carrierPackaging: boolean;
    };
  };

  coverage: {
    domestic: boolean;
    international: boolean;
    countries: string[];
  };

  pricing: {
    markup: {
      type: 'percentage' | 'fixed';
      value: number;
    };
    freeShippingThreshold?: number;
  };

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastSync?: Date;
  };
}

export interface Package {
  id: string;

  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };

  weight: {
    value: number;
    unit: 'lb' | 'oz' | 'kg' | 'g';
  };

  type: PackageType;

  items: Array<{
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    value: number;
    weight: number;
    dimensions?: Package['dimensions'];
    hsCode?: string; // Harmonized System code for customs
    countryOfOrigin?: string;
  }>;

  value: {
    total: number;
    currency: string;
    insurance?: number;
  };

  options: {
    signature: boolean;
    insurance: boolean;
    saturdayDelivery: boolean;
    dangerousGoods: boolean;
    fragile: boolean;
  };
}

export interface ShippingRate {
  id: string;
  carrier: ShippingCarrier;
  serviceName: string;
  serviceLevel: ServiceLevel;
  serviceCode: string;

  cost: {
    amount: number;
    currency: string;

    breakdown: {
      base: number;
      fuel: number;
      insurance: number;
      signature: number;
      additional: number;
    };

    retailRate?: number;
    listRate?: number;
  };

  delivery: {
    estimatedDays: number;
    guaranteedDelivery: boolean;
    estimatedDeliveryDate?: Date;
  };

  features: string[];

  available: boolean;
  errors?: string[];

  createdAt: Date;
}

export interface Shipment {
  id: string;
  orderId: string;
  fulfillmentId?: string;

  carrier: {
    provider: ShippingCarrier;
    service: string;
    serviceLevel: ServiceLevel;
    accountNumber: string;
  };

  tracking: {
    number: string;
    url: string;
    qrCode?: string;
  };

  label: {
    id: string;
    format: 'pdf' | 'png' | 'zpl';
    url: string;
    base64?: string;
    size: '4x6' | '4x8' | '8.5x11';
  };

  addresses: {
    from: Address;
    to: Address;
    returnTo?: Address;
  };

  package: Package;

  rate: ShippingRate;

  status: ShipmentStatus;

  timeline: {
    created: Date;
    labelCreated?: Date;
    pickedUp?: Date;
    inTransit?: Date;
    outForDelivery?: Date;
    delivered?: Date;
    returned?: Date;
    cancelled?: Date;
  };

  delivery: {
    estimatedDate?: Date;
    actualDate?: Date;
    signedBy?: string;
    location?: string;
    instructions?: string;
  };

  customs?: {
    required: boolean;
    forms: Array<{
      type: string;
      number: string;
      url: string;
    }>;
    duties: number;
    taxes: number;
  };

  insurance?: {
    insured: boolean;
    value: number;
    provider: string;
    policyNumber?: string;
  };

  events: TrackingEvent[];

  metadata: {
    notes?: string;
    internalReference?: string;
    customerReference?: string;
    createdBy: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface TrackingEvent {
  id: string;
  type: TrackingEventType;
  status: string;
  description: string;

  location?: {
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  timestamp: Date;

  details?: {
    signedBy?: string;
    exceptionCode?: string;
    exceptionDescription?: string;
    nextSteps?: string;
  };
}

export interface FulfillmentOrder {
  id: string;
  orderId: string;
  warehouseId: string;

  items: Array<{
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    quantityPicked: number;
    quantityPacked: number;
    quantityShipped: number;

    location?: {
      aisle: string;
      bin: string;
      shelf: string;
    };
  }>;

  status: FulfillmentStatus;

  timeline: {
    created: Date;
    processing?: Date;
    picked?: Date;
    packed?: Date;
    shipped?: Date;
    fulfilled?: Date;
    cancelled?: Date;
  };

  assignments: {
    picker?: {
      userId: string;
      name: string;
      assignedAt: Date;
      completedAt?: Date;
    };
    packer?: {
      userId: string;
      name: string;
      assignedAt: Date;
      completedAt?: Date;
    };
  };

  shipments: string[]; // Shipment IDs

  packaging: {
    packages: Package[];
    materials: Array<{
      type: string;
      quantity: number;
    }>;
  };

  shipping: {
    method: string;
    carrier?: ShippingCarrier;
    cost: number;
  };

  priority: 'low' | 'normal' | 'high' | 'urgent';

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;

  address: Address;

  type: 'owned' | 'third-party' | '3pl' | 'dropship';

  capabilities: {
    storage: boolean;
    picking: boolean;
    packing: boolean;
    shipping: boolean;
    returns: boolean;
    kitting: boolean;
    customPackaging: boolean;
  };

  capacity: {
    total: number; // square feet or cubic meters
    used: number;
    available: number;
    unit: 'sqft' | 'cbm';
  };

  zones: Array<{
    id: string;
    name: string;
    type: 'receiving' | 'storage' | 'picking' | 'packing' | 'shipping' | 'returns';
    capacity: number;
    used: number;
  }>;

  inventory: Array<{
    productId: string;
    sku: string;
    quantity: number;
    allocated: number;
    available: number;

    location: {
      zone: string;
      aisle: string;
      bin: string;
      shelf: string;
    };

    reorderPoint: number;
    reorderQuantity: number;
  }>;

  carriers: ShippingCarrier[];

  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  contacts: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
  }>;

  metrics: {
    ordersProcessed: number;
    averagePickTime: number; // minutes
    averagePackTime: number; // minutes
    accuracyRate: number; // percentage
    onTimeShipRate: number; // percentage
  };

  enabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface PickupRequest {
  id: string;
  carrier: ShippingCarrier;

  location: Address;

  date: Date;
  timeWindow: {
    start: string; // HH:MM
    end: string; // HH:MM
  };

  packages: {
    count: number;
    totalWeight: number;
  };

  shipments: string[]; // Shipment IDs

  status: 'requested' | 'confirmed' | 'completed' | 'failed' | 'cancelled';

  confirmation: {
    number?: string;
    confirmedAt?: Date;
  };

  instructions?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;

  conditions: Array<{
    field: string;
    operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'in';
    value: any;
  }>;

  actions: {
    carrier?: ShippingCarrier;
    serviceLevel?: ServiceLevel;
    warehouse?: string;
    freeShipping?: boolean;
    markup?: number;
    maxCost?: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnShipment {
  id: string;
  originalShipmentId: string;
  orderId: string;
  returnId: string;

  carrier: {
    provider: ShippingCarrier;
    service: string;
  };

  tracking: {
    number: string;
    url: string;
  };

  label: {
    url: string;
    format: 'pdf' | 'png';
  };

  items: Array<{
    productId: string;
    sku: string;
    quantity: number;
    reason: string;
  }>;

  status: ShipmentStatus;

  cost: {
    amount: number;
    paidBy: 'customer' | 'merchant';
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  shipments: {
    total: number;
    delivered: number;
    inTransit: number;
    failed: number;
    returned: number;

    deliveryRate: number; // percentage
    onTimeRate: number; // percentage

    averageDeliveryTime: number; // days
  };

  byCarrier: Array<{
    carrier: ShippingCarrier;
    shipments: number;
    cost: number;
    deliveryRate: number;
    averageDeliveryTime: number;
  }>;

  byServiceLevel: Array<{
    serviceLevel: ServiceLevel;
    shipments: number;
    cost: number;
  }>;

  byDestination: Array<{
    country: string;
    state?: string;
    shipments: number;
    cost: number;
  }>;

  costs: {
    total: number;
    average: number;
    byCarrier: Record<ShippingCarrier, number>;
  };

  fulfillment: {
    averagePickTime: number;
    averagePackTime: number;
    averageShipTime: number;
    totalCycleTime: number;
  };

  issues: {
    totalExceptions: number;
    deliveryAttempts: number;
    lostPackages: number;
    damagedPackages: number;
  };
}

// ============================================================================
// Main System Class
// ============================================================================

export class ShippingLogisticsIntegrationSystem {
  private carriers: Map<ShippingCarrier, CarrierConfiguration> = new Map();
  private shipments: Map<string, Shipment> = new Map();
  private fulfillmentOrders: Map<string, FulfillmentOrder> = new Map();
  private warehouses: Map<string, Warehouse> = new Map();
  private pickupRequests: Map<string, PickupRequest> = new Map();
  private shippingRules: Map<string, ShippingRule> = new Map();
  private returnShipments: Map<string, ReturnShipment> = new Map();

  constructor() {
    this.initializeCarriers();
    this.initializeWarehouses();
    this.initializeRules();
  }

  // ============================================================================
  // Carrier Configuration
  // ============================================================================

  configureCarrier(params: {
    carrier: ShippingCarrier;
    name: string;
    credentials: CarrierConfiguration['credentials'];
    services: CarrierConfiguration['services'];
  }): CarrierConfiguration {
    const config: CarrierConfiguration = {
      id: `carrier_${params.carrier}_${Date.now()}`,
      carrier: params.carrier,
      name: params.name,
      enabled: false,
      credentials: params.credentials,
      services: params.services,
      features: {
        tracking: true,
        labelGeneration: true,
        rateQuotes: true,
        pickupScheduling: true,
        signatureRequired: true,
        insuranceAvailable: true,
        internationalShipping: params.carrier !== 'local-courier',
      },
      settings: {
        defaultPackageType: 'box',
        defaultServiceLevel: 'standard',
        insurance: {
          enabled: true,
          maxValue: 5000,
          feePercentage: 1.5,
        },
        signature: {
          available: true,
          fee: 5.0,
        },
        packaging: {
          ownPackaging: true,
          carrierPackaging: true,
        },
      },
      coverage: {
        domestic: true,
        international: params.carrier !== 'local-courier',
        countries: params.carrier === 'local-courier' ? ['US'] : ['US', 'CA', 'GB', 'AU', 'IN'],
      },
      pricing: {
        markup: {
          type: 'percentage',
          value: 10,
        },
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    this.carriers.set(params.carrier, config);
    return config;
  }

  enableCarrier(carrier: ShippingCarrier): CarrierConfiguration {
    const config = this.carriers.get(carrier);
    if (!config) throw new Error('Carrier not configured');

    config.enabled = true;
    config.metadata.updatedAt = new Date();

    return config;
  }

  // ============================================================================
  // Rate Calculation
  // ============================================================================

  async getRates(params: {
    from: Address;
    to: Address;
    package: Package;
    carriers?: ShippingCarrier[];
  }): Promise<ShippingRate[]> {
    const carriers = params.carriers || Array.from(this.carriers.keys());
    const rates: ShippingRate[] = [];

    for (const carrier of carriers) {
      const config = this.carriers.get(carrier);
      if (!config || !config.enabled) continue;

      // Check coverage
      if (!this.isDestinationCovered(config, params.to.country)) continue;

      // Get rates for each service
      for (const service of config.services.filter((s) => s.enabled)) {
        const rate = await this.calculateRate({
          carrier,
          service,
          from: params.from,
          to: params.to,
          package: params.package,
          config,
        });

        rates.push(rate);
      }
    }

    // Sort by cost
    return rates.sort((a, b) => a.cost.amount - b.cost.amount);
  }

  private async calculateRate(params: {
    carrier: ShippingCarrier;
    service: CarrierConfiguration['services'][0];
    from: Address;
    to: Address;
    package: Package;
    config: CarrierConfiguration;
  }): Promise<ShippingRate> {
    // Simulate API call to carrier
    await this.delay(100 + Math.random() * 200);

    const distance = this.calculateDistance(params.from, params.to);
    const weight = params.package.weight.value;

    // Base calculation
    let baseRate = 5.99;

    // Weight-based pricing
    if (weight <= 1) baseRate += 0;
    else if (weight <= 5) baseRate += (weight - 1) * 1.5;
    else if (weight <= 10) baseRate += 6 + (weight - 5) * 1.2;
    else baseRate += 12 + (weight - 10) * 1.0;

    // Distance-based pricing
    if (distance > 1000) baseRate += 5;
    else if (distance > 500) baseRate += 3;
    else if (distance > 100) baseRate += 1;

    // Service level multiplier
    const multipliers: Record<ServiceLevel, number> = {
      economy: 0.8,
      standard: 1.0,
      express: 1.5,
      'two-day': 1.3,
      overnight: 2.5,
      'same-day': 3.5,
      priority: 1.4,
      international: 2.0,
    };

    baseRate *= multipliers[params.service.serviceLevel] || 1.0;

    // Fuel surcharge
    const fuelSurcharge = baseRate * 0.12;

    // Insurance
    const insuranceFee = params.package.options.insurance
      ? params.package.value.total * (params.config.settings.insurance.feePercentage / 100)
      : 0;

    // Signature
    const signatureFee = params.package.options.signature
      ? params.config.settings.signature.fee
      : 0;

    const total = baseRate + fuelSurcharge + insuranceFee + signatureFee;

    // Apply markup
    const finalAmount =
      params.config.pricing.markup.type === 'percentage'
        ? total * (1 + params.config.pricing.markup.value / 100)
        : total + params.config.pricing.markup.value;

    const rate: ShippingRate = {
      id: `rate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      carrier: params.carrier,
      serviceName: params.service.name,
      serviceLevel: params.service.serviceLevel,
      serviceCode: params.service.code,
      cost: {
        amount: parseFloat(finalAmount.toFixed(2)),
        currency: 'USD',
        breakdown: {
          base: parseFloat(baseRate.toFixed(2)),
          fuel: parseFloat(fuelSurcharge.toFixed(2)),
          insurance: parseFloat(insuranceFee.toFixed(2)),
          signature: parseFloat(signatureFee.toFixed(2)),
          additional: 0,
        },
        retailRate: parseFloat(total.toFixed(2)),
      },
      delivery: {
        estimatedDays: params.service.estimatedDays,
        guaranteedDelivery:
          params.service.serviceLevel === 'overnight' || params.service.serviceLevel === 'same-day',
        estimatedDeliveryDate: new Date(
          Date.now() + params.service.estimatedDays * 24 * 60 * 60 * 1000
        ),
      },
      features: this.getServiceFeatures(params.service.serviceLevel),
      available: true,
      createdAt: new Date(),
    };

    return rate;
  }

  // ============================================================================
  // Shipment Creation
  // ============================================================================

  async createShipment(params: {
    orderId: string;
    from: Address;
    to: Address;
    package: Package;
    carrier: ShippingCarrier;
    serviceLevel: ServiceLevel;
    returnAddress?: Address;
  }): Promise<Shipment> {
    const config = this.carriers.get(params.carrier);
    if (!config || !config.enabled) throw new Error('Carrier not available');

    const service = config.services.find((s) => s.serviceLevel === params.serviceLevel);
    if (!service) throw new Error('Service not available');

    // Get rate
    const rate = await this.calculateRate({
      carrier: params.carrier,
      service,
      from: params.from,
      to: params.to,
      package: params.package,
      config,
    });

    // Generate tracking number
    const trackingNumber = this.generateTrackingNumber(params.carrier);

    // Create shipment
    const shipment: Shipment = {
      id: `ship_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: params.orderId,
      carrier: {
        provider: params.carrier,
        service: service.name,
        serviceLevel: params.serviceLevel,
        accountNumber: config.credentials.accountNumber,
      },
      tracking: {
        number: trackingNumber,
        url: this.generateTrackingUrl(params.carrier, trackingNumber),
      },
      label: {
        id: `label_${Date.now()}`,
        format: 'pdf',
        url: `https://labels.example.com/${trackingNumber}.pdf`,
        size: '4x6',
      },
      addresses: {
        from: params.from,
        to: params.to,
        returnTo: params.returnAddress || params.from,
      },
      package: params.package,
      rate,
      status: 'label-created',
      timeline: {
        created: new Date(),
        labelCreated: new Date(),
      },
      delivery: {
        estimatedDate: rate.delivery.estimatedDeliveryDate,
      },
      events: [
        {
          id: `evt_${Date.now()}`,
          type: 'label-created',
          status: 'Label Created',
          description: 'Shipping label has been created',
          timestamp: new Date(),
        },
      ],
      metadata: {
        createdBy: 'system',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add customs if international
    if (params.to.country !== params.from.country) {
      shipment.customs = {
        required: true,
        forms: [
          {
            type: 'CN22',
            number: `CN22_${Date.now()}`,
            url: `https://customs.example.com/${trackingNumber}_CN22.pdf`,
          },
        ],
        duties: params.package.value.total * 0.05,
        taxes: params.package.value.total * 0.08,
      };
    }

    // Add insurance if requested
    if (params.package.options.insurance) {
      shipment.insurance = {
        insured: true,
        value: params.package.value.insurance || params.package.value.total,
        provider: params.carrier,
      };
    }

    this.shipments.set(shipment.id, shipment);

    // Start tracking simulation
    this.simulateShipmentTracking(shipment.id);

    return shipment;
  }

  // ============================================================================
  // Tracking
  // ============================================================================

  async trackShipment(trackingNumber: string): Promise<Shipment | null> {
    const shipment = Array.from(this.shipments.values()).find(
      (s) => s.tracking.number === trackingNumber
    );

    if (!shipment) return null;

    // In a real implementation, this would call the carrier's tracking API
    return shipment;
  }

  addTrackingEvent(shipmentId: string, event: Omit<TrackingEvent, 'id'>): Shipment {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) throw new Error('Shipment not found');

    const trackingEvent: TrackingEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...event,
    };

    shipment.events.push(trackingEvent);

    // Update status based on event type
    switch (event.type) {
      case 'picked-up':
        shipment.status = 'picked-up';
        shipment.timeline.pickedUp = event.timestamp;
        break;
      case 'in-transit':
        shipment.status = 'in-transit';
        shipment.timeline.inTransit = event.timestamp;
        break;
      case 'out-for-delivery':
        shipment.status = 'out-for-delivery';
        shipment.timeline.outForDelivery = event.timestamp;
        break;
      case 'delivered':
        shipment.status = 'delivered';
        shipment.timeline.delivered = event.timestamp;
        shipment.delivery.actualDate = event.timestamp;
        if (event.details?.signedBy) {
          shipment.delivery.signedBy = event.details.signedBy;
        }
        break;
      case 'returned':
        shipment.status = 'returned';
        shipment.timeline.returned = event.timestamp;
        break;
    }

    shipment.updatedAt = new Date();
    return shipment;
  }

  // ============================================================================
  // Fulfillment
  // ============================================================================

  createFulfillmentOrder(params: {
    orderId: string;
    warehouseId: string;
    items: FulfillmentOrder['items'];
    shippingMethod: string;
    priority?: FulfillmentOrder['priority'];
  }): FulfillmentOrder {
    const warehouse = this.warehouses.get(params.warehouseId);
    if (!warehouse) throw new Error('Warehouse not found');

    const fulfillment: FulfillmentOrder = {
      id: `ffl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: params.orderId,
      warehouseId: params.warehouseId,
      items: params.items.map((item) => ({
        ...item,
        quantityPicked: 0,
        quantityPacked: 0,
        quantityShipped: 0,
      })),
      status: 'pending',
      timeline: {
        created: new Date(),
      },
      assignments: {},
      shipments: [],
      packaging: {
        packages: [],
        materials: [],
      },
      shipping: {
        method: params.shippingMethod,
        cost: 0,
      },
      priority: params.priority || 'normal',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.fulfillmentOrders.set(fulfillment.id, fulfillment);
    return fulfillment;
  }

  assignPicker(fulfillmentId: string, userId: string, name: string): FulfillmentOrder {
    const fulfillment = this.fulfillmentOrders.get(fulfillmentId);
    if (!fulfillment) throw new Error('Fulfillment order not found');

    fulfillment.status = 'processing';
    fulfillment.timeline.processing = new Date();
    fulfillment.assignments.picker = {
      userId,
      name,
      assignedAt: new Date(),
    };
    fulfillment.updatedAt = new Date();

    return fulfillment;
  }

  completePicking(
    fulfillmentId: string,
    pickedItems: Array<{ sku: string; quantity: number }>
  ): FulfillmentOrder {
    const fulfillment = this.fulfillmentOrders.get(fulfillmentId);
    if (!fulfillment) throw new Error('Fulfillment order not found');

    pickedItems.forEach((picked) => {
      const item = fulfillment.items.find((i) => i.sku === picked.sku);
      if (item) {
        item.quantityPicked = picked.quantity;
      }
    });

    const allPicked = fulfillment.items.every((i) => i.quantityPicked >= i.quantity);

    if (allPicked) {
      fulfillment.status = 'picked';
      fulfillment.timeline.picked = new Date();
      if (fulfillment.assignments.picker) {
        fulfillment.assignments.picker.completedAt = new Date();
      }
    }

    fulfillment.updatedAt = new Date();
    return fulfillment;
  }

  assignPacker(fulfillmentId: string, userId: string, name: string): FulfillmentOrder {
    const fulfillment = this.fulfillmentOrders.get(fulfillmentId);
    if (!fulfillment) throw new Error('Fulfillment order not found');
    if (fulfillment.status !== 'picked') throw new Error('Order not ready for packing');

    fulfillment.assignments.packer = {
      userId,
      name,
      assignedAt: new Date(),
    };
    fulfillment.updatedAt = new Date();

    return fulfillment;
  }

  completePacking(fulfillmentId: string, packages: Package[]): FulfillmentOrder {
    const fulfillment = this.fulfillmentOrders.get(fulfillmentId);
    if (!fulfillment) throw new Error('Fulfillment order not found');

    fulfillment.packaging.packages = packages;
    fulfillment.status = 'packed';
    fulfillment.timeline.packed = new Date();

    if (fulfillment.assignments.packer) {
      fulfillment.assignments.packer.completedAt = new Date();
    }

    fulfillment.updatedAt = new Date();
    return fulfillment;
  }

  async shipFulfillmentOrder(
    fulfillmentId: string,
    params: {
      carrier: ShippingCarrier;
      serviceLevel: ServiceLevel;
      from: Address;
      to: Address;
    }
  ): Promise<FulfillmentOrder> {
    const fulfillment = this.fulfillmentOrders.get(fulfillmentId);
    if (!fulfillment) throw new Error('Fulfillment order not found');
    if (fulfillment.status !== 'packed') throw new Error('Order not ready for shipping');

    // Create shipments for each package
    for (const pkg of fulfillment.packaging.packages) {
      const shipment = await this.createShipment({
        orderId: fulfillment.orderId,
        from: params.from,
        to: params.to,
        package: pkg,
        carrier: params.carrier,
        serviceLevel: params.serviceLevel,
      });

      fulfillment.shipments.push(shipment.id);
      fulfillment.shipping.cost += shipment.rate.cost.amount;
      fulfillment.shipping.carrier = params.carrier;
    }

    fulfillment.status = 'shipped';
    fulfillment.timeline.shipped = new Date();
    fulfillment.updatedAt = new Date();

    return fulfillment;
  }

  // ============================================================================
  // Warehouse Management
  // ============================================================================

  createWarehouse(params: {
    name: string;
    code: string;
    address: Address;
    type: Warehouse['type'];
  }): Warehouse {
    const warehouse: Warehouse = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      code: params.code,
      address: params.address,
      type: params.type,
      capabilities: {
        storage: true,
        picking: true,
        packing: true,
        shipping: true,
        returns: true,
        kitting: false,
        customPackaging: false,
      },
      capacity: {
        total: 50000,
        used: 15000,
        available: 35000,
        unit: 'sqft',
      },
      zones: [
        { id: 'receiving', name: 'Receiving', type: 'receiving', capacity: 5000, used: 1200 },
        { id: 'storage', name: 'Main Storage', type: 'storage', capacity: 30000, used: 10000 },
        { id: 'picking', name: 'Picking Area', type: 'picking', capacity: 5000, used: 1500 },
        { id: 'packing', name: 'Packing Stations', type: 'packing', capacity: 3000, used: 800 },
        { id: 'shipping', name: 'Shipping Dock', type: 'shipping', capacity: 5000, used: 1200 },
        { id: 'returns', name: 'Returns Processing', type: 'returns', capacity: 2000, used: 300 },
      ],
      inventory: [],
      carriers: ['usps', 'fedex', 'ups'],
      operatingHours: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' },
      },
      contacts: [],
      metrics: {
        ordersProcessed: 0,
        averagePickTime: 15,
        averagePackTime: 10,
        accuracyRate: 99.5,
        onTimeShipRate: 98.5,
      },
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.warehouses.set(warehouse.id, warehouse);
    return warehouse;
  }

  updateInventory(warehouseId: string, productId: string, quantity: number): Warehouse {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) throw new Error('Warehouse not found');

    const existing = warehouse.inventory.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity += quantity;
      existing.available = existing.quantity - existing.allocated;
    } else {
      warehouse.inventory.push({
        productId,
        sku: `SKU-${productId}`,
        quantity,
        allocated: 0,
        available: quantity,
        location: {
          zone: 'storage',
          aisle: 'A1',
          bin: 'B1',
          shelf: 'S1',
        },
        reorderPoint: 10,
        reorderQuantity: 50,
      });
    }

    warehouse.updatedAt = new Date();
    return warehouse;
  }

  allocateInventory(warehouseId: string, productId: string, quantity: number): void {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) throw new Error('Warehouse not found');

    const item = warehouse.inventory.find((i) => i.productId === productId);
    if (!item) throw new Error('Product not found in warehouse');
    if (item.available < quantity) throw new Error('Insufficient inventory');

    item.allocated += quantity;
    item.available -= quantity;
  }

  // ============================================================================
  // Pickup Requests
  // ============================================================================

  schedulePickup(params: {
    carrier: ShippingCarrier;
    location: Address;
    date: Date;
    timeWindow: PickupRequest['timeWindow'];
    shipments: string[];
  }): PickupRequest {
    const config = this.carriers.get(params.carrier);
    if (!config || !config.features.pickupScheduling) {
      throw new Error('Carrier does not support pickup scheduling');
    }

    const shipments = params.shipments
      .map((id) => this.shipments.get(id))
      .filter((s) => s !== undefined) as Shipment[];

    const totalWeight = shipments.reduce((sum, s) => sum + s.package.weight.value, 0);

    const pickup: PickupRequest = {
      id: `pickup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      carrier: params.carrier,
      location: params.location,
      date: params.date,
      timeWindow: params.timeWindow,
      packages: {
        count: shipments.length,
        totalWeight,
      },
      shipments: params.shipments,
      status: 'requested',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate confirmation
    setTimeout(() => {
      pickup.status = 'confirmed';
      pickup.confirmation = {
        number: `PICKUP${Date.now()}`,
        confirmedAt: new Date(),
      };
    }, 2000);

    this.pickupRequests.set(pickup.id, pickup);
    return pickup;
  }

  // ============================================================================
  // Returns
  // ============================================================================

  createReturnLabel(params: {
    originalShipmentId: string;
    returnId: string;
    items: ReturnShipment['items'];
    paidBy: 'customer' | 'merchant';
  }): ReturnShipment {
    const originalShipment = this.shipments.get(params.originalShipmentId);
    if (!originalShipment) throw new Error('Original shipment not found');

    const trackingNumber = this.generateTrackingNumber(originalShipment.carrier.provider);

    const returnShipment: ReturnShipment = {
      id: `rtn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalShipmentId: params.originalShipmentId,
      orderId: originalShipment.orderId,
      returnId: params.returnId,
      carrier: {
        provider: originalShipment.carrier.provider,
        service: 'Standard Return',
      },
      tracking: {
        number: trackingNumber,
        url: this.generateTrackingUrl(originalShipment.carrier.provider, trackingNumber),
      },
      label: {
        url: `https://labels.example.com/return_${trackingNumber}.pdf`,
        format: 'pdf',
      },
      items: params.items,
      status: 'label-created',
      cost: {
        amount: params.paidBy === 'customer' ? 8.99 : 0,
        paidBy: params.paidBy,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.returnShipments.set(returnShipment.id, returnShipment);
    return returnShipment;
  }

  // ============================================================================
  // Analytics
  // ============================================================================

  getShippingAnalytics(period: { start: Date; end: Date }): ShippingAnalytics {
    const shipmentsInPeriod = Array.from(this.shipments.values()).filter(
      (s) => s.createdAt >= period.start && s.createdAt <= period.end
    );

    const delivered = shipmentsInPeriod.filter((s) => s.status === 'delivered');
    const inTransit = shipmentsInPeriod.filter(
      (s) =>
        s.status === 'in-transit' || s.status === 'out-for-delivery' || s.status === 'picked-up'
    );
    const failed = shipmentsInPeriod.filter((s) => s.status === 'failed-delivery');
    const returned = shipmentsInPeriod.filter((s) => s.status === 'returned');

    const analytics: ShippingAnalytics = {
      period,
      shipments: {
        total: shipmentsInPeriod.length,
        delivered: delivered.length,
        inTransit: inTransit.length,
        failed: failed.length,
        returned: returned.length,
        deliveryRate: (delivered.length / shipmentsInPeriod.length) * 100 || 0,
        onTimeRate: this.calculateOnTimeRate(delivered),
        averageDeliveryTime: this.calculateAverageDeliveryTime(delivered),
      },
      byCarrier: this.getCarrierAnalytics(shipmentsInPeriod),
      byServiceLevel: this.getServiceLevelAnalytics(shipmentsInPeriod),
      byDestination: this.getDestinationAnalytics(shipmentsInPeriod),
      costs: {
        total: shipmentsInPeriod.reduce((sum, s) => sum + s.rate.cost.amount, 0),
        average:
          shipmentsInPeriod.reduce((sum, s) => sum + s.rate.cost.amount, 0) /
            shipmentsInPeriod.length || 0,
        byCarrier: {} as Record<ShippingCarrier, number>,
      },
      fulfillment: {
        averagePickTime: 15,
        averagePackTime: 10,
        averageShipTime: 5,
        totalCycleTime: 30,
      },
      issues: {
        totalExceptions: this.countExceptions(shipmentsInPeriod),
        deliveryAttempts: failed.length,
        lostPackages: 0,
        damagedPackages: 0,
      },
    };

    return analytics;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private generateTrackingNumber(carrier: ShippingCarrier): string {
    const prefix = carrier.toUpperCase().slice(0, 3);
    const random = Math.random().toString(36).substr(2, 12).toUpperCase();
    return `${prefix}${random}`;
  }

  private generateTrackingUrl(carrier: ShippingCarrier, trackingNumber: string): string {
    const urls: Record<ShippingCarrier, string> = {
      usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      fedex: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
      ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      dhl: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
      'amazon-shipping': `https://track.amazon.com/${trackingNumber}`,
      'canada-post': `https://www.canadapost.ca/track/${trackingNumber}`,
      'royal-mail': `https://www.royalmail.com/track-your-item?trackNumber=${trackingNumber}`,
      'australia-post': `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`,
      'india-post': `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consignmentno=${trackingNumber}`,
      'local-courier': `https://example.com/track/${trackingNumber}`,
    };

    return urls[carrier] || `https://example.com/track/${trackingNumber}`;
  }

  private calculateDistance(from: Address, to: Address): number {
    // Simplified distance calculation (in reality would use proper geocoding)
    if (from.country !== to.country) return 2000;
    if (from.state !== to.state) return 500;
    if (from.city !== to.city) return 100;
    return 10;
  }

  private isDestinationCovered(config: CarrierConfiguration, country: string): boolean {
    return config.coverage.countries.includes(country);
  }

  private getServiceFeatures(serviceLevel: ServiceLevel): string[] {
    const features: Record<ServiceLevel, string[]> = {
      economy: ['Basic tracking', 'No delivery guarantee'],
      standard: ['Full tracking', 'Standard delivery'],
      express: ['Priority handling', 'Expedited delivery', 'Full tracking'],
      'two-day': ['Guaranteed 2-day delivery', 'Full tracking', 'Priority handling'],
      overnight: ['Next-day delivery', 'Money-back guarantee', 'Premium tracking'],
      'same-day': ['Same-day delivery', 'Real-time tracking', 'Premium service'],
      priority: ['Priority handling', 'Enhanced tracking'],
      international: ['Customs clearance', 'International tracking'],
    };

    return features[serviceLevel] || ['Standard service'];
  }

  private calculateOnTimeRate(deliveredShipments: Shipment[]): number {
    const onTime = deliveredShipments.filter((s) => {
      if (!s.delivery.estimatedDate || !s.delivery.actualDate) return false;
      return s.delivery.actualDate <= s.delivery.estimatedDate;
    });

    return (onTime.length / deliveredShipments.length) * 100 || 0;
  }

  private calculateAverageDeliveryTime(deliveredShipments: Shipment[]): number {
    const times = deliveredShipments
      .filter((s) => s.timeline.created && s.timeline.delivered)
      .map((s) => {
        const created = s.timeline.created.getTime();
        const delivered = s.timeline.delivered!.getTime();
        return (delivered - created) / (1000 * 60 * 60 * 24); // days
      });

    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  private getCarrierAnalytics(shipments: Shipment[]): ShippingAnalytics['byCarrier'] {
    const carriers = Array.from(new Set(shipments.map((s) => s.carrier.provider)));

    return carriers.map((carrier) => {
      const carrierShipments = shipments.filter((s) => s.carrier.provider === carrier);
      const delivered = carrierShipments.filter((s) => s.status === 'delivered');

      return {
        carrier,
        shipments: carrierShipments.length,
        cost: carrierShipments.reduce((sum, s) => sum + s.rate.cost.amount, 0),
        deliveryRate: (delivered.length / carrierShipments.length) * 100 || 0,
        averageDeliveryTime: this.calculateAverageDeliveryTime(delivered),
      };
    });
  }

  private getServiceLevelAnalytics(shipments: Shipment[]): ShippingAnalytics['byServiceLevel'] {
    const levels = Array.from(new Set(shipments.map((s) => s.carrier.serviceLevel)));

    return levels.map((serviceLevel) => {
      const levelShipments = shipments.filter((s) => s.carrier.serviceLevel === serviceLevel);

      return {
        serviceLevel,
        shipments: levelShipments.length,
        cost: levelShipments.reduce((sum, s) => sum + s.rate.cost.amount, 0),
      };
    });
  }

  private getDestinationAnalytics(shipments: Shipment[]): ShippingAnalytics['byDestination'] {
    const destinations = new Map<string, { shipments: number; cost: number }>();

    shipments.forEach((s) => {
      const key = s.addresses.to.country;
      const existing = destinations.get(key) || { shipments: 0, cost: 0 };
      destinations.set(key, {
        shipments: existing.shipments + 1,
        cost: existing.cost + s.rate.cost.amount,
      });
    });

    return Array.from(destinations.entries()).map(([country, data]) => ({
      country,
      shipments: data.shipments,
      cost: data.cost,
    }));
  }

  private countExceptions(shipments: Shipment[]): number {
    return shipments.reduce((count, s) => {
      return count + s.events.filter((e) => e.type === 'exception').length;
    }, 0);
  }

  private simulateShipmentTracking(shipmentId: string): void {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) return;

    const events: Array<{ type: TrackingEventType; delay: number; description: string }> = [
      { type: 'picked-up', delay: 2000, description: 'Package picked up by carrier' },
      { type: 'in-transit', delay: 4000, description: 'Package in transit' },
      { type: 'arrival-scan', delay: 6000, description: 'Arrived at sorting facility' },
      { type: 'departure-scan', delay: 8000, description: 'Departed from facility' },
      { type: 'out-for-delivery', delay: 10000, description: 'Out for delivery' },
      { type: 'delivered', delay: 12000, description: 'Package delivered' },
    ];

    events.forEach(({ type, delay, description }) => {
      setTimeout(() => {
        this.addTrackingEvent(shipmentId, {
          type,
          status: description,
          description,
          timestamp: new Date(),
        });
      }, delay);
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  private initializeCarriers(): void {
    // Configure USPS
    this.configureCarrier({
      carrier: 'usps',
      name: 'United States Postal Service',
      credentials: {
        accountNumber: 'USPS123456',
        apiKey: 'usps_test_key',
        environment: 'sandbox',
      },
      services: [
        {
          code: 'USPS_PRIORITY',
          name: 'Priority Mail',
          serviceLevel: 'priority',
          estimatedDays: 3,
          enabled: true,
        },
        {
          code: 'USPS_EXPRESS',
          name: 'Priority Mail Express',
          serviceLevel: 'overnight',
          estimatedDays: 1,
          enabled: true,
        },
        {
          code: 'USPS_FIRST',
          name: 'First-Class Mail',
          serviceLevel: 'standard',
          estimatedDays: 5,
          enabled: true,
        },
      ],
    });
    this.enableCarrier('usps');

    // Configure FedEx
    this.configureCarrier({
      carrier: 'fedex',
      name: 'FedEx',
      credentials: {
        accountNumber: 'FEDEX789012',
        apiKey: 'fedex_test_key',
        apiSecret: 'fedex_test_secret',
        environment: 'sandbox',
      },
      services: [
        {
          code: 'FEDEX_GROUND',
          name: 'FedEx Ground',
          serviceLevel: 'standard',
          estimatedDays: 5,
          enabled: true,
        },
        {
          code: 'FEDEX_2DAY',
          name: 'FedEx 2Day',
          serviceLevel: 'two-day',
          estimatedDays: 2,
          enabled: true,
        },
        {
          code: 'FEDEX_OVERNIGHT',
          name: 'FedEx Standard Overnight',
          serviceLevel: 'overnight',
          estimatedDays: 1,
          enabled: true,
        },
        {
          code: 'FEDEX_EXPRESS',
          name: 'FedEx International Priority',
          serviceLevel: 'international',
          estimatedDays: 3,
          enabled: true,
        },
      ],
    });
    this.enableCarrier('fedex');

    // Configure UPS
    this.configureCarrier({
      carrier: 'ups',
      name: 'UPS',
      credentials: {
        accountNumber: 'UPS345678',
        apiKey: 'ups_test_key',
        apiSecret: 'ups_test_secret',
        userId: 'ups_user',
        environment: 'sandbox',
      },
      services: [
        {
          code: 'UPS_GROUND',
          name: 'UPS Ground',
          serviceLevel: 'standard',
          estimatedDays: 5,
          enabled: true,
        },
        {
          code: 'UPS_3DAY',
          name: 'UPS 3 Day Select',
          serviceLevel: 'express',
          estimatedDays: 3,
          enabled: true,
        },
        {
          code: 'UPS_2DAY',
          name: 'UPS 2nd Day Air',
          serviceLevel: 'two-day',
          estimatedDays: 2,
          enabled: true,
        },
        {
          code: 'UPS_NEXTDAY',
          name: 'UPS Next Day Air',
          serviceLevel: 'overnight',
          estimatedDays: 1,
          enabled: true,
        },
      ],
    });
    this.enableCarrier('ups');
  }

  private initializeWarehouses(): void {
    // Create default warehouse
    this.createWarehouse({
      name: 'Main Distribution Center',
      code: 'MDC-01',
      address: {
        name: 'Main Warehouse',
        line1: '123 Logistics Way',
        city: 'Commerce',
        state: 'CA',
        postalCode: '90040',
        country: 'US',
        residential: false,
      },
      type: 'owned',
    });
  }

  private initializeRules(): void {
    // Free shipping rule
    const freeShippingRule: ShippingRule = {
      id: `rule_${Date.now()}_1`,
      name: 'Free Shipping Over $50',
      enabled: true,
      priority: 1,
      conditions: [{ field: 'order.total', operator: 'greater-than', value: 50 }],
      actions: {
        freeShipping: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.shippingRules.set(freeShippingRule.id, freeShippingRule);
  }

  // ============================================================================
  // Query Methods
  // ============================================================================

  getShipmentsByOrder(orderId: string): Shipment[] {
    return Array.from(this.shipments.values()).filter((s) => s.orderId === orderId);
  }

  getFulfillmentsByStatus(status: FulfillmentStatus): FulfillmentOrder[] {
    return Array.from(this.fulfillmentOrders.values()).filter((f) => f.status === status);
  }

  getWarehouseInventory(warehouseId: string): Warehouse['inventory'] {
    const warehouse = this.warehouses.get(warehouseId);
    return warehouse?.inventory || [];
  }

  getPendingPickups(): PickupRequest[] {
    return Array.from(this.pickupRequests.values()).filter(
      (p) => p.status === 'requested' || p.status === 'confirmed'
    );
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const shippingLogisticsIntegration = new ShippingLogisticsIntegrationSystem();
