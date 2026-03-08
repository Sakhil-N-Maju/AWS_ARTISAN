/**
 * App Performance Monitoring Service
 *
 * Comprehensive mobile app performance monitoring:
 * - Crash reporting and error tracking
 * - Performance metrics (load times, FPS, memory)
 * - Network monitoring
 * - Battery usage tracking
 * - App vitals and health scores
 */

export interface CrashReport {
  id: string;
  userId?: string;
  deviceId: string;
  appVersion: string;
  osVersion: string;
  deviceModel: string;
  timestamp: Date;
  type: 'crash' | 'anr' | 'exception';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  stackTrace: string;
  breadcrumbs: {
    timestamp: Date;
    category: string;
    message: string;
    data?: any;
  }[];
  deviceState: {
    batteryLevel?: number;
    availableMemory?: number;
    networkType?: string;
    orientation?: string;
  };
  resolved: boolean;
  resolvedAt?: Date;
}

export interface PerformanceMetric {
  id: string;
  userId?: string;
  deviceId: string;
  metricType: 'app_start' | 'screen_load' | 'network_request' | 'render' | 'animation';
  name: string;
  duration: number; // in milliseconds
  timestamp: Date;
  details?: {
    screen?: string;
    endpoint?: string;
    size?: number;
    fps?: number;
  };
}

export interface NetworkMetric {
  id: string;
  userId?: string;
  deviceId: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  statusCode?: number;
  requestSize: number;
  responseSize: number;
  duration: number; // in milliseconds
  timestamp: Date;
  networkType: 'wifi' | '4g' | '5g' | '3g' | 'offline';
  success: boolean;
  error?: string;
}

export interface BatteryMetric {
  id: string;
  userId?: string;
  deviceId: string;
  batteryLevel: number; // 0-100
  isCharging: boolean;
  timestamp: Date;
  appUsage: {
    cpuUsage: number; // percentage
    memoryUsage: number; // MB
    networkUsage: number; // KB
  };
}

export interface MemoryMetric {
  id: string;
  deviceId: string;
  timestamp: Date;
  used: number; // MB
  available: number; // MB
  total: number; // MB
  threshold: number; // MB
  warningTriggered: boolean;
}

export interface AppVital {
  id: string;
  timestamp: Date;
  metrics: {
    crashFreeRate: number; // percentage
    averageStartTime: number; // milliseconds
    averageScreenLoad: number; // milliseconds
    averageNetworkLatency: number; // milliseconds
    memoryUtilization: number; // percentage
    batteryImpact: 'low' | 'medium' | 'high';
    networkFailureRate: number; // percentage
  };
  healthScore: number; // 0-100
  issues: string[];
}

export class AppPerformanceMonitoringService {
  private crashReports: Map<string, CrashReport> = new Map();
  private performanceMetrics: Map<string, PerformanceMetric> = new Map();
  private networkMetrics: Map<string, NetworkMetric> = new Map();
  private batteryMetrics: Map<string, BatteryMetric> = new Map();
  private memoryMetrics: Map<string, MemoryMetric> = new Map();
  private appVitals: Map<string, AppVital> = new Map();

