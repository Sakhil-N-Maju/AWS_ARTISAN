/**
 * Business Analytics Dashboard
 *
 * Comprehensive analytics and reporting system:
 * - Real-time business metrics
 * - KPI tracking and monitoring
 * - Custom dashboards
 * - Report generation
 * - Data visualization
 * - Performance benchmarking
 * - Trend analysis
 */

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'map' | 'gauge' | 'funnel' | 'heatmap' | 'timeline';
  title: string;
  description?: string;

  // Data source
  dataSource: {
    type: 'realtime' | 'scheduled' | 'on_demand';
    endpoint: string;
    refreshInterval?: number; // seconds
    lastUpdated?: Date;
  };

  // Configuration
  config: {
    // For metric widgets
    metric?: {
      value: number;
      unit?: string;
      prefix?: string;
      suffix?: string;
      trend?: {
        direction: 'up' | 'down' | 'neutral';
        percentage: number;
        period: string;
      };
      comparison?: {
        value: number;
        label: string;
      };
      target?: number;
      status?: 'good' | 'warning' | 'critical';
    };

    // For chart widgets
    chart?: {
      chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar' | 'donut';
      xAxis?: string;
      yAxis?: string;
      series: {
        name: string;
        data: number[];
        color?: string;
      }[];
      labels?: string[];
      options?: Record<string, any>;
    };

    // For table widgets
    table?: {
      columns: {
        key: string;
        label: string;
        type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'status';
        sortable?: boolean;
      }[];
      rows: Record<string, any>[];
      pagination?: {
        page: number;
        pageSize: number;
        total: number;
      };
    };

    // For map widgets
    map?: {
      center: { lat: number; lng: number };
      zoom: number;
      markers: {
        id: string;
        position: { lat: number; lng: number };
        label: string;
        value?: number;
        color?: string;
      }[];
    };
  };

  // Layout
  layout: {
    x: number;
    y: number;
    width: number; // grid units
    height: number; // grid units
    minWidth?: number;
    minHeight?: number;
  };

  // Permissions
  permissions: {
    view: string[]; // role IDs
    edit: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  category: 'overview' | 'sales' | 'operations' | 'marketing' | 'finance' | 'customer' | 'custom';

  // Widgets
  widgets: DashboardWidget[];

  // Settings
  settings: {
    refreshInterval?: number; // Auto-refresh in seconds
    dateRange: {
      type:
        | 'today'
        | 'yesterday'
        | 'last_7_days'
        | 'last_30_days'
        | 'this_month'
        | 'last_month'
        | 'this_quarter'
        | 'this_year'
        | 'custom';
      start?: Date;
      end?: Date;
    };
    timezone: string;
    currency: string;
  };

  // Sharing
  sharing: {
    isPublic: boolean;
    shareLink?: string;
    sharedWith: {
      userId: string;
      userName: string;
      role: 'viewer' | 'editor' | 'owner';
      sharedAt: Date;
    }[];
  };

  // Metadata
  isDefault: boolean;
  isTemplate: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'customer' | 'marketing' | 'quality';

  // Calculation
  calculation: {
    formula: string;
    dataSources: string[];
    aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'distinct_count';
  };

  // Current value
  currentValue: number;
  unit?: string;

  // Target
  target?: {
    value: number;
    type: 'minimum' | 'maximum' | 'exact' | 'range';
    rangeMin?: number;
    rangeMax?: number;
  };

  // Performance
  performance: {
    status: 'on_track' | 'at_risk' | 'off_track';
    percentageToTarget?: number;
    trend: {
      direction: 'up' | 'down' | 'stable';
      changePercentage: number;
      changePeriod: string;
    };
  };

  // Historical data
  history: {
    date: Date;
    value: number;
  }[];

  // Alert settings
  alerts: {
    enabled: boolean;
    conditions: {
      type: 'above' | 'below' | 'equals' | 'percentage_change';
      threshold: number;
      period?: string;
    }[];
    recipients: string[];
  };

  // Metadata
  owner: string;
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  lastUpdated: Date;
  createdAt: Date;
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: 'standard' | 'custom' | 'scheduled' | 'adhoc';
  category: string;

  // Data
  data: {
    source: string;
    filters?: Record<string, any>;
    groupBy?: string[];
    sortBy?: { field: string; order: 'asc' | 'desc' }[];
    limit?: number;
  };

  // Format
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';

  // Schedule (for scheduled reports)
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    dayOfWeek?: number; // 0-6
    dayOfMonth?: number; // 1-31
    time: string; // HH:mm
    timezone: string;
    nextRun?: Date;
    lastRun?: Date;
  };

  // Distribution
  distribution: {
    method: 'email' | 'download' | 'api' | 'storage';
    recipients?: string[];
    subject?: string;
    message?: string;
  };

  // Status
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';

  // Generated files
  generatedFiles: {
    id: string;
    url: string;
    format: Report['format'];
    generatedAt: Date;
    expiresAt?: Date;
    downloadCount: number;
  }[];

  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataExport {
  id: string;
  name: string;
  description?: string;

  // Export configuration
  config: {
    dataSource: string;
    format: 'csv' | 'excel' | 'json' | 'xml' | 'parquet';
    columns?: string[];
    filters?: Record<string, any>;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };

  // Processing
  processing: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number; // 0-100
    rowsProcessed: number;
    totalRows: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
  };

  // Output
  output?: {
    url: string;
    fileSize: number; // bytes
    expiresAt: Date;
    downloadCount: number;
  };

  requestedBy: string;
  createdAt: Date;
}

