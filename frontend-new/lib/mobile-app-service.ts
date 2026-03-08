/**
 * Mobile App Service
 *
 * Comprehensive mobile app backend service supporting:
 * - Native iOS and Android apps
 * - React Native / Flutter integration
 * - Push notifications
 * - Offline mode and sync
 * - Mobile-specific features
 */

export interface MobileDevice {
  id: string;
  userId: string;
  deviceType: 'ios' | 'android';
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  pushToken?: string;
  biometricEnabled: boolean;
  lastActive: Date;
  settings: {
    notificationsEnabled: boolean;
    locationServicesEnabled: boolean;
    cameraPermission: boolean;
    storagePermission: boolean;
  };
}

export interface PushNotification {
  id: string;
  userId: string;
  deviceIds: string[];
  type: 'order_update' | 'promotion' | 'message' | 'reminder' | 'alert' | 'social';
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'high' | 'normal' | 'low';
  scheduledFor?: Date;
  sentAt?: Date;
  delivered: number;
  opened: number;
  status: 'scheduled' | 'sent' | 'failed';
}

export interface OfflineAction {
  id: string;
  userId: string;
  deviceId: string;
  actionType: 'add_to_cart' | 'favorite' | 'review' | 'update_profile' | 'place_order';
  data: any;
  timestamp: Date;
  synced: boolean;
  syncedAt?: Date;
  retryCount: number;
}

export interface MobileSession {
  id: string;
  userId: string;
  deviceId: string;
  sessionToken: string;
  startTime: Date;
  lastActivity: Date;
  duration: number; // in seconds
  screens: {
    screen: string;
    timestamp: Date;
    duration: number;
  }[];
  events: {
    event: string;
    timestamp: Date;
    data?: any;
  }[];
}

export interface AppUpdate {
  id: string;
  version: string;
  platform: 'ios' | 'android' | 'both';
  releaseDate: Date;
  required: boolean;
  features: string[];
  bugFixes: string[];
  downloadUrl: string;
  releaseNotes: string;
}

export interface DeepLink {
  id: string;
  shortUrl: string;
  fullUrl: string;
  targetScreen: string;
  parameters: Record<string, string>;
  campaign?: string;
  createdAt: Date;
  clicks: number;
  conversions: number;
}

export class MobileAppService {
  private devices: Map<string, MobileDevice> = new Map();
  private notifications: Map<string, PushNotification> = new Map();
  private offlineActions: Map<string, OfflineAction> = new Map();
  private sessions: Map<string, MobileSession> = new Map();
  private updates: Map<string, AppUpdate> = new Map();
  private deepLinks: Map<string, DeepLink> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Register a mobile device
   */
  async registerDevice(data: {
    userId: string;
    deviceType: 'ios' | 'android';
    deviceModel: string;
    osVersion: string;
    appVersion: string;
    pushToken?: string;
  }): Promise<MobileDevice> {
    const device: MobileDevice = {
      id: `device-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      ...data,
      biometricEnabled: false,
      lastActive: new Date(),
      settings: {
        notificationsEnabled: true,
        locationServicesEnabled: false,
        cameraPermission: false,
        storagePermission: false,
      },
    };

    this.devices.set(device.id, device);
    return device;
  }

  /**
   * Update device settings
   */
  async updateDeviceSettings(
    deviceId: string,
    settings: Partial<MobileDevice['settings']>
  ): Promise<MobileDevice> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    device.settings = { ...device.settings, ...settings };
    device.lastActive = new Date();
    this.devices.set(deviceId, device);

    return device;
  }

  /**
   * Send push notification
   */
  async sendPushNotification(data: {
    userId: string;
    type: PushNotification['type'];
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: PushNotification['priority'];
    scheduledFor?: Date;
  }): Promise<PushNotification> {
    // Get all user's devices with push tokens
    const userDevices = Array.from(this.devices.values()).filter(
      (d) => d.userId === data.userId && d.pushToken && d.settings.notificationsEnabled
    );

    const notification: PushNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceIds: userDevices.map((d) => d.id),
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
      priority: data.priority || 'normal',
      scheduledFor: data.scheduledFor,
      status: data.scheduledFor ? 'scheduled' : 'sent',
      sentAt: data.scheduledFor ? undefined : new Date(),
      delivered: 0,
      opened: 0,
    };

    this.notifications.set(notification.id, notification);

    // Simulate delivery
    if (!data.scheduledFor) {
      setTimeout(() => {
        notification.delivered = userDevices.length;
        this.notifications.set(notification.id, notification);
      }, 100);
    }

    return notification;
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(data: {
    userIds: string[];
    type: PushNotification['type'];
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: PushNotification['priority'];
  }): Promise<PushNotification[]> {
    const notifications = await Promise.all(
      data.userIds.map((userId) =>
        this.sendPushNotification({
          userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data,
          priority: data.priority,
        })
      )
    );

    return notifications;
  }

  /**
   * Track notification interaction
   */
  async trackNotificationInteraction(
    notificationId: string,
    action: 'delivered' | 'opened'
  ): Promise<void> {
    const notification = this.notifications.get(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (action === 'delivered') {
      notification.delivered++;
    } else if (action === 'opened') {
      notification.opened++;
    }

    this.notifications.set(notificationId, notification);
  }

  /**
   * Queue offline action for sync
   */
  async queueOfflineAction(data: {
    userId: string;
    deviceId: string;
    actionType: OfflineAction['actionType'];
    data: any;
  }): Promise<OfflineAction> {
    const action: OfflineAction = {
      id: `action-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      actionType: data.actionType,
      data: data.data,
      timestamp: new Date(),
      synced: false,
      retryCount: 0,
    };

    this.offlineActions.set(action.id, action);
    return action;
  }

