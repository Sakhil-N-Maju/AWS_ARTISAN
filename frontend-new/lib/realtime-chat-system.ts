/**
 * Real-time Chat System
 *
 * Provides real-time messaging capabilities:
 * - One-on-one chat
 * - Group chat
 * - Typing indicators
 * - Read receipts
 * - File sharing
 * - Message reactions
 * - Chat history
 */

export interface ChatMessage {
  id: string;
  conversationId: string;

  // Sender
  senderId: string;
  senderName: string;
  senderAvatar?: string;

  // Content
  type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'product' | 'order';
  content: string;

  // Attachments
  attachments?: {
    type: string;
    url: string;
    name: string;
    size: number;
    thumbnail?: string;
  }[];

  // Context
  productId?: string;
  orderId?: string;

  // Metadata
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;

  // Reactions
  reactions: {
    emoji: string;
    userIds: string[];
  }[];

  // Status
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

  // Timestamps
  timestamp: Date;
  deliveredAt?: Date;
  readAt?: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'support';

  // Participants
  participants: {
    userId: string;
    username: string;
    avatar?: string;
    role?: 'customer' | 'artisan' | 'support' | 'admin';
    joinedAt: Date;
    lastReadAt?: Date;
  }[];

  // Group Info (for group chats)
  groupInfo?: {
    name: string;
    description?: string;
    avatar?: string;
    adminIds: string[];
  };

  // Last Message
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date;
  };

  // Status
  isActive: boolean;
  isArchived: boolean;
  isPinned: boolean;

  // Mute
  mutedBy: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  username: string;
  startedAt: Date;
}

export interface ChatNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;

  type: 'new_message' | 'mention' | 'reaction';

  title: string;
  message: string;

  isRead: boolean;
  createdAt: Date;
}

