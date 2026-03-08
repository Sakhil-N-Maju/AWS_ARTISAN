/**
 * Database Optimization Service
 *
 * Query optimization and database performance
 */

export interface QueryPerformance {
  id: string;
  query: string;
  executionTime: number;
  rowsAffected: number;
  timestamp: Date;
  optimized: boolean;
}

export interface IndexRecommendation {
  id: string;
  table: string;
  columns: string[];
  estimatedImprovement: number; // percentage
  priority: 'low' | 'medium' | 'high';
}

export interface DatabaseConnection {
  id: string;
  poolSize: number;
  activeConnections: number;
  idleConnections: number;
  waitingQueries: number;
}

export class DatabaseOptimizationService {
  private queryLog: Map<string, QueryPerformance> = new Map();
  private indexRecommendations: Map<string, IndexRecommendation> = new Map();
  private connections: Map<string, DatabaseConnection> = new Map();

  constructor() {
    this.initializeConnection();
  }

  async logQuery(data: {
    query: string;
    executionTime: number;
    rowsAffected: number;
  }): Promise<QueryPerformance> {
    const perf: QueryPerformance = {
      id: `query-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      query: data.query,
      executionTime: data.executionTime,
      rowsAffected: data.rowsAffected,
      timestamp: new Date(),
      optimized: data.executionTime < 100, // Consider optimized if < 100ms
    };

    this.queryLog.set(perf.id, perf);

    // Analyze for slow queries
    if (data.executionTime > 1000) {
      await this.analyzeSlowQuery(perf);
    }

    return perf;
  }

  private async analyzeSlowQuery(query: QueryPerformance): Promise<void> {
    // Simulate index recommendation
    if (query.query.includes('WHERE') && !query.query.includes('INDEX')) {
      const recommendation: IndexRecommendation = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        table: this.extractTableName(query.query),
        columns: ['id', 'created_at'],
        estimatedImprovement: Math.random() * 50 + 30,
        priority: query.executionTime > 5000 ? 'high' : 'medium',
      };
      this.indexRecommendations.set(recommendation.id, recommendation);
    }
  }

  private extractTableName(query: string): string {
    const match = query.match(/FROM\s+(\w+)/i);
    return match ? match[1] : 'unknown';
  }

  async getSlowQueries(threshold: number = 1000): Promise<QueryPerformance[]> {
    return Array.from(this.queryLog.values())
      .filter((q) => q.executionTime > threshold)
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, 20);
  }

  async getIndexRecommendations(): Promise<IndexRecommendation[]> {
    return Array.from(this.indexRecommendations.values()).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  async getConnectionStats(): Promise<DatabaseConnection> {
    return this.connections.get('main')!;
  }

  async getStats(): Promise<{
    totalQueries: number;
    averageExecutionTime: number;
    slowQueries: number;
    optimizationRate: number;
    indexRecommendations: number;
  }> {
    const queries = Array.from(this.queryLog.values());
    const avgTime =
      queries.length > 0
        ? queries.reduce((sum, q) => sum + q.executionTime, 0) / queries.length
        : 0;

    const slow = queries.filter((q) => q.executionTime > 1000).length;
    const optimized = queries.filter((q) => q.optimized).length;
    const optRate = queries.length > 0 ? (optimized / queries.length) * 100 : 0;

    return {
      totalQueries: queries.length,
      averageExecutionTime: Math.round(avgTime * 10) / 10,
      slowQueries: slow,
      optimizationRate: Math.round(optRate * 100) / 100,
      indexRecommendations: this.indexRecommendations.size,
    };
  }

  private initializeConnection(): void {
    this.connections.set('main', {
      id: 'main',
      poolSize: 20,
      activeConnections: 5,
      idleConnections: 15,
      waitingQueries: 0,
    });
  }
}

export const databaseOptimizationService = new DatabaseOptimizationService();
