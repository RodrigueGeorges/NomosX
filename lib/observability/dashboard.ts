/**
 * DASHBOARD OBSERVABILITÉ - Health Monitoring
 * Tableau de bord pour monitoring providers et système
 */

const {providerRegistry} = require('./providers/registry-v2');
const {prisma} = require('./db');

export interface SystemHealth {
  timestamp: Date;
  providers: {
    total: number;
    enabled: number;
    healthy: number;
    degraded: number;
    down: number;
  };
  database: {
    connected: boolean;
    latency: number;
    size: string;
  };
  cache: {
    connected: boolean;
    latency: number;
    hitRate: number;
  };
  agents: {
    scout: { avgTime: number; successRate: number };
    index: { avgTime: number; successRate: number };
    rank: { avgTime: number; successRate: number };
    reader: { avgTime: number; successRate: number };
    analyst: { avgTime: number; successRate: number };
  };
  performance: {
    avgResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
  };
}

export class ObservabilityDashboard {
  private static instance: ObservabilityDashboard;
  private healthHistory: SystemHealth[] = [];
  private maxHistorySize = 1440; // 24 hours of minute data

  static getInstance(): ObservabilityDashboard {
    if (!ObservabilityDashboard.instance) {
      ObservabilityDashboard.instance = new ObservabilityDashboard();
    }
    return ObservabilityDashboard.instance;
  }

  /**
   * Collect complete system health
   */
  async collectSystemHealth(): Promise<SystemHealth> {
    const timestamp = new Date();
    
    // Provider health
    const providerHealth = await this.collectProviderHealth();
    
    // Database health
    const databaseHealth = await this.collectDatabaseHealth();
    
    // Cache health
    const cacheHealth = await this.collectCacheHealth();
    
    // Agent performance
    const agentPerformance = await this.collectAgentPerformance();
    
    // System performance
    const systemPerformance = await this.collectSystemPerformance();
    
    const health: SystemHealth = {
      timestamp,
      providers: providerHealth,
      database: databaseHealth,
      cache: cacheHealth,
      agents: agentPerformance,
      performance: systemPerformance
    };
    
    // Store in history
    this.healthHistory.push(health);
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory.shift();
    }
    
