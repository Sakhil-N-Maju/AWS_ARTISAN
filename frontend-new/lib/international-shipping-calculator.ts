/**
 * International Shipping Calculator
 *
 * Calculates international shipping costs:
 * - Multi-carrier support
 * - Weight-based pricing
 * - Zone-based pricing
 * - Dimensional weight
 * - Customs handling
 * - Delivery time estimates
 */

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  baseDeliveryDays: number;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  type: 'express' | 'standard' | 'economy';

  // Coverage
  domesticCountries: string[];
  internationalZones: string[];

  // Pricing
  pricing: {
    baseRate: number;
    perKgRate: number;
    currency: string;
    dimensionalFactor: number; // For volumetric weight
  };

  // Limits
  limits: {
    maxWeight: number; // kg
    maxLength: number; // cm
    maxWidth: number; // cm
    maxHeight: number; // cm
  };

  // Features
  features: {
    tracking: boolean;
    insurance: boolean;
    signatureRequired: boolean;
    customsClearance: boolean;
  };

  isActive: boolean;
}

export interface ShipmentDimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
  weight: number; // kg
}

export interface ShippingAddress {
  country: string;
  state?: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
}

export interface ShippingQuote {
  id: string;
  carrier: {
    id: string;
    name: string;
    type: string;
  };

  // Costs
  costs: {
    baseCost: number;
    weightCost: number;
    zoneSurcharge: number;
    fuelSurcharge: number;
    insuranceCost: number;
    customsHandling: number;
    total: number;
    currency: string;
  };

  // Delivery
  delivery: {
    estimatedDays: number;
    estimatedDate: Date;
    guaranteedDate?: Date;
  };

  // Details
  details: {
    actualWeight: number;
    volumetricWeight: number;
    chargeableWeight: number;
    zone: string;
  };

  validUntil: Date;
}

export interface Shipment {
  id: string;
  orderId: string;

  // Routing
  origin: ShippingAddress;
  destination: ShippingAddress;

  // Package
  package: ShipmentDimensions;
  contents: {
    description: string;
    value: number;
    currency: string;
    quantity: number;
  }[];

  // Carrier
  carrier: {
    id: string;
    name: string;
    trackingNumber?: string;
  };

  // Costs
  shipping: {
    cost: number;
    insurance: number;
    customs: number;
    total: number;
    currency: string;
  };

  // Status
  status:
    | 'created'
    | 'label_printed'
    | 'picked_up'
    | 'in_transit'
    | 'customs'
    | 'out_for_delivery'
    | 'delivered'
    | 'exception';
  statusHistory: {
    status: string;
    location?: string;
    timestamp: Date;
    notes?: string;
  }[];

  // Tracking
  trackingEvents: {
    event: string;
    location: string;
    timestamp: Date;
    description: string;
  }[];

  createdAt: Date;
  deliveredAt?: Date;
}

export interface CustomsDeclaration {
  shipmentId: string;

  // Shipper
  shipper: {
    name: string;
    address: ShippingAddress;
    taxId?: string;
  };

  // Recipient
  recipient: {
    name: string;
    address: ShippingAddress;
    taxId?: string;
  };

  // Contents
  items: {
    description: string;
    hsCode: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    currency: string;
    countryOfOrigin: string;
  }[];

  // Declaration
  declaration: {
    purpose: 'sale' | 'gift' | 'sample' | 'return';
    totalValue: number;
    currency: string;
    invoiceNumber?: string;
    invoiceDate?: Date;
  };

  // Signature
  signature: {
    name: string;
    date: Date;
    certified: boolean;
  };
}

export class InternationalShippingCalculator {
  private zones: Map<string, ShippingZone>;
  private carriers: Map<string, ShippingCarrier>;
  private shipments: Map<string, Shipment>;
  private declarations: Map<string, CustomsDeclaration>;

  constructor() {
    this.zones = new Map();
    this.carriers = new Map();
    this.shipments = new Map();
    this.declarations = new Map();
    this.initializeZones();
    this.initializeCarriers();
  }

