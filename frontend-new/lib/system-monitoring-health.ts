/**
 * System Monitoring & Health System
 *
 * Comprehensive system monitoring and health tracking:
 * - Server health monitoring
 * - Application performance metrics
 * - Database performance tracking
 * - API endpoint monitoring
 * - Error tracking and alerting
 * - Resource utilization monitoring
 * - Uptime and availability tracking
 * - Real-time status dashboard
 */

export interface SystemHealth {
  timestamp: Date;
  overallStatus: 'healthy' | 'degraded' | 'critical' | 'down';

  // Component health
  components: {
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    responseTime?: number;
    uptime: number; // percentage
    lastChecked: Date;
    message?: string;
  }[];

  // System metrics
  metrics: {
    cpu: {
      usage: number; // percentage
      cores: number;
      load: number[];
    };
    memory: {
      total: number; // MB
      used: number; // MB
      free: number; // MB
      usage: number; // percentage
    };
    disk: {
      total: number; // GB
      used: number; // GB
      free: number; // GB
      usage: number; // percentage
    };
    network: {
      bytesIn: number;
      bytesOut: number;
      requestsPerSecond: number;
    };
  };

  // Active issues
  activeIssues: HealthIssue[];

  // Uptime
  uptime: {
    current: number; // seconds
    last24Hours: number; // percentage
    last7Days: number; // percentage
    last30Days: number; // percentage
  };
}

export interface HealthIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;

  // Details
  title: string;
  description: string;

  // Status
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';

  // Impact
  impact: {
    affectedUsers?: number;
    affectedServices: string[];
    impactLevel: 'none' | 'minor' | 'major' | 'critical';
  };

  // Timeline
  detectedAt: Date;
  resolvedAt?: Date;
  duration?: number; // minutes

  // Updates
  updates: {
    timestamp: Date;
    status: HealthIssue['status'];
    message: string;
    updatedBy: string;
  }[];
}

export interface PerformanceMetrics {
  timestamp: Date;
  period: {
    start: Date;
    end: Date;
  };

  // Application performance
  application: {
    averageResponseTime: number; // ms
    p50ResponseTime: number; // ms
    p95ResponseTime: number; // ms
    p99ResponseTime: number; // ms
    requestsPerSecond: number;
    errorsPerSecond: number;
    errorRate: number; // percentage
  };

  // Database performance
  database: {
    queryTime: {
      average: number; // ms
      p50: number;
      p95: number;
      p99: number;
    };
    connections: {
      active: number;
      idle: number;
      total: number;
      maxConnections: number;
    };
    slowQueries: number;
    deadlocks: number;
    cacheHitRatio: number; // percentage
  };

  // Cache performance
  cache: {
    hitRate: number; // percentage
    missRate: number; // percentage
    evictionRate: number;
    memoryUsage: number; // MB
    keyCount: number;
  };

  // Queue performance
  queue: {
    jobsProcessed: number;
    jobsFailed: number;
    averageProcessingTime: number; // ms
    queueLength: number;
    oldestJobAge: number; // seconds
  };
}

export interface APIEndpointMetrics {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  // Performance
  performance: {
    totalRequests: number;
    averageResponseTime: number; // ms
    p50: number;
    p95: number;
    p99: number;
    slowestRequest: number;
    fastestRequest: number;
  };

  // Status codes
  statusCodes: {
    '2xx': number;
    '3xx': number;
    '4xx': number;
    '5xx': number;
  };

  // Errors
  errorRate: number; // percentage
  errors: {
    type: string;
    count: number;
    lastOccurrence: Date;
  }[];

  // Traffic patterns
  traffic: {
    peakRequestsPerSecond: number;
    averageRequestsPerSecond: number;
    totalBandwidth: number; // bytes
  };

  period: {
    start: Date;
    end: Date;
  };
}

export interface ErrorLog {
  id: string;
  timestamp: Date;

  // Error details
  type:
    | 'application'
    | 'database'
    | 'network'
    | 'validation'
    | 'authorization'
    | 'external_api'
    | 'unknown';
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';

  // Message
  message: string;
  stackTrace?: string;
  errorCode?: string;

  // Context
  context: {
    endpoint?: string;
    method?: string;
    userId?: string;
    requestId?: string;
    environment: 'development' | 'staging' | 'production';
  };