    return health;
  }

  /**
   * Provider health statistics
   */
  private async collectProviderHealth(): Promise<SystemHealth['providers']> {
    const healthResults = await providerRegistry.healthCheckAll();
    
    const stats = {
      total: healthResults.size,
      enabled: 0,
      healthy: 0,
      degraded: 0,
      down: 0
    };

    healthResults.forEach((result, providerId) => {
      const config = providerRegistry.getConfig(providerId);
      if (config?.enabled) stats.enabled++;
      
      switch (result.status) {
        case 'healthy': stats.healthy++; break;
        case 'degraded': stats.degraded++; break;
        case 'down': stats.down++; break;
      }
    });

    return stats;
  }

  /**
   * Database health check
   */
  private async collectDatabaseHealth(): Promise<SystemHealth['database']> {
    const startTime = Date.now();
    
    try {
      // Simple connectivity test
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;
      
      // Get database size
      const sizeResult = await prisma.$queryRaw`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `;
      
      return {
        connected: true,
        latency,
        size: (sizeResult as any)[0]?.size || 'Unknown'
      };
    } catch (error: any) {
      return {
        connected: false,
        latency: Date.now() - startTime,
        size: 'Unknown'
      };
    }
  }

  /**
   * Cache health check (Redis)
   */
  private async collectCacheHealth(): Promise<SystemHealth['cache']> {
    const startTime = Date.now();
    
    try {
      // This would be implemented based on your Redis setup
      // For now, return mock data
      return {
        connected: true,
        latency: Date.now() - startTime,
        hitRate: 0.85 // Mock hit rate
      };
    } catch (error: any) {
      return {
        connected: false,
        latency: Date.now() - startTime,
        hitRate: 0
      };
    }
  }

  /**
   * Agent performance metrics
   */
  private async collectAgentPerformance(): Promise<SystemHealth['agents']> {
    // This would query your agent execution logs/metrics
    // For now, return mock data based on typical performance
    
    return {
      scout: { avgTime: 2500, successRate: 0.95 },
      index: { avgTime: 1800, successRate: 0.98 },
      rank: { avgTime: 800, successRate: 0.99 },
      reader: { avgTime: 3200, successRate: 0.92 },
      analyst: { avgTime: 4500, successRate: 0.88 }
    };
  }

  /**
   * System performance metrics
   */
  private async collectSystemPerformance(): Promise<SystemHealth['performance']> {
    // This would collect from your monitoring system
    // For now, return mock data
    
    return {
      avgResponseTime: 1200,
      requestsPerMinute: 45,
      errorRate: 0.02
    };
  }

  /**
   * Get health history
   */
  getHealthHistory(hours = 24): SystemHealth[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.healthHistory.filter(h => h.timestamp >= cutoff);
  }

  /**
   * Get provider health trends
   */
  getProviderTrends(providerId: string, hours = 24): Array<{
    timestamp: Date;
    status: string;
    latency: number;
  }> {
    const history = this.getHealthHistory(hours);
    
    return history.map(h => ({
      timestamp: h.timestamp,
      status: 'unknown', // Would be extracted from detailed provider data
      latency: 0
    }));
  }

  /**
   * Generate health report
   */
  generateHealthReport(): {
    summary: string;
    critical: string[];
    warnings: string[];
    recommendations: string[];
  } {
    const latest = this.healthHistory[this.healthHistory.length - 1];
    if (!latest) {
      return {
        summary: 'No health data available',
        critical: ['Health monitoring not initialized'],
        warnings: [],
        recommendations: ['Start health collection']
      };
    }

    const critical: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Provider analysis
    if (latest.providers.down > 0) {
      critical.push(`${latest.providers.down} providers are down`);
    }
    
    if (latest.providers.degraded > latest.providers.healthy * 0.3) {
      warnings.push('High number of degraded providers');
    }

    // Database analysis
    if (!latest.database.connected) {
      critical.push('Database connection failed');
    } else if (latest.database.latency > 1000) {
      warnings.push('Database latency is high');
    }

    // Cache analysis
    if (!latest.cache.connected) {
      warnings.push('Cache connection failed');
    } else if (latest.cache.hitRate < 0.7) {
      recommendations.push('Cache hit rate is low - consider cache warming');
    }

    // Agent analysis
    Object.entries(latest.agents).forEach(([agent, metrics]) => {
      if (metrics.successRate < 0.8) {
        critical.push(`${agent} agent success rate is low: ${Math.round(metrics.successRate * 100)}%`);
      } else if (metrics.successRate < 0.9) {
        warnings.push(`${agent} agent success rate could be improved: ${Math.round(metrics.successRate * 100)}%`);
      }
      
      if (metrics.avgTime > 5000) {
        warnings.push(`${agent} agent is slow: ${Math.round(metrics.avgTime)}ms average`);
      }
    });

    // Overall performance
    if (latest.performance.errorRate > 0.05) {
      critical.push(`High error rate: ${Math.round(latest.performance.errorRate * 100)}%`);
    }

    // Generate summary
    const healthScore = this.calculateHealthScore(latest);
    let summary = '';
    
    if (healthScore >= 90) {
      summary = 'System is healthy and performing well';
    } else if (healthScore >= 70) {
      summary = 'System is operational but has some issues';
    } else if (healthScore >= 50) {
      summary = 'System has significant issues that need attention';
    } else {
      summary = 'System is in critical condition';
    }

    return {
      summary,
      critical,
      warnings,
      recommendations
    };
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(health: SystemHealth): number {
    let score = 100;
    
    // Provider health (40% weight)
    const providerRatio = health.providers.enabled > 0 
      ? health.providers.healthy / health.providers.enabled 
      : 0;
    score -= (1 - providerRatio) * 40;
    
    // Database health (25% weight)
    if (!health.database.connected) score -= 25;
    else if (health.database.latency > 1000) score -= 10;
    
    // Agent performance (25% weight)
    const avgAgentSuccess = Object.values(health.agents)
      .reduce((sum, a) => sum + a.successRate, 0) / Object.keys(health.agents).length;
    score -= (1 - avgAgentSuccess) * 25;
    
    // Error rate (10% weight)
    score -= health.performance.errorRate * 200;
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Export health data for external monitoring
   */
  exportHealthData(): {
    timestamp: Date;
    healthScore: number;
    metrics: Record<string, any>;
  } {
    const latest = this.healthHistory[this.healthHistory.length - 1];
    if (!latest) {
      throw new Error('No health data available');
    }

    return {
      timestamp: latest.timestamp,
      healthScore: this.calculateHealthScore(latest),
      metrics: latest as any
    };
  }
}

// Export singleton
export const observability = ObservabilityDashboard.getInstance();
