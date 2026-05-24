"use server";

import { enforceSubmissionRateLimit, isLikelyBotSubmission } from "@/lib/submission-guard";
import { processSubmission, type SubmissionActionState } from "@/lib/submission-service";
import { handleSubmission, parseBuildSubmission, parseStorySubmission } from "@/lib/submissions";

type ActionState = SubmissionActionState;

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

  return processSubmission(raw, {
    enforceSubmissionRateLimit,
    handleSubmission,
    isLikelyBotSubmission,
    parseBuildSubmission(input) {
      const parsed = parseBuildSubmission({
        submissionType: "build",
        submitterName: input.submitterName,
        email: input.email,
        projectName: input.projectName,
        builtWhat: input.builtWhat,
        friction: input.friction,
        whyExistingToolsWereNotEnough: input.whyExistingToolsWereNotEnough,
        whoItIsFor: input.whoItIsFor,
        howItIsUsedNow: input.howItIsUsedNow,
        isAnyoneElseUsingIt: input.isAnyoneElseUsingIt,
        whatItTaughtYou: input.whatItTaughtYou,
        linkOrScreenshots: input.linkOrScreenshots,
      });

      if (!parsed.success) {
        return {
          success: false as const,
          fieldErrors: parsed.error.flatten().fieldErrors,
        };
      }

      return {
        success: true as const,
        data: parsed.data,
      };
    },
    parseStorySubmission(input) {
      const parsed = parseStorySubmission({
        submissionType: "story",
        submitterName: input.submitterName,
        email: input.email,
        pieceSummary: input.pieceSummary,
        whyItBelongs: input.whyItBelongs,
        experienceSource: input.experienceSource,
        draftOrOutline: input.draftOrOutline,
      });

      if (!parsed.success) {
        return {
          success: false as const,
          fieldErrors: parsed.error.flatten().fieldErrors,
        };
      }

      return {
        success: true as const,
        data: parsed.data,
      };
    },
  });
}
