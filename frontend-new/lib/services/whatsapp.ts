import axios from 'axios';
import prisma from '../prisma';

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
  webhookVerifyToken: string;
}

class WhatsAppService {
  private config: WhatsAppConfig;
  private apiUrl = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
    };
  }

  /**
   * Send a text message via WhatsApp
   */
  async sendTextMessage(to: string, message: string, userId?: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Store in database
      await prisma.whatsAppMessage.create({
        data: {
          userId,
          phone: to,
          direction: 'OUTBOUND',
          messageType: 'text',
          content: message,
          waMessageId: response.data.messages[0].id,
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error: any) {
      console.error('WhatsApp send error:', error.response?.data || error.message);

      // Store failed message
      await prisma.whatsAppMessage.create({
        data: {
          userId,
          phone: to,
          direction: 'OUTBOUND',
          messageType: 'text',
          content: message,
          status: 'FAILED',
          errorMessage: error.response?.data?.error?.message || error.message,
        },
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Send a template message (for notifications)
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = 'en',
    parameters: any[] = [],
    userId?: string
  ) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components: [
              {
                type: 'body',
                parameters: parameters,
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Store in database
      await prisma.whatsAppMessage.create({
        data: {
          userId,
          phone: to,
          direction: 'OUTBOUND',
          messageType: 'template',
          content: templateName,
          templateName,
          templateParams: parameters,
          waMessageId: response.data.messages[0].id,
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      return { success: true, messageId: response.data.messages[0].id };
    } catch (error: any) {
      console.error('WhatsApp template send error:', error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order confirmation via WhatsApp
   */
  async sendOrderConfirmation(phone: string, orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) throw new Error('Order not found');

    const message = `🎉 Order Confirmed!\n\nOrder #${order.orderNumber}\n\nTotal: ₹${order.total}\n\nThank you for supporting Indian artisans! We'll send you tracking details soon.`;

    return this.sendTextMessage(phone, message, userId);
  }

  /**
   * Send shipment tracking update
   */
  async sendShipmentUpdate(
    phone: string,
    orderId: string,
    trackingNumber: string,
    carrier: string,
    userId?: string
  ) {
    const message = `📦 Your order is on the way!\n\nTracking: ${trackingNumber}\nCarrier: ${carrier}\n\nTrack your package and see when it arrives.`;
    return this.sendTextMessage(phone, message, userId);
  }

  /**
   * Send delivery confirmation
   */
  async sendDeliveryConfirmation(phone: string, orderNumber: string, userId?: string) {
    const message = `✅ Delivered!\n\nYour order #${orderNumber} has been delivered.\n\nWe'd love to hear your feedback! Please rate your experience.`;
    return this.sendTextMessage(phone, message, userId);
  }

  /**
   * Send product back in stock notification
   */
  async sendBackInStockNotification(
    phone: string,
    productName: string,
    productUrl: string,
    userId?: string
  ) {
    const message = `🔔 Good news! "${productName}" is back in stock!\n\nShop now: ${productUrl}`;
    return this.sendTextMessage(phone, message, userId);
  }

  /**
   * Send workshop reminder
   */
  async sendWorkshopReminder(
    phone: string,
    workshopTitle: string,
    startTime: Date,
    userId?: string
  ) {
    const message = `🎨 Workshop Reminder!\n\n"${workshopTitle}"\n\nStarts: ${startTime.toLocaleString()}\n\nSee you there!`;
    return this.sendTextMessage(phone, message, userId);
  }

  /**
   * Handle incoming webhook messages
   */
  async handleWebhook(webhookData: any) {
    try {
      const entry = webhookData.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        const message = value.messages[0];
        const from = message.from;
        const messageId = message.id;

        // Store incoming message
        await prisma.whatsAppMessage.create({
          data: {
            phone: from,
            direction: 'INBOUND',
            messageType: message.type,
            content: message.text?.body || JSON.stringify(message),
            waMessageId: messageId,
            status: 'DELIVERED',
            deliveredAt: new Date(),
          },
        });

        // Process message (can add AI chatbot logic here)
        return { success: true };
      }

      // Handle status updates
      if (value?.statuses) {
        const status = value.statuses[0];
        await prisma.whatsAppMessage.updateMany({
          where: { waMessageId: status.id },
          data: {
            status: status.status.toUpperCase(),
            ...(status.timestamp && {
              deliveredAt: new Date(parseInt(status.timestamp) * 1000),
            }),
          },
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Webhook handling error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhook(mode: string, token: string, challenge: string) {
    if (mode === 'subscribe' && token === this.config.webhookVerifyToken) {
      return challenge;
    }
    return null;
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string) {
    try {
      await axios.post(
        `${this.apiUrl}/${this.config.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      await prisma.whatsAppMessage.updateMany({
        where: { waMessageId: messageId },
        data: { status: 'READ', readAt: new Date() },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Mark as read error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
