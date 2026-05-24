import crypto from "node:crypto";

import { getCache } from "@vercel/functions";
import { headers } from "next/headers";

import {
  DEFAULT_RATE_LIMIT_MESSAGE,
  enforceSlidingWindowRateLimit,
} from "./submission-rate-limit";

const SUBMISSION_WINDOW_MS = 10 * 60 * 1000;
const SUBMISSION_LIMIT = 5;
const SUBMISSION_CACHE_NAMESPACE = "submission-rate-limit";
const SUBMISSION_RATE_LIMIT_UNAVAILABLE_MESSAGE =
  "We couldn't verify the submission limit just now. Please try again shortly.";

const submissionAttempts = new Map<string, number[]>();

function getClientIp(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return headerStore.get("x-real-ip") ?? headerStore.get("cf-connecting-ip");
}

function getSubmissionKey(clientIp: string) {
  return crypto.createHash("sha256").update(clientIp).digest("hex");
}

async function enforceLocalRateLimit(clientIp: string) {
  return enforceSlidingWindowRateLimit({
    key: clientIp,
    limit: SUBMISSION_LIMIT,
    message: DEFAULT_RATE_LIMIT_MESSAGE,
    store: {
      async loadAttempts(key) {
        return submissionAttempts.get(key) ?? [];
      },
      async saveAttempts(key, attempts) {
        submissionAttempts.set(key, attempts);
      },
    },
    windowMs: SUBMISSION_WINDOW_MS,
  });
}

async function enforceVercelRateLimit(clientIp: string) {
  const cache = getCache({ namespace: SUBMISSION_CACHE_NAMESPACE });
  const cacheKey = getSubmissionKey(clientIp);

  return enforceSlidingWindowRateLimit({
    key: cacheKey,
    limit: SUBMISSION_LIMIT,
    message: DEFAULT_RATE_LIMIT_MESSAGE,
    store: {
      async loadAttempts(key) {
        const cachedValue = await cache.get(key);

        return Array.isArray(cachedValue)
          ? cachedValue.filter((value): value is number => typeof value === "number")
          : [];
      },
      async saveAttempts(key, attempts, ttlSeconds) {
        await cache.set(key, attempts, {
          ttl: ttlSeconds,
          name: "submission-rate-limit",
        });
      },
    },
    windowMs: SUBMISSION_WINDOW_MS,
  });
}

export async function enforceSubmissionRateLimit() {
  const headerStore = await headers();
  const clientIp = getClientIp(headerStore);

  if (!clientIp) {
    return { allowed: true as const };
  }

  if (process.env.VERCEL === "1") {
    try {
      return await enforceVercelRateLimit(clientIp);
    } catch {
      return {
        allowed: false as const,
        message: SUBMISSION_RATE_LIMIT_UNAVAILABLE_MESSAGE,
      };
    }
  }

  return enforceLocalRateLimit(clientIp);
}

export function isLikelyBotSubmission(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}
