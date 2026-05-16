import { logger } from '../logger.js';
import crypto from 'crypto';

export class WebhookService {
  private secret: string;

  constructor() {
    this.secret = process.env.WEBHOOK_SECRET || crypto.randomBytes(32).toString('hex');
    logger.info(`[WEBHOOK] Secret initialized. Use this to sign payloads if needed.`);
  }

  verifySignature(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac('sha256', this.secret);
    const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');
    
    if (checksum.length !== digest.length) return false;
    return crypto.timingSafeEqual(digest, checksum);
  }

  async processExternalEvent(source: string, event: string, data: any) {
    logger.info(`[WEBHOOK] Event received from ${source}: ${event}`);
    
    // Logic to bridge with AI or Server Manager
    if (event === 'github.push') {
       logger.info(`[WEBHOOK] GitHub push detected. Auto-pulling changes...`);
       // exec('git pull && npm install && npm run build');
    }
  }
}

export const webhookService = new WebhookService();
