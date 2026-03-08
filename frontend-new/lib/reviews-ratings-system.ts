/**
 * Reviews & Ratings System
 *
 * Comprehensive review and rating management:
 * - Product reviews
 * - Artisan reviews
 * - Workshop reviews
 * - Multi-criteria ratings
 * - Verified purchases
 * - Helpful votes
 * - Review moderation
 * - Analytics and insights
 */

export interface Review {
  id: string;
  type: 'product' | 'artisan' | 'workshop';
  targetId: string; // Product ID, Artisan ID, or Workshop ID

  // Author
  author: {
    id: string;
    name: string;
    avatar?: string;
    isVerifiedPurchaser: boolean;
  };

  // Rating (1-5 stars)
  rating: number;

  // Multi-criteria ratings (optional)
  criteriaRatings?: {
    quality?: number;
    value?: number;
    shipping?: number;
    communication?: number;
    accuracy?: number;
    authenticity?: number;
  };

  // Content
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];

  // Media
  images?: {
    url: string;
    caption?: string;
  }[];
  videos?: {
    url: string;
    thumbnail?: string;
    duration: number;
  }[];

  // Engagement
  helpfulVotes: number;
  notHelpfulVotes: number;
  reportCount: number;

  // Verification
  isVerified: boolean;
  purchaseDate?: Date;
  orderId?: string;

  // Response
  artisanResponse?: {
    content: string;
    respondedAt: Date;
  };

  // Status
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'deleted';

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSummary {
  targetId: string;
  targetType: 'product' | 'artisan' | 'workshop';

  // Overall
  totalReviews: number;
  averageRating: number;

  // Distribution
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };

  // Criteria averages
  criteriaAverages?: {
    quality: number;
    value: number;
    shipping: number;
    communication: number;
    accuracy: number;
    authenticity: number;
  };

  // Verification
  verifiedReviewsCount: number;
  verifiedReviewsPercentage: number;

  // Recommendations
  recommendationPercentage: number;

  // Recent activity
  recentReviews: Review[];
  topReviews: Review[];
}

export interface ReviewQuestion {
  id: string;
  targetId: string;
  targetType: 'product' | 'artisan' | 'workshop';

  // Author
  author: {
    id: string;
    name: string;
    avatar?: string;
  };

  // Content
  question: string;

  // Answer
  answer?: {
    content: string;
    answeredBy: {
      id: string;
      name: string;
      role: 'artisan' | 'seller' | 'community' | 'staff';
    };
    answeredAt: Date;
  };

  // Engagement
  helpfulVotes: number;

  // Status
  status: 'pending' | 'answered' | 'closed';

  createdAt: Date;
}

export interface ReviewInsight {
  targetId: string;
  targetType: string;
  period: {
    start: Date;
    end: Date;
  };

  // Sentiment Analysis
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    overall: 'positive' | 'neutral' | 'negative';
  };

  // Common Themes
  positiveThemes: {
    theme: string;
    count: number;
    percentage: number;
  }[];

  negativeThemes: {
    theme: string;
    count: number;
    percentage: number;
  }[];

  // Keywords
  topKeywords: {
    word: string;
    count: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];

  // Trends
  ratingTrend: {
    date: Date;
    averageRating: number;
    reviewCount: number;
  }[];
}

export class ReviewsRatingsSystem {
  private reviews: Map<string, Review>;
  private questions: Map<string, ReviewQuestion>;
  private summaries: Map<string, ReviewSummary>;

  constructor() {
    this.reviews = new Map();
    this.questions = new Map();
    this.summaries = new Map();
  }

