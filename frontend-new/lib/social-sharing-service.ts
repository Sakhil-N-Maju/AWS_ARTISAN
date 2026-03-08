/**
 * Social Sharing Service
 *
 * Enables social sharing across platforms:
 * - Share products, artisans, stories, workshops
 * - Generate share links with tracking
 * - Social meta tags
 * - Referral tracking
 * - Share analytics
 */

export interface ShareableContent {
  id: string;
  type: 'product' | 'artisan' | 'story' | 'workshop' | 'collection';
  title: string;
  description: string;
  imageUrl: string;
  url: string;

  // Metadata
  metadata?: {
    price?: number;
    currency?: string;
    rating?: number;
    tags?: string[];
  };
}

export interface ShareLink {
  id: string;
  contentId: string;
  contentType: ShareableContent['type'];

  // Platform
  platform:
    | 'facebook'
    | 'twitter'
    | 'instagram'
    | 'pinterest'
    | 'whatsapp'
    | 'email'
    | 'copy'
    | 'native';

  // Link
  shortUrl: string;
  fullUrl: string;

  // Tracking
  sharedBy?: {
    userId: string;
    username: string;
  };

  // Analytics
  clicks: number;
  conversions: number;
  revenue: number;

  // Timestamps
  createdAt: Date;
  expiresAt?: Date;
}

export interface SocialMetaTags {
  // Open Graph (Facebook, LinkedIn)
  og: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: 'website' | 'article' | 'product';
    siteName: string;
  };

  // Twitter Card
  twitter: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    title: string;
    description: string;
    image: string;
    site: string;
    creator?: string;
  };

  // Pinterest
  pinterest: {
    description: string;
    media: string;
  };
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;

  // Rewards
  rewards: {
    referrer: {
      type: 'percentage' | 'fixed' | 'points';
      value: number;
      currency?: string;
    };
    referee: {
      type: 'percentage' | 'fixed' | 'points';
      value: number;
      currency?: string;
    };
  };

  // Rules
  rules: {
    minimumPurchase?: number;
    expiryDays?: number;
    maxRedemptions?: number;
    eligibleProducts?: string[];
  };

  isActive: boolean;
}

export interface Referral {
  id: string;
  code: string;
  programId: string;

  // Referrer
  referrer: {
    userId: string;
    username: string;
  };

  // Stats
  stats: {
    clicks: number;
    signups: number;
    purchases: number;
    revenue: number;
    rewardEarned: number;
  };

  // Status
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ShareAnalytics {
  period: {
    start: Date;
    end: Date;
  };

  // Overall
  overall: {
    totalShares: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    conversionRate: number;
  };

  // By Platform
  byPlatform: Record<
    string,
    {
      shares: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }
  >;

  // By Content Type
  byContentType: Record<
    string,
    {
      shares: number;
      clicks: number;
      conversions: number;
    }
  >;

  // Top Shared
  topShared: {
    contentId: string;
    contentType: string;
    title: string;
    shares: number;
    clicks: number;
    conversions: number;
  }[];

  // Top Referrers
  topReferrers: {
    userId: string;
    username: string;
    referrals: number;
    revenue: number;
    rewardEarned: number;
  }[];
}

export class SocialSharingService {
  private shareLinks: Map<string, ShareLink>;
  private referralPrograms: Map<string, ReferralProgram>;
  private referrals: Map<string, Referral>;

  constructor() {
    this.shareLinks = new Map();
    this.referralPrograms = new Map();
    this.referrals = new Map();
    this.initializeReferralProgram();
  }

  /**
   * Initialize default referral program
   */
  private initializeReferralProgram() {
    const program: ReferralProgram = {
      id: 'default',
      name: 'Friend Referral Program',
      description: 'Refer friends and earn rewards',
      rewards: {
        referrer: {
          type: 'percentage',
          value: 10,
        },
        referee: {
          type: 'percentage',
          value: 10,
        },
      },
      rules: {
        minimumPurchase: 500,
        expiryDays: 30,
      },
      isActive: true,
    };

    this.referralPrograms.set(program.id, program);
  }