  /**
   * Sync offline actions
   */
  async syncOfflineActions(deviceId: string): Promise<{
    synced: number;
    failed: number;
    actions: OfflineAction[];
  }> {
    const deviceActions = Array.from(this.offlineActions.values()).filter(
      (a) => a.deviceId === deviceId && !a.synced
    );

    let synced = 0;
    let failed = 0;

    for (const action of deviceActions) {
      try {
        // Simulate sync operation
        await this.processOfflineAction(action);
        action.synced = true;
        action.syncedAt = new Date();
        this.offlineActions.set(action.id, action);
        synced++;
      } catch (error) {
        action.retryCount++;
        this.offlineActions.set(action.id, action);
        failed++;
      }
    }

    return {
      synced,
      failed,
      actions: deviceActions,
    };
  }

  /**
   * Process offline action
   */
  private async processOfflineAction(action: OfflineAction): Promise<void> {
    // Simulate processing based on action type
    switch (action.actionType) {
      case 'add_to_cart':
      case 'favorite':
      case 'review':
      case 'update_profile':
      case 'place_order':
        // Would integrate with respective services
        break;
    }
  }

  /**
   * Start mobile session
   */
  async startSession(userId: string, deviceId: string): Promise<MobileSession> {
    const session: MobileSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      deviceId,
      sessionToken: `token-${Math.random().toString(36).substring(2)}`,
      startTime: new Date(),
      lastActivity: new Date(),
      duration: 0,
      screens: [],
      events: [],
    };

    this.sessions.set(session.id, session);

    // Update device last active
    const device = this.devices.get(deviceId);
    if (device) {
      device.lastActive = new Date();
      this.devices.set(deviceId, device);
    }

