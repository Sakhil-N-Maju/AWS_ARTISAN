/**
 * Global Marketplace Service
 *
 * Manages international marketplace operations:
 * - Multi-region support
 * - Cross-border transactions
 * - Regional regulations compliance
 * - Global inventory management
 * - International vendor management
 */

export interface MarketplaceRegion {
  id: string;
  code: string; // US, UK, EU, JP, etc.
  name: string;
  currency: string;
  languages: string[];
  timezone: string;

  // Business Settings
  settings: {
    operationalHours: {
      start: string;
      end: string;
      timezone: string;
    };
    supportedPaymentMethods: string[];
    minOrderValue: number;
    maxOrderValue: number;
    taxIncluded: boolean;
  };

  // Shipping
  shipping: {
    domesticCarriers: string[];
    internationalCarriers: string[];
    averageDeliveryDays: number;
    freeShippingThreshold?: number;
  };

  // Regulations
  regulations: {
    requiresImportLicense: boolean;
    restrictedCategories: string[];
    customsDeclarationRequired: boolean;
    requiresProductCertification: boolean;
    dataPrivacyCompliance: string[]; // GDPR, CCPA, etc.
  };

  // Status
  isActive: boolean;
  launchDate?: Date;
}

export interface GlobalProduct {
  id: string;
  baseProductId: string;

  // Regional Availability
  availableInRegions: string[];
  regionalPricing: Record<
    string,
    {
      price: number;
      currency: string;
      includingTax: boolean;
    }
  >;

  // Regional Variations
  regionalContent: Record<
    string,
    {
      title: string;
      description: string;
      keywords: string[];
    }
  >;

  // Compliance
  compliance: Record<
    string,
    {
      approved: boolean;
      certifications: string[];
      restrictions?: string[];
    }
  >;

  // Inventory by Region
  regionalInventory: Record<
    string,
    {
      quantity: number;
      warehouse: string;
      reorderPoint: number;
    }
  >;
}

export interface CrossBorderOrder {
  id: string;
  orderId: string;

  // Origin & Destination
  origin: {
    country: string;
    warehouse: string;
  };
  destination: {
    country: string;
    region: string;
    address: any;
  };

  // Customs
  customs: {
    declarationNumber?: string;
    hsCode: string;
    declaredValue: number;
    currency: string;
    category: string;
    description: string;
  };

  // Duties & Taxes
  charges: {
    importDuty: number;
    vat: number;
    customsFee: number;
    handlingFee: number;
    total: number;
    currency: string;
    paidBy: 'sender' | 'recipient';
  };

  // Shipping
  shipping: {
    carrier: string;
    trackingNumber?: string;
    estimatedDelivery: Date;
    actualDelivery?: Date;
  };

  // Status
  status: 'pending' | 'customs_clearance' | 'in_transit' | 'delivered' | 'held' | 'returned';
  statusHistory: {
    status: string;
    timestamp: Date;
    location?: string;
    notes?: string;
  }[];
}

export class GlobalMarketplaceService {
  private regions: Map<string, MarketplaceRegion>;
  private products: Map<string, GlobalProduct>;
  private orders: Map<string, CrossBorderOrder>;

  constructor() {
    this.regions = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.initializeRegions();
  }