  // Request details
  request?: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
    query?: Record<string, string>;
  };

  // System state
  systemState?: {
    cpuUsage: number;
    memoryUsage: number;
    activeConnections: number;
  };

  // Resolution
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;

  // Grouping
  fingerprint: string; // for grouping similar errors
  occurrences: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;

  // Condition
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  duration: number; // seconds - how long condition must be true

  // Severity
  severity: 'low' | 'medium' | 'high' | 'critical';

  // Actions
  actions: {
    type: 'email' | 'sms' | 'slack' | 'webhook' | 'pagerduty';
    recipients: string[];
    config?: Record<string, any>;
  }[];

  // Cooldown
  cooldownPeriod: number; // minutes - prevent alert spam
  lastTriggered?: Date;

  // Status
  status: 'active' | 'inactive' | 'suppressed';

  createdAt: Date;
  updatedAt: Date;
}

export interface UptimeRecord {
  timestamp: Date;
  service: string;

  // Status
  isUp: boolean;
  responseTime?: number; // ms
  statusCode?: number;

  // Check details
  checkType: 'http' | 'tcp' | 'ping' | 'dns';
  checkLocation: string;

  // Failure details
  failureReason?: string;
  errorMessage?: string;
}

export interface ServiceDependency {
  id: string;
  name: string;
  type: 'database' | 'cache' | 'queue' | 'external_api' | 'microservice' | 'cdn' | 'storage';

  // Connection
  host: string;
  port?: number;

  // Health check
  healthCheck: {
    enabled: boolean;
    endpoint?: string;
    interval: number; // seconds
    timeout: number; // seconds
    retries: number;
  };

  // Status
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastChecked?: Date;
  lastHealthy?: Date;

  // Metrics
  metrics?: {
    responseTime: number;
    uptime: number; // percentage
    errorRate: number;
  };

  // Criticality
  critical: boolean;

  // Fallback
  fallback?: {
    enabled: boolean;
    type: string;
    config?: Record<string, any>;
  };
}

export interface ResourceQuota {
  resource: 'cpu' | 'memory' | 'disk' | 'bandwidth' | 'database_connections' | 'api_requests';

  // Limits
  limit: number;
  used: number;
  available: number;

  // Usage
  usagePercentage: number;

  // Warnings
  warningThreshold: number; // percentage
  criticalThreshold: number; // percentage

  // Status
  status: 'normal' | 'warning' | 'critical';

  // Period
  period: 'per_second' | 'per_minute' | 'per_hour' | 'per_day' | 'total';

  lastUpdated: Date;
}

export interface SystemEvent {
  id: string;
  timestamp: Date;

  // Event details
  type:
    | 'deployment'
    | 'scaling'
    | 'configuration_change'
    | 'maintenance'
    | 'incident'
    | 'alert'
    | 'recovery';
  category: 'system' | 'application' | 'infrastructure' | 'security';

  // Description
  title: string;
  description: string;

  // Impact
  impact: 'none' | 'low' | 'medium' | 'high';
  affectedComponents: string[];

  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

  // Timeline
  scheduledFor?: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // minutes

  // User
  initiatedBy: {
    id: string;
    name: string;
  };

  // Metadata
  metadata?: Record<string, any>;
}

export interface PerformanceBenchmark {
  id: string;
  name: string;
  category: 'api' | 'database' | 'cache' | 'computation' | 'rendering';

  // Benchmark details
  description: string;

  // Results
  results: {
    timestamp: Date;
    duration: number; // ms
    iterations: number;
    averageTime: number; // ms
    minTime: number;
    maxTime: number;
    standardDeviation: number;
  }[];

  // Thresholds
  targetTime: number; // ms
  acceptableTime: number; // ms

  // Status
  status: 'passing' | 'warning' | 'failing';

  lastRun?: Date;
}

export class SystemMonitoringHealth {
  private healthRecords: Map<Date, SystemHealth>;
  private performanceMetrics: Map<Date, PerformanceMetrics>;
  private apiMetrics: Map<string, APIEndpointMetrics>;
  private errorLogs: Map<string, ErrorLog>;
  private alertRules: Map<string, AlertRule>;
  private uptimeRecords: Map<string, UptimeRecord[]>;
  private dependencies: Map<string, ServiceDependency>;
  private resourceQuotas: Map<string, ResourceQuota>;
  private systemEvents: Map<string, SystemEvent>;
  private benchmarks: Map<string, PerformanceBenchmark>;
  private activeIssues: Map<string, HealthIssue>;

