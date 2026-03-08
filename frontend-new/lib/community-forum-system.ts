/**
 * Community Forum System
 *
 * Provides community discussion features:
 * - Forum categories and topics
 * - Threaded discussions
 * - User moderation
 * - Voting and reactions
 * - Rich text content
 * - Search and filtering
 */

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;

  // Permissions
  permissions: {
    canPost: 'all' | 'verified' | 'artisans' | 'moderators';
    canComment: 'all' | 'verified' | 'artisans';
    requiresApproval: boolean;
  };

  // Stats
  stats: {
    totalTopics: number;
    totalPosts: number;
    totalMembers: number;
  };

  isActive: boolean;
  order: number;
}

export interface ForumTopic {
  id: string;
  categoryId: string;

  // Author
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'user' | 'artisan' | 'moderator' | 'admin';
    reputation: number;
  };

  // Content
  title: string;
  content: string;
  tags: string[];

  // Media
  attachments?: {
    type: 'image' | 'video' | 'document';
    url: string;
    name: string;
    size: number;
  }[];

  // Status
  status: 'draft' | 'published' | 'locked' | 'archived' | 'deleted';
  isPinned: boolean;
  isFeatured: boolean;

  // Engagement
  views: number;
  replies: number;
  upvotes: number;
  downvotes: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;

  // Moderation
  reportCount: number;
  isApproved: boolean;
}

export interface ForumPost {
  id: string;
  topicId: string;

  // Author
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'user' | 'artisan' | 'moderator' | 'admin';
    reputation: number;
  };

  // Content
  content: string;

  // Reply
  replyToId?: string;

  // Media
  attachments?: ForumTopic['attachments'];

  // Engagement
  upvotes: number;
  downvotes: number;

  // Status
  status: 'published' | 'edited' | 'deleted' | 'hidden';
  isAcceptedAnswer: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;

  // Moderation
  reportCount: number;
  isApproved: boolean;
}

export interface UserReputation {
  userId: string;
  username: string;

  // Points
  points: number;
  level: number;

  // Badges
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
  }[];

  // Activity
  activity: {
    topicsCreated: number;
    postsCreated: number;
    upvotesReceived: number;
    upvotesGiven: number;
    acceptedAnswers: number;
    helpfulPosts: number;
  };

  // Status
  rank: string;
  joinedAt: Date;
}

export interface ForumNotification {
  id: string;
  userId: string;

  type: 'reply' | 'mention' | 'upvote' | 'accepted_answer' | 'new_topic' | 'badge_earned';

  // Content
  title: string;
  message: string;

  // Reference
  topicId?: string;
  postId?: string;

  // Status
  isRead: boolean;
  createdAt: Date;
}

export interface ForumSearchResult {
  type: 'topic' | 'post';
  id: string;
  title?: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  categoryId?: string;
  topicId?: string;
  createdAt: Date;
  relevance: number;
}

export class CommunityForumSystem {
  private categories: Map<string, ForumCategory>;
  private topics: Map<string, ForumTopic>;
  private posts: Map<string, ForumPost>;
  private reputations: Map<string, UserReputation>;
  private notifications: Map<string, ForumNotification>;

  constructor() {
    this.categories = new Map();
    this.topics = new Map();
    this.posts = new Map();
    this.reputations = new Map();
    this.notifications = new Map();
    this.initializeCategories();
  }

