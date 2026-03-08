/**
 * Email & Communication Services System
 *
 * Multi-channel communication system supporting email, SMS, push notifications,
 * in-app messaging, and WhatsApp. Includes templates, campaigns, and analytics.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type CommunicationChannel = 'email' | 'sms' | 'push' | 'in-app' | 'whatsapp' | 'webhook';

export type EmailProvider =
  | 'sendgrid'
  | 'mailgun'
  | 'ses'
  | 'postmark'
  | 'mailchimp'
  | 'sendinblue';

export type SmsProvider = 'twilio' | 'vonage' | 'plivo' | 'aws-sns';

export type PushProvider = 'firebase' | 'onesignal' | 'pusher' | 'apns' | 'fcm';

export type MessageStatus =
  | 'pending'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'bounced'
  | 'rejected'
  | 'spam';

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'paused'
  | 'cancelled'
  | 'completed';

export type TemplateCategory =
  | 'transactional'
  | 'marketing'
  | 'notification'
  | 'welcome'
  | 'order'
  | 'shipping'
  | 'newsletter'
  | 'promotional'
  | 'reminder'
  | 'confirmation';

export type TriggerType =
  | 'user-signup'
  | 'order-placed'
  | 'order-shipped'
  | 'order-delivered'
  | 'payment-received'
  | 'cart-abandoned'
  | 'review-request'
  | 'price-drop'
  | 'product-restock'
  | 'custom';

export interface ProviderConfiguration {
  id: string;
  channel: CommunicationChannel;
  provider: EmailProvider | SmsProvider | PushProvider | string;
  name: string;
  enabled: boolean;

  credentials: {
    apiKey: string;
    apiSecret?: string;
    senderId?: string;
    fromEmail?: string;
    fromName?: string;
    replyTo?: string;
    environment: 'sandbox' | 'production';
  };

  settings: {
    rateLimit: {
      maxPerSecond: number;
      maxPerMinute: number;
      maxPerHour: number;
      maxPerDay: number;
    };

    retry: {
      enabled: boolean;
      maxAttempts: number;
      backoffMultiplier: number;
    };

    tracking: {
      opens: boolean;
      clicks: boolean;
      unsubscribes: boolean;
    };

    validation: {
      emailVerification: boolean;
      phoneVerification: boolean;
    };
  };

  templates: {
    defaultTemplate?: string;
    headerTemplate?: string;
    footerTemplate?: string;
  };

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastUsed?: Date;
  };
}

export interface MessageTemplate {
  id: string;
  name: string;
  slug: string;
  category: TemplateCategory;
  channel: CommunicationChannel;

  subject?: string; // For email

  content: {
    html?: string;
    text?: string;
    json?: any; // For structured messages
  };

  variables: Array<{
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
    required: boolean;
    defaultValue?: any;
    description?: string;
  }>;

  design?: {
    layout: string;
    theme: string;
    customCss?: string;
  };

  localization?: {
    defaultLocale: string;
    translations: Record<
      string,
      {
        subject?: string;
        html?: string;
        text?: string;
      }
    >;
  };

  metadata: {
    version: number;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
  };

  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  };

  active: boolean;
}

export interface Message {
  id: string;
  channel: CommunicationChannel;
  provider: string;

  recipient: {
    userId?: string;
    email?: string;
    phone?: string;
    deviceToken?: string;
    name?: string;

    preferences?: {
      language?: string;
      timezone?: string;
      optedIn: boolean;
    };
  };

  sender?: {
    email?: string;
    phone?: string;
    name?: string;
  };

  template?: {
    id: string;
    name: string;
    variables: Record<string, any>;
  };

  content: {
    subject?: string;
    html?: string;
    text?: string;
    body?: string;
    title?: string;

    attachments?: Array<{
      filename: string;
      contentType: string;
      url: string;
      size: number;
    }>;

    media?: Array<{
      type: 'image' | 'video' | 'audio';
      url: string;
    }>;
  };

  status: MessageStatus;

  timeline: {
    created: Date;
    queued?: Date;
    sent?: Date;
    delivered?: Date;
    opened?: Date;
    clicked?: Date;
    failed?: Date;
  };

  tracking: {
    opens: number;
    clicks: number;
    lastOpened?: Date;
    lastClicked?: Date;

    links?: Array<{
      url: string;
      clicks: number;
    }>;

    location?: {
      ip?: string;
      country?: string;
      city?: string;
    };

    device?: {
      type: 'desktop' | 'mobile' | 'tablet';
      os?: string;
      browser?: string;
    };
  };

  delivery: {
    attempts: number;
    lastAttempt?: Date;

    response?: {
      code: string;
      message: string;
      providerId?: string;
    };

    error?: {
      code: string;
      message: string;
      retryable: boolean;
    };
  };

  metadata: {
    campaignId?: string;
    triggerId?: string;
    tags?: string[];
    customData?: Record<string, any>;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'one-time' | 'recurring' | 'automated';
  channel: CommunicationChannel;

  status: CampaignStatus;

  template: {
    id: string;
    name: string;
    preview?: string;
  };

  audience: {
    type: 'all' | 'segment' | 'list' | 'custom';

    segments?: string[];
    listIds?: string[];

    filters?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;

    totalRecipients: number;
    estimatedReach: number;
  };

  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';

    sendAt?: Date;
    timezone?: string;

    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      dayOfWeek?: number;
      dayOfMonth?: number;
      time: string;
      endDate?: Date;
    };
  };

  settings: {
    sendFrom: {
      name: string;
      email?: string;
      phone?: string;
    };

    replyTo?: string;

    tracking: {
      opens: boolean;
      clicks: boolean;
      conversions: boolean;
    };

    abTest?: {
      enabled: boolean;
      variants: Array<{
        id: string;
        name: string;
        templateId: string;
        percentage: number;
      }>;
      winnerCriteria: 'opens' | 'clicks' | 'conversions';
      testDuration: number; // hours
    };

    throttling?: {
      enabled: boolean;
      messagesPerHour: number;
    };
  };

  progress: {
    sent: number;
    delivered: number;
    failed: number;
    pending: number;

    startedAt?: Date;
    completedAt?: Date;
  };

  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    complained: number;

    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;

    revenue?: number;
    conversions?: number;
    conversionRate?: number;
  };

  metadata: {
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface AutomationTrigger {
  id: string;
  name: string;
  type: TriggerType;
  enabled: boolean;

  conditions: Array<{
    field: string;
    operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'exists';
    value: any;
  }>;

  delay?: {
    amount: number;
    unit: 'minutes' | 'hours' | 'days';
  };

  actions: Array<{
    type: 'send-message' | 'add-to-segment' | 'update-profile' | 'webhook';
    channel?: CommunicationChannel;
    templateId?: string;

    config?: Record<string, any>;
  }>;

  frequency: {
    limit?: number; // Max times per user
    cooldown?: number; // Hours between triggers
  };

  stats: {
    triggered: number;
    executed: number;
    failed: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ContactList {
  id: string;
  name: string;
  description?: string;

  type: 'static' | 'dynamic';

  contacts: Array<{
    userId?: string;
    email?: string;
    phone?: string;
    name?: string;

    customFields?: Record<string, any>;

    status: 'active' | 'unsubscribed' | 'bounced' | 'complained';

    addedAt: Date;
  }>;

  criteria?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;

  metadata: {
    totalContacts: number;
    activeContacts: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastSync?: Date;
  };
}

export interface UserPreferences {
  userId: string;

  channels: {
    email: {
      enabled: boolean;
      address: string;
      verified: boolean;

      categories: Record<TemplateCategory, boolean>;
    };

    sms: {
      enabled: boolean;
      phone?: string;
      verified: boolean;

      categories: Record<TemplateCategory, boolean>;
    };

    push: {
      enabled: boolean;
      devices: Array<{
        token: string;
        platform: 'ios' | 'android' | 'web';
        enabled: boolean;
      }>;

      categories: Record<TemplateCategory, boolean>;
    };

    inApp: {
      enabled: boolean;
      categories: Record<TemplateCategory, boolean>;
    };
  };

  language: string;
  timezone: string;

  doNotDisturb?: {
    enabled: boolean;
    startTime: string; // HH:MM
    endTime: string; // HH:MM
  };

  frequency: {
    maxPerDay?: number;
    maxPerWeek?: number;
  };

  updatedAt: Date;
}

export interface InAppNotification {
  id: string;
  userId: string;

  type: 'info' | 'success' | 'warning' | 'error' | 'promotional';

  title: string;
  message: string;

  icon?: string;
  image?: string;

  action?: {
    type: 'url' | 'deep-link' | 'custom';
    url?: string;
    data?: Record<string, any>;
  };

  priority: 'low' | 'normal' | 'high' | 'urgent';

  status: 'unread' | 'read' | 'dismissed' | 'archived';

  expiresAt?: Date;

  metadata?: {
    campaignId?: string;
    tags?: string[];
  };

  readAt?: Date;
  dismissedAt?: Date;

  createdAt: Date;
}

export interface CommunicationAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  overview: {
    totalSent: number;
    delivered: number;
    failed: number;

    deliveryRate: number;

    byChannel: Record<
      CommunicationChannel,
      {
        sent: number;
        delivered: number;
        deliveryRate: number;
      }
    >;
  };

  engagement: {
    opens: number;
    clicks: number;

    openRate: number;
    clickRate: number;
    clickToOpenRate: number;

    averageTimeToOpen: number; // minutes
    averageTimeToClick: number; // minutes
  };

  campaigns: {
    total: number;
    active: number;
    completed: number;

    topPerforming: Array<{
      campaignId: string;
      name: string;
      openRate: number;
      clickRate: number;
      conversions: number;
    }>;
  };

  templates: {
    mostUsed: Array<{
      templateId: string;
      name: string;
      useCount: number;
      openRate: number;
      clickRate: number;
    }>;
  };

  issues: {
    bounces: number;
    bounceRate: number;

    unsubscribes: number;
    unsubscribeRate: number;

    complaints: number;
    complaintRate: number;

    errors: number;
  };

  costs: {
    total: number;
    byChannel: Record<CommunicationChannel, number>;
    byProvider: Record<string, number>;
  };

  trends: {
    daily: Array<{
      date: Date;
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
    }>;

    hourly: Array<{
      hour: number;
      sent: number;
      openRate: number;
    }>;
  };
}

export interface WebhookSubscription {
  id: string;
  url: string;

  events: Array<
    | 'message.sent'
    | 'message.delivered'
    | 'message.opened'
    | 'message.clicked'
    | 'message.bounced'
    | 'message.failed'
    | 'campaign.started'
    | 'campaign.completed'
    | 'unsubscribe'
  >;

  secret: string;

  active: boolean;

  retryPolicy: {
    maxAttempts: number;
    backoffMultiplier: number;
  };

  stats: {
    deliveries: number;
    failures: number;
    lastDelivery?: Date;
    lastFailure?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Main System Class
// ============================================================================

export class EmailCommunicationServicesSystem {
  private providers: Map<string, ProviderConfiguration> = new Map();
  private templates: Map<string, MessageTemplate> = new Map();
  private messages: Map<string, Message> = new Map();
  private campaigns: Map<string, Campaign> = new Map();
  private triggers: Map<string, AutomationTrigger> = new Map();
  private contactLists: Map<string, ContactList> = new Map();
  private userPreferences: Map<string, UserPreferences> = new Map();
  private inAppNotifications: Map<string, InAppNotification> = new Map();
  private webhookSubscriptions: Map<string, WebhookSubscription> = new Map();

  private messageQueue: Message[] = [];
  private processingInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeProviders();
    this.initializeTemplates();
    this.startMessageProcessor();
  }

  // ============================================================================
  // Provider Configuration
  // ============================================================================

  configureProvider(params: {
    channel: CommunicationChannel;
    provider: EmailProvider | SmsProvider | PushProvider | string;
    name: string;
    credentials: ProviderConfiguration['credentials'];
  }): ProviderConfiguration {
    const config: ProviderConfiguration = {
      id: `provider_${params.channel}_${Date.now()}`,
      channel: params.channel,
      provider: params.provider,
      name: params.name,
      enabled: false,
      credentials: params.credentials,
      settings: {
        rateLimit: {
          maxPerSecond: 10,
          maxPerMinute: 100,
          maxPerHour: 1000,
          maxPerDay: 10000,
        },
        retry: {
          enabled: true,
          maxAttempts: 3,
          backoffMultiplier: 2,
        },
        tracking: {
          opens: true,
          clicks: true,
          unsubscribes: true,
        },
        validation: {
          emailVerification: true,
          phoneVerification: true,
        },
      },
      templates: {},
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    this.providers.set(config.id, config);
    return config;
  }

  enableProvider(providerId: string): ProviderConfiguration {
    const provider = this.providers.get(providerId);
    if (!provider) throw new Error('Provider not found');

    provider.enabled = true;
    provider.metadata.updatedAt = new Date();

    return provider;
  }

  // ============================================================================
  // Template Management
  // ============================================================================

  createTemplate(params: {
    name: string;
    slug: string;
    category: TemplateCategory;
    channel: CommunicationChannel;
    subject?: string;
    html?: string;
    text?: string;
    variables?: MessageTemplate['variables'];
  }): MessageTemplate {
    const template: MessageTemplate = {
      id: `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      slug: params.slug,
      category: params.category,
      channel: params.channel,
      subject: params.subject,
      content: {
        html: params.html,
        text: params.text,
      },
      variables: params.variables || [],
      metadata: {
        version: 1,
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
      },
      active: true,
    };

    this.templates.set(template.id, template);
    return template;
  }

  updateTemplate(templateId: string, updates: Partial<MessageTemplate>): MessageTemplate {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    Object.assign(template, updates);
    template.metadata.version++;
    template.metadata.updatedAt = new Date();

    return template;
  }

  renderTemplate(
    templateId: string,
    variables: Record<string, any>
  ): { subject?: string; html?: string; text?: string } {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    const rendered = {
      subject: this.replaceVariables(template.subject || '', variables),
      html: this.replaceVariables(template.content.html || '', variables),
      text: this.replaceVariables(template.content.text || '', variables),
    };

    return rendered;
  }

  private replaceVariables(content: string, variables: Record<string, any>): string {
    let result = content;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  // ============================================================================
  // Message Sending
  // ============================================================================

  async sendMessage(params: {
    channel: CommunicationChannel;
    recipient: Message['recipient'];
    templateId?: string;
    variables?: Record<string, any>;
    content?: Message['content'];
    metadata?: Message['metadata'];
  }): Promise<Message> {
    // Check user preferences
    if (params.recipient.userId) {
      const canSend = this.checkUserPreferences(
        params.recipient.userId,
        params.channel,
        params.metadata?.tags?.[0] as TemplateCategory
      );
      if (!canSend) {
        throw new Error('User has opted out of this channel or category');
      }
    }

    // Get provider for channel
    const provider = this.getProviderForChannel(params.channel);
    if (!provider || !provider.enabled) {
      throw new Error('No provider available for channel');
    }

    // Render template if provided
    let content = params.content;
    let template: Message['template'] | undefined;

    if (params.templateId) {
      const tmpl = this.templates.get(params.templateId);
      if (!tmpl) throw new Error('Template not found');

      const rendered = this.renderTemplate(params.templateId, params.variables || {});
      content = {
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
      };

      template = {
        id: params.templateId,
        name: tmpl.name,
        variables: params.variables || {},
      };

      // Update template stats
      tmpl.stats.sent++;
    }

    // Create message
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      channel: params.channel,
      provider: provider.provider,
      recipient: params.recipient,
      template,
      content: content || {},
      status: 'pending',
      timeline: {
        created: new Date(),
      },
      tracking: {
        opens: 0,
        clicks: 0,
      },
      delivery: {
        attempts: 0,
      },
      metadata: params.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.messages.set(message.id, message);

    // Queue message
    this.queueMessage(message);

    return message;
  }

  private queueMessage(message: Message): void {
    message.status = 'queued';
    message.timeline.queued = new Date();
    this.messageQueue.push(message);
  }

  private async processMessageQueue(): Promise<void> {
    if (this.messageQueue.length === 0) return;

    const message = this.messageQueue.shift();
    if (!message) return;

    try {
      await this.deliverMessage(message);
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  }

  private async deliverMessage(message: Message): Promise<void> {
    message.status = 'sending';
    message.delivery.attempts++;
    message.delivery.lastAttempt = new Date();

    const provider = this.getProviderForChannel(message.channel);
    if (!provider) {
      message.status = 'failed';
      message.delivery.error = {
        code: 'NO_PROVIDER',
        message: 'No provider available',
        retryable: false,
      };
      return;
    }

    // Simulate API call to provider
    await this.delay(500 + Math.random() * 1500);

    // Simulate success/failure (95% success rate)
    const success = Math.random() > 0.05;

    if (success) {
      message.status = 'sent';
      message.timeline.sent = new Date();

      message.delivery.response = {
        code: '200',
        message: 'Message sent successfully',
        providerId: `${provider.provider}_${Date.now()}`,
      };

      // Simulate delivery
      setTimeout(() => {
        message.status = 'delivered';
        message.timeline.delivered = new Date();

        // Update template stats
        if (message.template) {
          const template = this.templates.get(message.template.id);
          if (template) {
            template.stats.delivered++;
          }
        }

        // Simulate opens and clicks for email
        if (message.channel === 'email') {
          this.simulateEngagement(message);
        }
      }, 2000);
    } else {
      message.status = 'failed';
      message.timeline.failed = new Date();

      message.delivery.error = {
        code: 'DELIVERY_FAILED',
        message: 'Failed to deliver message',
        retryable: message.delivery.attempts < 3,
      };

      // Retry if retryable
      if (message.delivery.error.retryable && provider.settings.retry.enabled) {
        const delay =
          1000 * Math.pow(provider.settings.retry.backoffMultiplier, message.delivery.attempts);
        setTimeout(() => this.queueMessage(message), delay);
      }
    }

    message.updatedAt = new Date();
  }

  private simulateEngagement(message: Message): void {
    // 30% open rate
    if (Math.random() < 0.3) {
      setTimeout(
        () => {
          this.trackOpen(message.id);
        },
        5000 + Math.random() * 60000
      );

      // 15% click rate (of opens)
      if (Math.random() < 0.5) {
        setTimeout(
          () => {
            this.trackClick(message.id, 'https://example.com/product');
          },
          10000 + Math.random() * 120000
        );
      }
    }
  }

  trackOpen(messageId: string): void {
    const message = this.messages.get(messageId);
    if (!message) return;

    message.tracking.opens++;
    if (!message.timeline.opened) {
      message.timeline.opened = new Date();
      message.status = 'read';

      // Update template stats
      if (message.template) {
        const template = this.templates.get(message.template.id);
        if (template) {
          template.stats.opened++;
        }
      }
    }
    message.tracking.lastOpened = new Date();
    message.updatedAt = new Date();
  }

  trackClick(messageId: string, url: string): void {
    const message = this.messages.get(messageId);
    if (!message) return;

    message.tracking.clicks++;
    if (!message.timeline.clicked) {
      message.timeline.clicked = new Date();
    }
    message.tracking.lastClicked = new Date();

    // Track link clicks
    if (!message.tracking.links) {
      message.tracking.links = [];
    }

    const existingLink = message.tracking.links.find((l) => l.url === url);
    if (existingLink) {
      existingLink.clicks++;
    } else {
      message.tracking.links.push({ url, clicks: 1 });
    }

    // Update template stats
    if (message.template) {
      const template = this.templates.get(message.template.id);
      if (template) {
        template.stats.clicked++;
      }
    }

    message.updatedAt = new Date();
  }

  // ============================================================================
  // Campaign Management
  // ============================================================================

  createCampaign(params: {
    name: string;
    channel: CommunicationChannel;
    templateId: string;
    audience: Campaign['audience'];
    schedule: Campaign['schedule'];
    settings?: Partial<Campaign['settings']>;
  }): Campaign {
    const template = this.templates.get(params.templateId);
    if (!template) throw new Error('Template not found');

    const campaign: Campaign = {
      id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.schedule.type === 'recurring' ? 'recurring' : 'one-time',
      channel: params.channel,
      status: 'draft',
      template: {
        id: params.templateId,
        name: template.name,
      },
      audience: params.audience,
      schedule: params.schedule,
      settings: {
        sendFrom: params.settings?.sendFrom || {
          name: 'Artisans Marketplace',
          email: 'noreply@artisans.com',
        },
        tracking: params.settings?.tracking || {
          opens: true,
          clicks: true,
          conversions: true,
        },
        ...params.settings,
      },
      progress: {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: params.audience.totalRecipients,
      },
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        complained: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0,
        unsubscribeRate: 0,
      },
      metadata: {
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async startCampaign(campaignId: string): Promise<Campaign> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    campaign.status = 'sending';
    campaign.progress.startedAt = new Date();

    // Get recipients
    const recipients = await this.getRecipientsForCampaign(campaign);

    // Send messages
    for (const recipient of recipients) {
      await this.sendMessage({
        channel: campaign.channel,
        recipient,
        templateId: campaign.template.id,
        metadata: {
          campaignId: campaign.id,
        },
      });

      campaign.progress.sent++;
      campaign.progress.pending--;
      campaign.stats.sent++;
    }

    campaign.status = 'completed';
    campaign.progress.completedAt = new Date();
    campaign.metadata.updatedAt = new Date();

    return campaign;
  }

  private async getRecipientsForCampaign(campaign: Campaign): Promise<Message['recipient'][]> {
    const recipients: Message['recipient'][] = [];

    if (campaign.audience.type === 'list' && campaign.audience.listIds) {
      campaign.audience.listIds.forEach((listId) => {
        const list = this.contactLists.get(listId);
        if (list) {
          list.contacts.forEach((contact) => {
            if (contact.status === 'active') {
              recipients.push({
                userId: contact.userId,
                email: contact.email,
                phone: contact.phone,
                name: contact.name,
              });
            }
          });
        }
      });
    }

    return recipients;
  }

  // ============================================================================
  // Automation Triggers
  // ============================================================================

  createTrigger(params: {
    name: string;
    type: TriggerType;
    conditions?: AutomationTrigger['conditions'];
    actions: AutomationTrigger['actions'];
    delay?: AutomationTrigger['delay'];
  }): AutomationTrigger {
    const trigger: AutomationTrigger = {
      id: `trig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      type: params.type,
      enabled: true,
      conditions: params.conditions || [],
      delay: params.delay,
      actions: params.actions,
      frequency: {},
      stats: {
        triggered: 0,
        executed: 0,
        failed: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.triggers.set(trigger.id, trigger);
    return trigger;
  }

  async executeTrigger(triggerId: string, context: Record<string, any>): Promise<void> {
    const trigger = this.triggers.get(triggerId);
    if (!trigger || !trigger.enabled) return;

    trigger.stats.triggered++;

    // Check conditions
    if (trigger.conditions.length > 0) {
      const conditionsMet = this.evaluateConditions(trigger.conditions, context);
      if (!conditionsMet) return;
    }

    // Apply delay if configured
    const delay = trigger.delay ? this.convertDelayToMilliseconds(trigger.delay) : 0;

    setTimeout(async () => {
      try {
        // Execute actions
        for (const action of trigger.actions) {
          if (action.type === 'send-message' && action.channel && action.templateId) {
            await this.sendMessage({
              channel: action.channel,
              recipient: context.recipient,
              templateId: action.templateId,
              variables: context.variables,
              metadata: {
                triggerId: trigger.id,
              },
            });
          }
        }

        trigger.stats.executed++;
      } catch (error) {
        trigger.stats.failed++;
        console.error('Trigger execution failed:', error);
      }
    }, delay);
  }

  private evaluateConditions(
    conditions: AutomationTrigger['conditions'],
    context: Record<string, any>
  ): boolean {
    return conditions.every((condition) => {
      const value = this.getNestedValue(context, condition.field);

      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'not-equals':
          return value !== condition.value;
        case 'greater-than':
          return value > condition.value;
        case 'less-than':
          return value < condition.value;
        case 'contains':
          return String(value).includes(String(condition.value));
        case 'exists':
          return value !== undefined && value !== null;
        default:
          return false;
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private convertDelayToMilliseconds(delay: AutomationTrigger['delay']): number {
    if (!delay) return 0;

    const multipliers = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    };

    return delay.amount * multipliers[delay.unit];
  }

  // ============================================================================
  // Contact Lists
  // ============================================================================

  createContactList(params: {
    name: string;
    description?: string;
    type: ContactList['type'];
    contacts?: ContactList['contacts'];
  }): ContactList {
    const list: ContactList = {
      id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      type: params.type,
      contacts: params.contacts || [],
      metadata: {
        totalContacts: params.contacts?.length || 0,
        activeContacts: params.contacts?.filter((c) => c.status === 'active').length || 0,
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    this.contactLists.set(list.id, list);
    return list;
  }

  addContactToList(listId: string, contact: ContactList['contacts'][0]): ContactList {
    const list = this.contactLists.get(listId);
    if (!list) throw new Error('Contact list not found');

    list.contacts.push({
      ...contact,
      addedAt: new Date(),
    });

    list.metadata.totalContacts++;
    if (contact.status === 'active') {
      list.metadata.activeContacts++;
    }
    list.metadata.updatedAt = new Date();

    return list;
  }

  // ============================================================================
  // User Preferences
  // ============================================================================

  getUserPreferences(userId: string): UserPreferences {
    let prefs = this.userPreferences.get(userId);

    if (!prefs) {
      prefs = this.createDefaultPreferences(userId);
      this.userPreferences.set(userId, prefs);
    }

    return prefs;
  }

  updateUserPreferences(userId: string, updates: Partial<UserPreferences>): UserPreferences {
    const prefs = this.getUserPreferences(userId);

    Object.assign(prefs, updates);
    prefs.updatedAt = new Date();

    return prefs;
  }

  private createDefaultPreferences(userId: string): UserPreferences {
    const allCategories = Object.fromEntries(
      (
        [
          'transactional',
          'marketing',
          'notification',
          'welcome',
          'order',
          'shipping',
          'newsletter',
          'promotional',
          'reminder',
          'confirmation',
        ] as TemplateCategory[]
      ).map((cat) => [cat, true])
    ) as Record<TemplateCategory, boolean>;

    return {
      userId,
      channels: {
        email: {
          enabled: true,
          address: '',
          verified: false,
          categories: allCategories,
        },
        sms: {
          enabled: false,
          verified: false,
          categories: allCategories,
        },
        push: {
          enabled: true,
          devices: [],
          categories: allCategories,
        },
        inApp: {
          enabled: true,
          categories: allCategories,
        },
      },
      language: 'en',
      timezone: 'UTC',
      updatedAt: new Date(),
    };
  }

  private checkUserPreferences(
    userId: string,
    channel: CommunicationChannel,
    category?: TemplateCategory
  ): boolean {
    const prefs = this.getUserPreferences(userId);

    const channelPrefs = prefs.channels[channel as keyof typeof prefs.channels];
    if (!channelPrefs || !channelPrefs.enabled) return false;

    if (category && 'categories' in channelPrefs) {
      return channelPrefs.categories[category] !== false;
    }

    return true;
  }

  // ============================================================================
  // In-App Notifications
  // ============================================================================

  createInAppNotification(params: {
    userId: string;
    type: InAppNotification['type'];
    title: string;
    message: string;
    action?: InAppNotification['action'];
    priority?: InAppNotification['priority'];
  }): InAppNotification {
    const notification: InAppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      action: params.action,
      priority: params.priority || 'normal',
      status: 'unread',
      createdAt: new Date(),
    };

    this.inAppNotifications.set(notification.id, notification);
    return notification;
  }

  markNotificationAsRead(notificationId: string): InAppNotification {
    const notification = this.inAppNotifications.get(notificationId);
    if (!notification) throw new Error('Notification not found');

    notification.status = 'read';
    notification.readAt = new Date();

    return notification;
  }

  getUserNotifications(userId: string, status?: InAppNotification['status']): InAppNotification[] {
    return Array.from(this.inAppNotifications.values())
      .filter((n) => n.userId === userId && (!status || n.status === status))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ============================================================================
  // Analytics
  // ============================================================================

  getCommunicationAnalytics(period: { start: Date; end: Date }): CommunicationAnalytics {
    const messagesInPeriod = Array.from(this.messages.values()).filter(
      (m) => m.createdAt >= period.start && m.createdAt <= period.end
    );

    const sent = messagesInPeriod.filter(
      (m) => m.status === 'sent' || m.status === 'delivered' || m.status === 'read'
    );
    const delivered = messagesInPeriod.filter(
      (m) => m.status === 'delivered' || m.status === 'read'
    );
    const opened = messagesInPeriod.filter((m) => m.timeline.opened);
    const clicked = messagesInPeriod.filter((m) => m.timeline.clicked);

    const analytics: CommunicationAnalytics = {
      period,
      overview: {
        totalSent: sent.length,
        delivered: delivered.length,
        failed: messagesInPeriod.filter((m) => m.status === 'failed').length,
        deliveryRate: (delivered.length / sent.length) * 100 || 0,
        byChannel: this.getChannelBreakdown(messagesInPeriod),
      },
      engagement: {
        opens: messagesInPeriod.reduce((sum, m) => sum + m.tracking.opens, 0),
        clicks: messagesInPeriod.reduce((sum, m) => sum + m.tracking.clicks, 0),
        openRate: (opened.length / delivered.length) * 100 || 0,
        clickRate: (clicked.length / delivered.length) * 100 || 0,
        clickToOpenRate: (clicked.length / opened.length) * 100 || 0,
        averageTimeToOpen: this.calculateAverageTimeToOpen(opened),
        averageTimeToClick: this.calculateAverageTimeToClick(clicked),
      },
      campaigns: {
        total: this.campaigns.size,
        active: Array.from(this.campaigns.values()).filter(
          (c) => c.status === 'sending' || c.status === 'scheduled'
        ).length,
        completed: Array.from(this.campaigns.values()).filter((c) => c.status === 'completed')
          .length,
        topPerforming: this.getTopCampaigns(5),
      },
      templates: {
        mostUsed: this.getMostUsedTemplates(5),
      },
      issues: {
        bounces: messagesInPeriod.filter((m) => m.status === 'bounced').length,
        bounceRate:
          (messagesInPeriod.filter((m) => m.status === 'bounced').length / sent.length) * 100 || 0,
        unsubscribes: 0,
        unsubscribeRate: 0,
        complaints: 0,
        complaintRate: 0,
        errors: messagesInPeriod.filter((m) => m.status === 'failed').length,
      },
      costs: {
        total: sent.length * 0.01, // $0.01 per message
        byChannel: {} as Record<CommunicationChannel, number>,
        byProvider: {},
      },
      trends: {
        daily: [],
        hourly: [],
      },
    };

    return analytics;
  }

  private getChannelBreakdown(
    messages: Message[]
  ): CommunicationAnalytics['overview']['byChannel'] {
    const channels: CommunicationChannel[] = [
      'email',
      'sms',
      'push',
      'in-app',
      'whatsapp',
      'webhook',
    ];
    const breakdown = {} as Record<CommunicationChannel, any>;

    channels.forEach((channel) => {
      const channelMessages = messages.filter((m) => m.channel === channel);
      const sent = channelMessages.filter(
        (m) => m.status === 'sent' || m.status === 'delivered' || m.status === 'read'
      );
      const delivered = channelMessages.filter(
        (m) => m.status === 'delivered' || m.status === 'read'
      );

      breakdown[channel] = {
        sent: sent.length,
        delivered: delivered.length,
        deliveryRate: (delivered.length / sent.length) * 100 || 0,
      };
    });

    return breakdown;
  }

  private calculateAverageTimeToOpen(messages: Message[]): number {
    const times = messages
      .filter((m) => m.timeline.sent && m.timeline.opened)
      .map((m) => {
        const sent = m.timeline.sent!.getTime();
        const opened = m.timeline.opened!.getTime();
        return (opened - sent) / (1000 * 60); // minutes
      });

    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  private calculateAverageTimeToClick(messages: Message[]): number {
    const times = messages
      .filter((m) => m.timeline.sent && m.timeline.clicked)
      .map((m) => {
        const sent = m.timeline.sent!.getTime();
        const clicked = m.timeline.clicked!.getTime();
        return (clicked - sent) / (1000 * 60); // minutes
      });

    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  private getTopCampaigns(limit: number): CommunicationAnalytics['campaigns']['topPerforming'] {
    return Array.from(this.campaigns.values())
      .filter((c) => c.status === 'completed')
      .sort((a, b) => b.stats.openRate - a.stats.openRate)
      .slice(0, limit)
      .map((c) => ({
        campaignId: c.id,
        name: c.name,
        openRate: c.stats.openRate,
        clickRate: c.stats.clickRate,
        conversions: c.stats.conversions || 0,
      }));
  }

  private getMostUsedTemplates(limit: number): CommunicationAnalytics['templates']['mostUsed'] {
    return Array.from(this.templates.values())
      .sort((a, b) => b.stats.sent - a.stats.sent)
      .slice(0, limit)
      .map((t) => ({
        templateId: t.id,
        name: t.name,
        useCount: t.stats.sent,
        openRate: (t.stats.opened / t.stats.delivered) * 100 || 0,
        clickRate: (t.stats.clicked / t.stats.delivered) * 100 || 0,
      }));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private getProviderForChannel(channel: CommunicationChannel): ProviderConfiguration | undefined {
    return Array.from(this.providers.values()).find((p) => p.channel === channel && p.enabled);
  }

  private startMessageProcessor(): void {
    this.processingInterval = setInterval(() => {
      this.processMessageQueue();
    }, 1000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  private initializeProviders(): void {
    // Configure SendGrid (Email)
    this.configureProvider({
      channel: 'email',
      provider: 'sendgrid',
      name: 'SendGrid',
      credentials: {
        apiKey: 'SG.test_key',
        fromEmail: 'noreply@artisans.com',
        fromName: 'Artisans Marketplace',
        replyTo: 'support@artisans.com',
        environment: 'sandbox',
      },
    });
    this.enableProvider(Array.from(this.providers.values())[0]?.id);

    // Configure Twilio (SMS)
    this.configureProvider({
      channel: 'sms',
      provider: 'twilio',
      name: 'Twilio',
      credentials: {
        apiKey: 'AC_test_account',
        apiSecret: 'test_auth_token',
        senderId: '+15551234567',
        environment: 'sandbox',
      },
    });

    // Configure Firebase (Push)
    this.configureProvider({
      channel: 'push',
      provider: 'firebase',
      name: 'Firebase Cloud Messaging',
      credentials: {
        apiKey: 'firebase_server_key',
        environment: 'sandbox',
      },
    });
  }

  private initializeTemplates(): void {
    // Welcome Email
    this.createTemplate({
      name: 'Welcome Email',
      slug: 'welcome-email',
      category: 'welcome',
      channel: 'email',
      subject: 'Welcome to Artisans Marketplace, {{firstName}}!',
      html: `
        <h1>Welcome, {{firstName}}!</h1>
        <p>We're thrilled to have you join our community of artisan lovers.</p>
        <p>Discover unique handcrafted products from talented artisans around the world.</p>
        <a href="{{shopUrl}}">Start Shopping</a>
      `,
      text: "Welcome, {{firstName}}! We're thrilled to have you join our community.",
      variables: [
        { name: 'firstName', type: 'string', required: true },
        { name: 'shopUrl', type: 'string', required: true },
      ],
    });

    // Order Confirmation
    this.createTemplate({
      name: 'Order Confirmation',
      slug: 'order-confirmation',
      category: 'order',
      channel: 'email',
      subject: 'Order Confirmation - #{{orderNumber}}',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order #{{orderNumber}}</p>
        <p>Total: {{orderTotal}}</p>
        <p>We'll send you a shipping confirmation when your order ships.</p>
        <a href="{{trackingUrl}}">Track Your Order</a>
      `,
      text: 'Thank you for your order! Order #{{orderNumber}}',
      variables: [
        { name: 'orderNumber', type: 'string', required: true },
        { name: 'orderTotal', type: 'string', required: true },
        { name: 'trackingUrl', type: 'string', required: true },
      ],
    });

    // Shipping Notification
    this.createTemplate({
      name: 'Shipping Notification',
      slug: 'shipping-notification',
      category: 'shipping',
      channel: 'email',
      subject: 'Your order has shipped!',
      html: `
        <h1>Your order is on its way!</h1>
        <p>Order #{{orderNumber}} has shipped.</p>
        <p>Tracking Number: {{trackingNumber}}</p>
        <p>Estimated Delivery: {{estimatedDelivery}}</p>
        <a href="{{trackingUrl}}">Track Package</a>
      `,
      text: 'Your order #{{orderNumber}} has shipped! Track it at {{trackingUrl}}',
      variables: [
        { name: 'orderNumber', type: 'string', required: true },
        { name: 'trackingNumber', type: 'string', required: true },
        { name: 'estimatedDelivery', type: 'string', required: true },
        { name: 'trackingUrl', type: 'string', required: true },
      ],
    });

    // Cart Abandonment
    this.createTemplate({
      name: 'Cart Abandonment',
      slug: 'cart-abandoned',
      category: 'reminder',
      channel: 'email',
      subject: 'You left something in your cart',
      html: `
        <h1>Don't forget about your cart!</h1>
        <p>You have {{itemCount}} item(s) waiting for you.</p>
        <p>Complete your purchase now and get free shipping on orders over $50!</p>
        <a href="{{cartUrl}}">Return to Cart</a>
      `,
      text: 'You left {{itemCount}} item(s) in your cart. Complete your purchase: {{cartUrl}}',
      variables: [
        { name: 'itemCount', type: 'number', required: true },
        { name: 'cartUrl', type: 'string', required: true },
      ],
    });
  }

  // ============================================================================
  // Query Methods
  // ============================================================================

  getMessagesByRecipient(email: string): Message[] {
    return Array.from(this.messages.values())
      .filter((m) => m.recipient.email === email)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getCampaignsByStatus(status: CampaignStatus): Campaign[] {
    return Array.from(this.campaigns.values()).filter((c) => c.status === status);
  }

  getTemplatesByCategory(category: TemplateCategory): MessageTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.category === category);
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const emailCommunicationServices = new EmailCommunicationServicesSystem();
