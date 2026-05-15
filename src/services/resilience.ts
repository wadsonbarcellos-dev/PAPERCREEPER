// src/services/resilience.ts

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold = 3;
  private readonly resetTimeout = 10000;

  async execute<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        return fallback;
      }
    }

    try {
      const result = await fn();
      this.failures = 0;
      this.state = 'CLOSED';
      return result;
    } catch (err) {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
      }
      console.error("Circuit Breaker triggered:", err);
      return fallback;
    }
  }
}

const circuitBreaker = new CircuitBreaker();

export async function withResilience<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  return await circuitBreaker.execute(fn, fallback);
}
