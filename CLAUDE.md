CLAUDE.md

# Project Purpose

This project is a learning project for AI Harness Engineering.

# Verification

Before considering a task complete:

1. Run `npm run verify`.
2. Existing behavior must remain intact.
3. When changing behavior, add or update behavior-level tests.
4. Do not consider TypeScript/build success as functional verification.
5. If a behavior cannot be verified by the current test suite,
   explicitly identify the verification gap.

# Development Workflow

1. Inspect the existing implementation.
2. Make a short implementation plan.
3. Implement the change.
4. Add/update tests for the changed behavior.
5. Run verification.
6. If verification fails, investigate and fix the issue.
7. Report what was verified and what remains unverified.