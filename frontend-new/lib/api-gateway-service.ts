/**
 * API Gateway Service
 *
 * Central API gateway for external integrations
 */

export interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  version: string;
  rateLimit: number; // requests per minute
  authentication: 'api_key' | 'oauth' | 'jwt' | 'none';
  enabled: boolean;
  createdAt: Date;
}

export interface APIKey {
  id: string;
  key: string;
  name: string;
  userId: string;
  permissions: string[];
  rateLimit: number;
  usageCount: number;
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
}

export interface APIRequest {
  id: string;
  apiKeyId?: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  ipAddress?: string;
}

export class APIGatewayService {
  private endpoints: Map<string, APIEndpoint> = new Map();
  private apiKeys: Map<string, APIKey> = new Map();
  private requests: Map<string, APIRequest> = new Map();

  constructor() {
    this.initializeEndpoints();
  }

  async createEndpoint(data: {
    path: string;
    method: APIEndpoint['method'];
    version: string;
    rateLimit: number;
    authentication: APIEndpoint['authentication'];
  }): Promise<APIEndpoint> {
    const endpoint: APIEndpoint = {
      id: `endpoint-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      path: data.path,
      method: data.method,
      version: data.version,
      rateLimit: data.rateLimit,
      authentication: data.authentication,
      enabled: true,
      createdAt: new Date(),
    };

    this.endpoints.set(endpoint.id, endpoint);
    return endpoint;
  }

  async createAPIKey(data: {
    name: string;
    userId: string;
    permissions: string[];
    rateLimit: number;
    expiresAt?: Date;
  }): Promise<APIKey> {
    const key = `ak_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

    const apiKey: APIKey = {
      id: `key-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      key,
      name: data.name,
      userId: data.userId,
      permissions: data.permissions,
      rateLimit: data.rateLimit,
      usageCount: 0,
      createdAt: new Date(),
      expiresAt: data.expiresAt,
    };

    this.apiKeys.set(apiKey.id, apiKey);
    return apiKey;
  }

  async validateAPIKey(key: string): Promise<APIKey | null> {
    const apiKey = Array.from(this.apiKeys.values()).find((k) => k.key === key);

    if (!apiKey) return null;

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    return apiKey;
  }

  async logRequest(data: {
    apiKeyId?: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    ipAddress?: string;
  }): Promise<APIRequest> {
    const request: APIRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      apiKeyId: data.apiKeyId,
      endpoint: data.endpoint,
      method: data.method,
      statusCode: data.statusCode,
      responseTime: data.responseTime,
      timestamp: new Date(),
      ipAddress: data.ipAddress,
    };

    this.requests.set(request.id, request);

    if (data.apiKeyId) {
      const apiKey = this.apiKeys.get(data.apiKeyId);
      if (apiKey) {
        apiKey.usageCount++;
        apiKey.lastUsed = new Date();
        this.apiKeys.set(data.apiKeyId, apiKey);
      }
    }

    return request;
  }

  async checkRateLimit(apiKeyId: string): Promise<boolean> {
    const apiKey = this.apiKeys.get(apiKeyId);
    if (!apiKey) return false;

    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentRequests = Array.from(this.requests.values()).filter(
      (r) => r.apiKeyId === apiKeyId && r.timestamp > oneMinuteAgo
    );

    return recentRequests.length < apiKey.rateLimit;
  }

  async getAPIStats(): Promise<{
    totalEndpoints: number;
    totalAPIKeys: number;
    totalRequests: number;
    averageResponseTime: number;
    requestsByEndpoint: Record<string, number>;
    requestsByStatus: Record<string, number>;
  }> {
    const requests = Array.from(this.requests.values());
    const avgResponseTime =
      requests.length > 0
        ? requests.reduce((sum, r) => sum + r.responseTime, 0) / requests.length
        : 0;

    const byEndpoint = requests.reduce(
      (acc, r) => {
        acc[r.endpoint] = (acc[r.endpoint] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byStatus = requests.reduce(
      (acc, r) => {
        const status = `${Math.floor(r.statusCode / 100)}xx`;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalEndpoints: this.endpoints.size,
      totalAPIKeys: this.apiKeys.size,
      totalRequests: requests.length,
      averageResponseTime: Math.round(avgResponseTime * 10) / 10,
      requestsByEndpoint: byEndpoint,
      requestsByStatus: byStatus,
    };
  }

  private initializeEndpoints(): void {
    this.createEndpoint({
      path: '/api/v1/products',
      method: 'GET',
      version: 'v1',
      rateLimit: 100,
      authentication: 'api_key',
    });

    this.createEndpoint({
      path: '/api/v1/orders',
      method: 'POST',
      version: 'v1',
      rateLimit: 50,
      authentication: 'oauth',
    });
  }
}

export const apiGatewayService = new APIGatewayService();
