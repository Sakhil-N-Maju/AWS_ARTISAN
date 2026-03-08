/**
 * Load Balancer Service
 *
 * Distribute traffic across multiple servers
 */

export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  status: 'online' | 'offline' | 'maintenance';
  currentLoad: number;
  maxCapacity: number;
  healthScore: number;
  lastHealthCheck: Date;
}

export interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'ip_hash';
  healthCheckInterval: number;
  failoverEnabled: boolean;
}

export class LoadBalancerService {
  private servers: Map<string, Server> = new Map();
  private config: LoadBalancerConfig;
  private currentIndex: number = 0;
  private requestCount: number = 0;

  constructor() {
    this.config = {
      algorithm: 'round_robin',
      healthCheckInterval: 30000,
      failoverEnabled: true,
    };
    this.initializeServers();
    this.startHealthChecks();
  }

  async getNextServer(): Promise<Server | null> {
    const onlineServers = Array.from(this.servers.values()).filter((s) => s.status === 'online');

    if (onlineServers.length === 0) return null;

    this.requestCount++;

    switch (this.config.algorithm) {
      case 'round_robin':
        return this.roundRobin(onlineServers);
      case 'least_connections':
        return this.leastConnections(onlineServers);
      case 'weighted':
        return this.weighted(onlineServers);
      default:
        return this.roundRobin(onlineServers);
    }
  }

  private roundRobin(servers: Server[]): Server {
    const server = servers[this.currentIndex % servers.length];
    this.currentIndex++;
    server.currentLoad++;
    this.servers.set(server.id, server);
    return server;
  }

  private leastConnections(servers: Server[]): Server {
    const server = servers.reduce((min, s) => (s.currentLoad < min.currentLoad ? s : min));
    server.currentLoad++;
    this.servers.set(server.id, server);
    return server;
  }

  private weighted(servers: Server[]): Server {
    const totalCapacity = servers.reduce((sum, s) => sum + s.maxCapacity, 0);
    const random = Math.random() * totalCapacity;
    let sum = 0;

    for (const server of servers) {
      sum += server.maxCapacity;
      if (random <= sum) {
        server.currentLoad++;
        this.servers.set(server.id, server);
        return server;
      }
    }

    return servers[0];
  }

  async releaseServer(serverId: string): Promise<void> {
    const server = this.servers.get(serverId);
    if (server && server.currentLoad > 0) {
      server.currentLoad--;
      this.servers.set(serverId, server);
    }
  }

  async performHealthCheck(serverId: string): Promise<void> {
    const server = this.servers.get(serverId);
    if (!server) return;

    // Simulate health check
    const healthy = Math.random() > 0.1; // 90% success rate
    server.healthScore = healthy ? 100 : 0;
    server.status = healthy ? 'online' : 'offline';
    server.lastHealthCheck = new Date();

    this.servers.set(serverId, server);
  }

  private startHealthChecks(): void {
    setInterval(() => {
      for (const serverId of this.servers.keys()) {
        this.performHealthCheck(serverId);
      }
    }, this.config.healthCheckInterval);
  }

  async getStats(): Promise<{
    totalServers: number;
    onlineServers: number;
    totalRequests: number;
    averageLoad: number;
    servers: Server[];
  }> {
    const servers = Array.from(this.servers.values());
    const online = servers.filter((s) => s.status === 'online');
    const avgLoad =
      servers.length > 0 ? servers.reduce((sum, s) => sum + s.currentLoad, 0) / servers.length : 0;

    return {
      totalServers: servers.length,
      onlineServers: online.length,
      totalRequests: this.requestCount,
      averageLoad: Math.round(avgLoad * 10) / 10,
      servers,
    };
  }

  private initializeServers(): void {
    for (let i = 1; i <= 3; i++) {
      const server: Server = {
        id: `server-${i}`,
        name: `App Server ${i}`,
        host: `server${i}.artisan.com`,
        port: 8080,
        status: 'online',
        currentLoad: 0,
        maxCapacity: 1000,
        healthScore: 100,
        lastHealthCheck: new Date(),
      };
      this.servers.set(server.id, server);
    }
  }
}

export const loadBalancerService = new LoadBalancerService();
