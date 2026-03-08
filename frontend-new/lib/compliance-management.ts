/**
 * Compliance Management System
 *
 * Regulatory compliance and data protection
 */

export interface ComplianceRegulation {
  id: string;
  name: string;
  jurisdiction: string;
  type: 'privacy' | 'security' | 'financial' | 'accessibility' | 'consumer_protection';
  requirements: string[];
  implementationStatus: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant';
  lastAudit?: Date;
}

export interface DataRetentionPolicy {
  id: string;
  dataType: string;
  retentionPeriod: number; // days
  deletionMethod: 'soft' | 'hard';
  legalBasis: string;
  active: boolean;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'marketing' | 'data_processing' | 'cookies' | 'third_party_sharing';
  granted: boolean;
  timestamp: Date;
  version: string;
  ipAddress?: string;
}

export interface DataSubjectRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'deletion' | 'portability' | 'rectification' | 'restriction';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: Date;
  completedAt?: Date;
  responseData?: any;
}

export class ComplianceManagementSystem {
  private regulations: Map<string, ComplianceRegulation> = new Map();
  private retentionPolicies: Map<string, DataRetentionPolicy> = new Map();
  private consents: Map<string, ConsentRecord> = new Map();
  private dsrRequests: Map<string, DataSubjectRequest> = new Map();

  constructor() {
    this.initializeDefaultRegulations();
  }

  async createRegulation(data: {
    name: string;
    jurisdiction: string;
    type: ComplianceRegulation['type'];
    requirements: string[];
  }): Promise<ComplianceRegulation> {
    const regulation: ComplianceRegulation = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      jurisdiction: data.jurisdiction,
      type: data.type,
      requirements: data.requirements,
      implementationStatus: 'not_started',
    };
    this.regulations.set(regulation.id, regulation);
    return regulation;
  }

  async recordConsent(data: {
    userId: string;
    consentType: ConsentRecord['consentType'];
    granted: boolean;
    version: string;
    ipAddress?: string;
  }): Promise<ConsentRecord> {
    const consent: ConsentRecord = {
      id: `consent-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      consentType: data.consentType,
      granted: data.granted,
      timestamp: new Date(),
      version: data.version,
      ipAddress: data.ipAddress,
    };
    this.consents.set(consent.id, consent);
    return consent;
  }

  async submitDataSubjectRequest(data: {
    userId: string;
    requestType: DataSubjectRequest['requestType'];
  }): Promise<DataSubjectRequest> {
    const request: DataSubjectRequest = {
      id: `dsr-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      requestType: data.requestType,
      status: 'pending',
      submittedAt: new Date(),
    };
    this.dsrRequests.set(request.id, request);
    return request;
  }

  async processDataSubjectRequest(
    requestId: string,
    responseData?: any
  ): Promise<DataSubjectRequest> {
    const request = this.dsrRequests.get(requestId);
    if (!request) throw new Error('Request not found');

    request.status = 'completed';
    request.completedAt = new Date();
    request.responseData = responseData;
    this.dsrRequests.set(requestId, request);

    return request;
  }

  async createRetentionPolicy(data: {
    dataType: string;
    retentionPeriod: number;
    deletionMethod: DataRetentionPolicy['deletionMethod'];
    legalBasis: string;
  }): Promise<DataRetentionPolicy> {
    const policy: DataRetentionPolicy = {
      id: `policy-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      dataType: data.dataType,
      retentionPeriod: data.retentionPeriod,
      deletionMethod: data.deletionMethod,
      legalBasis: data.legalBasis,
      active: true,
    };
    this.retentionPolicies.set(policy.id, policy);
    return policy;
  }

  async getComplianceStatus(): Promise<{
    regulations: { total: number; compliant: number; nonCompliant: number };
    consents: { total: number; granted: number; revoked: number };
    dsrRequests: { pending: number; completed: number };
    retentionPolicies: number;
  }> {
    const regs = Array.from(this.regulations.values());
    const consents = Array.from(this.consents.values());
    const requests = Array.from(this.dsrRequests.values());

    return {
      regulations: {
        total: regs.length,
        compliant: regs.filter((r) => r.implementationStatus === 'compliant').length,
        nonCompliant: regs.filter((r) => r.implementationStatus === 'non_compliant').length,
      },
      consents: {
        total: consents.length,
        granted: consents.filter((c) => c.granted).length,
        revoked: consents.filter((c) => !c.granted).length,
      },
      dsrRequests: {
        pending: requests.filter((r) => r.status === 'pending').length,
        completed: requests.filter((r) => r.status === 'completed').length,
      },
      retentionPolicies: this.retentionPolicies.size,
    };
  }

  private initializeDefaultRegulations(): void {
    this.createRegulation({
      name: 'GDPR',
      jurisdiction: 'EU',
      type: 'privacy',
      requirements: [
        'Data minimization',
        'Right to erasure',
        'Data portability',
        'Consent management',
      ],
    });

    this.createRegulation({
      name: 'DPDPA',
      jurisdiction: 'India',
      type: 'privacy',
      requirements: ['Data protection', 'User consent', 'Data breach notification'],
    });

    this.createRetentionPolicy({
      dataType: 'user_data',
      retentionPeriod: 2555, // 7 years
      deletionMethod: 'soft',
      legalBasis: 'Legal obligation',
    });
  }
}

export const complianceManagementSystem = new ComplianceManagementSystem();
