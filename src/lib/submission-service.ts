import type { RateLimitResult } from "./submission-rate-limit";

export type SubmissionActionState = {
  success: boolean;
  message: string;
  fieldErrors: Record<string, string[]>;
  submissionType?: "build" | "story";
};

export type SubmissionParseResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: Record<string, string[]> };

export type SubmissionProcessorDependencies<BuildPayload, StoryPayload> = {
  enforceSubmissionRateLimit: () => Promise<RateLimitResult>;
  handleSubmission: (payload: BuildPayload | StoryPayload) => Promise<void>;
  isLikelyBotSubmission: (value: string | undefined) => boolean;
  parseBuildSubmission: (input: Record<string, string | undefined>) => SubmissionParseResult<BuildPayload>;
  parseStorySubmission: (input: Record<string, string | undefined>) => SubmissionParseResult<StoryPayload>;
};

const SUCCESS_MESSAGE =
  "Thanks for sending this through. Submissions are reviewed manually, and the rough edges are welcome.";
const VALIDATION_MESSAGE = "A few details still need attention before we can review this.";

export async function processSubmission<BuildPayload, StoryPayload>(
  raw: Record<string, string | undefined>,
  dependencies: SubmissionProcessorDependencies<BuildPayload, StoryPayload>,
): Promise<SubmissionActionState> {
  if (dependencies.isLikelyBotSubmission(raw.website)) {
    return {
      success: true,
      message: SUCCESS_MESSAGE,
      fieldErrors: {},
    };
  }

  const submissionType = raw.submissionType === "story" ? "story" : "build";

  if (submissionType === "build") {
    const parsed = dependencies.parseBuildSubmission(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: VALIDATION_MESSAGE,
        fieldErrors: parsed.fieldErrors,
        submissionType,
      };
    }

    const rateLimitResult = await dependencies.enforceSubmissionRateLimit();
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        message: rateLimitResult.message,
        fieldErrors: {},
        submissionType,
      };
    }

    await dependencies.handleSubmission(parsed.data);
  } else {
    const parsed = dependencies.parseStorySubmission(raw);
    if (!parsed.success) {
      return {
        success: false,
        message: VALIDATION_MESSAGE,
        fieldErrors: parsed.fieldErrors,
        submissionType,
      };
    }

    const rateLimitResult = await dependencies.enforceSubmissionRateLimit();
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        message: rateLimitResult.message,
        fieldErrors: {},
        submissionType,
      };
    }

    await dependencies.handleSubmission(parsed.data);
  }

  return {
    success: true,
    message: SUCCESS_MESSAGE,
    fieldErrors: {},
    submissionType,
  };
}

export { SUCCESS_MESSAGE, VALIDATION_MESSAGE };
