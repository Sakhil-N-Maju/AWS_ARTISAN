/**
 * Audit & Logging System
 *
 * Comprehensive audit trail and logging system:
 * - User activity logging
 * - Data change tracking
 * - Security audit trails
 * - Compliance logging
 * - Access logs
 * - Transaction logs
 * - System logs
 * - Log retention and archival
 */

export interface AuditLog {
  id: string;
  timestamp: Date;

  // Actor information
  actor: {
    id: string;
    type: 'user' | 'admin' | 'system' | 'api' | 'service';
    name: string;
    email?: string;
    ipAddress: string;
    userAgent?: string;
  };

  // Action details
  action: {
    type:
      | 'create'
      | 'read'
      | 'update'
      | 'delete'
      | 'login'
      | 'logout'
      | 'export'
      | 'import'
      | 'approve'
      | 'reject'
      | 'restore'
      | 'archive';
    category:
      | 'authentication'
      | 'authorization'
      | 'data_modification'
      | 'configuration'
      | 'security'
      | 'compliance'
      | 'system';
    resource: string; // e.g., 'user', 'product', 'order'
    resourceId?: string;
    description: string;
  };

  // Changes tracking
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
    valueType: string;
  }[];

  // Request details
  request?: {
    method: string;
    endpoint: string;
    headers?: Record<string, string>;
    query?: Record<string, any>;
    body?: any;
  };

  // Response details
  response?: {
    statusCode: number;
    duration: number; // ms
    error?: string;
  };

  // Context
  context: {
    sessionId?: string;
    organizationId?: string;
    environment: 'development' | 'staging' | 'production';
    location?: {
      country?: string;
      city?: string;
      coordinates?: { lat: number; lng: number };
    };
  };

  // Metadata
  metadata?: Record<string, any>;
  tags: string[];

  // Retention
  retentionPeriod: number; // days
  expiresAt?: Date;
  archived: boolean;
}

export interface SecurityAuditLog extends AuditLog {
  // Security-specific fields
  security: {
    severity: 'low' | 'medium' | 'high' | 'critical';
    threatLevel: number; // 0-100

    // Indicators
    suspicious: boolean;
    anomalyScore?: number;
    riskFactors: string[];

    // Detection
    detectionMethod?: 'rule_based' | 'ml_based' | 'pattern_matching' | 'threshold';
    detectionRule?: string;

    // Response
    actionTaken?: 'allowed' | 'blocked' | 'flagged' | 'rate_limited';
    requiresReview: boolean;
  };
}

export interface ComplianceLog {
  id: string;
  timestamp: Date;

  // Compliance framework
  framework: 'GDPR' | 'PCI_DSS' | 'SOC2' | 'HIPAA' | 'ISO27001' | 'custom';
  requirement: string;

  // Event details
  eventType:
    | 'data_access'
    | 'data_export'
    | 'data_deletion'
    | 'consent_given'
    | 'consent_withdrawn'
    | 'breach_detected'
    | 'policy_violation';
  description: string;

  // Subject
  subject: {
    type: 'customer' | 'employee' | 'vendor' | 'system';
    id: string;
    name?: string;
  };

  // Data details
  dataCategory: 'personal' | 'financial' | 'health' | 'behavioral' | 'biometric' | 'other';
  dataSensitivity: 'public' | 'internal' | 'confidential' | 'restricted';

  // Action
  action: string;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };

  // Justification
  legalBasis?: string;
  consentId?: string;
  purposeOfProcessing?: string;

  // Status
  status: 'compliant' | 'non_compliant' | 'needs_review';

  // Metadata
  metadata?: Record<string, any>;
}

export interface AccessLog {
  id: string;
  timestamp: Date;

  // User
  userId: string;
  username: string;
  userType: 'customer' | 'artisan' | 'admin' | 'system';

  // Access details
  accessType: 'login' | 'logout' | 'api_call' | 'page_view' | 'resource_access' | 'failed_login';
  resource?: string;

  // Authentication
  authMethod: 'password' | 'oauth' | 'api_key' | 'token' | 'sso' | 'biometric';
  mfaUsed: boolean;

  // Request
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    region?: string;
  };

  // Session
  sessionId?: string;
  sessionDuration?: number; // seconds

  // Status
  success: boolean;
  failureReason?: string;

  // Security flags
  suspicious: boolean;
  riskScore?: number;
  riskFactors?: string[];
}

