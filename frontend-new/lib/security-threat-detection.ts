/**
 * Security Threat Detection System
 *
 * Advanced threat detection and prevention
 */

export interface ThreatDetection {
  id: string;
  type:
    | 'brute_force'
    | 'sql_injection'
    | 'xss'
    | 'ddos'
    | 'credential_stuffing'
    | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: { ip: string; userAgent?: string; userId?: string };
  details: any;
  timestamp: Date;
  blocked: boolean;
  resolved: boolean;
}

export interface SecurityRule {
  id: string;
  name: string;
  type: 'rate_limit' | 'ip_block' | 'pattern_match' | 'behavior';
  enabled: boolean;
  config: any;
  triggeredCount: number;
}

export class SecurityThreatDetectionSystem {
  private threats: Map<string, ThreatDetection> = new Map();
  private rules: Map<string, SecurityRule> = new Map();
  private blockedIPs: Set<string> = new Set();

  constructor() {
    this.initializeDefaultRules();
  }

  async detectThreat(data: {
    type: ThreatDetection['type'];
    severity: ThreatDetection['severity'];
    source: ThreatDetection['source'];
    details: any;
  }): Promise<ThreatDetection> {
    const threat: ThreatDetection = {
      id: `threat-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: data.type,
      severity: data.severity,
      source: data.source,
      details: data.details,
      timestamp: new Date(),
      blocked: false,
      resolved: false,
    };

    this.threats.set(threat.id, threat);

    // Auto-block critical threats
    if (data.severity === 'critical') {
      await this.blockIP(data.source.ip);
      threat.blocked = true;
    }

    return threat;
  }

  async blockIP(ip: string): Promise<void> {
    this.blockedIPs.add(ip);
  }

  async isBlocked(ip: string): Promise<boolean> {
    return this.blockedIPs.has(ip);
  }

  async checkRateLimit(
    userId: string,
    action: string,
    limit: number,
    window: number
  ): Promise<boolean> {
    const key = `${userId}-${action}`;
    const recentAttempts = Array.from(this.threats.values()).filter(
      (t) =>
        t.source.userId === userId &&
        t.details?.action === action &&
        t.timestamp > new Date(Date.now() - window)
    ).length;

    if (recentAttempts >= limit) {
      await this.detectThreat({
        type: 'brute_force',
        severity: 'high',
        source: { ip: 'unknown', userId },
        details: { action, attempts: recentAttempts },
      });
      return false;
    }

    return true;
  }

  async getActiveThreats(): Promise<ThreatDetection[]> {
    return Array.from(this.threats.values())
      .filter((t) => !t.resolved)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAnalytics(): Promise<{
    totalThreats: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    blockedIPs: number;
    activeThreats: number;
  }> {
    const threats = Array.from(this.threats.values());
    const bySeverity = threats.reduce(
      (acc, t) => {
        acc[t.severity] = (acc[t.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byType = threats.reduce(
      (acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalThreats: threats.length,
      bySeverity,
      byType,
      blockedIPs: this.blockedIPs.size,
      activeThreats: threats.filter((t) => !t.resolved).length,
    };
  }

  private initializeDefaultRules(): void {
    this.rules.set('rate-limit-1', {
      id: 'rate-limit-1',
      name: 'Login Rate Limit',
      type: 'rate_limit',
      enabled: true,
      config: { action: 'login', limit: 5, window: 300000 },
      triggeredCount: 0,
    });
  }
}

export const securityThreatDetectionSystem = new SecurityThreatDetectionSystem();
