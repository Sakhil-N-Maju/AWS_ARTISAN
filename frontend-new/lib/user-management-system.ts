/**
 * User Management System
 *
 * Comprehensive user management for customers and artisans:
 * - User account management
 * - Role and permission management
 * - Account verification and approval
 * - User groups and segments
 * - Account suspension and moderation
 * - Bulk user operations
 * - User import/export
 * - Communication preferences
 */

export interface User {
  id: string;
  type: 'customer' | 'artisan' | 'vendor' | 'affiliate';

  // Personal information
  personalInfo: {
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    avatar?: string;
  };

  // Account status
  status: 'active' | 'inactive' | 'suspended' | 'banned' | 'pending_verification' | 'deleted';

  // Verification
  verification: {
    emailVerified: boolean;
    emailVerifiedAt?: Date;
    phoneVerified: boolean;
    phoneVerifiedAt?: Date;
    identityVerified: boolean;
    identityVerifiedAt?: Date;
    businessVerified?: boolean;
    businessVerifiedAt?: Date;
  };

  // Authentication
  authentication: {
    passwordLastChanged?: Date;
    passwordResetRequired: boolean;
    twoFactorEnabled: boolean;
    twoFactorMethod?: 'totp' | 'sms' | 'email';
    lastLogin?: Date;
    loginCount: number;
    failedLoginAttempts: number;
    lockedUntil?: Date;
  };

  // Roles and permissions
  roles: string[];
  customPermissions?: {
    resource: string;
    actions: string[];
  }[];

  // Address
  addresses?: {
    id: string;
    type: 'billing' | 'shipping' | 'both';
    isDefault: boolean;
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone?: string;
  }[];

  // Preferences
  preferences: {
    language: string;
    currency: string;
    timezone: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    newsletterSubscribed: boolean;
  };

  // Artisan-specific fields
  artisanProfile?: {
    businessName: string;
    bio: string;
    specialization: string[];
    experience: number; // years
    certifications?: string[];
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      website?: string;
    };
    portfolio?: {
      id: string;
      title: string;
      description: string;
      images: string[];
      featured: boolean;
    }[];
    commission: number; // percentage
    payoutMethod?: 'bank_transfer' | 'paypal' | 'stripe';
    taxInfo?: {
      taxId?: string;
      gstNumber?: string;
      panNumber?: string;
    };
  };

  // Metadata
  metadata?: Record<string, any>;
  tags: string[];
  notes?: {
    id: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    private: boolean;
  }[];

  // Lifecycle
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  type: 'static' | 'dynamic';

  // Membership
  userIds?: string[]; // for static groups
  criteria?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    value: any;
  }[]; // for dynamic groups

  // Permissions
  permissions?: {
    resource: string;
    actions: string[];
  }[];

  // Communication
  allowBulkEmail: boolean;
  allowBulkSMS: boolean;

  // Metadata
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;

  // Permissions
  permissions: {
    resource: string;
    resourceName: string;
    actions: {
      action: string;
      allowed: boolean;
      conditions?: Record<string, any>;
    }[];
  }[];

  // Hierarchy
  priority: number; // lower number = higher priority
  inheritsFrom?: string[]; // inherit from other roles

  // Assignment
  assignableBy: string[]; // which roles can assign this role
  assignableTo: ('customer' | 'artisan' | 'vendor' | 'affiliate')[];

  // Metadata
  isSystem: boolean;
  isDefault: boolean;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserVerification {
  id: string;
  userId: string;
  type: 'email' | 'phone' | 'identity' | 'business' | 'artisan';

  // Request
  requestedAt: Date;
  requestedBy?: string;

  // Documents
  documents?: {
    id: string;
    type: 'id_proof' | 'address_proof' | 'business_registration' | 'tax_certificate' | 'portfolio';
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];

  // Status
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'expired';

  // Review
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;

  // Rejection
  rejectionReason?: string;
  rejectionDetails?: string;

  // Expiry
  expiresAt?: Date;

  // Resubmission
  resubmittedFrom?: string; // previous verification ID
  resubmissionCount: number;
}

