/**
 * Multi-Currency Payment System
 *
 * Handles international payments:
 * - Multiple currency support
 * - Real-time exchange rates
 * - Payment gateway integration
 * - Currency conversion
 * - Multi-currency wallets
 */

export interface Currency {
  code: string; // USD, EUR, GBP, INR, etc.
  symbol: string;
  name: string;
  decimals: number;
  countries: string[];
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
  source: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'card' | 'wallet' | 'bank_transfer' | 'crypto' | 'local';
  supportedCurrencies: string[];
  supportedCountries: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  processingTime: string;
  isActive: boolean;
}

export interface MultiCurrencyPayment {
  id: string;
  orderId: string;

  // Amount Details
  amount: {
    original: number;
    originalCurrency: string;
    converted?: number;
    convertedCurrency?: string;
    exchangeRate?: number;
  };

  // Gateway
  gateway: {
    id: string;
    name: string;
    transactionId?: string;
  };

  // Fees
  fees: {
    gatewayFee: number;
    conversionFee: number;
    total: number;
    currency: string;
  };

  // Customer
  customer: {
    id: string;
    country: string;
    preferredCurrency: string;
  };

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  completedAt?: Date;

  // Refund
  refund?: {
    amount: number;
    currency: string;
    reason: string;
    initiatedAt: Date;
    completedAt?: Date;
  };
}

export interface CurrencyWallet {
  userId: string;
  balances: Record<
    string,
    {
      amount: number;
      frozen: number;
      available: number;
    }
  >;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'conversion' | 'payment' | 'refund';
  amount: number;
  currency: string;
  balanceAfter: number;
  timestamp: Date;
  description: string;
  reference?: string;
}

export class MultiCurrencyPaymentSystem {
  private currencies: Map<string, Currency>;
  private exchangeRates: Map<string, ExchangeRate>;
  private gateways: Map<string, PaymentGateway>;
  private payments: Map<string, MultiCurrencyPayment>;
  private wallets: Map<string, CurrencyWallet>;

  constructor() {
    this.currencies = new Map();
    this.exchangeRates = new Map();
    this.gateways = new Map();
    this.payments = new Map();
    this.wallets = new Map();
    this.initializeCurrencies();
    this.initializeGateways();
    this.initializeExchangeRates();
  }