  /**
   * Create a review
   */
  async createReview(params: {
    type: Review['type'];
    targetId: string;
    author: Review['author'];
    rating: number;
    criteriaRatings?: Review['criteriaRatings'];
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    images?: Review['images'];
    videos?: Review['videos'];
    orderId?: string;
  }): Promise<Review> {
    // Validate rating
    if (params.rating < 1 || params.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user has purchased (for product reviews)
    const isVerified = params.orderId !== undefined;

    const review: Review = {
      id: `review-${Date.now()}`,
      type: params.type,
      targetId: params.targetId,
      author: params.author,
      rating: params.rating,
      criteriaRatings: params.criteriaRatings,
      title: params.title,
      content: params.content,
      pros: params.pros,
      cons: params.cons,
      images: params.images,
      videos: params.videos,
      helpfulVotes: 0,
      notHelpfulVotes: 0,
      reportCount: 0,
      isVerified,
      purchaseDate: isVerified ? new Date() : undefined,
      orderId: params.orderId,
      status: 'approved', // Auto-approve, or 'pending' for moderation
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reviews.set(review.id, review);

    // Update summary
    await this.updateReviewSummary(params.targetId, params.type);

    return review;
  }

  /**
   * Get reviews for target
   */
  async getReviews(
    targetId: string,
    targetType: Review['type'],
    options?: {
      sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
      filterRating?: number;
      verifiedOnly?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<Review[]> {
    let reviews = Array.from(this.reviews.values()).filter(
      (r) => r.targetId === targetId && r.type === targetType && r.status === 'approved'
    );

    // Apply filters
    if (options?.filterRating) {
      reviews = reviews.filter((r) => r.rating === options.filterRating);
    }

    if (options?.verifiedOnly) {
      reviews = reviews.filter((r) => r.isVerified);
    }

    // Sort
    switch (options?.sortBy) {
      case 'helpful':
        reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
        break;
      case 'rating_high':
        reviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_low':
        reviews.sort((a, b) => a.rating - b.rating);
        break;
      default: // 'recent'
        reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // Pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 10;

    return reviews.slice(offset, offset + limit);
  }

  /**
   * Get review summary
   */
  async getReviewSummary(targetId: string, targetType: Review['type']): Promise<ReviewSummary> {
    const key = `${targetType}-${targetId}`;
    let summary = this.summaries.get(key);

    if (!summary) {
      summary = await this.updateReviewSummary(targetId, targetType);
    }

    return summary;
  }

  /**
   * Update review summary
   */
  private async updateReviewSummary(
    targetId: string,
    targetType: Review['type']
  ): Promise<ReviewSummary> {
    const reviews = Array.from(this.reviews.values()).filter(
      (r) => r.targetId === targetId && r.type === targetType && r.status === 'approved'
    );

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    const verifiedReviewsCount = reviews.filter((r) => r.isVerified).length;
    const verifiedReviewsPercentage =
      totalReviews > 0 ? (verifiedReviewsCount / totalReviews) * 100 : 0;

    // Calculate criteria averages
    let criteriaAverages: ReviewSummary['criteriaAverages'];
    const reviewsWithCriteria = reviews.filter((r) => r.criteriaRatings);

    if (reviewsWithCriteria.length > 0) {
      const criteriaKeys = [
        'quality',
        'value',
        'shipping',
        'communication',
        'accuracy',
        'authenticity',
      ] as const;
      criteriaAverages = {} as any;

      criteriaKeys.forEach((key) => {
        const values = reviewsWithCriteria
          .map((r) => r.criteriaRatings?.[key])
          .filter((v) => v !== undefined) as number[];

        if (values.length > 0) {
          criteriaAverages![key] = values.reduce((sum, v) => sum + v, 0) / values.length;
        }
      });
    }

    // Get recent and top reviews
    const recentReviews = reviews
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    const topReviews = reviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes).slice(0, 5);

    const summary: ReviewSummary = {
      targetId,
      targetType,
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution,
      criteriaAverages,
      verifiedReviewsCount,
      verifiedReviewsPercentage: Number(verifiedReviewsPercentage.toFixed(1)),
      recommendationPercentage:
        totalReviews > 0
          ? Number(((reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100).toFixed(1))
          : 0,
      recentReviews,
      topReviews,
    };

    const key = `${targetType}-${targetId}`;
    this.summaries.set(key, summary);

    return summary;
  }

  /**
   * Vote review as helpful
   */
  async voteHelpful(reviewId: string, isHelpful: boolean): Promise<void> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (isHelpful) {
      review.helpfulVotes++;
    } else {
      review.notHelpfulVotes++;
    }
  }

  /**
   * Add artisan response to review
   */
  async addArtisanResponse(reviewId: string, response: string): Promise<void> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    review.artisanResponse = {
      content: response,
      respondedAt: new Date(),
    };

    review.updatedAt = new Date();
  }

  /**
   * Report review
   */
  async reportReview(reviewId: string, reason: string): Promise<void> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    review.reportCount++;

    // Auto-flag if reports exceed threshold
    if (review.reportCount >= 3) {
      review.status = 'flagged';
    }
  }

  /**
   * Create question
   */
  async createQuestion(params: {
    targetId: string;
    targetType: ReviewQuestion['targetType'];
    author: ReviewQuestion['author'];
    question: string;
  }): Promise<ReviewQuestion> {
    const question: ReviewQuestion = {
      id: `question-${Date.now()}`,
      targetId: params.targetId,
      targetType: params.targetType,
      author: params.author,
      question: params.question,
      helpfulVotes: 0,
      status: 'pending',
      createdAt: new Date(),
    };

    this.questions.set(question.id, question);
    return question;
  }

  /**
   * Answer question
   */
  async answerQuestion(
    questionId: string,
    answer: string,
    answeredBy: ReviewQuestion['answer']['answeredBy']
  ): Promise<void> {
    const question = this.questions.get(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    question.answer = {
      content: answer,
      answeredBy,
      answeredAt: new Date(),
    };

    question.status = 'answered';
  }

  /**
   * Get questions for target
   */
  async getQuestions(
    targetId: string,
    targetType: ReviewQuestion['targetType']
  ): Promise<ReviewQuestion[]> {
    return Array.from(this.questions.values())
      .filter((q) => q.targetId === targetId && q.targetType === targetType)
      .sort((a, b) => {
        // Answered questions first, then by helpful votes
        if (a.status === 'answered' && b.status !== 'answered') return -1;
        if (a.status !== 'answered' && b.status === 'answered') return 1;
        return b.helpfulVotes - a.helpfulVotes;
      });
  }

  /**
   * Generate review insights
   */
  async generateInsights(
    targetId: string,
    targetType: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReviewInsight> {
    const reviews = Array.from(this.reviews.values()).filter(
      (r) =>
        r.targetId === targetId &&
        r.type === (targetType as Review['type']) &&
        r.status === 'approved' &&
        r.createdAt >= startDate &&
        r.createdAt <= endDate
    );

    // Simple sentiment analysis based on rating
    const positive = reviews.filter((r) => r.rating >= 4).length;
    const neutral = reviews.filter((r) => r.rating === 3).length;
    const negative = reviews.filter((r) => r.rating <= 2).length;

    const totalSentiment = positive + neutral + negative;
    const sentiment = {
      positive: totalSentiment > 0 ? (positive / totalSentiment) * 100 : 0,
      neutral: totalSentiment > 0 ? (neutral / totalSentiment) * 100 : 0,
      negative: totalSentiment > 0 ? (negative / totalSentiment) * 100 : 0,
      overall: (positive > negative
        ? 'positive'
        : negative > positive
          ? 'negative'
          : 'neutral') as const,
    };

    // Extract common themes from pros/cons
    const positiveThemes = this.extractThemes(reviews.flatMap((r) => r.pros || []));
    const negativeThemes = this.extractThemes(reviews.flatMap((r) => r.cons || []));

    // Extract keywords
    const allText = reviews.map((r) => `${r.title} ${r.content}`).join(' ');
    const topKeywords = this.extractKeywords(allText);

    // Calculate rating trend
    const ratingTrend = this.calculateRatingTrend(reviews, startDate, endDate);

    return {
      targetId,
      targetType,
      period: { start: startDate, end: endDate },
      sentiment,
      positiveThemes,
      negativeThemes,
      topKeywords,
      ratingTrend,
    };
  }

  /**
   * Extract common themes from text array
   */
  private extractThemes(texts: string[]): ReviewInsight['positiveThemes'] {
    const themes = new Map<string, number>();

    texts.forEach((text) => {
      const normalized = text.toLowerCase().trim();
      themes.set(normalized, (themes.get(normalized) || 0) + 1);
    });

    const total = texts.length;
    return Array.from(themes.entries())
      .map(([theme, count]) => ({
        theme,
        count,
        percentage: Number(((count / total) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): ReviewInsight['topKeywords'] {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3); // Filter short words

    const wordCounts = new Map<string, number>();
    words.forEach((word) => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });

    return Array.from(wordCounts.entries())
      .map(([word, count]) => ({
        word,
        count,
        sentiment: 'neutral' as const, // Would use NLP for actual sentiment
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  /**
   * Calculate rating trend over time
   */
  private calculateRatingTrend(
    reviews: Review[],
    startDate: Date,
    endDate: Date
  ): ReviewInsight['ratingTrend'] {
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / dayMs);

    const trend: ReviewInsight['ratingTrend'] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * dayMs);
      const nextDate = new Date(date.getTime() + dayMs);

      const dayReviews = reviews.filter((r) => r.createdAt >= date && r.createdAt < nextDate);

      if (dayReviews.length > 0) {
        const averageRating = dayReviews.reduce((sum, r) => sum + r.rating, 0) / dayReviews.length;

        trend.push({
          date,
          averageRating: Number(averageRating.toFixed(1)),
          reviewCount: dayReviews.length,
        });
      }
    }

    return trend;
  }

  /**
   * Get review statistics
   */
  async getReviewStats() {
    const reviews = Array.from(this.reviews.values());
    const questions = Array.from(this.questions.values());

    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter((r) => r.status === 'approved').length;
    const verifiedReviews = reviews.filter((r) => r.isVerified).length;
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter((q) => q.status === 'answered').length;

    const averageRating =
      totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

    const reviewsByType = reviews.reduce(
      (acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalReviews,
      approvedReviews,
      verifiedReviews,
      verifiedPercentage: totalReviews > 0 ? (verifiedReviews / totalReviews) * 100 : 0,
      totalQuestions,
      answeredQuestions,
      answerRate: totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0,
      averageRating: Number(averageRating.toFixed(2)),
      reviewsByType,
    };
  }
}

// Export singleton instance
export const reviewsRatingsSystem = new ReviewsRatingsSystem();
