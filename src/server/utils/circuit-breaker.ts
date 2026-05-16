import { logger } from '../logger.js';

export enum State {
  CLOSED,
  OPEN,
  HALF_OPEN
}

export class CircuitBreaker {
  private state: State = State.CLOSED;
  private failureCount: number = 0;
  private lastErrorTime: number = 0;
  
  constructor(
    private failureThreshold: number = 3,
    private resetTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === State.OPEN) {
      if (Date.now() - this.lastErrorTime > this.resetTimeout) {
        this.state = State.HALF_OPEN;
        logger.warn(`[CIRCUIT BREAKER] Transitioning to HALF_OPEN for recovery test.`);
      } else {
        throw new Error("Circuit is OPEN. Request blocked for system stability.");
      }
    }

    try {
      const result = await fn();
      if (this.state === State.HALF_OPEN) {
        this.reset();
        logger.info(`[CIRCUIT BREAKER] Success in HALF_OPEN. Circuit CLOSED.`);
      }
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastErrorTime = Date.now();

      if (this.state === State.HALF_OPEN || this.failureCount >= this.failureThreshold) {
        this.state = State.OPEN;
        logger.error(`[CIRCUIT BREAKER] State flipped to OPEN. Failures: ${this.failureCount}`);
      }
      throw error;
    }
  }

  private reset() {
    this.state = State.CLOSED;
    this.failureCount = 0;
  }

  getState() {
    return State[this.state];
  }
}
