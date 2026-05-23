"use client";

import { useActionState, useMemo, useState } from "react";

import { submitContribution } from "@/app/submit/actions";

type FormState = Awaited<ReturnType<typeof submitContribution>>;

const initialState: FormState = {
  success: false,
  message: "",
  fieldErrors: {},
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return <p className="mt-2 text-sm text-[var(--accent)]">{errors[0]}</p>;
}

function inputClassName(hasError: boolean) {
  return `mt-2 w-full rounded-3xl border bg-white/85 px-4 py-3 text-base outline-none transition ${
    hasError
      ? "border-[var(--accent)]"
      : "border-[var(--line)] focus:border-[rgba(162,73,54,0.4)]"
  }`;
}

export function SubmitForm() {
  const [mode, setMode] = useState<"build" | "story">("build");
  const [state, formAction, pending] = useActionState(submitContribution, initialState);

  const fields = useMemo(() => {
    if (mode === "build") {
      return [
        ["builtWhat", "What did you build?", "A practical description is enough."],
        ["friction", "What personal friction were you trying to reduce?", ""],
        [
          "whyExistingToolsWereNotEnough",
          "Why did existing software not solve it well enough?",
          "",
        ],
        ["whoItIsFor", "Who is it for?", "It can just be you."],
        ["howItIsUsedNow", "How are you using it now?", ""],
        ["isAnyoneElseUsingIt", "Is anyone else using it?", "Optional."],
        ["whatItTaughtYou", "What did building it teach you?", "Optional."],
        ["linkOrScreenshots", "Do you have a link or screenshots?", "Optional."],
      ] as const;
    }

    return [
      ["pieceSummary", "What is the piece about?", ""],
      ["whyItBelongs", "Why does it belong on One Active User?", ""],
      ["experienceSource", "What experience or example does it draw from?", ""],
      ["draftOrOutline", "Do you have a draft or outline?", "Optional."],
    ] as const;
  }, [mode]);

  return (
    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(50,38,26,0.07)] sm:p-8">
      <div className="flex flex-wrap gap-3">
        {(["build", "story"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-5 py-2 text-sm transition ${
              mode === value
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "border border-[var(--line)] bg-white/65 text-[var(--muted)]"
            }`}
          >
            {value === "build" ? "Submit a build" : "Submit a story"}
          </button>
        ))}
      </div>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="submissionType" value={mode} />
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-[var(--foreground)]">Your name</span>
            <input
              name="submitterName"
              className={inputClassName(Boolean(state.fieldErrors.submitterName))}
              placeholder="How should we refer to you?"
            />
            <FieldError errors={state.fieldErrors.submitterName} />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--foreground)]">Email</span>
            <input
              name="email"
              type="email"
              className={inputClassName(Boolean(state.fieldErrors.email))}
              placeholder="Where should a reply go?"
            />
            <FieldError errors={state.fieldErrors.email} />
          </label>
        </div>

        {mode === "build" ? (
          <label className="block">
            <span className="text-sm text-[var(--foreground)]">Project name</span>
            <input
              name="projectName"
              className={inputClassName(Boolean(state.fieldErrors.projectName))}
              placeholder="What do you call it?"
            />
            <FieldError errors={state.fieldErrors.projectName} />
          </label>
        ) : null}

        {fields.map(([name, label, hint]) => (
          <label className="block" key={name}>
            <span className="text-sm text-[var(--foreground)]">{label}</span>
            <textarea
              name={name}
              rows={name === "builtWhat" || name === "pieceSummary" ? 3 : 5}
              className={inputClassName(Boolean(state.fieldErrors[name]))}
              placeholder={hint}
            />
            <FieldError errors={state.fieldErrors[name]} />
          </label>
        ))}

        <div className="rounded-3xl border border-[var(--line)] bg-white/55 p-4 text-sm leading-6 text-[var(--muted)]">
          Submissions are curated and reviewed manually. Rough edges are welcome. A clear account
          of the friction, the tool, or the idea matters more than polished language.
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Sending..." : "Send submission"}
        </button>

        {state.message ? (
          <p className={`text-sm ${state.success ? "text-[var(--foreground)]" : "text-[var(--accent)]"}`}>
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
