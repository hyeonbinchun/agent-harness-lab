# Project Instructions

## Product requirements

The user request is the source of truth for product behavior.

Do not invent user-facing requirements that were not requested.

If a request is ambiguous and the ambiguity affects:
- user-facing behavior
- data model
- persistence
- sorting/filtering
- API behavior
- destructive behavior

ask the user before implementing.

For minor implementation details that do not affect
observable behavior, use reasonable engineering judgment.

## Requirements interpretation

Before implementing a feature:

1. Identify explicit requirements.
2. Identify ambiguous decisions.
3. Separate required behavior from implementation choices.
4. Do not silently turn assumptions into product requirements.

If multiple reasonable product behaviors exist,
ask the user instead of choosing one.

## Implementation

For every feature:

1. Inspect the existing implementation.
2. Propose a short implementation plan.
3. Implement the smallest change satisfying the requirements.
4. Add or update tests.
5. Run `npm run verify`.
6. If verification fails, diagnose the failure and fix it.
7. Re-run verification.

## Testing

Tests must verify observable behavior, not implementation details.

When a bug is found:
- add a regression test
- verify the test fails against the buggy behavior when practical
- then verify it passes after the fix.

## Git

Do not commit or push unless explicitly requested by the user.

Before committing:
- run `npm run verify`
- inspect `git diff`
- ensure only intended files changed

Commit messages should follow Conventional Commits.

## Scope control

Do not add:
- extra features
- UI enhancements
- sorting
- persistence behavior
- migrations
- new dependencies

unless they are required by the request or explicitly approved.