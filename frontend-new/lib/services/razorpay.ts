import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../prisma';

interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

class RazorpayService {
  private razorpay: Razorpay;
  private config: RazorpayConfig;

  constructor() {
    this.config = {
      keyId: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
      keySecret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
    };

    // Only initialize Razorpay if we have real credentials
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: this.config.keyId,
        key_secret: this.config.keySecret,
      });
    } else {
      // Mock Razorpay for build/development without credentials
      this.razorpay = {
        orders: {
          create: async () => ({ id: 'mock_order', amount: 0, currency: 'INR' }),
          fetch: async () => ({ id: 'mock_order', amount: 0, currency: 'INR' }),
        },
        payments: {
          fetch: async () => ({ id: 'mock_payment', amount: 0, currency: 'INR', method: 'card' }),
          capture: async () => ({ id: 'mock_payment', amount: 0, currency: 'INR' }),
          refund: async () => ({ id: 'mock_refund', amount: 0, status: 'processed' }),
        },
        subscriptions: {
          create: async () => ({ id: 'mock_subscription' }),
          cancel: async () => ({ id: 'mock_subscription', status: 'cancelled' }),
        },
      } as any;
    }
  }

  /**
   * Create a new order
   */
  async createOrder(amount: number, currency: string = 'INR', receipt?: string, notes?: any) {
    try {
      const order = await this.razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: receipt || `order_${Date.now()}`,
        notes,
      });

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (error: any) {
      console.error('Razorpay create order error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    try {
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const generated_signature = crypto
        .createHmac('sha256', this.config.keySecret)
        .update(text)
        .digest('hex');

      return generated_signature === razorpaySignature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  /**
   * Process payment and update order
   */
  async processPayment(
    orderId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    try {
      // Verify signature
      const isValid = this.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValid) {
        throw new Error('Invalid payment signature');
      }

      // Fetch payment details from Razorpay
      const payment = await this.razorpay.payments.fetch(razorpayPaymentId);

      // Update order in database
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          razorpayOrderId,
          razorpayPaymentId,
          confirmedAt: new Date(),
        },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          orderId,
          amount: Number(payment.amount) / 100, // Convert from paise
          currency: payment.currency,
          status: 'PAID',
          method: this.getPaymentMethod(payment.method),
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          metadata: payment as any,
        },
      });

      // Send WhatsApp confirmation (if phone available)
      const user = await prisma.user.findUnique({
        where: { id: order.userId },
      });

      if (user?.phone && user.whatsappOptIn) {
        const { whatsappService } = await import('./whatsapp');
        await whatsappService.sendOrderConfirmation(user.phone, orderId, user.id);
      }

      return { success: true, order };
    } catch (error: any) {
      console.error('Payment processing error:', error);

      // Update payment as failed
      await prisma.payment.create({
        data: {
          orderId,
          amount: 0,
          status: 'FAILED',
          method: 'RAZORPAY',
          razorpayPaymentId,
          razorpayOrderId,
          errorMessage: error.message,
        },
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Capture payment (for authorized payments)
   */
  async capturePayment(paymentId: string, amount: number, currency: string = 'INR') {
    try {
      const payment = await this.razorpay.payments.capture(
        paymentId,
        Math.round(amount * 100),
        currency
      );

      return { success: true, payment };
    } catch (error: any) {
      console.error('Payment capture error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create refund
   */
  async createRefund(paymentId: string, amount?: number, notes?: any) {
    try {
      const refundData: any = { notes };
      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to paise
      }

      const refund = await this.razorpay.payments.refund(paymentId, refundData);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount ? Number(refund.amount) / 100 : 0,
        status: refund.status,
      };
    } catch (error: any) {
      console.error('Refund creation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process refund and update order
   */
  async processRefund(orderId: string, amount?: number, reason?: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payments: true },
      });

      if (!order) throw new Error('Order not found');
      if (!order.razorpayPaymentId) throw new Error('No payment to refund');

      // Create refund in Razorpay
      const refundResult = await this.createRefund(order.razorpayPaymentId, amount, { reason });

      if (!refundResult.success) {
        throw new Error(refundResult.error);
      }

      // Create refund record
      await prisma.refund.create({
        data: {
          orderId,
          amount: refundResult.amount || order.total,
          reason: reason || 'Customer requested refund',
          status: 'PROCESSING',
          razorpayRefundId: refundResult.refundId,
        },
      });

      // Update order status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'REFUNDED',
          paymentStatus: amount && amount < order.total ? 'PARTIALLY_REFUNDED' : 'REFUNDED',
        },
      });

      return { success: true, refund: refundResult };
    } catch (error: any) {
      console.error('Refund processing error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetch payment details
   */
  async getPayment(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return { success: true, payment };
    } catch (error: any) {
      console.error('Fetch payment error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fetch order details
   */
  async getOrder(orderId: string) {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return { success: true, order };
    } catch (error: any) {
      console.error('Fetch order error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify webhook signature for webhooks
   */
  verifyWebhookSignature(body: string, signature: string, secret?: string): boolean {
    try {
      const webhookSecret = secret || this.config.keySecret;
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Map Razorpay payment method to our enum
   */
  private getPaymentMethod(method: string): any {
    const methodMap: { [key: string]: string } = {
      card: 'CARD',
      netbanking: 'NET_BANKING',
      wallet: 'WALLET',
      upi: 'UPI',
    };

    return methodMap[method] || 'RAZORPAY';
  }

  /**
   * Create subscription
   */
  async createSubscription(planId: string, customerId: string, quantity: number = 1) {
    try {
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        quantity,
        total_count: 12, // 12 months
      });

      return { success: true, subscription };
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, cancelAtCycleEnd: boolean = false) {
    try {
      const subscription = await this.razorpay.subscriptions.cancel(
        subscriptionId,
        cancelAtCycleEnd as any
      );

      return { success: true, subscription };
    } catch (error: any) {
      console.error('Subscription cancellation error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService;