  /**
   * Initialize marketplace regions
   */
  private initializeRegions() {
    const regions: MarketplaceRegion[] = [
      {
        id: 'region-india',
        code: 'IN',
        name: 'India',
        currency: 'INR',
        languages: ['en', 'hi', 'bn', 'te', 'mr', 'ta'],
        timezone: 'Asia/Kolkata',
        settings: {
          operationalHours: { start: '09:00', end: '21:00', timezone: 'Asia/Kolkata' },
          supportedPaymentMethods: ['razorpay', 'upi', 'card', 'netbanking', 'cod'],
          minOrderValue: 100,
          maxOrderValue: 500000,
          taxIncluded: true,
        },
        shipping: {
          domesticCarriers: ['Delhivery', 'Blue Dart', 'India Post'],
          internationalCarriers: ['DHL', 'FedEx', 'Aramex'],
          averageDeliveryDays: 5,
          freeShippingThreshold: 1000,
        },
        regulations: {
          requiresImportLicense: false,
          restrictedCategories: [],
          customsDeclarationRequired: false,
          requiresProductCertification: true,
          dataPrivacyCompliance: ['DPDPA'],
        },
        isActive: true,
        launchDate: new Date('2024-01-01'),
      },
      {
        id: 'region-us',
        code: 'US',
        name: 'United States',
        currency: 'USD',
        languages: ['en', 'es'],
        timezone: 'America/New_York',
        settings: {
          operationalHours: { start: '09:00', end: '18:00', timezone: 'America/New_York' },
          supportedPaymentMethods: ['stripe', 'paypal', 'card', 'apple_pay', 'google_pay'],
          minOrderValue: 10,
          maxOrderValue: 10000,
          taxIncluded: false,
        },
        shipping: {
          domesticCarriers: ['USPS', 'UPS', 'FedEx'],
          internationalCarriers: ['DHL', 'FedEx', 'UPS'],
          averageDeliveryDays: 3,
          freeShippingThreshold: 50,
        },
        regulations: {
          requiresImportLicense: false,
          restrictedCategories: ['animal_products'],
          customsDeclarationRequired: true,
          requiresProductCertification: false,
          dataPrivacyCompliance: ['CCPA'],
        },
        isActive: true,
        launchDate: new Date('2025-06-01'),
      },
      {
        id: 'region-uk',
        code: 'UK',
        name: 'United Kingdom',
        currency: 'GBP',
        languages: ['en'],
        timezone: 'Europe/London',
        settings: {
          operationalHours: { start: '09:00', end: '18:00', timezone: 'Europe/London' },
          supportedPaymentMethods: ['stripe', 'paypal', 'card'],
          minOrderValue: 10,
          maxOrderValue: 5000,
          taxIncluded: true,
        },
        shipping: {
          domesticCarriers: ['Royal Mail', 'DPD', 'Hermes'],
          internationalCarriers: ['DHL', 'FedEx', 'Royal Mail International'],
          averageDeliveryDays: 4,
          freeShippingThreshold: 40,
        },
        regulations: {
          requiresImportLicense: false,
          restrictedCategories: ['ivory', 'animal_products'],
          customsDeclarationRequired: true,
          requiresProductCertification: true,
          dataPrivacyCompliance: ['UK-GDPR'],
        },
        isActive: true,
      },
      {
        id: 'region-eu',
        code: 'EU',
        name: 'European Union',
        currency: 'EUR',
        languages: ['en', 'de', 'fr', 'es', 'it'],
        timezone: 'Europe/Brussels',
        settings: {
          operationalHours: { start: '09:00', end: '18:00', timezone: 'Europe/Brussels' },
          supportedPaymentMethods: ['stripe', 'paypal', 'card', 'sepa'],
          minOrderValue: 10,
          maxOrderValue: 5000,
          taxIncluded: true,
        },
        shipping: {
          domesticCarriers: ['DHL', 'DPD', 'GLS'],
          internationalCarriers: ['DHL', 'FedEx', 'UPS'],
          averageDeliveryDays: 5,
          freeShippingThreshold: 50,
        },
        regulations: {
          requiresImportLicense: false,
          restrictedCategories: ['ivory', 'animal_products', 'wood_products'],
          customsDeclarationRequired: true,
          requiresProductCertification: true,
          dataPrivacyCompliance: ['GDPR'],
        },
        isActive: true,
      },
    ];

    regions.forEach((region) => {
      this.regions.set(region.code, region);
    });
  }

  /**
   * Get region by code
   */
  async getRegion(regionCode: string): Promise<MarketplaceRegion | null> {
    return this.regions.get(regionCode) || null;
  }

  /**
   * Get all active regions
   */
  async getActiveRegions(): Promise<MarketplaceRegion[]> {
    return Array.from(this.regions.values()).filter((r) => r.isActive);
  }

  /**
   * Check if product is available in region
   */
  async isProductAvailableInRegion(productId: string, regionCode: string): Promise<boolean> {
    const product = this.products.get(productId);
    if (!product) return false;

    const region = await this.getRegion(regionCode);
    if (!region || !region.isActive) return false;

    // Check if product is available in this region
    if (!product.availableInRegions.includes(regionCode)) return false;

    // Check compliance
    const compliance = product.compliance[regionCode];
    if (!compliance || !compliance.approved) return false;

    // Check inventory
    const inventory = product.regionalInventory[regionCode];
    if (!inventory || inventory.quantity <= 0) return false;

    return true;
  }

  /**
   * Get regional price for product
   */
  async getRegionalPrice(
    productId: string,
    regionCode: string
  ): Promise<{
    price: number;
    currency: string;
    includingTax: boolean;
  } | null> {
    const product = this.products.get(productId);
    if (!product) return null;

    return product.regionalPricing[regionCode] || null;
  }

  /**
   * Calculate cross-border charges
   */
  async calculateCrossBorderCharges(params: {
    productId: string;
    originCountry: string;
    destinationCountry: string;
    productValue: number;
    currency: string;
  }): Promise<CrossBorderOrder['charges']> {
    const destination = await this.getRegion(params.destinationCountry);

    if (!destination) {
      throw new Error('Invalid destination country');
    }

    // Simplified calculation - in production, would use actual tariff data
    const importDutyRate = this.getImportDutyRate(params.destinationCountry, params.productId);
    const vatRate = this.getVATRate(params.destinationCountry);

    const importDuty = params.productValue * importDutyRate;
    const vat = (params.productValue + importDuty) * vatRate;
    const customsFee = params.destinationCountry !== 'IN' ? 5 : 0; // Flat fee
    const handlingFee = 10;

    return {
      importDuty,
      vat,
      customsFee,
      handlingFee,
      total: importDuty + vat + customsFee + handlingFee,
      currency: params.currency,
      paidBy: 'recipient', // Default - can be configured
    };
  }