export interface DataChangeLog {
  id: string;
  timestamp: Date;

  // Entity details
  entityType: string;
  entityId: string;

  // Change details
  operation: 'create' | 'update' | 'delete' | 'restore';

  // Before/After state
  before?: Record<string, any>;
  after?: Record<string, any>;

  // Field-level changes
  changes: {
    field: string;
    path: string; // JSON path for nested fields
    oldValue: any;
    newValue: any;
    changeType: 'added' | 'modified' | 'removed';
  }[];

  // Change context
  changeBy: {
    id: string;
    name: string;
    type: 'user' | 'admin' | 'system';
  };
  reason?: string;

  // Approval
  requiresApproval: boolean;
  approvedBy?: {
    id: string;
    name: string;
    approvedAt: Date;
  };

  // Rollback
  rollbackable: boolean;
  rolledBack: boolean;
  rolledBackAt?: Date;
  rolledBackBy?: string;

  // Version
  version: number;
  previousVersionId?: string;
}

export interface TransactionLog {
  id: string;
  timestamp: Date;

  // Transaction details
  transactionId: string;
  transactionType: 'order' | 'payment' | 'refund' | 'payout' | 'adjustment' | 'credit' | 'debit';

  // Parties
  parties: {
    customer?: {
      id: string;
      name: string;
    };
    artisan?: {
      id: string;
      name: string;
    };
    admin?: {
      id: string;
      name: string;
    };
  };

  // Financial details
  amount: number;
  currency: string;

  // Payment details
  paymentMethod?: string;
  paymentGateway?: string;
  gatewayTransactionId?: string;

  // Status
  status: 'initiated' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

  // Related entities
  orderId?: string;
  invoiceId?: string;
  refundId?: string;

  // Metadata
  metadata?: Record<string, any>;
}

export interface SystemLog {
  id: string;
  timestamp: Date;

  // Log level
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';

  // Source
  source: {
    service: string;
    component: string;
    function?: string;
    file?: string;
    line?: number;
  };

  // Message
  message: string;

  // Error details
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };

  // Context
  context?: Record<string, any>;

  // Performance
  performance?: {
    duration?: number;
    memoryUsage?: number;
    cpuUsage?: number;
  };

  // Correlation
  correlationId?: string;
  requestId?: string;

  // Environment
  environment: 'development' | 'staging' | 'production';
  hostname?: string;
  processId?: number;
}

export interface AuditReport {
  id: string;
  name: string;
  type: 'security' | 'compliance' | 'activity' | 'data_access' | 'system' | 'custom';

  // Period
  period: {
    start: Date;
    end: Date;
  };

  // Filters
  filters: {
    actors?: string[];
    actions?: string[];
    resources?: string[];
    severity?: string[];
  };

  // Summary
  summary: {
    totalLogs: number;
    uniqueActors: number;
    criticalEvents: number;
    complianceIssues: number;
    securityIncidents: number;
  };

  // Findings
  findings: {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    title: string;
    description: string;
    count: number;
    affectedResources: string[];
    recommendation?: string;
  }[];

  // Data
  logs: AuditLog[];

  // Generation
  generatedAt: Date;
  generatedBy: {
    id: string;
    name: string;
  };

  // Export
  format?: 'pdf' | 'csv' | 'json' | 'excel';
  exportUrl?: string;
}

export interface LogRetentionPolicy {
  id: string;
  name: string;
  description: string;

  // Scope
  logType: 'audit' | 'security' | 'compliance' | 'access' | 'transaction' | 'system' | 'all';

  // Retention
  retentionPeriod: number; // days
  archiveAfter?: number; // days

  // Conditions
  conditions?: {
    severity?: string[];
    category?: string[];
    tags?: string[];
  };

  // Actions
  actions: {
    archive: boolean;
    compress: boolean;
    encrypt: boolean;
    delete: boolean;
  };

  // Status
  enabled: boolean;

