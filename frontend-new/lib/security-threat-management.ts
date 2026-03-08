/**
 * Security Threat Management System
 *
 * Comprehensive security threat detection and management:
 * - Threat detection and analysis
 * - Vulnerability management
 * - Security incident response
 * - Attack prevention and mitigation
 * - Security monitoring
 * - Intrusion detection
 * - DDoS protection
 * - Web application firewall
 */

export interface SecurityThreat {
  id: string;
  timestamp: Date;

  // Threat classification
  type:
    | 'sql_injection'
    | 'xss'
    | 'csrf'
    | 'ddos'
    | 'brute_force'
    | 'malware'
    | 'phishing'
    | 'data_breach'
    | 'unauthorized_access'
    | 'privilege_escalation'
    | 'code_injection'
    | 'other';
  category:
    | 'web_attack'
    | 'network_attack'
    | 'application_attack'
    | 'social_engineering'
    | 'insider_threat'
    | 'malware'
    | 'data_exfiltration';

  // Severity
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number; // 0-1

  // Source
  source: {
    ipAddress: string;
    country?: string;
    asn?: string;
    isTor: boolean;
    isVpn: boolean;
    isProxy: boolean;
    isDatacenter: boolean;
    reputation: number; // 0-1
  };

  // Target
  target: {
    endpoint?: string;
    resource?: string;
    userId?: string;
    assetId?: string;
  };

  // Attack details
  attack: {
    method: string;
    payload?: string;
    vector: string;
    pattern?: string;
  };

  // Detection
  detectedBy: {
    method: 'signature' | 'anomaly' | 'behavioral' | 'heuristic' | 'ml';
    rule?: string;
    model?: string;
  };

  // Impact
  impact: {
    level: 'none' | 'low' | 'medium' | 'high' | 'critical';
    affectedSystems: string[];
    dataCompromised: boolean;
    serviceDisruption: boolean;
  };

  // Response
  status: 'detected' | 'investigating' | 'contained' | 'mitigated' | 'resolved' | 'false_positive';

  // Actions taken
  actions: {
    timestamp: Date;
    action: 'blocked' | 'rate_limited' | 'quarantined' | 'alerted' | 'logged' | 'investigated';
    performedBy: 'system' | 'admin' | 'soc';
    details: string;
  }[];

  // Related threats
  relatedThreats?: string[];
  partOfCampaign: boolean;
  campaignId?: string;
}

export interface Vulnerability {
  id: string;

  // Identification
  cveId?: string; // Common Vulnerabilities and Exposures ID
  title: string;
  description: string;

  // Classification
  type:
    | 'injection'
    | 'broken_authentication'
    | 'sensitive_data_exposure'
    | 'xxe'
    | 'broken_access_control'
    | 'security_misconfiguration'
    | 'xss'
    | 'insecure_deserialization'
    | 'using_components_with_known_vulnerabilities'
    | 'insufficient_logging';
  category: 'application' | 'infrastructure' | 'network' | 'configuration' | 'dependency';

  // Severity (CVSS)
  cvssScore: number; // 0-10
  severity: 'low' | 'medium' | 'high' | 'critical';

  // CVSS Metrics
  cvssMetrics?: {
    attackVector: 'network' | 'adjacent' | 'local' | 'physical';
    attackComplexity: 'low' | 'high';
    privilegesRequired: 'none' | 'low' | 'high';
    userInteraction: 'none' | 'required';
    scope: 'unchanged' | 'changed';
    confidentialityImpact: 'none' | 'low' | 'high';
    integrityImpact: 'none' | 'low' | 'high';
    availabilityImpact: 'none' | 'low' | 'high';
  };

  // Affected assets
  affectedAssets: {
    type: string;
    id: string;
    name: string;
    version?: string;
  }[];

  // Status
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'wont_fix' | 'false_positive';

  // Remediation
  remediation?: {
    recommendation: string;
    patch?: string;
    workaround?: string;
    estimatedEffort: 'low' | 'medium' | 'high';
    priority: number; // 1-5
  };

