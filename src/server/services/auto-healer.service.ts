import { logger } from '../logger.js';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export class AutoHealerService {
  private fixInProgress = false;

  async handleCriticalError(error: any) {
    if (this.fixInProgress) return;
    
    const errorMessage = error.message || String(error);
    logger.info(`[AUTO-HEALER] Analyzing critical error: ${errorMessage.substring(0, 50)}...`);

    if (errorMessage.includes('ENOENT') && errorMessage.includes('node_modules')) {
      await this.runFix('Missing dependencies detected. Running npm install...', 'npm install');
    } else if (errorMessage.includes('EADDRINUSE')) {
        logger.warn('[AUTO-HEALER] Port conflict detected. This is usually handled by the port seeker.');
    } else if (errorMessage.includes('corrupted') || errorMessage.includes('Unexpected token')) {
        // Potential JSON corruption in config files
        this.attemptConfigHeal();
    }
  }

  private async runFix(reason: string, command: string) {
    this.fixInProgress = true;
    logger.warn(`[AUTO-HEALER] ${reason}`);
    
    return new Promise((resolve) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          logger.error(`[AUTO-HEALER] Fix failed: ${stderr || err.message}`);
        } else {
          logger.info(`[AUTO-HEALER] Fix applied successfully. Output: ${stdout.substring(0, 100)}`);
        }
        this.fixInProgress = false;
        resolve(true);
      });
    });
  }

  private attemptConfigHeal() {
    logger.info('[AUTO-HEALER] Attempting to scan for corrupted config files...');
    // Logica para encontrar JSONs malformados em /servers ou /data e restaurar backups
  }
}

export const autoHealerService = new AutoHealerService();
