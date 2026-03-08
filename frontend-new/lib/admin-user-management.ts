/**
 * Admin User Management System
 *
 * Comprehensive admin system for managing users:
 * - User account management
 * - Role and permission management
 * - User verification and KYC
 * - Account suspension and banning
 * - User activity monitoring
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support' | 'analyst';
  permissions: Permission[];
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
  active: boolean;
  twoFactorEnabled: boolean;
}

export interface Permission {
  id: string;
  name: string;
  category: 'users' | 'products' | 'orders' | 'content' | 'analytics' | 'system';
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  resource: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  phone?: string;
  type: 'customer' | 'artisan' | 'vendor';
  status: 'active' | 'suspended' | 'banned' | 'pending_verification';
  verificationLevel: 'unverified' | 'email_verified' | 'phone_verified' | 'kyc_verified';
  createdAt: Date;
  lastActive?: Date;
  totalOrders: number;
  totalSpent: number;
  suspensionHistory: {
    suspendedAt: Date;
    suspendedBy: string;
    reason: string;
    liftedAt?: Date;
  }[];
  notes: {
    addedBy: string;
    note: string;
    timestamp: Date;
  }[];
}

export interface KYCVerification {
  id: string;
  userId: string;
  documentType: 'aadhaar' | 'pan' | 'passport' | 'driving_license' | 'voter_id';
  documentNumber: string;
  documentImages: string[];
  selfieImage?: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_resubmission';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  verificationData?: {
    name: string;
    dateOfBirth?: Date;
    address?: string;
  };
}

export interface UserAction {
  id: string;
  userId: string;
  adminId: string;
  actionType:
    | 'suspend'
    | 'unsuspend'
    | 'ban'
    | 'unban'
    | 'verify'
    | 'reject_verification'
    | 'delete_content'
    | 'update_profile';
  reason: string;
  details?: any;
  timestamp: Date;
  reversible: boolean;
  reversedAt?: Date;
  reversedBy?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'login' | 'logout' | 'purchase' | 'review' | 'message' | 'profile_update';
  details: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  flagged: boolean;
  flagReason?: string;
}

export class AdminUserManagementSystem {
  private adminUsers: Map<string, AdminUser> = new Map();
  private permissions: Map<string, Permission> = new Map();
  private userAccounts: Map<string, UserAccount> = new Map();
  private kycVerifications: Map<string, KYCVerification> = new Map();
  private userActions: Map<string, UserAction> = new Map();
  private userActivities: Map<string, UserActivity> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  /**
   * Create admin user
   */
  async createAdminUser(data: {
    email: string;
    name: string;
    role: AdminUser['role'];
    department?: string;
  }): Promise<AdminUser> {
    const defaultPermissions = this.getDefaultPermissionsForRole(data.role);

    const admin: AdminUser = {
      id: `admin-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      email: data.email,
      name: data.name,
      role: data.role,
      permissions: defaultPermissions,
      department: data.department,
      createdAt: new Date(),
      active: true,
      twoFactorEnabled: false,
    };

    this.adminUsers.set(admin.id, admin);
    return admin;
  }

  /**
   * Update admin permissions
   */
  async updateAdminPermissions(adminId: string, permissions: Permission[]): Promise<AdminUser> {
    const admin = this.adminUsers.get(adminId);
    if (!admin) {
      throw new Error('Admin user not found');
    }

    admin.permissions = permissions;
    this.adminUsers.set(adminId, admin);
    return admin;
  }

  /**
   * Check admin permission
   */
  async hasPermission(
    adminId: string,
    category: Permission['category'],
    action: Permission['action'],
    resource: string
  ): Promise<boolean> {
    const admin = this.adminUsers.get(adminId);
    if (!admin || !admin.active) return false;

    // Super admin has all permissions
    if (admin.role === 'super_admin') return true;

    return admin.permissions.some(
      (p) => p.category === category && p.action === action && p.resource === resource
    );
  }

  /**
   * Get user account
   */
  async getUserAccount(userId: string): Promise<UserAccount | null> {
    return this.userAccounts.get(userId) || null;
  }

  /**
   * Search users
   */
  async searchUsers(query: {
    email?: string;
    name?: string;
    type?: UserAccount['type'];
    status?: UserAccount['status'];
    verificationLevel?: UserAccount['verificationLevel'];
    limit?: number;
  }): Promise<UserAccount[]> {
    let results = Array.from(this.userAccounts.values());

    if (query.email) {
      const emailLower = query.email.toLowerCase();
      results = results.filter((u) => u.email.toLowerCase().includes(emailLower));
    }

    if (query.name) {
      const nameLower = query.name.toLowerCase();
      results = results.filter((u) => u.name.toLowerCase().includes(nameLower));
    }

    if (query.type) {
      results = results.filter((u) => u.type === query.type);
    }

    if (query.status) {
      results = results.filter((u) => u.status === query.status);
    }

    if (query.verificationLevel) {
      results = results.filter((u) => u.verificationLevel === query.verificationLevel);
    }

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Suspend user
   */
  async suspendUser(data: {
    userId: string;
    adminId: string;
    reason: string;
    duration?: number; // in days
  }): Promise<UserAccount> {
    const user = this.userAccounts.get(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.status = 'suspended';
    user.suspensionHistory.push({
      suspendedAt: new Date(),
      suspendedBy: data.adminId,
      reason: data.reason,
    });

    this.userAccounts.set(data.userId, user);

    // Log action
    await this.logUserAction({
      userId: data.userId,
      adminId: data.adminId,
      actionType: 'suspend',
      reason: data.reason,
      reversible: true,
    });

    return user;
  }

  /**
   * Unsuspend user
   */
  async unsuspendUser(userId: string, adminId: string): Promise<UserAccount> {
    const user = this.userAccounts.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.status = 'active';

    // Update last suspension record
    if (user.suspensionHistory.length > 0) {
      const lastSuspension = user.suspensionHistory[user.suspensionHistory.length - 1];
      if (!lastSuspension.liftedAt) {
        lastSuspension.liftedAt = new Date();
      }
    }

    this.userAccounts.set(userId, user);

    // Log action
    await this.logUserAction({
      userId,
      adminId,
      actionType: 'unsuspend',
      reason: 'Suspension lifted',
      reversible: false,
    });

    return user;
  }

  /**
   * Ban user
   */
  async banUser(data: {
    userId: string;
    adminId: string;
    reason: string;
    permanent?: boolean;
  }): Promise<UserAccount> {
    const user = this.userAccounts.get(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.status = 'banned';

    this.userAccounts.set(data.userId, user);

    // Log action
    await this.logUserAction({
      userId: data.userId,
      adminId: data.adminId,
      actionType: 'ban',
      reason: data.reason,
      reversible: !data.permanent,
      details: { permanent: data.permanent },
    });

    return user;
  }

  /**
   * Add note to user account
   */
  async addUserNote(data: { userId: string; adminId: string; note: string }): Promise<void> {
    const user = this.userAccounts.get(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const admin = this.adminUsers.get(data.adminId);
    const addedBy = admin ? admin.name : data.adminId;

    user.notes.push({
      addedBy,
      note: data.note,
      timestamp: new Date(),
    });

    this.userAccounts.set(data.userId, user);
  }

  /**
   * Submit KYC verification
   */
  async submitKYC(data: {
    userId: string;
    documentType: KYCVerification['documentType'];
    documentNumber: string;
    documentImages: string[];
    selfieImage?: string;
  }): Promise<KYCVerification> {
    const kyc: KYCVerification = {
      id: `kyc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentImages: data.documentImages,
      selfieImage: data.selfieImage,
      status: 'pending',
      submittedAt: new Date(),
    };

    this.kycVerifications.set(kyc.id, kyc);
    return kyc;
  }

  /**
   * Review KYC verification
   */
  async reviewKYC(data: {
    kycId: string;
    adminId: string;
    approved: boolean;
    rejectionReason?: string;
    verificationData?: KYCVerification['verificationData'];
  }): Promise<KYCVerification> {
    const kyc = this.kycVerifications.get(data.kycId);
    if (!kyc) {
      throw new Error('KYC verification not found');
    }

    kyc.status = data.approved ? 'approved' : 'rejected';
    kyc.reviewedAt = new Date();
    kyc.reviewedBy = data.adminId;
    kyc.rejectionReason = data.rejectionReason;
    kyc.verificationData = data.verificationData;

    this.kycVerifications.set(data.kycId, kyc);

    // Update user verification level
    if (data.approved) {
      const user = this.userAccounts.get(kyc.userId);
      if (user) {
        user.verificationLevel = 'kyc_verified';
        user.status = 'active';
        this.userAccounts.set(kyc.userId, user);
      }

      await this.logUserAction({
        userId: kyc.userId,
        adminId: data.adminId,
        actionType: 'verify',
        reason: 'KYC verification approved',
        reversible: false,
      });
    } else {
      await this.logUserAction({
        userId: kyc.userId,
        adminId: data.adminId,
        actionType: 'reject_verification',
        reason: data.rejectionReason || 'KYC verification rejected',
        reversible: false,
      });
    }

    return kyc;
  }

  /**
   * Get pending KYC verifications
   */
  async getPendingKYC(limit: number = 50): Promise<KYCVerification[]> {
    return Array.from(this.kycVerifications.values())
      .filter((k) => k.status === 'pending')
      .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Track user activity
   */
  async trackActivity(data: {
    userId: string;
    activityType: UserActivity['activityType'];
    details: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<UserActivity> {
    const activity: UserActivity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      activityType: data.activityType,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      timestamp: new Date(),
      flagged: false,
    };

    this.userActivities.set(activity.id, activity);

    // Auto-flag suspicious activities
    await this.checkForSuspiciousActivity(activity);

    return activity;
  }

  /**
   * Get user activities
   */
  async getUserActivities(userId: string, limit: number = 100): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get flagged activities
   */
  async getFlaggedActivities(limit: number = 100): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter((a) => a.flagged)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get admin analytics
   */
  async getAnalytics(): Promise<{
    users: {
      total: number;
      byType: Record<string, number>;
      byStatus: Record<string, number>;
      byVerificationLevel: Record<string, number>;
    };
    kyc: {
      pending: number;
      approved: number;
      rejected: number;
      approvalRate: number;
    };
    actions: {
      suspensions: number;
      bans: number;
      verifications: number;
    };
    activity: {
      totalActivities: number;
      flaggedActivities: number;
      flagRate: number;
    };
  }> {
    const users = Array.from(this.userAccounts.values());
    const byType = users.reduce(
      (acc, u) => {
        acc[u.type] = (acc[u.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byStatus = users.reduce(
      (acc, u) => {
        acc[u.status] = (acc[u.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byVerificationLevel = users.reduce(
      (acc, u) => {
        acc[u.verificationLevel] = (acc[u.verificationLevel] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const kycList = Array.from(this.kycVerifications.values());
    const pendingKYC = kycList.filter((k) => k.status === 'pending').length;
    const approvedKYC = kycList.filter((k) => k.status === 'approved').length;
    const rejectedKYC = kycList.filter((k) => k.status === 'rejected').length;
    const approvalRate =
      approvedKYC + rejectedKYC > 0 ? (approvedKYC / (approvedKYC + rejectedKYC)) * 100 : 0;

    const actions = Array.from(this.userActions.values());
    const suspensions = actions.filter((a) => a.actionType === 'suspend').length;
    const bans = actions.filter((a) => a.actionType === 'ban').length;
    const verifications = actions.filter((a) => a.actionType === 'verify').length;

    const activities = Array.from(this.userActivities.values());
    const flaggedActivities = activities.filter((a) => a.flagged).length;
    const flagRate = activities.length > 0 ? (flaggedActivities / activities.length) * 100 : 0;

    return {
      users: {
        total: users.length,
        byType,
        byStatus,
        byVerificationLevel,
      },
      kyc: {
        pending: pendingKYC,
        approved: approvedKYC,
        rejected: rejectedKYC,
        approvalRate: Math.round(approvalRate * 100) / 100,
      },
      actions: {
        suspensions,
        bans,
        verifications,
      },
      activity: {
        totalActivities: activities.length,
        flaggedActivities,
        flagRate: Math.round(flagRate * 100) / 100,
      },
    };
  }

  /**
   * Log user action
   */
  private async logUserAction(data: {
    userId: string;
    adminId: string;
    actionType: UserAction['actionType'];
    reason: string;
    reversible: boolean;
    details?: any;
  }): Promise<void> {
    const action: UserAction = {
      id: `action-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      adminId: data.adminId,
      actionType: data.actionType,
      reason: data.reason,
      details: data.details,
      timestamp: new Date(),
      reversible: data.reversible,
    };

    this.userActions.set(action.id, action);
  }

  /**
   * Check for suspicious activity
   */
  private async checkForSuspiciousActivity(activity: UserActivity): Promise<void> {
    // Simple fraud detection rules
    const recentActivities = Array.from(this.userActivities.values()).filter(
      (a) => a.userId === activity.userId && a.timestamp > new Date(Date.now() - 3600000) // Last hour
    );

    // Flag if too many login attempts
    if (
      activity.activityType === 'login' &&
      recentActivities.filter((a) => a.activityType === 'login').length > 5
    ) {
      activity.flagged = true;
      activity.flagReason = 'Multiple login attempts in short time';
      this.userActivities.set(activity.id, activity);
    }

    // Flag if multiple purchases in short time
    if (
      activity.activityType === 'purchase' &&
      recentActivities.filter((a) => a.activityType === 'purchase').length > 3
    ) {
      activity.flagged = true;
      activity.flagReason = 'Multiple purchases in short time';
      this.userActivities.set(activity.id, activity);
    }
  }

  /**
   * Get default permissions for role
   */
  private getDefaultPermissionsForRole(role: AdminUser['role']): Permission[] {
    const allPermissions = Array.from(this.permissions.values());

    switch (role) {
      case 'super_admin':
        return allPermissions;
      case 'admin':
        return allPermissions.filter((p) => p.category !== 'system' || p.action === 'read');
      case 'moderator':
        return allPermissions.filter(
          (p) =>
            (p.category === 'users' || p.category === 'content') &&
            (p.action === 'read' || p.action === 'update')
        );
      case 'support':
        return allPermissions.filter(
          (p) => (p.category === 'users' || p.category === 'orders') && p.action === 'read'
        );
      case 'analyst':
        return allPermissions.filter((p) => p.category === 'analytics' && p.action === 'read');
      default:
        return [];
    }
  }

  /**
   * Initialize default data
   */
  private initializeDefaultData(): void {
    // Create permissions
    const categories: Permission['category'][] = [
      'users',
      'products',
      'orders',
      'content',
      'analytics',
      'system',
    ];
    const actions: Permission['action'][] = ['create', 'read', 'update', 'delete', 'manage'];

    categories.forEach((category) => {
      actions.forEach((action) => {
        const permission: Permission = {
          id: `perm-${category}-${action}`,
          name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${category}`,
          category,
          action,
          resource: category,
        };
        this.permissions.set(permission.id, permission);
      });
    });

    // Create sample admin users
    this.createAdminUser({
      email: 'admin@artisan.com',
      name: 'System Administrator',
      role: 'super_admin',
      department: 'IT',
    });

    this.createAdminUser({
      email: 'support@artisan.com',
      name: 'Support Team',
      role: 'support',
      department: 'Customer Support',
    });

    // Create sample user accounts
    const sampleUser: UserAccount = {
      id: 'user-1',
      email: 'customer@example.com',
      name: 'John Doe',
      phone: '+91 98765 43210',
      type: 'customer',
      status: 'active',
      verificationLevel: 'email_verified',
      createdAt: new Date(Date.now() - 30 * 86400000),
      lastActive: new Date(),
      totalOrders: 5,
      totalSpent: 15000,
      suspensionHistory: [],
      notes: [],
    };
    this.userAccounts.set(sampleUser.id, sampleUser);
  }
}

// Singleton instance
export const adminUserManagementSystem = new AdminUserManagementSystem();