export interface UserAction {
  id: string;
  userId: string;
  actionType:
    | 'suspend'
    | 'unsuspend'
    | 'ban'
    | 'unban'
    | 'verify'
    | 'warn'
    | 'note_added'
    | 'role_changed'
    | 'group_added'
    | 'group_removed';

  // Details
  reason: string;
  details?: string;
  duration?: number; // for suspensions in days

  // Execution
  performedBy: string;
  performedAt: Date;

  // Notification
  notifyUser: boolean;
  notificationSent: boolean;

  // Expiry
  expiresAt?: Date;
  expired: boolean;

  // Reversal
  reversedAt?: Date;
  reversedBy?: string;
  reversalReason?: string;
}

export interface BulkUserOperation {
  id: string;
  operationType:
    | 'import'
    | 'export'
    | 'update'
    | 'delete'
    | 'suspend'
    | 'activate'
    | 'send_email'
    | 'assign_role'
    | 'add_to_group';

  // Target
  targetUserIds?: string[];
  targetGroupId?: string;
  targetCriteria?: {
    field: string;
    operator: string;
    value: any;
  }[];

  // Operation data
  data?: Record<string, any>;

  // File operations
  fileUrl?: string;
  fileName?: string;

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

  // Progress
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;

  // Results
  errors?: {
    recordId: string;
    error: string;
  }[];
  resultFileUrl?: string;

  // Execution
  startedAt?: Date;
  completedAt?: Date;
  performedBy: string;
  createdAt: Date;
}

export interface UserSegment {
  id: string;
  name: string;
  description: string;

  // Criteria
  criteria: {
    type: 'demographic' | 'behavioral' | 'transactional' | 'engagement';
    conditions: {
      field: string;
      operator: string;
      value: any;
    }[];
  }[];

  // Analytics
  analytics: {
    totalUsers: number;
    activeUsers: number;
    avgLifetimeValue: number;
    avgOrderValue: number;
    avgEngagementScore: number;
    topProducts: string[];
    topCategories: string[];
  };

  // Auto-update
  autoUpdate: boolean;
  lastUpdated?: Date;

  // Metadata
  createdAt: Date;
  createdBy: string;
}

export interface CommunicationPreference {
  userId: string;

  // Channels
  channels: {
    email: {
      enabled: boolean;
      address: string;
      verified: boolean;
      frequency?: 'immediate' | 'daily_digest' | 'weekly_digest';
    };
    sms: {
      enabled: boolean;
      number?: string;
      verified: boolean;
    };
    push: {
      enabled: boolean;
      tokens: string[];
    };
    whatsapp: {
      enabled: boolean;
      number?: string;
      optedIn: boolean;
    };
  };

  // Categories
  categories: {
    transactional: boolean; // order confirmations, shipping updates
    marketing: boolean; // promotions, new products
    newsletter: boolean; // weekly/monthly newsletters
    recommendations: boolean; // personalized recommendations
    reviews: boolean; // review requests
    social: boolean; // comments, likes, follows
    system: boolean; // account updates, security alerts
  };

  // Preferences
  unsubscribeAll: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string; // HH:mm
    endTime?: string; // HH:mm
  };

  updatedAt: Date;
}

export interface UserStatistics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };

  // Account stats
  account: {
    status: User['status'];
    accountAge: number; // days
    lastLogin?: Date;
    loginFrequency: number;
    sessionDuration: number; // minutes average
  };

  // Activity stats
  activity: {
    pageViews: number;
    productsViewed: number;
    searches: number;
    wishlistAdds: number;
    cartAdds: number;
    engagementScore: number;
  };

  // Transaction stats
  transactions: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    lifetimeValue: number;
    returnRate: number;
    cancelationRate: number;
  };

  // Communication stats
  communication: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    smsSent: number;
    pushSent: number;
  };

  // Artisan-specific stats
  artisan?: {
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    commission: number;
    avgRating: number;
    totalReviews: number;
    responseRate: number;
    responseTime: number; // minutes
  };
}

