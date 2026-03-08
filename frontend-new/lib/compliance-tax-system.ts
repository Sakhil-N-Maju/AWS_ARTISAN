/**
 * Compliance & Tax System
 *
 * Handles international compliance and taxation:
 * - Tax calculation by region
 * - VAT/GST handling
 * - Import duties
 * - Export compliance
 * - Document generation
 * - Regulatory compliance
 */

export interface TaxRegion {
  code: string;
  name: string;

  // Tax Rates
  taxes: {
    vat?: number; // Value Added Tax
    gst?: number; // Goods and Services Tax
    salesTax?: number;
    importDuty?: number;
    luxuryTax?: number;
  };

  // Tax Rules
  rules: {
    taxIncludedInPrice: boolean;
    taxThreshold?: number; // Minimum value for tax application
    reverseCharge?: boolean; // For B2B transactions
    digitalServicesTax?: number;
  };

  // Compliance
  compliance: {
    taxIdRequired: boolean;
    taxIdFormat?: RegExp;
    invoiceRequired: boolean;
    eInvoicing?: boolean;
  };
}

export interface TaxCalculation {
  subtotal: number;
  currency: string;

  // Breakdown
  breakdown: {
    vat: number;
    gst: number;
    salesTax: number;
    importDuty: number;
    luxuryTax: number;
    otherTaxes: number;
  };

  totalTax: number;
  total: number;

  // Details
  region: string;
  appliedRates: {
    [key: string]: number;
  };
}

export interface ComplianceDocument {
  id: string;
  type:
    | 'invoice'
    | 'customs_declaration'
    | 'certificate_of_origin'
    | 'export_declaration'
    | 'tax_certificate';

  // Metadata
  documentNumber: string;
  issueDate: Date;
  validUntil?: Date;

  // Parties
  issuer: {
    name: string;
    address: string;
    taxId?: string;
    country: string;
  };

  recipient: {
    name: string;
    address: string;
    taxId?: string;
    country: string;
  };

  // Content
  items: {
    description: string;
    hsCode?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate?: number;
    tax?: number;
  }[];

  // Totals
  totals: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };

  // Additional Info
  notes?: string;
  signature?: {
    name: string;
    date: Date;
    position: string;
  };

  // Status
  status: 'draft' | 'issued' | 'verified' | 'rejected';

  // File
  fileUrl?: string;
  pdfGenerated: boolean;
}

export interface ExportCompliance {
  productId: string;
  productName: string;

  // Classification
  classification: {
    hsCode: string;
    eccn?: string; // Export Control Classification Number
    schedule?: string;
  };

  // Restrictions
  restrictions: {
    embargoed: string[]; // Countries under embargo
    licensed: string[]; // Countries requiring export license
    prohibited: string[]; // Countries where export is prohibited
  };

  // Requirements
  requirements: {
    exportLicense: boolean;
    certificateOfOrigin: boolean;
    phytosanitaryCertificate: boolean;
    culturalHeritageCertificate: boolean;
  };

  // Status
  approved: boolean;
  approvedFor: string[]; // Approved destination countries
  lastReviewed: Date;
}

export interface TaxReport {
  id: string;
  period: {
    start: Date;
    end: Date;
  };

  // Summary
  summary: {
    totalSales: number;
    taxableAmount: number;
    taxCollected: number;
    taxRemitted: number;
    taxPending: number;
    currency: string;
  };

  // By Region
  byRegion: Record<
    string,
    {
      sales: number;
      taxCollected: number;
      transactionCount: number;
    }
  >;

  // By Tax Type
  byTaxType: Record<string, number>;

  status: 'draft' | 'filed' | 'paid';
  filedDate?: Date;
  paidDate?: Date;
}

export class ComplianceTaxSystem {
  private taxRegions: Map<string, TaxRegion>;
  private documents: Map<string, ComplianceDocument>;
  private exportCompliance: Map<string, ExportCompliance>;
  private taxReports: Map<string, TaxReport>;

  constructor() {
    this.taxRegions = new Map();
    this.documents = new Map();
    this.exportCompliance = new Map();
    this.taxReports = new Map();
    this.initializeTaxRegions();
  }