  /**
   * Generate share link
   */
  async generateShareLink(params: {
    content: ShareableContent;
    platform: ShareLink['platform'];
    sharedBy?: ShareLink['sharedBy'];
  }): Promise<ShareLink> {
    const shareId = `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const baseUrl = 'https://artisans.com';
    const fullUrl = `${baseUrl}/${params.content.type}/${params.content.id}?ref=${shareId}`;

    // Generate short URL (in production would use URL shortening service)
    const shortUrl = `${baseUrl}/s/${shareId.substr(-8)}`;

    const shareLink: ShareLink = {
      id: shareId,
      contentId: params.content.id,
      contentType: params.content.type,
      platform: params.platform,
      shortUrl,
      fullUrl,
      sharedBy: params.sharedBy,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      createdAt: new Date(),
    };

    this.shareLinks.set(shareId, shareLink);
    return shareLink;
  }

  /**
   * Generate social meta tags
   */
  generateMetaTags(content: ShareableContent): SocialMetaTags {
    const baseUrl = 'https://artisans.com';
    const url = `${baseUrl}/${content.type}/${content.id}`;

    return {
      og: {
        title: content.title,
        description: content.description,
        image: content.imageUrl,
        url,
        type: content.type === 'product' ? 'product' : 'website',
        siteName: 'Artisans - Indian Handicrafts Marketplace',
      },
      twitter: {
        card: 'summary_large_image',
        title: content.title,
        description: content.description,
        image: content.imageUrl,
        site: '@ArtisansMarket',
      },
      pinterest: {
        description: content.description,
        media: content.imageUrl,
      },
    };
  }

  /**
   * Generate platform-specific share URL
   */
  getPlatformShareUrl(content: ShareableContent, platform: ShareLink['platform']): string {
    const shareLink = `https://artisans.com/${content.type}/${content.id}`;
    const encodedUrl = encodeURIComponent(shareLink);
    const encodedTitle = encodeURIComponent(content.title);
    const encodedDescription = encodeURIComponent(content.description);

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

      case 'pinterest':
        return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(content.imageUrl)}&description=${encodedDescription}`;

      case 'whatsapp':
        return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

      case 'email':
        return `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;

