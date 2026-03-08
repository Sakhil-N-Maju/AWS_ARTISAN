/**
 * Admin Content Moderation System
 *
 * Comprehensive content moderation tools:
 * - Product review moderation
 * - User-generated content moderation
 * - Automated content filtering
 * - Community guidelines enforcement
 * - Content reporting and flagging
 */

export interface ContentReport {
  id: string;
  reportedBy: string;
  contentType: 'product' | 'review' | 'comment' | 'message' | 'profile' | 'image';
  contentId: string;
  reportReason:
    | 'spam'
    | 'inappropriate'
    | 'fraud'
    | 'copyright'
    | 'harassment'
    | 'misinformation'
    | 'other';
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: {
    action: 'removed' | 'edited' | 'warned' | 'no_action';
    note: string;
  };
}

export interface ContentModerationRule {
  id: string;
  name: string;
  type: 'keyword' | 'pattern' | 'sentiment' | 'image' | 'behavior';
  contentTypes: ContentReport['contentType'][];
  rule: {
    keywords?: string[];
    pattern?: string;
    threshold?: number;
  };
  action: 'flag' | 'auto_remove' | 'quarantine' | 'notify_admin';
  severity: 'low' | 'medium' | 'high';
  active: boolean;
  createdAt: Date;
  triggeredCount: number;
}

export interface ModeratedContent {
  id: string;
  contentType: ContentReport['contentType'];
  contentId: string;
  originalContent: any;
  status: 'approved' | 'rejected' | 'pending' | 'flagged' | 'quarantined';
  moderatedBy?: string;
  moderatedAt?: Date;
  violations: {
    ruleId: string;
    ruleName: string;
    severity: string;
  }[];
  editHistory: {
    editedBy: string;
    editedAt: Date;
    changes: any;
  }[];
}

export interface UserWarning {
  id: string;
  userId: string;
  issuedBy: string;
  reason: string;
  severity: 'warning' | 'final_warning' | 'strike';
  relatedContentId?: string;
  issuedAt: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

export interface ContentQueue {
  id: string;
  name: string;
  filters: {
    contentType?: ContentReport['contentType'][];
    status?: ModeratedContent['status'][];
    priority?: ContentReport['priority'][];
  };
  items: string[]; // content IDs
  assignedModerators: string[];
  createdAt: Date;
}

export class AdminContentModerationSystem {
  private contentReports: Map<string, ContentReport> = new Map();
  private moderationRules: Map<string, ContentModerationRule> = new Map();
  private moderatedContent: Map<string, ModeratedContent> = new Map();
  private userWarnings: Map<string, UserWarning> = new Map();
  private contentQueues: Map<string, ContentQueue> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Report content
   */
  async reportContent(data: {
    reportedBy: string;
    contentType: ContentReport['contentType'];
    contentId: string;
    reportReason: ContentReport['reportReason'];
    description?: string;
  }): Promise<ContentReport> {
    const report: ContentReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      reportedBy: data.reportedBy,
      contentType: data.contentType,
      contentId: data.contentId,
      reportReason: data.reportReason,
      description: data.description,
      status: 'pending',
      priority: this.calculatePriority(data.reportReason),
      createdAt: new Date(),
    };

    this.contentReports.set(report.id, report);

    // Auto-flag if matching moderation rules
    await this.checkModerationRules(data.contentId, data.contentType);

    return report;
  }

  /**
   * Assign report to moderator
   */
  async assignReport(reportId: string, moderatorId: string): Promise<ContentReport> {
    const report = this.contentReports.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    report.assignedTo = moderatorId;
    report.status = 'reviewing';
    this.contentReports.set(reportId, report);

    return report;
  }