export interface AnalyticsMetrics {
  // Overview metrics
  overview: {
    totalRevenue: number;
    revenueGrowth: number; // percentage
    totalOrders: number;
    ordersGrowth: number;
    totalCustomers: number;
    customersGrowth: number;
    averageOrderValue: number;
    aovGrowth: number;
    conversionRate: number;
    conversionGrowth: number;
  };

  // Financial metrics
  financial: {
    grossRevenue: number;
    netRevenue: number;
    grossProfit: number;
    grossMargin: number; // percentage
    operatingExpenses: number;
    operatingProfit: number;
    operatingMargin: number;
    netProfit: number;
    netMargin: number;
    ebitda: number;
  };

  // Sales metrics
  sales: {
    totalSales: number;
    salesByChannel: {
      channel: string;
      sales: number;
      percentage: number;
    }[];
    salesByCategory: {
      category: string;
      sales: number;
      percentage: number;
    }[];
    topProducts: {
      productId: string;
      productName: string;
      sales: number;
      units: number;
    }[];
  };

  // Customer metrics
  customer: {
    activeCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
    customerChurnRate: number;
    customerLifetimeValue: number;
    customerAcquisitionCost: number;
    ltvcacRatio: number;
  };

  // Operational metrics
  operational: {
    inventoryTurnover: number;
    daysInventoryOutstanding: number;
    orderFulfillmentRate: number;
    averageFulfillmentTime: number; // hours
    returnRate: number;
    defectRate: number;
    onTimeDeliveryRate: number;
  };

  // Marketing metrics
  marketing: {
    websiteVisits: number;
    uniqueVisitors: number;
    bounceRate: number;
    averageSessionDuration: number; // seconds
    pagesPerSession: number;
    newVsReturning: {
      new: number;
      returning: number;
    };
    topSources: {
      source: string;
      visits: number;
      conversions: number;
    }[];
  };
}

export interface BenchmarkData {
  category: string;
  metric: string;

  // Your performance
  yourValue: number;

  // Industry benchmarks
  benchmarks: {
    industryAverage: number;
    topQuartile: number;
    median: number;
    bottomQuartile: number;
  };

  // Performance rating
  performance: {
    score: number; // 0-100
    rating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
    percentile: number;
  };