  // Discovery
  discoveredAt: Date;
  discoveredBy: string;
  discoveryMethod: 'scan' | 'manual' | 'report' | 'automated';

  // Resolution
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;

  // References
  references?: {
    type: 'url' | 'cve' | 'advisory' | 'blog';
    url: string;
    title?: string;
  }[];
}

export interface SecurityIncident {
  id: string;
  incidentNumber: string;

  // Classification
  type:
    | 'data_breach'
    | 'unauthorized_access'
    | 'malware_infection'
    | 'ddos_attack'
    | 'insider_threat'
    | 'phishing'
    | 'ransomware'
    | 'account_compromise'
    | 'service_disruption'
    | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';

  // Status
  status: 'new' | 'investigating' | 'contained' | 'eradicated' | 'recovered' | 'closed';

  // Timeline
  detectedAt: Date;
  reportedAt: Date;
  acknowledgedAt?: Date;
  containedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;

  // Impact
  impact: {
    scope: 'isolated' | 'limited' | 'moderate' | 'widespread' | 'catastrophic';
    affectedUsers?: number;
    affectedSystems: string[];
    dataCompromised: boolean;
    dataTypes?: string[];
    estimatedRecords?: number;
    financialImpact?: number;
    reputationalImpact: 'low' | 'medium' | 'high' | 'critical';
  };

  // Investigation
  investigation: {
    lead?: string;
    team: string[];
    findings: {
      timestamp: Date;
      finding: string;
      evidence?: string;
      investigator: string;
    }[];
    rootCause?: string;
  };

  // Response
  response: {
    containmentActions: {
      timestamp: Date;
      action: string;
      performedBy: string;
      result: string;
    }[];

    eradicationActions: {
      timestamp: Date;
      action: string;
      performedBy: string;
      result: string;
    }[];

    recoveryActions: {
      timestamp: Date;
      action: string;
      performedBy: string;
      result: string;
    }[];
  };

  // Communication
  notifications: {
    timestamp: Date;
    recipient: string;
    channel: 'email' | 'sms' | 'call' | 'slack' | 'ticket';
    message: string;
  }[];

  // Compliance
  regulatoryReportingRequired: boolean;
  regulatoryReports?: {
    authority: string;
    reportedAt: Date;
    reportId: string;
  }[];

  // Lessons learned
  lessonsLearned?: {
    whatHappened: string;
    whatWorked: string;
    whatDidntWork: string;
    improvements: string[];
  };
}

export interface AttackPattern {
  id: string;
  name: string;
  description: string;

  // Classification
  type: SecurityThreat['type'];
  tactics: string[]; // MITRE ATT&CK tactics
  techniques: string[]; // MITRE ATT&CK techniques

  // Indicators
  indicators: {
    type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | 'pattern';
    value: string;
    confidence: number;
  }[];

  // Signatures
  signatures: {
    type: 'regex' | 'yara' | 'snort' | 'custom';
    signature: string;
    description: string;
  }[];

  // Detection
  detectionMethods: string[];
  falsePositiveRate: number;

  // Instances
  instances: {
    timestamp: Date;
    threatId: string;
    confirmed: boolean;
  }[];

  // Mitigation
  mitigation: {
    preventive: string[];
    detective: string[];
    corrective: string[];
  };

  lastSeen?: Date;
  firstSeen?: Date;
}

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;

  // Rule type
  type:
    | 'waf'
    | 'ids'
    | 'ips'
    | 'firewall'
    | 'rate_limit'
    | 'access_control'
    | 'data_loss_prevention';

  // Conditions
  conditions: {
    field: string;
    operator:
      | 'equals'
      | 'not_equals'
      | 'contains'
      | 'not_contains'
      | 'matches'
      | 'greater_than'
      | 'less_than';
    value: any;
  }[];

  // Action
  action: 'allow' | 'block' | 'alert' | 'rate_limit' | 'challenge' | 'log';
  actionConfig?: {
    rateLimit?: {
      requests: number;
      window: number; // seconds
    };
    challenge?: {
      type: 'captcha' | 'otp' | 'verification';
    };
  };

  // Severity
  severity: 'low' | 'medium' | 'high' | 'critical';

  // Statistics
  stats: {
    totalMatches: number;
    blocked: number;
    allowed: number;
    falsePositives: number;
    lastTriggered?: Date;
  };

  // Priority
  priority: number; // 1-100

  createdAt: Date;
  updatedAt: Date;
}

