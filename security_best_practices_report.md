# Security Best Practices Report

## Executive summary

The codebase is relatively small and has a narrow attack surface, which is a strong starting point for a public launch. The biggest issues are an outdated `next` version that falls below the patched baseline called out in the security guidance, and a public submission flow that currently has no visible rate limiting or bot-abuse controls. I also found a few defense-in-depth gaps around payload bounds, security headers, and how submitted PII is stored when webhook delivery fails.

## Remediation status

- `SBP-001` fixed: upgraded `next` and `eslint-config-next` to `16.2.6`.
- `SBP-002` fixed: added a honeypot field and IP-based submission rate limiting.
- `SBP-003` fixed: added maximum field lengths and a webhook timeout.
- `SBP-004` fixed: added baseline security headers in `next.config.ts`.
- `SBP-005` fixed: added fallback submission cleanup, restrictive file permissions, and non-predictable filenames.
- Residual risk: `npm audit` still reports a moderate transitive `postcss` advisory through `next`. There is no non-breaking fix surfaced by `npm audit` for the current dependency line, so this should be tracked and revisited on the next upstream Next.js release.

## Scope reviewed

- Next.js / React / TypeScript application code in `src/`
- Runtime and framework configuration in `package.json` and `next.config.ts`
- Submission handling flow in `src/app/submit/actions.ts` and `src/lib/submissions.ts`

## Critical / High

### SBP-001

- Rule ID: `NEXT-SUPPLY-001`
- Severity: High
- Location: [package.json](/Users/olideacon/code/one-active-user/package.json:15)
- Evidence: `next` is pinned to `^16.0.3`
- Impact: The security guidance for this review flags any Next.js version older than `16.0.7` as vulnerable to the `react2shell` issue. Shipping a public site on `16.0.3` leaves the app below the documented patched floor.
- Fix: Upgrade `next` to at least `16.0.7` and refresh the lockfile. Re-run lint/build after the upgrade.
- Mitigation: If you cannot upgrade immediately, avoid public exposure until the dependency is patched.
- False positive notes: None. This is directly visible in the repo dependency manifest.

### SBP-002

- Rule ID: `NEXT-CSRF-AND-ABUSE-REVIEW`
- Severity: High
- Location: [src/app/submit/actions.ts](/Users/olideacon/code/one-active-user/src/app/submit/actions.ts:18), [src/lib/submissions.ts](/Users/olideacon/code/one-active-user/src/lib/submissions.ts:79)
- Evidence: The public server action `submitContribution` accepts anonymous submissions and immediately forwards or persists them. There is no visible rate limiting, CAPTCHA/honeypot, IP throttling, or bot scoring in the request path.
- Impact: Anyone can automate the submission endpoint to generate spam, drive webhook traffic, and force repeated disk writes. On a public site this is the most likely operational abuse path.
- Fix: Add at least one server-side abuse control before launch. A practical baseline would be IP-based rate limiting at the edge or app layer plus a honeypot field or CAPTCHA on the form.
- Mitigation: If your hosting platform provides WAF/rate limiting, enforce a low threshold on the submission endpoint specifically and log rejected attempts.
- False positive notes: This could already be mitigated at the CDN/WAF layer, but there is no evidence of that in app code or config.

## Medium

### SBP-003

- Rule ID: `NEXT-INPUT-001`
- Severity: Medium
- Location: [src/lib/submissions.ts](/Users/olideacon/code/one-active-user/src/lib/submissions.ts:8), [src/app/submit/actions.ts](/Users/olideacon/code/one-active-user/src/app/submit/actions.ts:12), [src/lib/submissions.ts](/Users/olideacon/code/one-active-user/src/lib/submissions.ts:47)
- Evidence: The submission schemas validate presence and email format, but they do not set any maximum lengths on free-text fields. The action then converts the entire `FormData` payload to strings and persists the full JSON payload on delivery failure.
- Impact: Oversized requests can increase memory use, inflate disk usage in `.tmp/submissions`, and amplify webhook egress. This becomes much easier to exploit when combined with the lack of rate limiting.
- Fix: Add `.max(...)` bounds to every text field, reject unexpected fields, and cap total request size where your platform allows it. Also add a timeout to outbound webhook delivery so failed upstreams do not pin resources.
- Mitigation: Keep the submission fallback directory outside any served path and monitor its size.
- False positive notes: Some platforms enforce body-size limits upstream, but those limits are not visible in this repo.

### SBP-004

- Rule ID: `NEXT-HEADERS-001`
- Severity: Medium
- Location: [next.config.ts](/Users/olideacon/code/one-active-user/next.config.ts:3), [src/app/layout.tsx](/Users/olideacon/code/one-active-user/src/app/layout.tsx:8)
- Evidence: I did not find any visible app-level security header configuration such as `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, or clickjacking protection via `frame-ancestors` / `X-Frame-Options`.
- Impact: Missing headers do not usually create an exploit on their own, but they remove important browser-enforced defenses against XSS, MIME sniffing, framing, and information leakage.
- Fix: Add baseline headers either in `next.config.ts`, middleware/proxy, or hosting-edge config. For this site I would start with `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a frame restriction.
- Mitigation: If these headers are already managed by Vercel or another edge layer, document that configuration and verify it with a production response-header check.
- False positive notes: This finding is based on absence in the repo. Headers may exist outside application code.

## Low

### SBP-005

- Rule ID: `NEXT-PII-001`
- Severity: Low
- Location: [src/lib/submissions.ts](/Users/olideacon/code/one-active-user/src/lib/submissions.ts:47)
- Evidence: When webhook delivery fails, the app writes full submission payloads, including submitter emails, to `.tmp/submissions` as plaintext JSON.
- Impact: This creates an unencrypted local store of personal data with no visible retention or cleanup policy. If the host, backups, or logs are ever exposed, those submissions are easier to recover than necessary.
- Fix: Define a retention policy, delete processed fallback files automatically, and consider storing only the minimum fields needed for recovery. If you move to a managed store, use one with access controls and auditability.
- Mitigation: Restrict filesystem access on the host and ensure `.tmp` is never exposed by the web server.
- False positive notes: `.tmp` is ignored by git, so this is not a source-control leak; the concern is runtime storage hygiene.

## Positive notes

- Input is validated with Zod before persistence or webhook delivery, which is a good baseline for server actions.
- I did not find any committed secrets, `NEXT_PUBLIC_*` misuse, or obvious client-side secret exposure.
- I did not find dangerous HTML sinks such as `dangerouslySetInnerHTML`, `innerHTML`, or `eval`.
- Remote image sources are constrained to `https://placehold.co`, which is tighter than the default image allowlist posture.

## Recommended hardening order

1. Upgrade `next` to a patched version.
2. Add submission abuse controls: edge rate limiting plus a honeypot or CAPTCHA.
3. Add max-length validation and outbound webhook timeouts.
4. Add and verify baseline security headers in production.
5. Add retention/cleanup for fallback submission files containing emails.