  // Execution
  lastRun?: Date;
  nextRun?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface LogSearch {
  query: string;
  filters?: {
    timeRange?: { start: Date; end: Date };
    logType?: string[];
    severity?: string[];
    actors?: string[];
    resources?: string[];
    actions?: string[];
    tags?: string[];
  };

  // Pagination
  limit?: number;
  offset?: number;

  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LogAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  // Volume metrics
  volume: {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
  };

  // Activity metrics
  activity: {
    uniqueActors: number;
    topActors: {
      id: string;
      name: string;
      actionCount: number;
    }[];
    topActions: {
      action: string;
      count: number;
    }[];
    topResources: {
      resource: string;
      count: number;
    }[];
  };

  // Temporal patterns
  temporal: {
    byHour: { hour: number; count: number }[];
    byDay: { day: string; count: number }[];
    byWeek: { week: number; count: number }[];
  };

  // Security insights
  security: {
    suspiciousActivities: number;
    failedLogins: number;
    anomalies: number;
    blockedActions: number;
  };

  // Compliance insights
  compliance: {
    totalComplianceLogs: number;
    violations: number;
    needsReview: number;
    byFramework: Record<string, number>;
  };
}

export class AuditLoggingSystem {
  private auditLogs: Map<string, AuditLog>;
  private securityLogs: Map<string, SecurityAuditLog>;
  private complianceLogs: Map<string, ComplianceLog>;
  private accessLogs: Map<string, AccessLog>;
  private dataChangeLogs: Map<string, DataChangeLog>;
  private transactionLogs: Map<string, TransactionLog>;
  private systemLogs: Map<string, SystemLog>;
  private retentionPolicies: Map<string, LogRetentionPolicy>;
  private reports: Map<string, AuditReport>;

  constructor() {
    this.auditLogs = new Map();
    this.securityLogs = new Map();
    this.complianceLogs = new Map();
    this.accessLogs = new Map();
    this.dataChangeLogs = new Map();
    this.transactionLogs = new Map();
    this.systemLogs = new Map();
    this.retentionPolicies = new Map();
    this.reports = new Map();

    // Initialize default retention policies
    this.initializeDefaults();
  }

  /**
   * Initialize default retention policies
   */
  private initializeDefaults(): void {
    const defaultPolicies: Omit<LogRetentionPolicy, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Security Logs - Long Term',
        description: 'Retain security logs for 2 years, archive after 90 days',
        logType: 'security',
        retentionPeriod: 730, // 2 years
        archiveAfter: 90,
        conditions: {
          severity: ['high', 'critical'],
        },
        actions: {
          archive: true,
          compress: true,
          encrypt: true,
          delete: false,
        },
        enabled: true,
      },
      {
        name: 'Compliance Logs - Regulatory',
        description: 'Retain compliance logs for 7 years per regulatory requirements',
        logType: 'compliance',
        retentionPeriod: 2555, // 7 years
        archiveAfter: 365,
        actions: {
          archive: true,
          compress: true,
          encrypt: true,
          delete: false,
        },
        enabled: true,
      },
      {
        name: 'Audit Logs - Standard',
        description: 'Retain audit logs for 1 year',
        logType: 'audit',
        retentionPeriod: 365,
        archiveAfter: 90,
        actions: {
          archive: true,
          compress: true,
          encrypt: false,
          delete: true,
        },
        enabled: true,
      },
      {
        name: 'Access Logs - Standard',
        description: 'Retain access logs for 90 days',
        logType: 'access',
        retentionPeriod: 90,
        archiveAfter: 30,
        actions: {
          archive: true,
          compress: true,
          encrypt: false,
          delete: true,
        },
        enabled: true,
      },
      {
        name: 'System Logs - Short Term',
        description: 'Retain system logs for 30 days',
        logType: 'system',
        retentionPeriod: 30,
        actions: {
          archive: false,
          compress: true,
          encrypt: false,
          delete: true,
        },
        enabled: true,
      },
      {
        name: 'Transaction Logs - Financial',
        description: 'Retain transaction logs for 7 years per tax requirements',
        logType: 'transaction',
        retentionPeriod: 2555,
        archiveAfter: 365,
        actions: {
          archive: true,
          compress: true,
          encrypt: true,
          delete: false,
        },
        enabled: true,
      },
    ];

