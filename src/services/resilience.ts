export async function withResilience<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("Resilience caught error:", err);
    return fallback;
  }
}
