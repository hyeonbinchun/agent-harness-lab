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