  /**
   * Report a crash
   */
  async reportCrash(data: {
    userId?: string;
    deviceId: string;
    appVersion: string;
    osVersion: string;
    deviceModel: string;
    type: CrashReport['type'];
    severity: CrashReport['severity'];
    message: string;
    stackTrace: string;
    breadcrumbs?: CrashReport['breadcrumbs'];
    deviceState?: CrashReport['deviceState'];
  }): Promise<CrashReport> {
    const crash: CrashReport = {
      id: `crash-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      appVersion: data.appVersion,
      osVersion: data.osVersion,
      deviceModel: data.deviceModel,
      timestamp: new Date(),
      type: data.type,
      severity: data.severity,
      message: data.message,
      stackTrace: data.stackTrace,
      breadcrumbs: data.breadcrumbs || [],
      deviceState: data.deviceState || {},
      resolved: false,
    };

    this.crashReports.set(crash.id, crash);

    // Auto-group similar crashes
    await this.groupSimilarCrashes(crash);

    return crash;
  }

  /**
   * Resolve crash
   */
  async resolveCrash(crashId: string): Promise<void> {
    const crash = this.crashReports.get(crashId);
    if (crash) {
      crash.resolved = true;
      crash.resolvedAt = new Date();
      this.crashReports.set(crashId, crash);
    }
  }

  /**
   * Get crash reports
   */
  async getCrashReports(filters?: {
    resolved?: boolean;
    severity?: CrashReport['severity'];
    appVersion?: string;
    limit?: number;
  }): Promise<CrashReport[]> {
    let reports = Array.from(this.crashReports.values());

    if (filters) {
      if (filters.resolved !== undefined) {
        reports = reports.filter((r) => r.resolved === filters.resolved);
      }
      if (filters.severity) {
        reports = reports.filter((r) => r.severity === filters.severity);
      }
      if (filters.appVersion) {
        reports = reports.filter((r) => r.appVersion === filters.appVersion);
      }
    }

    reports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      reports = reports.slice(0, filters.limit);
    }

    return reports;
  }

  /**
   * Track performance metric
   */
  async trackPerformance(data: {
    userId?: string;
    deviceId: string;
    metricType: PerformanceMetric['metricType'];
    name: string;
    duration: number;
    details?: PerformanceMetric['details'];
  }): Promise<PerformanceMetric> {
    const metric: PerformanceMetric = {
      id: `perf-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      metricType: data.metricType,
      name: data.name,
      duration: data.duration,
      timestamp: new Date(),
      details: data.details,
    };

    this.performanceMetrics.set(metric.id, metric);

    // Check if performance is degraded
    await this.checkPerformanceThresholds(metric);

    return metric;
  }

  /**
   * Track network request
   */
  async trackNetworkRequest(data: {
    userId?: string;
    deviceId: string;
    method: NetworkMetric['method'];
    url: string;
    statusCode?: number;
    requestSize: number;
    responseSize: number;
    duration: number;
    networkType: NetworkMetric['networkType'];
    success: boolean;
    error?: string;
  }): Promise<NetworkMetric> {
    const metric: NetworkMetric = {
      id: `net-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      method: data.method,
      url: data.url,
      statusCode: data.statusCode,
      requestSize: data.requestSize,
      responseSize: data.responseSize,
      duration: data.duration,
      timestamp: new Date(),
      networkType: data.networkType,
      success: data.success,
      error: data.error,
    };

    this.networkMetrics.set(metric.id, metric);
    return metric;
  }

  /**
   * Track battery usage
   */
  async trackBatteryUsage(data: {
    userId?: string;
    deviceId: string;
    batteryLevel: number;
    isCharging: boolean;
    appUsage: BatteryMetric['appUsage'];
  }): Promise<BatteryMetric> {
    const metric: BatteryMetric = {
      id: `battery-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      batteryLevel: data.batteryLevel,
      isCharging: data.isCharging,
      timestamp: new Date(),
      appUsage: data.appUsage,
    };

    this.batteryMetrics.set(metric.id, metric);
    return metric;
  }

  /**
   * Track memory usage
   */
  async trackMemoryUsage(data: {
    deviceId: string;
    used: number;
    available: number;
    total: number;
    threshold: number;
  }): Promise<MemoryMetric> {
    const metric: MemoryMetric = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      deviceId: data.deviceId,
      timestamp: new Date(),
      used: data.used,
      available: data.available,
      total: data.total,
      threshold: data.threshold,
      warningTriggered: data.used > data.threshold,
    };

    this.memoryMetrics.set(metric.id, metric);

    if (metric.warningTriggered) {
      await this.handleMemoryWarning(metric);
    }

