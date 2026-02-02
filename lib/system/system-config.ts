/**
 * CONFIGURATION SYSTÈME OPTIMISÉ - MCP + AGENTS
 * Paramètres et monitoring pour système robuste
 */

// ============================================================================
// CONFIGURATION GLOBALE
// ============================================================================

export const SYSTEM_CONFIG = {
  // Configuration MCP
  mcp: {
    version: '1.0',
    timeout: 30000, // 30 secondes
    retryAttempts: 3,
    retryDelay: 1000,
    
    // Rate limiting par opération
    rateLimits: {
      search: { requestsPerMinute: 60, burst: 10 },
      analyze: { requestsPerMinute: 30, burst: 5 },
      synthesize: { requestsPerMinute: 15, burst: 3 },
      publish: { requestsPerMinute: 10, burst: 2 }
    },
    
    // Qualité minimale par type
    qualityThresholds: {
      academic: 80,
      institutional: 70,
      business: 60,
      patents: 65,
      data: 75
    }
  },

  // Configuration Agents
  agents: {
    // Timeout par agent (secondes)
    timeouts: {
      'AcademicSearchAgent': 30,
      'CrossDomainAnalysisAgent': 60,
      'StrategicSynthesisAgent': 120,
      'UniversalSearchAgent': 45,
      'SignalDetectionAgent': 90
    },
    
    // Priorités de processing
    priorities: {
      critical: 1,
      high: 2,
      normal: 3,
      low: 4
    },
    
    // Ressources par agent
    resources: {
      maxMemory: '512MB',
      maxCPU: '50%',
      maxConcurrent: 5
    }
  },

  // Configuration Orchestrateur
  orchestrator: {
    // Queue management
    maxQueueSize: 1000,
    batchSize: 10,
    processingInterval: 1000, // ms
    
    // Health monitoring
    healthCheckInterval: 30000, // ms
    healthTimeout: 5000, // ms
    
    // Performance monitoring
    metricsInterval: 60000, // ms
    alertThresholds: {
      queueSize: 500,
      responseTime: 10000, // ms
      errorRate: 0.1, // 10%
      memoryUsage: 0.8 // 80%
    }
  },

  // Configuration Base de données
  database: {
    // Connection pooling
    poolSize: 10,
    connectionTimeout: 5000,
    queryTimeout: 30000,
    
    // Retry strategy
    retryAttempts: 3,
    retryDelay: 1000,
    
    // Monitoring
    slowQueryThreshold: 1000, // ms
    maxConnections: 20
  },

  // Configuration Sources variées
  sources: {
    // Poids par catégorie pour scoring
    categoryWeights: {
      academic: 0.4,
      institutional: 0.25,
      business: 0.2,
      patents: 0.1,
      data: 0.05
    },
    
    // Fréquence de monitoring
    monitoringIntervals: {
      academic: 3600000, // 1 heure
      institutional: 1800000, // 30 minutes
      business: 900000, // 15 minutes
      patents: 7200000, // 2 heures
      data: 3600000 // 1 heure
    },
    
    // Quality scoring
    qualityFactors: {
      citationCount: 0.3,
      authorReputation: 0.2,
      publisherImpact: 0.2,
      recency: 0.15,
      relevance: 0.15
    }
  }
};

// ============================================================================
// MÉTRIQUES ET MONITORING
// ============================================================================

export class SystemMonitor {
  constructor(config = SYSTEM_CONFIG) {
    this.config = config;
    this.metrics = new Map();
    this.alerts = [];
    this.isMonitoring = false;
  }

  /**
   * Démarrage du monitoring
   */
  async start() {
    console.log('📊 Démarrage du monitoring système');
    this.isMonitoring = true;
    
    // Monitoring des métriques
    this.startMetricsCollection();
    
    // Monitoring des alertes
    this.startAlertMonitoring();
    
    // Monitoring de santé
    this.startHealthMonitoring();
    
    console.log('✅ Monitoring système démarré');
  }

  /**
   * Collecte des métriques système
   */
  startMetricsCollection() {
    setInterval(async () => {
      if (!this.isMonitoring) return;
      
      const metrics = await this.collectMetrics();
      this.metrics.set(Date.now(), metrics);
      
      // Nettoyage des anciennes métriques (garde 24h)
      this.cleanupOldMetrics();
      
    }, this.config.orchestrator.metricsInterval);
  }