  /**
   * Initialize forum categories
   */
  private initializeCategories() {
    const categories: ForumCategory[] = [
      {
        id: 'cat-general',
        name: 'General Discussion',
        description: 'General topics about Indian handicrafts and artisan culture',
        icon: '💬',
        color: '#3B82F6',
        permissions: {
          canPost: 'all',
          canComment: 'all',
          requiresApproval: false,
        },
        stats: { totalTopics: 0, totalPosts: 0, totalMembers: 0 },
        isActive: true,
        order: 1,
      },
      {
        id: 'cat-artisan-stories',
        name: 'Artisan Stories',
        description: 'Share and discover stories from artisans',
        icon: '📖',
        color: '#8B5CF6',
        permissions: {
          canPost: 'verified',
          canComment: 'all',
          requiresApproval: false,
        },
        stats: { totalTopics: 0, totalPosts: 0, totalMembers: 0 },
        isActive: true,
        order: 2,
      },
      {
        id: 'cat-techniques',
        name: 'Craft Techniques',
        description: 'Learn and share traditional craft techniques',
        icon: '🛠️',
        color: '#10B981',
        permissions: {
          canPost: 'artisans',
          canComment: 'all',
          requiresApproval: false,
        },
        stats: { totalTopics: 0, totalPosts: 0, totalMembers: 0 },
        isActive: true,
        order: 3,
      },
      {
        id: 'cat-qna',
        name: 'Q&A',
        description: 'Ask questions and get answers from the community',
        icon: '❓',
        color: '#F59E0B',
        permissions: {
          canPost: 'all',
          canComment: 'all',
          requiresApproval: false,
        },
        stats: { totalTopics: 0, totalPosts: 0, totalMembers: 0 },
        isActive: true,
        order: 4,
      },
      {
        id: 'cat-marketplace',
        name: 'Marketplace Discussions',
        description: 'Discuss products, orders, and marketplace topics',
        icon: '🛍️',
        color: '#EF4444',
        permissions: {
          canPost: 'verified',
          canComment: 'all',
          requiresApproval: false,
        },
        stats: { totalTopics: 0, totalPosts: 0, totalMembers: 0 },
        isActive: true,
        order: 5,
      },
      {
        id: 'cat-workshops',
        name: 'Workshops & Events',
        description: 'Discuss workshops, events, and learning opportunities',
        icon: '🎓',
        color: '#06B6D4',
        permissions: {
          canPost: 'verified',
          canComment: 'all',
          requiresApproval: false,
        },
        stats: { totalTopics: 0, totalPosts: 0, totalMembers: 0 },
        isActive: true,
        order: 6,
      },
    ];

    categories.forEach((category) => {
      this.categories.set(category.id, category);
    });
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<ForumCategory[]> {
    return Array.from(this.categories.values())
      .filter((c) => c.isActive)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * Create new topic
   */
  async createTopic(params: {
    categoryId: string;
    author: ForumTopic['author'];
    title: string;
    content: string;
    tags: string[];
    attachments?: ForumTopic['attachments'];
  }): Promise<ForumTopic> {
    const category = this.categories.get(params.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check permissions
    if (category.permissions.canPost !== 'all') {
      // Would validate user role here
    }

    const topic: ForumTopic = {
      id: `topic-${Date.now()}`,
      categoryId: params.categoryId,
      author: params.author,
      title: params.title,
      content: params.content,
      tags: params.tags,
      attachments: params.attachments,
      status: category.permissions.requiresApproval ? 'draft' : 'published',
      isPinned: false,
      isFeatured: false,
      views: 0,
      replies: 0,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivityAt: new Date(),
      reportCount: 0,
      isApproved: !category.permissions.requiresApproval,
    };

    this.topics.set(topic.id, topic);

    // Update category stats
    category.stats.totalTopics++;

    return topic;
  }

  /**
   * Create post/reply
   */
  async createPost(params: {
    topicId: string;
    author: ForumPost['author'];
    content: string;
    replyToId?: string;
    attachments?: ForumPost['attachments'];
  }): Promise<ForumPost> {
    const topic = this.topics.get(params.topicId);
    if (!topic) {
      throw new Error('Topic not found');
    }

    if (topic.status === 'locked') {
      throw new Error('Topic is locked');
    }

    const post: ForumPost = {
      id: `post-${Date.now()}`,
      topicId: params.topicId,
      author: params.author,
      content: params.content,
      replyToId: params.replyToId,
      attachments: params.attachments,
      upvotes: 0,
      downvotes: 0,
      status: 'published',
      isAcceptedAnswer: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      reportCount: 0,
      isApproved: true,
    };

    this.posts.set(post.id, post);

    // Update topic stats
    topic.replies++;
    topic.lastActivityAt = new Date();

    // Update category stats
    const category = this.categories.get(topic.categoryId);
    if (category) {
      category.stats.totalPosts++;
    }

    // Notify topic author if it's a reply
    if (topic.author.id !== params.author.id) {
      await this.createNotification({
        userId: topic.author.id,
        type: 'reply',
        title: 'New reply to your topic',
        message: `${params.author.name} replied to "${topic.title}"`,
        topicId: params.topicId,
        postId: post.id,
      });
    }

    return post;
  }

  /**
   * Upvote topic or post
   */
  async upvote(params: { type: 'topic' | 'post'; id: string; userId: string }): Promise<void> {
    if (params.type === 'topic') {
      const topic = this.topics.get(params.id);
      if (topic) {
        topic.upvotes++;

        // Award reputation points
        await this.addReputationPoints(topic.author.id, 5, 'upvote_received');
      }
    } else {
      const post = this.posts.get(params.id);
      if (post) {
        post.upvotes++;

        // Award reputation points
        await this.addReputationPoints(post.author.id, 2, 'upvote_received');
      }
    }
  }

  /**
   * Mark post as accepted answer
   */
  async acceptAnswer(topicId: string, postId: string): Promise<void> {
    const topic = this.topics.get(topicId);
    const post = this.posts.get(postId);

    if (!topic || !post) {
      throw new Error('Topic or post not found');
    }

    if (post.topicId !== topicId) {
      throw new Error('Post does not belong to topic');
    }

    post.isAcceptedAnswer = true;

    // Award reputation points
    await this.addReputationPoints(post.author.id, 15, 'accepted_answer');

    // Notify post author
    await this.createNotification({
      userId: post.author.id,
      type: 'accepted_answer',
      title: 'Your answer was accepted',
      message: `Your answer to "${topic.title}" was marked as accepted`,
      topicId,
      postId,
    });
  }

  /**
   * Search topics and posts
   */
  async search(
    query: string,
    filters?: {
      categoryId?: string;
      tags?: string[];
      authorId?: string;
    }
  ): Promise<ForumSearchResult[]> {
    const results: ForumSearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ');

    // Search topics
    Array.from(this.topics.values()).forEach((topic) => {
      if (topic.status !== 'published') return;

      // Apply filters
      if (filters?.categoryId && topic.categoryId !== filters.categoryId) return;
      if (filters?.authorId && topic.author.id !== filters.authorId) return;
      if (filters?.tags && !filters.tags.some((tag) => topic.tags.includes(tag))) return;

      const titleLower = topic.title.toLowerCase();
      const contentLower = topic.content.toLowerCase();

      let relevance = 0;
      searchTerms.forEach((term) => {
        if (titleLower.includes(term)) relevance += 3;
        if (contentLower.includes(term)) relevance += 1;
        if (topic.tags.some((tag) => tag.toLowerCase().includes(term))) relevance += 2;
      });

      if (relevance > 0) {
        results.push({
          type: 'topic',
          id: topic.id,
          title: topic.title,
          content: topic.content,
          author: {
            id: topic.author.id,
            name: topic.author.name,
          },
          categoryId: topic.categoryId,
          createdAt: topic.createdAt,
          relevance,
        });
      }
    });

    // Search posts
    Array.from(this.posts.values()).forEach((post) => {
      if (post.status === 'deleted' || post.status === 'hidden') return;

      // Apply filters
      if (filters?.authorId && post.author.id !== filters.authorId) return;

      const contentLower = post.content.toLowerCase();

      let relevance = 0;
      searchTerms.forEach((term) => {
        if (contentLower.includes(term)) relevance += 1;
      });

      if (relevance > 0) {
        results.push({
          type: 'post',
          id: post.id,
          content: post.content,
          author: {
            id: post.author.id,
            name: post.author.name,
          },
          topicId: post.topicId,
          createdAt: post.createdAt,
          relevance,
        });
      }
    });

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Get topics by category
   */
  async getTopicsByCategory(
    categoryId: string,
    options?: {
      sortBy?: 'recent' | 'popular' | 'trending';
      limit?: number;
      offset?: number;
    }
  ): Promise<ForumTopic[]> {
    let topics = Array.from(this.topics.values()).filter(
      (t) => t.categoryId === categoryId && t.status === 'published'
    );

    // Sort
    switch (options?.sortBy) {
      case 'popular':
        topics.sort((a, b) => b.upvotes + b.replies - (a.upvotes + a.replies));
        break;
      case 'trending':
        // Simple trending algorithm based on recent activity and engagement
        topics.sort((a, b) => {
          const aScore =
            (a.upvotes * 2 + a.replies) /
            Math.max(1, (Date.now() - a.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
          const bScore =
            (b.upvotes * 2 + b.replies) /
            Math.max(1, (Date.now() - b.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
          return bScore - aScore;
        });
        break;
      default: // 'recent'
        topics.sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime());
    }

    // Pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 20;

    return topics.slice(offset, offset + limit);
  }

  /**
   * Get posts by topic
   */
  async getPostsByTopic(topicId: string): Promise<ForumPost[]> {
    // Increment view count
    const topic = this.topics.get(topicId);
    if (topic) {
      topic.views++;
    }

    return Array.from(this.posts.values())
      .filter((p) => p.topicId === topicId && p.status !== 'deleted')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  /**
   * Add reputation points
   */
  private async addReputationPoints(
    userId: string,
    points: number,
    reason: keyof UserReputation['activity']
  ): Promise<void> {
    let reputation = this.reputations.get(userId);

    if (!reputation) {
      reputation = {
        userId,
        username: 'User',
        points: 0,
        level: 1,
        badges: [],
        activity: {
          topicsCreated: 0,
          postsCreated: 0,
          upvotesReceived: 0,
          upvotesGiven: 0,
          acceptedAnswers: 0,
          helpfulPosts: 0,
        },
        rank: 'Newcomer',
        joinedAt: new Date(),
      };
      this.reputations.set(userId, reputation);
    }

    reputation.points += points;

    // Update activity
    if (reason === 'upvote_received') {
      reputation.activity.upvotesReceived++;
    } else if (reason === 'accepted_answer') {
      reputation.activity.acceptedAnswers++;
    }

    // Calculate level
    reputation.level = Math.floor(reputation.points / 100) + 1;

    // Update rank
    if (reputation.points >= 1000) reputation.rank = 'Expert';
    else if (reputation.points >= 500) reputation.rank = 'Contributor';
    else if (reputation.points >= 100) reputation.rank = 'Regular';
    else reputation.rank = 'Newcomer';
  }

  /**
   * Create notification
   */
  private async createNotification(params: {
    userId: string;
    type: ForumNotification['type'];
    title: string;
    message: string;
    topicId?: string;
    postId?: string;
  }): Promise<void> {
    const notification: ForumNotification = {
      id: `notif-${Date.now()}`,
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      topicId: params.topicId,
      postId: params.postId,
      isRead: false,
      createdAt: new Date(),
    };

    this.notifications.set(notification.id, notification);
  }

  /**
   * Get user reputation
   */
  async getUserReputation(userId: string): Promise<UserReputation | null> {
    return this.reputations.get(userId) || null;
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    unreadOnly: boolean = false
  ): Promise<ForumNotification[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId && (!unreadOnly || !n.isRead))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get forum statistics
   */
  async getForumStats() {
    const categories = Array.from(this.categories.values());
    const topics = Array.from(this.topics.values());
    const posts = Array.from(this.posts.values());
    const users = Array.from(this.reputations.values());

    const totalCategories = categories.filter((c) => c.isActive).length;
    const totalTopics = topics.filter((t) => t.status === 'published').length;
    const totalPosts = posts.filter((p) => p.status === 'published').length;
    const totalUsers = users.length;

    const topContributors = users.sort((a, b) => b.points - a.points).slice(0, 10);

    const trendingTopics = topics
      .filter((t) => t.status === 'published')
      .sort((a, b) => {
        const aScore =
          (a.upvotes * 2 + a.replies) /
          Math.max(1, (Date.now() - a.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
        const bScore =
          (b.upvotes * 2 + b.replies) /
          Math.max(1, (Date.now() - b.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
        return bScore - aScore;
      })
      .slice(0, 5);

    return {
      totalCategories,
      totalTopics,
      totalPosts,
      totalUsers,
      topContributors,
      trendingTopics,
    };
  }
}

// Export singleton instance
export const communityForumSystem = new CommunityForumSystem();
