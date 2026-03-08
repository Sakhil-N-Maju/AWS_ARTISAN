/**
 * Admin Panel System
 *
 * Comprehensive administrative interface for platform management with
 * role-based access, audit logging, and real-time monitoring.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type AdminRole =
  | 'super-admin'
  | 'admin'
  | 'moderator'
  | 'support'
  | 'analyst'
  | 'content-manager'
  | 'finance-manager'
  | 'operations-manager';

export type PermissionCategory =
  | 'users'
  | 'products'
  | 'orders'
  | 'content'
  | 'analytics'
  | 'settings'
  | 'security'
  | 'finance'
  | 'reports';

export type ActionType =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'export'
  | 'import';

export type AuditAction =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'export'
  | 'import'
  | 'config-change'
  | 'permission-change';

export type DashboardWidgetType =
  | 'metric'
  | 'chart'
  | 'table'
  | 'list'
  | 'activity-feed'
  | 'alert'
  | 'map'
  | 'calendar';

export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'area'
  | 'scatter'
  | 'heatmap'
  | 'funnel';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'cancelled';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;

  permissions: Permission[];

  profile: {
    avatar?: string;
    phone?: string;
    department?: string;
    title?: string;
  };

  settings: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };

  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    allowedIPs?: string[];
    sessionTimeout: number; // minutes
  };

  status: 'active' | 'inactive' | 'suspended';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    lastActivity?: Date;
    loginCount: number;
  };
}

export interface Permission {
  id: string;
  category: PermissionCategory;
  action: ActionType;

  resource?: string; // Specific resource or wildcard

  conditions?: Array<{
    field: string;
    operator: 'equals' | 'not-equals' | 'contains' | 'in' | 'not-in';
    value: any;
  }>;

  enabled: boolean;

  metadata: {
    grantedBy?: string;
    grantedAt: Date;
    expiresAt?: Date;
  };
}

export interface AuditLog {
  id: string;

  actor: {
    userId: string;
    userName: string;
    role: AdminRole;
    ip?: string;
    userAgent?: string;
  };

  action: AuditAction;

  resource: {
    type: string;
    id?: string;
    name?: string;
  };

  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  metadata: {
    success: boolean;
    errorMessage?: string;
    duration?: number; // milliseconds
    requestId?: string;
  };

  timestamp: Date;
}

export interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;

  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  config: {
    metric?: {
      value: number;
      label: string;
      change?: number;
      changeType?: 'increase' | 'decrease';
      trend?: number[];
      target?: number;
    };

    chart?: {
      type: ChartType;
      data: Array<{
        label: string;
        value: number;
        color?: string;
      }>;
      options?: Record<string, any>;
    };

    table?: {
      columns: Array<{
        key: string;
        label: string;
        sortable?: boolean;
      }>;
      data: Array<Record<string, any>>;
      pagination?: {
        page: number;
        pageSize: number;
        total: number;
      };
    };

    list?: {
      items: Array<{
        id: string;
        title: string;
        subtitle?: string;
        icon?: string;
        metadata?: Record<string, any>;
      }>;
    };

    activityFeed?: {
      activities: Array<{
        id: string;
        user: string;
        action: string;
        resource: string;
        timestamp: Date;
      }>;
    };

    alert?: {
      severity: AlertSeverity;
      message: string;
      count?: number;
      actionUrl?: string;
    };
  };

  refreshInterval?: number; // seconds

  filters?: Record<string, any>;

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastRefresh?: Date;
  };
}

export interface AdminDashboard {
  id: string;
  name: string;
  description?: string;

  layout: 'grid' | 'flex';

  widgets: DashboardWidget[];

  filters: {
    dateRange?: {
      start: Date;
      end: Date;
    };
    customFilters?: Record<string, any>;
  };

  sharing: {
    isPublic: boolean;
    sharedWith?: string[]; // User IDs
  };

  owner: {
    userId: string;
    userName: string;
  };

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastViewed?: Date;
    viewCount: number;
  };
}

export interface AdminTask {
  id: string;
  type: 'approval' | 'review' | 'investigation' | 'maintenance' | 'custom';

  title: string;
  description: string;

  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TaskStatus;

  assignee?: {
    userId: string;
    userName: string;
    assignedAt: Date;
  };

  relatedResource?: {
    type: string;
    id: string;
    name?: string;
  };

  dueDate?: Date;

  workflow?: Array<{
    step: string;
    status: 'pending' | 'completed' | 'skipped';
    completedBy?: string;
    completedAt?: Date;
    notes?: string;
  }>;

  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: Date;
  }>;

  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
  };
}

export interface SystemAlert {
  id: string;
  severity: AlertSeverity;

  category: 'security' | 'performance' | 'error' | 'business' | 'system';

  title: string;
  message: string;

  source: {
    system: string;
    component?: string;
  };

  affectedResources?: Array<{
    type: string;
    id: string;
    name?: string;
  }>;

  metrics?: Record<string, number>;

  status: 'active' | 'acknowledged' | 'resolved' | 'ignored';

  acknowledgedBy?: {
    userId: string;
    userName: string;
    timestamp: Date;
    notes?: string;
  };

  resolvedBy?: {
    userId: string;
    userName: string;
    timestamp: Date;
    resolution?: string;
  };

  actions?: Array<{
    label: string;
    url: string;
    type: 'primary' | 'secondary';
  }>;

  timestamp: Date;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;

  category: 'user' | 'product' | 'order' | 'content' | 'system';

  action: {
    type: 'navigate' | 'modal' | 'command';
    target?: string;
    command?: string;
    params?: Record<string, any>;
  };

  permissions: Permission[];

  hotkey?: string;

  enabled: boolean;

  usage: {
    count: number;
    lastUsed?: Date;
  };
}

export interface BulkOperation {
  id: string;
  type: 'update' | 'delete' | 'export' | 'import';

  resourceType: string;

  filters?: Record<string, any>;
  affectedCount: number;

  operation: {
    action: string;
    params: Record<string, any>;
  };

  status: TaskStatus;

  progress: {
    total: number;
    completed: number;
    failed: number;
    percentage: number;
  };

  results?: {
    successful: string[];
    failed: Array<{
      id: string;
      error: string;
    }>;
  };

  metadata: {
    initiatedBy: string;
    startedAt: Date;
    completedAt?: Date;
    estimatedCompletion?: Date;
  };
}

export interface SystemMetrics {
  timestamp: Date;

  server: {
    cpu: {
      usage: number; // percentage
      cores: number;
    };

    memory: {
      used: number; // bytes
      total: number;
      percentage: number;
    };

    disk: {
      used: number;
      total: number;
      percentage: number;
    };

    network: {
      incoming: number; // bytes/sec
      outgoing: number;
    };
  };

  application: {
    activeUsers: number;
    activeAdmins: number;

    requestsPerSecond: number;
    averageResponseTime: number;

    errorRate: number;

    database: {
      connections: number;
      queryTime: number;
    };

    cache: {
      hitRate: number;
      size: number;
    };
  };

  business: {
    ordersPerHour: number;
    revenuePerHour: number;
    activeListings: number;
    newUsers: number;
  };
}

export interface AdminReport {
  id: string;
  type: 'user' | 'sales' | 'inventory' | 'security' | 'performance' | 'custom';

  name: string;
  description?: string;

  parameters: Record<string, any>;

  schedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    time?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    timezone: string;
  };

  recipients?: string[]; // Email addresses

  format: ReportFormat;

  lastRun?: {
    timestamp: Date;
    status: 'success' | 'failed';
    fileUrl?: string;
    error?: string;
  };

  nextRun?: Date;

  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface AdminSession {
  id: string;
  userId: string;

  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
    ip: string;
    location?: {
      country: string;
      city?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
  };

  startedAt: Date;
  lastActivity: Date;
  expiresAt: Date;

  status: 'active' | 'expired' | 'terminated';
}

// ============================================================================
// Main System Class
// ============================================================================

export class AdminPanelSystem {
  private adminUsers: Map<string, AdminUser> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private auditLogs: Map<string, AuditLog> = new Map();
  private dashboards: Map<string, AdminDashboard> = new Map();
  private widgets: Map<string, DashboardWidget> = new Map();
  private tasks: Map<string, AdminTask> = new Map();
  private alerts: Map<string, SystemAlert> = new Map();
  private quickActions: Map<string, QuickAction> = new Map();
  private bulkOperations: Map<string, BulkOperation> = new Map();
  private reports: Map<string, AdminReport> = new Map();
  private sessions: Map<string, AdminSession> = new Map();

  private metricsHistory: SystemMetrics[] = [];
  private metricsCollectionInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeDefaultRoles();
    this.initializeQuickActions();
    this.startMetricsCollection();
  }

  // ============================================================================
  // Admin User Management
  // ============================================================================

  createAdminUser(params: {
    email: string;
    name: string;
    role: AdminRole;
    password: string;
    createdBy: string;
  }): AdminUser {
    const user: AdminUser = {
      id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: params.email,
      name: params.name,
      role: params.role,
      permissions: this.getDefaultPermissionsForRole(params.role),
      profile: {},
      settings: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: new Date(),
        sessionTimeout: 60,
      },
      status: 'active',
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        loginCount: 0,
      },
    };

    this.adminUsers.set(user.id, user);

    // Log creation
    this.logAudit({
      actorId: params.createdBy,
      action: 'create',
      resourceType: 'admin-user',
      resourceId: user.id,
      resourceName: user.name,
    });

    return user;
  }

  updateAdminUser(userId: string, updates: Partial<AdminUser>, updatedBy: string): AdminUser {
    const user = this.adminUsers.get(userId);
    if (!user) throw new Error('Admin user not found');

    const changes: AuditLog['changes'] = [];

    Object.keys(updates).forEach((key) => {
      const oldValue = (user as any)[key];
      const newValue = (updates as any)[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field: key, oldValue, newValue });
      }
    });

    Object.assign(user, updates);
    user.metadata.updatedAt = new Date();

    this.logAudit({
      actorId: updatedBy,
      action: 'update',
      resourceType: 'admin-user',
      resourceId: userId,
      changes,
    });

    return user;
  }

  grantPermission(
    userId: string,
    permission: Omit<Permission, 'id' | 'metadata'>,
    grantedBy: string
  ): Permission {
    const user = this.adminUsers.get(userId);
    if (!user) throw new Error('Admin user not found');

    const perm: Permission = {
      id: `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...permission,
      metadata: {
        grantedBy,
        grantedAt: new Date(),
      },
    };

    this.permissions.set(perm.id, perm);
    user.permissions.push(perm);
    user.metadata.updatedAt = new Date();

    this.logAudit({
      actorId: grantedBy,
      action: 'permission-change',
      resourceType: 'admin-user',
      resourceId: userId,
      changes: [{ field: 'permissions', oldValue: null, newValue: perm }],
    });

    return perm;
  }

  revokePermission(userId: string, permissionId: string, revokedBy: string): void {
    const user = this.adminUsers.get(userId);
    if (!user) throw new Error('Admin user not found');

    const index = user.permissions.findIndex((p) => p.id === permissionId);
    if (index === -1) throw new Error('Permission not found');

    const removed = user.permissions.splice(index, 1)[0];
    this.permissions.delete(permissionId);
    user.metadata.updatedAt = new Date();

    this.logAudit({
      actorId: revokedBy,
      action: 'permission-change',
      resourceType: 'admin-user',
      resourceId: userId,
      changes: [{ field: 'permissions', oldValue: removed, newValue: null }],
    });
  }

  hasPermission(
    userId: string,
    category: PermissionCategory,
    action: ActionType,
    resource?: string
  ): boolean {
    const user = this.adminUsers.get(userId);
    if (!user) return false;
    if (user.status !== 'active') return false;

    // Super admin has all permissions
    if (user.role === 'super-admin') return true;

    return user.permissions.some((p) => {
      if (!p.enabled) return false;
      if (p.metadata.expiresAt && new Date() > p.metadata.expiresAt) return false;
      if (p.category !== category) return false;
      if (p.action !== action) return false;
      if (p.resource && resource && p.resource !== '*' && p.resource !== resource) return false;

      return true;
    });
  }

  // ============================================================================
  // Dashboard Management
  // ============================================================================

  createDashboard(params: {
    name: string;
    description?: string;
    userId: string;
    userName: string;
  }): AdminDashboard {
    const dashboard: AdminDashboard = {
      id: `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      layout: 'grid',
      widgets: [],
      filters: {},
      sharing: {
        isPublic: false,
      },
      owner: {
        userId: params.userId,
        userName: params.userName,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
      },
    };

    this.dashboards.set(dashboard.id, dashboard);
    return dashboard;
  }

  addWidgetToDashboard(
    dashboardId: string,
    widget: Omit<DashboardWidget, 'id' | 'metadata'>
  ): DashboardWidget {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) throw new Error('Dashboard not found');

    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...widget,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    this.widgets.set(newWidget.id, newWidget);
    dashboard.widgets.push(newWidget);
    dashboard.metadata.updatedAt = new Date();

    return newWidget;
  }

  updateWidget(widgetId: string, updates: Partial<DashboardWidget>): DashboardWidget {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error('Widget not found');

    Object.assign(widget, updates);
    widget.metadata.updatedAt = new Date();

    return widget;
  }

  refreshWidget(widgetId: string): DashboardWidget {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error('Widget not found');

    // Simulate data refresh
    if (widget.config.metric) {
      widget.config.metric.value = Math.floor(Math.random() * 10000);
      widget.config.metric.change = (Math.random() - 0.5) * 20;
    }

    widget.metadata.lastRefresh = new Date();
    widget.metadata.updatedAt = new Date();

    return widget;
  }

  // ============================================================================
  // Task Management
  // ============================================================================

  createTask(params: {
    type: AdminTask['type'];
    title: string;
    description: string;
    priority: AdminTask['priority'];
    assigneeId?: string;
    createdBy: string;
    dueDate?: Date;
  }): AdminTask {
    const task: AdminTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      title: params.title,
      description: params.description,
      priority: params.priority,
      status: 'pending',
      dueDate: params.dueDate,
      comments: [],
      metadata: {
        createdBy: params.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    if (params.assigneeId) {
      const assignee = this.adminUsers.get(params.assigneeId);
      if (assignee) {
        task.assignee = {
          userId: assignee.id,
          userName: assignee.name,
          assignedAt: new Date(),
        };
      }
    }

    this.tasks.set(task.id, task);

    this.logAudit({
      actorId: params.createdBy,
      action: 'create',
      resourceType: 'admin-task',
      resourceId: task.id,
      resourceName: task.title,
    });

    return task;
  }

  updateTaskStatus(taskId: string, status: TaskStatus, userId: string): AdminTask {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error('Task not found');

    const oldStatus = task.status;
    task.status = status;
    task.metadata.updatedAt = new Date();

    if (status === 'completed') {
      task.metadata.completedAt = new Date();
    }

    this.logAudit({
      actorId: userId,
      action: 'update',
      resourceType: 'admin-task',
      resourceId: taskId,
      changes: [{ field: 'status', oldValue: oldStatus, newValue: status }],
    });

    return task;
  }

  addTaskComment(taskId: string, userId: string, userName: string, text: string): AdminTask {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error('Task not found');

    task.comments.push({
      id: `comment_${Date.now()}`,
      userId,
      userName,
      text,
      timestamp: new Date(),
    });

    task.metadata.updatedAt = new Date();

    return task;
  }

  getTasksByAssignee(userId: string, status?: TaskStatus): AdminTask[] {
    return Array.from(this.tasks.values())
      .filter((task) => {
        if (task.assignee?.userId !== userId) return false;
        if (status && task.status !== status) return false;
        return true;
      })
      .sort((a, b) => {
        // Sort by priority, then due date
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        return 0;
      });
  }

  // ============================================================================
  // Alert Management
  // ============================================================================

  createAlert(params: {
    severity: AlertSeverity;
    category: SystemAlert['category'];
    title: string;
    message: string;
    source: SystemAlert['source'];
    metrics?: Record<string, number>;
  }): SystemAlert {
    const alert: SystemAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      severity: params.severity,
      category: params.category,
      title: params.title,
      message: params.message,
      source: params.source,
      metrics: params.metrics,
      status: 'active',
      timestamp: new Date(),
    };

    this.alerts.set(alert.id, alert);

    // Auto-log critical alerts
    if (params.severity === 'critical') {
      this.logAudit({
        actorId: 'system',
        action: 'create',
        resourceType: 'alert',
        resourceId: alert.id,
        resourceName: alert.title,
      });
    }

    return alert;
  }

  acknowledgeAlert(alertId: string, userId: string, userName: string, notes?: string): SystemAlert {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = 'acknowledged';
    alert.acknowledgedBy = {
      userId,
      userName,
      timestamp: new Date(),
      notes,
    };

    this.logAudit({
      actorId: userId,
      action: 'update',
      resourceType: 'alert',
      resourceId: alertId,
    });

    return alert;
  }

  resolveAlert(
    alertId: string,
    userId: string,
    userName: string,
    resolution?: string
  ): SystemAlert {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error('Alert not found');

    alert.status = 'resolved';
    alert.resolvedBy = {
      userId,
      userName,
      timestamp: new Date(),
      resolution,
    };

    this.logAudit({
      actorId: userId,
      action: 'update',
      resourceType: 'alert',
      resourceId: alertId,
    });

    return alert;
  }

  getActiveAlerts(severity?: AlertSeverity): SystemAlert[] {
    return Array.from(this.alerts.values())
      .filter((alert) => {
        if (alert.status === 'resolved' || alert.status === 'ignored') return false;
        if (severity && alert.severity !== severity) return false;
        return true;
      })
      .sort((a, b) => {
        const severityOrder = { critical: 0, error: 1, warning: 2, info: 3 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  // ============================================================================
  // Bulk Operations
  // ============================================================================

  createBulkOperation(params: {
    type: BulkOperation['type'];
    resourceType: string;
    operation: BulkOperation['operation'];
    filters?: Record<string, any>;
    initiatedBy: string;
  }): BulkOperation {
    const bulkOp: BulkOperation = {
      id: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      resourceType: params.resourceType,
      filters: params.filters,
      affectedCount: 0, // Will be calculated
      operation: params.operation,
      status: 'pending',
      progress: {
        total: 0,
        completed: 0,
        failed: 0,
        percentage: 0,
      },
      metadata: {
        initiatedBy: params.initiatedBy,
        startedAt: new Date(),
      },
    };

    this.bulkOperations.set(bulkOp.id, bulkOp);

    // Start processing
    this.processBulkOperation(bulkOp.id);

    return bulkOp;
  }

  private async processBulkOperation(operationId: string): Promise<void> {
    const operation = this.bulkOperations.get(operationId);
    if (!operation) return;

    operation.status = 'in-progress';

    // Simulate bulk processing
    const itemCount = Math.floor(Math.random() * 100) + 10;
    operation.progress.total = itemCount;
    operation.affectedCount = itemCount;

    const results: BulkOperation['results'] = {
      successful: [],
      failed: [],
    };

    for (let i = 0; i < itemCount; i++) {
      await this.delay(50);

      // 95% success rate
      if (Math.random() < 0.95) {
        results.successful.push(`item_${i}`);
        operation.progress.completed++;
      } else {
        results.failed.push({
          id: `item_${i}`,
          error: 'Simulated error',
        });
        operation.progress.failed++;
      }

      operation.progress.percentage = Math.round(
        ((operation.progress.completed + operation.progress.failed) / operation.progress.total) *
          100
      );
    }

    operation.results = results;
    operation.status = operation.progress.failed === 0 ? 'completed' : 'completed';
    operation.metadata.completedAt = new Date();

    this.logAudit({
      actorId: operation.metadata.initiatedBy,
      action: operation.type === 'delete' ? 'delete' : 'update',
      resourceType: operation.resourceType,
      resourceId: operationId,
    });
  }

  getBulkOperationStatus(operationId: string): BulkOperation | null {
    return this.bulkOperations.get(operationId) || null;
  }

  // ============================================================================
  // Audit Logging
  // ============================================================================

  private logAudit(params: {
    actorId: string;
    action: AuditAction;
    resourceType: string;
    resourceId?: string;
    resourceName?: string;
    changes?: AuditLog['changes'];
    success?: boolean;
    errorMessage?: string;
  }): AuditLog {
    const actor = this.adminUsers.get(params.actorId);

    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      actor: {
        userId: params.actorId,
        userName: actor?.name || 'System',
        role: actor?.role || 'super-admin',
      },
      action: params.action,
      resource: {
        type: params.resourceType,
        id: params.resourceId,
        name: params.resourceName,
      },
      changes: params.changes,
      metadata: {
        success: params.success !== false,
        errorMessage: params.errorMessage,
      },
      timestamp: new Date(),
    };

    this.auditLogs.set(log.id, log);
    return log;
  }

  getAuditLogs(filters?: {
    userId?: string;
    action?: AuditAction;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLog[] {
    let logs = Array.from(this.auditLogs.values());

    if (filters) {
      logs = logs.filter((log) => {
        if (filters.userId && log.actor.userId !== filters.userId) return false;
        if (filters.action && log.action !== filters.action) return false;
        if (filters.resourceType && log.resource.type !== filters.resourceType) return false;
        if (filters.startDate && log.timestamp < filters.startDate) return false;
        if (filters.endDate && log.timestamp > filters.endDate) return false;
        return true;
      });
    }

    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  // ============================================================================
  // Reports
  // ============================================================================

  createReport(params: {
    type: AdminReport['type'];
    name: string;
    description?: string;
    parameters: Record<string, any>;
    format: ReportFormat;
    schedule?: AdminReport['schedule'];
    recipients?: string[];
    createdBy: string;
  }): AdminReport {
    const report: AdminReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: params.type,
      name: params.name,
      description: params.description,
      parameters: params.parameters,
      format: params.format,
      schedule: params.schedule,
      recipients: params.recipients,
      metadata: {
        createdBy: params.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    if (params.schedule && params.schedule.frequency !== 'once') {
      report.nextRun = this.calculateNextRunTime(params.schedule);
    }

    this.reports.set(report.id, report);

    this.logAudit({
      actorId: params.createdBy,
      action: 'create',
      resourceType: 'report',
      resourceId: report.id,
      resourceName: report.name,
    });

    return report;
  }

  async generateReport(reportId: string): Promise<{ url: string; format: ReportFormat }> {
    const report = this.reports.get(reportId);
    if (!report) throw new Error('Report not found');

    // Simulate report generation
    await this.delay(2000);

    const fileUrl = `/reports/${reportId}_${Date.now()}.${report.format}`;

    report.lastRun = {
      timestamp: new Date(),
      status: 'success',
      fileUrl,
    };

    if (report.schedule && report.schedule.frequency !== 'once') {
      report.nextRun = this.calculateNextRunTime(report.schedule);
    }

    return { url: fileUrl, format: report.format };
  }

  private calculateNextRunTime(schedule: AdminReport['schedule']): Date {
    const now = new Date();
    const next = new Date(now);

    switch (schedule!.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
    }

    return next;
  }

  // ============================================================================
  // System Metrics
  // ============================================================================

  getCurrentMetrics(): SystemMetrics {
    return {
      timestamp: new Date(),
      server: {
        cpu: {
          usage: Math.random() * 100,
          cores: 8,
        },
        memory: {
          used: Math.random() * 16 * 1024 * 1024 * 1024,
          total: 16 * 1024 * 1024 * 1024,
          percentage: Math.random() * 100,
        },
        disk: {
          used: Math.random() * 500 * 1024 * 1024 * 1024,
          total: 500 * 1024 * 1024 * 1024,
          percentage: Math.random() * 100,
        },
        network: {
          incoming: Math.random() * 1000000,
          outgoing: Math.random() * 1000000,
        },
      },
      application: {
        activeUsers: Math.floor(Math.random() * 1000),
        activeAdmins: Math.floor(Math.random() * 20),
        requestsPerSecond: Math.random() * 100,
        averageResponseTime: Math.random() * 200,
        errorRate: Math.random() * 5,
        database: {
          connections: Math.floor(Math.random() * 50),
          queryTime: Math.random() * 50,
        },
        cache: {
          hitRate: 85 + Math.random() * 10,
          size: Math.random() * 1024 * 1024 * 1024,
        },
      },
      business: {
        ordersPerHour: Math.floor(Math.random() * 100),
        revenuePerHour: Math.random() * 10000,
        activeListings: Math.floor(Math.random() * 5000),
        newUsers: Math.floor(Math.random() * 50),
      },
    };
  }

  getMetricsHistory(duration: number = 3600): SystemMetrics[] {
    const now = Date.now();
    return this.metricsHistory.filter((m) => now - m.timestamp.getTime() <= duration * 1000);
  }

  // ============================================================================
  // Session Management
  // ============================================================================

  createSession(userId: string, device: AdminSession['device']): AdminSession {
    const session: AdminSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      device,
      startedAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      status: 'active',
    };

    this.sessions.set(session.id, session);

    // Update user
    const user = this.adminUsers.get(userId);
    if (user) {
      user.metadata.lastLogin = new Date();
      user.metadata.loginCount++;
    }

    return session;
  }

  getActiveSessions(userId?: string): AdminSession[] {
    return Array.from(this.sessions.values()).filter((s) => {
      if (s.status !== 'active') return false;
      if (userId && s.userId !== userId) return false;
      if (new Date() > s.expiresAt) {
        s.status = 'expired';
        return false;
      }
      return true;
    });
  }

  terminateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'terminated';
    }
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private getDefaultPermissionsForRole(role: AdminRole): Permission[] {
    const now = new Date();
    const permissions: Permission[] = [];

    const createPerm = (category: PermissionCategory, action: ActionType): Permission => ({
      id: `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category,
      action,
      enabled: true,
      metadata: { grantedAt: now },
    });

    switch (role) {
      case 'super-admin':
        // Has all permissions (handled separately)
        break;

      case 'admin':
        ['users', 'products', 'orders', 'content', 'settings'].forEach((cat) => {
          ['view', 'create', 'edit', 'delete'].forEach((act) => {
            permissions.push(createPerm(cat as PermissionCategory, act as ActionType));
          });
        });
        break;

      case 'moderator':
        permissions.push(createPerm('content', 'view'));
        permissions.push(createPerm('content', 'edit'));
        permissions.push(createPerm('content', 'approve'));
        permissions.push(createPerm('content', 'reject'));
        permissions.push(createPerm('users', 'view'));
        break;

      case 'support':
        permissions.push(createPerm('users', 'view'));
        permissions.push(createPerm('orders', 'view'));
        permissions.push(createPerm('orders', 'edit'));
        break;

      case 'analyst':
        permissions.push(createPerm('analytics', 'view'));
        permissions.push(createPerm('analytics', 'export'));
        break;
    }

    return permissions;
  }

  private initializeDefaultRoles(): void {
    // Create a default super admin
    const superAdmin: AdminUser = {
      id: 'admin_super_1',
      email: 'admin@artisans.com',
      name: 'System Administrator',
      role: 'super-admin',
      permissions: [],
      profile: {},
      settings: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
      security: {
        twoFactorEnabled: true,
        lastPasswordChange: new Date(),
        sessionTimeout: 60,
      },
      status: 'active',
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        loginCount: 0,
      },
    };

    this.adminUsers.set(superAdmin.id, superAdmin);
  }

  private initializeQuickActions(): void {
    const actions: Array<Omit<QuickAction, 'id'>> = [
      {
        label: 'Create User',
        icon: 'user-plus',
        category: 'user',
        action: { type: 'modal', target: 'create-user' },
        permissions: [
          {
            id: '',
            category: 'users',
            action: 'create',
            enabled: true,
            metadata: { grantedAt: new Date() },
          },
        ],
        hotkey: 'Ctrl+Shift+U',
        enabled: true,
        usage: { count: 0 },
      },
      {
        label: 'View Orders',
        icon: 'shopping-cart',
        category: 'order',
        action: { type: 'navigate', target: '/admin/orders' },
        permissions: [
          {
            id: '',
            category: 'orders',
            action: 'view',
            enabled: true,
            metadata: { grantedAt: new Date() },
          },
        ],
        hotkey: 'Ctrl+Shift+O',
        enabled: true,
        usage: { count: 0 },
      },
      {
        label: 'Create Product',
        icon: 'package',
        category: 'product',
        action: { type: 'modal', target: 'create-product' },
        permissions: [
          {
            id: '',
            category: 'products',
            action: 'create',
            enabled: true,
            metadata: { grantedAt: new Date() },
          },
        ],
        hotkey: 'Ctrl+Shift+P',
        enabled: true,
        usage: { count: 0 },
      },
    ];

    actions.forEach((action) => {
      const qa: QuickAction = {
        id: `qa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...action,
      };
      this.quickActions.set(qa.id, qa);
    });
  }

  private startMetricsCollection(): void {
    this.metricsCollectionInterval = setInterval(() => {
      const metrics = this.getCurrentMetrics();
      this.metricsHistory.push(metrics);

      // Keep only last hour of metrics
      const oneHourAgo = Date.now() - 3600000;
      this.metricsHistory = this.metricsHistory.filter((m) => m.timestamp.getTime() > oneHourAgo);
    }, 60000); // Every minute
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // Query Methods
  // ============================================================================

  getAdminUser(userId: string): AdminUser | null {
    return this.adminUsers.get(userId) || null;
  }

  getAllAdminUsers(filters?: { role?: AdminRole; status?: AdminUser['status'] }): AdminUser[] {
    let users = Array.from(this.adminUsers.values());

    if (filters) {
      users = users.filter((user) => {
        if (filters.role && user.role !== filters.role) return false;
        if (filters.status && user.status !== filters.status) return false;
        return true;
      });
    }

    return users;
  }

  getDashboard(dashboardId: string): AdminDashboard | null {
    return this.dashboards.get(dashboardId) || null;
  }

  getUserDashboards(userId: string): AdminDashboard[] {
    return Array.from(this.dashboards.values()).filter(
      (d) => d.owner.userId === userId || d.sharing.sharedWith?.includes(userId)
    );
  }

  getQuickActions(userId: string): QuickAction[] {
    const user = this.adminUsers.get(userId);
    if (!user) return [];

    return Array.from(this.quickActions.values())
      .filter((action) => {
        if (!action.enabled) return false;

        // Check if user has required permissions
        return action.permissions.every((perm) =>
          this.hasPermission(userId, perm.category, perm.action)
        );
      })
      .sort((a, b) => b.usage.count - a.usage.count);
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const adminPanel = new AdminPanelSystem();