  /**
   * Initialize shipping zones
   */
  private initializeZones() {
    const zones: ShippingZone[] = [
      {
        id: 'zone-domestic',
        name: 'Domestic (India)',
        countries: ['IN'],
        baseDeliveryDays: 3,
      },
      {
        id: 'zone-1',
        name: 'South Asia',
        countries: ['BD', 'LK', 'NP', 'BT', 'MV', 'PK'],
        baseDeliveryDays: 5,
      },
      {
        id: 'zone-2',
        name: 'Southeast Asia & Middle East',
        countries: ['SG', 'MY', 'TH', 'ID', 'VN', 'AE', 'SA', 'QA'],
        baseDeliveryDays: 7,
      },
      {
        id: 'zone-3',
        name: 'East Asia & Australia',
        countries: ['JP', 'KR', 'CN', 'HK', 'TW', 'AU', 'NZ'],
        baseDeliveryDays: 8,
      },
      {
        id: 'zone-4',
        name: 'Europe',
        countries: ['UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT'],
        baseDeliveryDays: 9,
      },
      {
        id: 'zone-5',
        name: 'North America',
        countries: ['US', 'CA', 'MX'],
        baseDeliveryDays: 10,
      },
      {
        id: 'zone-6',
        name: 'Rest of World',
        countries: ['BR', 'AR', 'CL', 'ZA', 'RU'],
        baseDeliveryDays: 12,
      },
    ];

    zones.forEach((zone) => {
      this.zones.set(zone.id, zone);
    });
  }

  /**
   * Initialize carriers
   */
  private initializeCarriers() {
    const carriers: ShippingCarrier[] = [
      {
        id: 'dhl-express',
        name: 'DHL Express',
        type: 'express',
        domesticCountries: ['IN'],
        internationalZones: ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5', 'zone-6'],
        pricing: {
          baseRate: 25,
          perKgRate: 12,
          currency: 'USD',
          dimensionalFactor: 5000, // cm³/kg
        },
        limits: {
          maxWeight: 70,
          maxLength: 120,
          maxWidth: 80,
          maxHeight: 80,
        },
        features: {
          tracking: true,
          insurance: true,
          signatureRequired: true,
          customsClearance: true,
        },
        isActive: true,
      },
      {
        id: 'fedex-international',
        name: 'FedEx International Priority',
        type: 'express',
        domesticCountries: ['IN'],
        internationalZones: ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5', 'zone-6'],
        pricing: {
          baseRate: 22,
          perKgRate: 11,
          currency: 'USD',
          dimensionalFactor: 5000,
        },
        limits: {
          maxWeight: 68,
          maxLength: 119,
          maxWidth: 79,
          maxHeight: 79,
        },
        features: {
          tracking: true,
          insurance: true,
          signatureRequired: true,
          customsClearance: true,
        },
        isActive: true,
      },
      {
        id: 'aramex',
        name: 'Aramex',
        type: 'standard',
        domesticCountries: ['IN'],
        internationalZones: ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5'],
        pricing: {
          baseRate: 15,
          perKgRate: 8,
          currency: 'USD',
          dimensionalFactor: 5000,
        },
        limits: {
          maxWeight: 50,
          maxLength: 100,
          maxWidth: 70,
          maxHeight: 70,
        },
        features: {
          tracking: true,
          insurance: true,
          signatureRequired: false,
          customsClearance: true,
        },
        isActive: true,
      },
      {
        id: 'india-post',
        name: 'India Post International',
        type: 'economy',
        domesticCountries: ['IN'],
        internationalZones: ['zone-1', 'zone-2', 'zone-3', 'zone-4', 'zone-5', 'zone-6'],
        pricing: {
          baseRate: 8,
          perKgRate: 5,
          currency: 'USD',
          dimensionalFactor: 6000,
        },
        limits: {
          maxWeight: 30,
          maxLength: 90,
          maxWidth: 60,
          maxHeight: 60,
        },
        features: {
          tracking: true,
          insurance: false,
          signatureRequired: false,
          customsClearance: false,
        },
        isActive: true,
      },
    ];

    carriers.forEach((carrier) => {
      this.carriers.set(carrier.id, carrier);
    });
  }

  /**
   * Get shipping zone for country
   */
  private getZoneForCountry(country: string): ShippingZone | null {
    for (const zone of this.zones.values()) {
      if (zone.countries.includes(country)) {
        return zone;
      }
    }
    return null;
  }

  /**
   * Calculate volumetric weight
   */
  private calculateVolumetricWeight(
    dimensions: ShipmentDimensions,
    dimensionalFactor: number
  ): number {
    const { length, width, height } = dimensions;
    return (length * width * height) / dimensionalFactor;
  }

  /**
   * Get chargeable weight (higher of actual or volumetric)
   */
  private getChargeableWeight(
    dimensions: ShipmentDimensions,
    dimensionalFactor: number
  ): {
    actualWeight: number;
    volumetricWeight: number;
    chargeableWeight: number;
  } {
    const actualWeight = dimensions.weight;
    const volumetricWeight = this.calculateVolumetricWeight(dimensions, dimensionalFactor);
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    return {
      actualWeight: Number(actualWeight.toFixed(2)),
      volumetricWeight: Number(volumetricWeight.toFixed(2)),
      chargeableWeight: Number(chargeableWeight.toFixed(2)),
    };
  }

