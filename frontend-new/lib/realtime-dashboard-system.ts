/**
 * Real-Time Dashboard System
 *
 * Live data streaming, real-time KPIs, alerting system, performance monitoring,
 * and operational dashboards with WebSocket support.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type DashboardType =
  | 'executive'
  | 'operational'
  | 'analytical'
  | 'tactical'
  | 'strategic'
  | 'custom';

export type WidgetType =
  | 'metric'
  | 'chart'
  | 'table'
  | 'map'
  | 'gauge'
  | 'timeline'
  | 'heatmap'
  | 'treemap'
  | 'sankey'
  | 'funnel';

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'area'
  | 'scatter'
  | 'bubble'
  | 'candlestick'
  | 'radar'
  | 'donut';

export type RefreshInterval =
  | 'realtime'
  | '1s'
  | '5s'
  | '10s'
  | '30s'
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'muted';

export type DataStreamType =
  | 'sales'
  | 'orders'
  | 'traffic'
  | 'inventory'
  | 'performance'
  | 'errors'
  | 'user-activity'
  | 'custom';

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: DashboardType;

  layout: {
    columns: number;
    rows: number;
    widgets: Array<{
      widgetId: string;
      position: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
  };

  settings: {
    refreshInterval: RefreshInterval;
    autoRefresh: boolean;
    theme: 'light' | 'dark' | 'auto';
    timezone: string;
    dateFormat: string;
  };

  permissions: {
    owner: string;
    viewers: string[];
    editors: string[];
    isPublic: boolean;
  };

  filters: {
    global: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    dateRange: {
      start: Date;
      end: Date;
      preset?:
        | 'today'
        | 'yesterday'
        | 'last-7-days'
        | 'last-30-days'
        | 'this-month'
        | 'last-month'
        | 'this-year'
        | 'custom';
    };
  };

  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastViewed?: Date;
    viewCount: number;
    favorited: boolean;
  };
}

export interface Widget {
  id: string;
  dashboardId: string;
  name: string;
  description?: string;
  type: WidgetType;

  dataSource: {
    type: DataStreamType;
    query?: string;
    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';
    groupBy?: string[];
  };

  visualization: {
    chartType?: ChartType;
    settings: {
      colors?: string[];
      showLegend?: boolean;
      showLabels?: boolean;
      showGrid?: boolean;
      animationEnabled?: boolean;
      customOptions?: Record<string, any>;
    };
  };

  metrics: {
    current?: number;
    previous?: number;
    change?: number;
    changePercent?: number;
    trend?: 'up' | 'down' | 'stable';
    target?: number;
    unit?: string;
  };

  refreshInterval: RefreshInterval;
  lastUpdated: Date;

  alerts?: {
    enabled: boolean;
    conditions: Array<{
      metric: string;
      operator: '>' | '<' | '=' | '>=' | '<=' | '!=';
      threshold: number;
      severity: AlertSeverity;
    }>;
  };
}

export interface RealtimeMetric {
  id: string;
  name: string;
  category: string;

  value: {
    current: number;
    unit: string;
    formatted: string;
  };

  comparison: {
    previous: number;
    change: number;
    changePercent: number;
    trend: 'up' | 'down' | 'stable';
  };

  target?: {
    value: number;
    progress: number; // percentage
    onTrack: boolean;
  };

  sparkline?: number[]; // Last N values for mini chart

  timestamp: Date;
  latency: number; // milliseconds since data generation
}

export interface DataStream {
  id: string;
  name: string;
  type: DataStreamType;

  connection: {
    status: 'connected' | 'connecting' | 'disconnected' | 'error';
    endpoint?: string;
    protocol: 'websocket' | 'sse' | 'polling' | 'push';
    lastConnected?: Date;
    reconnectAttempts: number;
  };

  data: {
    latestValue: any;
    timestamp: Date;
    buffer: any[]; // Circular buffer for recent data
    bufferSize: number;
  };

  performance: {
    messagesReceived: number;
    messagesPerSecond: number;
    avgLatency: number;
    errorRate: number;
    uptime: number; // percentage
  };

  subscribers: Array<{
    subscriberId: string;
    subscriptionType: 'widget' | 'alert' | 'export';
    subscribedAt: Date;
  }>;

  settings: {
    samplingRate?: number; // messages per second
    batchSize?: number;
    compressionEnabled: boolean;
    cacheEnabled: boolean;
    cacheTTL?: number; // seconds
  };
}

export interface Alert {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;

  trigger: {
    source: string; // widget or metric ID
    condition: string;
    threshold: number;
    operator: string;
    currentValue: number;
  };

  impact: {
    affectedSystems: string[];
    estimatedImpact: 'critical' | 'high' | 'medium' | 'low';
    affectedUsers?: number;
    revenueImpact?: number;
  };

  notifications: {
    channels: ('email' | 'sms' | 'push' | 'slack' | 'webhook')[];
    recipients: string[];
    sent: boolean;
    sentAt?: Date;
  };

  response: {
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    resolvedBy?: string;
    resolvedAt?: Date;
    resolution?: string;
    timeToAcknowledge?: number; // minutes
    timeToResolve?: number; // minutes
  };

  history: Array<{
    timestamp: Date;
    action: string;
    user?: string;
    details?: string;
  }>;

  recurrence: {
    isRecurring: boolean;
    count: number;
    lastOccurrence?: Date;
    pattern?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceMonitor {
  id: string;
  target: {
    type: 'system' | 'service' | 'endpoint' | 'database' | 'cache' | 'queue';
    name: string;
    identifier: string;
  };

  metrics: {
    health: {
      status: 'healthy' | 'degraded' | 'unhealthy' | 'critical';
      score: number; // 0-100
      issues: string[];
    };

    performance: {
      responseTime: number; // ms
      throughput: number; // requests per second
      errorRate: number; // percentage
      availability: number; // percentage
    };

    resources: {
      cpu: number; // percentage
      memory: number; // percentage
      disk: number; // percentage
      network: {
        inbound: number; // Mbps
        outbound: number; // Mbps
      };
    };

    custom?: Record<string, number>;
  };

  trends: {
    hourly: number[];
    daily: number[];
    weekly: number[];
  };

  thresholds: {
    responseTime: { warning: number; critical: number };
    errorRate: { warning: number; critical: number };
    cpu: { warning: number; critical: number };
    memory: { warning: number; critical: number };
  };

  alerts: Alert[];

  lastChecked: Date;
  checkInterval: number; // seconds
}

export interface LiveActivity {
  id: string;
  type:
    | 'order'
    | 'user-login'
    | 'page-view'
    | 'search'
    | 'purchase'
    | 'review'
    | 'support-ticket'
    | 'custom';

  data: {
    user?: {
      id: string;
      name?: string;
      segment?: string;
      location?: {
        country: string;
        city?: string;
      };
    };

    details: Record<string, any>;
    value?: number;
    metadata?: Record<string, any>;
  };

  timestamp: Date;
  processed: boolean;
}

export interface DashboardSnapshot {
  id: string;
  dashboardId: string;
  name: string;
  description?: string;

  data: {
    widgets: Array<{
      widgetId: string;
      snapshot: any;
      metrics: RealtimeMetric[];
    }>;

    timestamp: Date;
    period: {
      start: Date;
      end: Date;
    };
  };

  comparison?: {
    previousSnapshotId: string;
    changes: Array<{
      widgetId: string;
      metric: string;
      previousValue: number;
      currentValue: number;
      change: number;
    }>;
  };

  exportFormats: ('pdf' | 'png' | 'csv' | 'excel' | 'json')[];

  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface RealtimeReport {
  id: string;
  name: string;
  description: string;

  schedule: {
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    timezone: string;
    nextRun?: Date;
    lastRun?: Date;
  };

  content: {
    dashboards: string[];
    widgets: string[];
    metrics: string[];

    sections: Array<{
      title: string;
      type: 'summary' | 'detail' | 'chart' | 'table';
      content: any;
    }>;
  };

  distribution: {
    recipients: string[];
    channels: ('email' | 'slack' | 'webhook')[];
    format: 'pdf' | 'html' | 'excel';
  };

  conditions?: {
    sendOnlyIf: Array<{
      metric: string;
      operator: string;
      value: any;
    }>;
  };

  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastSent?: Date;
    sendCount: number;
  };
}

export interface WebSocketConnection {
  id: string;
  clientId: string;

  connection: {
    socket: any; // WebSocket instance
    connected: boolean;
    connectedAt: Date;
    lastActivity: Date;
  };

  subscriptions: Array<{
    streamId: string;
    streamType: DataStreamType;
    filters?: any;
  }>;

  metrics: {
    messagesSent: number;
    messagesReceived: number;
    bytesTransferred: number;
    avgLatency: number;
  };

  client: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
}

export interface KPIDefinition {
  id: string;
  name: string;
  description: string;
  category: string;

  calculation: {
    formula: string;
    inputs: Array<{
      name: string;
      source: string;
      field: string;
    }>;
    aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'custom';
  };

  targets: {
    daily?: number;
    weekly?: number;
    monthly?: number;
    quarterly?: number;
    yearly?: number;
  };

  thresholds: {
    critical: { min?: number; max?: number };
    warning: { min?: number; max?: number };
    normal: { min: number; max: number };
  };

  visualization: {
    preferredChartType: ChartType;
    unit: string;
    format: string; // e.g., "0,0.00", "$0,0"
    colors?: {
      positive: string;
      negative: string;
      neutral: string;
    };
  };

  metadata: {
    owner: string;
    createdAt: Date;
    updatedAt: Date;
    deprecated: boolean;
  };
}

// ============================================================================
// Main System Class
// ============================================================================

export class RealtimeDashboardSystem {
  private dashboards: Map<string, Dashboard> = new Map();
  private widgets: Map<string, Widget> = new Map();
  private dataStreams: Map<string, DataStream> = new Map();
  private realtimeMetrics: Map<string, RealtimeMetric> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private performanceMonitors: Map<string, PerformanceMonitor> = new Map();
  private liveActivities: LiveActivity[] = [];
  private snapshots: Map<string, DashboardSnapshot> = new Map();
  private reports: Map<string, RealtimeReport> = new Map();
  private wsConnections: Map<string, WebSocketConnection> = new Map();
  private kpiDefinitions: Map<string, KPIDefinition> = new Map();

  // Circular buffers for real-time data
  private readonly MAX_ACTIVITIES = 1000;
  private readonly MAX_METRIC_HISTORY = 100;

  constructor() {
    this.initializeSampleDashboards();
    this.startRealtimeSimulation();
  }

  // ============================================================================
  // Dashboard Management
  // ============================================================================

  createDashboard(params: {
    name: string;
    description: string;
    type: DashboardType;
    owner: string;
  }): Dashboard {
    const dashboard: Dashboard = {
      id: `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      type: params.type,
      layout: {
        columns: 12,
        rows: 12,
        widgets: [],
      },
      settings: {
        refreshInterval: '30s',
        autoRefresh: true,
        theme: 'light',
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      permissions: {
        owner: params.owner,
        viewers: [],
        editors: [],
        isPublic: false,
      },
      filters: {
        global: [],
        dateRange: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(),
          preset: 'last-7-days',
        },
      },
      metadata: {
        createdBy: params.owner,
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        favorited: false,
      },
    };

    this.dashboards.set(dashboard.id, dashboard);
    return dashboard;
  }

  updateDashboard(dashboardId: string, updates: Partial<Dashboard>): Dashboard {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    Object.assign(dashboard, updates);
    dashboard.metadata.updatedAt = new Date();

    return dashboard;
  }

  deleteDashboard(dashboardId: string): void {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    // Delete associated widgets
    dashboard.layout.widgets.forEach((w) => {
      this.deleteWidget(w.widgetId);
    });

    this.dashboards.delete(dashboardId);
  }

  // ============================================================================
  // Widget Management
  // ============================================================================

  createWidget(params: {
    dashboardId: string;
    name: string;
    type: WidgetType;
    dataSource: Widget['dataSource'];
    position: { x: number; y: number; width: number; height: number };
  }): Widget {
    const widget: Widget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dashboardId: params.dashboardId,
      name: params.name,
      type: params.type,
      dataSource: params.dataSource,
      visualization: {
        chartType: 'line',
        settings: {
          showLegend: true,
          showLabels: true,
          showGrid: true,
          animationEnabled: true,
        },
      },
      metrics: {},
      refreshInterval: '30s',
      lastUpdated: new Date(),
    };

    this.widgets.set(widget.id, widget);

    // Add to dashboard layout
    const dashboard = this.dashboards.get(params.dashboardId);
    if (dashboard) {
      dashboard.layout.widgets.push({
        widgetId: widget.id,
        position: params.position,
      });
    }

    // Initialize data stream subscription
    this.subscribeWidgetToDataStream(widget);

    return widget;
  }

  updateWidget(widgetId: string, updates: Partial<Widget>): Widget {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error('Widget not found');

    Object.assign(widget, updates);
    widget.lastUpdated = new Date();

    return widget;
  }

  deleteWidget(widgetId: string): void {
    const widget = this.widgets.get(widgetId);
    if (!widget) return;

    // Remove from dashboard layout
    const dashboard = this.dashboards.get(widget.dashboardId);
    if (dashboard) {
      dashboard.layout.widgets = dashboard.layout.widgets.filter((w) => w.widgetId !== widgetId);
    }

    this.widgets.delete(widgetId);
  }

  refreshWidget(widgetId: string): Widget {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error('Widget not found');

    // Simulate data refresh
    const stream = this.getOrCreateDataStream(widget.dataSource.type);
    const data = stream.data.latestValue;

    widget.metrics = {
      current: typeof data === 'number' ? data : 100 + Math.random() * 900,
      previous: widget.metrics.current || 0,
      change: 0,
      changePercent: 0,
      trend: 'stable',
      unit: '$',
    };

    if (widget.metrics.previous) {
      widget.metrics.change = widget.metrics.current - widget.metrics.previous;
      widget.metrics.changePercent = (widget.metrics.change / widget.metrics.previous) * 100;
      widget.metrics.trend =
        widget.metrics.change > 0 ? 'up' : widget.metrics.change < 0 ? 'down' : 'stable';
    }

    widget.lastUpdated = new Date();

    // Check for alerts
    this.checkWidgetAlerts(widget);

    return widget;
  }

  // ============================================================================
  // Data Stream Management
  // ============================================================================

  createDataStream(params: {
    name: string;
    type: DataStreamType;
    protocol?: DataStream['connection']['protocol'];
  }): DataStream {
    const stream: DataStream = {
      id: `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      connection: {
        status: 'disconnected',
        protocol: params.protocol || 'websocket',
        reconnectAttempts: 0,
      },
      data: {
        latestValue: null,
        timestamp: new Date(),
        buffer: [],
        bufferSize: 100,
      },
      performance: {
        messagesReceived: 0,
        messagesPerSecond: 0,
        avgLatency: 0,
        errorRate: 0,
        uptime: 100,
      },
      subscribers: [],
      settings: {
        samplingRate: 10,
        batchSize: 1,
        compressionEnabled: false,
        cacheEnabled: true,
        cacheTTL: 60,
      },
    };

    this.dataStreams.set(stream.id, stream);
    this.connectDataStream(stream.id);

    return stream;
  }

  connectDataStream(streamId: string): DataStream {
    const stream = this.dataStreams.get(streamId);
    if (!stream) throw new Error('Data stream not found');

    stream.connection.status = 'connecting';

    // Simulate connection
    setTimeout(() => {
      stream.connection.status = 'connected';
      stream.connection.lastConnected = new Date();
      stream.connection.reconnectAttempts = 0;
    }, 100);

    return stream;
  }

  disconnectDataStream(streamId: string): DataStream {
    const stream = this.dataStreams.get(streamId);
    if (!stream) throw new Error('Data stream not found');

    stream.connection.status = 'disconnected';
    return stream;
  }

  pushDataToStream(streamId: string, data: any): void {
    const stream = this.dataStreams.get(streamId);
    if (!stream) throw new Error('Data stream not found');

    const timestamp = new Date();
    const latency = Date.now() - new Date(data.timestamp || timestamp).getTime();

    stream.data.latestValue = data;
    stream.data.timestamp = timestamp;

    // Add to circular buffer
    stream.data.buffer.push(data);
    if (stream.data.buffer.length > stream.data.bufferSize) {
      stream.data.buffer.shift();
    }

    // Update performance metrics
    stream.performance.messagesReceived++;
    stream.performance.avgLatency = stream.performance.avgLatency * 0.9 + latency * 0.1;

    // Notify subscribers
    this.notifyStreamSubscribers(stream, data);
  }

  private subscribeWidgetToDataStream(widget: Widget): void {
    const stream = this.getOrCreateDataStream(widget.dataSource.type);

    const existing = stream.subscribers.find((s) => s.subscriberId === widget.id);
    if (!existing) {
      stream.subscribers.push({
        subscriberId: widget.id,
        subscriptionType: 'widget',
        subscribedAt: new Date(),
      });
    }
  }

  private getOrCreateDataStream(type: DataStreamType): DataStream {
    const existing = Array.from(this.dataStreams.values()).find((s) => s.type === type);
    if (existing) return existing;

    return this.createDataStream({
      name: `${type} Stream`,
      type,
    });
  }

  private notifyStreamSubscribers(stream: DataStream, data: any): void {
    stream.subscribers.forEach((subscriber) => {
      if (subscriber.subscriptionType === 'widget') {
        const widget = this.widgets.get(subscriber.subscriberId);
        if (widget) {
          this.updateWidgetWithStreamData(widget, data);
        }
      }
    });
  }

  private updateWidgetWithStreamData(widget: Widget, data: any): void {
    widget.metrics.previous = widget.metrics.current;
    widget.metrics.current = typeof data === 'number' ? data : data.value || 0;

    if (widget.metrics.previous) {
      widget.metrics.change = widget.metrics.current - widget.metrics.previous;
      widget.metrics.changePercent = (widget.metrics.change / widget.metrics.previous) * 100;
      widget.metrics.trend =
        widget.metrics.change > 0 ? 'up' : widget.metrics.change < 0 ? 'down' : 'stable';
    }

    widget.lastUpdated = new Date();
  }

  // ============================================================================
  // Real-time Metrics
  // ============================================================================

  updateRealtimeMetric(params: {
    name: string;
    category: string;
    value: number;
    unit: string;
  }): RealtimeMetric {
    const existingMetric = Array.from(this.realtimeMetrics.values()).find(
      (m) => m.name === params.name
    );

    const metric: RealtimeMetric = {
      id: existingMetric?.id || `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      category: params.category,
      value: {
        current: params.value,
        unit: params.unit,
        formatted: this.formatMetricValue(params.value, params.unit),
      },
      comparison: {
        previous: existingMetric?.value.current || 0,
        change: 0,
        changePercent: 0,
        trend: 'stable',
      },
      sparkline: existingMetric?.sparkline || [],
      timestamp: new Date(),
      latency: 0,
    };

    // Calculate comparison
    if (metric.comparison.previous > 0) {
      metric.comparison.change = metric.value.current - metric.comparison.previous;
      metric.comparison.changePercent =
        (metric.comparison.change / metric.comparison.previous) * 100;
      metric.comparison.trend =
        metric.comparison.change > 0 ? 'up' : metric.comparison.change < 0 ? 'down' : 'stable';
    }

    // Update sparkline
    metric.sparkline.push(metric.value.current);
    if (metric.sparkline.length > this.MAX_METRIC_HISTORY) {
      metric.sparkline.shift();
    }

    this.realtimeMetrics.set(metric.id, metric);
    return metric;
  }

  private formatMetricValue(value: number, unit: string): string {
    if (unit === '$') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (unit === '%') {
      return `${value.toFixed(2)}%`;
    } else {
      return `${value.toLocaleString('en-US')} ${unit}`;
    }
  }

  // ============================================================================
  // Alert Management
  // ============================================================================

  createAlert(params: {
    name: string;
    description: string;
    severity: AlertSeverity;
    trigger: Alert['trigger'];
    notifications: Alert['notifications'];
  }): Alert {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      severity: params.severity,
      status: 'active',
      trigger: params.trigger,
      impact: {
        affectedSystems: [],
        estimatedImpact:
          params.severity === 'critical'
            ? 'critical'
            : params.severity === 'high'
              ? 'high'
              : 'medium',
      },
      notifications: params.notifications,
      response: {},
      history: [
        {
          timestamp: new Date(),
          action: 'Alert created',
        },
      ],
      recurrence: {
        isRecurring: false,
        count: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.alerts.set(alert.id, alert);

    // Send notifications
    this.sendAlertNotifications(alert);

    return alert;
  }

  acknowledgeAlert(alertId: string, acknowledgedBy: string): Alert {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = 'acknowledged';
    alert.response.acknowledgedBy = acknowledgedBy;
    alert.response.acknowledgedAt = new Date();
    alert.response.timeToAcknowledge =
      (alert.response.acknowledgedAt.getTime() - alert.createdAt.getTime()) / (1000 * 60);

    alert.history.push({
      timestamp: new Date(),
      action: 'Alert acknowledged',
      user: acknowledgedBy,
    });

    alert.updatedAt = new Date();
    return alert;
  }

  resolveAlert(alertId: string, resolvedBy: string, resolution?: string): Alert {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = 'resolved';
    alert.response.resolvedBy = resolvedBy;
    alert.response.resolvedAt = new Date();
    alert.response.resolution = resolution;
    alert.response.timeToResolve =
      (alert.response.resolvedAt.getTime() - alert.createdAt.getTime()) / (1000 * 60);

    alert.history.push({
      timestamp: new Date(),
      action: 'Alert resolved',
      user: resolvedBy,
      details: resolution,
    });

    alert.updatedAt = new Date();
    return alert;
  }

  private checkWidgetAlerts(widget: Widget): void {
    if (!widget.alerts?.enabled || !widget.alerts.conditions) return;

    widget.alerts.conditions.forEach((condition) => {
      const currentValue = widget.metrics.current || 0;
      let triggered = false;

      switch (condition.operator) {
        case '>':
          triggered = currentValue > condition.threshold;
          break;
        case '<':
          triggered = currentValue < condition.threshold;
          break;
        case '>=':
          triggered = currentValue >= condition.threshold;
          break;
        case '<=':
          triggered = currentValue <= condition.threshold;
          break;
        case '=':
          triggered = currentValue === condition.threshold;
          break;
        case '!=':
          triggered = currentValue !== condition.threshold;
          break;
      }

      if (triggered) {
        this.createAlert({
          name: `${widget.name} Alert`,
          description: `${condition.metric} ${condition.operator} ${condition.threshold}`,
          severity: condition.severity,
          trigger: {
            source: widget.id,
            condition: `${condition.metric} ${condition.operator} ${condition.threshold}`,
            threshold: condition.threshold,
            operator: condition.operator,
            currentValue,
          },
          notifications: {
            channels: ['email'],
            recipients: [],
            sent: false,
          },
        });
      }
    });
  }

  private sendAlertNotifications(alert: Alert): void {
    // Simulate sending notifications
    setTimeout(() => {
      alert.notifications.sent = true;
      alert.notifications.sentAt = new Date();
    }, 100);
  }

  // ============================================================================
  // Performance Monitoring
  // ============================================================================

  createPerformanceMonitor(params: {
    targetType: PerformanceMonitor['target']['type'];
    targetName: string;
    identifier: string;
  }): PerformanceMonitor {
    const monitor: PerformanceMonitor = {
      id: `monitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      target: {
        type: params.targetType,
        name: params.targetName,
        identifier: params.identifier,
      },
      metrics: {
        health: {
          status: 'healthy',
          score: 95 + Math.random() * 5,
          issues: [],
        },
        performance: {
          responseTime: 50 + Math.random() * 150,
          throughput: 100 + Math.random() * 400,
          errorRate: Math.random() * 2,
          availability: 99 + Math.random(),
        },
        resources: {
          cpu: 20 + Math.random() * 40,
          memory: 30 + Math.random() * 40,
          disk: 40 + Math.random() * 30,
          network: {
            inbound: 10 + Math.random() * 40,
            outbound: 5 + Math.random() * 20,
          },
        },
      },
      trends: {
        hourly: Array.from({ length: 24 }, () => 50 + Math.random() * 50),
        daily: Array.from({ length: 7 }, () => 50 + Math.random() * 50),
        weekly: Array.from({ length: 4 }, () => 50 + Math.random() * 50),
      },
      thresholds: {
        responseTime: { warning: 200, critical: 500 },
        errorRate: { warning: 2, critical: 5 },
        cpu: { warning: 70, critical: 90 },
        memory: { warning: 75, critical: 90 },
      },
      alerts: [],
      lastChecked: new Date(),
      checkInterval: 30,
    };

    this.performanceMonitors.set(monitor.id, monitor);
    return monitor;
  }

  updatePerformanceMonitor(monitorId: string): PerformanceMonitor {
    const monitor = this.performanceMonitors.get(monitorId);
    if (!monitor) throw new Error('Performance monitor not found');

    // Simulate metric updates
    monitor.metrics.performance.responseTime = 50 + Math.random() * 150;
    monitor.metrics.performance.throughput = 100 + Math.random() * 400;
    monitor.metrics.performance.errorRate = Math.random() * 2;
    monitor.metrics.resources.cpu = 20 + Math.random() * 40;
    monitor.metrics.resources.memory = 30 + Math.random() * 40;

    // Update health status
    const issues: string[] = [];
    let healthScore = 100;

    if (monitor.metrics.performance.responseTime > monitor.thresholds.responseTime.critical) {
      issues.push('Critical response time');
      healthScore -= 30;
    } else if (monitor.metrics.performance.responseTime > monitor.thresholds.responseTime.warning) {
      issues.push('High response time');
      healthScore -= 15;
    }

    if (monitor.metrics.performance.errorRate > monitor.thresholds.errorRate.critical) {
      issues.push('Critical error rate');
      healthScore -= 40;
    } else if (monitor.metrics.performance.errorRate > monitor.thresholds.errorRate.warning) {
      issues.push('Elevated error rate');
      healthScore -= 20;
    }

    if (monitor.metrics.resources.cpu > monitor.thresholds.cpu.critical) {
      issues.push('Critical CPU usage');
      healthScore -= 25;
    } else if (monitor.metrics.resources.cpu > monitor.thresholds.cpu.warning) {
      issues.push('High CPU usage');
      healthScore -= 10;
    }

    monitor.metrics.health.issues = issues;
    monitor.metrics.health.score = Math.max(0, healthScore);

    if (healthScore >= 80) monitor.metrics.health.status = 'healthy';
    else if (healthScore >= 60) monitor.metrics.health.status = 'degraded';
    else if (healthScore >= 40) monitor.metrics.health.status = 'unhealthy';
    else monitor.metrics.health.status = 'critical';

    monitor.lastChecked = new Date();

    return monitor;
  }

  // ============================================================================
  // Live Activity Tracking
  // ============================================================================

  trackLiveActivity(activity: Omit<LiveActivity, 'id' | 'timestamp' | 'processed'>): LiveActivity {
    const liveActivity: LiveActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...activity,
      timestamp: new Date(),
      processed: false,
    };

    this.liveActivities.push(liveActivity);

    // Maintain circular buffer
    if (this.liveActivities.length > this.MAX_ACTIVITIES) {
      this.liveActivities.shift();
    }

    // Update relevant metrics
    this.processLiveActivity(liveActivity);

    return liveActivity;
  }

  private processLiveActivity(activity: LiveActivity): void {
    activity.processed = true;

    // Update relevant real-time metrics based on activity type
    switch (activity.type) {
      case 'order':
        this.updateRealtimeMetric({
          name: 'Total Orders',
          category: 'Sales',
          value: this.liveActivities.filter((a) => a.type === 'order').length,
          unit: 'orders',
        });
        break;

      case 'purchase':
        if (activity.data.value) {
          this.updateRealtimeMetric({
            name: 'Total Revenue',
            category: 'Sales',
            value: this.liveActivities
              .filter((a) => a.type === 'purchase')
              .reduce((sum, a) => sum + (a.data.value || 0), 0),
            unit: '$',
          });
        }
        break;

      case 'user-login':
        this.updateRealtimeMetric({
          name: 'Active Users',
          category: 'Users',
          value: new Set(
            this.liveActivities.filter((a) => a.type === 'user-login').map((a) => a.data.user?.id)
          ).size,
          unit: 'users',
        });
        break;
    }
  }

  getLiveActivities(params?: {
    type?: LiveActivity['type'];
    limit?: number;
    since?: Date;
  }): LiveActivity[] {
    let activities = [...this.liveActivities];

    if (params?.type) {
      activities = activities.filter((a) => a.type === params.type);
    }

    if (params?.since) {
      activities = activities.filter((a) => a.timestamp >= params.since);
    }

    if (params?.limit) {
      activities = activities.slice(-params.limit);
    }

    return activities.reverse();
  }

  // ============================================================================
  // Dashboard Snapshots
  // ============================================================================

  createSnapshot(dashboardId: string, name: string, createdBy: string): DashboardSnapshot {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const snapshot: DashboardSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dashboardId,
      name,
      data: {
        widgets: [],
        timestamp: new Date(),
        period: dashboard.filters.dateRange,
      },
      exportFormats: ['pdf', 'png', 'excel'],
      createdBy,
      createdAt: new Date(),
    };

    // Capture current state of all widgets
    dashboard.layout.widgets.forEach((w) => {
      const widget = this.widgets.get(w.widgetId);
      if (widget) {
        snapshot.data.widgets.push({
          widgetId: widget.id,
          snapshot: { ...widget },
          metrics: widget.metrics ? [this.convertWidgetMetricsToRealtimeMetric(widget)] : [],
        });
      }
    });

    this.snapshots.set(snapshot.id, snapshot);
    return snapshot;
  }

  private convertWidgetMetricsToRealtimeMetric(widget: Widget): RealtimeMetric {
    return {
      id: `metric_${widget.id}`,
      name: widget.name,
      category: widget.type,
      value: {
        current: widget.metrics.current || 0,
        unit: widget.metrics.unit || '',
        formatted: this.formatMetricValue(widget.metrics.current || 0, widget.metrics.unit || ''),
      },
      comparison: {
        previous: widget.metrics.previous || 0,
        change: widget.metrics.change || 0,
        changePercent: widget.metrics.changePercent || 0,
        trend: widget.metrics.trend || 'stable',
      },
      timestamp: widget.lastUpdated,
      latency: 0,
    };
  }

  // ============================================================================
  // Real-time Simulation
  // ============================================================================

  private startRealtimeSimulation(): void {
    // Simulate real-time data updates
    setInterval(() => {
      this.simulateRealtimeData();
    }, 5000); // Every 5 seconds
  }

  private simulateRealtimeData(): void {
    // Simulate sales activity
    if (Math.random() > 0.7) {
      this.trackLiveActivity({
        type: 'order',
        data: {
          user: {
            id: `user_${Math.floor(Math.random() * 1000)}`,
            location: { country: 'USA', city: 'New York' },
          },
          details: {
            orderId: `order_${Date.now()}`,
            items: Math.floor(1 + Math.random() * 5),
          },
          value: 50 + Math.random() * 450,
        },
      });
    }

    // Update data streams
    this.dataStreams.forEach((stream) => {
      if (stream.connection.status === 'connected') {
        const value = 100 + Math.random() * 900;
        this.pushDataToStream(stream.id, { value, timestamp: new Date() });
      }
    });

    // Update performance monitors
    this.performanceMonitors.forEach((monitor, id) => {
      this.updatePerformanceMonitor(id);
    });
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  private initializeSampleDashboards(): void {
    // Create executive dashboard
    const execDashboard = this.createDashboard({
      name: 'Executive Dashboard',
      description: 'High-level business metrics and KPIs',
      type: 'executive',
      owner: 'admin',
    });

    // Create sales widget
    this.createWidget({
      dashboardId: execDashboard.id,
      name: 'Total Revenue',
      type: 'metric',
      dataSource: {
        type: 'sales',
        aggregation: 'sum',
      },
      position: { x: 0, y: 0, width: 3, height: 2 },
    });

    // Create orders widget
    this.createWidget({
      dashboardId: execDashboard.id,
      name: 'Orders Today',
      type: 'metric',
      dataSource: {
        type: 'orders',
        aggregation: 'count',
      },
      position: { x: 3, y: 0, width: 3, height: 2 },
    });

    // Create traffic widget
    this.createWidget({
      dashboardId: execDashboard.id,
      name: 'Website Traffic',
      type: 'chart',
      dataSource: {
        type: 'traffic',
        aggregation: 'count',
      },
      position: { x: 0, y: 2, width: 6, height: 4 },
    });

    // Create performance monitors
    this.createPerformanceMonitor({
      targetType: 'system',
      targetName: 'Main Application',
      identifier: 'app-main',
    });

    this.createPerformanceMonitor({
      targetType: 'database',
      targetName: 'Primary Database',
      identifier: 'db-primary',
    });

    // Initialize KPI definitions
    this.initializeKPIDefinitions();
  }

  private initializeKPIDefinitions(): void {
    const kpis = [
      {
        name: 'Revenue Per Visitor',
        category: 'Sales',
        formula: 'total_revenue / total_visitors',
        unit: '$',
      },
      {
        name: 'Conversion Rate',
        category: 'Sales',
        formula: 'orders / visitors * 100',
        unit: '%',
      },
      {
        name: 'Average Order Value',
        category: 'Sales',
        formula: 'total_revenue / orders',
        unit: '$',
      },
    ];

    kpis.forEach((kpi) => {
      const definition: KPIDefinition = {
        id: `kpi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: kpi.name,
        description: `Tracks ${kpi.name.toLowerCase()}`,
        category: kpi.category,
        calculation: {
          formula: kpi.formula,
          inputs: [],
          aggregation: 'custom',
        },
        targets: {},
        thresholds: {
          critical: {},
          warning: {},
          normal: { min: 0, max: 1000000 },
        },
        visualization: {
          preferredChartType: 'line',
          unit: kpi.unit,
          format: kpi.unit === '$' ? '$0,0.00' : '0,0.00',
        },
        metadata: {
          owner: 'system',
          createdAt: new Date(),
          updatedAt: new Date(),
          deprecated: false,
        },
      };

      this.kpiDefinitions.set(definition.id, definition);
    });
  }

  // ============================================================================
  // Query Methods
  // ============================================================================

  getDashboardsByType(type: DashboardType): Dashboard[] {
    return Array.from(this.dashboards.values()).filter((d) => d.type === type);
  }

  getWidgetsByDashboard(dashboardId: string): Widget[] {
    return Array.from(this.widgets.values()).filter((w) => w.dashboardId === dashboardId);
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter((a) => a.status === 'active');
  }

  getActiveDataStreams(): DataStream[] {
    return Array.from(this.dataStreams.values()).filter((s) => s.connection.status === 'connected');
  }

  getRealtimeMetricsByCategory(category: string): RealtimeMetric[] {
    return Array.from(this.realtimeMetrics.values()).filter((m) => m.category === category);
  }

  getPerformanceMonitorsByStatus(
    status: PerformanceMonitor['metrics']['health']['status']
  ): PerformanceMonitor[] {
    return Array.from(this.performanceMonitors.values()).filter(
      (m) => m.metrics.health.status === status
    );
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const realtimeDashboardSystem = new RealtimeDashboardSystem();