    defaultPolicies.forEach((policy, index) => {
      const id = `policy-${Date.now()}-${index}`;
      this.retentionPolicies.set(id, {
        ...policy,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  /**
   * Log audit event
   */
  async logAudit(params: {
    actor: AuditLog['actor'];
    action: AuditLog['action'];
    changes?: AuditLog['changes'];
    request?: AuditLog['request'];
    response?: AuditLog['response'];
    context: AuditLog['context'];
    metadata?: Record<string, any>;
    tags?: string[];
  }): Promise<AuditLog> {
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date(),
      actor: params.actor,
      action: params.action,
      changes: params.changes,
      request: params.request,
      response: params.response,
      context: params.context,
      metadata: params.metadata,
      tags: params.tags || [],
      retentionPeriod: 365,
      archived: false,
    };

    // Set expiry based on retention policy
    const policy = this.findRetentionPolicy('audit', log);
    if (policy) {
      log.retentionPeriod = policy.retentionPeriod;
      log.expiresAt = new Date(Date.now() + policy.retentionPeriod * 24 * 60 * 60 * 1000);
    }

    this.auditLogs.set(log.id, log);
    return log;
  }

  /**
   * Log security event
   */
  async logSecurity(params: {
    actor: AuditLog['actor'];
    action: AuditLog['action'];
    security: SecurityAuditLog['security'];
    context: AuditLog['context'];
    metadata?: Record<string, any>;
  }): Promise<SecurityAuditLog> {
    const log: SecurityAuditLog = {
      id: `security-${Date.now()}`,
      timestamp: new Date(),
      actor: params.actor,
      action: params.action,
      security: params.security,
      context: params.context,
      metadata: params.metadata,
      tags: ['security'],
      retentionPeriod: 730, // 2 years default
      archived: false,
    };

    // Set expiry
    const policy = this.findRetentionPolicy('security', log);
    if (policy) {
      log.retentionPeriod = policy.retentionPeriod;
      log.expiresAt = new Date(Date.now() + policy.retentionPeriod * 24 * 60 * 60 * 1000);
    }

    this.securityLogs.set(log.id, log);
    return log;
  }

  /**
   * Log compliance event
   */
  async logCompliance(params: {
    framework: ComplianceLog['framework'];
    requirement: string;
    eventType: ComplianceLog['eventType'];
    description: string;
    subject: ComplianceLog['subject'];
    dataCategory: ComplianceLog['dataCategory'];
    dataSensitivity: ComplianceLog['dataSensitivity'];
    action: string;
    performedBy: ComplianceLog['performedBy'];
    legalBasis?: string;
    consentId?: string;
    purposeOfProcessing?: string;
  }): Promise<ComplianceLog> {
    const log: ComplianceLog = {
      id: `compliance-${Date.now()}`,
      timestamp: new Date(),
      framework: params.framework,
      requirement: params.requirement,
      eventType: params.eventType,
      description: params.description,
      subject: params.subject,
      dataCategory: params.dataCategory,
      dataSensitivity: params.dataSensitivity,
      action: params.action,
      performedBy: params.performedBy,
      legalBasis: params.legalBasis,
      consentId: params.consentId,
      purposeOfProcessing: params.purposeOfProcessing,
      status: 'compliant',
      metadata: {},
    };

    this.complianceLogs.set(log.id, log);
    return log;
  }

  /**
   * Log access event
   */
  async logAccess(params: {
    userId: string;
    username: string;
    userType: AccessLog['userType'];
    accessType: AccessLog['accessType'];
    resource?: string;
    authMethod: AccessLog['authMethod'];
    mfaUsed: boolean;
    ipAddress: string;
    userAgent: string;
    location?: AccessLog['location'];
    sessionId?: string;
    success: boolean;
    failureReason?: string;
    suspicious?: boolean;
    riskScore?: number;
  }): Promise<AccessLog> {
    const log: AccessLog = {
      id: `access-${Date.now()}`,
      timestamp: new Date(),
      userId: params.userId,
      username: params.username,
      userType: params.userType,
      accessType: params.accessType,
      resource: params.resource,
      authMethod: params.authMethod,
      mfaUsed: params.mfaUsed,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      location: params.location,
      sessionId: params.sessionId,
      success: params.success,
      failureReason: params.failureReason,
      suspicious: params.suspicious || false,
      riskScore: params.riskScore,
      riskFactors: [],
    };

    this.accessLogs.set(log.id, log);
    return log;
  }

  /**
   * Log data change
   */
  async logDataChange(params: {
    entityType: string;
    entityId: string;
    operation: DataChangeLog['operation'];
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes: DataChangeLog['changes'];
    changeBy: DataChangeLog['changeBy'];
    reason?: string;
    requiresApproval?: boolean;
  }): Promise<DataChangeLog> {
    const log: DataChangeLog = {
      id: `datachange-${Date.now()}`,
      timestamp: new Date(),
      entityType: params.entityType,
      entityId: params.entityId,
      operation: params.operation,
      before: params.before,
      after: params.after,
      changes: params.changes,
      changeBy: params.changeBy,
      reason: params.reason,
      requiresApproval: params.requiresApproval || false,
      rollbackable: true,
      rolledBack: false,
      version: 1,
    };

    this.dataChangeLogs.set(log.id, log);
    return log;
  }

  /**
   * Log transaction
   */
  async logTransaction(params: {
    transactionId: string;
    transactionType: TransactionLog['transactionType'];
    parties: TransactionLog['parties'];
    amount: number;
    currency: string;
    paymentMethod?: string;
    paymentGateway?: string;
    gatewayTransactionId?: string;
    status: TransactionLog['status'];
    orderId?: string;
    invoiceId?: string;
    metadata?: Record<string, any>;
  }): Promise<TransactionLog> {
    const log: TransactionLog = {
      id: `transaction-${Date.now()}`,
      timestamp: new Date(),
      transactionId: params.transactionId,
      transactionType: params.transactionType,
      parties: params.parties,
      amount: params.amount,
      currency: params.currency,
      paymentMethod: params.paymentMethod,
      paymentGateway: params.paymentGateway,
      gatewayTransactionId: params.gatewayTransactionId,
      status: params.status,
      orderId: params.orderId,
      invoiceId: params.invoiceId,
      metadata: params.metadata,
    };

    this.transactionLogs.set(log.id, log);
    return log;
  }

  /**
   * Log system event
   */
  async logSystem(params: {
    level: SystemLog['level'];
    source: SystemLog['source'];
    message: string;
    error?: SystemLog['error'];
    context?: Record<string, any>;
    performance?: SystemLog['performance'];
    correlationId?: string;
    environment: SystemLog['environment'];
  }): Promise<SystemLog> {
    const log: SystemLog = {
      id: `system-${Date.now()}`,
      timestamp: new Date(),
      level: params.level,
      source: params.source,
      message: params.message,
      error: params.error,
      context: params.context,
      performance: params.performance,
      correlationId: params.correlationId,
      environment: params.environment,
    };

    this.systemLogs.set(log.id, log);
    return log;
  }

  /**
   * Search logs
   */
  async searchLogs(search: LogSearch): Promise<{
    logs: AuditLog[];
    total: number;
  }> {
    let logs = Array.from(this.auditLogs.values());

    // Apply filters
    if (search.filters) {
      if (search.filters.timeRange) {
        logs = logs.filter(
          (l) =>
            l.timestamp >= search.filters!.timeRange!.start &&
            l.timestamp <= search.filters!.timeRange!.end
        );
      }

      if (search.filters.severity) {
        logs = logs.filter((l) => search.filters!.severity!.includes(l.action.category));
      }

      if (search.filters.actors) {
        logs = logs.filter((l) => search.filters!.actors!.includes(l.actor.id));
      }

      if (search.filters.resources) {
        logs = logs.filter((l) => search.filters!.resources!.includes(l.action.resource));
      }

      if (search.filters.actions) {
        logs = logs.filter((l) => search.filters!.actions!.includes(l.action.type));
      }

      if (search.filters.tags && search.filters.tags.length > 0) {
        logs = logs.filter((l) => search.filters!.tags!.some((tag) => l.tags.includes(tag)));
      }
    }

    // Text search
    if (search.query) {
      const query = search.query.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.description.toLowerCase().includes(query) ||
          l.actor.name.toLowerCase().includes(query) ||
          l.action.resource.toLowerCase().includes(query)
      );
    }

    const total = logs.length;

    // Sort
    const sortBy = search.sortBy || 'timestamp';
    const sortOrder = search.sortOrder || 'desc';
    logs.sort((a, b) => {
      const aVal = (a as any)[sortBy];
      const bVal = (b as any)[sortBy];

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const offset = search.offset || 0;
    const limit = search.limit || 50;
    logs = logs.slice(offset, offset + limit);

    return { logs, total };
  }

  /**
   * Generate audit report
   */
  async generateReport(params: {
    name: string;
    type: AuditReport['type'];
    period: { start: Date; end: Date };
    filters?: AuditReport['filters'];
    generatedBy: { id: string; name: string };
  }): Promise<AuditReport> {
    // Filter logs based on period and filters
    let logs = Array.from(this.auditLogs.values()).filter(
      (l) => l.timestamp >= params.period.start && l.timestamp <= params.period.end
    );

    if (params.filters) {
      if (params.filters.actors) {
        logs = logs.filter((l) => params.filters!.actors!.includes(l.actor.id));
      }
      if (params.filters.actions) {
        logs = logs.filter((l) => params.filters!.actions!.includes(l.action.type));
      }
      if (params.filters.resources) {
        logs = logs.filter((l) => params.filters!.resources!.includes(l.action.resource));
      }
    }

    // Calculate summary
    const uniqueActors = new Set(logs.map((l) => l.actor.id)).size;
    const criticalEvents = logs.filter((l) => l.action.category === 'security').length;
    const complianceIssues = Array.from(this.complianceLogs.values()).filter(
      (l) =>
        l.status === 'non_compliant' &&
        l.timestamp >= params.period.start &&
        l.timestamp <= params.period.end
    ).length;

    // Generate findings
    const findings: AuditReport['findings'] = [];

    // Check for failed login attempts
    const failedLogins = Array.from(this.accessLogs.values()).filter(
      (l) =>
        !l.success &&
        l.accessType === 'failed_login' &&
        l.timestamp >= params.period.start &&
        l.timestamp <= params.period.end
    );
    if (failedLogins.length > 10) {
      findings.push({
        id: 'finding-1',
        severity: 'medium',
        category: 'Security',
        title: 'High Number of Failed Login Attempts',
        description: `Detected ${failedLogins.length} failed login attempts during the reporting period`,
        count: failedLogins.length,
        affectedResources: ['Authentication System'],
        recommendation:
          'Review and consider implementing additional security measures such as account lockout policies',
      });
    }

    const report: AuditReport = {
      id: `report-${Date.now()}`,
      name: params.name,
      type: params.type,
      period: params.period,
      filters: params.filters || {},
      summary: {
        totalLogs: logs.length,
        uniqueActors,
        criticalEvents,
        complianceIssues,
        securityIncidents: 0,
      },
      findings,
      logs,
      generatedAt: new Date(),
      generatedBy: params.generatedBy,
    };

    this.reports.set(report.id, report);
    return report;
  }

  /**
   * Get log analytics
   */
  async getAnalytics(period: { start: Date; end: Date }): Promise<LogAnalytics> {
    const logs = Array.from(this.auditLogs.values()).filter(
      (l) => l.timestamp >= period.start && l.timestamp <= period.end
    );

    // Volume metrics
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    logs.forEach((log) => {
      byType[log.action.type] = (byType[log.action.type] || 0) + 1;
      byCategory[log.action.category] = (byCategory[log.action.category] || 0) + 1;
    });

    // Activity metrics
    const uniqueActors = new Set(logs.map((l) => l.actor.id)).size;

    const actorCounts = new Map<string, { id: string; name: string; count: number }>();
    logs.forEach((log) => {
      const existing = actorCounts.get(log.actor.id);
      if (existing) {
        existing.count++;
      } else {
        actorCounts.set(log.actor.id, {
          id: log.actor.id,
          name: log.actor.name,
          count: 1,
        });
      }
    });

    const topActors = Array.from(actorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((a) => ({ id: a.id, name: a.name, actionCount: a.count }));

    // Temporal patterns
    const byHour: { hour: number; count: number }[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
    }));

    logs.forEach((log) => {
      const hour = log.timestamp.getHours();
      byHour[hour].count++;
    });

    // Security insights
    const securityLogs = Array.from(this.securityLogs.values()).filter(
      (l) => l.timestamp >= period.start && l.timestamp <= period.end
    );

    const accessLogs = Array.from(this.accessLogs.values()).filter(
      (l) => l.timestamp >= period.start && l.timestamp <= period.end
    );

    return {
      period,
      volume: {
        total: logs.length,
        byType,
        byCategory,
        bySeverity,
      },
      activity: {
        uniqueActors,
        topActors,
        topActions: Object.entries(byType)
          .map(([action, count]) => ({ action, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topResources: [],
      },
      temporal: {
        byHour,
        byDay: [],
        byWeek: [],
      },
      security: {
        suspiciousActivities: securityLogs.filter((l) => l.security.suspicious).length,
        failedLogins: accessLogs.filter((l) => !l.success && l.accessType === 'failed_login')
          .length,
        anomalies: securityLogs.filter(
          (l) => l.security.anomalyScore && l.security.anomalyScore > 0.7
        ).length,
        blockedActions: securityLogs.filter((l) => l.security.actionTaken === 'blocked').length,
      },
      compliance: {
        totalComplianceLogs: this.complianceLogs.size,
        violations: Array.from(this.complianceLogs.values()).filter(
          (l) => l.status === 'non_compliant'
        ).length,
        needsReview: Array.from(this.complianceLogs.values()).filter(
          (l) => l.status === 'needs_review'
        ).length,
        byFramework: {},
      },
    };
  }

  /**
   * Find applicable retention policy
   */
  private findRetentionPolicy(logType: string, log: any): LogRetentionPolicy | null {
    const policies = Array.from(this.retentionPolicies.values()).filter(
      (p) => p.enabled && (p.logType === logType || p.logType === 'all')
    );

    // Find most specific matching policy
    for (const policy of policies) {
      if (policy.conditions) {
        // Check if log matches conditions
        let matches = true;

        if (policy.conditions.severity && log.severity) {
          matches = matches && policy.conditions.severity.includes(log.severity);
        }

        if (policy.conditions.tags && log.tags) {
          matches = matches && policy.conditions.tags.some((tag: string) => log.tags.includes(tag));
        }

        if (matches) {
          return policy;
        }
      } else {
        return policy;
      }
    }

    return null;
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get security logs
   */
  async getSecurityLogs(limit: number = 100): Promise<SecurityAuditLog[]> {
    return Array.from(this.securityLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get compliance logs
   */
  async getComplianceLogs(framework?: ComplianceLog['framework']): Promise<ComplianceLog[]> {
    let logs = Array.from(this.complianceLogs.values());

    if (framework) {
      logs = logs.filter((l) => l.framework === framework);
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get access logs
   */
  async getAccessLogs(userId?: string, limit: number = 100): Promise<AccessLog[]> {
    let logs = Array.from(this.accessLogs.values());

    if (userId) {
      logs = logs.filter((l) => l.userId === userId);
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }

  /**
   * Get data change logs
   */
  async getDataChangeLogs(params: {
    entityType?: string;
    entityId?: string;
    limit?: number;
  }): Promise<DataChangeLog[]> {
    let logs = Array.from(this.dataChangeLogs.values());

    if (params.entityType) {
      logs = logs.filter((l) => l.entityType === params.entityType);
    }

    if (params.entityId) {
      logs = logs.filter((l) => l.entityId === params.entityId);
    }

    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, params.limit || 100);
  }

  /**
   * Get transaction logs
   */
  async getTransactionLogs(params: {
    transactionType?: TransactionLog['transactionType'];
    orderId?: string;
    limit?: number;
  }): Promise<TransactionLog[]> {
    let logs = Array.from(this.transactionLogs.values());

    if (params.transactionType) {
      logs = logs.filter((l) => l.transactionType === params.transactionType);
    }

    if (params.orderId) {
      logs = logs.filter((l) => l.orderId === params.orderId);
    }

    return logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, params.limit || 100);
  }

  /**
   * Get retention policies
   */
  async getRetentionPolicies(): Promise<LogRetentionPolicy[]> {
    return Array.from(this.retentionPolicies.values());
  }

  /**
   * Get reports
   */
  async getReports(type?: AuditReport['type']): Promise<AuditReport[]> {
    let reports = Array.from(this.reports.values());

    if (type) {
      reports = reports.filter((r) => r.type === type);
    }

    return reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }
}

// Export singleton instance
export const auditLoggingSystem = new AuditLoggingSystem();
