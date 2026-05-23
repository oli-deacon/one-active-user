import { headers } from "next/headers";

const SUBMISSION_WINDOW_MS = 10 * 60 * 1000;
const SUBMISSION_LIMIT = 5;

const submissionAttempts = new Map<string, number[]>();

function getClientIp(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return headerStore.get("x-real-ip") ?? headerStore.get("cf-connecting-ip");
}

function pruneAttempts(now: number, attempts: number[]) {
  return attempts.filter((timestamp) => now - timestamp < SUBMISSION_WINDOW_MS);
}

export async function enforceSubmissionRateLimit() {
  const headerStore = await headers();
  const clientIp = getClientIp(headerStore);

  if (!clientIp) {
    return { allowed: true as const };
  }

  const now = Date.now();
  const recentAttempts = pruneAttempts(now, submissionAttempts.get(clientIp) ?? []);

  if (recentAttempts.length >= SUBMISSION_LIMIT) {
    submissionAttempts.set(clientIp, recentAttempts);

    return {
      allowed: false as const,
      message: "Too many submissions came in from this connection. Please try again shortly.",
    };
  }

  recentAttempts.push(now);
  submissionAttempts.set(clientIp, recentAttempts);

  return { allowed: true as const };
}

export function isLikelyBotSubmission(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}
