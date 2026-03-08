import { logger } from '../utils/logger';

interface ConversationState {
  artisanPhone: string;
  state: 'idle' | 'awaiting_approval';
  pendingProduct?: {
    productId: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
  };
  lastUpdated: Date;
}

/**
 * In-memory conversation state management
 * In production, this would be stored in Redis or database
 */
class ConversationStateService {
  private states: Map<string, ConversationState> = new Map();
  private readonly STATE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  /**
   * Get conversation state for artisan
   */
  getState(artisanPhone: string): ConversationState | undefined {
    const state = this.states.get(artisanPhone);
    
    // Check if state has expired
    if (state && Date.now() - state.lastUpdated.getTime() > this.STATE_TIMEOUT) {
      this.states.delete(artisanPhone);
      return undefined;
    }
    
    return state;
  }

  /**
   * Set conversation state
   */
  setState(artisanPhone: string, state: Partial<ConversationState>): void {
    const existing = this.states.get(artisanPhone);
    
    this.states.set(artisanPhone, {
      artisanPhone,
      state: state.state || 'idle',
      pendingProduct: state.pendingProduct || existing?.pendingProduct,
      lastUpdated: new Date()
    });
    
    logger.info('Conversation state updated', { artisanPhone, state: state.state });
  }

  /**
   * Store pending product for approval
   */
  setPendingProduct(artisanPhone: string, product: ConversationState['pendingProduct']): void {
    this.setState(artisanPhone, {
      state: 'awaiting_approval',
      pendingProduct: product
    });
  }

  /**
   * Get pending product
   */
  getPendingProduct(artisanPhone: string): ConversationState['pendingProduct'] | undefined {
    const state = this.getState(artisanPhone);
    return state?.pendingProduct;
  }

  /**
   * Update pending product field
   */
  updatePendingProduct(artisanPhone: string, field: keyof NonNullable<ConversationState['pendingProduct']>, value: any): void {
    const state = this.getState(artisanPhone);
    if (state?.pendingProduct) {
      state.pendingProduct[field] = value;
      state.lastUpdated = new Date();
      this.states.set(artisanPhone, state);
      logger.info('Pending product updated', { artisanPhone, field, value });
    }
  }

  /**
   * Clear conversation state
   */
  clearState(artisanPhone: string): void {
    this.states.delete(artisanPhone);
    logger.info('Conversation state cleared', { artisanPhone });
  }

  /**
   * Clean up expired states (run periodically)
   */
  cleanupExpiredStates(): void {
    const now = Date.now();
    for (const [phone, state] of this.states.entries()) {
      if (now - state.lastUpdated.getTime() > this.STATE_TIMEOUT) {
        this.states.delete(phone);
        logger.info('Expired conversation state cleaned up', { phone });
      }
    }
  }
}

export const conversationStateService = new ConversationStateService();

// Clean up expired states every 10 minutes
setInterval(() => {
  conversationStateService.cleanupExpiredStates();
}, 10 * 60 * 1000);
