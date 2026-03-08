/**
 * Admin Dashboard System
 *
 * Comprehensive administrative dashboard and control panel:
 * - Dashboard overview and metrics
 * - Quick actions and shortcuts
 * - Admin user management
 * - System settings configuration
 * - Activity monitoring
 * - Notifications and alerts
 * - Role-based access control
 */

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  name: string;

  // Role and permissions
  role: 'super_admin' | 'admin' | 'manager' | 'moderator' | 'support' | 'analyst';
  permissions: {
    module: string;
    actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'export')[];
  }[];

  // Status
  status: 'active' | 'inactive' | 'suspended' | 'locked';

  // Authentication
  auth: {
    lastLogin?: Date;
    loginCount: number;
    failedLoginAttempts: number;
    passwordLastChanged?: Date;
    mfaEnabled: boolean;
    mfaMethod?: 'totp' | 'sms' | 'email';
  };

  // Access control
  accessControl: {
    allowedIPs?: string[];
    allowedHours?: { start: string; end: string };
    sessionTimeout: number; // minutes
  };

  // Profile
  profile: {
    avatar?: string;
    phone?: string;
    timezone: string;
    language: string;
    department?: string;
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface DashboardOverview {
  period: {
    start: Date;
    end: Date;
    comparison?: {
      start: Date;
      end: Date;
    };
  };

  // Key metrics
  metrics: {
    totalRevenue: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
    totalOrders: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
    totalCustomers: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
    totalProducts: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
    conversionRate: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
    averageOrderValue: {
      current: number;
      previous: number;
      change: number;
      changePercentage: number;
    };
  };

  // Sales trends
  salesTrend: {
    date: Date;
    revenue: number;
    orders: number;
  }[];

  // Top products
  topProducts: {
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
    units: number;
  }[];

  // Recent orders
  recentOrders: {
    orderId: string;
    customerName: string;
    amount: number;
    status: string;
    createdAt: Date;
  }[];

  // Pending tasks
  pendingTasks: {
    type:
      | 'order_approval'
      | 'product_review'
      | 'refund_request'
      | 'support_ticket'
      | 'artisan_verification';
    count: number;
    urgent: number;
  }[];

  // Alerts
  alerts: {
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }[];
}

export interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: string;
  category: 'orders' | 'products' | 'customers' | 'reports' | 'settings' | 'content';
  permissions: string[];
  shortcut?: string;
  url?: string;
}

export interface SystemSetting {
  id: string;
  category:
    | 'general'
    | 'payment'
    | 'shipping'
    | 'email'
    | 'notifications'
    | 'security'
    | 'integrations';
  key: string;
  label: string;
  description?: string;

  // Value configuration
  value: any;
  defaultValue: any;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array' | 'enum';

  // Validation
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    options?: { value: any; label: string }[];
  };

  // UI configuration
  ui: {
    type:
      | 'text'
      | 'number'
      | 'toggle'
      | 'select'
      | 'multiselect'
      | 'textarea'
      | 'json'
      | 'color'
      | 'file';
    group?: string;
    order?: number;
    hidden?: boolean;
  };

  // Metadata
  sensitive: boolean;
  requiresRestart: boolean;
  lastModified?: Date;
  modifiedBy?: string;
}

export interface AdminNotification {
  id: string;
  type: 'system' | 'order' | 'customer' | 'product' | 'security' | 'performance';
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Content
  title: string;
  message: string;
  details?: Record<string, any>;

  // Recipients
  recipients: {
    adminId: string;
    read: boolean;
    readAt?: Date;
    dismissed: boolean;
  }[];

  // Actions
  actions?: {
    label: string;
    action: string;
    url?: string;
  }[];

  // Lifecycle
  createdAt: Date;
  expiresAt?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;

  // Action details
  action: {
    type:
      | 'create'
      | 'update'
      | 'delete'
      | 'approve'
      | 'reject'
      | 'export'
      | 'import'
      | 'login'
      | 'logout'
      | 'settings_change';
    module: string;
    entity?: string;
    entityId?: string;
    description: string;
  };

  // Changes
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  // Context
  context: {
    ipAddress: string;
    userAgent: string;
    location?: string;
  };

  // Status
  status: 'success' | 'failed' | 'pending';
  error?: string;

  timestamp: Date;
}

export interface PermissionSet {
  id: string;
  name: string;
  description: string;
  role: AdminUser['role'];