  /**
   * Calculate shipping quote
   */
  async calculateShippingQuote(params: {
    origin: ShippingAddress;
    destination: ShippingAddress;
    package: ShipmentDimensions;
    carrierId?: string;
    insuranceValue?: number;
  }): Promise<ShippingQuote[]> {
    const zone = this.getZoneForCountry(params.destination.country);
    if (!zone) {
      throw new Error('Destination country not supported');
    }

    const carriers = params.carrierId
      ? ([this.carriers.get(params.carrierId)].filter(Boolean) as ShippingCarrier[])
      : Array.from(this.carriers.values()).filter(
          (c) => c.isActive && c.internationalZones.includes(zone.id)
        );

    const quotes: ShippingQuote[] = [];

    for (const carrier of carriers) {
      // Check package limits
      if (
        params.package.weight > carrier.limits.maxWeight ||
        params.package.length > carrier.limits.maxLength ||
        params.package.width > carrier.limits.maxWidth ||
        params.package.height > carrier.limits.maxHeight
      ) {
        continue; // Skip carrier if package exceeds limits
      }

      // Calculate weights
      const weights = this.getChargeableWeight(params.package, carrier.pricing.dimensionalFactor);

      // Calculate costs
      const baseCost = carrier.pricing.baseRate;
      const weightCost = weights.chargeableWeight * carrier.pricing.perKgRate;

      // Zone surcharge (10% per zone level)
      const zoneLevel = parseInt(zone.id.split('-')[1] || '0');
      const zoneSurcharge = (baseCost + weightCost) * (zoneLevel * 0.1);

      // Fuel surcharge (15% of base + weight)
      const fuelSurcharge = (baseCost + weightCost) * 0.15;

      // Insurance (1% of declared value)
      const insuranceCost = params.insuranceValue ? params.insuranceValue * 0.01 : 0;

      // Customs handling (flat fee for international)
      const customsHandling = zone.id !== 'zone-domestic' ? 10 : 0;

      const total =
        baseCost + weightCost + zoneSurcharge + fuelSurcharge + insuranceCost + customsHandling;

      // Calculate delivery estimate
      const estimatedDays =
        carrier.type === 'express'
          ? zone.baseDeliveryDays
          : carrier.type === 'standard'
            ? zone.baseDeliveryDays + 2
            : zone.baseDeliveryDays + 5;

      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

      quotes.push({
        id: `quote-${Date.now()}-${carrier.id}`,
        carrier: {
          id: carrier.id,
          name: carrier.name,
          type: carrier.type,
        },
        costs: {
          baseCost: Number(baseCost.toFixed(2)),
          weightCost: Number(weightCost.toFixed(2)),
          zoneSurcharge: Number(zoneSurcharge.toFixed(2)),
          fuelSurcharge: Number(fuelSurcharge.toFixed(2)),
          insuranceCost: Number(insuranceCost.toFixed(2)),
          customsHandling: Number(customsHandling.toFixed(2)),
          total: Number(total.toFixed(2)),
          currency: carrier.pricing.currency,
        },
        delivery: {
          estimatedDays,
          estimatedDate,
        },
        details: {
          ...weights,
          zone: zone.name,
        },
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
    }

    // Sort by total cost
    return quotes.sort((a, b) => a.costs.total - b.costs.total);
  }

  /**
   * Create shipment
   */
  async createShipment(params: {
    orderId: string;
    origin: ShippingAddress;
    destination: ShippingAddress;
    package: ShipmentDimensions;
    contents: Shipment['contents'];
    carrierId: string;
  }): Promise<Shipment> {
    const carrier = this.carriers.get(params.carrierId);
    if (!carrier) {
      throw new Error('Invalid carrier');
    }

    // Get quote for cost calculation
    const quotes = await this.calculateShippingQuote({
      origin: params.origin,
      destination: params.destination,
      package: params.package,
      carrierId: params.carrierId,
    });

    if (quotes.length === 0) {
      throw new Error('No shipping quotes available');
    }

    const quote = quotes[0];
    const totalValue = params.contents.reduce((sum, item) => sum + item.value * item.quantity, 0);

    const shipment: Shipment = {
      id: `ship-${Date.now()}`,
      orderId: params.orderId,
      origin: params.origin,
      destination: params.destination,
      package: params.package,
      contents: params.contents,
      carrier: {
        id: carrier.id,
        name: carrier.name,
        trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
      shipping: {
        cost: quote.costs.total - quote.costs.insurance - quote.costs.customsHandling,
        insurance: quote.costs.insuranceCost,
        customs: quote.costs.customsHandling,
        total: quote.costs.total,
        currency: quote.costs.currency,
      },
      status: 'created',
      statusHistory: [
        {
          status: 'created',
          timestamp: new Date(),
          notes: 'Shipment created',
        },
      ],
      trackingEvents: [],
      createdAt: new Date(),
    };

    this.shipments.set(shipment.id, shipment);
    return shipment;
  }

  /**
   * Track shipment
   */
  async trackShipment(trackingNumber: string): Promise<Shipment | null> {
    for (const shipment of this.shipments.values()) {
      if (shipment.carrier.trackingNumber === trackingNumber) {
        return shipment;
      }
    }
    return null;
  }

  /**
   * Update shipment status
   */
  async updateShipmentStatus(
    shipmentId: string,
    status: Shipment['status'],
    location?: string,
    notes?: string
  ): Promise<void> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    shipment.status = status;
    shipment.statusHistory.push({
      status,
      location,
      timestamp: new Date(),
      notes,
    });

    if (status === 'delivered') {
      shipment.deliveredAt = new Date();
    }
  }

  /**
   * Create customs declaration
   */
  async createCustomsDeclaration(params: {
    shipmentId: string;
    shipper: CustomsDeclaration['shipper'];
    recipient: CustomsDeclaration['recipient'];
    items: CustomsDeclaration['items'];
    purpose: CustomsDeclaration['declaration']['purpose'];
    signerName: string;
  }): Promise<CustomsDeclaration> {
    const shipment = this.shipments.get(params.shipmentId);
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    const totalValue = params.items.reduce((sum, item) => sum + item.totalValue, 0);

    const declaration: CustomsDeclaration = {
      shipmentId: params.shipmentId,
      shipper: params.shipper,
      recipient: params.recipient,
      items: params.items,
      declaration: {
        purpose: params.purpose,
        totalValue,
        currency: params.items[0]?.currency || 'USD',
        invoiceNumber: `INV-${Date.now()}`,
        invoiceDate: new Date(),
      },
      signature: {
        name: params.signerName,
        date: new Date(),
        certified: true,
      },
    };

    this.declarations.set(params.shipmentId, declaration);
    return declaration;
  }

  /**
   * Get available carriers for route
   */
  async getAvailableCarriers(origin: string, destination: string): Promise<ShippingCarrier[]> {
    const zone = this.getZoneForCountry(destination);
    if (!zone) return [];

    return Array.from(this.carriers.values()).filter(
      (carrier) =>
        carrier.isActive &&
        carrier.domesticCountries.includes(origin) &&
        carrier.internationalZones.includes(zone.id)
    );
  }

  /**
   * Get shipping statistics
   */
  async getShippingStats() {
    const shipments = Array.from(this.shipments.values());

    const totalShipments = shipments.length;
    const byStatus = shipments.reduce(
      (acc, ship) => {
        acc[ship.status] = (acc[ship.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byCarrier = shipments.reduce(
      (acc, ship) => {
        acc[ship.carrier.name] = (acc[ship.carrier.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byDestination = shipments.reduce(
      (acc, ship) => {
        acc[ship.destination.country] = (acc[ship.destination.country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const averageCost =
      shipments.length > 0
        ? shipments.reduce((sum, s) => sum + s.shipping.total, 0) / shipments.length
        : 0;

    const deliveredShipments = shipments.filter((s) => s.status === 'delivered');
    const averageDeliveryTime =
      deliveredShipments.length > 0
        ? deliveredShipments.reduce((sum, s) => {
            if (s.deliveredAt) {
              return (
                sum + (s.deliveredAt.getTime() - s.createdAt.getTime()) / (1000 * 60 * 60 * 24)
              );
            }
            return sum;
          }, 0) / deliveredShipments.length
        : 0;

    return {
      totalShipments,
      shipmentsByStatus: byStatus,
      shipmentsByCarrier: byCarrier,
      shipmentsByDestination: byDestination,
      averageShippingCost: Number(averageCost.toFixed(2)),
      averageDeliveryDays: Number(averageDeliveryTime.toFixed(1)),
    };
  }
}

// Export singleton instance
export const internationalShippingCalculator = new InternationalShippingCalculator();
