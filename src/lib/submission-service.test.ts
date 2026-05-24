import assert from "node:assert/strict";
import test from "node:test";

import type { SubmissionProcessorDependencies } from "./submission-service";

// @ts-expect-error Node's test runner imports the TypeScript module directly.
import { processSubmission } from "./submission-service.ts";

function createDependencies() {
  const calls = {
    enforceSubmissionRateLimit: 0,
    handleSubmission: 0,
  };

  const dependencies: SubmissionProcessorDependencies<
    { kind: "build"; email: string },
    { kind: "story"; email: string }
  > = {
    async enforceSubmissionRateLimit() {
      calls.enforceSubmissionRateLimit += 1;
      return { allowed: true as const };
    },
    async handleSubmission() {
      calls.handleSubmission += 1;
    },
    isLikelyBotSubmission(value: string | undefined) {
      return Boolean(value);
    },
    parseBuildSubmission(input: Record<string, string | undefined>) {
      if (!input.email) {
        return {
          success: false as const,
          fieldErrors: { email: ["Email is required."] },
        };
      }

      return {
        success: true as const,
        data: { kind: "build", email: input.email },
      };
    },
    parseStorySubmission(input: Record<string, string | undefined>) {
      if (!input.email) {
        return {
          success: false as const,
          fieldErrors: { email: ["Email is required."] },
        };
      }

      return {
        success: true as const,
        data: { kind: "story", email: input.email },
      };
    },
  };

  return {
    calls,
    dependencies,
  };
}

test("invalid submissions return field errors before consuming the rate limit", async () => {
  const { calls, dependencies } = createDependencies();

  const result = await processSubmission(
    {
      submissionType: "build",
      email: "",
    },
    dependencies,
  );

  assert.equal(result.success, false);
  assert.deepEqual(result.fieldErrors, { email: ["Email is required."] });
  assert.equal(calls.enforceSubmissionRateLimit, 0);
  assert.equal(calls.handleSubmission, 0);
});

test("valid submissions consume the rate limit and are handled", async () => {
  const { calls, dependencies } = createDependencies();

  const result = await processSubmission(
    {
      submissionType: "story",
      email: "editor@example.com",
    },
    dependencies,
  );

  assert.equal(result.success, true);
  assert.equal(result.submissionType, "story");
  assert.equal(calls.enforceSubmissionRateLimit, 1);
  assert.equal(calls.handleSubmission, 1);
});

test("rate-limited valid submissions do not reach the handler", async () => {
  const { calls, dependencies } = createDependencies();
  dependencies.enforceSubmissionRateLimit = async () => {
    calls.enforceSubmissionRateLimit += 1;
    return {
      allowed: false as const,
      message: "Slow down.",
    };
  };

  const result = await processSubmission(
    {
      submissionType: "build",
      email: "editor@example.com",
    },
    dependencies,
  );

  assert.equal(result.success, false);
  assert.equal(result.message, "Slow down.");
  assert.equal(calls.enforceSubmissionRateLimit, 1);
  assert.equal(calls.handleSubmission, 0);
});

test("honeypot submissions short-circuit without validation or rate limiting", async () => {
  const { calls, dependencies } = createDependencies();

  const result = await processSubmission(
    {
      submissionType: "build",
      website: "https://spam.invalid",
    },
    dependencies,
  );

  assert.equal(result.success, true);
  assert.equal(calls.enforceSubmissionRateLimit, 0);
  assert.equal(calls.handleSubmission, 0);
});
