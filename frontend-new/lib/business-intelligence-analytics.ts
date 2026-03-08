/**
 * Business Intelligence & Analytics System
 *
 * Comprehensive analytics platform for data aggregation, metrics calculation,
 * report generation, and business intelligence insights.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type MetricType = 'count' | 'sum' | 'average' | 'percentage' | 'ratio' | 'rate' | 'duration';

export type AggregationPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type DataSourceType =
  | 'sales'
  | 'users'
  | 'products'
  | 'inventory'
  | 'marketing'
  | 'customer-service'
  | 'financial'
  | 'operational';

export type VisualizationType =
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'area-chart'
  | 'scatter-plot'
  | 'heatmap'
  | 'table'
  | 'kpi-card';

export type TrendDirection = 'up' | 'down' | 'stable';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';

export type InsightType = 'opportunity' | 'risk' | 'trend' | 'anomaly' | 'recommendation';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  description: string;
  enabled: boolean;
  connectionInfo: {
    type: 'database' | 'api' | 'file' | 'stream';
    endpoint?: string;
    credentials?: {
      encrypted: boolean;
      lastUpdated: Date;
    };
    refreshInterval: number; // minutes
    lastRefresh?: Date;
  };
  schema: {
    fields: Array<{
      name: string;
      type: 'string' | 'number' | 'date' | 'boolean';
      nullable: boolean;
      indexed: boolean;
    }>;
    primaryKey: string;
    foreignKeys?: Array<{
      field: string;
      references: string;
    }>;
  };
  metrics: string[]; // Metric IDs
  quality: {
    completeness: number; // percentage
    accuracy: number; // percentage
    freshness: number; // minutes since last update
    consistency: number; // percentage
  };
  performance: {
    avgQueryTime: number; // ms
    recordCount: number;
    dataSize: number; // bytes
  };
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  type: MetricType;
  category: string;
  dataSource: string;
  formula: {
    expression: string;
    fields: string[];
    filters?: Array<{
      field: string;
      operator: 'equals' | 'greater-than' | 'less-than' | 'contains' | 'between';
      value: any;
    }>;
  };
  aggregation: {
    function: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct';
    period?: AggregationPeriod;
    groupBy?: string[];
  };
  formatting: {
    unit?: string;
    prefix?: string;
    suffix?: string;
    decimals: number;
    thousandsSeparator: boolean;
  };
  thresholds?: {
    warning?: number;
    critical?: number;
    target?: number;
    direction: 'higher-is-better' | 'lower-is-better';
  };
  businessContext: {
    owner: string;
    department: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    relatedMetrics: string[];
  };
  calculation: {
    lastCalculated?: Date;
    nextCalculation?: Date;
    calculationTime?: number; // ms
    cacheEnabled: boolean;
    cacheTTL?: number; // minutes
  };
}

export interface MetricValue {
  metricId: string;
  timestamp: Date;
  value: number;
  period: {
    start: Date;
    end: Date;
    type: AggregationPeriod;
  };
  dimensions?: Record<string, string>;
  metadata?: {
    sampleSize?: number;
    confidence?: number;
    dataQuality?: number;
  };
  comparisons?: {
    previousPeriod?: {
      value: number;
      change: number;
      changePercent: number;
    };
    yearOverYear?: {
      value: number;
      change: number;
      changePercent: number;
    };
    target?: {
      value: number;
      achievement: number; // percentage
      gap: number;
    };
  };
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'analytical' | 'custom';
  visibility: 'public' | 'private' | 'team' | 'role-based';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  layout: {
    rows: number;
    columns: number;
    widgets: Array<{
      id: string;
      widgetType: 'metric' | 'chart' | 'table' | 'filter' | 'text';
      position: {
        row: number;
        column: number;
        width: number;
        height: number;
      };
      config: Record<string, any>;
    }>;
  };
  filters: Array<{
    id: string;
    field: string;
    label: string;
    type: 'date-range' | 'select' | 'multi-select' | 'search';
    defaultValue?: any;
    options?: any[];
  }>;
  refreshSettings: {
    autoRefresh: boolean;
    refreshInterval?: number; // seconds
    lastRefresh?: Date;
  };
  access: {
    allowedUsers: string[];
    allowedRoles: string[];
    permissions: Array<{
      user: string;
      canView: boolean;
      canEdit: boolean;
      canShare: boolean;
    }>;
  };
  usage: {
    viewCount: number;
    uniqueViewers: number;
    lastViewed?: Date;
    avgLoadTime?: number; // ms
  };
}

export interface Widget {
  id: string;
  dashboardId: string;
  name: string;
  type: 'kpi' | 'chart' | 'table' | 'metric-trend' | 'comparison';
  visualization?: VisualizationType;
  dataConfig: {
    metrics: string[];
    dimensions?: string[];
    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    dateRange?: {
      type: 'relative' | 'absolute';
      start?: Date;
      end?: Date;
      relative?: {
        value: number;
        unit: 'days' | 'weeks' | 'months' | 'years';
      };
    };
    limit?: number;
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    };
  };
  display: {
    title: string;
    subtitle?: string;
    showLegend: boolean;
    showLabels: boolean;
    colorScheme?: string[];
    customStyles?: Record<string, any>;
  };
  interactions: {
    clickable: boolean;
    drillDown?: {
      enabled: boolean;
      targetDashboard?: string;
      parameters?: Record<string, string>;
    };
    tooltip?: {
      enabled: boolean;
      format?: string;
    };
  };
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'scheduled' | 'ad-hoc' | 'triggered';
  format: ReportFormat;
  category: string;
  template?: string;
  dataConfig: {
    dataSources: string[];
    metrics: string[];
    dimensions: string[];
    filters: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    dateRange: {
      start: Date;
      end: Date;
    };
  };
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string; // HH:mm format
    timezone: string;
    nextRun?: Date;
    lastRun?: Date;
  };
  distribution: {
    recipients: Array<{
      type: 'email' | 'slack' | 'teams' | 'webhook';
      address: string;
      format?: ReportFormat;
    }>;
    includeAttachment: boolean;
    includeLink: boolean;
  };
  sections: Array<{
    id: string;
    title: string;
    type: 'summary' | 'chart' | 'table' | 'text' | 'insights';
    order: number;
    content: any;
  }>;
  metadata: {
    createdBy: string;
    createdAt: Date;
    lastGenerated?: Date;
    generationTime?: number; // ms
    version: number;
  };
  status: 'draft' | 'active' | 'paused' | 'archived';
}

export interface ReportInstance {
  id: string;
  reportId: string;
  generatedAt: Date;
  generatedBy: string;
  period: {
    start: Date;
    end: Date;
  };
  status: 'generating' | 'completed' | 'failed';
  format: ReportFormat;
  data: {
    summary: Record<string, any>;
    metrics: MetricValue[];
    charts: any[];
    tables: any[];
  };
  file?: {
    url: string;
    size: number;
    hash: string;
    expiresAt?: Date;
  };
  delivery: {
    sent: boolean;
    sentAt?: Date;
    recipients: string[];
    failures?: Array<{
      recipient: string;
      error: string;
    }>;
  };
  performance: {
    generationTime: number; // ms
    dataFetchTime: number; // ms
    renderTime: number; // ms
  };
}

export interface AnalyticalInsight {
  id: string;
  type: InsightType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  detectedAt: Date;
  context: {
    metrics: string[];
    period: {
      start: Date;
      end: Date;
    };
    dimensions?: Record<string, string>;
  };
  evidence: {
    dataPoints: Array<{
      metric: string;
      value: number;
      expected?: number;
      deviation?: number;
    }>;
    visualizations?: string[]; // Widget IDs
    relatedInsights?: string[];
  };
  impact: {
    estimated: number;
    unit: string;
    affectedAreas: string[];
    timeframe?: string;
  };
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    estimatedImpact?: string;
    effort?: 'low' | 'medium' | 'high';
  }>;
  status: 'new' | 'acknowledged' | 'acted-upon' | 'dismissed';
  assignedTo?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  notes?: string;
}

export interface Cohort {
  id: string;
  name: string;
  description: string;
  definition: {
    baseEvent: string;
    eventDate: Date;
    criteria: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  size: number;
  createdAt: Date;
  segments: Array<{
    period: number;
    periodUnit: 'days' | 'weeks' | 'months';
    metrics: Record<string, number>;
  }>;
  analysis: {
    retention: number[]; // Retention rate by period
    ltv: number[];
    churnRate: number[];
    engagement: number[];
  };
}

export interface Funnel {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    id: string;
    name: string;
    event: string;
    order: number;
    criteria?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  }>;
  period: {
    start: Date;
    end: Date;
  };
  results: {
    totalEntries: number;
    stepMetrics: Array<{
      stepId: string;
      count: number;
      percentage: number;
      dropoff: number;
      dropoffRate: number;
      avgTimeToNext?: number; // seconds
    }>;
    overallConversion: number;
  };
  segments?: Array<{
    name: string;
    criteria: any;
    results: any;
  }>;
}

export interface DataCube {
  id: string;
  name: string;
  description: string;
  dimensions: Array<{
    name: string;
    type: 'time' | 'category' | 'geography' | 'custom';
    hierarchy?: string[];
    cardinality: number;
  }>;
  measures: Array<{
    name: string;
    aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max';
    formula?: string;
  }>;
  filters?: Array<{
    dimension: string;
    values: any[];
  }>;
  data: Array<{
    dimensions: Record<string, any>;
    measures: Record<string, number>;
  }>;
  metadata: {
    rowCount: number;
    lastRefresh: Date;
    refreshFrequency: number; // minutes
    dataLatency: number; // minutes
  };
}

export interface AnalyticsQuery {
  id: string;
  name?: string;
  type: 'aggregation' | 'timeseries' | 'breakdown' | 'funnel' | 'cohort';
  dataSources: string[];
  select: Array<{
    field: string;
    aggregation?: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct';
    alias?: string;
  }>;
  filters?: Array<{
    field: string;
    operator:
      | 'equals'
      | 'not-equals'
      | 'greater-than'
      | 'less-than'
      | 'in'
      | 'between'
      | 'contains';
    value: any;
  }>;
  groupBy?: string[];
  orderBy?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  limit?: number;
  dateRange?: {
    start: Date;
    end: Date;
    granularity?: 'hour' | 'day' | 'week' | 'month';
  };
  execution: {
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    executionTime?: number; // ms
    rowsReturned?: number;
    error?: string;
  };
  cache?: {
    enabled: boolean;
    ttl?: number; // minutes
    key?: string;
  };
}

export interface PerformanceMetrics {
  dashboards: {
    totalDashboards: number;
    activeDashboards: number;
    avgLoadTime: number;
    totalViews: number;
    uniqueUsers: number;
  };
  reports: {
    totalReports: number;
    scheduledReports: number;
    generatedToday: number;
    avgGenerationTime: number;
    failureRate: number;
  };
  queries: {
    totalQueries: number;
    avgExecutionTime: number;
    cacheHitRate: number;
    slowQueries: number; // > 5s
  };
  dataQuality: {
    avgCompleteness: number;
    avgAccuracy: number;
    avgFreshness: number;
    issuesDetected: number;
  };
}

// ============================================================================
// Main System Class
// ============================================================================

export class BusinessIntelligenceSystem {
  private dataSources: Map<string, DataSource> = new Map();
  private metrics: Map<string, Metric> = new Map();
  private metricValues: Map<string, MetricValue[]> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private widgets: Map<string, Widget> = new Map();
  private reports: Map<string, Report> = new Map();
  private reportInstances: Map<string, ReportInstance> = new Map();
  private insights: Map<string, AnalyticalInsight> = new Map();
  private cohorts: Map<string, Cohort> = new Map();
  private funnels: Map<string, Funnel> = new Map();
  private dataCubes: Map<string, DataCube> = new Map();
  private queries: Map<string, AnalyticsQuery> = new Map();
  private queryCache: Map<string, { data: any; expiresAt: Date }> = new Map();

  constructor() {
    this.initializeDefaultDataSources();
    this.initializeDefaultMetrics();
    this.initializeDefaultDashboards();
  }

  // ============================================================================
  // Data Source Management
  // ============================================================================

  registerDataSource(params: {
    name: string;
    type: DataSourceType;
    description: string;
    connectionInfo: Partial<DataSource['connectionInfo']>;
    schema: DataSource['schema'];
  }): DataSource {
    const dataSource: DataSource = {
      id: `ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      description: params.description,
      enabled: true,
      connectionInfo: {
        type: params.connectionInfo.type || 'database',
        refreshInterval: params.connectionInfo.refreshInterval || 60,
        ...params.connectionInfo,
      },
      schema: params.schema,
      metrics: [],
      quality: {
        completeness: 100,
        accuracy: 100,
        freshness: 0,
        consistency: 100,
      },
      performance: {
        avgQueryTime: 0,
        recordCount: 0,
        dataSize: 0,
      },
    };

    this.dataSources.set(dataSource.id, dataSource);
    return dataSource;
  }

  refreshDataSource(dataSourceId: string): void {
    const dataSource = this.dataSources.get(dataSourceId);
    if (!dataSource) throw new Error('Data source not found');

    dataSource.connectionInfo.lastRefresh = new Date();
    dataSource.quality.freshness = 0;

    // Simulate data quality check
    dataSource.quality.completeness = 95 + Math.random() * 5;
    dataSource.quality.accuracy = 95 + Math.random() * 5;
    dataSource.quality.consistency = 95 + Math.random() * 5;
  }

  // ============================================================================
  // Metric Management
  // ============================================================================

  createMetric(params: {
    name: string;
    description: string;
    type: MetricType;
    category: string;
    dataSource: string;
    formula: Metric['formula'];
    aggregation: Metric['aggregation'];
    formatting?: Partial<Metric['formatting']>;
    thresholds?: Metric['thresholds'];
  }): Metric {
    const metric: Metric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      type: params.type,
      category: params.category,
      dataSource: params.dataSource,
      formula: params.formula,
      aggregation: params.aggregation,
      formatting: {
        decimals: 2,
        thousandsSeparator: true,
        ...params.formatting,
      },
      thresholds: params.thresholds,
      businessContext: {
        owner: 'analytics-team',
        department: 'business-intelligence',
        importance: 'medium',
        relatedMetrics: [],
      },
      calculation: {
        cacheEnabled: true,
        cacheTTL: 60,
      },
    };

    this.metrics.set(metric.id, metric);

    // Add metric to data source
    const dataSource = this.dataSources.get(params.dataSource);
    if (dataSource) {
      dataSource.metrics.push(metric.id);
    }

    return metric;
  }

  calculateMetric(metricId: string, period: { start: Date; end: Date }): MetricValue {
    const metric = this.metrics.get(metricId);
    if (!metric) throw new Error('Metric not found');

    const startTime = Date.now();

    // Simulate metric calculation
    const value = this.executeMetricCalculation(metric, period);

    // Calculate comparisons
    const comparisons = this.calculateComparisons(metric, value, period);

    const metricValue: MetricValue = {
      metricId,
      timestamp: new Date(),
      value,
      period: {
        start: period.start,
        end: period.end,
        type: this.determinePeriodType(period.start, period.end),
      },
      comparisons,
      metadata: {
        sampleSize: 1000,
        confidence: 0.95,
        dataQuality: 0.98,
      },
    };

    // Store metric value
    const values = this.metricValues.get(metricId) || [];
    values.push(metricValue);
    this.metricValues.set(metricId, values);

    // Update calculation metadata
    metric.calculation.lastCalculated = new Date();
    metric.calculation.calculationTime = Date.now() - startTime;

    return metricValue;
  }

  private executeMetricCalculation(metric: Metric, period: { start: Date; end: Date }): number {
    // Simulated calculation based on metric type
    switch (metric.type) {
      case 'count':
        return Math.floor(1000 + Math.random() * 9000);
      case 'sum':
        return Math.floor(50000 + Math.random() * 450000);
      case 'average':
        return 50 + Math.random() * 200;
      case 'percentage':
        return Math.random() * 100;
      case 'ratio':
        return 0.5 + Math.random() * 4.5;
      case 'rate':
        return Math.random() * 0.5;
      case 'duration':
        return 60 + Math.random() * 3540; // 1-60 minutes in seconds
      default:
        return 0;
    }
  }

  private calculateComparisons(
    metric: Metric,
    currentValue: number,
    period: { start: Date; end: Date }
  ): MetricValue['comparisons'] {
    // Previous period comparison
    const periodLength = period.end.getTime() - period.start.getTime();
    const previousValue = currentValue * (0.9 + Math.random() * 0.2);
    const change = currentValue - previousValue;
    const changePercent = (change / previousValue) * 100;

    // Year over year comparison
    const yoyValue = currentValue * (0.8 + Math.random() * 0.4);
    const yoyChange = currentValue - yoyValue;
    const yoyChangePercent = (yoyChange / yoyValue) * 100;

    // Target comparison
    const targetValue = metric.thresholds?.target;
    const achievement = targetValue ? (currentValue / targetValue) * 100 : undefined;
    const gap = targetValue ? currentValue - targetValue : undefined;

    return {
      previousPeriod: {
        value: previousValue,
        change,
        changePercent,
      },
      yearOverYear: {
        value: yoyValue,
        change: yoyChange,
        changePercent: yoyChangePercent,
      },
      target: targetValue
        ? {
            value: targetValue,
            achievement: achievement!,
            gap: gap!,
          }
        : undefined,
    };
  }

  private determinePeriodType(start: Date, end: Date): AggregationPeriod {
    const diff = end.getTime() - start.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days <= 1) return 'hourly';
    if (days <= 7) return 'daily';
    if (days <= 31) return 'weekly';
    if (days <= 92) return 'monthly';
    if (days <= 366) return 'quarterly';
    return 'yearly';
  }

  // ============================================================================
  // Dashboard Management
  // ============================================================================

  createDashboard(params: {
    name: string;
    description: string;
    type: Dashboard['type'];
    visibility: Dashboard['visibility'];
    createdBy: string;
  }): Dashboard {
    const dashboard: Dashboard = {
      id: `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      type: params.type,
      visibility: params.visibility,
      createdBy: params.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      layout: {
        rows: 12,
        columns: 12,
        widgets: [],
      },
      filters: [],
      refreshSettings: {
        autoRefresh: false,
      },
      access: {
        allowedUsers: [params.createdBy],
        allowedRoles: [],
        permissions: [
          {
            user: params.createdBy,
            canView: true,
            canEdit: true,
            canShare: true,
          },
        ],
      },
      usage: {
        viewCount: 0,
        uniqueViewers: 0,
      },
    };

    this.dashboards.set(dashboard.id, dashboard);
    return dashboard;
  }

  addWidget(params: {
    dashboardId: string;
    name: string;
    type: Widget['type'];
    visualization?: VisualizationType;
    dataConfig: Widget['dataConfig'];
    position: Widget['display'];
  }): Widget {
    const dashboard = this.dashboards.get(params.dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const widget: Widget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dashboardId: params.dashboardId,
      name: params.name,
      type: params.type,
      visualization: params.visualization,
      dataConfig: params.dataConfig,
      display: {
        title: params.name,
        showLegend: true,
        showLabels: true,
        ...params.position,
      },
      interactions: {
        clickable: false,
      },
    };

    this.widgets.set(widget.id, widget);

    // Add to dashboard layout
    dashboard.layout.widgets.push({
      id: widget.id,
      widgetType: params.type === 'kpi' ? 'metric' : 'chart',
      position: {
        row: 0,
        column: 0,
        width: 4,
        height: 4,
      },
      config: {},
    });

    dashboard.updatedAt = new Date();

    return widget;
  }

  viewDashboard(dashboardId: string, userId: string): Dashboard {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    // Update usage stats
    dashboard.usage.viewCount++;
    dashboard.usage.lastViewed = new Date();

    // Track unique viewers
    const hasViewed = dashboard.access.permissions.some((p) => p.user === userId);
    if (!hasViewed) {
      dashboard.usage.uniqueViewers++;
    }

    return dashboard;
  }

  // ============================================================================
  // Report Management
  // ============================================================================

  createReport(params: {
    name: string;
    description: string;
    type: Report['type'];
    format: ReportFormat;
    category: string;
    dataConfig: Report['dataConfig'];
    schedule?: Report['schedule'];
    distribution: Report['distribution'];
  }): Report {
    const report: Report = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      type: params.type,
      format: params.format,
      category: params.category,
      dataConfig: params.dataConfig,
      schedule: params.schedule,
      distribution: params.distribution,
      sections: [],
      metadata: {
        createdBy: 'system',
        createdAt: new Date(),
        version: 1,
      },
      status: 'active',
    };

    this.reports.set(report.id, report);
    return report;
  }

  generateReport(reportId: string, userId: string): ReportInstance {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    const startTime = Date.now();

    const instance: ReportInstance = {
      id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reportId,
      generatedAt: new Date(),
      generatedBy: userId,
      period: report.dataConfig.dateRange,
      status: 'generating',
      format: report.format,
      data: {
        summary: {},
        metrics: [],
        charts: [],
        tables: [],
      },
      delivery: {
        sent: false,
        recipients: report.distribution.recipients.map((r) => r.address),
      },
      performance: {
        generationTime: 0,
        dataFetchTime: 0,
        renderTime: 0,
      },
    };

    this.reportInstances.set(instance.id, instance);

    // Simulate report generation
    setTimeout(() => {
      this.completeReportGeneration(instance.id, startTime);
    }, 100);

    return instance;
  }

  private completeReportGeneration(instanceId: string, startTime: number): void {
    const instance = this.reportInstances.get(instanceId);
    if (!instance) return;

    const report = this.reports.get(instance.reportId);
    if (!report) return;

    // Fetch data for metrics
    report.dataConfig.metrics.forEach((metricId) => {
      const metricValue = this.calculateMetric(metricId, report.dataConfig.dateRange);
      instance.data.metrics.push(metricValue);
    });

    instance.status = 'completed';
    instance.performance.generationTime = Date.now() - startTime;
    instance.performance.dataFetchTime = instance.performance.generationTime * 0.6;
    instance.performance.renderTime = instance.performance.generationTime * 0.4;

    instance.file = {
      url: `https://reports.example.com/${instanceId}.${report.format}`,
      size: 1024 * 500, // 500KB
      hash: `hash_${Math.random().toString(36).substr(2, 16)}`,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    // Update report metadata
    report.schedule!.lastRun = new Date();
    report.metadata.lastGenerated = new Date();
  }

  // ============================================================================
  // Insights & Anomaly Detection
  // ============================================================================

  detectInsights(params: {
    metrics: string[];
    period: { start: Date; end: Date };
    minSeverity?: AnalyticalInsight['severity'];
  }): AnalyticalInsight[] {
    const insights: AnalyticalInsight[] = [];

    params.metrics.forEach((metricId) => {
      const metric = this.metrics.get(metricId);
      if (!metric) return;

      const metricValue = this.calculateMetric(metricId, params.period);

      // Detect opportunities
      if (metricValue.comparisons?.previousPeriod?.changePercent! > 20) {
        insights.push(
          this.createInsight({
            type: 'opportunity',
            severity: 'medium',
            category: metric.category,
            title: `${metric.name} Growing Rapidly`,
            description: `${metric.name} has increased by ${metricValue.comparisons.previousPeriod.changePercent.toFixed(1)}% compared to previous period`,
            metricId,
            period: params.period,
            value: metricValue.value,
          })
        );
      }

      // Detect risks
      if (metricValue.comparisons?.previousPeriod?.changePercent! < -20) {
        insights.push(
          this.createInsight({
            type: 'risk',
            severity: 'high',
            category: metric.category,
            title: `${metric.name} Declining`,
            description: `${metric.name} has decreased by ${Math.abs(metricValue.comparisons.previousPeriod.changePercent).toFixed(1)}% compared to previous period`,
            metricId,
            period: params.period,
            value: metricValue.value,
          })
        );
      }

      // Detect threshold violations
      if (metric.thresholds?.critical && metricValue.value > metric.thresholds.critical) {
        insights.push(
          this.createInsight({
            type: 'anomaly',
            severity: 'critical',
            category: metric.category,
            title: `${metric.name} Exceeds Critical Threshold`,
            description: `${metric.name} value of ${metricValue.value} exceeds critical threshold of ${metric.thresholds.critical}`,
            metricId,
            period: params.period,
            value: metricValue.value,
          })
        );
      }
    });

    return insights.filter(
      (i) =>
        !params.minSeverity ||
        this.getSeverityLevel(i.severity) >= this.getSeverityLevel(params.minSeverity)
    );
  }

  private createInsight(params: {
    type: InsightType;
    severity: AnalyticalInsight['severity'];
    category: string;
    title: string;
    description: string;
    metricId: string;
    period: { start: Date; end: Date };
    value: number;
  }): AnalyticalInsight {
    const insight: AnalyticalInsight = {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      severity: params.severity,
      category: params.category,
      title: params.title,
      description: params.description,
      detectedAt: new Date(),
      context: {
        metrics: [params.metricId],
        period: params.period,
      },
      evidence: {
        dataPoints: [
          {
            metric: params.metricId,
            value: params.value,
          },
        ],
      },
      impact: {
        estimated: 0,
        unit: 'USD',
        affectedAreas: [params.category],
      },
      recommendations: this.generateRecommendations(params.type, params.category),
      status: 'new',
    };

    this.insights.set(insight.id, insight);
    return insight;
  }

  private generateRecommendations(
    type: InsightType,
    category: string
  ): AnalyticalInsight['recommendations'] {
    const recommendations: AnalyticalInsight['recommendations'] = [];

    switch (type) {
      case 'opportunity':
        recommendations.push({
          action: 'Increase investment in this area',
          priority: 'high',
          estimatedImpact: 'High revenue potential',
          effort: 'medium',
        });
        break;
      case 'risk':
        recommendations.push({
          action: 'Investigate root cause and implement corrective measures',
          priority: 'high',
          estimatedImpact: 'Prevent further decline',
          effort: 'high',
        });
        break;
      case 'anomaly':
        recommendations.push({
          action: 'Review data quality and validate measurement',
          priority: 'medium',
          estimatedImpact: 'Ensure data accuracy',
          effort: 'low',
        });
        break;
    }

    return recommendations;
  }

  private getSeverityLevel(severity: AnalyticalInsight['severity']): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity];
  }

  // ============================================================================
  // Cohort Analysis
  // ============================================================================

  createCohort(params: {
    name: string;
    description: string;
    definition: Cohort['definition'];
  }): Cohort {
    const cohort: Cohort = {
      id: `cohort_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      definition: params.definition,
      size: Math.floor(100 + Math.random() * 900),
      createdAt: new Date(),
      segments: [],
      analysis: {
        retention: [],
        ltv: [],
        churnRate: [],
        engagement: [],
      },
    };

    // Generate cohort analysis
    this.analyzeCohort(cohort);

    this.cohorts.set(cohort.id, cohort);
    return cohort;
  }

  private analyzeCohort(cohort: Cohort): void {
    // Generate retention curve
    let retention = 100;
    for (let i = 0; i < 12; i++) {
      retention *= 0.85 + Math.random() * 0.1; // 85-95% retention each period
      cohort.analysis.retention.push(retention);
    }

    // Generate LTV curve
    let ltv = 0;
    for (let i = 0; i < 12; i++) {
      ltv += 50 + Math.random() * 100;
      cohort.analysis.ltv.push(ltv);
    }

    // Generate churn rate
    for (let i = 0; i < 12; i++) {
      const churnRate = 5 + Math.random() * 10; // 5-15% churn
      cohort.analysis.churnRate.push(churnRate);
    }

    // Generate engagement scores
    for (let i = 0; i < 12; i++) {
      const engagement = 60 + Math.random() * 40; // 60-100 engagement score
      cohort.analysis.engagement.push(engagement);
    }
  }

  // ============================================================================
  // Funnel Analysis
  // ============================================================================

  createFunnel(params: {
    name: string;
    description: string;
    steps: Funnel['steps'];
    period: { start: Date; end: Date };
  }): Funnel {
    const funnel: Funnel = {
      id: `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      steps: params.steps,
      period: params.period,
      results: {
        totalEntries: 10000,
        stepMetrics: [],
        overallConversion: 0,
      },
    };

    // Calculate funnel metrics
    this.analyzeFunnel(funnel);

    this.funnels.set(funnel.id, funnel);
    return funnel;
  }

  private analyzeFunnel(funnel: Funnel): void {
    let currentCount = funnel.results.totalEntries;

    funnel.steps.forEach((step, index) => {
      const dropoffRate = 0.15 + Math.random() * 0.25; // 15-40% dropoff
      const nextCount = Math.floor(currentCount * (1 - dropoffRate));
      const dropoff = currentCount - nextCount;

      funnel.results.stepMetrics.push({
        stepId: step.id,
        count: currentCount,
        percentage: (currentCount / funnel.results.totalEntries) * 100,
        dropoff,
        dropoffRate: (dropoff / currentCount) * 100,
        avgTimeToNext: 60 + Math.random() * 300, // 1-5 minutes
      });

      currentCount = nextCount;
    });

    const finalStep = funnel.results.stepMetrics[funnel.results.stepMetrics.length - 1];
    funnel.results.overallConversion = finalStep.percentage;
  }

  // ============================================================================
  // Query Execution
  // ============================================================================

  executeQuery(query: Omit<AnalyticsQuery, 'id' | 'execution'>): AnalyticsQuery {
    const analyticsQuery: AnalyticsQuery = {
      id: `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...query,
      execution: {
        status: 'pending',
      },
    };

    this.queries.set(analyticsQuery.id, analyticsQuery);

    // Check cache
    if (query.cache?.enabled) {
      const cacheKey = this.generateCacheKey(query);
      const cached = this.queryCache.get(cacheKey);

      if (cached && cached.expiresAt > new Date()) {
        analyticsQuery.execution.status = 'completed';
        analyticsQuery.execution.executionTime = 5; // Fast cache hit
        return analyticsQuery;
      }
    }

    // Execute query
    setTimeout(() => {
      this.completeQueryExecution(analyticsQuery.id);
    }, 100);

    return analyticsQuery;
  }

  private completeQueryExecution(queryId: string): void {
    const query = this.queries.get(queryId);
    if (!query) return;

    query.execution.status = 'running';
    query.execution.startedAt = new Date();

    // Simulate query execution
    const executionTime = 100 + Math.random() * 900; // 100-1000ms

    setTimeout(() => {
      query.execution.status = 'completed';
      query.execution.completedAt = new Date();
      query.execution.executionTime = executionTime;
      query.execution.rowsReturned = Math.floor(10 + Math.random() * 990);

      // Cache result
      if (query.cache?.enabled) {
        const cacheKey = this.generateCacheKey(query);
        this.queryCache.set(cacheKey, {
          data: { rows: query.execution.rowsReturned },
          expiresAt: new Date(Date.now() + (query.cache.ttl || 60) * 60 * 1000),
        });
      }
    }, executionTime);
  }

  private generateCacheKey(query: Partial<AnalyticsQuery>): string {
    return `cache_${JSON.stringify({
      type: query.type,
      select: query.select,
      filters: query.filters,
      dateRange: query.dateRange,
    })}`;
  }

  // ============================================================================
  // Performance & Statistics
  // ============================================================================

  getPerformanceMetrics(): PerformanceMetrics {
    const dashboards = Array.from(this.dashboards.values());
    const reports = Array.from(this.reports.values());
    const queries = Array.from(this.queries.values());
    const dataSources = Array.from(this.dataSources.values());

    return {
      dashboards: {
        totalDashboards: dashboards.length,
        activeDashboards: dashboards.filter((d) => d.usage.viewCount > 0).length,
        avgLoadTime:
          dashboards.reduce((sum, d) => sum + (d.usage.avgLoadTime || 0), 0) / dashboards.length ||
          0,
        totalViews: dashboards.reduce((sum, d) => sum + d.usage.viewCount, 0),
        uniqueUsers: dashboards.reduce((sum, d) => sum + d.usage.uniqueViewers, 0),
      },
      reports: {
        totalReports: reports.length,
        scheduledReports: reports.filter((r) => r.schedule?.enabled).length,
        generatedToday: Array.from(this.reportInstances.values()).filter(
          (i) => i.generatedAt.toDateString() === new Date().toDateString()
        ).length,
        avgGenerationTime:
          Array.from(this.reportInstances.values()).reduce(
            (sum, i) => sum + i.performance.generationTime,
            0
          ) / this.reportInstances.size || 0,
        failureRate: 0,
      },
      queries: {
        totalQueries: queries.length,
        avgExecutionTime:
          queries.reduce((sum, q) => sum + (q.execution.executionTime || 0), 0) / queries.length ||
          0,
        cacheHitRate: 85,
        slowQueries: queries.filter((q) => (q.execution.executionTime || 0) > 5000).length,
      },
      dataQuality: {
        avgCompleteness:
          dataSources.reduce((sum, ds) => sum + ds.quality.completeness, 0) / dataSources.size || 0,
        avgAccuracy:
          dataSources.reduce((sum, ds) => sum + ds.quality.accuracy, 0) / dataSources.size || 0,
        avgFreshness:
          dataSources.reduce((sum, ds) => sum + ds.quality.freshness, 0) / dataSources.size || 0,
        issuesDetected: 0,
      },
    };
  }

  // ============================================================================
  // Initialization Methods
  // ============================================================================

  private initializeDefaultDataSources(): void {
    this.registerDataSource({
      name: 'Sales Database',
      type: 'sales',
      description: 'Primary sales transaction database',
      connectionInfo: {
        type: 'database',
        refreshInterval: 15,
      },
      schema: {
        fields: [
          { name: 'transaction_id', type: 'string', nullable: false, indexed: true },
          { name: 'amount', type: 'number', nullable: false, indexed: false },
          { name: 'date', type: 'date', nullable: false, indexed: true },
          { name: 'customer_id', type: 'string', nullable: false, indexed: true },
        ],
        primaryKey: 'transaction_id',
      },
    });

    this.registerDataSource({
      name: 'User Database',
      type: 'users',
      description: 'User and customer information',
      connectionInfo: {
        type: 'database',
        refreshInterval: 60,
      },
      schema: {
        fields: [
          { name: 'user_id', type: 'string', nullable: false, indexed: true },
          { name: 'email', type: 'string', nullable: false, indexed: false },
          { name: 'created_at', type: 'date', nullable: false, indexed: true },
        ],
        primaryKey: 'user_id',
      },
    });
  }

  private initializeDefaultMetrics(): void {
    const salesDataSource = Array.from(this.dataSources.values())[0];

    if (salesDataSource) {
      this.createMetric({
        name: 'Total Revenue',
        description: 'Total sales revenue',
        type: 'sum',
        category: 'Revenue',
        dataSource: salesDataSource.id,
        formula: {
          expression: 'SUM(amount)',
          fields: ['amount'],
        },
        aggregation: {
          function: 'sum',
          period: 'daily',
        },
        formatting: {
          prefix: '$',
          decimals: 2,
          thousandsSeparator: true,
        },
        thresholds: {
          target: 100000,
          warning: 80000,
          direction: 'higher-is-better',
        },
      });

      this.createMetric({
        name: 'Transaction Count',
        description: 'Number of transactions',
        type: 'count',
        category: 'Sales',
        dataSource: salesDataSource.id,
        formula: {
          expression: 'COUNT(*)',
          fields: [],
        },
        aggregation: {
          function: 'count',
          period: 'daily',
        },
        formatting: {
          decimals: 0,
          thousandsSeparator: true,
        },
      });
    }
  }

  private initializeDefaultDashboards(): void {
    const dashboard = this.createDashboard({
      name: 'Executive Overview',
      description: 'High-level business metrics',
      type: 'executive',
      visibility: 'public',
      createdBy: 'system',
    });

    // Add KPI widgets for each metric
    const metrics = Array.from(this.metrics.values());
    metrics.forEach((metric, index) => {
      this.addWidget({
        dashboardId: dashboard.id,
        name: metric.name,
        type: 'kpi',
        dataConfig: {
          metrics: [metric.id],
          dateRange: {
            type: 'relative',
            relative: {
              value: 30,
              unit: 'days',
            },
          },
        },
        position: {
          title: metric.name,
          showLegend: false,
          showLabels: true,
        },
      });
    });
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const businessIntelligenceSystem = new BusinessIntelligenceSystem();
