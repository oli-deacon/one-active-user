import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import type { BuildSubmission, StorySubmission } from "@/lib/types";

const SHORT_TEXT_MAX = 160;
const MEDIUM_TEXT_MAX = 500;
const LONG_TEXT_MAX = 4_000;
const WEBHOOK_TIMEOUT_MS = 5_000;
const FALLBACK_RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;

function requiredText(max: number, message: string) {
  return z.string().trim().min(1, message).max(max, `Keep this to ${max} characters or fewer.`);
}

function optionalText(max: number) {
  return z.string().trim().max(max, `Keep this to ${max} characters or fewer.`).optional();
}

const buildSubmissionSchema = z.object({
  submissionType: z.literal("build"),
  submitterName: requiredText(SHORT_TEXT_MAX, "Name is required."),
  email: requiredText(SHORT_TEXT_MAX, "Email is required.").email("Enter a valid email address."),
  projectName: optionalText(SHORT_TEXT_MAX),
  builtWhat: requiredText(MEDIUM_TEXT_MAX, "Tell us what you built."),
  friction: requiredText(LONG_TEXT_MAX, "Describe the friction you were reducing."),
  whyExistingToolsWereNotEnough: requiredText(
    LONG_TEXT_MAX,
    "Tell us why existing tools were not enough.",
  ),
  whoItIsFor: requiredText(MEDIUM_TEXT_MAX, "Tell us who it is for."),
  howItIsUsedNow: requiredText(LONG_TEXT_MAX, "Tell us how you are using it now."),
  isAnyoneElseUsingIt: optionalText(MEDIUM_TEXT_MAX),
  whatItTaughtYou: optionalText(LONG_TEXT_MAX),
  linkOrScreenshots: optionalText(MEDIUM_TEXT_MAX),
});

const storySubmissionSchema = z.object({
  submissionType: z.literal("story"),
  submitterName: requiredText(SHORT_TEXT_MAX, "Name is required."),
  email: requiredText(SHORT_TEXT_MAX, "Email is required.").email("Enter a valid email address."),
  pieceSummary: requiredText(MEDIUM_TEXT_MAX, "Tell us what the piece is about."),
  whyItBelongs: requiredText(LONG_TEXT_MAX, "Tell us why it belongs here."),
  experienceSource: requiredText(LONG_TEXT_MAX, "Tell us what experience it draws from."),
  draftOrOutline: optionalText(LONG_TEXT_MAX),
});

export type SubmissionResult =
  | { success: true }
  | { success: false; fieldErrors: Record<string, string[]> };

export function parseBuildSubmission(input: unknown) {
  return buildSubmissionSchema.safeParse(input);
}

export function parseStorySubmission(input: unknown) {
  return storySubmissionSchema.safeParse(input);
}

async function persistSubmission(payload: BuildSubmission | StorySubmission) {
  const submissionDir = path.join(process.cwd(), ".tmp", "submissions");
  await fs.mkdir(submissionDir, { recursive: true });
  await cleanupStoredSubmissions(submissionDir);
  const filename = `${Date.now()}-${payload.submissionType}-${crypto.randomUUID()}.json`;
  await fs.writeFile(
    path.join(submissionDir, filename),
    JSON.stringify(payload, null, 2),
    { encoding: "utf8", mode: 0o600 },
  );
}

async function cleanupStoredSubmissions(submissionDir: string) {
  const now = Date.now();
  const entries = await fs.readdir(submissionDir);

  await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(submissionDir, entry);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > FALLBACK_RETENTION_MS) {
        await fs.unlink(filePath);
      }
    }),
  );
}

async function postToWebhook(payload: BuildSubmission | StorySubmission) {
  const webhookUrl = process.env.SUBMISSION_WEBHOOK_URL;
  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Submission webhook failed with ${response.status}`);
  }

  return true;
}

export async function handleSubmission(payload: BuildSubmission | StorySubmission) {
  const delivered = await postToWebhook(payload).catch(() => false);
  if (!delivered) {
    await persistSubmission(payload);
  }
}