  /**
   * Resolve content report
   */
  async resolveReport(data: {
    reportId: string;
    moderatorId: string;
    action: 'removed' | 'edited' | 'warned' | 'no_action';
    note: string;
  }): Promise<ContentReport> {
    const report = this.contentReports.get(data.reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    report.status = 'resolved';
    report.resolvedAt = new Date();
    report.resolution = {
      action: data.action,
      note: data.note,
    };

    this.contentReports.set(data.reportId, report);

    // Take action on content
    if (data.action === 'removed') {
      await this.removeContent(report.contentId, report.contentType, data.moderatorId);
    } else if (data.action === 'warned') {
      const content = this.moderatedContent.get(report.contentId);
      if (content && content.originalContent.userId) {
        await this.issueWarning({
          userId: content.originalContent.userId,
          moderatorId: data.moderatorId,
          reason: report.reportReason,
          severity: 'warning',
          relatedContentId: report.contentId,
        });
      }
    }

    return report;
  }

  /**
   * Create moderation rule
   */
  async createModerationRule(data: {
    name: string;
    type: ContentModerationRule['type'];
    contentTypes: ContentReport['contentType'][];
    rule: ContentModerationRule['rule'];
    action: ContentModerationRule['action'];
    severity: ContentModerationRule['severity'];
  }): Promise<ContentModerationRule> {
    const rule: ContentModerationRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      type: data.type,
      contentTypes: data.contentTypes,
      rule: data.rule,
      action: data.action,
      severity: data.severity,
      active: true,
      createdAt: new Date(),
      triggeredCount: 0,
    };

    this.moderationRules.set(rule.id, rule);
    return rule;
  }

  /**
   * Check content against moderation rules
   */
  async checkModerationRules(
    contentId: string,
    contentType: ContentReport['contentType'],
    content?: any
  ): Promise<{
    flagged: boolean;
    violations: { ruleId: string; ruleName: string; severity: string }[];
  }> {
    const violations: { ruleId: string; ruleName: string; severity: string }[] = [];

    const applicableRules = Array.from(this.moderationRules.values()).filter(
      (r) => r.active && r.contentTypes.includes(contentType)
    );

    for (const rule of applicableRules) {
      let violated = false;

      if (rule.type === 'keyword' && content?.text && rule.rule.keywords) {
        const textLower = content.text.toLowerCase();
        violated = rule.rule.keywords.some((keyword) => textLower.includes(keyword.toLowerCase()));
      } else if (rule.type === 'pattern' && content?.text && rule.rule.pattern) {
        const regex = new RegExp(rule.rule.pattern, 'i');
        violated = regex.test(content.text);
      } else if (rule.type === 'sentiment' && content?.text) {
        // Simple sentiment check (in production, would use ML)
        const negativeWords = ['hate', 'terrible', 'awful', 'scam', 'fraud'];
        const textLower = content.text.toLowerCase();
        const negativeCount = negativeWords.filter((word) => textLower.includes(word)).length;
        violated = negativeCount >= (rule.rule.threshold || 2);
      }

      if (violated) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
        });

        rule.triggeredCount++;
        this.moderationRules.set(rule.id, rule);

