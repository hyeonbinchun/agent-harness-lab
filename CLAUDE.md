# Project Instructions

## Source of truth

`docs/requirements.md` is the source of truth for product behavior.

Do not add, change, or remove user-facing behavior that isn't specified there,
even if the user's phrasing implies it — confirm with the user first (see
Ambiguity below), and update `docs/requirements.md` if the confirmed answer
becomes a permanent requirement.

## Workflow

Apply this workflow to every feature or change.

**Before implementing:**

1. Read `docs/requirements.md`.
2. Identify the explicit requirements the request touches.
3. Identify ambiguous product decisions (see Ambiguity below).

**Implementing:**

4. Inspect the existing implementation.
5. Implement the smallest change that satisfies the requirements.
6. Add or update tests (see Testing below).

**After implementing:**

7. Audit the change against `docs/requirements.md`:
   - behavior required but missing
   - behavior implemented but not required (out-of-scope / extra)
8. Fix anything the audit finds.
9. Run `npm run verify`.
10. If it fails, diagnose the cause, fix it, and re-run until it passes.
11. Review `git diff` and confirm only intended files changed.

## Ambiguity

Implementation details — component structure, naming, file layout, CSS,
internal state management, helper functions, testing library — are the
agent's judgment call and don't need confirmation.

Ask the user before implementing when an ambiguity affects observable
behavior, e.g.:

- user-facing behavior
- data model
- persistence
- sorting / filtering
- API behavior
- destructive behavior

## Testing

Tests must verify observable behavior, not implementation details
(e.g. assert what the user sees/can do, not internal DOM attributes added
only to make testing easier).

When fixing a bug:
- add a regression test
- verify it fails against the buggy behavior when practical
- verify it passes after the fix

## Scope control

Do not add extra features, UI enhancements, sorting, persistence behavior,
migrations, or new dependencies unless required by the request or explicitly
approved by the user.

## Git

Do not commit or push unless the user explicitly requests it.

Before committing:
- run `npm run verify`
- inspect `git diff`
- ensure only intended files changed

Commit messages follow Conventional Commits.

## Self-correction protocol

Run `npm run verify` after implementing.

If it fails:
1. Identify the specific failing category (type/lint/test).
2. Form a hypothesis about the cause before fixing it. Don't change code
   arbitrarily without root-causing the failure.
3. Re-run verify.
4. If the same kind of failure repeats 3 times, stop trying, summarize what
   was attempted and why it didn't work, and report to the user.
5. When fixing a bug, don't just fix the bug itself — also add a regression
   test that reproduces it.

If CI fails after a push (use a lower retry limit than local, since it's
more expensive):
1. Wait for the result with `gh pr checks --watch`.
2. On failure, check the logs with `gh run view --log-failed` to diagnose
   the cause.
3. If local verify passed but CI failed, first suspect an environment
   difference (Node version, cached dependencies, timezone, etc.).
4. Fix it, get local verify passing again, and push.
5. If the same cause fails 2 or more times, stop and report to the user.