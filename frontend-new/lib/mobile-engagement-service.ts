/**
 * Mobile Engagement Service
 *
 * Drives user engagement on mobile devices:
 * - In-app messaging
 * - App rating and review prompts
 * - Referral program
 * - Loyalty rewards
 * - Gamification
 * - User onboarding
 */

export interface InAppMessage {
  id: string;
  type: 'banner' | 'modal' | 'fullscreen' | 'tooltip' | 'bottom_sheet';
  priority: 'high' | 'normal' | 'low';
  trigger: 'on_open' | 'on_screen' | 'on_event' | 'scheduled';
  triggerValue?: string;
  title: string;
  message: string;
  imageUrl?: string;
  ctaText?: string;
  ctaAction?: string;
  dismissible: boolean;
  displayedCount: number;
  clickedCount: number;
  dismissedCount: number;
  active: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface AppRating {
  id: string;
  userId: string;
  deviceId: string;
  rating: number; // 1-5
  review?: string;
  version: string;
  submittedAt: Date;
  platform: 'ios' | 'android';
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface RatingPrompt {
  id: string;
  userId: string;
  deviceId: string;
  promptedAt: Date;
  action: 'rated' | 'dismissed' | 'later' | 'never';
  rating?: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId?: string;
  referralCode: string;
  channel: 'sms' | 'email' | 'whatsapp' | 'social' | 'link';
  status: 'pending' | 'signed_up' | 'completed' | 'expired';
  reward: {
    referrerReward: number;
    refereeReward: number;
    currency: string;
  };
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

export interface LoyaltyPoints {
  id: string;
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  transactions: {
    type: 'earn' | 'redeem';
    amount: number;
    reason: string;
    timestamp: Date;
  }[];
  expiringPoints: {
    amount: number;
    expiresAt: Date;
  }[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'shopping' | 'social' | 'engagement' | 'special';
  requirement: {
    type: 'purchase_count' | 'total_spent' | 'referrals' | 'reviews' | 'streak';
    value: number;
  };
  unlockedBy: string[]; // user IDs
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number; // 0-100
  notified: boolean;
}

export interface OnboardingProgress {
  id: string;
  userId: string;
  deviceId: string;
  steps: {
    step: string;
    name: string;
    completed: boolean;
    completedAt?: Date;
    skipped: boolean;
  }[];
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  completed: boolean;
  completedAt?: Date;
}

export interface DailyStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  milestones: {
    days: number;
    reward: number;
    claimed: boolean;
    claimedAt?: Date;
  }[];
}

export class MobileEngagementService {
  private inAppMessages: Map<string, InAppMessage> = new Map();
  private appRatings: Map<string, AppRating> = new Map();
  private ratingPrompts: Map<string, RatingPrompt> = new Map();
  private referrals: Map<string, Referral> = new Map();
  private loyaltyPoints: Map<string, LoyaltyPoints> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private userAchievements: Map<string, UserAchievement> = new Map();
  private onboardingProgress: Map<string, OnboardingProgress> = new Map();
  private dailyStreaks: Map<string, DailyStreak> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Create in-app message
   */
  async createInAppMessage(data: {
    type: InAppMessage['type'];
    priority: InAppMessage['priority'];
    trigger: InAppMessage['trigger'];
    triggerValue?: string;
    title: string;
    message: string;
    imageUrl?: string;
    ctaText?: string;
    ctaAction?: string;
    dismissible?: boolean;
    expiresAt?: Date;
  }): Promise<InAppMessage> {
    const message: InAppMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      type: data.type,
      priority: data.priority,
      trigger: data.trigger,
      triggerValue: data.triggerValue,
      title: data.title,
      message: data.message,
      imageUrl: data.imageUrl,
      ctaText: data.ctaText,
      ctaAction: data.ctaAction,
      dismissible: data.dismissible !== false,
      displayedCount: 0,
      clickedCount: 0,
      dismissedCount: 0,
      active: true,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
    };

    this.inAppMessages.set(message.id, message);
    return message;
  }

  /**
   * Get messages for trigger
   */
  async getMessagesForTrigger(
    trigger: InAppMessage['trigger'],
    triggerValue?: string
  ): Promise<InAppMessage[]> {
    const now = new Date();
    return Array.from(this.inAppMessages.values())
      .filter((m) => {
        if (!m.active) return false;
        if (m.expiresAt && m.expiresAt < now) return false;
        if (m.trigger !== trigger) return false;
        if (m.triggerValue && m.triggerValue !== triggerValue) return false;
        return true;
      })
      .sort((a, b) => {
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }

  /**
   * Track message interaction
   */
  async trackMessageInteraction(
    messageId: string,
    action: 'displayed' | 'clicked' | 'dismissed'
  ): Promise<void> {
    const message = this.inAppMessages.get(messageId);
    if (message) {
      if (action === 'displayed') message.displayedCount++;
      if (action === 'clicked') message.clickedCount++;
      if (action === 'dismissed') message.dismissedCount++;
      this.inAppMessages.set(messageId, message);
    }
  }

  /**
   * Submit app rating
   */
  async submitRating(data: {
    userId: string;
    deviceId: string;
    rating: number;
    review?: string;
    version: string;
    platform: 'ios' | 'android';
  }): Promise<AppRating> {
    const sentiment: AppRating['sentiment'] =
      data.rating >= 4 ? 'positive' : data.rating === 3 ? 'neutral' : 'negative';

    const rating: AppRating = {
      id: `rating-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      deviceId: data.deviceId,
      rating: data.rating,
      review: data.review,
      version: data.version,
      submittedAt: new Date(),
      platform: data.platform,
      sentiment,
    };

    this.appRatings.set(rating.id, rating);

    // Award loyalty points for rating
    await this.awardPoints(data.userId, 50, 'App rating submitted');

    return rating;
  }

  /**
   * Prompt for rating
   */
  async promptRating(userId: string, deviceId: string): Promise<RatingPrompt> {
    const prompt: RatingPrompt = {
      id: `prompt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      deviceId,
      promptedAt: new Date(),
      action: 'later', // default, will be updated
    };

    this.ratingPrompts.set(prompt.id, prompt);
    return prompt;
  }

  /**
   * Update rating prompt action
   */
  async updateRatingPromptAction(
    promptId: string,
    action: RatingPrompt['action'],
    rating?: number
  ): Promise<void> {
    const prompt = this.ratingPrompts.get(promptId);
    if (prompt) {
      prompt.action = action;
      prompt.rating = rating;
      this.ratingPrompts.set(promptId, prompt);
    }
  }

  /**
   * Create referral
   */
  async createReferral(data: {
    referrerId: string;
    channel: Referral['channel'];
  }): Promise<Referral> {
    const referralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // 90 days validity

    const referral: Referral = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      referrerId: data.referrerId,
      referralCode,
      channel: data.channel,
      status: 'pending',
      reward: {
        referrerReward: 500,
        refereeReward: 200,
        currency: 'INR',
      },
      createdAt: new Date(),
      expiresAt,
    };

    this.referrals.set(referral.id, referral);
    return referral;
  }

  /**
   * Complete referral
   */
  async completeReferral(referralCode: string, refereeId: string): Promise<Referral | null> {
    const referral = Array.from(this.referrals.values()).find(
      (r) => r.referralCode === referralCode && r.status === 'pending'
    );

    if (!referral) {
      return null;
    }

    referral.refereeId = refereeId;
    referral.status = 'completed';
    referral.completedAt = new Date();
    this.referrals.set(referral.id, referral);

    // Award points to both users
    await this.awardPoints(referral.referrerId, referral.reward.referrerReward, 'Referral reward');
    await this.awardPoints(refereeId, referral.reward.refereeReward, 'Referral signup reward');

    return referral;
  }

  /**
   * Award loyalty points
   */
  async awardPoints(userId: string, points: number, reason: string): Promise<LoyaltyPoints> {
    let loyalty = Array.from(this.loyaltyPoints.values()).find((l) => l.userId === userId);

    if (!loyalty) {
      loyalty = {
        id: `loyalty-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        userId,
        points: 0,
        tier: 'bronze',
        transactions: [],
        expiringPoints: [],
      };
    }

    loyalty.points += points;
    loyalty.transactions.push({
      type: 'earn',
      amount: points,
      reason,
      timestamp: new Date(),
    });

    // Update tier
    loyalty.tier = this.calculateTier(loyalty.points);

    // Set expiry for points (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    loyalty.expiringPoints.push({
      amount: points,
      expiresAt,
    });

    this.loyaltyPoints.set(loyalty.id, loyalty);
    return loyalty;
  }

  /**
   * Redeem loyalty points
   */
  async redeemPoints(
    userId: string,
    points: number,
    reason: string
  ): Promise<LoyaltyPoints | null> {
    const loyalty = Array.from(this.loyaltyPoints.values()).find((l) => l.userId === userId);

    if (!loyalty || loyalty.points < points) {
      return null;
    }

    loyalty.points -= points;
    loyalty.transactions.push({
      type: 'redeem',
      amount: points,
      reason,
      timestamp: new Date(),
    });

    loyalty.tier = this.calculateTier(loyalty.points);
    this.loyaltyPoints.set(loyalty.id, loyalty);

    return loyalty;
  }

  /**
   * Get user's loyalty points
   */
  async getLoyaltyPoints(userId: string): Promise<LoyaltyPoints | null> {
    return Array.from(this.loyaltyPoints.values()).find((l) => l.userId === userId) || null;
  }

  /**
   * Create achievement
   */
  async createAchievement(data: {
    name: string;
    description: string;
    icon: string;
    points: number;
    category: Achievement['category'];
    requirement: Achievement['requirement'];
  }): Promise<Achievement> {
    const achievement: Achievement = {
      id: `ach-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      description: data.description,
      icon: data.icon,
      points: data.points,
      category: data.category,
      requirement: data.requirement,
      unlockedBy: [],
    };

    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  /**
   * Unlock achievement
   */
  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const achievement = this.achievements.get(achievementId);
    if (!achievement) {
      throw new Error('Achievement not found');
    }

    const userAchievement: UserAchievement = {
      id: `user-ach-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      achievementId,
      unlockedAt: new Date(),
      progress: 100,
      notified: false,
    };

    this.userAchievements.set(userAchievement.id, userAchievement);

    // Add user to achievement's unlocked list
    achievement.unlockedBy.push(userId);
    this.achievements.set(achievementId, achievement);

    // Award points
    await this.awardPoints(userId, achievement.points, `Achievement: ${achievement.name}`);

    return userAchievement;
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(userId: string): Promise<{
    unlocked: (UserAchievement & { achievement: Achievement })[];
    available: Achievement[];
  }> {
    const unlocked = Array.from(this.userAchievements.values())
      .filter((ua) => ua.userId === userId)
      .map((ua) => ({
        ...ua,
        achievement: this.achievements.get(ua.achievementId)!,
      }))
      .filter((ua) => ua.achievement);

    const unlockedIds = new Set(unlocked.map((u) => u.achievementId));
    const available = Array.from(this.achievements.values()).filter((a) => !unlockedIds.has(a.id));

    return { unlocked, available };
  }

  /**
   * Start onboarding
   */
  async startOnboarding(userId: string, deviceId: string): Promise<OnboardingProgress> {
    const steps = [
      { step: 'welcome', name: 'Welcome', completed: false, skipped: false },
      { step: 'permissions', name: 'Set Permissions', completed: false, skipped: false },
      { step: 'profile', name: 'Complete Profile', completed: false, skipped: false },
      { step: 'preferences', name: 'Set Preferences', completed: false, skipped: false },
      { step: 'tutorial', name: 'Quick Tutorial', completed: false, skipped: false },
    ];

    const onboarding: OnboardingProgress = {
      id: `onboard-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      deviceId,
      steps,
      currentStep: 0,
      totalSteps: steps.length,
      completionPercentage: 0,
      completed: false,
    };

    this.onboardingProgress.set(onboarding.id, onboarding);
    return onboarding;
  }

  /**
   * Update onboarding step
   */
  async updateOnboardingStep(
    onboardingId: string,
    stepIndex: number,
    completed: boolean,
    skipped: boolean = false
  ): Promise<OnboardingProgress> {
    const onboarding = this.onboardingProgress.get(onboardingId);
    if (!onboarding) {
      throw new Error('Onboarding not found');
    }

    if (stepIndex < onboarding.steps.length) {
      onboarding.steps[stepIndex].completed = completed;
      onboarding.steps[stepIndex].skipped = skipped;
      if (completed || skipped) {
        onboarding.steps[stepIndex].completedAt = new Date();
      }
    }

    // Update progress
    const completedSteps = onboarding.steps.filter((s) => s.completed || s.skipped).length;
    onboarding.completionPercentage = (completedSteps / onboarding.totalSteps) * 100;
    onboarding.currentStep = stepIndex + 1;

    // Check if all steps are done
    if (completedSteps === onboarding.totalSteps) {
      onboarding.completed = true;
      onboarding.completedAt = new Date();

      // Award points for completing onboarding
      await this.awardPoints(onboarding.userId, 100, 'Onboarding completed');
    }

    this.onboardingProgress.set(onboardingId, onboarding);
    return onboarding;
  }

  /**
   * Track daily streak
   */
  async trackDailyStreak(userId: string): Promise<DailyStreak> {
    let streak = Array.from(this.dailyStreaks.values()).find((s) => s.userId === userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!streak) {
      streak = {
        id: `streak-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        milestones: [
          { days: 7, reward: 100, claimed: false },
          { days: 30, reward: 500, claimed: false },
          { days: 100, reward: 2000, claimed: false },
        ],
      };
    } else {
      const lastActive = new Date(streak.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / 86400000);

      if (daysDiff === 0) {
        // Already active today, no change
      } else if (daysDiff === 1) {
        // Consecutive day
        streak.currentStreak++;
        streak.lastActiveDate = today;
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
      } else {
        // Streak broken
        streak.currentStreak = 1;
        streak.lastActiveDate = today;
      }
    }

    this.dailyStreaks.set(streak.id, streak);
    return streak;
  }

  /**
   * Claim streak milestone
   */
  async claimStreakMilestone(
    userId: string,
    days: number
  ): Promise<{ claimed: boolean; reward: number }> {
    const streak = Array.from(this.dailyStreaks.values()).find((s) => s.userId === userId);

    if (!streak) {
      return { claimed: false, reward: 0 };
    }

    const milestone = streak.milestones.find((m) => m.days === days);
    if (!milestone || milestone.claimed || streak.currentStreak < days) {
      return { claimed: false, reward: 0 };
    }

    milestone.claimed = true;
    milestone.claimedAt = new Date();
    this.dailyStreaks.set(streak.id, streak);

    // Award points
    await this.awardPoints(userId, milestone.reward, `${days}-day streak milestone`);

    return { claimed: true, reward: milestone.reward };
  }

  /**
   * Get engagement analytics
   */
  async getAnalytics(): Promise<{
    inAppMessages: {
      active: number;
      averageCTR: number;
      averageDismissRate: number;
    };
    ratings: {
      total: number;
      averageRating: number;
      byPlatform: Record<string, number>;
      bySentiment: Record<string, number>;
    };
    referrals: {
      total: number;
      completed: number;
      conversionRate: number;
    };
    loyalty: {
      totalUsers: number;
      byTier: Record<string, number>;
      totalPointsAwarded: number;
      totalPointsRedeemed: number;
    };
    achievements: {
      total: number;
      totalUnlocked: number;
      mostPopular: { name: string; unlockedCount: number }[];
    };
    onboarding: {
      started: number;
      completed: number;
      completionRate: number;
      averageCompletionTime: number;
    };
    streaks: {
      activeStreaks: number;
      longestStreak: number;
      averageStreak: number;
    };
  }> {
    // In-app messages
    const activeMessages = Array.from(this.inAppMessages.values()).filter((m) => m.active);
    const avgCTR =
      activeMessages.length > 0
        ? activeMessages.reduce((sum, m) => {
            const ctr = m.displayedCount > 0 ? (m.clickedCount / m.displayedCount) * 100 : 0;
            return sum + ctr;
          }, 0) / activeMessages.length
        : 0;
    const avgDismissRate =
      activeMessages.length > 0
        ? activeMessages.reduce((sum, m) => {
            const dr = m.displayedCount > 0 ? (m.dismissedCount / m.displayedCount) * 100 : 0;
            return sum + dr;
          }, 0) / activeMessages.length
        : 0;

    // Ratings
    const ratings = Array.from(this.appRatings.values());
    const avgRating =
      ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
    const ratingsByPlatform = ratings.reduce(
      (acc, r) => {
        acc[r.platform] = (acc[r.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const ratingsBySentiment = ratings.reduce(
      (acc, r) => {
        acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Referrals
    const referrals = Array.from(this.referrals.values());
    const completedReferrals = referrals.filter((r) => r.status === 'completed');
    const referralConversionRate =
      referrals.length > 0 ? (completedReferrals.length / referrals.length) * 100 : 0;

    // Loyalty
    const loyaltyUsers = Array.from(this.loyaltyPoints.values());
    const loyaltyByTier = loyaltyUsers.reduce(
      (acc, l) => {
        acc[l.tier] = (acc[l.tier] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const totalPointsAwarded = loyaltyUsers.reduce((sum, l) => {
      return (
        sum + l.transactions.filter((t) => t.type === 'earn').reduce((s, t) => s + t.amount, 0)
      );
    }, 0);
    const totalPointsRedeemed = loyaltyUsers.reduce((sum, l) => {
      return (
        sum + l.transactions.filter((t) => t.type === 'redeem').reduce((s, t) => s + t.amount, 0)
      );
    }, 0);

    // Achievements
    const achievements = Array.from(this.achievements.values());
    const userAchievements = Array.from(this.userAchievements.values());
    const achievementCounts = achievements
      .map((a) => ({
        name: a.name,
        unlockedCount: a.unlockedBy.length,
      }))
      .sort((a, b) => b.unlockedCount - a.unlockedCount)
      .slice(0, 5);

    // Onboarding
    const onboardings = Array.from(this.onboardingProgress.values());
    const completedOnboardings = onboardings.filter((o) => o.completed);
    const onboardingCompletionRate =
      onboardings.length > 0 ? (completedOnboardings.length / onboardings.length) * 100 : 0;

    // Streaks
    const streaks = Array.from(this.dailyStreaks.values());
    const activeStreaks = streaks.filter((s) => s.currentStreak > 0);
    const longestStreak = streaks.length > 0 ? Math.max(...streaks.map((s) => s.longestStreak)) : 0;
    const avgStreak =
      activeStreaks.length > 0
        ? activeStreaks.reduce((sum, s) => sum + s.currentStreak, 0) / activeStreaks.length
        : 0;

    return {
      inAppMessages: {
        active: activeMessages.length,
        averageCTR: Math.round(avgCTR * 100) / 100,
        averageDismissRate: Math.round(avgDismissRate * 100) / 100,
      },
      ratings: {
        total: ratings.length,
        averageRating: Math.round(avgRating * 10) / 10,
        byPlatform: ratingsByPlatform,
        bySentiment: ratingsBySentiment,
      },
      referrals: {
        total: referrals.length,
        completed: completedReferrals.length,
        conversionRate: Math.round(referralConversionRate * 100) / 100,
      },
      loyalty: {
        totalUsers: loyaltyUsers.length,
        byTier: loyaltyByTier,
        totalPointsAwarded,
        totalPointsRedeemed,
      },
      achievements: {
        total: achievements.length,
        totalUnlocked: userAchievements.length,
        mostPopular: achievementCounts,
      },
      onboarding: {
        started: onboardings.length,
        completed: completedOnboardings.length,
        completionRate: Math.round(onboardingCompletionRate * 100) / 100,
        averageCompletionTime: 0, // Would calculate from timestamps
      },
      streaks: {
        activeStreaks: activeStreaks.length,
        longestStreak,
        averageStreak: Math.round(avgStreak * 10) / 10,
      },
    };
  }

  /**
   * Helper: Calculate loyalty tier
   */
  private calculateTier(points: number): LoyaltyPoints['tier'] {
    if (points >= 10000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 2000) return 'silver';
    return 'bronze';
  }

  /**
   * Initialize default data
   */
  private initializeDefaultData(): void {
    // Create sample in-app messages
    this.createInAppMessage({
      type: 'banner',
      priority: 'high',
      trigger: 'on_open',
      title: 'Welcome Back!',
      message: 'Check out our new artisan collection',
      ctaText: 'Browse Now',
      ctaAction: '/market',
    });

    // Create sample achievements
    this.createAchievement({
      name: 'First Purchase',
      description: 'Make your first purchase on the app',
      icon: '🛍️',
      points: 100,
      category: 'shopping',
      requirement: { type: 'purchase_count', value: 1 },
    });

    this.createAchievement({
      name: 'Big Spender',
      description: 'Spend ₹10,000 or more',
      icon: '💎',
      points: 500,
      category: 'shopping',
      requirement: { type: 'total_spent', value: 10000 },
    });

    this.createAchievement({
      name: 'Social Butterfly',
      description: 'Refer 5 friends',
      icon: '🦋',
      points: 300,
      category: 'social',
      requirement: { type: 'referrals', value: 5 },
    });
  }
}

// Singleton instance
export const mobileEngagementService = new MobileEngagementService();