  /**
   * Initialize tax regions
   */
  private initializeTaxRegions() {
    const regions: TaxRegion[] = [
      {
        code: 'IN',
        name: 'India',
        taxes: {
          gst: 0.18, // 18% GST
        },
        rules: {
          taxIncludedInPrice: true,
          taxThreshold: 0,
          reverseCharge: true,
        },
        compliance: {
          taxIdRequired: true,
          taxIdFormat: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          invoiceRequired: true,
          eInvoicing: true,
        },
      },
      {
        code: 'US',
        name: 'United States',
        taxes: {
          salesTax: 0.08, // Varies by state, average
        },
        rules: {
          taxIncludedInPrice: false,
          taxThreshold: 0,
        },
        compliance: {
          taxIdRequired: true,
          taxIdFormat: /^[0-9]{2}-[0-9]{7}$/,
          invoiceRequired: true,
        },
      },
      {
        code: 'UK',
        name: 'United Kingdom',
        taxes: {
          vat: 0.2, // 20% VAT
        },
        rules: {
          taxIncludedInPrice: true,
          taxThreshold: 0,
        },
        compliance: {
          taxIdRequired: true,
          taxIdFormat: /^GB[0-9]{9}$/,
          invoiceRequired: true,
        },
      },
      {
        code: 'EU',
        name: 'European Union',
        taxes: {
          vat: 0.21, // Average EU VAT
        },
        rules: {
          taxIncludedInPrice: true,
          taxThreshold: 150, // EUR
          reverseCharge: true,
        },
        compliance: {
          taxIdRequired: true,
          invoiceRequired: true,
        },
      },
      {
        code: 'AU',
        name: 'Australia',
        taxes: {
          gst: 0.1, // 10% GST
        },
        rules: {
          taxIncludedInPrice: true,
          taxThreshold: 1000, // AUD
        },
        compliance: {
          taxIdRequired: true,
          taxIdFormat: /^[0-9]{11}$/,
          invoiceRequired: true,
        },
      },
      {
        code: 'CA',
        name: 'Canada',
        taxes: {
          gst: 0.05, // Federal GST
          salesTax: 0.08, // Average provincial tax
        },
        rules: {
          taxIncludedInPrice: false,
          taxThreshold: 0,
        },
        compliance: {
          taxIdRequired: true,
          invoiceRequired: true,
        },
      },
      {
        code: 'SG',
        name: 'Singapore',
        taxes: {
          gst: 0.09, // 9% GST
        },
        rules: {
          taxIncludedInPrice: true,
          taxThreshold: 400, // SGD
        },
        compliance: {
          taxIdRequired: true,
          invoiceRequired: true,
        },
      },
      {
        code: 'AE',
        name: 'UAE',
        taxes: {
          vat: 0.05, // 5% VAT
        },
        rules: {
          taxIncludedInPrice: true,
          taxThreshold: 0,
        },
        compliance: {
          taxIdRequired: true,
          invoiceRequired: true,
        },
      },
    ];

    regions.forEach((region) => {
      this.taxRegions.set(region.code, region);
    });
  }

  /**
   * Calculate tax for transaction
   */
  async calculateTax(params: {
    amount: number;
    currency: string;
    regionCode: string;
    isB2B?: boolean;
  }): Promise<TaxCalculation> {
    const region = this.taxRegions.get(params.regionCode);
    if (!region) {
      throw new Error('Tax region not found');
    }

    const breakdown = {
      vat: 0,
      gst: 0,
      salesTax: 0,
      importDuty: 0,
      luxuryTax: 0,
      otherTaxes: 0,
    };

    const appliedRates: Record<string, number> = {};

    // Check threshold
    if (region.rules.taxThreshold && params.amount < region.rules.taxThreshold) {
      return {
        subtotal: params.amount,
        currency: params.currency,
        breakdown,
        totalTax: 0,
        total: params.amount,
        region: region.name,
        appliedRates,
      };
    }

    // Apply reverse charge for B2B in applicable regions
    if (params.isB2B && region.rules.reverseCharge) {
      return {
        subtotal: params.amount,
        currency: params.currency,
        breakdown,
        totalTax: 0,
        total: params.amount,
        region: region.name,
        appliedRates: { reverseCharge: 0 },
      };
    }

    // Calculate applicable taxes
    if (region.taxes.vat) {
      breakdown.vat = params.amount * region.taxes.vat;
      appliedRates.vat = region.taxes.vat * 100;
    }

    if (region.taxes.gst) {
      breakdown.gst = params.amount * region.taxes.gst;
      appliedRates.gst = region.taxes.gst * 100;
    }

    if (region.taxes.salesTax) {
      breakdown.salesTax = params.amount * region.taxes.salesTax;
      appliedRates.salesTax = region.taxes.salesTax * 100;
    }

    if (region.taxes.importDuty) {
      breakdown.importDuty = params.amount * region.taxes.importDuty;
      appliedRates.importDuty = region.taxes.importDuty * 100;
    }

    if (region.taxes.luxuryTax) {
      breakdown.luxuryTax = params.amount * region.taxes.luxuryTax;
      appliedRates.luxuryTax = region.taxes.luxuryTax * 100;
    }

    const totalTax = Object.values(breakdown).reduce((sum, tax) => sum + tax, 0);

    return {
      subtotal: params.amount,
      currency: params.currency,
      breakdown,
      totalTax: Number(totalTax.toFixed(2)),
      total: Number((params.amount + totalTax).toFixed(2)),
      region: region.name,
      appliedRates,
    };
  }