export class UserManagementSystem {
  private users: Map<string, User>;
  private groups: Map<string, UserGroup>;
  private roles: Map<string, UserRole>;
  private verifications: Map<string, UserVerification>;
  private actions: Map<string, UserAction>;
  private bulkOperations: Map<string, BulkUserOperation>;
  private segments: Map<string, UserSegment>;
  private communicationPreferences: Map<string, CommunicationPreference>;

  constructor() {
    this.users = new Map();
    this.groups = new Map();
    this.roles = new Map();
    this.verifications = new Map();
    this.actions = new Map();
    this.bulkOperations = new Map();
    this.segments = new Map();
    this.communicationPreferences = new Map();

    // Initialize default roles and groups
    this.initializeDefaults();
  }

  /**
   * Initialize default roles and groups
   */
  private initializeDefaults(): void {
    // Default roles
    const defaultRoles: Omit<UserRole, 'id' | 'userCount' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Customer',
        description: 'Standard customer account',
        permissions: [
          {
            resource: 'profile',
            resourceName: 'User Profile',
            actions: [
              { action: 'view', allowed: true },
              { action: 'edit', allowed: true, conditions: { own: true } },
            ],
          },
          {
            resource: 'orders',
            resourceName: 'Orders',
            actions: [
              { action: 'view', allowed: true, conditions: { own: true } },
              { action: 'create', allowed: true },
              { action: 'cancel', allowed: true, conditions: { status: 'pending' } },
            ],
          },
          {
            resource: 'reviews',
            resourceName: 'Reviews',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'edit', allowed: true, conditions: { own: true } },
            ],
          },
        ],
        priority: 100,
        assignableBy: ['admin', 'super_admin'],
        assignableTo: ['customer'],
        isSystem: true,
        isDefault: true,
      },
      {
        name: 'Artisan',
        description: 'Verified artisan seller account',
        permissions: [
          {
            resource: 'profile',
            resourceName: 'User Profile',
            actions: [
              { action: 'view', allowed: true },
              { action: 'edit', allowed: true, conditions: { own: true } },
            ],
          },
          {
            resource: 'products',
            resourceName: 'Products',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'edit', allowed: true, conditions: { own: true } },
              { action: 'delete', allowed: true, conditions: { own: true } },
            ],
          },
          {
            resource: 'orders',
            resourceName: 'Orders',
            actions: [
              { action: 'view', allowed: true, conditions: { seller: true } },
              { action: 'update_status', allowed: true, conditions: { seller: true } },
            ],
          },
          {
            resource: 'analytics',
            resourceName: 'Analytics',
            actions: [{ action: 'view', allowed: true, conditions: { own: true } }],
          },
        ],
        priority: 80,
        assignableBy: ['admin', 'super_admin'],
        assignableTo: ['artisan'],
        isSystem: true,
        isDefault: true,
      },
      {
        name: 'VIP Customer',
        description: 'Premium customer with additional privileges',
        permissions: [
          {
            resource: 'profile',
            resourceName: 'User Profile',
            actions: [
              { action: 'view', allowed: true },
              { action: 'edit', allowed: true },
            ],
          },
          {
            resource: 'orders',
            resourceName: 'Orders',
            actions: [
              { action: 'view', allowed: true },
              { action: 'create', allowed: true },
              { action: 'priority_shipping', allowed: true },
            ],
          },
          {
            resource: 'discounts',
            resourceName: 'Discounts',
            actions: [{ action: 'access_vip_deals', allowed: true }],
          },
        ],
        priority: 90,
        inheritsFrom: ['Customer'],
        assignableBy: ['admin', 'super_admin', 'manager'],
        assignableTo: ['customer'],
        isSystem: false,
        isDefault: false,
      },
    ];

    defaultRoles.forEach((role, index) => {
      const id = `role-${Date.now()}-${index}`;
      this.roles.set(id, {
        ...role,
        id,
        userCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Default user segments
    const defaultSegments: Omit<UserSegment, 'id' | 'createdAt'>[] = [
      {
        name: 'High-Value Customers',
        description: 'Customers with LTV > ₹50,000',
        criteria: [
          {
            type: 'transactional',
            conditions: [{ field: 'lifetimeValue', operator: 'greater_than', value: 50000 }],
          },
        ],
        analytics: {
          totalUsers: 1523,
          activeUsers: 1289,
          avgLifetimeValue: 85600,
          avgOrderValue: 2840,
          avgEngagementScore: 87.5,
          topProducts: ['Handwoven Silk Saree', 'Silver Jewelry Collection'],
          topCategories: ['Textiles', 'Jewelry'],
        },
        autoUpdate: true,
        createdBy: 'system',
      },
      {
        name: 'At-Risk Customers',
        description: "Active customers who haven't purchased in 90+ days",
        criteria: [
          {
            type: 'behavioral',
            conditions: [
              { field: 'lastPurchaseDate', operator: 'less_than', value: 90 },
              { field: 'totalOrders', operator: 'greater_than', value: 1 },
            ],
          },
        ],
        analytics: {
          totalUsers: 2284,
          activeUsers: 1456,
          avgLifetimeValue: 12500,
          avgOrderValue: 1850,
          avgEngagementScore: 42.3,
          topProducts: ['Terracotta Vase Set', 'Handmade Pottery'],
          topCategories: ['Home Decor', 'Pottery'],
        },
        autoUpdate: true,
        createdBy: 'system',
      },
      {
        name: 'New Customers',
        description: 'Customers who joined in the last 30 days',
        criteria: [
          {
            type: 'demographic',
            conditions: [{ field: 'createdAt', operator: 'greater_than', value: 30 }],
          },
        ],
        analytics: {
          totalUsers: 3458,
          activeUsers: 2891,
          avgLifetimeValue: 1250,
          avgOrderValue: 1250,
          avgEngagementScore: 68.2,
          topProducts: ['Welcome Bundle', 'Starter Collection'],
          topCategories: ['Bundles', 'Starter Kits'],
        },
        autoUpdate: true,
        createdBy: 'system',
      },
    ];

    defaultSegments.forEach((segment, index) => {
      const id = `segment-${Date.now()}-${index}`;
      this.segments.set(id, {
        ...segment,
        id,
        createdAt: new Date(),
      });
    });
  }

  /**
   * Create a new user
   */
  async createUser(params: {
    type: User['type'];
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    password?: string;
    roles?: string[];
    metadata?: Record<string, any>;
    createdBy?: string;
  }): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      type: params.type,
      personalInfo: {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        phone: params.phone,
      },
      status: 'pending_verification',
      verification: {
        emailVerified: false,
        phoneVerified: false,
        identityVerified: false,
      },
      authentication: {
        passwordResetRequired: false,
        twoFactorEnabled: false,
        loginCount: 0,
        failedLoginAttempts: 0,
      },
      roles: params.roles || [],
      preferences: {
        language: 'en',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        marketingEmails: true,
        newsletterSubscribed: false,
      },
      metadata: params.metadata,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: params.createdBy,
    };

    this.users.set(user.id, user);

    // Initialize communication preferences
    const commPrefs: CommunicationPreference = {
      userId: user.id,
      channels: {
        email: {
          enabled: true,
          address: params.email,
          verified: false,
        },
        sms: {
          enabled: true,
          number: params.phone,
          verified: false,
        },
        push: {
          enabled: true,
          tokens: [],
        },
        whatsapp: {
          enabled: false,
          optedIn: false,
        },
      },
      categories: {
        transactional: true,
        marketing: true,
        newsletter: false,
        recommendations: true,
        reviews: true,
        social: true,
        system: true,
      },
      unsubscribeAll: false,
      doNotDisturb: {
        enabled: false,
      },
      updatedAt: new Date(),
    };

    this.communicationPreferences.set(user.id, commPrefs);

    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  /**
   * Search users
   */
  async searchUsers(params: {
    query?: string;
    type?: User['type'];
    status?: User['status'];
    roles?: string[];
    tags?: string[];
    createdAfter?: Date;
    createdBefore?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    let users = Array.from(this.users.values());

    // Apply filters
    if (params.type) {
      users = users.filter((u) => u.type === params.type);
    }

    if (params.status) {
      users = users.filter((u) => u.status === params.status);
    }

    if (params.roles && params.roles.length > 0) {
      users = users.filter((u) => params.roles!.some((r) => u.roles.includes(r)));
    }

    if (params.tags && params.tags.length > 0) {
      users = users.filter((u) => params.tags!.some((t) => u.tags.includes(t)));
    }

    if (params.createdAfter) {
      users = users.filter((u) => u.createdAt >= params.createdAfter!);
    }

    if (params.createdBefore) {
      users = users.filter((u) => u.createdAt <= params.createdBefore!);
    }

    if (params.query) {
      const query = params.query.toLowerCase();
      users = users.filter(
        (u) =>
          u.personalInfo.firstName.toLowerCase().includes(query) ||
          u.personalInfo.lastName.toLowerCase().includes(query) ||
          u.personalInfo.email.toLowerCase().includes(query) ||
          (u.personalInfo.phone && u.personalInfo.phone.includes(query)) ||
          (u.artisanProfile?.businessName &&
            u.artisanProfile.businessName.toLowerCase().includes(query))
      );
    }

    const total = users.length;

    // Pagination
    const offset = params.offset || 0;
    const limit = params.limit || 50;
    users = users.slice(offset, offset + limit);

    return { users, total };
  }

  /**
   * Update user
   */
  async updateUser(params: {
    userId: string;
    updates: Partial<User>;
    modifiedBy?: string;
  }): Promise<User> {
    const user = this.users.get(params.userId);
    if (!user) throw new Error('User not found');

    Object.assign(user, params.updates, {
      updatedAt: new Date(),
      lastModifiedBy: params.modifiedBy,
    });

    return user;
  }

  /**
   * Suspend user account
   */
  async suspendUser(params: {
    userId: string;
    reason: string;
    duration?: number; // days
    notifyUser?: boolean;
    performedBy: string;
  }): Promise<void> {
    const user = this.users.get(params.userId);
    if (!user) return;

    user.status = 'suspended';
    user.updatedAt = new Date();

    // Create action record
    const action: UserAction = {
      id: `action-${Date.now()}`,
      userId: params.userId,
      actionType: 'suspend',
      reason: params.reason,
      duration: params.duration,
      performedBy: params.performedBy,
      performedAt: new Date(),
      notifyUser: params.notifyUser || false,
      notificationSent: false,
      expiresAt: params.duration
        ? new Date(Date.now() + params.duration * 24 * 60 * 60 * 1000)
        : undefined,
      expired: false,
    };

    this.actions.set(action.id, action);
  }

  /**
   * Ban user account permanently
   */
  async banUser(params: {
    userId: string;
    reason: string;
    details?: string;
    notifyUser?: boolean;
    performedBy: string;
  }): Promise<void> {
    const user = this.users.get(params.userId);
    if (!user) return;

    user.status = 'banned';
    user.updatedAt = new Date();

    const action: UserAction = {
      id: `action-${Date.now()}`,
      userId: params.userId,
      actionType: 'ban',
      reason: params.reason,
      details: params.details,
      performedBy: params.performedBy,
      performedAt: new Date(),
      notifyUser: params.notifyUser || false,
      notificationSent: false,
      expired: false,
    };

    this.actions.set(action.id, action);
  }

  /**
   * Activate user account
   */
  async activateUser(params: { userId: string; performedBy: string }): Promise<void> {
    const user = this.users.get(params.userId);
    if (!user) return;

    user.status = 'active';
    user.updatedAt = new Date();
  }

  /**
   * Create verification request
   */
  async createVerification(params: {
    userId: string;
    type: UserVerification['type'];
    documents?: UserVerification['documents'];
    requestedBy?: string;
  }): Promise<UserVerification> {
    const verification: UserVerification = {
      id: `verify-${Date.now()}`,
      userId: params.userId,
      type: params.type,
      requestedAt: new Date(),
      requestedBy: params.requestedBy,
      documents: params.documents,
      status: 'pending',
      resubmissionCount: 0,
    };

    this.verifications.set(verification.id, verification);
    return verification;
  }

  /**
   * Approve verification
   */
  async approveVerification(params: {
    verificationId: string;
    reviewedBy: string;
    notes?: string;
  }): Promise<void> {
    const verification = this.verifications.get(params.verificationId);
    if (!verification) return;

    verification.status = 'approved';
    verification.reviewedAt = new Date();
    verification.reviewedBy = params.reviewedBy;
    verification.reviewNotes = params.notes;

    // Update user verification status
    const user = this.users.get(verification.userId);
    if (user) {
      switch (verification.type) {
        case 'email':
          user.verification.emailVerified = true;
          user.verification.emailVerifiedAt = new Date();
          break;
        case 'phone':
          user.verification.phoneVerified = true;
          user.verification.phoneVerifiedAt = new Date();
          break;
        case 'identity':
          user.verification.identityVerified = true;
          user.verification.identityVerifiedAt = new Date();
          break;
        case 'business':
          user.verification.businessVerified = true;
          user.verification.businessVerifiedAt = new Date();
          break;
      }
      user.updatedAt = new Date();
    }
  }

  /**
   * Reject verification
   */
  async rejectVerification(params: {
    verificationId: string;
    reason: string;
    details?: string;
    reviewedBy: string;
  }): Promise<void> {
    const verification = this.verifications.get(params.verificationId);
    if (!verification) return;

    verification.status = 'rejected';
    verification.reviewedAt = new Date();
    verification.reviewedBy = params.reviewedBy;
    verification.rejectionReason = params.reason;
    verification.rejectionDetails = params.details;
  }

  /**
   * Assign role to user
   */
  async assignRole(params: { userId: string; roleId: string; assignedBy: string }): Promise<void> {
    const user = this.users.get(params.userId);
    const role = this.roles.get(params.roleId);

    if (!user || !role) return;

    if (!user.roles.includes(params.roleId)) {
      user.roles.push(params.roleId);
      user.updatedAt = new Date();
      role.userCount++;
    }

    // Log action
    const action: UserAction = {
      id: `action-${Date.now()}`,
      userId: params.userId,
      actionType: 'role_changed',
      reason: `Assigned role: ${role.name}`,
      performedBy: params.assignedBy,
      performedAt: new Date(),
      notifyUser: false,
      notificationSent: false,
      expired: false,
    };

    this.actions.set(action.id, action);
  }

  /**
   * Create user group
   */
  async createGroup(params: {
    name: string;
    description: string;
    type: UserGroup['type'];
    userIds?: string[];
    criteria?: UserGroup['criteria'];
    createdBy: string;
  }): Promise<UserGroup> {
    const group: UserGroup = {
      id: `group-${Date.now()}`,
      name: params.name,
      description: params.description,
      type: params.type,
      userIds: params.userIds,
      criteria: params.criteria,
      allowBulkEmail: true,
      allowBulkSMS: false,
      memberCount: params.userIds?.length || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: params.createdBy,
    };

    this.groups.set(group.id, group);
    return group;
  }

  /**
   * Create bulk operation
   */
  async createBulkOperation(params: {
    operationType: BulkUserOperation['operationType'];
    targetUserIds?: string[];
    targetGroupId?: string;
    data?: Record<string, any>;
    fileUrl?: string;
    fileName?: string;
    performedBy: string;
  }): Promise<BulkUserOperation> {
    const operation: BulkUserOperation = {
      id: `bulk-${Date.now()}`,
      operationType: params.operationType,
      targetUserIds: params.targetUserIds,
      targetGroupId: params.targetGroupId,
      data: params.data,
      fileUrl: params.fileUrl,
      fileName: params.fileName,
      status: 'pending',
      totalRecords: params.targetUserIds?.length || 0,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      performedBy: params.performedBy,
      createdAt: new Date(),
    };

    this.bulkOperations.set(operation.id, operation);
    return operation;
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(params: {
    userId: string;
    period: { start: Date; end: Date };
  }): Promise<UserStatistics> {
    const user = this.users.get(params.userId);
    if (!user) throw new Error('User not found');

    const accountAge = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    const stats: UserStatistics = {
      userId: params.userId,
      period: params.period,
      account: {
        status: user.status,
        accountAge,
        lastLogin: user.authentication.lastLogin,
        loginFrequency: user.authentication.loginCount / Math.max(accountAge, 1),
        sessionDuration: 25.5,
      },
      activity: {
        pageViews: 1250,
        productsViewed: 385,
        searches: 142,
        wishlistAdds: 28,
        cartAdds: 45,
        engagementScore: 72.5,
      },
      transactions: {
        totalOrders: 12,
        totalRevenue: 24580,
        averageOrderValue: 2048.33,
        lifetimeValue: 24580,
        returnRate: 8.33,
        cancelationRate: 4.17,
      },
      communication: {
        emailsSent: 48,
        emailsOpened: 32,
        emailsClicked: 18,
        smsSent: 12,
        pushSent: 85,
      },
    };

    if (user.type === 'artisan' && user.artisanProfile) {
      stats.artisan = {
        totalProducts: 24,
        totalSales: 156,
        totalRevenue: 389500,
        commission: 38950,
        avgRating: 4.7,
        totalReviews: 89,
        responseRate: 94.5,
        responseTime: 180,
      };
    }

    return stats;
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<UserRole[]> {
    return Array.from(this.roles.values());
  }

  /**
   * Get all segments
   */
  async getAllSegments(): Promise<UserSegment[]> {
    return Array.from(this.segments.values());
  }

  /**
   * Get user actions
   */
  async getUserActions(userId: string, limit: number = 50): Promise<UserAction[]> {
    const actions = Array.from(this.actions.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())
      .slice(0, limit);

    return actions;
  }

  /**
   * Get communication preferences
   */
  async getCommunicationPreferences(userId: string): Promise<CommunicationPreference | null> {
    return this.communicationPreferences.get(userId) || null;
  }

  /**
   * Update communication preferences
   */
  async updateCommunicationPreferences(params: {
    userId: string;
    updates: Partial<CommunicationPreference>;
  }): Promise<void> {
    const prefs = this.communicationPreferences.get(params.userId);
    if (!prefs) return;

    Object.assign(prefs, params.updates, {
      updatedAt: new Date(),
    });
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(params: { userId: string; deletedBy: string; reason: string }): Promise<void> {
    const user = this.users.get(params.userId);
    if (!user) return;

    user.status = 'deleted';
    user.deletedAt = new Date();
    user.deletedBy = params.deletedBy;
    user.updatedAt = new Date();

    // Log action
    const action: UserAction = {
      id: `action-${Date.now()}`,
      userId: params.userId,
      actionType: 'note_added',
      reason: `Account deleted: ${params.reason}`,
      performedBy: params.deletedBy,
      performedAt: new Date(),
      notifyUser: false,
      notificationSent: false,
      expired: false,
    };

    this.actions.set(action.id, action);
  }
}

// Export singleton instance
export const userManagementSystem = new UserManagementSystem();
