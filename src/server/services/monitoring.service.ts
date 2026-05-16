import { logger } from '../logger.js';
import os from 'os';

interface HealthSnapshot {
  timestamp: number;
  cpu: number;
  memory: number;
  loadAvg: number[];
  errorCount: number;
}

export class MonitoringService {
  private history: HealthSnapshot[] = [];
  private readonly MAX_HISTORY = 60;

  constructor() {
    setInterval(() => this.recordSnapshot(), 60000);
  }

  private recordSnapshot() {
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    const loadAvg = os.loadavg();
    const cpuUsage = (loadAvg[0] * 100) / os.cpus().length; // Porcentagem real de uso baseada no load

    const snapshot: HealthSnapshot = {
      timestamp: Date.now(),
      cpu: cpuUsage,
      memory,
      loadAvg,
      errorCount: 0
    };

    this.history.push(snapshot);
    if (this.history.length > this.MAX_HISTORY) this.history.shift();

    this.analyzeTrends();
  }

  private analyzeTrends() {
    if (this.history.length < 5) return;
    const recent = this.history.slice(-5);
    const memoryDiff = recent[recent.length - 1].memory - recent[0].memory;

    if (memoryDiff > 50) {
      logger.warn(`[MONITOR] Alerta de vazamento de memória: +${memoryDiff.toFixed(2)}MB em 5min`);
    }
  }

  async optimizeSystem() {
    logger.info('[OPTIMIZER] Iniciando ciclo de otimização agressiva...');
    const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
    
    // Sugere ao V8 realizar Garbage Collection (se habilitado)
    if (global.gc) {
      global.gc();
    }

    const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
    const saved = memBefore - memAfter;

    logger.info(`[OPTIMIZER] Otimização concluída. Memória liberada: ${saved.toFixed(2)}MB`);
    return {
      success: true,
      memBefore,
      memAfter,
      saved,
      message: saved > 0 ? `Liberados ${saved.toFixed(2)}MB de RAM.` : "Sistema já está em estado ótimo."
    };
  }

  getHealthStatus() {
    const current = this.history[this.history.length - 1] || { cpu: 0, memory: 0, loadAvg: [0,0,0] };
    return {
      status: current.memory > 2048 ? 'CRITICAL' : (current.memory > 1024 ? 'DEGRADED' : 'OPERATIONAL'),
      currentMetrics: {
          ...current,
          cpu: current.cpu.toFixed(1) + "%",
          memory: current.memory.toFixed(1) + "MB"
      },
      trend: this.history.length > 2 ? (this.history[this.history.length - 1].memory - this.history[0].memory) : 0
    };
  }
}

export const monitoringService = new MonitoringService();