  /**
   * Validate tax ID
   */
  async validateTaxId(taxId: string, regionCode: string): Promise<boolean> {
    const region = this.taxRegions.get(regionCode);
    if (!region) return false;

    if (!region.compliance.taxIdRequired) return true;
    if (!region.compliance.taxIdFormat) return true;

    return region.compliance.taxIdFormat.test(taxId);
  }

  /**
   * Generate invoice
   */
  async generateInvoice(params: {
    orderId: string;
    issuer: ComplianceDocument['issuer'];
    recipient: ComplianceDocument['recipient'];
    items: ComplianceDocument['items'];
    regionCode: string;
  }): Promise<ComplianceDocument> {
    const region = this.taxRegions.get(params.regionCode);
    if (!region) {
      throw new Error('Region not found');
    }

    const subtotal = params.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTax = params.items.reduce((sum, item) => sum + (item.tax || 0), 0);

    const invoice: ComplianceDocument = {
      id: `doc-${Date.now()}`,
      type: 'invoice',
      documentNumber: `INV-${Date.now()}`,
      issueDate: new Date(),
      issuer: params.issuer,
      recipient: params.recipient,
      items: params.items,
      totals: {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(totalTax.toFixed(2)),
        total: Number((subtotal + totalTax).toFixed(2)),
        currency: 'USD', // Would be dynamic based on order
      },
      status: 'issued',
      pdfGenerated: false,
    };

    this.documents.set(invoice.id, invoice);
    return invoice;
  }

  /**
   * Generate certificate of origin
   */
  async generateCertificateOfOrigin(params: {
    exporterId: string;
    exporterName: string;
    exporterAddress: string;
    importerName: string;
    importerAddress: string;
    importerCountry: string;
    items: {
      description: string;
      hsCode: string;
      quantity: number;
      value: number;
    }[];
    originCountry: string;
  }): Promise<ComplianceDocument> {
    const certificate: ComplianceDocument = {
      id: `coo-${Date.now()}`,
      type: 'certificate_of_origin',
      documentNumber: `COO-${Date.now()}`,
      issueDate: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      issuer: {
        name: params.exporterName,
        address: params.exporterAddress,
        country: params.originCountry,
      },
      recipient: {
        name: params.importerName,
        address: params.importerAddress,
        country: params.importerCountry,
      },
      items: params.items.map((item) => ({
        description: item.description,
        hsCode: item.hsCode,
        quantity: item.quantity,
        unitPrice: item.value / item.quantity,
        totalPrice: item.value,
      })),
      totals: {
        subtotal: params.items.reduce((sum, i) => sum + i.value, 0),
        tax: 0,
        total: params.items.reduce((sum, i) => sum + i.value, 0),
        currency: 'USD',
      },
      notes: `Country of Origin: ${params.originCountry}`,
      status: 'issued',
      pdfGenerated: false,
    };

    this.documents.set(certificate.id, certificate);
    return certificate;
  }

