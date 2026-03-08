/**
 * External API Management System
 *
 * Centralized API management for third-party integrations with rate limiting,
 * caching, monitoring, webhooks, and comprehensive error handling.
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ApiProvider =
  | 'google-maps'
  | 'google-analytics'
  | 'cloudinary'
  | 'aws-s3'
  | 'stripe'
  | 'paypal'
  | 'twilio'
  | 'sendgrid'
  | 'firebase'
  | 'algolia'
  | 'elasticsearch'
  | 'redis'
  | 'mongodb'
  | 'openai'
  | 'custom';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type AuthType =
  | 'none'
  | 'api-key'
  | 'bearer'
  | 'basic'
  | 'oauth1'
  | 'oauth2'
  | 'jwt'
  | 'custom';

export type RequestStatus =
  | 'pending'
  | 'success'
  | 'failed'
  | 'timeout'
  | 'rate-limited'
  | 'cached';

export type WebhookStatus = 'active' | 'inactive' | 'failed' | 'paused';

export interface ApiConfiguration {
  id: string;
  provider: ApiProvider;
  name: string;
  enabled: boolean;

  endpoint: {
    baseUrl: string;
    version?: string;
    customHeaders?: Record<string, string>;
  };

  authentication: {
    type: AuthType;

    apiKey?: {
      key: string;
      headerName: string;
      prefix?: string;
    };

    bearer?: {
      token: string;
    };

    basic?: {
      username: string;
      password: string;
    };

    oauth2?: {
      clientId: string;
      clientSecret: string;
      accessToken: string;
      refreshToken?: string;
      tokenUrl?: string;
      scopes?: string[];
      expiresAt?: Date;
    };

    jwt?: {
      secret: string;
      algorithm: string;
      expiresIn: number;
    };
  };

  rateLimit: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number; // time window in milliseconds
    strategy: 'fixed-window' | 'sliding-window' | 'token-bucket';

    perEndpoint?: Record<
      string,
      {
        maxRequests: number;
        windowMs: number;
      }
    >;
  };

  cache: {
    enabled: boolean;
    ttl: number; // seconds
    strategy: 'memory' | 'redis' | 'none';

    keyPrefix?: string;

    cacheable: {
      methods: HttpMethod[];
      statusCodes: number[];
    };
  };

  retry: {
    enabled: boolean;
    maxAttempts: number;
    backoffMultiplier: number;
    initialDelay: number; // milliseconds
    maxDelay: number;

    retryableStatusCodes: number[];
    retryableErrors: string[];
  };

  timeout: {
    connect: number; // milliseconds
    request: number;
    response: number;
  };

  monitoring: {
    enabled: boolean;
    logRequests: boolean;
    logResponses: boolean;
    logErrors: boolean;

    metrics: {
      enabled: boolean;
      sampleRate: number; // 0-1
    };
  };

  circuitBreaker?: {
    enabled: boolean;
    threshold: number; // failure threshold
    timeout: number; // milliseconds to keep circuit open
    resetTimeout: number; // time before attempting to close circuit
  };

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastUsed?: Date;
  };
}

export interface ApiRequest {
  id: string;
  configId: string;
  provider: ApiProvider;

  method: HttpMethod;
  endpoint: string;

  headers: Record<string, string>;
  queryParams?: Record<string, any>;
  body?: any;

  authentication?: {
    type: AuthType;
    applied: boolean;
  };

  metadata: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    tags?: string[];
    customData?: Record<string, any>;
  };

  createdAt: Date;
}

export interface ApiResponse {
  id: string;
  requestId: string;

  status: RequestStatus;

  http: {
    statusCode: number;
    statusText: string;
    headers: Record<string, string>;
  };

  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };

  timing: {
    start: Date;
    end: Date;
    duration: number; // milliseconds

    dns?: number;
    tcp?: number;
    tls?: number;
    firstByte?: number;
    download?: number;
  };

  cache: {
    hit: boolean;
    key?: string;
    ttl?: number;
  };

  retry: {
    attempts: number;
    successful: boolean;
  };

  size: {
    request: number; // bytes
    response: number;
  };

  createdAt: Date;
}

export interface RateLimitState {
  configId: string;
  endpoint?: string;

  window: {
    start: Date;
    end: Date;
  };

  current: {
    requests: number;
    remaining: number;
    limit: number;
  };

  reset: Date;

  tokens?: number; // for token bucket strategy
}

export interface CacheEntry {
  key: string;
  value: any;

  metadata: {
    configId: string;
    requestHash: string;

    size: number;
    compressed: boolean;
  };

  ttl: number;
  createdAt: Date;
  expiresAt: Date;

  hits: number;
  lastAccessed: Date;
}

export interface Webhook {
  id: string;
  url: string;

  events: string[];

  authentication?: {
    type: 'none' | 'header' | 'query' | 'signature';

    header?: {
      name: string;
      value: string;
    };

    signature?: {
      secret: string;
      algorithm: 'sha256' | 'sha512';
      header: string;
    };
  };

  retry: {
    enabled: boolean;
    maxAttempts: number;
    backoffMultiplier: number;
  };

  timeout: number;

  filters?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;

  status: WebhookStatus;

  stats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    lastDelivery?: Date;
    lastSuccess?: Date;
    lastFailure?: Date;
    averageResponseTime: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;

  event: {
    type: string;
    data: any;
    timestamp: Date;
  };

  request: {
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    body: any;
  };

  response?: {
    statusCode: number;
    statusText: string;
    headers: Record<string, string>;
    body?: any;
    duration: number;
  };

  status: 'pending' | 'delivered' | 'failed' | 'retrying';

  attempts: number;
  maxAttempts: number;
  nextRetry?: Date;

  error?: {
    message: string;
    details?: any;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ApiMetrics {
  configId: string;
  provider: ApiProvider;

  period: {
    start: Date;
    end: Date;
  };

  requests: {
    total: number;
    successful: number;
    failed: number;
    cached: number;
    rateLimited: number;

    byMethod: Record<HttpMethod, number>;
    byStatus: Record<number, number>;
    byEndpoint: Record<string, number>;
  };

  performance: {
    averageResponseTime: number;
    p50: number;
    p95: number;
    p99: number;

    fastest: number;
    slowest: number;

    totalDuration: number;
  };

  errors: {
    total: number;

    byType: Record<string, number>;
    byEndpoint: Record<string, number>;

    topErrors: Array<{
      code: string;
      message: string;
      count: number;
    }>;
  };

  cache: {
    hits: number;
    misses: number;
    hitRate: number;

    size: number; // bytes
    entries: number;
  };

  rateLimit: {
    throttled: number;
    throttleRate: number;
  };

  bandwidth: {
    sent: number; // bytes
    received: number;
    total: number;
  };

  availability: {
    uptime: number; // percentage
    downtime: number; // milliseconds
  };

  trends: {
    hourly: Array<{
      hour: Date;
      requests: number;
      averageResponseTime: number;
      errorRate: number;
    }>;

    daily: Array<{
      date: Date;
      requests: number;
      errors: number;
      cacheHitRate: number;
    }>;
  };
}

export interface ApiProxy {
  id: string;
  name: string;
  path: string;

  target: {
    configId: string;
    endpoint: string;
    rewrite?: Record<string, string>;
  };

  methods: HttpMethod[];

  middleware: Array<{
    type: 'auth' | 'rate-limit' | 'cache' | 'transform' | 'validate' | 'log';
    config: any;
    order: number;
  }>;

  cors?: {
    enabled: boolean;
    origins: string[];
    methods: HttpMethod[];
    credentials: boolean;
  };

  enabled: boolean;

  stats: {
    requests: number;
    lastRequest?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;

  type: 'public' | 'private' | 'restricted';

  permissions: {
    providers: ApiProvider[];
    methods: HttpMethod[];
    endpoints?: string[];

    rateLimit?: {
      maxRequests: number;
      windowMs: number;
    };
  };

  usage: {
    totalRequests: number;
    lastUsed?: Date;
  };

  status: 'active' | 'revoked' | 'expired';

  expiresAt?: Date;

  metadata?: {
    userId?: string;
    applicationId?: string;
    description?: string;
    tags?: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface CircuitBreakerState {
  configId: string;

  state: 'closed' | 'open' | 'half-open';

  failures: number;
  threshold: number;

  lastFailure?: Date;
  openedAt?: Date;
  nextAttempt?: Date;

  stats: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    rejectedRequests: number;
  };
}

// ============================================================================
// Main System Class
// ============================================================================

export class ExternalApiManagementSystem {
  private configurations: Map<string, ApiConfiguration> = new Map();
  private requests: Map<string, ApiRequest> = new Map();
  private responses: Map<string, ApiResponse> = new Map();
  private rateLimitStates: Map<string, RateLimitState> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private webhooks: Map<string, Webhook> = new Map();
  private webhookDeliveries: Map<string, WebhookDelivery> = new Map();
  private proxies: Map<string, ApiProxy> = new Map();
  private apiKeys: Map<string, ApiKey> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();

  private cacheCleanupInterval?: NodeJS.Timeout;
  private webhookProcessorInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeProviders();
    this.startCacheCleanup();
    this.startWebhookProcessor();
  }

  // ============================================================================
  // API Configuration
  // ============================================================================

  configureApi(params: {
    provider: ApiProvider;
    name: string;
    baseUrl: string;
    authentication: ApiConfiguration['authentication'];
    rateLimit?: Partial<ApiConfiguration['rateLimit']>;
    cache?: Partial<ApiConfiguration['cache']>;
  }): ApiConfiguration {
    const config: ApiConfiguration = {
      id: `api_${params.provider}_${Date.now()}`,
      provider: params.provider,
      name: params.name,
      enabled: false,
      endpoint: {
        baseUrl: params.baseUrl,
      },
      authentication: params.authentication,
      rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 60000, // 1 minute
        strategy: 'sliding-window',
        ...params.rateLimit,
      },
      cache: {
        enabled: true,
        ttl: 300, // 5 minutes
        strategy: 'memory',
        cacheable: {
          methods: ['GET', 'HEAD'],
          statusCodes: [200, 203, 204, 206, 300, 301],
        },
        ...params.cache,
      },
      retry: {
        enabled: true,
        maxAttempts: 3,
        backoffMultiplier: 2,
        initialDelay: 1000,
        maxDelay: 10000,
        retryableStatusCodes: [408, 429, 500, 502, 503, 504],
        retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
      },
      timeout: {
        connect: 5000,
        request: 30000,
        response: 30000,
      },
      monitoring: {
        enabled: true,
        logRequests: true,
        logResponses: true,
        logErrors: true,
        metrics: {
          enabled: true,
          sampleRate: 1.0,
        },
      },
      circuitBreaker: {
        enabled: true,
        threshold: 5,
        timeout: 60000,
        resetTimeout: 30000,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    this.configurations.set(config.id, config);

    // Initialize circuit breaker
    if (config.circuitBreaker?.enabled) {
      this.initializeCircuitBreaker(config.id, config.circuitBreaker.threshold);
    }

    return config;
  }

  enableApi(configId: string): ApiConfiguration {
    const config = this.configurations.get(configId);
    if (!config) throw new Error('API configuration not found');

    config.enabled = true;
    config.metadata.updatedAt = new Date();

    return config;
  }

  disableApi(configId: string): ApiConfiguration {
    const config = this.configurations.get(configId);
    if (!config) throw new Error('API configuration not found');

    config.enabled = false;
    config.metadata.updatedAt = new Date();

    return config;
  }

  // ============================================================================
  // API Requests
  // ============================================================================

  async makeRequest(params: {
    configId: string;
    method: HttpMethod;
    endpoint: string;
    queryParams?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
    metadata?: ApiRequest['metadata'];
  }): Promise<ApiResponse> {
    const config = this.configurations.get(params.configId);
    if (!config) throw new Error('API configuration not found');
    if (!config.enabled) throw new Error('API is disabled');

    // Check circuit breaker
    if (config.circuitBreaker?.enabled) {
      const canProceed = this.checkCircuitBreaker(params.configId);
      if (!canProceed) {
        return this.createErrorResponse(params, 'Circuit breaker is open', 'CIRCUIT_OPEN');
      }
    }

    // Check rate limit
    if (config.rateLimit.enabled) {
      const rateLimitOk = this.checkRateLimit(params.configId, params.endpoint);
      if (!rateLimitOk) {
        return this.createErrorResponse(params, 'Rate limit exceeded', 'RATE_LIMITED');
      }
    }

    // Create request
    const request = this.createRequest(params, config);

    // Check cache
    if (config.cache.enabled && this.isCacheable(params.method, config)) {
      const cached = this.getCachedResponse(request, config);
      if (cached) {
        return cached;
      }
    }

    // Execute request
    const response = await this.executeRequest(request, config);

    // Update circuit breaker
    if (config.circuitBreaker?.enabled) {
      this.updateCircuitBreaker(params.configId, response.status === 'success');
    }

    // Cache response
    if (config.cache.enabled && this.shouldCache(response, config)) {
      this.cacheResponse(request, response, config);
    }

    // Update metrics
    config.metadata.lastUsed = new Date();

    return response;
  }

  private createRequest(
    params: {
      configId: string;
      method: HttpMethod;
      endpoint: string;
      queryParams?: Record<string, any>;
      body?: any;
      headers?: Record<string, string>;
      metadata?: ApiRequest['metadata'];
    },
    config: ApiConfiguration
  ): ApiRequest {
    const request: ApiRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      configId: params.configId,
      provider: config.provider,
      method: params.method,
      endpoint: params.endpoint,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Artisans-API-Client/1.0',
        ...params.headers,
      },
      queryParams: params.queryParams,
      body: params.body,
      authentication: {
        type: config.authentication.type,
        applied: false,
      },
      metadata: params.metadata || {},
      createdAt: new Date(),
    };

    // Apply authentication
    this.applyAuthentication(request, config);

    this.requests.set(request.id, request);
    return request;
  }

  private applyAuthentication(request: ApiRequest, config: ApiConfiguration): void {
    const auth = config.authentication;

    switch (auth.type) {
      case 'api-key':
        if (auth.apiKey) {
          const value = auth.apiKey.prefix
            ? `${auth.apiKey.prefix} ${auth.apiKey.key}`
            : auth.apiKey.key;
          request.headers[auth.apiKey.headerName] = value;
          request.authentication!.applied = true;
        }
        break;

      case 'bearer':
        if (auth.bearer) {
          request.headers['Authorization'] = `Bearer ${auth.bearer.token}`;
          request.authentication!.applied = true;
        }
        break;

      case 'basic':
        if (auth.basic) {
          const encoded = Buffer.from(`${auth.basic.username}:${auth.basic.password}`).toString(
            'base64'
          );
          request.headers['Authorization'] = `Basic ${encoded}`;
          request.authentication!.applied = true;
        }
        break;

      case 'oauth2':
        if (auth.oauth2) {
          request.headers['Authorization'] = `Bearer ${auth.oauth2.accessToken}`;
          request.authentication!.applied = true;
        }
        break;
    }
  }

  private async executeRequest(
    request: ApiRequest,
    config: ApiConfiguration
  ): Promise<ApiResponse> {
    const startTime = Date.now();
    let attempt = 0;

    while (attempt < (config.retry.enabled ? config.retry.maxAttempts : 1)) {
      try {
        attempt++;

        // Simulate API call
        const result = await this.simulateApiCall(request, config);

        const endTime = Date.now();
        const duration = endTime - startTime;

        const response: ApiResponse = {
          id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          requestId: request.id,
          status: 'success',
          http: {
            statusCode: result.statusCode,
            statusText: result.statusText,
            headers: result.headers,
          },
          data: result.data,
          timing: {
            start: new Date(startTime),
            end: new Date(endTime),
            duration,
          },
          cache: {
            hit: false,
          },
          retry: {
            attempts: attempt,
            successful: true,
          },
          size: {
            request: this.calculateSize(request.body),
            response: this.calculateSize(result.data),
          },
          createdAt: new Date(),
        };

        this.responses.set(response.id, response);
        return response;
      } catch (error) {
        const shouldRetry =
          config.retry.enabled &&
          attempt < config.retry.maxAttempts &&
          this.isRetryable(error, config);

        if (!shouldRetry) {
          return this.createErrorResponse(
            request,
            error instanceof Error ? error.message : 'Unknown error',
            'REQUEST_FAILED',
            attempt
          );
        }

        // Wait before retry
        const delay = Math.min(
          config.retry.initialDelay * Math.pow(config.retry.backoffMultiplier, attempt - 1),
          config.retry.maxDelay
        );
        await this.delay(delay);
      }
    }

    return this.createErrorResponse(request, 'Max retry attempts exceeded', 'MAX_RETRIES', attempt);
  }

  private async simulateApiCall(
    request: ApiRequest,
    config: ApiConfiguration
  ): Promise<{
    statusCode: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
  }> {
    // Simulate network delay
    await this.delay(100 + Math.random() * 400);

    // Simulate success/failure (95% success rate)
    if (Math.random() < 0.05) {
      throw new Error('Simulated API error');
    }

    return {
      statusCode: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-request-id': request.id,
      },
      data: {
        success: true,
        message: 'Request successful',
        data: {},
      },
    };
  }

  private createErrorResponse(
    requestOrParams: ApiRequest | any,
    message: string,
    code: string,
    attempts: number = 1
  ): ApiResponse {
    const requestId = 'id' in requestOrParams ? requestOrParams.id : `req_error_${Date.now()}`;

    const response: ApiResponse = {
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId,
      status: code === 'RATE_LIMITED' ? 'rate-limited' : 'failed',
      http: {
        statusCode: code === 'RATE_LIMITED' ? 429 : 500,
        statusText: message,
        headers: {},
      },
      error: {
        code,
        message,
      },
      timing: {
        start: new Date(),
        end: new Date(),
        duration: 0,
      },
      cache: {
        hit: false,
      },
      retry: {
        attempts,
        successful: false,
      },
      size: {
        request: 0,
        response: 0,
      },
      createdAt: new Date(),
    };

    this.responses.set(response.id, response);
    return response;
  }

  // ============================================================================
  // Rate Limiting
  // ============================================================================

  private checkRateLimit(configId: string, endpoint?: string): boolean {
    const config = this.configurations.get(configId);
    if (!config || !config.rateLimit.enabled) return true;

    const key =
      endpoint && config.rateLimit.perEndpoint?.[endpoint] ? `${configId}:${endpoint}` : configId;

    let state = this.rateLimitStates.get(key);
    const now = new Date();

    // Initialize or reset window
    if (!state || now >= state.window.end) {
      const limit =
        endpoint && config.rateLimit.perEndpoint?.[endpoint]
          ? config.rateLimit.perEndpoint[endpoint].maxRequests
          : config.rateLimit.maxRequests;

      const windowMs =
        endpoint && config.rateLimit.perEndpoint?.[endpoint]
          ? config.rateLimit.perEndpoint[endpoint].windowMs
          : config.rateLimit.windowMs;

      state = {
        configId,
        endpoint,
        window: {
          start: now,
          end: new Date(now.getTime() + windowMs),
        },
        current: {
          requests: 0,
          remaining: limit,
          limit,
        },
        reset: new Date(now.getTime() + windowMs),
      };

      this.rateLimitStates.set(key, state);
    }

    // Check limit
    if (state.current.requests >= state.current.limit) {
      return false;
    }

    // Increment counter
    state.current.requests++;
    state.current.remaining--;

    return true;
  }

  getRateLimitStatus(configId: string, endpoint?: string): RateLimitState | null {
    const key = endpoint ? `${configId}:${endpoint}` : configId;
    return this.rateLimitStates.get(key) || null;
  }

  // ============================================================================
  // Caching
  // ============================================================================

  private isCacheable(method: HttpMethod, config: ApiConfiguration): boolean {
    return config.cache.cacheable.methods.includes(method);
  }

  private shouldCache(response: ApiResponse, config: ApiConfiguration): boolean {
    return (
      response.status === 'success' &&
      config.cache.cacheable.statusCodes.includes(response.http.statusCode)
    );
  }

  private getCachedResponse(request: ApiRequest, config: ApiConfiguration): ApiResponse | null {
    const cacheKey = this.generateCacheKey(request, config);
    const entry = this.cache.get(cacheKey);

    if (!entry) return null;

    // Check expiration
    if (new Date() >= entry.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    // Update stats
    entry.hits++;
    entry.lastAccessed = new Date();

    // Create cached response
    const response: ApiResponse = {
      id: `res_cached_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: request.id,
      status: 'cached',
      http: {
        statusCode: 200,
        statusText: 'OK (Cached)',
        headers: {},
      },
      data: entry.value,
      timing: {
        start: new Date(),
        end: new Date(),
        duration: 1,
      },
      cache: {
        hit: true,
        key: cacheKey,
        ttl: entry.ttl,
      },
      retry: {
        attempts: 0,
        successful: true,
      },
      size: {
        request: 0,
        response: entry.metadata.size,
      },
      createdAt: new Date(),
    };

    this.responses.set(response.id, response);
    return response;
  }

  private cacheResponse(
    request: ApiRequest,
    response: ApiResponse,
    config: ApiConfiguration
  ): void {
    const cacheKey = this.generateCacheKey(request, config);
    const now = new Date();

    const entry: CacheEntry = {
      key: cacheKey,
      value: response.data,
      metadata: {
        configId: config.id,
        requestHash: this.hashRequest(request),
        size: response.size.response,
        compressed: false,
      },
      ttl: config.cache.ttl,
      createdAt: now,
      expiresAt: new Date(now.getTime() + config.cache.ttl * 1000),
      hits: 0,
      lastAccessed: now,
    };

    this.cache.set(cacheKey, entry);
  }

  private generateCacheKey(request: ApiRequest, config: ApiConfiguration): string {
    const prefix = config.cache.keyPrefix || config.provider;
    const hash = this.hashRequest(request);
    return `${prefix}:${hash}`;
  }

  private hashRequest(request: ApiRequest): string {
    const data = JSON.stringify({
      method: request.method,
      endpoint: request.endpoint,
      queryParams: request.queryParams,
      body: request.body,
    });

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return hash.toString(36);
  }

  invalidateCache(configId: string, pattern?: string): number {
    let count = 0;

    this.cache.forEach((entry, key) => {
      if (entry.metadata.configId === configId) {
        if (!pattern || key.includes(pattern)) {
          this.cache.delete(key);
          count++;
        }
      }
    });

    return count;
  }

  // ============================================================================
  // Circuit Breaker
  // ============================================================================

  private initializeCircuitBreaker(configId: string, threshold: number): void {
    this.circuitBreakers.set(configId, {
      configId,
      state: 'closed',
      failures: 0,
      threshold,
      stats: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        rejectedRequests: 0,
      },
    });
  }

  private checkCircuitBreaker(configId: string): boolean {
    const breaker = this.circuitBreakers.get(configId);
    if (!breaker) return true;

    const now = new Date();

    // Check if circuit is open
    if (breaker.state === 'open') {
      // Check if we should transition to half-open
      if (breaker.nextAttempt && now >= breaker.nextAttempt) {
        breaker.state = 'half-open';
        return true;
      }

      breaker.stats.rejectedRequests++;
      return false;
    }

    return true;
  }

  private updateCircuitBreaker(configId: string, success: boolean): void {
    const breaker = this.circuitBreakers.get(configId);
    if (!breaker) return;

    const config = this.configurations.get(configId);
    if (!config?.circuitBreaker) return;

    breaker.stats.totalRequests++;

    if (success) {
      breaker.stats.successfulRequests++;
      breaker.failures = 0;

      if (breaker.state === 'half-open') {
        breaker.state = 'closed';
      }
    } else {
      breaker.stats.failedRequests++;
      breaker.failures++;
      breaker.lastFailure = new Date();

      if (breaker.failures >= breaker.threshold) {
        breaker.state = 'open';
        breaker.openedAt = new Date();
        breaker.nextAttempt = new Date(Date.now() + config.circuitBreaker.resetTimeout);
      }
    }
  }

  getCircuitBreakerState(configId: string): CircuitBreakerState | null {
    return this.circuitBreakers.get(configId) || null;
  }

  resetCircuitBreaker(configId: string): void {
    const breaker = this.circuitBreakers.get(configId);
    if (breaker) {
      breaker.state = 'closed';
      breaker.failures = 0;
      breaker.lastFailure = undefined;
      breaker.openedAt = undefined;
      breaker.nextAttempt = undefined;
    }
  }

  // ============================================================================
  // Webhooks
  // ============================================================================

  createWebhook(params: {
    url: string;
    events: string[];
    authentication?: Webhook['authentication'];
    retry?: Partial<Webhook['retry']>;
  }): Webhook {
    const webhook: Webhook = {
      id: `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: params.url,
      events: params.events,
      authentication: params.authentication,
      retry: {
        enabled: true,
        maxAttempts: 3,
        backoffMultiplier: 2,
        ...params.retry,
      },
      timeout: 30000,
      status: 'active',
      stats: {
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        averageResponseTime: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  async triggerWebhook(event: { type: string; data: any }): Promise<void> {
    const webhooks = Array.from(this.webhooks.values()).filter(
      (wh) => wh.status === 'active' && wh.events.includes(event.type)
    );

    for (const webhook of webhooks) {
      const delivery = this.createWebhookDelivery(webhook, event);
      this.webhookDeliveries.set(delivery.id, delivery);
    }
  }

  private createWebhookDelivery(
    webhook: Webhook,
    event: { type: string; data: any }
  ): WebhookDelivery {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Artisans-Webhook/1.0',
      'X-Event-Type': event.type,
    };

    // Add authentication
    if (webhook.authentication?.type === 'header' && webhook.authentication.header) {
      headers[webhook.authentication.header.name] = webhook.authentication.header.value;
    }

    // Add signature
    if (webhook.authentication?.type === 'signature' && webhook.authentication.signature) {
      const signature = this.generateWebhookSignature(
        event.data,
        webhook.authentication.signature.secret,
        webhook.authentication.signature.algorithm
      );
      headers[webhook.authentication.signature.header] = signature;
    }

    const delivery: WebhookDelivery = {
      id: `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      webhookId: webhook.id,
      event: {
        type: event.type,
        data: event.data,
        timestamp: new Date(),
      },
      request: {
        url: webhook.url,
        method: 'POST',
        headers,
        body: event.data,
      },
      status: 'pending',
      attempts: 0,
      maxAttempts: webhook.retry.enabled ? webhook.retry.maxAttempts : 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return delivery;
  }

  private async processWebhookDelivery(delivery: WebhookDelivery): Promise<void> {
    const webhook = this.webhooks.get(delivery.webhookId);
    if (!webhook) return;

    delivery.status = 'retrying';
    delivery.attempts++;

    const startTime = Date.now();

    try {
      // Simulate webhook delivery
      await this.delay(500 + Math.random() * 1000);

      // 90% success rate
      if (Math.random() < 0.9) {
        const duration = Date.now() - startTime;

        delivery.response = {
          statusCode: 200,
          statusText: 'OK',
          headers: {},
          duration,
        };
        delivery.status = 'delivered';

        webhook.stats.successfulDeliveries++;
        webhook.stats.lastSuccess = new Date();
        webhook.stats.averageResponseTime =
          (webhook.stats.averageResponseTime * (webhook.stats.totalDeliveries - 1) + duration) /
          webhook.stats.totalDeliveries;
      } else {
        throw new Error('Webhook delivery failed');
      }
    } catch (error) {
      delivery.error = {
        message: error instanceof Error ? error.message : 'Unknown error',
      };

      // Schedule retry
      if (delivery.attempts < delivery.maxAttempts && webhook.retry.enabled) {
        const delay = 1000 * Math.pow(webhook.retry.backoffMultiplier, delivery.attempts - 1);
        delivery.nextRetry = new Date(Date.now() + delay);
        delivery.status = 'pending';
      } else {
        delivery.status = 'failed';
        webhook.stats.failedDeliveries++;
        webhook.stats.lastFailure = new Date();
      }
    }

    webhook.stats.totalDeliveries++;
    delivery.updatedAt = new Date();
    webhook.updatedAt = new Date();
  }

  private generateWebhookSignature(
    data: any,
    secret: string,
    algorithm: 'sha256' | 'sha512'
  ): string {
    // Simplified signature generation
    const payload = JSON.stringify(data);
    return `${algorithm}=${Buffer.from(payload + secret).toString('base64')}`;
  }

  // ============================================================================
  // API Proxies
  // ============================================================================

  createProxy(params: {
    name: string;
    path: string;
    configId: string;
    endpoint: string;
    methods?: HttpMethod[];
  }): ApiProxy {
    const proxy: ApiProxy = {
      id: `proxy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      path: params.path,
      target: {
        configId: params.configId,
        endpoint: params.endpoint,
      },
      methods: params.methods || ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      middleware: [],
      enabled: true,
      stats: {
        requests: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.proxies.set(proxy.id, proxy);
    return proxy;
  }

  // ============================================================================
  // API Keys
  // ============================================================================

  generateApiKey(params: {
    name: string;
    type: ApiKey['type'];
    permissions: ApiKey['permissions'];
    expiresIn?: number; // days
    metadata?: ApiKey['metadata'];
  }): ApiKey {
    const key = `ak_${Math.random().toString(36).substr(2, 32)}`;

    const apiKey: ApiKey = {
      id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key,
      name: params.name,
      type: params.type,
      permissions: params.permissions,
      usage: {
        totalRequests: 0,
      },
      status: 'active',
      expiresAt: params.expiresIn
        ? new Date(Date.now() + params.expiresIn * 24 * 60 * 60 * 1000)
        : undefined,
      metadata: params.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.apiKeys.set(apiKey.id, apiKey);
    return apiKey;
  }

  validateApiKey(key: string): ApiKey | null {
    const apiKey = Array.from(this.apiKeys.values()).find((k) => k.key === key);

    if (!apiKey) return null;
    if (apiKey.status !== 'active') return null;
    if (apiKey.expiresAt && new Date() >= apiKey.expiresAt) {
      apiKey.status = 'expired';
      return null;
    }

    apiKey.usage.totalRequests++;
    apiKey.usage.lastUsed = new Date();
    apiKey.updatedAt = new Date();

    return apiKey;
  }

  revokeApiKey(keyId: string): void {
    const apiKey = this.apiKeys.get(keyId);
    if (apiKey) {
      apiKey.status = 'revoked';
      apiKey.updatedAt = new Date();
    }
  }

  // ============================================================================
  // Metrics & Analytics
  // ============================================================================

  getApiMetrics(configId: string, period: { start: Date; end: Date }): ApiMetrics {
    const config = this.configurations.get(configId);
    if (!config) throw new Error('API configuration not found');

    const requests = Array.from(this.requests.values()).filter(
      (req) =>
        req.configId === configId && req.createdAt >= period.start && req.createdAt <= period.end
    );

    const responses = requests
      .map((req) => this.responses.get(req.id))
      .filter((res) => res !== undefined) as ApiResponse[];

    const successful = responses.filter(
      (res) => res.status === 'success' || res.status === 'cached'
    );
    const failed = responses.filter((res) => res.status === 'failed');
    const cached = responses.filter((res) => res.status === 'cached');
    const rateLimited = responses.filter((res) => res.status === 'rate-limited');

    const durations = responses.map((res) => res.timing.duration).sort((a, b) => a - b);

    const metrics: ApiMetrics = {
      configId,
      provider: config.provider,
      period,
      requests: {
        total: requests.length,
        successful: successful.length,
        failed: failed.length,
        cached: cached.length,
        rateLimited: rateLimited.length,
        byMethod: this.groupByMethod(requests),
        byStatus: this.groupByStatus(responses),
        byEndpoint: this.groupByEndpoint(requests),
      },
      performance: {
        averageResponseTime:
          durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
        p50: durations[Math.floor(durations.length * 0.5)] || 0,
        p95: durations[Math.floor(durations.length * 0.95)] || 0,
        p99: durations[Math.floor(durations.length * 0.99)] || 0,
        fastest: durations[0] || 0,
        slowest: durations[durations.length - 1] || 0,
        totalDuration: durations.reduce((a, b) => a + b, 0),
      },
      errors: {
        total: failed.length,
        byType: this.groupErrorsByType(failed),
        byEndpoint: this.groupErrorsByEndpoint(failed, requests),
        topErrors: this.getTopErrors(failed, 5),
      },
      cache: {
        hits: cached.length,
        misses: responses.length - cached.length,
        hitRate: responses.length > 0 ? (cached.length / responses.length) * 100 : 0,
        size: this.calculateCacheSize(configId),
        entries: this.getCacheEntryCount(configId),
      },
      rateLimit: {
        throttled: rateLimited.length,
        throttleRate: requests.length > 0 ? (rateLimited.length / requests.length) * 100 : 0,
      },
      bandwidth: {
        sent: responses.reduce((sum, res) => sum + res.size.request, 0),
        received: responses.reduce((sum, res) => sum + res.size.response, 0),
        total: 0,
      },
      availability: {
        uptime: successful.length > 0 ? (successful.length / responses.length) * 100 : 0,
        downtime: failed.reduce((sum, res) => sum + res.timing.duration, 0),
      },
      trends: {
        hourly: [],
        daily: [],
      },
    };

    metrics.bandwidth.total = metrics.bandwidth.sent + metrics.bandwidth.received;

    return metrics;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private isRetryable(error: any, config: ApiConfiguration): boolean {
    if (error.statusCode && config.retry.retryableStatusCodes.includes(error.statusCode)) {
      return true;
    }

    if (error.code && config.retry.retryableErrors.includes(error.code)) {
      return true;
    }

    return false;
  }

  private calculateSize(data: any): number {
    if (!data) return 0;
    return JSON.stringify(data).length;
  }

  private groupByMethod(requests: ApiRequest[]): Record<HttpMethod, number> {
    const grouped: Partial<Record<HttpMethod, number>> = {};
    requests.forEach((req) => {
      grouped[req.method] = (grouped[req.method] || 0) + 1;
    });
    return grouped as Record<HttpMethod, number>;
  }

  private groupByStatus(responses: ApiResponse[]): Record<number, number> {
    const grouped: Record<number, number> = {};
    responses.forEach((res) => {
      grouped[res.http.statusCode] = (grouped[res.http.statusCode] || 0) + 1;
    });
    return grouped;
  }

  private groupByEndpoint(requests: ApiRequest[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    requests.forEach((req) => {
      grouped[req.endpoint] = (grouped[req.endpoint] || 0) + 1;
    });
    return grouped;
  }

  private groupErrorsByType(responses: ApiResponse[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    responses.forEach((res) => {
      if (res.error) {
        grouped[res.error.code] = (grouped[res.error.code] || 0) + 1;
      }
    });
    return grouped;
  }

  private groupErrorsByEndpoint(
    responses: ApiResponse[],
    requests: ApiRequest[]
  ): Record<string, number> {
    const grouped: Record<string, number> = {};
    responses.forEach((res) => {
      const req = requests.find((r) => r.id === res.requestId);
      if (req) {
        grouped[req.endpoint] = (grouped[req.endpoint] || 0) + 1;
      }
    });
    return grouped;
  }

  private getTopErrors(responses: ApiResponse[], limit: number): ApiMetrics['errors']['topErrors'] {
    const errors = new Map<string, { code: string; message: string; count: number }>();

    responses.forEach((res) => {
      if (res.error) {
        const key = res.error.code;
        const existing = errors.get(key);
        if (existing) {
          existing.count++;
        } else {
          errors.set(key, {
            code: res.error.code,
            message: res.error.message,
            count: 1,
          });
        }
      }
    });

    return Array.from(errors.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private calculateCacheSize(configId: string): number {
    let size = 0;
    this.cache.forEach((entry) => {
      if (entry.metadata.configId === configId) {
        size += entry.metadata.size;
      }
    });
    return size;
  }

  private getCacheEntryCount(configId: string): number {
    let count = 0;
    this.cache.forEach((entry) => {
      if (entry.metadata.configId === configId) {
        count++;
      }
    });
    return count;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================================================
  // Background Tasks
  // ============================================================================

  private startCacheCleanup(): void {
    this.cacheCleanupInterval = setInterval(() => {
      const now = new Date();
      this.cache.forEach((entry, key) => {
        if (now >= entry.expiresAt) {
          this.cache.delete(key);
        }
      });
    }, 60000); // Every minute
  }

  private startWebhookProcessor(): void {
    this.webhookProcessorInterval = setInterval(() => {
      const pending = Array.from(this.webhookDeliveries.values()).filter(
        (d) => d.status === 'pending'
      );

      pending.forEach((delivery) => {
        if (!delivery.nextRetry || new Date() >= delivery.nextRetry) {
          this.processWebhookDelivery(delivery);
        }
      });
    }, 5000); // Every 5 seconds
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  private initializeProviders(): void {
    // Sample configurations would be added here in production
  }

  // ============================================================================
  // Query Methods
  // ============================================================================

  getConfigurationsByProvider(provider: ApiProvider): ApiConfiguration[] {
    return Array.from(this.configurations.values()).filter(
      (config) => config.provider === provider
    );
  }

  getRecentRequests(configId: string, limit: number = 10): ApiRequest[] {
    return Array.from(this.requests.values())
      .filter((req) => req.configId === configId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  getFailedRequests(
    configId: string,
    limit: number = 10
  ): Array<{ request: ApiRequest; response: ApiResponse }> {
    const requests = Array.from(this.requests.values()).filter((req) => req.configId === configId);

    return requests
      .map((req) => {
        const response = Array.from(this.responses.values()).find(
          (res) => res.requestId === req.id
        );
        return response && response.status === 'failed' ? { request: req, response } : null;
      })
      .filter((item) => item !== null)
      .sort((a, b) => b!.request.createdAt.getTime() - a!.request.createdAt.getTime())
      .slice(0, limit) as Array<{ request: ApiRequest; response: ApiResponse }>;
  }

  getActiveWebhooks(): Webhook[] {
    return Array.from(this.webhooks.values()).filter((wh) => wh.status === 'active');
  }

  getPendingWebhookDeliveries(): WebhookDelivery[] {
    return Array.from(this.webhookDeliveries.values()).filter(
      (d) => d.status === 'pending' || d.status === 'retrying'
    );
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const externalApiManagement = new ExternalApiManagementSystem();