  constructor() {
    this.healthRecords = new Map();
    this.performanceMetrics = new Map();
    this.apiMetrics = new Map();
    this.errorLogs = new Map();
    this.alertRules = new Map();
    this.uptimeRecords = new Map();
    this.dependencies = new Map();
    this.resourceQuotas = new Map();
    this.systemEvents = new Map();
    this.benchmarks = new Map();
    this.activeIssues = new Map();

    // Initialize defaults
    this.initializeDefaults();
  }

  /**
   * Initialize default monitoring configuration
   */
  private initializeDefaults(): void {
    // Default alert rules
    const defaultAlertRules: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'High CPU Usage',
        description: 'Alert when CPU usage exceeds 80%',
        enabled: true,
        metric: 'cpu_usage',
        operator: 'greater_than',
        threshold: 80,
        duration: 300, // 5 minutes
        severity: 'high',
        actions: [
          {
            type: 'email',
            recipients: ['devops@artisans.com', 'tech-lead@artisans.com'],
          },
          {
            type: 'slack',
            recipients: ['#alerts'],
          },
        ],
        cooldownPeriod: 30,
        status: 'active',
      },
      {
        name: 'High Memory Usage',
        description: 'Alert when memory usage exceeds 85%',
        enabled: true,
        metric: 'memory_usage',
        operator: 'greater_than',
        threshold: 85,
        duration: 300,
        severity: 'high',
        actions: [
          {
            type: 'email',
            recipients: ['devops@artisans.com'],
          },
        ],
        cooldownPeriod: 30,
        status: 'active',
      },
      {
        name: 'High Error Rate',
        description: 'Alert when error rate exceeds 5%',
        enabled: true,
        metric: 'error_rate',
        operator: 'greater_than',
        threshold: 5,
        duration: 60,
        severity: 'critical',
        actions: [
          {
            type: 'email',
            recipients: ['devops@artisans.com', 'oncall@artisans.com'],
          },
          {
            type: 'slack',
            recipients: ['#critical-alerts'],
          },
          {
            type: 'sms',
            recipients: ['+91-9876543210'],
          },
        ],
        cooldownPeriod: 15,
        status: 'active',
      },
      {
        name: 'Slow API Response',
        description: 'Alert when P95 response time exceeds 1000ms',
        enabled: true,
        metric: 'api_p95_response_time',
        operator: 'greater_than',
        threshold: 1000,
        duration: 180,
        severity: 'medium',
        actions: [
          {
            type: 'email',
            recipients: ['devops@artisans.com'],
          },
        ],
        cooldownPeriod: 60,
        status: 'active',
      },
      {
        name: 'Database Connection Pool Full',
        description: 'Alert when DB connections exceed 90% of max',
        enabled: true,
        metric: 'database_connection_usage',
        operator: 'greater_than',
        threshold: 90,
        duration: 120,
        severity: 'high',
        actions: [
          {
            type: 'email',
            recipients: ['devops@artisans.com', 'database-admin@artisans.com'],
          },
        ],
        cooldownPeriod: 30,
        status: 'active',
      },
    ];

    defaultAlertRules.forEach((rule, index) => {
      const id = `alert-${Date.now()}-${index}`;
      this.alertRules.set(id, {
        ...rule,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Default service dependencies
    const defaultDependencies: Omit<ServiceDependency, 'id'>[] = [
      {
        name: 'Primary Database',
        type: 'database',
        host: 'postgres.internal',
        port: 5432,
        healthCheck: {
          enabled: true,
          interval: 30,
          timeout: 5,
          retries: 3,
        },
        status: 'healthy',
        critical: true,
      },
      {
        name: 'Redis Cache',
        type: 'cache',
        host: 'redis.internal',
        port: 6379,
        healthCheck: {
          enabled: true,
          interval: 30,
          timeout: 3,
          retries: 3,
        },
        status: 'healthy',
        critical: true,
      },
      {
        name: 'Payment Gateway',
        type: 'external_api',
        host: 'api.stripe.com',
        healthCheck: {
          enabled: true,
          endpoint: '/v1/health',
          interval: 60,
          timeout: 10,
          retries: 2,
        },
        status: 'healthy',
        critical: true,
        fallback: {
          enabled: true,
          type: 'razorpay',
        },
      },
      {
        name: 'Email Service',
        type: 'external_api',
        host: 'api.sendgrid.com',
        healthCheck: {
          enabled: true,
          interval: 120,
          timeout: 10,
          retries: 2,
        },
        status: 'healthy',
        critical: false,
      },
      {
        name: 'CDN',
        type: 'cdn',
        host: 'cdn.artisans.com',
        healthCheck: {
          enabled: true,
          interval: 60,
          timeout: 5,
          retries: 2,
        },
        status: 'healthy',
        critical: false,
      },
    ];

    defaultDependencies.forEach((dep, index) => {
      const id = `dep-${Date.now()}-${index}`;
      this.dependencies.set(id, { ...dep, id });
    });

    // Default resource quotas
    const defaultQuotas: Omit<ResourceQuota, 'lastUpdated'>[] = [
      {
        resource: 'cpu',
        limit: 100,
        used: 45.5,
        available: 54.5,
        usagePercentage: 45.5,
        warningThreshold: 70,
        criticalThreshold: 85,
        status: 'normal',
        period: 'total',
      },
      {
        resource: 'memory',
        limit: 32768, // MB
        used: 18432,
        available: 14336,
        usagePercentage: 56.25,
        warningThreshold: 75,
        criticalThreshold: 90,
        status: 'normal',
        period: 'total',
      },
      {
        resource: 'disk',
        limit: 1000, // GB
        used: 450,
        available: 550,
        usagePercentage: 45,
        warningThreshold: 70,
        criticalThreshold: 85,
        status: 'normal',
        period: 'total',
      },
      {
        resource: 'database_connections',
        limit: 100,
        used: 35,
        available: 65,
        usagePercentage: 35,
        warningThreshold: 80,
        criticalThreshold: 95,
        status: 'normal',
        period: 'total',
      },
      {
        resource: 'api_requests',
        limit: 10000,
        used: 3245,
        available: 6755,
        usagePercentage: 32.45,
        warningThreshold: 80,
        criticalThreshold: 95,
        status: 'normal',
        period: 'per_minute',
      },
    ];

    defaultQuotas.forEach((quota) => {
      this.resourceQuotas.set(quota.resource, {
        ...quota,
        lastUpdated: new Date(),
      });
    });
  }

  /**
   * Get current system health
   */
  async getCurrentHealth(): Promise<SystemHealth> {
    const health: SystemHealth = {
      timestamp: new Date(),
      overallStatus: 'healthy',
      components: [
        {
          name: 'Web Application',
          status: 'operational',
          responseTime: 125,
          uptime: 99.98,
          lastChecked: new Date(),
        },
        {
          name: 'API Server',
          status: 'operational',
          responseTime: 85,
          uptime: 99.95,
          lastChecked: new Date(),
        },
        {
          name: 'Database',
          status: 'operational',
          responseTime: 15,
          uptime: 99.99,
          lastChecked: new Date(),
        },
        {
          name: 'Cache Layer',
          status: 'operational',
          responseTime: 2,
          uptime: 99.97,
          lastChecked: new Date(),
        },
        {
          name: 'Queue Worker',
          status: 'operational',
          uptime: 99.92,
          lastChecked: new Date(),
        },
        {
          name: 'Payment Gateway',
          status: 'operational',
          responseTime: 245,
          uptime: 99.85,
          lastChecked: new Date(),
        },
        {
          name: 'Email Service',
          status: 'operational',
          uptime: 99.89,
          lastChecked: new Date(),
        },
        {
          name: 'CDN',
          status: 'operational',
          responseTime: 45,
          uptime: 99.99,
          lastChecked: new Date(),
        },
      ],
      metrics: {
        cpu: {
          usage: 45.5,
          cores: 8,
          load: [2.5, 2.3, 2.1],
        },
        memory: {
          total: 32768,
          used: 18432,
          free: 14336,
          usage: 56.25,
        },
        disk: {
          total: 1000,
          used: 450,
          free: 550,
          usage: 45,
        },
        network: {
          bytesIn: 1250000000,
          bytesOut: 2450000000,
          requestsPerSecond: 1250,
        },
      },
      activeIssues: Array.from(this.activeIssues.values()),
      uptime: {
        current: 2592000, // 30 days in seconds
        last24Hours: 99.98,
        last7Days: 99.95,
        last30Days: 99.92,
      },
    };

    this.healthRecords.set(health.timestamp, health);
    return health;
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(period: { start: Date; end: Date }): Promise<PerformanceMetrics> {
    const metrics: PerformanceMetrics = {
      timestamp: new Date(),
      period,
      application: {
        averageResponseTime: 125,
        p50ResponseTime: 85,
        p95ResponseTime: 285,
        p99ResponseTime: 485,
        requestsPerSecond: 1250,
        errorsPerSecond: 2.5,
        errorRate: 0.2,
      },
      database: {
        queryTime: {
          average: 15,
          p50: 8,
          p95: 45,
          p99: 125,
        },
        connections: {
          active: 35,
          idle: 15,
          total: 50,
          maxConnections: 100,
        },
        slowQueries: 12,
        deadlocks: 0,
        cacheHitRatio: 94.5,
      },
      cache: {
        hitRate: 92.5,
        missRate: 7.5,
        evictionRate: 0.5,
        memoryUsage: 8192,
        keyCount: 125000,
      },
      queue: {
        jobsProcessed: 45000,
        jobsFailed: 125,
        averageProcessingTime: 850,
        queueLength: 245,
        oldestJobAge: 45,
      },
    };

    this.performanceMetrics.set(metrics.timestamp, metrics);
    return metrics;
  }

  /**
   * Get API endpoint metrics
   */
  async getAPIMetrics(endpoint: string): Promise<APIEndpointMetrics | null> {
    return this.apiMetrics.get(endpoint) || null;
  }

  /**
   * Track API request
   */
  async trackAPIRequest(params: {
    endpoint: string;
    method: APIEndpointMetrics['method'];
    responseTime: number;
    statusCode: number;
    error?: { type: string; message: string };
  }): Promise<void> {
    const key = `${params.method}:${params.endpoint}`;
    let metrics = this.apiMetrics.get(key);

    if (!metrics) {
      metrics = {
        endpoint: params.endpoint,
        method: params.method,
        performance: {
          totalRequests: 0,
          averageResponseTime: 0,
          p50: 0,
          p95: 0,
          p99: 0,
          slowestRequest: 0,
          fastestRequest: Infinity,
        },
        statusCodes: {
          '2xx': 0,
          '3xx': 0,
          '4xx': 0,
          '5xx': 0,
        },
        errorRate: 0,
        errors: [],
        traffic: {
          peakRequestsPerSecond: 0,
          averageRequestsPerSecond: 0,
          totalBandwidth: 0,
        },
        period: {
          start: new Date(),
          end: new Date(),
        },
      };
      this.apiMetrics.set(key, metrics);
    }

    // Update metrics
    metrics.performance.totalRequests++;
    metrics.performance.averageResponseTime =
      (metrics.performance.averageResponseTime * (metrics.performance.totalRequests - 1) +
        params.responseTime) /
      metrics.performance.totalRequests;

    if (params.responseTime > metrics.performance.slowestRequest) {
      metrics.performance.slowestRequest = params.responseTime;
    }
    if (params.responseTime < metrics.performance.fastestRequest) {
      metrics.performance.fastestRequest = params.responseTime;
    }

    // Update status codes
    const statusCategory =
      `${Math.floor(params.statusCode / 100)}xx` as keyof typeof metrics.statusCodes;
    if (statusCategory in metrics.statusCodes) {
      metrics.statusCodes[statusCategory]++;
    }

    // Track errors
    if (params.error) {
      const existingError = metrics.errors.find((e) => e.type === params.error!.type);
      if (existingError) {
        existingError.count++;
        existingError.lastOccurrence = new Date();
      } else {
        metrics.errors.push({
          type: params.error.type,
          count: 1,
          lastOccurrence: new Date(),
        });
      }
    }

    metrics.period.end = new Date();
  }

  /**
   * Log error
   */
  async logError(params: {
    type: ErrorLog['type'];
    severity: ErrorLog['severity'];
    message: string;
    stackTrace?: string;
    errorCode?: string;
    context: ErrorLog['context'];
    request?: ErrorLog['request'];
  }): Promise<ErrorLog> {
    // Generate fingerprint for grouping
    const fingerprint = this.generateErrorFingerprint(params.message, params.stackTrace);

    // Check if error already exists
    const existingError = Array.from(this.errorLogs.values()).find(
      (e) => e.fingerprint === fingerprint && !e.resolved
    );

    if (existingError) {
      existingError.occurrences++;
      existingError.lastOccurrence = new Date();
      return existingError;
    }

    // Create new error log
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}`,
      timestamp: new Date(),
      type: params.type,
      severity: params.severity,
      message: params.message,
      stackTrace: params.stackTrace,
      errorCode: params.errorCode,
      context: params.context,
      request: params.request,
      resolved: false,
      fingerprint,
      occurrences: 1,
      firstOccurrence: new Date(),
      lastOccurrence: new Date(),
    };

    this.errorLogs.set(errorLog.id, errorLog);
    return errorLog;
  }

  /**
   * Generate error fingerprint for grouping
   */
  private generateErrorFingerprint(message: string, stackTrace?: string): string {
    const content = `${message}${stackTrace || ''}`;
    // Simple hash function (in production, use a proper hash like MD5)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  /**
   * Create health issue
   */
  async createIssue(params: {
    severity: HealthIssue['severity'];
    component: string;
    title: string;
    description: string;
    affectedServices: string[];
    impactLevel: HealthIssue['impact']['impactLevel'];
  }): Promise<HealthIssue> {
    const issue: HealthIssue = {
      id: `issue-${Date.now()}`,
      severity: params.severity,
      component: params.component,
      title: params.title,
      description: params.description,
      status: 'investigating',
      impact: {
        affectedServices: params.affectedServices,
        impactLevel: params.impactLevel,
      },
      detectedAt: new Date(),
      updates: [],
    };

    this.activeIssues.set(issue.id, issue);
    return issue;
  }

  /**
   * Update issue
   */
  async updateIssue(params: {
    issueId: string;
    status: HealthIssue['status'];
    message: string;
    updatedBy: string;
  }): Promise<void> {
    const issue = this.activeIssues.get(params.issueId);
    if (!issue) return;

    issue.status = params.status;
    issue.updates.push({
      timestamp: new Date(),
      status: params.status,
      message: params.message,
      updatedBy: params.updatedBy,
    });

    if (params.status === 'resolved') {
      issue.resolvedAt = new Date();
      issue.duration = Math.floor(
        (issue.resolvedAt.getTime() - issue.detectedAt.getTime()) / 60000
      );
      this.activeIssues.delete(params.issueId);
    }
  }

  /**
   * Record uptime check
   */
  async recordUptimeCheck(params: {
    service: string;
    isUp: boolean;
    responseTime?: number;
    statusCode?: number;
    checkType: UptimeRecord['checkType'];
    checkLocation: string;
    failureReason?: string;
  }): Promise<void> {
    const record: UptimeRecord = {
      timestamp: new Date(),
      service: params.service,
      isUp: params.isUp,
      responseTime: params.responseTime,
      statusCode: params.statusCode,
      checkType: params.checkType,
      checkLocation: params.checkLocation,
      failureReason: params.failureReason,
    };

    const records = this.uptimeRecords.get(params.service) || [];
    records.push(record);
    this.uptimeRecords.set(params.service, records);

    // Keep only last 1000 records per service
    if (records.length > 1000) {
      records.shift();
    }
  }

  /**
   * Check dependency health
   */
  async checkDependencyHealth(dependencyId: string): Promise<void> {
    const dependency = this.dependencies.get(dependencyId);
    if (!dependency || !dependency.healthCheck.enabled) return;

    try {
      // Simulate health check (in production, make actual HTTP/TCP check)
      const isHealthy = Math.random() > 0.05; // 95% success rate

      dependency.status = isHealthy ? 'healthy' : 'unhealthy';
      dependency.lastChecked = new Date();

      if (isHealthy) {
        dependency.lastHealthy = new Date();
        dependency.metrics = {
          responseTime: Math.random() * 100,
          uptime: 99.9,
          errorRate: 0.1,
        };
      }
    } catch (error) {
      dependency.status = 'unhealthy';
    }
  }

  /**
   * Create alert rule
   */
  async createAlertRule(
    params: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<AlertRule> {
    const rule: AlertRule = {
      ...params,
      id: `alert-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.alertRules.set(rule.id, rule);
    return rule;
  }

  /**
   * Trigger alert
   */
  async triggerAlert(ruleId: string): Promise<void> {
    const rule = this.alertRules.get(ruleId);
    if (!rule || !rule.enabled) return;

    // Check cooldown
    if (rule.lastTriggered) {
      const minutesSinceLastTrigger = (Date.now() - rule.lastTriggered.getTime()) / 60000;
      if (minutesSinceLastTrigger < rule.cooldownPeriod) {
        return;
      }
    }

    // Execute actions (in production, send actual notifications)
    for (const action of rule.actions) {
      console.log(
        `Alert triggered: ${rule.name} via ${action.type} to ${action.recipients.join(', ')}`
      );
    }

    rule.lastTriggered = new Date();
  }

  /**
   * Log system event
   */
  async logSystemEvent(params: {
    type: SystemEvent['type'];
    category: SystemEvent['category'];
    title: string;
    description: string;
    impact: SystemEvent['impact'];
    affectedComponents: string[];
    initiatedBy: SystemEvent['initiatedBy'];
    scheduledFor?: Date;
    metadata?: Record<string, any>;
  }): Promise<SystemEvent> {
    const event: SystemEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: params.type,
      category: params.category,
      title: params.title,
      description: params.description,
      impact: params.impact,
      affectedComponents: params.affectedComponents,
      status: params.scheduledFor ? 'scheduled' : 'completed',
      scheduledFor: params.scheduledFor,
      initiatedBy: params.initiatedBy,
      metadata: params.metadata,
    };

    if (!params.scheduledFor) {
      event.startedAt = new Date();
      event.completedAt = new Date();
      event.duration = 0;
    }

    this.systemEvents.set(event.id, event);
    return event;
  }

  /**
   * Get error logs
   */
  async getErrorLogs(params: {
    severity?: ErrorLog['severity'];
    type?: ErrorLog['type'];
    resolved?: boolean;
    limit?: number;
  }): Promise<ErrorLog[]> {
    let errors = Array.from(this.errorLogs.values());

    if (params.severity) {
      errors = errors.filter((e) => e.severity === params.severity);
    }

    if (params.type) {
      errors = errors.filter((e) => e.type === params.type);
    }

    if (params.resolved !== undefined) {
      errors = errors.filter((e) => e.resolved === params.resolved);
    }

    // Sort by last occurrence
    errors.sort((a, b) => b.lastOccurrence.getTime() - a.lastOccurrence.getTime());

    if (params.limit) {
      errors = errors.slice(0, params.limit);
    }

    return errors;
  }

  /**
   * Get active issues
   */
  async getActiveIssues(): Promise<HealthIssue[]> {
    return Array.from(this.activeIssues.values()).sort(
      (a, b) => b.detectedAt.getTime() - a.detectedAt.getTime()
    );
  }

  /**
   * Get alert rules
   */
  async getAlertRules(enabled?: boolean): Promise<AlertRule[]> {
    let rules = Array.from(this.alertRules.values());

    if (enabled !== undefined) {
      rules = rules.filter((r) => r.enabled === enabled);
    }

    return rules;
  }

  /**
   * Get service dependencies
   */
  async getServiceDependencies(): Promise<ServiceDependency[]> {
    return Array.from(this.dependencies.values());
  }

  /**
   * Get resource quotas
   */
  async getResourceQuotas(): Promise<ResourceQuota[]> {
    return Array.from(this.resourceQuotas.values());
  }

  /**
   * Get system events
   */
  async getSystemEvents(params: {
    type?: SystemEvent['type'];
    category?: SystemEvent['category'];
    limit?: number;
  }): Promise<SystemEvent[]> {
    let events = Array.from(this.systemEvents.values());

    if (params.type) {
      events = events.filter((e) => e.type === params.type);
    }

    if (params.category) {
      events = events.filter((e) => e.category === params.category);
    }

    // Sort by timestamp descending
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (params.limit) {
      events = events.slice(0, params.limit);
    }

    return events;
  }

  /**
   * Get uptime statistics
   */
  async getUptimeStats(params: { service: string; period: { start: Date; end: Date } }): Promise<{
    uptime: number;
    downtime: number;
    totalChecks: number;
    failedChecks: number;
    averageResponseTime: number;
  }> {
    const records = this.uptimeRecords.get(params.service) || [];
    const periodRecords = records.filter(
      (r) => r.timestamp >= params.period.start && r.timestamp <= params.period.end
    );

    const totalChecks = periodRecords.length;
    const failedChecks = periodRecords.filter((r) => !r.isUp).length;
    const successfulChecks = totalChecks - failedChecks;

    const uptime = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 100;
    const downtime = 100 - uptime;

    const responseTimes = periodRecords
      .filter((r) => r.responseTime !== undefined)
      .map((r) => r.responseTime!);
    const averageResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    return {
      uptime,
      downtime,
      totalChecks,
      failedChecks,
      averageResponseTime,
    };
  }
}

// Export singleton instance
export const systemMonitoringHealth = new SystemMonitoringHealth();
