/**
 * Webhook Management System
 *
 * Manage webhooks for event-driven integrations
 */

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number; // seconds
  };
  createdBy: string;
  createdAt: Date;
  lastTriggered?: Date;
  successCount: number;
  failureCount: number;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  statusCode?: number;
  responseTime?: number;
  timestamp: Date;
  completedAt?: Date;
  error?: string;
}

export class WebhookManagementSystem {
  private webhooks: Map<string, Webhook> = new Map();
  private deliveries: Map<string, WebhookDelivery> = new Map();

  async createWebhook(data: {
    url: string;
    events: string[];
    createdBy: string;
    maxRetries?: number;
    retryDelay?: number;
  }): Promise<Webhook> {
    const secret = `whsec_${Math.random().toString(36).substring(2)}`;

    const webhook: Webhook = {
      id: `webhook-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      url: data.url,
      events: data.events,
      secret,
      active: true,
      retryPolicy: {
        maxRetries: data.maxRetries || 3,
        retryDelay: data.retryDelay || 60,
      },
      createdBy: data.createdBy,
      createdAt: new Date(),
      successCount: 0,
      failureCount: 0,
    };

    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  async triggerEvent(event: string, payload: any): Promise<WebhookDelivery[]> {
    const relevantWebhooks = Array.from(this.webhooks.values()).filter(
      (w) => w.active && w.events.includes(event)
    );

    const deliveries: WebhookDelivery[] = [];

    for (const webhook of relevantWebhooks) {
      const delivery = await this.deliverWebhook(webhook, event, payload);
      deliveries.push(delivery);
    }

    return deliveries;
  }

  private async deliverWebhook(
    webhook: Webhook,
    event: string,
    payload: any
  ): Promise<WebhookDelivery> {
    const delivery: WebhookDelivery = {
      id: `delivery-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      webhookId: webhook.id,
      event,
      payload,
      status: 'pending',
      attempts: 0,
      timestamp: new Date(),
    };

    this.deliveries.set(delivery.id, delivery);

    // Simulate delivery
    setTimeout(() => this.attemptDelivery(delivery.id, webhook.id), 100);

    return delivery;
  }

  private async attemptDelivery(deliveryId: string, webhookId: string): Promise<void> {
    const delivery = this.deliveries.get(deliveryId);
    const webhook = this.webhooks.get(webhookId);

    if (!delivery || !webhook) return;

    delivery.attempts++;

    // Simulate HTTP request
    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      delivery.status = 'success';
      delivery.statusCode = 200;
      delivery.responseTime = Math.random() * 500;
      delivery.completedAt = new Date();
      webhook.successCount++;
      webhook.lastTriggered = new Date();
    } else {
      if (delivery.attempts >= webhook.retryPolicy.maxRetries) {
        delivery.status = 'failed';
        delivery.error = 'Max retries exceeded';
        delivery.completedAt = new Date();
        webhook.failureCount++;
      } else {
        delivery.status = 'retrying';
        // Schedule retry
        setTimeout(
          () => this.attemptDelivery(deliveryId, webhookId),
          webhook.retryPolicy.retryDelay * 1000
        );
      }
    }

    this.deliveries.set(deliveryId, delivery);
    this.webhooks.set(webhookId, webhook);
  }

  async getWebhook(id: string): Promise<Webhook | null> {
    return this.webhooks.get(id) || null;
  }

  async listWebhooks(createdBy?: string): Promise<Webhook[]> {
    let webhooks = Array.from(this.webhooks.values());
    if (createdBy) {
      webhooks = webhooks.filter((w) => w.createdBy === createdBy);
    }
    return webhooks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDeliveries(webhookId: string, limit: number = 50): Promise<WebhookDelivery[]> {
    return Array.from(this.deliveries.values())
      .filter((d) => d.webhookId === webhookId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getStats(): Promise<{
    totalWebhooks: number;
    activeWebhooks: number;
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    successRate: number;
  }> {
    const webhooks = Array.from(this.webhooks.values());
    const deliveries = Array.from(this.deliveries.values());

    const successful = deliveries.filter((d) => d.status === 'success').length;
    const failed = deliveries.filter((d) => d.status === 'failed').length;
    const successRate = deliveries.length > 0 ? (successful / deliveries.length) * 100 : 0;

    return {
      totalWebhooks: webhooks.length,
      activeWebhooks: webhooks.filter((w) => w.active).length,
      totalDeliveries: deliveries.length,
      successfulDeliveries: successful,
      failedDeliveries: failed,
      successRate: Math.round(successRate * 100) / 100,
    };
  }
}

export const webhookManagementSystem = new WebhookManagementSystem();