  async collectMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      timestamp: Date.now(),
      memory: {
        rss: memUsage.rss,
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        usagePercent: (memUsage.heapUsed / memUsage.heapTotal) * 100
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
        usagePercent: this.calculateCPUUsage(cpuUsage)
      },
      performance: {
        uptime: process.uptime(),
        requestCount: this.getRequestCount(),
        errorCount: this.getErrorCount(),
        avgResponseTime: this.getAvgResponseTime()
      }
    };
  }

  /**
   * Monitoring des alertes
   */
  startAlertMonitoring() {
    setInterval(async () => {
      if (!this.isMonitoring) return;
      
      const alerts = await this.checkAlerts();
      if (alerts.length > 0) {
        await this.handleAlerts(alerts);
      }
      
    }, this.config.orchestrator.healthCheckInterval);
  }

  async checkAlerts() {
    const alerts = [];
    const currentMetrics = this.getLatestMetrics();
    
    if (!currentMetrics) return alerts;
    
    // Alertes mémoire
    if (currentMetrics.memory.usagePercent > this.config.orchestrator.alertThresholds.memoryUsage) {
      alerts.push({
        type: 'MEMORY_HIGH',
        severity: 'warning',
        message: `Memory usage at ${currentMetrics.memory.usagePercent.toFixed(1)}%`,
        value: currentMetrics.memory.usagePercent,
        threshold: this.config.orchestrator.alertThresholds.memoryUsage
      });
    }
    
    // Alertes performance
    if (currentMetrics.performance.avgResponseTime > this.config.orchestrator.alertThresholds.responseTime) {
      alerts.push({
        type: 'RESPONSE_TIME_HIGH',
        severity: 'warning',
        message: `Average response time at ${currentMetrics.performance.avgResponseTime}ms`,
        value: currentMetrics.performance.avgResponseTime,
        threshold: this.config.orchestrator.alertThresholds.responseTime
      });
    }
    
    // Alertes taux d'erreur
    const errorRate = currentMetrics.performance.errorCount / Math.max(currentMetrics.performance.requestCount, 1);
    if (errorRate > this.config.orchestrator.alertThresholds.errorRate) {
      alerts.push({
        type: 'ERROR_RATE_HIGH',
        severity: 'critical',
        message: `Error rate at ${(errorRate * 100).toFixed(1)}%`,
        value: errorRate,
        threshold: this.config.orchestrator.alertThresholds.errorRate
      });
    }
    
    return alerts;
  }

  async handleAlerts(alerts) {
    for (const alert of alerts) {
      console.warn(`🚨 ALERT [${alert.type}]: ${alert.message}`);
      
      // Stockage de l'alerte
      this.alerts.push({
        ...alert,
        timestamp: Date.now(),
        id: `alert-${Date.now()}-${Math.random()}`
      });
      
      // Actions automatiques selon le type d'alerte
      await this.triggerAlertAction(alert);
    }
  }

  async triggerAlertAction(alert) {
    switch (alert.type) {
      case 'MEMORY_HIGH':
        // Force garbage collection
        if (global.gc) {
          global.gc();
        }
        break;
        
      case 'RESPONSE_TIME_HIGH':
        // Réduction du batch size
        // this.adjustBatchSize(0.8);
        break;
        
      case 'ERROR_RATE_HIGH':
        // Mode dégradé
        // this.enableDegradedMode();
        break;
    }
  }

  /**
   * Monitoring de santé des composants
   */
  startHealthMonitoring() {
    setInterval(async () => {
      if (!this.isMonitoring) return;
      
      const health = await this.checkSystemHealth();
      await this.logHealthStatus(health);
      
    }, this.config.orchestrator.healthCheckInterval);
  }

  async checkSystemHealth() {
    const checks = {
      database: await this.checkDatabaseHealth(),
      memory: this.checkMemoryHealth(),
      cpu: this.checkCPUHealth(),
      disk: await this.checkDiskHealth()
    };
    
    const overallHealth = Object.values(checks).every(status => status === 'healthy') ? 'healthy' : 'degraded';
    
    return {
      overall: overallHealth,
      timestamp: Date.now(),
      components: checks
    };
  }

  async checkDatabaseHealth() {
    try {
      // Test de connexion DB
      const start = Date.now();
      await this.executeDatabaseQuery('SELECT 1');
      const latency = Date.now() - start;
      
      return latency < this.config.database.slowQueryThreshold ? 'healthy' : 'slow';
    } catch (error) {
      return 'unhealthy';
    }
  }

  checkMemoryHealth() {
    const memUsage = process.memoryUsage();
    const usagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    return usagePercent < 80 ? 'healthy' : usagePercent < 95 ? 'warning' : 'critical';
  }

  checkCPUHealth() {
    const cpuUsage = process.cpuUsage();
    const usagePercent = this.calculateCPUUsage(cpuUsage);
    
    return usagePercent < 70 ? 'healthy' : usagePercent < 90 ? 'warning' : 'critical';
  }

  async checkDiskHealth() {
    // Vérification espace disque (simplifié)
    return 'healthy'; // Implémentation à ajouter
  }

  // Méthodes utilitaires
  calculateCPUUsage(cpuUsage) {
    // Calcul simplifié de l'usage CPU
    return (cpuUsage.user + cpuUsage.system) / (process.uptime() * 1000000) * 100;
  }

  getRequestCount() {
    // À implémenter avec compteur réel
    return Math.floor(Math.random() * 1000);
  }

  getErrorCount() {
    // À implémenter avec compteur réel
    return Math.floor(Math.random() * 50);
  }

  getAvgResponseTime() {
    // À implémenter avec mesures réelles
    return Math.random() * 5000;
  }

  getLatestMetrics() {
    const timestamps = Array.from(this.metrics.keys()).sort((a, b) => b - a);
    return timestamps.length > 0 ? this.metrics.get(timestamps[0]) : null;
  }

  cleanupOldMetrics() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24h
    const oldKeys = Array.from(this.metrics.keys()).filter(key => key < cutoff);
    oldKeys.forEach(key => this.metrics.delete(key));
  }

  async logHealthStatus(health) {
    console.log(`🏥 System Health: ${health.overall.toUpperCase()}`);
    
    // Log détaillé par composant
    Object.entries(health.components).forEach(([component, status]) => {
      const icon = status === 'healthy' ? '✅' : status === 'warning' ? '⚠️' : '❌';
      console.log(`  ${icon} ${component}: ${status}`);
    });
  }

  /**
   * Arrêt du monitoring
   */
  async stop() {
    console.log('📊 Arrêt du monitoring système');
    this.isMonitoring = false;
    console.log('✅ Monitoring système arrêté');
  }

  /**
   * Rapport de performance
   */
  generatePerformanceReport() {
    const metrics = Array.from(this.metrics.values());
    
    if (metrics.length === 0) {
      return { error: 'No metrics available' };
    }
    
    const avgMemory = metrics.reduce((sum, m) => sum + m.memory.usagePercent, 0) / metrics.length;
    const avgCPU = metrics.reduce((sum, m) => sum + m.cpu.usagePercent, 0) / metrics.length;
    const maxResponseTime = Math.max(...metrics.map(m => m.performance.avgResponseTime));
    const totalErrors = metrics.reduce((sum, m) => sum + m.performance.errorCount, 0);
    const totalRequests = metrics.reduce((sum, m) => sum + m.performance.requestCount, 0);
    
    return {
      period: {
        start: new Date(Array.from(this.metrics.keys())[0]),
        end: new Date(Array.from(this.metrics.keys()).pop()),
        dataPoints: metrics.length
      },
      performance: {
        avgMemoryUsage: avgMemory.toFixed(1),
        avgCPUUsage: avgCPU.toFixed(1),
        maxResponseTime: maxResponseTime.toFixed(0),
        totalRequests,
        totalErrors,
        errorRate: ((totalErrors / totalRequests) * 100).toFixed(2)
      },
      alerts: {
        total: this.alerts.length,
        byType: this.groupAlertsByType(),
        recent: this.alerts.slice(-10)
      }
    };
  }

  groupAlertsByType() {
    const grouped = {};
    this.alerts.forEach(alert => {
      if (!grouped[alert.type]) {
        grouped[alert.type] = 0;
      }
      grouped[alert.type]++;
    });
    return grouped;
  }
}