  /**
   * Check export compliance
   */
  async checkExportCompliance(
    productId: string,
    destinationCountry: string
  ): Promise<{
    allowed: boolean;
    requiresLicense: boolean;
    requirements: string[];
    restrictions: string[];
  }> {
    const compliance = this.exportCompliance.get(productId);

    if (!compliance) {
      return {
        allowed: true,
        requiresLicense: false,
        requirements: [],
        restrictions: [],
      };
    }

    // Check if embargoed
    if (compliance.restrictions.embargoed.includes(destinationCountry)) {
      return {
        allowed: false,
        requiresLicense: false,
        requirements: [],
        restrictions: ['Country under embargo'],
      };
    }

    // Check if prohibited
    if (compliance.restrictions.prohibited.includes(destinationCountry)) {
      return {
        allowed: false,
        requiresLicense: false,
        requirements: [],
        restrictions: ['Export prohibited to this country'],
      };
    }

    const requirements: string[] = [];
    const requiresLicense = compliance.restrictions.licensed.includes(destinationCountry);

    if (requiresLicense) {
      requirements.push('Export License Required');
    }

    if (compliance.requirements.certificateOfOrigin) {
      requirements.push('Certificate of Origin');
    }

    if (compliance.requirements.culturalHeritageCertificate) {
      requirements.push('Cultural Heritage Certificate');
    }

    if (compliance.requirements.phytosanitaryCertificate) {
      requirements.push('Phytosanitary Certificate');
    }

    return {
      allowed: true,
      requiresLicense,
      requirements,
      restrictions: [],
    };
  }

  /**
   * Create tax report
   */
  async createTaxReport(params: {
    startDate: Date;
    endDate: Date;
    transactions: {
      regionCode: string;
      amount: number;
      tax: number;
      currency: string;
    }[];
  }): Promise<TaxReport> {
    const summary = {
      totalSales: 0,
      taxableAmount: 0,
      taxCollected: 0,
      taxRemitted: 0,
      taxPending: 0,
      currency: 'USD',
    };

    const byRegion: Record<string, any> = {};
    const byTaxType: Record<string, number> = {};

    params.transactions.forEach((txn) => {
      summary.totalSales += txn.amount;
      summary.taxableAmount += txn.amount;
      summary.taxCollected += txn.tax;

      if (!byRegion[txn.regionCode]) {
        byRegion[txn.regionCode] = {
          sales: 0,
          taxCollected: 0,
          transactionCount: 0,
        };
      }

      byRegion[txn.regionCode].sales += txn.amount;
      byRegion[txn.regionCode].taxCollected += txn.tax;
      byRegion[txn.regionCode].transactionCount += 1;

      const region = this.taxRegions.get(txn.regionCode);
      if (region) {
        if (region.taxes.vat) {
          byTaxType.VAT = (byTaxType.VAT || 0) + txn.tax;
        }
        if (region.taxes.gst) {
          byTaxType.GST = (byTaxType.GST || 0) + txn.tax;
        }
        if (region.taxes.salesTax) {
          byTaxType['Sales Tax'] = (byTaxType['Sales Tax'] || 0) + txn.tax;
        }
      }
    });

    summary.taxPending = summary.taxCollected - summary.taxRemitted;

    const report: TaxReport = {
      id: `report-${Date.now()}`,
      period: {
        start: params.startDate,
        end: params.endDate,
      },
      summary,
      byRegion,
      byTaxType,
      status: 'draft',
    };

    this.taxReports.set(report.id, report);
    return report;
  }

  /**
   * Get tax regions
   */
  getTaxRegions(): TaxRegion[] {
    return Array.from(this.taxRegions.values());
  }

  /**
   * Get compliance documents
   */
  getDocuments(filters?: {
    type?: ComplianceDocument['type'];
    status?: ComplianceDocument['status'];
  }): ComplianceDocument[] {
    let documents = Array.from(this.documents.values());

    if (filters?.type) {
      documents = documents.filter((d) => d.type === filters.type);
    }

    if (filters?.status) {
      documents = documents.filter((d) => d.status === filters.status);
    }

    return documents;
  }

  /**
   * Get compliance statistics
   */
  async getComplianceStats() {
    const documents = Array.from(this.documents.values());
    const reports = Array.from(this.taxReports.values());

    const documentsByType = documents.reduce(
      (acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const documentsByStatus = documents.reduce(
      (acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalTaxCollected = reports.reduce((sum, report) => {
      return sum + report.summary.taxCollected;
    }, 0);

    const totalTaxPending = reports.reduce((sum, report) => {
      return sum + report.summary.taxPending;
    }, 0);

    return {
      totalDocuments: documents.length,
      documentsByType,
      documentsByStatus,
      totalTaxReports: reports.length,
      totalTaxCollected: Number(totalTaxCollected.toFixed(2)),
      totalTaxPending: Number(totalTaxPending.toFixed(2)),
    };
  }
}

// Export singleton instance
export const complianceTaxSystem = new ComplianceTaxSystem();
