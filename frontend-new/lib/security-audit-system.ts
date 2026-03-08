/**
 * Security Audit System
 *
 * Security auditing and compliance tracking
 */

export interface AuditEvent {
  id: string;
  eventType:
    | 'login'
    | 'logout'
    | 'data_access'
    | 'data_modification'
    | 'permission_change'
    | 'system_config';
  userId?: string;
  resource: string;
  action: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SecurityAudit {
  id: string;
  auditType: 'access_review' | 'vulnerability_scan' | 'compliance_check' | 'penetration_test';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scheduledFor: Date;
  completedAt?: Date;
  findings: {
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    description: string;
    remediation?: string;
  }[];
  score?: number;
}

export class SecurityAuditSystem {
  private auditEvents: Map<string, AuditEvent> = new Map();
  private securityAudits: Map<string, SecurityAudit> = new Map();

  async logEvent(data: {
    eventType: AuditEvent['eventType'];
    userId?: string;
    resource: string;
    action: string;
    details: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditEvent> {
    const riskLevel = this.assessRisk(data.eventType, data.action);

    const event: AuditEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      eventType: data.eventType,
      userId: data.userId,
      resource: data.resource,
      action: data.action,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      timestamp: new Date(),
      riskLevel,
    };

    this.auditEvents.set(event.id, event);
    return event;
  }

  async scheduleAudit(data: {
    auditType: SecurityAudit['auditType'];
    scheduledFor: Date;
  }): Promise<SecurityAudit> {
    const audit: SecurityAudit = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      auditType: data.auditType,
      status: 'scheduled',
      scheduledFor: data.scheduledFor,
      findings: [],
    };

    this.securityAudits.set(audit.id, audit);
    return audit;
  }

  async completeAudit(
    auditId: string,
    findings: SecurityAudit['findings'],
    score: number
  ): Promise<SecurityAudit> {
    const audit = this.securityAudits.get(auditId);
    if (!audit) throw new Error('Audit not found');

    audit.status = 'completed';
    audit.completedAt = new Date();
    audit.findings = findings;
    audit.score = score;

    this.securityAudits.set(auditId, audit);
    return audit;
  }

  async getAuditTrail(filters?: {
    userId?: string;
    eventType?: AuditEvent['eventType'];
    dateFrom?: Date;
    dateTo?: Date;
    riskLevel?: AuditEvent['riskLevel'];
    limit?: number;
  }): Promise<AuditEvent[]> {
    let events = Array.from(this.auditEvents.values());

    if (filters) {
      if (filters.userId) events = events.filter((e) => e.userId === filters.userId);
      if (filters.eventType) events = events.filter((e) => e.eventType === filters.eventType);
      if (filters.dateFrom) events = events.filter((e) => e.timestamp >= filters.dateFrom!);
      if (filters.dateTo) events = events.filter((e) => e.timestamp <= filters.dateTo!);
      if (filters.riskLevel) events = events.filter((e) => e.riskLevel === filters.riskLevel);
    }

    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters?.limit) {
      events = events.slice(0, filters.limit);
    }

    return events;
  }

  async getAuditAnalytics(): Promise<{
    totalEvents: number;
    byEventType: Record<string, number>;
    byRiskLevel: Record<string, number>;
    audits: {
      scheduled: number;
      completed: number;
      averageScore: number;
    };
    highRiskEvents: number;
  }> {
    const events = Array.from(this.auditEvents.values());
    const byEventType = events.reduce(
      (acc, e) => {
        acc[e.eventType] = (acc[e.eventType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byRiskLevel = events.reduce(
      (acc, e) => {
        acc[e.riskLevel] = (acc[e.riskLevel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const audits = Array.from(this.securityAudits.values());
    const completedAudits = audits.filter((a) => a.status === 'completed');
    const avgScore =
      completedAudits.length > 0
        ? completedAudits.reduce((sum, a) => sum + (a.score || 0), 0) / completedAudits.length
        : 0;

    return {
      totalEvents: events.length,
      byEventType,
      byRiskLevel,
      audits: {
        scheduled: audits.filter((a) => a.status === 'scheduled').length,
        completed: completedAudits.length,
        averageScore: Math.round(avgScore * 10) / 10,
      },
      highRiskEvents: events.filter((e) => e.riskLevel === 'high').length,
    };
  }

  private assessRisk(eventType: AuditEvent['eventType'], action: string): AuditEvent['riskLevel'] {
    if (eventType === 'permission_change' || eventType === 'system_config') return 'high';
    if (eventType === 'data_modification') return 'medium';
    return 'low';
  }
}

export const securityAuditSystem = new SecurityAuditSystem();
