const DEFAULT_RATE_LIMIT_MESSAGE =
  "Too many submissions came in from this connection. Please try again shortly.";

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; message: string };

export type AttemptStore = {
  loadAttempts: (key: string) => Promise<number[]>;
  saveAttempts: (key: string, attempts: number[], ttlSeconds: number) => Promise<void>;
};

const attemptLocks = new Map<string, Promise<void>>();

export function pruneAttempts(now: number, attempts: number[], windowMs: number) {
  return attempts.filter((timestamp) => now - timestamp < windowMs);
}

async function withAttemptLock<T>(key: string, task: () => Promise<T>) {
  const previous = attemptLocks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const tail = previous.then(() => current);
  attemptLocks.set(key, tail);

  await previous;

  try {
    return await task();
  } finally {
    release();

    if (attemptLocks.get(key) === tail) {
      attemptLocks.delete(key);
    }
  }
}

export async function enforceSlidingWindowRateLimit({
  key,
  store,
  now = Date.now(),
  windowMs,
  limit,
  message = DEFAULT_RATE_LIMIT_MESSAGE,
}: {
  key: string;
  store: AttemptStore;
  now?: number;
  windowMs: number;
  limit: number;
  message?: string;
}): Promise<RateLimitResult> {
  return withAttemptLock(key, async () => {
    const recentAttempts = pruneAttempts(now, await store.loadAttempts(key), windowMs);
    const ttlSeconds = Math.ceil(windowMs / 1000);

    if (recentAttempts.length >= limit) {
      await store.saveAttempts(key, recentAttempts, ttlSeconds);

      return {
        allowed: false,
        message,
      };
    }

    recentAttempts.push(now);
    await store.saveAttempts(key, recentAttempts, ttlSeconds);

    return { allowed: true };
  });
}

export { DEFAULT_RATE_LIMIT_MESSAGE };
