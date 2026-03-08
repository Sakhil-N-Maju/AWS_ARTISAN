/**
 * Auto-Scaling Service
 *
 * Automatic resource scaling based on demand
 */

export interface ScalingPolicy {
  id: string;
  name: string;
  resourceType: 'compute' | 'database' | 'storage';
  metric: 'cpu' | 'memory' | 'requests' | 'connections';
  threshold: number;
  scaleUpBy: number;
  scaleDownBy: number;
  minInstances: number;
  maxInstances: number;
  cooldownPeriod: number; // seconds
  enabled: boolean;
}

export interface ScalingEvent {
  id: string;
  policyId: string;
  direction: 'up' | 'down';
  fromInstances: number;
  toInstances: number;
  reason: string;
  timestamp: Date;
  successful: boolean;
}

export interface ResourceMetrics {
  instanceId: string;
  cpu: number;
  memory: number;
  requests: number;
  connections: number;
  timestamp: Date;
}

export class AutoScalingService {
  private policies: Map<string, ScalingPolicy> = new Map();
  private events: Map<string, ScalingEvent> = new Map();
  private metrics: Map<string, ResourceMetrics[]> = new Map();
  private currentInstances: Map<string, number> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
    this.startMonitoring();
  }

  async createPolicy(data: {
    name: string;
    resourceType: ScalingPolicy['resourceType'];
    metric: ScalingPolicy['metric'];
    threshold: number;
    scaleUpBy: number;
    scaleDownBy: number;
    minInstances: number;
    maxInstances: number;
    cooldownPeriod?: number;
  }): Promise<ScalingPolicy> {
    const policy: ScalingPolicy = {
      id: `policy-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      resourceType: data.resourceType,
      metric: data.metric,
      threshold: data.threshold,
      scaleUpBy: data.scaleUpBy,
      scaleDownBy: data.scaleDownBy,
      minInstances: data.minInstances,
      maxInstances: data.maxInstances,
      cooldownPeriod: data.cooldownPeriod || 300,
      enabled: true,
    };

    this.policies.set(policy.id, policy);
    this.currentInstances.set(policy.id, data.minInstances);

    return policy;
  }

  async recordMetrics(
    instanceId: string,
    metrics: Omit<ResourceMetrics, 'instanceId' | 'timestamp'>
  ): Promise<void> {
    const metric: ResourceMetrics = {
      instanceId,
      ...metrics,
      timestamp: new Date(),
    };

    const instanceMetrics = this.metrics.get(instanceId) || [];
    instanceMetrics.push(metric);

    // Keep only last 100 metrics
    if (instanceMetrics.length > 100) {
      instanceMetrics.shift();
    }

    this.metrics.set(instanceId, instanceMetrics);
  }

  async evaluatePolicies(): Promise<void> {
    for (const [policyId, policy] of this.policies.entries()) {
      if (!policy.enabled) continue;

      const currentCount = this.currentInstances.get(policyId) || policy.minInstances;
      const shouldScale = await this.shouldScale(policy);

      if (shouldScale === 'up' && currentCount < policy.maxInstances) {
        await this.scaleUp(policyId, policy);
      } else if (shouldScale === 'down' && currentCount > policy.minInstances) {
        await this.scaleDown(policyId, policy);
      }
    }
  }

  private async shouldScale(policy: ScalingPolicy): Promise<'up' | 'down' | 'none'> {
    const allMetrics = Array.from(this.metrics.values()).flat();
    if (allMetrics.length === 0) return 'none';

    const recentMetrics = allMetrics.filter(
      (m) => m.timestamp > new Date(Date.now() - 60000) // Last minute
    );

    if (recentMetrics.length === 0) return 'none';

    const avgValue =
      recentMetrics.reduce((sum, m) => sum + m[policy.metric], 0) / recentMetrics.length;

    if (avgValue > policy.threshold) return 'up';
    if (avgValue < policy.threshold * 0.5) return 'down';
    return 'none';
  }

  private async scaleUp(policyId: string, policy: ScalingPolicy): Promise<void> {
    const current = this.currentInstances.get(policyId) || policy.minInstances;
    const newCount = Math.min(current + policy.scaleUpBy, policy.maxInstances);

    const event: ScalingEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      policyId,
      direction: 'up',
      fromInstances: current,
      toInstances: newCount,
      reason: `${policy.metric} exceeded threshold`,
      timestamp: new Date(),
      successful: true,
    };

    this.events.set(event.id, event);
    this.currentInstances.set(policyId, newCount);
  }

  private async scaleDown(policyId: string, policy: ScalingPolicy): Promise<void> {
    const current = this.currentInstances.get(policyId) || policy.minInstances;
    const newCount = Math.max(current - policy.scaleDownBy, policy.minInstances);

    const event: ScalingEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      policyId,
      direction: 'down',
      fromInstances: current,
      toInstances: newCount,
      reason: `${policy.metric} below threshold`,
      timestamp: new Date(),
      successful: true,
    };

    this.events.set(event.id, event);
    this.currentInstances.set(policyId, newCount);
  }

  async getScalingEvents(limit: number = 50): Promise<ScalingEvent[]> {
    return Array.from(this.events.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getStats(): Promise<{
    totalPolicies: number;
    activePolicies: number;
    totalScalingEvents: number;
    scaleUpEvents: number;
    scaleDownEvents: number;
    currentInstances: Record<string, number>;
  }> {
    const policies = Array.from(this.policies.values());
    const events = Array.from(this.events.values());

    return {
      totalPolicies: policies.length,
      activePolicies: policies.filter((p) => p.enabled).length,
      totalScalingEvents: events.length,
      scaleUpEvents: events.filter((e) => e.direction === 'up').length,
      scaleDownEvents: events.filter((e) => e.direction === 'down').length,
      currentInstances: Object.fromEntries(this.currentInstances.entries()),
    };
  }

  private startMonitoring(): void {
    // Evaluate policies every 60 seconds
    setInterval(() => this.evaluatePolicies(), 60000);
  }

  private initializeDefaultPolicies(): void {
    this.createPolicy({
      name: 'CPU-based Scaling',
      resourceType: 'compute',
      metric: 'cpu',
      threshold: 70,
      scaleUpBy: 2,
      scaleDownBy: 1,
      minInstances: 2,
      maxInstances: 10,
      cooldownPeriod: 300,
    });

    this.createPolicy({
      name: 'Request-based Scaling',
      resourceType: 'compute',
      metric: 'requests',
      threshold: 1000,
      scaleUpBy: 1,
      scaleDownBy: 1,
      minInstances: 2,
      maxInstances: 8,
      cooldownPeriod: 180,
    });
  }
}

export const autoScalingService = new AutoScalingService();