    return session;
  }

  /**
   * Track screen view
   */
  async trackScreenView(sessionId: string, screen: string, duration?: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.screens.push({
      screen,
      timestamp: new Date(),
      duration: duration || 0,
    });

    session.lastActivity = new Date();
    session.duration = Math.floor(
      (session.lastActivity.getTime() - session.startTime.getTime()) / 1000
    );

    this.sessions.set(sessionId, session);
  }

  /**
   * Track event
   */
  async trackEvent(sessionId: string, event: string, data?: any): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.events.push({
      event,
      timestamp: new Date(),
      data,
    });

    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);
  }

  /**
   * End session
   */
  async endSession(sessionId: string): Promise<MobileSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.lastActivity = new Date();
    session.duration = Math.floor(
      (session.lastActivity.getTime() - session.startTime.getTime()) / 1000
    );

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Create app update
   */
  async createAppUpdate(data: {
    version: string;
    platform: AppUpdate['platform'];
    required: boolean;
    features: string[];
    bugFixes: string[];
    downloadUrl: string;
    releaseNotes: string;
  }): Promise<AppUpdate> {
    const update: AppUpdate = {
      id: `update-${Date.now()}`,
      ...data,
      releaseDate: new Date(),
    };

    this.updates.set(update.id, update);
    return update;
  }

  /**
   * Check for updates
   */
  async checkForUpdates(
    platform: 'ios' | 'android',
    currentVersion: string
  ): Promise<AppUpdate | null> {
    const updates = Array.from(this.updates.values())
      .filter(
        (u) =>
          (u.platform === platform || u.platform === 'both') &&
          this.isNewerVersion(u.version, currentVersion)
      )
      .sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());

    return updates[0] || null;
  }

  /**
   * Create deep link
   */
  async createDeepLink(data: {
    targetScreen: string;
    parameters: Record<string, string>;
    campaign?: string;
  }): Promise<DeepLink> {
    const shortCode = Math.random().toString(36).substring(2, 8);
    const deepLink: DeepLink = {
      id: `link-${Date.now()}`,
      shortUrl: `https://artisan.app/${shortCode}`,
      fullUrl: this.buildFullUrl(data.targetScreen, data.parameters),
      targetScreen: data.targetScreen,
      parameters: data.parameters,
      campaign: data.campaign,
      createdAt: new Date(),
      clicks: 0,
      conversions: 0,
    };

    this.deepLinks.set(deepLink.id, deepLink);
    return deepLink;
  }

  /**
   * Track deep link click
   */
  async trackDeepLinkClick(shortUrl: string): Promise<DeepLink | null> {
    const deepLink = Array.from(this.deepLinks.values()).find((dl) => dl.shortUrl === shortUrl);

    if (deepLink) {
      deepLink.clicks++;
      this.deepLinks.set(deepLink.id, deepLink);
    }

    return deepLink || null;
  }

  /**
   * Get mobile analytics
   */
  async getAnalytics(period: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalDevices: number;
    activeDevices: number;
    devicesByPlatform: Record<string, number>;
    notificationsSent: number;
    notificationOpenRate: number;
    averageSessionDuration: number;
    topScreens: { screen: string; views: number }[];
    offlineActionsPending: number;
    deepLinkClicks: number;
  }> {
    const now = new Date();
    const periodMs = period === 'day' ? 86400000 : period === 'week' ? 604800000 : 2592000000;
    const cutoff = new Date(now.getTime() - periodMs);

    const activeDevices = Array.from(this.devices.values()).filter((d) => d.lastActive >= cutoff);

    const devicesByPlatform = activeDevices.reduce(
      (acc, d) => {
        acc[d.deviceType] = (acc[d.deviceType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const recentNotifications = Array.from(this.notifications.values()).filter(
      (n) => n.sentAt && n.sentAt >= cutoff
    );

    const totalDelivered = recentNotifications.reduce((sum, n) => sum + n.delivered, 0);
    const totalOpened = recentNotifications.reduce((sum, n) => sum + n.opened, 0);

    const recentSessions = Array.from(this.sessions.values()).filter((s) => s.startTime >= cutoff);

    const avgSessionDuration =
      recentSessions.length > 0
        ? recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length
        : 0;

    const screenCounts = new Map<string, number>();
    recentSessions.forEach((session) => {
      session.screens.forEach((screen) => {
        screenCounts.set(screen.screen, (screenCounts.get(screen.screen) || 0) + 1);
      });
    });

    const topScreens = Array.from(screenCounts.entries())
      .map(([screen, views]) => ({ screen, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const pendingActions = Array.from(this.offlineActions.values()).filter((a) => !a.synced).length;

    const deepLinkClicks = Array.from(this.deepLinks.values()).reduce(
      (sum, dl) => sum + dl.clicks,
      0
    );

    return {
      totalDevices: this.devices.size,
      activeDevices: activeDevices.length,
      devicesByPlatform,
      notificationsSent: recentNotifications.length,
      notificationOpenRate: totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0,
      averageSessionDuration: Math.round(avgSessionDuration),
      topScreens,
      offlineActionsPending: pendingActions,
      deepLinkClicks,
    };
  }

  /**
   * Helper: Compare version strings
   */
  private isNewerVersion(newVer: string, currentVer: string): boolean {
    const newParts = newVer.split('.').map(Number);
    const currentParts = currentVer.split('.').map(Number);

    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (newPart > currentPart) return true;
      if (newPart < currentPart) return false;
    }

    return false;
  }

  /**
   * Helper: Build full URL from parameters
   */
  private buildFullUrl(screen: string, params: Record<string, string>): string {
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return `artisan://app/${screen}${paramString ? '?' + paramString : ''}`;
  }

  /**
   * Initialize default data
   */
  private initializeDefaultData(): void {
    // Sample devices
    this.registerDevice({
      userId: 'user-1',
      deviceType: 'ios',
      deviceModel: 'iPhone 14 Pro',
      osVersion: '17.0',
      appVersion: '2.1.0',
      pushToken: 'push-token-ios-1',
    });

    this.registerDevice({
      userId: 'user-2',
      deviceType: 'android',
      deviceModel: 'Samsung Galaxy S23',
      osVersion: '14',
      appVersion: '2.1.0',
      pushToken: 'push-token-android-1',
    });

    // Sample app update
    this.createAppUpdate({
      version: '2.2.0',
      platform: 'both',
      required: false,
      features: [
        'New voice commerce features',
        'Improved AR product visualization',
        'Enhanced offline mode',
      ],
      bugFixes: ['Fixed crash on product search', 'Improved performance'],
      downloadUrl: 'https://artisan.app/download/2.2.0',
      releaseNotes: 'Major feature update with voice commerce and AR improvements',
    });
  }
}

// Singleton instance
export const mobileAppService = new MobileAppService();
