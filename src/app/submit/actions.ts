"use server";

import { enforceSubmissionRateLimit, isLikelyBotSubmission } from "@/lib/submission-guard";
import { handleSubmission, parseBuildSubmission, parseStorySubmission } from "@/lib/submissions";

type ActionState = {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
  submissionType?: "build" | "story";
};

function normalizeFormData(formData: FormData) {
  return Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value).trim()]),
  );
}

export async function submitContribution(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = normalizeFormData(formData);

  if (isLikelyBotSubmission(raw.website)) {
    return {
      success: true,
      message:
        "Thanks for sending this through. Submissions are reviewed manually, and the rough edges are welcome.",
      fieldErrors: {},
    };
  }

  const rateLimitResult = await enforceSubmissionRateLimit();
  if (!rateLimitResult.allowed) {
    return {
      success: false,
      message: rateLimitResult.message,
      fieldErrors: {},
    };
  }

  const submissionType = raw.submissionType === "story" ? "story" : "build";

  if (submissionType === "build") {
    const parsed = parseBuildSubmission({
      submissionType,
      submitterName: raw.submitterName,
      email: raw.email,
      projectName: raw.projectName,
      builtWhat: raw.builtWhat,
      friction: raw.friction,
      whyExistingToolsWereNotEnough: raw.whyExistingToolsWereNotEnough,
      whoItIsFor: raw.whoItIsFor,
      howItIsUsedNow: raw.howItIsUsedNow,
      isAnyoneElseUsingIt: raw.isAnyoneElseUsingIt,
      whatItTaughtYou: raw.whatItTaughtYou,
      linkOrScreenshots: raw.linkOrScreenshots,
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "A few details still need attention before we can review this.",
        fieldErrors: parsed.error.flatten().fieldErrors,
        submissionType,
      };
    }

    await handleSubmission(parsed.data);
  } else {
    const parsed = parseStorySubmission({
      submissionType,
      submitterName: raw.submitterName,
      email: raw.email,
      pieceSummary: raw.pieceSummary,
      whyItBelongs: raw.whyItBelongs,
      experienceSource: raw.experienceSource,
      draftOrOutline: raw.draftOrOutline,
    });

    if (!parsed.success) {
      return {
        success: false,
        message: "A few details still need attention before we can review this.",
        fieldErrors: parsed.error.flatten().fieldErrors,
        submissionType,
      };
    }

    await handleSubmission(parsed.data);
  }

  return {
    success: true,
    message:
      "Thanks for sending this through. Submissions are reviewed manually, and the rough edges are welcome.",
    fieldErrors: {},
    submissionType,
  };
}
