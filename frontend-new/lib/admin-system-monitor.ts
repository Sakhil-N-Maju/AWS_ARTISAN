/**
 * Admin System Monitor
 *
 * System health and performance monitoring
 */

export interface SystemMetric {
  id: string;
  category: 'performance' | 'errors' | 'resources' | 'security';
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface SystemAlert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
}

export class AdminSystemMonitor {
  private metrics: Map<string, SystemMetric> = new Map();
  private alerts: Map<string, SystemAlert> = new Map();

  async recordMetric(data: {
    category: SystemMetric['category'];
    name: string;
    value: number;
    unit: string;
    threshold?: number;
  }): Promise<SystemMetric> {
    const status: SystemMetric['status'] =
      data.threshold && data.value > data.threshold
        ? data.value > data.threshold * 1.5
          ? 'critical'
          : 'warning'
        : 'normal';

    const metric: SystemMetric = {
      id: `metric-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      category: data.category,
      name: data.name,
      value: data.value,
      unit: data.unit,
      timestamp: new Date(),
      threshold: data.threshold,
      status,
    };

    this.metrics.set(metric.id, metric);

    if (status !== 'normal') {
      await this.createAlert({
        severity: status === 'critical' ? 'critical' : 'warning',
        title: `${data.name} threshold exceeded`,
        message: `${data.name} is at ${data.value}${data.unit} (threshold: ${data.threshold}${data.unit})`,
        source: 'system_monitor',
      });
    }

    return metric;
  }

  async createAlert(data: {
    severity: SystemAlert['severity'];
    title: string;
    message: string;
    source: string;
  }): Promise<SystemAlert> {
    const alert: SystemAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      severity: data.severity,
      title: data.title,
      message: data.message,
      source: data.source,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.alerts.set(alert.id, alert);
    return alert;
  }

  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    criticalAlerts: number;
    recentMetrics: SystemMetric[];
  }> {
    const criticalAlerts = Array.from(this.alerts.values()).filter(
      (a) => a.severity === 'critical' && !a.acknowledged
    ).length;

    const status: 'healthy' | 'degraded' | 'down' =
      criticalAlerts > 5 ? 'down' : criticalAlerts > 0 ? 'degraded' : 'healthy';

    const recentMetrics = Array.from(this.metrics.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      status,
      uptime: process.uptime ? process.uptime() : 0,
      criticalAlerts,
      recentMetrics,
    };
  }

  async getAlerts(acknowledged?: boolean): Promise<SystemAlert[]> {
    let alerts = Array.from(this.alerts.values());
    if (acknowledged !== undefined) {
      alerts = alerts.filter((a) => a.acknowledged === acknowledged);
    }
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.alerts.set(alertId, alert);
    }
  }
}

export const adminSystemMonitor = new AdminSystemMonitor();