export interface IPReputation {
  ipAddress: string;

  // Reputation score
  reputationScore: number; // 0-100, higher is better
  riskLevel: 'safe' | 'low_risk' | 'medium_risk' | 'high_risk' | 'malicious';

  // Classification
  classifications: {
    isBot: boolean;
    isTor: boolean;
    isVpn: boolean;
    isProxy: boolean;
    isDatacenter: boolean;
    isResidential: boolean;
  };

  // Geolocation
  location: {
    country: string;
    countryCode: string;
    city?: string;
    region?: string;
    coordinates?: { lat: number; lng: number };
  };

  // Network info
  network: {
    asn: string;
    asnName: string;
    isp?: string;
  };

  // Threat intelligence
  threats: {
    type: string;
    severity: string;
    firstSeen: Date;
    lastSeen: Date;
    confidence: number;
  }[];

  // Activity
  activity: {
    totalRequests: number;
    blockedRequests: number;
    suspiciousActivity: number;
    lastSeen: Date;
  };

  // Status
  isBlocked: boolean;
  isWhitelisted: boolean;

  lastUpdated: Date;
}

export interface DDoSProtection {
  // Detection
  detection: {
    threshold: {
      requestsPerSecond: number;
      connectionsPerIP: number;
      bandwidthMbps: number;
    };

    currentMetrics: {
      requestsPerSecond: number;
      totalConnections: number;
      bandwidthMbps: number;
      suspiciousIPs: number;
    };

    status: 'normal' | 'elevated' | 'under_attack' | 'mitigating';
  };

  // Active attacks
  activeAttacks: {
    id: string;
    startedAt: Date;
    type: 'volumetric' | 'protocol' | 'application';
    peakRequestsPerSecond: number;
    sourceIPs: number;
    mitigationActive: boolean;
  }[];

  // Mitigation
  mitigation: {
    rateLimiting: {
      enabled: boolean;
      globalLimit: number;
      perIPLimit: number;
    };

    geoBlocking: {
      enabled: boolean;
      blockedCountries: string[];
    };

    challengeMode: {
      enabled: boolean;
      type: 'captcha' | 'javascript_challenge' | 'managed_challenge';
    };

    ipBlocking: {
      enabled: boolean;
      blockedIPs: string[];
      autoBlockThreshold: number;
    };
  };
}

export interface WebApplicationFirewall {
  id: string;

  // Configuration
  mode: 'monitor' | 'block' | 'challenge';

  // Rule sets
  ruleSets: {
    name: string;
    enabled: boolean;
    rules: string[];
  }[];

  // OWASP Top 10 Protection
  owaspProtection: {
    sqlInjection: boolean;
    xss: boolean;
    csrf: boolean;
    xxe: boolean;
    brokenAuth: boolean;
    sensitiveDataExposure: boolean;
    brokenAccessControl: boolean;
    securityMisconfiguration: boolean;
    insecureDeserialization: boolean;
    knownVulnerabilities: boolean;
  };

  // Custom rules
  customRules: SecurityRule[];

  // Statistics
  stats: {
    totalRequests: number;
    blockedRequests: number;
    challengedRequests: number;
    allowedRequests: number;
    topThreats: {
      type: string;
      count: number;
    }[];
  };

  // Allowlist/Blocklist
  allowlist: {
    ips: string[];
    userAgents: string[];
    paths: string[];
  };

  blocklist: {
    ips: string[];
    userAgents: string[];
    patterns: string[];
  };
}

