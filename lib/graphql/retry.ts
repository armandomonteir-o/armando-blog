// Retry for reads only. A WordPress call can fail for a few seconds (a network blip, a 5xx while
// the host restarts) and one such failure used to take a whole `next build` down (#68).
// This is NOT a fallback: nothing is invented, the real request is simply tried again.

const TRANSIENT_CODES = new Set([
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "ENOTFOUND",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
]);

interface MaybeRequestError {
  response?: { status?: number };
  cause?: { code?: string };
  code?: string;
}

// Only what repeating can fix: no connection, or a server error. A 4xx or a GraphQL error
// (response.status 200 with `errors`) will answer the same way every time.
export function isTransientError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as MaybeRequestError;
  if (e.response) return (e.response.status ?? 0) >= 500;
  const code = e.cause?.code ?? e.code;
  return code !== undefined && TRANSIENT_CODES.has(code);
}

interface RetryOptions {
  attempts?: number;
  baseDelayMs?: number;
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { attempts = 3, baseDelayMs = 500, sleep = defaultSleep } = options;
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= attempts || !isTransientError(error)) throw error;
      const wait = baseDelayMs * 2 ** (attempt - 1);
      console.warn(`[wp] attempt ${attempt}/${attempts} failed, retrying in ${wait}ms:`, error);
      await sleep(wait);
    }
  }
}