export class RealtimeChatSystem {
  private conversations: Map<string, Conversation>;
  private messages: Map<string, ChatMessage>;
  private typingIndicators: Map<string, TypingIndicator[]>;
  private notifications: Map<string, ChatNotification>;

  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.typingIndicators = new Map();
    this.notifications = new Map();
  }

  /**
   * Create or get conversation
   */
  async createConversation(params: {
    type: Conversation['type'];
    participants: Conversation['participants'];
    groupInfo?: Conversation['groupInfo'];
  }): Promise<Conversation> {
    // Check if conversation already exists (for direct messages)
    if (params.type === 'direct' && params.participants.length === 2) {
      const existingConv = Array.from(this.conversations.values()).find((conv) => {
        if (conv.type !== 'direct') return false;
        const participantIds = conv.participants.map((p) => p.userId).sort();
        const newParticipantIds = params.participants.map((p) => p.userId).sort();
        return participantIds.join(',') === newParticipantIds.join(',');
      });

      if (existingConv) {
        return existingConv;
      }
    }

    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      type: params.type,
      participants: params.participants,
      groupInfo: params.groupInfo,
      isActive: true,
      isArchived: false,
      isPinned: false,
      mutedBy: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  /**
   * Send message
   */
  async sendMessage(params: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    type: ChatMessage['type'];
    content: string;
    attachments?: ChatMessage['attachments'];
    productId?: string;
    orderId?: string;
  }): Promise<ChatMessage> {
    const conversation = this.conversations.get(params.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: params.conversationId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderAvatar: params.senderAvatar,
      type: params.type,
      content: params.content,
      attachments: params.attachments,
      productId: params.productId,
      orderId: params.orderId,
      isEdited: false,
      isDeleted: false,
      reactions: [],
      status: 'sent',
      timestamp: new Date(),
    };

    this.messages.set(message.id, message);

    // Update conversation
    conversation.lastMessage = {
      content: params.content,
      senderId: params.senderId,
      timestamp: message.timestamp,
    };
    conversation.updatedAt = new Date();

    // Create notifications for other participants
    conversation.participants.forEach((participant) => {
      if (participant.userId !== params.senderId) {
        this.createChatNotification({
          userId: participant.userId,
          conversationId: params.conversationId,
          messageId: message.id,
          type: 'new_message',
          title: params.senderName,
          message: params.content,
        });
      }
    });

    // Simulate delivery
    setTimeout(() => {
      message.status = 'delivered';
      message.deliveredAt = new Date();
    }, 500);

    return message;
  }

  /**
   * Get messages for conversation
   */
  async getMessages(
    conversationId: string,
    limit: number = 50,
    before?: Date
  ): Promise<ChatMessage[]> {
    let messages = Array.from(this.messages.values()).filter(
      (m) => m.conversationId === conversationId && !m.isDeleted
    );

    if (before) {
      messages = messages.filter((m) => m.timestamp < before);
    }

    return messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }

  /**
   * Get conversations for user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter((conv) => conv.participants.some((p) => p.userId === userId) && !conv.isArchived)
      .sort((a, b) => {
        // Pinned first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Then by last update
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      });
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return;

    const participant = conversation.participants.find((p) => p.userId === userId);
    if (participant) {
      participant.lastReadAt = new Date();
    }

    // Mark messages as read
    const messages = Array.from(this.messages.values()).filter(
      (m) => m.conversationId === conversationId && m.senderId !== userId
    );

    messages.forEach((message) => {
      if (message.status !== 'read') {
        message.status = 'read';
        message.readAt = new Date();
      }
    });
  }

  /**
   * Set typing indicator
   */
  async setTyping(conversationId: string, userId: string, username: string): Promise<void> {
    let indicators = this.typingIndicators.get(conversationId) || [];

    // Remove existing indicator for this user
    indicators = indicators.filter((i) => i.userId !== userId);

    // Add new indicator
    indicators.push({
      conversationId,
      userId,
      username,
      startedAt: new Date(),
    });

    this.typingIndicators.set(conversationId, indicators);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.clearTyping(conversationId, userId);
    }, 5000);
  }

  /**
   * Clear typing indicator
   */
  async clearTyping(conversationId: string, userId: string): Promise<void> {
    const indicators = this.typingIndicators.get(conversationId) || [];
    const filtered = indicators.filter((i) => i.userId !== userId);
    this.typingIndicators.set(conversationId, filtered);
  }

  /**
   * Get typing indicators
   */
  async getTypingIndicators(conversationId: string): Promise<TypingIndicator[]> {
    return this.typingIndicators.get(conversationId) || [];
  }

  /**
   * Add reaction to message
   */
  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (!message) return;

    let reaction = message.reactions.find((r) => r.emoji === emoji);

    if (reaction) {
      if (!reaction.userIds.includes(userId)) {
        reaction.userIds.push(userId);
      }
    } else {
      message.reactions.push({
        emoji,
        userIds: [userId],
      });
    }
  }

  /**
   * Remove reaction from message
   */
  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (!message) return;

    const reaction = message.reactions.find((r) => r.emoji === emoji);
    if (reaction) {
      reaction.userIds = reaction.userIds.filter((id) => id !== userId);

      // Remove reaction if no users left
      if (reaction.userIds.length === 0) {
        message.reactions = message.reactions.filter((r) => r.emoji !== emoji);
      }
    }
  }

  /**
   * Edit message
   */
  async editMessage(messageId: string, newContent: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (!message) return;

    message.content = newContent;
    message.isEdited = true;
    message.editedAt = new Date();
  }

  /**
   * Delete message
   */
  async deleteMessage(messageId: string): Promise<void> {
    const message = this.messages.get(messageId);
    if (!message) return;

    message.isDeleted = true;
    message.content = 'This message was deleted';
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.isArchived = true;
    }
  }

  /**
   * Pin conversation
   */
  async pinConversation(conversationId: string): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.isPinned = true;
    }
  }

  /**
   * Mute conversation
   */
  async muteConversation(conversationId: string, userId: string): Promise<void> {
    const conversation = this.conversations.get(conversationId);
    if (conversation && !conversation.mutedBy.includes(userId)) {
      conversation.mutedBy.push(userId);
    }
  }

  /**
   * Create chat notification
   */
  private createChatNotification(params: {
    userId: string;
    conversationId: string;
    messageId: string;
    type: ChatNotification['type'];
    title: string;
    message: string;
  }): void {
    const notification: ChatNotification = {
      id: `notif-${Date.now()}`,
      ...params,
      isRead: false,
      createdAt: new Date(),
    };

    this.notifications.set(notification.id, notification);
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const conversations = await this.getConversations(userId);
    let unreadCount = 0;

    conversations.forEach((conv) => {
      const participant = conv.participants.find((p) => p.userId === userId);
      if (!participant) return;

      const messages = Array.from(this.messages.values()).filter(
        (m) =>
          m.conversationId === conv.id &&
          m.senderId !== userId &&
          (!participant.lastReadAt || m.timestamp > participant.lastReadAt)
      );

      unreadCount += messages.length;
    });

    return unreadCount;
  }

  /**
   * Get chat statistics
   */
  async getChatStats() {
    const conversations = Array.from(this.conversations.values());
    const messages = Array.from(this.messages.values());

    const totalConversations = conversations.length;
    const activeConversations = conversations.filter((c) => c.isActive).length;
    const totalMessages = messages.length;
    const todayMessages = messages.filter((m) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return m.timestamp >= today;
    }).length;

    return {
      totalConversations,
      activeConversations,
      totalMessages,
      todayMessages,
      averageMessagesPerConversation:
        totalConversations > 0 ? Number((totalMessages / totalConversations).toFixed(1)) : 0,
    };
  }
}

// Export singleton instance
export const realtimeChatSystem = new RealtimeChatSystem();