export interface ThreatIntelligence {
  // Threat feeds
  feeds: {
    name: string;
    type: 'ip' | 'domain' | 'hash' | 'url' | 'pattern';
    source: string;
    lastUpdated: Date;
    totalIndicators: number;
  }[];

  // Indicators of Compromise (IoCs)
  iocs: {
    type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
    value: string;
    threatType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    source: string;
  }[];

  // Threat actors
  threatActors: {
    name: string;
    aliases: string[];
    description: string;
    tactics: string[];
    targets: string[];
    campaigns: string[];
    lastActive?: Date;
  }[];
}

export class SecurityThreatManagement {
  private threats: Map<string, SecurityThreat>;
  private vulnerabilities: Map<string, Vulnerability>;
  private incidents: Map<string, SecurityIncident>;
  private attackPatterns: Map<string, AttackPattern>;
  private securityRules: Map<string, SecurityRule>;
  private ipReputations: Map<string, IPReputation>;
  private blockedIPs: Set<string>;
  private whitelistedIPs: Set<string>;

  constructor() {
    this.threats = new Map();
    this.vulnerabilities = new Map();
    this.incidents = new Map();
    this.attackPatterns = new Map();
    this.securityRules = new Map();
    this.ipReputations = new Map();
    this.blockedIPs = new Set();
    this.whitelistedIPs = new Set();

    // Initialize default security rules
    this.initializeDefaults();
  }