// ============================================================================
// UTILITAIRE DE CONFIGURATION
// ============================================================================

export class ConfigManager {
  static validateConfig(config) {
    const errors = [];
    
    // Validation MCP
    if (!config.mcp) {
      errors.push('MCP configuration is required');
    }
    
    // Validation agents
    if (!config.agents) {
      errors.push('Agents configuration is required');
    }
    
    // Validation thresholds
    if (config.orchestrator?.alertThresholds) {
      const thresholds = config.orchestrator.alertThresholds;
      if (thresholds.errorRate < 0 || thresholds.errorRate > 1) {
        errors.push('Error rate threshold must be between 0 and 1');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  static mergeConfigs(baseConfig, overrideConfig) {
    return {
      ...baseConfig,
      ...overrideConfig,
      mcp: { ...baseConfig.mcp, ...overrideConfig.mcp },
      agents: { ...baseConfig.agents, ...overrideConfig.agents },
      orchestrator: { ...baseConfig.orchestrator, ...overrideConfig.orchestrator },
      database: { ...baseConfig.database, ...overrideConfig.database },
      sources: { ...baseConfig.sources, ...overrideConfig.sources }
    };
  }

  static loadEnvironmentConfig() {
    return {
      mcp: {
        timeout: parseInt(process.env.MCP_TIMEOUT) || 30000,
        retryAttempts: parseInt(process.env.MCP_RETRY_ATTEMPTS) || 3
      },
      database: {
        poolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000
      },
      orchestrator: {
        maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE) || 1000
      }
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default SYSTEM_CONFIG;
