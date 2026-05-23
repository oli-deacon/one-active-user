import fs from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import type { BuildSubmission, StorySubmission } from "@/lib/types";

const buildSubmissionSchema = z.object({
  submissionType: z.literal("build"),
  submitterName: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  projectName: z.string().optional(),
  builtWhat: z.string().min(1, "Tell us what you built."),
  friction: z.string().min(1, "Describe the friction you were reducing."),
  whyExistingToolsWereNotEnough: z
    .string()
    .min(1, "Tell us why existing tools were not enough."),
  whoItIsFor: z.string().min(1, "Tell us who it is for."),
  howItIsUsedNow: z.string().min(1, "Tell us how you are using it now."),
  isAnyoneElseUsingIt: z.string().optional(),
  whatItTaughtYou: z.string().optional(),
  linkOrScreenshots: z.string().optional(),
});

const storySubmissionSchema = z.object({
  submissionType: z.literal("story"),
  submitterName: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  pieceSummary: z.string().min(1, "Tell us what the piece is about."),
  whyItBelongs: z.string().min(1, "Tell us why it belongs here."),
  experienceSource: z.string().min(1, "Tell us what experience it draws from."),
  draftOrOutline: z.string().optional(),
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
  const filename = `${Date.now()}-${payload.submissionType}.json`;
  await fs.writeFile(
    path.join(submissionDir, filename),
    JSON.stringify(payload, null, 2),
    "utf8",
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