  /**
   * Initialize supported currencies
   */
  private initializeCurrencies() {
    const currencies: Currency[] = [
      { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2, countries: ['US'] },
      { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2, countries: ['DE', 'FR', 'IT', 'ES'] },
      { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2, countries: ['UK'] },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2, countries: ['IN'] },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0, countries: ['JP'] },
      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2, countries: ['AU'] },
      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2, countries: ['CA'] },
      { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimals: 2, countries: ['SG'] },
      { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimals: 2, countries: ['AE'] },
    ];

    currencies.forEach((currency) => {
      this.currencies.set(currency.code, currency);
    });
  }

  /**
   * Initialize payment gateways
   */
  private initializeGateways() {
    const gateways: PaymentGateway[] = [
      {
        id: 'stripe',
        name: 'Stripe',
        type: 'card',
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'AED'],
        supportedCountries: ['US', 'UK', 'EU', 'IN', 'AU', 'CA', 'SG', 'AE'],
        fees: { percentage: 2.9, fixed: 0.3, currency: 'USD' },
        processingTime: 'instant',
        isActive: true,
      },
      {
        id: 'razorpay',
        name: 'Razorpay',
        type: 'card',
        supportedCurrencies: ['INR'],
        supportedCountries: ['IN'],
        fees: { percentage: 2.0, fixed: 0, currency: 'INR' },
        processingTime: 'instant',
        isActive: true,
      },
      {
        id: 'paypal',
        name: 'PayPal',
        type: 'wallet',
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'],
        supportedCountries: ['US', 'UK', 'EU', 'IN', 'AU', 'CA'],
        fees: { percentage: 3.49, fixed: 0.49, currency: 'USD' },
        processingTime: 'instant',
        isActive: true,
      },
      {
        id: 'wise',
        name: 'Wise',
        type: 'bank_transfer',
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD'],
        supportedCountries: ['US', 'UK', 'EU', 'IN', 'JP', 'AU', 'CA', 'SG'],
        fees: { percentage: 0.5, fixed: 0, currency: 'USD' },
        processingTime: '1-2 business days',
        isActive: true,
      },
    ];

    gateways.forEach((gateway) => {
      this.gateways.set(gateway.id, gateway);
    });
  }

  /**
   * Initialize exchange rates (simulated)
   */
  private initializeExchangeRates() {
    const rates = [
      // Base: USD
      { from: 'USD', to: 'EUR', rate: 0.92 },
      { from: 'USD', to: 'GBP', rate: 0.79 },
      { from: 'USD', to: 'INR', rate: 83.12 },
      { from: 'USD', to: 'JPY', rate: 149.5 },
      { from: 'USD', to: 'AUD', rate: 1.52 },
      { from: 'USD', to: 'CAD', rate: 1.36 },
      { from: 'USD', to: 'SGD', rate: 1.34 },
      { from: 'USD', to: 'AED', rate: 3.67 },

      // Reverse rates
      { from: 'EUR', to: 'USD', rate: 1.09 },
      { from: 'GBP', to: 'USD', rate: 1.27 },
      { from: 'INR', to: 'USD', rate: 0.012 },
      { from: 'JPY', to: 'USD', rate: 0.0067 },
    ];

    rates.forEach((rate) => {
      const key = `${rate.from}-${rate.to}`;
      this.exchangeRates.set(key, {
        ...rate,
        timestamp: new Date(),
        source: 'mock_exchange_api',
      });
    });
  }

  /**
   * Get exchange rate between two currencies
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    const key = `${from}-${to}`;
    const rate = this.exchangeRates.get(key);

    if (rate) {
      return rate.rate;
    }

    // Try reverse rate
    const reverseKey = `${to}-${from}`;
    const reverseRate = this.exchangeRates.get(reverseKey);

    if (reverseRate) {
      return 1 / reverseRate.rate;
    }

    // If no direct rate, convert through USD
    if (from !== 'USD' && to !== 'USD') {
      const fromToUSD = await this.getExchangeRate(from, 'USD');
      const USDToTo = await this.getExchangeRate('USD', to);
      return fromToUSD * USDToTo;
    }

    throw new Error(`Exchange rate not found for ${from} to ${to}`);
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(
    amount: number,
    from: string,
    to: string
  ): Promise<{
    original: number;
    converted: number;
    rate: number;
    from: string;
    to: string;
  }> {
    const rate = await this.getExchangeRate(from, to);
    const converted = amount * rate;
    const currency = this.currencies.get(to);
    const decimals = currency?.decimals || 2;

    return {
      original: amount,
      converted: Number(converted.toFixed(decimals)),
      rate,
      from,
      to,
    };
  }

  /**
   * Get available payment gateways for currency and country
   */
  async getAvailableGateways(currency: string, country: string): Promise<PaymentGateway[]> {
    return Array.from(this.gateways.values()).filter(
      (gateway) =>
        gateway.isActive &&
        gateway.supportedCurrencies.includes(currency) &&
        gateway.supportedCountries.includes(country)
    );
  }

  /**
   * Calculate payment fees
   */
  async calculateFees(params: {
    amount: number;
    currency: string;
    gatewayId: string;
    convertToCurrency?: string;
  }): Promise<{
    gatewayFee: number;
    conversionFee: number;
    total: number;
    currency: string;
  }> {
    const gateway = this.gateways.get(params.gatewayId);
    if (!gateway) {
      throw new Error('Gateway not found');
    }

    let amount = params.amount;
    let currency = params.currency;

    // Convert if needed
    if (params.convertToCurrency && params.convertToCurrency !== params.currency) {
      const conversion = await this.convertCurrency(
        amount,
        params.currency,
        params.convertToCurrency
      );
      amount = conversion.converted;
      currency = params.convertToCurrency;
    }

    // Calculate gateway fees
    const percentageFee = (amount * gateway.fees.percentage) / 100;
    const gatewayFee = percentageFee + gateway.fees.fixed;

    // Conversion fee (1% for currency conversion)
    const conversionFee =
      params.convertToCurrency && params.convertToCurrency !== params.currency ? amount * 0.01 : 0;

    return {
      gatewayFee: Number(gatewayFee.toFixed(2)),
      conversionFee: Number(conversionFee.toFixed(2)),
      total: Number((gatewayFee + conversionFee).toFixed(2)),
      currency,
    };
  }

  /**
   * Process payment
   */
  async processPayment(params: {
    orderId: string;
    amount: number;
    currency: string;
    gatewayId: string;
    customerId: string;
    customerCountry: string;
    convertToCurrency?: string;
  }): Promise<MultiCurrencyPayment> {
    const gateway = this.gateways.get(params.gatewayId);
    if (!gateway) {
      throw new Error('Invalid payment gateway');
    }

    // Calculate fees
    const fees = await this.calculateFees({
      amount: params.amount,
      currency: params.currency,
      gatewayId: params.gatewayId,
      convertToCurrency: params.convertToCurrency,
    });

    // Convert currency if needed
    let converted: { converted: number; rate: number } | undefined;
    if (params.convertToCurrency && params.convertToCurrency !== params.currency) {
      const conversion = await this.convertCurrency(
        params.amount,
        params.currency,
        params.convertToCurrency
      );
      converted = { converted: conversion.converted, rate: conversion.rate };
    }

    const payment: MultiCurrencyPayment = {
      id: `pay-${Date.now()}`,
      orderId: params.orderId,
      amount: {
        original: params.amount,
        originalCurrency: params.currency,
        converted: converted?.converted,
        convertedCurrency: params.convertToCurrency,
        exchangeRate: converted?.rate,
      },
      gateway: {
        id: gateway.id,
        name: gateway.name,
        transactionId: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      fees,
      customer: {
        id: params.customerId,
        country: params.customerCountry,
        preferredCurrency: params.currency,
      },
      status: 'processing',
      createdAt: new Date(),
    };

    this.payments.set(payment.id, payment);

    // Simulate payment processing
    setTimeout(() => {
      payment.status = 'completed';
      payment.completedAt = new Date();
    }, 2000);

    return payment;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<MultiCurrencyPayment['status']> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment.status;
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, reason: string): Promise<void> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Can only refund completed payments');
    }

    payment.refund = {
      amount: payment.amount.original,
      currency: payment.amount.originalCurrency,
      reason,
      initiatedAt: new Date(),
    };

    payment.status = 'refunded';

    // Simulate refund processing
    setTimeout(() => {
      if (payment.refund) {
        payment.refund.completedAt = new Date();
      }
    }, 3000);
  }

  /**
   * Get or create wallet for user
   */
  async getWallet(userId: string): Promise<CurrencyWallet> {
    let wallet = this.wallets.get(userId);

    if (!wallet) {
      wallet = {
        userId,
        balances: {},
        transactions: [],
      };
      this.wallets.set(userId, wallet);
    }

    return wallet;
  }

  /**
   * Add funds to wallet
   */
  async addFundsToWallet(userId: string, amount: number, currency: string): Promise<void> {
    const wallet = await this.getWallet(userId);

    if (!wallet.balances[currency]) {
      wallet.balances[currency] = { amount: 0, frozen: 0, available: 0 };
    }

    wallet.balances[currency].amount += amount;
    wallet.balances[currency].available += amount;

    wallet.transactions.push({
      id: `txn-${Date.now()}`,
      type: 'deposit',
      amount,
      currency,
      balanceAfter: wallet.balances[currency].amount,
      timestamp: new Date(),
      description: 'Wallet deposit',
    });
  }

  /**
   * Convert wallet balance
   */
  async convertWalletBalance(
    userId: string,
    amount: number,
    from: string,
    to: string
  ): Promise<void> {
    const wallet = await this.getWallet(userId);

    if (!wallet.balances[from] || wallet.balances[from].available < amount) {
      throw new Error('Insufficient balance');
    }

    const conversion = await this.convertCurrency(amount, from, to);

    // Deduct from source currency
    wallet.balances[from].amount -= amount;
    wallet.balances[from].available -= amount;

    // Add to target currency
    if (!wallet.balances[to]) {
      wallet.balances[to] = { amount: 0, frozen: 0, available: 0 };
    }
    wallet.balances[to].amount += conversion.converted;
    wallet.balances[to].available += conversion.converted;

    // Record transactions
    wallet.transactions.push({
      id: `txn-${Date.now()}-1`,
      type: 'conversion',
      amount: -amount,
      currency: from,
      balanceAfter: wallet.balances[from].amount,
      timestamp: new Date(),
      description: `Converted to ${to}`,
    });

    wallet.transactions.push({
      id: `txn-${Date.now()}-2`,
      type: 'conversion',
      amount: conversion.converted,
      currency: to,
      balanceAfter: wallet.balances[to].amount,
      timestamp: new Date(),
      description: `Converted from ${from}`,
    });
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): Currency[] {
    return Array.from(this.currencies.values());
  }

  /**
   * Format amount in currency
   */
  formatAmount(amount: number, currencyCode: string): string {
    const currency = this.currencies.get(currencyCode);
    if (!currency) return `${amount}`;

    return `${currency.symbol}${amount.toFixed(currency.decimals)}`;
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats() {
    const payments = Array.from(this.payments.values());

    const totalPayments = payments.length;
    const completedPayments = payments.filter((p) => p.status === 'completed').length;
    const failedPayments = payments.filter((p) => p.status === 'failed').length;
    const refundedPayments = payments.filter((p) => p.status === 'refunded').length;

    const totalVolume = payments.reduce((sum, p) => {
      if (p.status === 'completed') {
        return sum + p.amount.original;
      }
      return sum;
    }, 0);

    const byCurrency = payments.reduce(
      (acc, p) => {
        const curr = p.amount.originalCurrency;
        acc[curr] = (acc[curr] || 0) + p.amount.original;
        return acc;
      },
      {} as Record<string, number>
    );

    const byGateway = payments.reduce(
      (acc, p) => {
        const gateway = p.gateway.name;
        acc[gateway] = (acc[gateway] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalPayments,
      completedPayments,
      failedPayments,
      refundedPayments,
      successRate: totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0,
      totalVolume,
      volumeByCurrency: byCurrency,
      paymentsByGateway: byGateway,
    };
  }
}

// Export singleton instance
export const multiCurrencyPaymentSystem = new MultiCurrencyPaymentSystem();