      default:
        return shareLink;
    }
  }

  /**
   * Track share link click
   */
  async trackClick(shareId: string): Promise<void> {
    const shareLink = this.shareLinks.get(shareId);
    if (shareLink) {
      shareLink.clicks++;
    }
  }

  /**
   * Track conversion
   */
  async trackConversion(shareId: string, revenue: number): Promise<void> {
    const shareLink = this.shareLinks.get(shareId);
    if (shareLink) {
      shareLink.conversions++;
      shareLink.revenue += revenue;

      // Update referral stats if shared by a user
      if (shareLink.sharedBy) {
        const referral = Array.from(this.referrals.values()).find(
          (r) => r.referrer.userId === shareLink.sharedBy!.userId
        );

        if (referral) {
          referral.stats.purchases++;
          referral.stats.revenue += revenue;

          // Calculate reward
          const program = this.referralPrograms.get(referral.programId);
          if (program) {
            if (program.rewards.referrer.type === 'percentage') {
              const reward = (revenue * program.rewards.referrer.value) / 100;
              referral.stats.rewardEarned += reward;
            }
          }
        }
      }
    }
  }

  /**
   * Create referral code
   */
  async createReferral(params: {
    programId: string;
    userId: string;
    username: string;
  }): Promise<Referral> {
    const program = this.referralPrograms.get(params.programId);
    if (!program || !program.isActive) {
      throw new Error('Referral program not found or inactive');
    }

    // Check if user already has a referral
    const existing = Array.from(this.referrals.values()).find(
      (r) => r.referrer.userId === params.userId && r.programId === params.programId
    );

    if (existing) {
      return existing;
    }

    const code = `${params.username.toUpperCase().substr(0, 4)}${Date.now().toString().substr(-6)}`;

    const referral: Referral = {
      id: `ref-${Date.now()}`,
      code,
      programId: params.programId,
      referrer: {
        userId: params.userId,
        username: params.username,
      },
      stats: {
        clicks: 0,
        signups: 0,
        purchases: 0,
        revenue: 0,
        rewardEarned: 0,
      },
      isActive: true,
      createdAt: new Date(),
      expiresAt: program.rules.expiryDays
        ? new Date(Date.now() + program.rules.expiryDays * 24 * 60 * 60 * 1000)
        : undefined,
    };

    this.referrals.set(referral.id, referral);
    return referral;
  }

  /**
   * Apply referral code
   */
  async applyReferralCode(code: string): Promise<{
    valid: boolean;
    discount?: number;
    discountType?: string;
  }> {
    const referral = Array.from(this.referrals.values()).find((r) => r.code === code);

    if (!referral || !referral.isActive) {
      return { valid: false };
    }

    if (referral.expiresAt && referral.expiresAt < new Date()) {
      return { valid: false };
    }

    const program = this.referralPrograms.get(referral.programId);
    if (!program || !program.isActive) {
      return { valid: false };
    }

    // Track click
    referral.stats.clicks++;

    return {
      valid: true,
      discount: program.rewards.referee.value,
      discountType: program.rewards.referee.type,
    };
  }

  /**
   * Get share analytics
   */
  async getShareAnalytics(startDate: Date, endDate: Date): Promise<ShareAnalytics> {
    const shares = Array.from(this.shareLinks.values()).filter(
      (s) => s.createdAt >= startDate && s.createdAt <= endDate
    );

    const overall = {
      totalShares: shares.length,
      totalClicks: shares.reduce((sum, s) => sum + s.clicks, 0),
      totalConversions: shares.reduce((sum, s) => sum + s.conversions, 0),
      totalRevenue: shares.reduce((sum, s) => sum + s.revenue, 0),
      conversionRate: 0,
    };

    overall.conversionRate =
      overall.totalClicks > 0 ? (overall.totalConversions / overall.totalClicks) * 100 : 0;

    // By platform
    const byPlatform: ShareAnalytics['byPlatform'] = {};
    shares.forEach((share) => {
      if (!byPlatform[share.platform]) {
        byPlatform[share.platform] = {
          shares: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
        };
      }
      byPlatform[share.platform].shares++;
      byPlatform[share.platform].clicks += share.clicks;
      byPlatform[share.platform].conversions += share.conversions;
      byPlatform[share.platform].revenue += share.revenue;
    });

    // By content type
    const byContentType: ShareAnalytics['byContentType'] = {};
    shares.forEach((share) => {
      if (!byContentType[share.contentType]) {
        byContentType[share.contentType] = {
          shares: 0,
          clicks: 0,
          conversions: 0,
        };
      }
      byContentType[share.contentType].shares++;
      byContentType[share.contentType].clicks += share.clicks;
      byContentType[share.contentType].conversions += share.conversions;
    });

    // Top shared content
    const contentStats = new Map<string, any>();
    shares.forEach((share) => {
      const key = `${share.contentType}-${share.contentId}`;
      if (!contentStats.has(key)) {
        contentStats.set(key, {
          contentId: share.contentId,
          contentType: share.contentType,
          title: 'Content Title', // Would fetch actual title
          shares: 0,
          clicks: 0,
          conversions: 0,
        });
      }
      const stats = contentStats.get(key);
      stats.shares++;
      stats.clicks += share.clicks;
      stats.conversions += share.conversions;
    });

    const topShared = Array.from(contentStats.values())
      .sort((a, b) => b.shares - a.shares)
      .slice(0, 10);

    // Top referrers
    const referrerStats = new Map<string, any>();
    const referrals = Array.from(this.referrals.values());

    referrals.forEach((ref) => {
      referrerStats.set(ref.referrer.userId, {
        userId: ref.referrer.userId,
        username: ref.referrer.username,
        referrals: ref.stats.purchases,
        revenue: ref.stats.revenue,
        rewardEarned: ref.stats.rewardEarned,
      });
    });

    const topReferrers = Array.from(referrerStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      period: { start: startDate, end: endDate },
      overall,
      byPlatform,
      byContentType,
      topShared,
      topReferrers,
    };
  }

  /**
   * Get sharing statistics
   */
  async getSharingStats() {
    const shares = Array.from(this.shareLinks.values());
    const referrals = Array.from(this.referrals.values());

    const totalShares = shares.length;
    const totalClicks = shares.reduce((sum, s) => sum + s.clicks, 0);
    const totalConversions = shares.reduce((sum, s) => sum + s.conversions, 0);
    const totalRevenue = shares.reduce((sum, s) => sum + s.revenue, 0);

    const activeReferrals = referrals.filter((r) => r.isActive).length;
    const totalReferralRevenue = referrals.reduce((sum, r) => sum + r.stats.revenue, 0);
    const totalRewardsEarned = referrals.reduce((sum, r) => sum + r.stats.rewardEarned, 0);

    return {
      totalShares,
      totalClicks,
      totalConversions,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      activeReferrals,
      totalReferralRevenue: Number(totalReferralRevenue.toFixed(2)),
      totalRewardsEarned: Number(totalRewardsEarned.toFixed(2)),
    };
  }
}

// Export singleton instance
export const socialSharingService = new SocialSharingService();