        // Execute rule action
        if (rule.action === 'flag') {
          await this.flagContent(contentId, contentType, violations);
        } else if (rule.action === 'auto_remove') {
          await this.removeContent(contentId, contentType, 'system');
        } else if (rule.action === 'quarantine') {
          await this.quarantineContent(contentId, contentType, violations);
        }
      }
    }

    return {
      flagged: violations.length > 0,
      violations,
    };
  }

  /**
   * Flag content
   */
  async flagContent(
    contentId: string,
    contentType: ContentReport['contentType'],
    violations: ModeratedContent['violations']
  ): Promise<ModeratedContent> {
    let content = this.moderatedContent.get(contentId);

    if (!content) {
      content = {
        id: contentId,
        contentType,
        contentId,
        originalContent: {},
        status: 'flagged',
        violations: [],
        editHistory: [],
      };
    } else {
      content.status = 'flagged';
    }

    content.violations = [...content.violations, ...violations];
    this.moderatedContent.set(contentId, content);

    return content;
  }

  /**
   * Quarantine content
   */
  async quarantineContent(
    contentId: string,
    contentType: ContentReport['contentType'],
    violations: ModeratedContent['violations']
  ): Promise<ModeratedContent> {
    let content = this.moderatedContent.get(contentId);

    if (!content) {
      content = {
        id: contentId,
        contentType,
        contentId,
        originalContent: {},
        status: 'quarantined',
        violations: [],
        editHistory: [],
      };
    } else {
      content.status = 'quarantined';
    }

    content.violations = [...content.violations, ...violations];
    this.moderatedContent.set(contentId, content);

    return content;
  }

  /**
   * Remove content
   */
  async removeContent(
    contentId: string,
    contentType: ContentReport['contentType'],
    moderatorId: string
  ): Promise<void> {
    let content = this.moderatedContent.get(contentId);

    if (!content) {
      content = {
        id: contentId,
        contentType,
        contentId,
        originalContent: {},
        status: 'rejected',
        violations: [],
        editHistory: [],
      };
    } else {
      content.status = 'rejected';
    }

    content.moderatedBy = moderatorId;
    content.moderatedAt = new Date();
    this.moderatedContent.set(contentId, content);
  }

  /**
   * Approve content
   */
  async approveContent(contentId: string, moderatorId: string): Promise<ModeratedContent> {
    const content = this.moderatedContent.get(contentId);
    if (!content) {
      throw new Error('Content not found');
    }

    content.status = 'approved';
    content.moderatedBy = moderatorId;
    content.moderatedAt = new Date();
    this.moderatedContent.set(contentId, content);

    return content;
  }

  /**
   * Issue warning to user
   */
  async issueWarning(data: {
    userId: string;
    moderatorId: string;
    reason: string;
    severity: UserWarning['severity'];
    relatedContentId?: string;
  }): Promise<UserWarning> {
    const warning: UserWarning = {
      id: `warning-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      issuedBy: data.moderatorId,
      reason: data.reason,
      severity: data.severity,
      relatedContentId: data.relatedContentId,
      issuedAt: new Date(),
      acknowledged: false,
    };

    this.userWarnings.set(warning.id, warning);
    return warning;
  }

  /**
   * Get user warnings
   */
  async getUserWarnings(userId: string): Promise<UserWarning[]> {
    return Array.from(this.userWarnings.values())
      .filter((w) => w.userId === userId)
      .sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime());
  }

  /**
   * Create moderation queue
   */
  async createQueue(data: {
    name: string;
    filters: ContentQueue['filters'];
    assignedModerators?: string[];
  }): Promise<ContentQueue> {
    const queue: ContentQueue = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      filters: data.filters,
      items: [],
      assignedModerators: data.assignedModerators || [],
      createdAt: new Date(),
    };

    // Populate queue based on filters
    queue.items = await this.getItemsForQueue(queue.filters);

    this.contentQueues.set(queue.id, queue);
    return queue;
  }

  /**
   * Get items for queue
   */
  private async getItemsForQueue(filters: ContentQueue['filters']): Promise<string[]> {
    let items = Array.from(this.moderatedContent.values());

    if (filters.contentType) {
      items = items.filter((i) => filters.contentType!.includes(i.contentType));
    }

    if (filters.status) {
      items = items.filter((i) => filters.status!.includes(i.status));
    }

    return items.map((i) => i.id);
  }

  /**
   * Get pending reports
   */
  async getPendingReports(limit: number = 50): Promise<ContentReport[]> {
    return Array.from(this.contentReports.values())
      .filter((r) => r.status === 'pending' || r.status === 'reviewing')
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, limit);
  }

  /**
   * Get moderation analytics
   */
  async getStats(period: 'day' | 'week' | 'month' = 'week'): Promise<{
    reports: {
      total: number;
      pending: number;
      resolved: number;
      byReason: Record<string, number>;
      byType: Record<string, number>;
    };
    moderation: {
      totalModerated: number;
      approved: number;
      rejected: number;
      flagged: number;
      quarantined: number;
    };
    rules: {
      totalRules: number;
      activeRules: number;
      totalTriggered: number;
      topRules: { name: string; triggered: number }[];
    };
    warnings: {
      total: number;
      bySeverity: Record<string, number>;
    };
  }> {
    const now = new Date();
    const periodMs = period === 'day' ? 86400000 : period === 'week' ? 604800000 : 2592000000;
    const cutoff = new Date(now.getTime() - periodMs);

    const reports = Array.from(this.contentReports.values()).filter((r) => r.createdAt >= cutoff);

    const byReason = reports.reduce(
      (acc, r) => {
        acc[r.reportReason] = (acc[r.reportReason] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byType = reports.reduce(
      (acc, r) => {
        acc[r.contentType] = (acc[r.contentType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const moderated = Array.from(this.moderatedContent.values()).filter(
      (m) => m.moderatedAt && m.moderatedAt >= cutoff
    );

    const rules = Array.from(this.moderationRules.values());
    const topRules = rules
      .map((r) => ({ name: r.name, triggered: r.triggeredCount }))
      .sort((a, b) => b.triggered - a.triggered)
      .slice(0, 5);

    const warnings = Array.from(this.userWarnings.values()).filter((w) => w.issuedAt >= cutoff);

    const warnBySeverity = warnings.reduce(
      (acc, w) => {
        acc[w.severity] = (acc[w.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      reports: {
        total: reports.length,
        pending: reports.filter((r) => r.status === 'pending').length,
        resolved: reports.filter((r) => r.status === 'resolved').length,
        byReason,
        byType,
      },
      moderation: {
        totalModerated: moderated.length,
        approved: moderated.filter((m) => m.status === 'approved').length,
        rejected: moderated.filter((m) => m.status === 'rejected').length,
        flagged: moderated.filter((m) => m.status === 'flagged').length,
        quarantined: moderated.filter((m) => m.status === 'quarantined').length,
      },
      rules: {
        totalRules: rules.length,
        activeRules: rules.filter((r) => r.active).length,
        totalTriggered: rules.reduce((sum, r) => sum + r.triggeredCount, 0),
        topRules,
      },
      warnings: {
        total: warnings.length,
        bySeverity: warnBySeverity,
      },
    };
  }

  /**
   * Calculate priority based on reason
   */
  private calculatePriority(reason: ContentReport['reportReason']): ContentReport['priority'] {
    switch (reason) {
      case 'fraud':
      case 'harassment':
        return 'critical';
      case 'inappropriate':
      case 'misinformation':
        return 'high';
      case 'spam':
      case 'copyright':
        return 'medium';
      default:
        return 'low';
    }
  }

  /**
   * Initialize default data
   */
  private initializeDefaultData(): void {
    // Create default moderation rules
    this.createModerationRule({
      name: 'Profanity Filter',
      type: 'keyword',
      contentTypes: ['review', 'comment', 'message'],
      rule: {
        keywords: ['profanity1', 'profanity2'], // Example keywords
      },
      action: 'flag',
      severity: 'medium',
    });

    this.createModerationRule({
      name: 'Spam Detection',
      type: 'pattern',
      contentTypes: ['review', 'comment'],
      rule: {
        pattern: '(http|www).*?(click|buy|discount).*?(now|here)',
      },
      action: 'quarantine',
      severity: 'high',
    });

    this.createModerationRule({
      name: 'Negative Sentiment',
      type: 'sentiment',
      contentTypes: ['review'],
      rule: {
        threshold: 3,
      },
      action: 'flag',
      severity: 'low',
    });

    // Create default queues
    this.createQueue({
      name: 'High Priority Reports',
      filters: {
        status: ['pending', 'flagged'],
      },
    });

    this.createQueue({
      name: 'Quarantined Content',
      filters: {
        status: ['quarantined'],
      },
    });
  }
}

// Singleton instance
export const adminContentModerationSystem = new AdminContentModerationSystem();