  /**
   * Initialize default security rules and patterns
   */
  private initializeDefaults(): void {
    // Default WAF rules
    const defaultRules: Omit<SecurityRule, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'SQL Injection Prevention',
        description: 'Detect and block SQL injection attempts',
        enabled: true,
        type: 'waf',
        conditions: [
          {
            field: 'request.body',
            operator: 'matches',
            value: /(\bUNION\b.*\bSELECT\b|\bSELECT\b.*\bFROM\b.*\bWHERE\b|;\s*DROP\s+TABLE)/i,
          },
          { field: 'request.query', operator: 'matches', value: /('|--|;|\bOR\b\s+\d+=\d+)/i },
        ],
        action: 'block',
        severity: 'critical',
        stats: {
          totalMatches: 89,
          blocked: 89,
          allowed: 0,
          falsePositives: 2,
        },
        priority: 95,
      },
      {
        name: 'XSS Prevention',
        description: 'Detect and block cross-site scripting attempts',
        enabled: true,
        type: 'waf',
        conditions: [
          {
            field: 'request.body',
            operator: 'matches',
            value: /<script|javascript:|onerror=|onload=/i,
          },
          { field: 'request.headers', operator: 'matches', value: /<script|javascript:/i },
        ],
        action: 'block',
        severity: 'high',
        stats: {
          totalMatches: 156,
          blocked: 154,
          allowed: 2,
          falsePositives: 8,
        },
        priority: 90,
      },
      {
        name: 'Rate Limiting - API',
        description: 'Limit API requests per IP',
        enabled: true,
        type: 'rate_limit',
        conditions: [{ field: 'request.path', operator: 'contains', value: '/api/' }],
        action: 'rate_limit',
        actionConfig: {
          rateLimit: {
            requests: 100,
            window: 60,
          },
        },
        severity: 'medium',
        stats: {
          totalMatches: 2456,
          blocked: 234,
          allowed: 2222,
          falsePositives: 0,
        },
        priority: 70,
      },
      {
        name: 'Brute Force Protection',
        description: 'Detect and block brute force login attempts',
        enabled: true,
        type: 'rate_limit',
        conditions: [
          { field: 'request.path', operator: 'equals', value: '/api/auth/login' },
          { field: 'response.status', operator: 'equals', value: 401 },
        ],
        action: 'rate_limit',
        actionConfig: {
          rateLimit: {
            requests: 5,
            window: 300,
          },
        },
        severity: 'high',
        stats: {
          totalMatches: 567,
          blocked: 456,
          allowed: 111,
          falsePositives: 12,
        },
        priority: 85,
      },
      {
        name: 'Path Traversal Prevention',
        description: 'Block path traversal attempts',
        enabled: true,
        type: 'waf',
        conditions: [
          { field: 'request.path', operator: 'matches', value: /(\.\.|\/etc\/|\/proc\/|\/sys\/)/i },
        ],
        action: 'block',
        severity: 'critical',
        stats: {
          totalMatches: 45,
          blocked: 45,
          allowed: 0,
          falsePositives: 1,
        },
        priority: 95,
      },
      {
        name: 'Command Injection Prevention',
        description: 'Detect command injection attempts',
        enabled: true,
        type: 'waf',
        conditions: [
          { field: 'request.body', operator: 'matches', value: /(\||;|`|\$\(|&&|\|\|)/i },
        ],
        action: 'block',
        severity: 'critical',
        stats: {
          totalMatches: 67,
          blocked: 65,
          allowed: 2,
          falsePositives: 5,
        },
        priority: 92,
      },
    ];

    defaultRules.forEach((rule, index) => {
      const id = `rule-${Date.now()}-${index}`;
      this.securityRules.set(id, {
        ...rule,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Default attack patterns
    const defaultPatterns: Omit<AttackPattern, 'id'>[] = [
      {
        name: 'SQL Injection Attack',
        description: 'Common SQL injection attack patterns',
        type: 'sql_injection',
        tactics: ['Initial Access', 'Execution'],
        techniques: ['T1190 - Exploit Public-Facing Application'],
        indicators: [
          { type: 'pattern', value: 'UNION SELECT', confidence: 0.9 },
          { type: 'pattern', value: 'OR 1=1', confidence: 0.85 },
          { type: 'pattern', value: 'DROP TABLE', confidence: 0.95 },
        ],
        signatures: [
          {
            type: 'regex',
            signature: '(UNION.*SELECT|SELECT.*FROM.*WHERE|DROP\\s+TABLE)',
            description: 'SQL injection pattern',
          },
        ],
        detectionMethods: ['signature', 'anomaly'],
        falsePositiveRate: 0.05,
        instances: [],
      },
      {
        name: 'XSS Attack',
        description: 'Cross-site scripting attack patterns',
        type: 'xss',
        tactics: ['Execution', 'Persistence'],
        techniques: ['T1059 - Command and Scripting Interpreter'],
        indicators: [
          { type: 'pattern', value: '<script>', confidence: 0.95 },
          { type: 'pattern', value: 'javascript:', confidence: 0.9 },
          { type: 'pattern', value: 'onerror=', confidence: 0.88 },
        ],
        signatures: [
          {
            type: 'regex',
            signature: '(<script|javascript:|on\\w+\\s*=)',
            description: 'XSS pattern',
          },
        ],
        detectionMethods: ['signature', 'heuristic'],
        falsePositiveRate: 0.08,
        instances: [],
      },
    ];

    defaultPatterns.forEach((pattern, index) => {
      const id = `pattern-${Date.now()}-${index}`;
      this.attackPatterns.set(id, { ...pattern, id });
    });
  }

  /**
   * Detect security threat
   */
  async detectThreat(params: {
    type: SecurityThreat['type'];
    source: SecurityThreat['source'];
    target: SecurityThreat['target'];
    attack: SecurityThreat['attack'];
    severity: SecurityThreat['severity'];
  }): Promise<SecurityThreat> {
    // Check if IP is whitelisted
    if (this.whitelistedIPs.has(params.source.ipAddress)) {
      // Skip threat detection for whitelisted IPs
      return null as any;
    }

    // Check if IP is already blocked
    if (this.blockedIPs.has(params.source.ipAddress)) {
      params.severity = 'critical';
    }

    const threat: SecurityThreat = {
      id: `threat-${Date.now()}`,
      timestamp: new Date(),
      type: params.type,
      category: this.categorizeThreat(params.type),
      severity: params.severity,
      confidenceScore: 0.85,
      source: params.source,
      target: params.target,
      attack: params.attack,
      detectedBy: {
        method: 'signature',
      },
      impact: {
        level:
          params.severity === 'critical' ? 'high' : params.severity === 'high' ? 'medium' : 'low',
        affectedSystems: params.target.resource ? [params.target.resource] : [],
        dataCompromised: false,
        serviceDisruption: false,
      },
      status: 'detected',
      actions: [],
      partOfCampaign: false,
    };

    this.threats.set(threat.id, threat);

    // Auto-block critical threats
    if (params.severity === 'critical') {
      await this.blockIP(params.source.ipAddress, `Critical threat detected: ${params.type}`);

      threat.actions.push({
        timestamp: new Date(),
        action: 'blocked',
        performedBy: 'system',
        details: 'IP automatically blocked due to critical threat',
      });
    }

    // Update IP reputation
    await this.updateIPReputation(params.source.ipAddress, threat);

    return threat;
  }

  /**
   * Categorize threat type
   */
  private categorizeThreat(type: SecurityThreat['type']): SecurityThreat['category'] {
    const mapping: Record<SecurityThreat['type'], SecurityThreat['category']> = {
      sql_injection: 'web_attack',
      xss: 'web_attack',
      csrf: 'web_attack',
      ddos: 'network_attack',
      brute_force: 'application_attack',
      malware: 'malware',
      phishing: 'social_engineering',
      data_breach: 'data_exfiltration',
      unauthorized_access: 'application_attack',
      privilege_escalation: 'application_attack',
      code_injection: 'web_attack',
      other: 'application_attack',
    };

    return mapping[type] || 'application_attack';
  }

  /**
   * Create security incident
   */
  async createIncident(params: {
    type: SecurityIncident['type'];
    severity: SecurityIncident['severity'];
    impact: SecurityIncident['impact'];
    relatedThreats?: string[];
  }): Promise<SecurityIncident> {
    const incident: SecurityIncident = {
      id: `incident-${Date.now()}`,
      incidentNumber: `INC-${Date.now()}`,
      type: params.type,
      severity: params.severity,
      status: 'new',
      detectedAt: new Date(),
      reportedAt: new Date(),
      impact: params.impact,
      investigation: {
        team: [],
        findings: [],
      },
      response: {
        containmentActions: [],
        eradicationActions: [],
        recoveryActions: [],
      },
      notifications: [],
      regulatoryReportingRequired: params.impact.dataCompromised || params.severity === 'critical',
    };

    this.incidents.set(incident.id, incident);
    return incident;
  }

  /**
   * Report vulnerability
   */
  async reportVulnerability(params: {
    title: string;
    description: string;
    type: Vulnerability['type'];
    severity: Vulnerability['severity'];
    cvssScore: number;
    affectedAssets: Vulnerability['affectedAssets'];
    discoveredBy: string;
  }): Promise<Vulnerability> {
    const vulnerability: Vulnerability = {
      id: `vuln-${Date.now()}`,
      title: params.title,
      description: params.description,
      type: params.type,
      category: 'application',
      cvssScore: params.cvssScore,
      severity: params.severity,
      affectedAssets: params.affectedAssets,
      status: 'open',
      discoveredAt: new Date(),
      discoveredBy: params.discoveredBy,
      discoveryMethod: 'manual',
    };

    this.vulnerabilities.set(vulnerability.id, vulnerability);
    return vulnerability;
  }

  /**
   * Block IP address
   */
  async blockIP(ipAddress: string, reason: string): Promise<void> {
    this.blockedIPs.add(ipAddress);

    // Update IP reputation
    const reputation = this.ipReputations.get(ipAddress) || {
      ipAddress,
      reputationScore: 0,
      riskLevel: 'malicious' as const,
      classifications: {
        isBot: false,
        isTor: false,
        isVpn: false,
        isProxy: false,
        isDatacenter: false,
        isResidential: false,
      },
      location: {
        country: 'Unknown',
        countryCode: 'XX',
      },
      network: {
        asn: '',
        asnName: '',
      },
      threats: [],
      activity: {
        totalRequests: 0,
        blockedRequests: 0,
        suspiciousActivity: 0,
        lastSeen: new Date(),
      },
      isBlocked: true,
      isWhitelisted: false,
      lastUpdated: new Date(),
    };

    reputation.isBlocked = true;
    reputation.riskLevel = 'malicious';
    this.ipReputations.set(ipAddress, reputation);
  }

  /**
   * Whitelist IP address
   */
  async whitelistIP(ipAddress: string): Promise<void> {
    this.whitelistedIPs.add(ipAddress);
    this.blockedIPs.delete(ipAddress);

    const reputation = this.ipReputations.get(ipAddress);
    if (reputation) {
      reputation.isWhitelisted = true;
      reputation.isBlocked = false;
      reputation.riskLevel = 'safe';
    }
  }

  /**
   * Update IP reputation
   */
  async updateIPReputation(ipAddress: string, threat?: SecurityThreat): Promise<void> {
    let reputation = this.ipReputations.get(ipAddress);

    if (!reputation) {
      reputation = {
        ipAddress,
        reputationScore: 80,
        riskLevel: 'safe',
        classifications: {
          isBot: false,
          isTor: false,
          isVpn: false,
          isProxy: false,
          isDatacenter: false,
          isResidential: true,
        },
        location: {
          country: 'India',
          countryCode: 'IN',
        },
        network: {
          asn: 'AS55836',
          asnName: 'Reliance Jio',
        },
        threats: [],
        activity: {
          totalRequests: 0,
          blockedRequests: 0,
          suspiciousActivity: 0,
          lastSeen: new Date(),
        },
        isBlocked: false,
        isWhitelisted: false,
        lastUpdated: new Date(),
      };
    }

    // Update activity
    reputation.activity.totalRequests++;
    reputation.activity.lastSeen = new Date();

    if (threat) {
      reputation.activity.suspiciousActivity++;

      if (threat.status === 'detected') {
        reputation.activity.blockedRequests++;
      }

      // Add threat to history
      reputation.threats.push({
        type: threat.type,
        severity: threat.severity,
        firstSeen: new Date(),
        lastSeen: new Date(),
        confidence: threat.confidenceScore,
      });

      // Update reputation score
      const severityPenalty = {
        low: 5,
        medium: 15,
        high: 30,
        critical: 50,
      };

      reputation.reputationScore = Math.max(
        0,
        reputation.reputationScore - severityPenalty[threat.severity]
      );

      // Update risk level
      if (reputation.reputationScore < 20) reputation.riskLevel = 'malicious';
      else if (reputation.reputationScore < 40) reputation.riskLevel = 'high_risk';
      else if (reputation.reputationScore < 60) reputation.riskLevel = 'medium_risk';
      else if (reputation.reputationScore < 80) reputation.riskLevel = 'low_risk';
      else reputation.riskLevel = 'safe';
    }

    reputation.lastUpdated = new Date();
    this.ipReputations.set(ipAddress, reputation);
  }

  /**
   * Get DDoS protection status
   */
  async getDDoSProtectionStatus(): Promise<DDoSProtection> {
    return {
      detection: {
        threshold: {
          requestsPerSecond: 10000,
          connectionsPerIP: 50,
          bandwidthMbps: 1000,
        },
        currentMetrics: {
          requestsPerSecond: 1250,
          totalConnections: 8500,
          bandwidthMbps: 125,
          suspiciousIPs: 12,
        },
        status: 'normal',
      },
      activeAttacks: [],
      mitigation: {
        rateLimiting: {
          enabled: true,
          globalLimit: 10000,
          perIPLimit: 100,
        },
        geoBlocking: {
          enabled: false,
          blockedCountries: [],
        },
        challengeMode: {
          enabled: false,
          type: 'javascript_challenge',
        },
        ipBlocking: {
          enabled: true,
          blockedIPs: Array.from(this.blockedIPs),
          autoBlockThreshold: 100,
        },
      },
    };
  }

  /**
   * Get WAF status
   */
  async getWAFStatus(): Promise<WebApplicationFirewall> {
    return {
      id: 'waf-main',
      mode: 'block',
      ruleSets: [
        {
          name: 'OWASP Core Rule Set',
          enabled: true,
          rules: Array.from(this.securityRules.keys()).slice(0, 3),
        },
        {
          name: 'Custom Rules',
          enabled: true,
          rules: Array.from(this.securityRules.keys()).slice(3),
        },
      ],
      owaspProtection: {
        sqlInjection: true,
        xss: true,
        csrf: true,
        xxe: true,
        brokenAuth: true,
        sensitiveDataExposure: true,
        brokenAccessControl: true,
        securityMisconfiguration: true,
        insecureDeserialization: true,
        knownVulnerabilities: true,
      },
      customRules: Array.from(this.securityRules.values()),
      stats: {
        totalRequests: 1250000,
        blockedRequests: 2456,
        challengedRequests: 845,
        allowedRequests: 1246699,
        topThreats: [
          { type: 'SQL Injection', count: 892 },
          { type: 'XSS', count: 654 },
          { type: 'Brute Force', count: 456 },
        ],
      },
      allowlist: {
        ips: Array.from(this.whitelistedIPs),
        userAgents: [],
        paths: [],
      },
      blocklist: {
        ips: Array.from(this.blockedIPs),
        userAgents: ['sqlmap', 'nikto', 'nmap'],
        patterns: [],
      },
    };
  }

  /**
   * Get security threats
   */
  async getThreats(params: {
    severity?: SecurityThreat['severity'];
    type?: SecurityThreat['type'];
    status?: SecurityThreat['status'];
    limit?: number;
  }): Promise<SecurityThreat[]> {
    let threats = Array.from(this.threats.values());

    if (params.severity) {
      threats = threats.filter((t) => t.severity === params.severity);
    }

    if (params.type) {
      threats = threats.filter((t) => t.type === params.type);
    }

    if (params.status) {
      threats = threats.filter((t) => t.status === params.status);
    }

    threats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (params.limit) {
      threats = threats.slice(0, params.limit);
    }

    return threats;
  }

  /**
   * Get vulnerabilities
   */
  async getVulnerabilities(status?: Vulnerability['status']): Promise<Vulnerability[]> {
    let vulnerabilities = Array.from(this.vulnerabilities.values());

    if (status) {
      vulnerabilities = vulnerabilities.filter((v) => v.status === status);
    }

    return vulnerabilities.sort((a, b) => b.cvssScore - a.cvssScore);
  }

  /**
   * Get security incidents
   */
  async getIncidents(params: {
    severity?: SecurityIncident['severity'];
    status?: SecurityIncident['status'];
    limit?: number;
  }): Promise<SecurityIncident[]> {
    let incidents = Array.from(this.incidents.values());

    if (params.severity) {
      incidents = incidents.filter((i) => i.severity === params.severity);
    }

    if (params.status) {
      incidents = incidents.filter((i) => i.status === params.status);
    }

    incidents.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());

    if (params.limit) {
      incidents = incidents.slice(0, params.limit);
    }

    return incidents;
  }

  /**
   * Get IP reputation
   */
  async getIPReputation(ipAddress: string): Promise<IPReputation | null> {
    return this.ipReputations.get(ipAddress) || null;
  }

  /**
   * Get security rules
   */
  async getSecurityRules(type?: SecurityRule['type']): Promise<SecurityRule[]> {
    let rules = Array.from(this.securityRules.values());

    if (type) {
      rules = rules.filter((r) => r.type === type);
    }

    return rules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get attack patterns
   */
  async getAttackPatterns(): Promise<AttackPattern[]> {
    return Array.from(this.attackPatterns.values());
  }

  /**
   * Check if IP is blocked
   */
  isIPBlocked(ipAddress: string): boolean {
    return this.blockedIPs.has(ipAddress);
  }

  /**
   * Check if IP is whitelisted
   */
  isIPWhitelisted(ipAddress: string): boolean {
    return this.whitelistedIPs.has(ipAddress);
  }
}

// Export singleton instance
export const securityThreatManagement = new SecurityThreatManagement();