  // Recommendations
  recommendations?: string[];

  updatedAt: Date;
}

export class BusinessAnalyticsDashboard {
  private dashboards: Map<string, Dashboard>;
  private kpis: Map<string, KPI>;
  private reports: Map<string, Report>;
  private exports: Map<string, DataExport>;

  constructor() {
    this.dashboards = new Map();
    this.kpis = new Map();
    this.reports = new Map();
    this.exports = new Map();

    // Initialize default dashboards
    this.initializeDefaultDashboards();
  }

  /**
   * Initialize default dashboards
   */
  private initializeDefaultDashboards(): void {
    // Executive Dashboard
    const executiveDashboard: Dashboard = {
      id: 'dash-executive',
      name: 'Executive Overview',
      description: 'High-level business metrics and KPIs',
      category: 'overview',
      widgets: [
        {
          id: 'widget-revenue',
          type: 'metric',
          title: 'Total Revenue',
          dataSource: { type: 'realtime', endpoint: '/api/metrics/revenue', refreshInterval: 300 },
          config: {
            metric: {
              value: 1250000,
              unit: 'currency',
              prefix: '₹',
              trend: { direction: 'up', percentage: 12.5, period: 'vs last month' },
              comparison: { value: 1112500, label: 'Last Month' },
              target: 1500000,
              status: 'good',
            },
          },
          layout: { x: 0, y: 0, width: 3, height: 2 },
          permissions: { view: ['admin', 'executive'], edit: ['admin'] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'widget-orders',
          type: 'metric',
          title: 'Total Orders',
          dataSource: { type: 'realtime', endpoint: '/api/metrics/orders', refreshInterval: 300 },
          config: {
            metric: {
              value: 2450,
              trend: { direction: 'up', percentage: 8.3, period: 'vs last month' },
              status: 'good',
            },
          },
          layout: { x: 3, y: 0, width: 3, height: 2 },
          permissions: { view: ['admin', 'executive'], edit: ['admin'] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'widget-customers',
          type: 'metric',
          title: 'Active Customers',
          dataSource: {
            type: 'realtime',
            endpoint: '/api/metrics/customers',
            refreshInterval: 300,
          },
          config: {
            metric: {
              value: 15230,
              trend: { direction: 'up', percentage: 15.2, period: 'vs last month' },
              status: 'good',
            },
          },
          layout: { x: 6, y: 0, width: 3, height: 2 },
          permissions: { view: ['admin', 'executive'], edit: ['admin'] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'widget-aov',
          type: 'metric',
          title: 'Average Order Value',
          dataSource: { type: 'realtime', endpoint: '/api/metrics/aov', refreshInterval: 300 },
          config: {
            metric: {
              value: 510.2,
              unit: 'currency',
              prefix: '₹',
              trend: { direction: 'up', percentage: 3.8, period: 'vs last month' },
              status: 'good',
            },
          },
          layout: { x: 9, y: 0, width: 3, height: 2 },
          permissions: { view: ['admin', 'executive'], edit: ['admin'] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'widget-revenue-trend',
          type: 'chart',
          title: 'Revenue Trend',
          dataSource: {
            type: 'scheduled',
            endpoint: '/api/charts/revenue-trend',
            refreshInterval: 3600,
          },
          config: {
            chart: {
              chartType: 'area',
              xAxis: 'date',
              yAxis: 'revenue',
              series: [
                {
                  name: 'Revenue',
                  data: [850000, 920000, 980000, 1050000, 1112500, 1250000],
                  color: '#10b981',
                },
              ],
              labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
          },
          layout: { x: 0, y: 2, width: 6, height: 4 },
          permissions: { view: ['admin', 'executive'], edit: ['admin'] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'widget-category-sales',
          type: 'chart',
          title: 'Sales by Category',
          dataSource: {
            type: 'scheduled',
            endpoint: '/api/charts/category-sales',
            refreshInterval: 3600,
          },
          config: {
            chart: {
              chartType: 'donut',
              series: [
                { name: 'Textiles', data: [450000], color: '#3b82f6' },
                { name: 'Pottery', data: [325000], color: '#8b5cf6' },
                { name: 'Jewelry', data: [280000], color: '#ec4899' },
                { name: 'Woodwork', data: [195000], color: '#f59e0b' },
              ],
              labels: ['Textiles', 'Pottery', 'Jewelry', 'Woodwork'],
            },
          },
          layout: { x: 6, y: 2, width: 6, height: 4 },
          permissions: { view: ['admin', 'executive'], edit: ['admin'] },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      settings: {
        refreshInterval: 300,
        dateRange: { type: 'last_30_days' },
        timezone: 'Asia/Kolkata',
        currency: 'INR',
      },
      sharing: {
        isPublic: false,
        sharedWith: [],
      },
      isDefault: true,
      isTemplate: false,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.dashboards.set(executiveDashboard.id, executiveDashboard);

    // Initialize default KPIs
    this.initializeDefaultKPIs();
  }

  /**
   * Initialize default KPIs
   */
  private initializeDefaultKPIs(): void {
    const kpis: Omit<KPI, 'id'>[] = [
      {
        name: 'Monthly Recurring Revenue',
        description: 'Total recurring revenue from subscriptions and memberships',
        category: 'financial',
        calculation: {
          formula: 'SUM(subscription_revenue)',
          dataSources: ['subscriptions'],
          aggregation: 'sum',
        },
        currentValue: 125000,
        unit: 'INR',
        target: { value: 150000, type: 'minimum' },
        performance: {
          status: 'on_track',
          percentageToTarget: 83.3,
          trend: { direction: 'up', changePercentage: 12.5, changePeriod: 'month' },
        },
        history: [
          { date: new Date('2025-07-01'), value: 95000 },
          { date: new Date('2025-08-01'), value: 102000 },
          { date: new Date('2025-09-01'), value: 108000 },
          { date: new Date('2025-10-01'), value: 111000 },
          { date: new Date('2025-11-01'), value: 118000 },
          { date: new Date('2025-12-01'), value: 125000 },
        ],
        alerts: {
          enabled: true,
          conditions: [{ type: 'below', threshold: 100000 }],
          recipients: ['finance@artisans.com'],
        },
        owner: 'finance',
        updateFrequency: 'daily',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        name: 'Customer Retention Rate',
        description: 'Percentage of customers who make repeat purchases',
        category: 'customer',
        calculation: {
          formula: '(returning_customers / total_customers) * 100',
          dataSources: ['orders', 'customers'],
          aggregation: 'avg',
        },
        currentValue: 68.5,
        unit: '%',
        target: { value: 70, type: 'minimum' },
        performance: {
          status: 'at_risk',
          percentageToTarget: 97.9,
          trend: { direction: 'stable', changePercentage: 0.5, changePeriod: 'month' },
        },
        history: [
          { date: new Date('2025-07-01'), value: 65.2 },
          { date: new Date('2025-08-01'), value: 66.8 },
          { date: new Date('2025-09-01'), value: 67.5 },
          { date: new Date('2025-10-01'), value: 68.0 },
          { date: new Date('2025-11-01'), value: 68.1 },
          { date: new Date('2025-12-01'), value: 68.5 },
        ],
        alerts: {
          enabled: true,
          conditions: [{ type: 'below', threshold: 65 }],
          recipients: ['customer-success@artisans.com'],
        },
        owner: 'customer_success',
        updateFrequency: 'daily',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
      {
        name: 'Gross Profit Margin',
        description: 'Percentage of revenue remaining after cost of goods sold',
        category: 'financial',
        calculation: {
          formula: '((revenue - cogs) / revenue) * 100',
          dataSources: ['revenue', 'expenses'],
          aggregation: 'avg',
        },
        currentValue: 42.3,
        unit: '%',
        target: { value: 45, type: 'minimum' },
        performance: {
          status: 'at_risk',
          percentageToTarget: 94.0,
          trend: { direction: 'down', changePercentage: -1.2, changePeriod: 'month' },
        },
        history: [
          { date: new Date('2025-07-01'), value: 44.5 },
          { date: new Date('2025-08-01'), value: 44.2 },
          { date: new Date('2025-09-01'), value: 43.8 },
          { date: new Date('2025-10-01'), value: 43.5 },
          { date: new Date('2025-11-01'), value: 42.8 },
          { date: new Date('2025-12-01'), value: 42.3 },
        ],
        alerts: {
          enabled: true,
          conditions: [{ type: 'below', threshold: 40 }],
          recipients: ['finance@artisans.com', 'operations@artisans.com'],
        },
        owner: 'finance',
        updateFrequency: 'daily',
        lastUpdated: new Date(),
        createdAt: new Date(),
      },
    ];

    kpis.forEach((kpi, index) => {
      const id = `kpi-${Date.now()}-${index}`;
      this.kpis.set(id, { ...kpi, id });
    });
  }

  /**
   * Create custom dashboard
   */
  async createDashboard(params: {
    name: string;
    description?: string;
    category: Dashboard['category'];
    widgets?: DashboardWidget[];
    settings?: Partial<Dashboard['settings']>;
    createdBy: string;
  }): Promise<Dashboard> {
    const dashboard: Dashboard = {
      id: `dash-${Date.now()}`,
      name: params.name,
      description: params.description,
      category: params.category,
      widgets: params.widgets || [],
      settings: {
        refreshInterval: params.settings?.refreshInterval,
        dateRange: params.settings?.dateRange || { type: 'last_30_days' },
        timezone: params.settings?.timezone || 'Asia/Kolkata',
        currency: params.settings?.currency || 'INR',
      },
      sharing: {
        isPublic: false,
        sharedWith: [],
      },
      isDefault: false,
      isTemplate: false,
      createdBy: params.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.dashboards.set(dashboard.id, dashboard);
    return dashboard;
  }

  /**
   * Add widget to dashboard
   */
  async addWidget(
    dashboardId: string,
    widget: Omit<DashboardWidget, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) return;

    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dashboard.widgets.push(newWidget);
    dashboard.updatedAt = new Date();
  }

  /**
   * Create KPI
   */
  async createKPI(
    params: Omit<
      KPI,
      'id' | 'currentValue' | 'performance' | 'history' | 'lastUpdated' | 'createdAt'
    >
  ): Promise<KPI> {
    const kpi: KPI = {
      ...params,
      id: `kpi-${Date.now()}`,
      currentValue: 0,
      performance: {
        status: 'on_track',
        trend: { direction: 'stable', changePercentage: 0, changePeriod: 'month' },
      },
      history: [],
      lastUpdated: new Date(),
      createdAt: new Date(),
    };

    this.kpis.set(kpi.id, kpi);
    return kpi;
  }

  /**
   * Update KPI value
   */
  async updateKPIValue(kpiId: string, value: number): Promise<void> {
    const kpi = this.kpis.get(kpiId);
    if (!kpi) return;

    // Add to history
    kpi.history.push({
      date: new Date(),
      value,
    });

    // Calculate trend
    if (kpi.history.length >= 2) {
      const previousValue = kpi.history[kpi.history.length - 2].value;
      const changePercentage = ((value - previousValue) / previousValue) * 100;

      kpi.performance.trend = {
        direction: changePercentage > 0 ? 'up' : changePercentage < 0 ? 'down' : 'stable',
        changePercentage: Math.abs(changePercentage),
        changePeriod: 'period',
      };
    }

    // Update current value
    kpi.currentValue = value;

    // Check against target
    if (kpi.target) {
      const percentageToTarget = (value / kpi.target.value) * 100;
      kpi.performance.percentageToTarget = percentageToTarget;

      if (kpi.target.type === 'minimum') {
        kpi.performance.status =
          value >= kpi.target.value
            ? 'on_track'
            : value >= kpi.target.value * 0.9
              ? 'at_risk'
              : 'off_track';
      }
    }

    kpi.lastUpdated = new Date();
  }

  /**
   * Generate report
   */
  async generateReport(params: {
    name: string;
    type: Report['type'];
    category: string;
    data: Report['data'];
    format: Report['format'];
    distribution: Report['distribution'];
    createdBy: string;
  }): Promise<Report> {
    const report: Report = {
      id: `report-${Date.now()}`,
      name: params.name,
      type: params.type,
      category: params.category,
      data: params.data,
      format: params.format,
      distribution: params.distribution,
      status: 'active',
      generatedFiles: [],
      createdBy: params.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reports.set(report.id, report);

    // Simulate report generation
    const generatedFile = {
      id: `file-${Date.now()}`,
      url: `/reports/${report.id}.${params.format}`,
      format: params.format,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      downloadCount: 0,
    };

    report.generatedFiles.push(generatedFile);

    return report;
  }

  /**
   * Create data export
   */
  async createDataExport(params: {
    name: string;
    description?: string;
    config: DataExport['config'];
    requestedBy: string;
  }): Promise<DataExport> {
    const dataExport: DataExport = {
      id: `export-${Date.now()}`,
      name: params.name,
      description: params.description,
      config: params.config,
      processing: {
        status: 'pending',
        progress: 0,
        rowsProcessed: 0,
        totalRows: 0,
      },
      requestedBy: params.requestedBy,
      createdAt: new Date(),
    };

    this.exports.set(dataExport.id, dataExport);

    // Simulate processing
    setTimeout(() => this.processExport(dataExport.id), 1000);

    return dataExport;
  }

  /**
   * Process data export (simulated)
   */
  private async processExport(exportId: string): Promise<void> {
    const dataExport = this.exports.get(exportId);
    if (!dataExport) return;

    dataExport.processing.status = 'processing';
    dataExport.processing.startedAt = new Date();
    dataExport.processing.totalRows = 10000; // Mock

    // Simulate progress
    for (let i = 0; i <= 100; i += 20) {
      dataExport.processing.progress = i;
      dataExport.processing.rowsProcessed = Math.floor((i / 100) * dataExport.processing.totalRows);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    dataExport.processing.status = 'completed';
    dataExport.processing.completedAt = new Date();
    dataExport.output = {
      url: `/exports/${dataExport.id}.${dataExport.config.format}`,
      fileSize: 1024 * 1024 * 2.5, // 2.5 MB
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      downloadCount: 0,
    };
  }

  /**
   * Get current metrics
   */
  async getCurrentMetrics(): Promise<AnalyticsMetrics> {
    return {
      overview: {
        totalRevenue: 1250000,
        revenueGrowth: 12.5,
        totalOrders: 2450,
        ordersGrowth: 8.3,
        totalCustomers: 15230,
        customersGrowth: 15.2,
        averageOrderValue: 510.2,
        aovGrowth: 3.8,
        conversionRate: 2.85,
        conversionGrowth: 5.2,
      },
      financial: {
        grossRevenue: 1250000,
        netRevenue: 1187500,
        grossProfit: 528750,
        grossMargin: 42.3,
        operatingExpenses: 375000,
        operatingProfit: 153750,
        operatingMargin: 12.3,
        netProfit: 128750,
        netMargin: 10.3,
        ebitda: 178750,
      },
      sales: {
        totalSales: 1250000,
        salesByChannel: [
          { channel: 'Website', sales: 875000, percentage: 70 },
          { channel: 'Mobile App', sales: 250000, percentage: 20 },
          { channel: 'Marketplace', sales: 125000, percentage: 10 },
        ],
        salesByCategory: [
          { category: 'Textiles', sales: 450000, percentage: 36 },
          { category: 'Pottery', sales: 325000, percentage: 26 },
          { category: 'Jewelry', sales: 280000, percentage: 22.4 },
          { category: 'Woodwork', sales: 195000, percentage: 15.6 },
        ],
        topProducts: [
          { productId: 'prod-1', productName: 'Handwoven Silk Saree', sales: 125000, units: 250 },
          { productId: 'prod-2', productName: 'Terracotta Vase Set', sales: 98000, units: 490 },
          {
            productId: 'prod-3',
            productName: 'Silver Jewelry Collection',
            sales: 87500,
            units: 175,
          },
        ],
      },
      customer: {
        activeCustomers: 15230,
        newCustomers: 2450,
        returningCustomers: 12780,
        customerRetentionRate: 68.5,
        customerChurnRate: 31.5,
        customerLifetimeValue: 2850,
        customerAcquisitionCost: 185,
        ltvcacRatio: 15.4,
      },
      operational: {
        inventoryTurnover: 6.5,
        daysInventoryOutstanding: 56,
        orderFulfillmentRate: 98.5,
        averageFulfillmentTime: 18.5,
        returnRate: 4.2,
        defectRate: 1.8,
        onTimeDeliveryRate: 94.5,
      },
      marketing: {
        websiteVisits: 125000,
        uniqueVisitors: 85000,
        bounceRate: 42.5,
        averageSessionDuration: 185,
        pagesPerSession: 4.2,
        newVsReturning: { new: 55000, returning: 30000 },
        topSources: [
          { source: 'Organic Search', visits: 45000, conversions: 1350 },
          { source: 'Social Media', visits: 32000, conversions: 960 },
          { source: 'Direct', visits: 28000, conversions: 840 },
        ],
      },
    };
  }

  /**
   * Get benchmark data
   */
  async getBenchmarkData(category: string): Promise<BenchmarkData[]> {
    return [
      {
        category: 'E-commerce',
        metric: 'Conversion Rate',
        yourValue: 2.85,
        benchmarks: {
          industryAverage: 2.5,
          topQuartile: 4.0,
          median: 2.3,
          bottomQuartile: 1.5,
        },
        performance: {
          score: 72,
          rating: 'good',
          percentile: 65,
        },
        recommendations: [
          'Optimize product pages for better conversion',
          'Implement exit-intent popups',
          'Improve checkout process',
        ],
        updatedAt: new Date(),
      },
      {
        category: 'E-commerce',
        metric: 'Customer Retention Rate',
        yourValue: 68.5,
        benchmarks: {
          industryAverage: 65.0,
          topQuartile: 75.0,
          median: 63.0,
          bottomQuartile: 50.0,
        },
        performance: {
          score: 68,
          rating: 'good',
          percentile: 60,
        },
        recommendations: [
          'Launch loyalty program enhancements',
          'Improve post-purchase communication',
          'Personalize retention campaigns',
        ],
        updatedAt: new Date(),
      },
    ];
  }

  /**
   * Get dashboard
   */
  async getDashboard(dashboardId: string): Promise<Dashboard | null> {
    return this.dashboards.get(dashboardId) || null;
  }

  /**
   * Get all dashboards
   */
  async getAllDashboards(category?: Dashboard['category']): Promise<Dashboard[]> {
    let dashboards = Array.from(this.dashboards.values());

    if (category) {
      dashboards = dashboards.filter((d) => d.category === category);
    }

    return dashboards;
  }

  /**
   * Get all KPIs
   */
  async getAllKPIs(category?: KPI['category']): Promise<KPI[]> {
    let kpis = Array.from(this.kpis.values());

    if (category) {
      kpis = kpis.filter((k) => k.category === category);
    }

    return kpis;
  }
}

// Export singleton instance
export const businessAnalyticsDashboard = new BusinessAnalyticsDashboard();
