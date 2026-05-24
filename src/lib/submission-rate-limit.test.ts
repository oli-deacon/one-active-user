import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's test runner imports the TypeScript module directly.
import { enforceSlidingWindowRateLimit, pruneAttempts } from "./submission-rate-limit.ts";

test("pruneAttempts keeps only timestamps inside the sliding window", () => {
  const now = 1_000;
  const attempts = [100, 399, 400, 700, 999];

  assert.deepEqual(pruneAttempts(now, attempts, 600), [700, 999]);
});

test("enforceSlidingWindowRateLimit blocks once the limit is reached", async () => {
  const storeData = new Map<string, number[]>();

  const store = {
    async loadAttempts(key: string) {
      return storeData.get(key) ?? [];
    },
    async saveAttempts(key: string, attempts: number[]) {
      storeData.set(key, attempts);
    },
  };

  const first = await enforceSlidingWindowRateLimit({
    key: "ip-1",
    limit: 2,
    store,
    windowMs: 1_000,
    now: 100,
  });
  const second = await enforceSlidingWindowRateLimit({
    key: "ip-1",
    limit: 2,
    store,
    windowMs: 1_000,
    now: 200,
  });
  const third = await enforceSlidingWindowRateLimit({
    key: "ip-1",
    limit: 2,
    store,
    windowMs: 1_000,
    now: 300,
  });

  assert.deepEqual(first, { allowed: true });
  assert.deepEqual(second, { allowed: true });
  assert.equal(third.allowed, false);
  assert.equal(storeData.get("ip-1")?.length, 2);
});

test("enforceSlidingWindowRateLimit serializes concurrent attempts for the same key", async () => {
  const storeData = new Map<string, number[]>();

  const store = {
    async loadAttempts(key: string) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return storeData.get(key) ?? [];
    },
    async saveAttempts(key: string, attempts: number[]) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      storeData.set(key, attempts);
    },
  };

  const [first, second] = await Promise.all([
    enforceSlidingWindowRateLimit({
      key: "ip-2",
      limit: 1,
      store,
      windowMs: 1_000,
      now: 100,
    }),
    enforceSlidingWindowRateLimit({
      key: "ip-2",
      limit: 1,
      store,
      windowMs: 1_000,
      now: 100,
    }),
  ]);

  assert.deepEqual(first, { allowed: true });
  assert.equal(second.allowed, false);
  assert.deepEqual(storeData.get("ip-2"), [100]);
});
