/**
 * Access Control System
 *
 * Role-based access control and permissions
 */

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  inherits?: string[];
  createdAt: Date;
}

export interface AccessPolicy {
  id: string;
  resource: string;
  action: string;
  effect: 'allow' | 'deny';
  conditions?: Record<string, any>;
}

export interface AccessLog {
  id: string;
  userId: string;
  resource: string;
  action: string;
  granted: boolean;
  timestamp: Date;
  context?: any;
}

export class AccessControlSystem {
  private roles: Map<string, Role> = new Map();
  private policies: Map<string, AccessPolicy> = new Map();
  private accessLogs: Map<string, AccessLog> = new Map();
  private userRoles: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDefaultRoles();
  }

  async createRole(data: {
    name: string;
    permissions: string[];
    inherits?: string[];
  }): Promise<Role> {
    const role: Role = {
      id: `role-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: data.name,
      permissions: data.permissions,
      inherits: data.inherits,
      createdAt: new Date(),
    };
    this.roles.set(role.id, role);
    return role;
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    const roles = this.userRoles.get(userId) || [];
    if (!roles.includes(roleId)) {
      roles.push(roleId);
      this.userRoles.set(userId, roles);
    }
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const userRoleIds = this.userRoles.get(userId) || [];
    const permissions = new Set<string>();

    for (const roleId of userRoleIds) {
      const role = this.roles.get(roleId);
      if (role) {
        role.permissions.forEach((p) => permissions.add(p));
        if (role.inherits) {
          for (const inheritedId of role.inherits) {
            const inheritedRole = this.roles.get(inheritedId);
            if (inheritedRole) {
              inheritedRole.permissions.forEach((p) => permissions.add(p));
            }
          }
        }
      }
    }

    const hasPermission = permissions.has(`${resource}:${action}`) || permissions.has('*:*');

    await this.logAccess({
      userId,
      resource,
      action,
      granted: hasPermission,
    });

    return hasPermission;
  }

  async logAccess(data: {
    userId: string;
    resource: string;
    action: string;
    granted: boolean;
    context?: any;
  }): Promise<AccessLog> {
    const log: AccessLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: data.userId,
      resource: data.resource,
      action: data.action,
      granted: data.granted,
      timestamp: new Date(),
      context: data.context,
    };
    this.accessLogs.set(log.id, log);
    return log;
  }

  async getAccessLogs(userId?: string, limit: number = 100): Promise<AccessLog[]> {
    let logs = Array.from(this.accessLogs.values());
    if (userId) {
      logs = logs.filter((l) => l.userId === userId);
    }
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
  }

  async getAnalytics(): Promise<{
    totalRoles: number;
    totalPolicies: number;
    accessAttempts: number;
    deniedAccess: number;
    denialRate: number;
  }> {
    const logs = Array.from(this.accessLogs.values());
    const denied = logs.filter((l) => !l.granted).length;

    return {
      totalRoles: this.roles.size,
      totalPolicies: this.policies.size,
      accessAttempts: logs.length,
      deniedAccess: denied,
      denialRate: logs.length > 0 ? (denied / logs.length) * 100 : 0,
    };
  }

  private initializeDefaultRoles(): void {
    this.createRole({
      name: 'Admin',
      permissions: ['*:*'],
    });

    this.createRole({
      name: 'User',
      permissions: ['products:read', 'orders:create', 'orders:read', 'profile:update'],
    });
  }
}

export const accessControlSystem = new AccessControlSystem();