    return metric;
  }

  /**
   * Generate app vitals report
   */
  async generateAppVitals(period: 'hour' | 'day' | 'week' = 'day'): Promise<AppVital> {
    const now = new Date();
    const periodMs = period === 'hour' ? 3600000 : period === 'day' ? 86400000 : 604800000;
    const cutoff = new Date(now.getTime() - periodMs);

    // Crash-free rate
    const recentCrashes = Array.from(this.crashReports.values()).filter(
      (c) => c.timestamp >= cutoff
    );
    const totalSessions = 1000; // Would come from session tracking
    const crashFreeRate = ((totalSessions - recentCrashes.length) / totalSessions) * 100;

    // Average start time
    const startMetrics = Array.from(this.performanceMetrics.values()).filter(
      (m) => m.metricType === 'app_start' && m.timestamp >= cutoff
    );
    const averageStartTime =
      startMetrics.length > 0
        ? startMetrics.reduce((sum, m) => sum + m.duration, 0) / startMetrics.length
        : 0;

    // Average screen load
    const screenMetrics = Array.from(this.performanceMetrics.values()).filter(
      (m) => m.metricType === 'screen_load' && m.timestamp >= cutoff
    );
    const averageScreenLoad =
      screenMetrics.length > 0
        ? screenMetrics.reduce((sum, m) => sum + m.duration, 0) / screenMetrics.length
        : 0;

    // Network metrics
    const networkRequests = Array.from(this.networkMetrics.values()).filter(
      (n) => n.timestamp >= cutoff
    );
    const averageNetworkLatency =
      networkRequests.length > 0
        ? networkRequests.reduce((sum, n) => sum + n.duration, 0) / networkRequests.length
        : 0;
    const networkFailureRate =
      networkRequests.length > 0
        ? (networkRequests.filter((n) => !n.success).length / networkRequests.length) * 100
        : 0;

    // Memory utilization
    const recentMemory = Array.from(this.memoryMetrics.values()).filter(
      (m) => m.timestamp >= cutoff
    );
    const memoryUtilization =
      recentMemory.length > 0
        ? recentMemory.reduce((sum, m) => sum + (m.used / m.total) * 100, 0) / recentMemory.length
        : 0;

    // Battery impact
    const recentBattery = Array.from(this.batteryMetrics.values()).filter(
      (b) => b.timestamp >= cutoff
    );
    const avgCpuUsage =
      recentBattery.length > 0
        ? recentBattery.reduce((sum, b) => sum + b.appUsage.cpuUsage, 0) / recentBattery.length
        : 0;
    const batteryImpact: 'low' | 'medium' | 'high' =
      avgCpuUsage < 10 ? 'low' : avgCpuUsage < 30 ? 'medium' : 'high';

    // Calculate health score
    const healthScore = this.calculateHealthScore({
      crashFreeRate,
      averageStartTime,
      averageScreenLoad,
      averageNetworkLatency,
      memoryUtilization,
      batteryImpact,
      networkFailureRate,
    });

    // Identify issues
    const issues: string[] = [];
    if (crashFreeRate < 99) issues.push('High crash rate detected');
    if (averageStartTime > 3000) issues.push('Slow app start time');
    if (averageScreenLoad > 2000) issues.push('Slow screen loading');
    if (networkFailureRate > 5) issues.push('High network failure rate');
    if (memoryUtilization > 80) issues.push('High memory utilization');
    if (batteryImpact === 'high') issues.push('High battery consumption');

    const vital: AppVital = {
      id: `vital-${Date.now()}`,
      timestamp: new Date(),
      metrics: {
        crashFreeRate,
        averageStartTime,
        averageScreenLoad,
        averageNetworkLatency,
        memoryUtilization,
        batteryImpact,
        networkFailureRate,
      },
      healthScore,
      issues,
    };

    this.appVitals.set(vital.id, vital);
    return vital;
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics(period: 'day' | 'week' | 'month' = 'week'): Promise<{
    crashes: {
      total: number;
      byType: Record<string, number>;
      bySeverity: Record<string, number>;
      topCrashes: { message: string; count: number }[];
    };
    performance: {
      appStartTime: { p50: number; p95: number; p99: number };
      screenLoadTime: { p50: number; p95: number; p99: number };
      slowestScreens: { screen: string; avgDuration: number }[];
    };
    network: {
      totalRequests: number;
      successRate: number;
      averageLatency: number;
      slowestEndpoints: { endpoint: string; avgDuration: number }[];
    };
    resources: {
      averageMemoryUsage: number;
      peakMemoryUsage: number;
      averageBatteryImpact: number;
      memoryWarnings: number;
    };
  }> {
    const now = new Date();
    const periodMs = period === 'day' ? 86400000 : period === 'week' ? 604800000 : 2592000000;
    const cutoff = new Date(now.getTime() - periodMs);

    // Crash analytics
    const recentCrashes = Array.from(this.crashReports.values()).filter(
      (c) => c.timestamp >= cutoff
    );

    const crashesByType = recentCrashes.reduce(
      (acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const crashesBySeverity = recentCrashes.reduce(
      (acc, c) => {
        acc[c.severity] = (acc[c.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const crashCounts = new Map<string, number>();
    recentCrashes.forEach((c) => {
      crashCounts.set(c.message, (crashCounts.get(c.message) || 0) + 1);
    });
    const topCrashes = Array.from(crashCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Performance analytics
    const startTimes = Array.from(this.performanceMetrics.values())
      .filter((m) => m.metricType === 'app_start' && m.timestamp >= cutoff)
      .map((m) => m.duration)
      .sort((a, b) => a - b);

    const screenLoadTimes = Array.from(this.performanceMetrics.values())
      .filter((m) => m.metricType === 'screen_load' && m.timestamp >= cutoff)
      .map((m) => m.duration)
      .sort((a, b) => a - b);

    const screenDurations = new Map<string, number[]>();
    Array.from(this.performanceMetrics.values())
      .filter((m) => m.metricType === 'screen_load' && m.timestamp >= cutoff && m.details?.screen)
      .forEach((m) => {
        const screen = m.details!.screen!;
        if (!screenDurations.has(screen)) {
          screenDurations.set(screen, []);
        }
        screenDurations.get(screen)!.push(m.duration);
      });

    const slowestScreens = Array.from(screenDurations.entries())
      .map(([screen, durations]) => ({
        screen,
        avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 5);

    // Network analytics
    const networkRequests = Array.from(this.networkMetrics.values()).filter(
      (n) => n.timestamp >= cutoff
    );

    const successfulRequests = networkRequests.filter((n) => n.success);
    const successRate =
      networkRequests.length > 0 ? (successfulRequests.length / networkRequests.length) * 100 : 0;

    const averageLatency =
      networkRequests.length > 0
        ? networkRequests.reduce((sum, n) => sum + n.duration, 0) / networkRequests.length
        : 0;

    const endpointDurations = new Map<string, number[]>();
    networkRequests.forEach((n) => {
      const endpoint = new URL(n.url).pathname;
      if (!endpointDurations.has(endpoint)) {
        endpointDurations.set(endpoint, []);
      }
      endpointDurations.get(endpoint)!.push(n.duration);
    });

    const slowestEndpoints = Array.from(endpointDurations.entries())
      .map(([endpoint, durations]) => ({
        endpoint,
        avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 5);

    // Resource analytics
    const memoryMetrics = Array.from(this.memoryMetrics.values()).filter(
      (m) => m.timestamp >= cutoff
    );

    const averageMemoryUsage =
      memoryMetrics.length > 0
        ? memoryMetrics.reduce((sum, m) => sum + m.used, 0) / memoryMetrics.length
        : 0;

    const peakMemoryUsage =
      memoryMetrics.length > 0 ? Math.max(...memoryMetrics.map((m) => m.used)) : 0;

    const batteryMetrics = Array.from(this.batteryMetrics.values()).filter(
      (b) => b.timestamp >= cutoff
    );

    const averageBatteryImpact =
      batteryMetrics.length > 0
        ? batteryMetrics.reduce((sum, b) => sum + b.appUsage.cpuUsage, 0) / batteryMetrics.length
        : 0;

    const memoryWarnings = memoryMetrics.filter((m) => m.warningTriggered).length;

    return {
      crashes: {
        total: recentCrashes.length,
        byType: crashesByType,
        bySeverity: crashesBySeverity,
        topCrashes,
      },
      performance: {
        appStartTime: {
          p50: this.percentile(startTimes, 50),
          p95: this.percentile(startTimes, 95),
          p99: this.percentile(startTimes, 99),
        },
        screenLoadTime: {
          p50: this.percentile(screenLoadTimes, 50),
          p95: this.percentile(screenLoadTimes, 95),
          p99: this.percentile(screenLoadTimes, 99),
        },
        slowestScreens,
      },
      network: {
        totalRequests: networkRequests.length,
        successRate,
        averageLatency,
        slowestEndpoints,
      },
      resources: {
        averageMemoryUsage,
        peakMemoryUsage,
        averageBatteryImpact,
        memoryWarnings,
      },
    };
  }

  /**
   * Helper: Group similar crashes
   */
  private async groupSimilarCrashes(crash: CrashReport): Promise<void> {
    // Simple grouping by stack trace similarity
    // In production, would use more sophisticated algorithms
  }

  /**
   * Helper: Check performance thresholds
   */
  private async checkPerformanceThresholds(metric: PerformanceMetric): Promise<void> {
    const thresholds = {
      app_start: 3000,
      screen_load: 2000,
      network_request: 5000,
      render: 16, // 60fps
      animation: 16,
    };

    const threshold = thresholds[metric.metricType];
    if (metric.duration > threshold) {
      // Would trigger alert or create issue
      console.warn(`Performance threshold exceeded: ${metric.name} took ${metric.duration}ms`);
    }
  }

  /**
   * Helper: Handle memory warning
   */
  private async handleMemoryWarning(metric: MemoryMetric): Promise<void> {
    // Would trigger memory cleanup or alert
    console.warn(`Memory warning: ${metric.used}MB used (threshold: ${metric.threshold}MB)`);
  }

  /**
   * Helper: Calculate health score
   */
  private calculateHealthScore(metrics: AppVital['metrics']): number {
    const weights = {
      crashFreeRate: 0.3,
      startTime: 0.15,
      screenLoad: 0.15,
      networkLatency: 0.15,
      memoryUtilization: 0.15,
      batteryImpact: 0.05,
      networkFailureRate: 0.05,
    };

    let score = 0;

    // Crash-free rate (higher is better)
    score += (metrics.crashFreeRate / 100) * 100 * weights.crashFreeRate;

    // Start time (lower is better, target < 2s)
    score += Math.max(0, 1 - metrics.averageStartTime / 5000) * 100 * weights.startTime;

    // Screen load (lower is better, target < 1s)
    score += Math.max(0, 1 - metrics.averageScreenLoad / 3000) * 100 * weights.screenLoad;

    // Network latency (lower is better, target < 500ms)
    score += Math.max(0, 1 - metrics.averageNetworkLatency / 2000) * 100 * weights.networkLatency;

    // Memory utilization (lower is better, target < 70%)
    score += Math.max(0, 1 - metrics.memoryUtilization / 100) * 100 * weights.memoryUtilization;

    // Battery impact
    const batteryScore =
      metrics.batteryImpact === 'low' ? 100 : metrics.batteryImpact === 'medium' ? 60 : 30;
    score += batteryScore * weights.batteryImpact;

    // Network failure rate (lower is better)
    score += Math.max(0, 1 - metrics.networkFailureRate / 100) * 100 * weights.networkFailureRate;

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Helper: Calculate percentile
   */
  private percentile(arr: number[], p: number): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }
}

// Singleton instance
export const appPerformanceMonitoringService = new AppPerformanceMonitoringService();