  /**
   * Create cross-border order
   */
  async createCrossBorderOrder(params: {
    orderId: string;
    productId: string;
    origin: { country: string; warehouse: string };
    destination: { country: string; region: string; address: any };
    productValue: number;
    currency: string;
  }): Promise<CrossBorderOrder> {
    const charges = await this.calculateCrossBorderCharges({
      productId: params.productId,
      originCountry: params.origin.country,
      destinationCountry: params.destination.country,
      productValue: params.productValue,
      currency: params.currency,
    });

    const order: CrossBorderOrder = {
      id: `xb-${Date.now()}`,
      orderId: params.orderId,
      origin: params.origin,
      destination: params.destination,
      customs: {
        hsCode: this.getHSCode(params.productId),
        declaredValue: params.productValue,
        currency: params.currency,
        category: 'handicrafts',
        description: 'Handcrafted artisan product',
      },
      charges,
      shipping: {
        carrier: this.selectInternationalCarrier(params.origin.country, params.destination.country),
        estimatedDelivery: this.calculateEstimatedDelivery(
          params.origin.country,
          params.destination.country
        ),
      },
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          notes: 'Order created',
        },
      ],
    };

    this.orders.set(order.id, order);
    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: CrossBorderOrder['status'],
    notes?: string
  ): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      notes,
    });
  }

  /**
   * Get compliance requirements for region
   */
  async getComplianceRequirements(
    regionCode: string,
    productCategory: string
  ): Promise<{
    required: string[];
    optional: string[];
    restricted: boolean;
  }> {
    const region = await this.getRegion(regionCode);
    if (!region) {
      throw new Error('Region not found');
    }

    const required: string[] = [];
    const optional: string[] = [];

    if (region.regulations.customsDeclarationRequired) {
      required.push('Customs Declaration');
    }

    if (region.regulations.requiresProductCertification) {
      required.push('Product Certification');
    }

    if (region.regulations.dataPrivacyCompliance.length > 0) {
      required.push(...region.regulations.dataPrivacyCompliance.map((c) => `${c} Compliance`));
    }

    const restricted = region.regulations.restrictedCategories.includes(productCategory);

    return { required, optional, restricted };
  }

  /**
   * Get marketplace statistics
   */
  async getMarketplaceStats() {
    const regions = Array.from(this.regions.values());
    const activeRegions = regions.filter((r) => r.isActive);
    const products = Array.from(this.products.values());
    const orders = Array.from(this.orders.values());

    const ordersByRegion = orders.reduce(
      (acc, order) => {
        const region = order.destination.country;
        acc[region] = (acc[region] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const revenueByRegion = orders.reduce(
      (acc, order) => {
        const region = order.destination.country;
        acc[region] = (acc[region] || 0) + order.customs.declaredValue;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalRegions: regions.length,
      activeRegions: activeRegions.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      ordersByRegion,
      revenueByRegion,
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, o) => sum + o.customs.declaredValue, 0) / orders.length
          : 0,
    };
  }

  // Helper Methods

  private getImportDutyRate(country: string, productId: string): number {
    // Simplified - in production, would use actual tariff schedules
    const rates: Record<string, number> = {
      US: 0.05,
      UK: 0.04,
      EU: 0.06,
      IN: 0.1,
    };
    return rates[country] || 0.05;
  }

  private getVATRate(country: string): number {
    const rates: Record<string, number> = {
      US: 0, // Sales tax varies by state
      UK: 0.2,
      EU: 0.2,
      IN: 0.18, // GST
    };
    return rates[country] || 0;
  }

  private getHSCode(productId: string): string {
    // Simplified - would map products to actual HS codes
    return '6702.90.00'; // Artificial flowers, foliage and fruit and parts thereof
  }

  private selectInternationalCarrier(origin: string, destination: string): string {
    // Simplified carrier selection
    if (origin === 'IN' && ['US', 'UK', 'EU'].includes(destination)) {
      return 'DHL Express';
    }
    return 'FedEx International';
  }

  private calculateEstimatedDelivery(origin: string, destination: string): Date {
    // Simplified delivery estimation
    const daysMap: Record<string, number> = {
      'IN-US': 10,
      'IN-UK': 8,
      'IN-EU': 9,
    };

    const key = `${origin}-${destination}`;
    const days = daysMap[key] || 7;

    const delivery = new Date();
    delivery.setDate(delivery.getDate() + days);
    return delivery;
  }
}

// Export singleton instance
export const globalMarketplaceService = new GlobalMarketplaceService();