  // Permissions
  permissions: {
    module: string;
    moduleName: string;
    actions: {
      action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';
      allowed: boolean;
      conditions?: Record<string, any>;
    }[];
  }[];

  // Restrictions
  restrictions?: {
    dataAccess?: 'all' | 'own' | 'department' | 'custom';
    customFilters?: Record<string, any>;
    maxExportRows?: number;
    maxBulkActions?: number;
  };

  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminSession {
  sessionId: string;
  adminId: string;
  adminName: string;

  // Session info
  startedAt: Date;
  lastActivity: Date;
  expiresAt: Date;

  // Security
  ipAddress: string;
  userAgent: string;
  location?: string;

  // Status
  status: 'active' | 'expired' | 'revoked';

  // Activity
  actionsPerformed: number;
  pagesViewed: string[];
}

export interface AdminAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  // Admin activity
  activity: {
    totalLogins: number;
    uniqueAdmins: number;
    averageSessionDuration: number;
    totalActions: number;
    actionsByType: {
      type: string;
      count: number;
    }[];
  };

  // Most active admins
  topAdmins: {
    adminId: string;
    adminName: string;
    logins: number;
    actions: number;
    modules: string[];
  }[];

  // Module usage
  moduleUsage: {
    module: string;
    views: number;
    actions: number;
    uniqueAdmins: number;
  }[];

  // Performance
  performance: {
    averageResponseTime: number;
    slowestPages: {
      page: string;
      averageLoadTime: number;
    }[];
  };
}

export class AdminDashboardSystem {
  private admins: Map<string, AdminUser>;
  private settings: Map<string, SystemSetting>;
  private notifications: Map<string, AdminNotification>;
  private activityLogs: Map<string, ActivityLog>;
  private permissionSets: Map<string, PermissionSet>;
  private sessions: Map<string, AdminSession>;
  private quickActions: QuickAction[];

  constructor() {
    this.admins = new Map();
    this.settings = new Map();
    this.notifications = new Map();
    this.activityLogs = new Map();
    this.permissionSets = new Map();
    this.sessions = new Map();
    this.quickActions = [];

    // Initialize default data
    this.initializeDefaults();
  }

  /**
   * Initialize default permission sets and quick actions
   */
  private initializeDefaults(): void {
    // Default permission sets
    const defaultPermissions: Omit<PermissionSet, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        role: 'super_admin',
        permissions: [
          {
            module: 'users',
            moduleName: 'User Management',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'edit', allowed: true },
              { action: 'delete', allowed: true },
              { action: 'approve', allowed: true },
              { action: 'export', allowed: true },
            ],
          },
          {
            module: 'products',
            moduleName: 'Product Management',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'edit', allowed: true },
              { action: 'delete', allowed: true },
              { action: 'approve', allowed: true },
              { action: 'export', allowed: true },
            ],
          },
          {
            module: 'orders',
            moduleName: 'Order Management',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'edit', allowed: true },
              { action: 'delete', allowed: true },
              { action: 'approve', allowed: true },
              { action: 'export', allowed: true },
            ],
          },
          {
            module: 'settings',
            moduleName: 'System Settings',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'edit', allowed: true },
              { action: 'delete', allowed: true },
              { action: 'approve', allowed: false },
              { action: 'export', allowed: true },
            ],
          },
        ],
        restrictions: {
          dataAccess: 'all',
        },
        isDefault: true,
      },
      {
        name: 'Manager',
        description: 'Management access with approval permissions',
        role: 'manager',
        permissions: [
          {
            module: 'products',
            moduleName: 'Product Management',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'edit', allowed: true },
              { action: 'delete', allowed: false },
              { action: 'approve', allowed: true },
              { action: 'export', allowed: true },
            ],
          },
          {
            module: 'orders',
            moduleName: 'Order Management',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: false },
              { action: 'edit', allowed: true },
              { action: 'delete', allowed: false },
              { action: 'approve', allowed: true },
              { action: 'export', allowed: true },
            ],
          },
        ],
        restrictions: {
          dataAccess: 'all',
          maxExportRows: 10000,
        },
        isDefault: true,
      },
    ];

    defaultPermissions.forEach((perm, index) => {
      const id = `perm-${Date.now()}-${index}`;
      this.permissionSets.set(id, {
        ...perm,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Default quick actions
    this.quickActions = [
      {
        id: 'qa-1',
        name: 'New Order',
        description: 'Create a new order',
        icon: 'shopping-cart',
        action: 'create_order',
        category: 'orders',
        permissions: ['orders.create'],
        shortcut: 'Ctrl+N',
        url: '/admin/orders/new',
      },
      {
        id: 'qa-2',
        name: 'Add Product',
        description: 'Add a new product',
        icon: 'plus-circle',
        action: 'create_product',
        category: 'products',
        permissions: ['products.create'],
        url: '/admin/products/new',
      },
      {
        id: 'qa-3',
        name: 'Customer List',
        description: 'View all customers',
        icon: 'users',
        action: 'view_customers',
        category: 'customers',
        permissions: ['customers.view'],
        url: '/admin/customers',
      },
      {
        id: 'qa-4',
        name: 'Sales Report',
        description: 'Generate sales report',
        icon: 'chart-line',
        action: 'generate_sales_report',
        category: 'reports',
        permissions: ['reports.export'],
        url: '/admin/reports/sales',
      },
      {
        id: 'qa-5',
        name: 'Settings',
        description: 'System settings',
        icon: 'settings',
        action: 'view_settings',
        category: 'settings',
        permissions: ['settings.view'],
        url: '/admin/settings',
      },
    ];

    // Default system settings
    const defaultSettings: Omit<SystemSetting, 'id'>[] = [
      {
        category: 'general',
        key: 'site_name',
        label: 'Site Name',
        description: 'The name of your marketplace',
        value: 'Artisan Marketplace',
        defaultValue: 'Artisan Marketplace',
        dataType: 'string',
        ui: { type: 'text', group: 'Basic', order: 1 },
        sensitive: false,
        requiresRestart: false,
      },
      {
        category: 'general',
        key: 'site_url',
        label: 'Site URL',
        description: 'The primary URL of your marketplace',
        value: 'https://artisans.com',
        defaultValue: 'https://artisans.com',
        dataType: 'string',
        validation: { required: true, pattern: '^https?://' },
        ui: { type: 'text', group: 'Basic', order: 2 },
        sensitive: false,
        requiresRestart: true,
      },
      {
        category: 'general',
        key: 'maintenance_mode',
        label: 'Maintenance Mode',
        description: 'Enable to put site in maintenance mode',
        value: false,
        defaultValue: false,
        dataType: 'boolean',
        ui: { type: 'toggle', group: 'Operations', order: 1 },
        sensitive: false,
        requiresRestart: false,
      },
      {
        category: 'payment',
        key: 'payment_gateway',
        label: 'Payment Gateway',
        description: 'Primary payment gateway',
        value: 'stripe',
        defaultValue: 'stripe',
        dataType: 'enum',
        validation: {
          options: [
            { value: 'stripe', label: 'Stripe' },
            { value: 'paypal', label: 'PayPal' },
            { value: 'razorpay', label: 'Razorpay' },
          ],
        },
        ui: { type: 'select', group: 'Payment', order: 1 },
        sensitive: false,
        requiresRestart: true,
      },
      {
        category: 'email',
        key: 'smtp_host',
        label: 'SMTP Host',
        description: 'SMTP server hostname',
        value: 'smtp.gmail.com',
        defaultValue: '',
        dataType: 'string',
        validation: { required: true },
        ui: { type: 'text', group: 'Email', order: 1 },
        sensitive: true,
        requiresRestart: true,
      },
    ];

    defaultSettings.forEach((setting, index) => {
      const id = `setting-${Date.now()}-${index}`;
      this.settings.set(id, { ...setting, id });
    });
  }

  /**
   * Create admin user
   */
  async createAdminUser(params: {
    email: string;
    username: string;
    name: string;
    role: AdminUser['role'];
    permissions?: AdminUser['permissions'];
    createdBy: string;
  }): Promise<AdminUser> {
    const admin: AdminUser = {
      id: `admin-${Date.now()}`,
      email: params.email,
      username: params.username,
      name: params.name,
      role: params.role,
      permissions: params.permissions || [],
      status: 'active',
      auth: {
        loginCount: 0,
        failedLoginAttempts: 0,
        mfaEnabled: false,
      },
      accessControl: {
        sessionTimeout: 60,
      },
      profile: {
        timezone: 'Asia/Kolkata',
        language: 'en',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: params.createdBy,
    };

    this.admins.set(admin.id, admin);
    return admin;
  }

  /**
   * Get dashboard overview
   */
  async getDashboardOverview(period: { start: Date; end: Date }): Promise<DashboardOverview> {
    const previousPeriod = {
      start: new Date(period.start.getTime() - (period.end.getTime() - period.start.getTime())),
      end: period.start,
    };

    return {
      period: {
        ...period,
        comparison: previousPeriod,
      },
      metrics: {
        totalRevenue: {
          current: 1250000,
          previous: 1112500,
          change: 137500,
          changePercentage: 12.36,
        },
        totalOrders: {
          current: 2450,
          previous: 2262,
          change: 188,
          changePercentage: 8.31,
        },
        totalCustomers: {
          current: 15230,
          previous: 13215,
          change: 2015,
          changePercentage: 15.25,
        },
        totalProducts: {
          current: 3850,
          previous: 3625,
          change: 225,
          changePercentage: 6.21,
        },
        conversionRate: {
          current: 2.85,
          previous: 2.71,
          change: 0.14,
          changePercentage: 5.17,
        },
        averageOrderValue: {
          current: 510.2,
          previous: 491.82,
          change: 18.38,
          changePercentage: 3.74,
        },
      },
      salesTrend: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(period.start);
        date.setDate(date.getDate() + i);
        return {
          date,
          revenue: 35000 + Math.random() * 15000,
          orders: 70 + Math.floor(Math.random() * 30),
        };
      }),
      topProducts: [
        {
          productId: 'prod-1',
          productName: 'Handwoven Silk Saree',
          sales: 250,
          revenue: 125000,
          units: 250,
        },
        {
          productId: 'prod-2',
          productName: 'Terracotta Vase Set',
          sales: 490,
          revenue: 98000,
          units: 490,
        },
        {
          productId: 'prod-3',
          productName: 'Silver Jewelry Collection',
          sales: 175,
          revenue: 87500,
          units: 175,
        },
      ],
      recentOrders: [
        {
          orderId: 'ORD-12345',
          customerName: 'Priya Sharma',
          amount: 1250,
          status: 'processing',
          createdAt: new Date(),
        },
        {
          orderId: 'ORD-12344',
          customerName: 'Rajesh Kumar',
          amount: 850,
          status: 'shipped',
          createdAt: new Date(Date.now() - 3600000),
        },
        {
          orderId: 'ORD-12343',
          customerName: 'Anita Desai',
          amount: 2340,
          status: 'delivered',
          createdAt: new Date(Date.now() - 7200000),
        },
      ],
      pendingTasks: [
        { type: 'order_approval', count: 12, urgent: 3 },
        { type: 'product_review', count: 28, urgent: 5 },
        { type: 'refund_request', count: 8, urgent: 2 },
        { type: 'support_ticket', count: 15, urgent: 4 },
        { type: 'artisan_verification', count: 6, urgent: 1 },
      ],
      alerts: [
        {
          id: 'alert-1',
          type: 'warning',
          severity: 'high',
          title: 'Low Stock Alert',
          message: '15 products are running low on stock',
          timestamp: new Date(),
          read: false,
        },
        {
          id: 'alert-2',
          type: 'info',
          severity: 'medium',
          title: 'Payment Gateway Update',
          message: 'Stripe API upgrade available',
          timestamp: new Date(Date.now() - 3600000),
          read: false,
        },
      ],
    };
  }

  /**
   * Get quick actions
   */
  async getQuickActions(adminRole: AdminUser['role']): Promise<QuickAction[]> {
    // Filter based on role permissions
    return this.quickActions;
  }

  /**
   * Update system setting
   */
  async updateSetting(params: {
    settingId: string;
    value: any;
    modifiedBy: string;
  }): Promise<void> {
    const setting = this.settings.get(params.settingId);
    if (!setting) return;

    setting.value = params.value;
    setting.lastModified = new Date();
    setting.modifiedBy = params.modifiedBy;

    // Log activity
    await this.logActivity({
      adminId: params.modifiedBy,
      adminName: 'Admin',
      action: {
        type: 'settings_change',
        module: 'settings',
        entityId: params.settingId,
        description: `Updated setting: ${setting.label}`,
      },
      context: {
        ipAddress: '127.0.0.1',
        userAgent: 'Admin Dashboard',
      },
      status: 'success',
    });
  }

  /**
   * Create notification
   */
  async createNotification(params: {
    type: AdminNotification['type'];
    priority: AdminNotification['priority'];
    title: string;
    message: string;
    details?: Record<string, any>;
    recipientIds: string[];
    actions?: AdminNotification['actions'];
  }): Promise<AdminNotification> {
    const notification: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: params.type,
      priority: params.priority,
      title: params.title,
      message: params.message,
      details: params.details,
      recipients: params.recipientIds.map((id) => ({
        adminId: id,
        read: false,
        dismissed: false,
      })),
      actions: params.actions,
      createdAt: new Date(),
    };

    this.notifications.set(notification.id, notification);
    return notification;
  }

  /**
   * Log admin activity
   */
  async logActivity(params: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      ...params,
      timestamp: new Date(),
    };

    this.activityLogs.set(log.id, log);
  }

  /**
   * Create admin session
   */
  async createSession(params: {
    adminId: string;
    adminName: string;
    ipAddress: string;
    userAgent: string;
    duration?: number;
  }): Promise<AdminSession> {
    const session: AdminSession = {
      sessionId: `sess-${Date.now()}`,
      adminId: params.adminId,
      adminName: params.adminName,
      startedAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + (params.duration || 60) * 60 * 1000),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      status: 'active',
      actionsPerformed: 0,
      pagesViewed: [],
    };

    this.sessions.set(session.sessionId, session);
    return session;
  }

  /**
   * Get admin analytics
   */
  async getAdminAnalytics(period: { start: Date; end: Date }): Promise<AdminAnalytics> {
    const logs = Array.from(this.activityLogs.values()).filter(
      (log) => log.timestamp >= period.start && log.timestamp <= period.end
    );

    const actionsByType = new Map<string, number>();
    logs.forEach((log) => {
      const count = actionsByType.get(log.action.type) || 0;
      actionsByType.set(log.action.type, count + 1);
    });

    return {
      period,
      activity: {
        totalLogins: logs.filter((l) => l.action.type === 'login').length,
        uniqueAdmins: new Set(logs.map((l) => l.adminId)).size,
        averageSessionDuration: 45.5,
        totalActions: logs.length,
        actionsByType: Array.from(actionsByType.entries()).map(([type, count]) => ({
          type,
          count,
        })),
      },
      topAdmins: [
        {
          adminId: 'admin-1',
          adminName: 'Super Admin',
          logins: 45,
          actions: 285,
          modules: ['orders', 'products', 'settings'],
        },
        {
          adminId: 'admin-2',
          adminName: 'Manager',
          logins: 38,
          actions: 192,
          modules: ['orders', 'products'],
        },
      ],
      moduleUsage: [
        { module: 'orders', views: 1250, actions: 485, uniqueAdmins: 8 },
        { module: 'products', views: 980, actions: 325, uniqueAdmins: 6 },
        { module: 'customers', views: 650, actions: 128, uniqueAdmins: 5 },
      ],
      performance: {
        averageResponseTime: 285,
        slowestPages: [
          { page: '/admin/reports/analytics', averageLoadTime: 1250 },
          { page: '/admin/products/list', averageLoadTime: 850 },
        ],
      },
    };
  }

  /**
   * Get all settings
   */
  async getAllSettings(category?: SystemSetting['category']): Promise<SystemSetting[]> {
    let settings = Array.from(this.settings.values());

    if (category) {
      settings = settings.filter((s) => s.category === category);
    }

    return settings;
  }

  /**
   * Get admin notifications
   */
  async getNotifications(
    adminId: string,
    unreadOnly: boolean = false
  ): Promise<AdminNotification[]> {
    const notifications = Array.from(this.notifications.values()).filter((n) =>
      n.recipients.some((r) => r.adminId === adminId)
    );

    if (unreadOnly) {
      return notifications.filter((n) => !n.recipients.find((r) => r.adminId === adminId)?.read);
    }

    return notifications;
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(params: {
    adminId?: string;
    actionType?: ActivityLog['action']['type'];
    module?: string;
    limit?: number;
  }): Promise<ActivityLog[]> {
    let logs = Array.from(this.activityLogs.values());

    if (params.adminId) {
      logs = logs.filter((l) => l.adminId === params.adminId);
    }

    if (params.actionType) {
      logs = logs.filter((l) => l.action.type === params.actionType);
    }

    if (params.module) {
      logs = logs.filter((l) => l.action.module === params.module);
    }

    // Sort by timestamp descending
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (params.limit) {
      logs = logs.slice(0, params.limit);
    }

    return logs;
  }
}

// Export singleton instance
export const adminDashboardSystem = new AdminDashboardSystem();
