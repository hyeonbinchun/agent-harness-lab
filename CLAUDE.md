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

구현 후 npm run verify를 실행한다.

실패하면:
1. 실패한 항목(type/lint/test)을 구체적으로 식별한다.
2. 실패 원인에 대한 가설을 세운 뒤 수정한다. 원인 분석 없이 코드를 임의로 바꾸지 않는다.
3. 다시 verify를 실행한다.
4. 같은 종류의 실패가 3회 반복되면 더 시도하지 말고, 지금까지 시도한 것과
   왜 안 됐는지를 요약해서 사용자에게 보고하고 중단한다.
5. 버그를 고칠 때는 버그 자체만 고치지 말고, 그 버그를 재현하는 회귀 테스트를 함께 추가한다.

push 후 CI가 실패하면 (로컬보다 비용이 크므로 더 낮은 재시도 한도를 둔다):
1. gh pr checks --watch로 결과를 기다린다.
2. 실패하면 gh run view --log-failed로 로그를 확인해 원인을 진단한다.
3. 로컬 verify는 통과했는데 CI에서만 실패했다면, 먼저 환경 차이
   (Node 버전, 캐시된 의존성, timezone 등)를 의심한다.
4. 수정 후 로컬 verify를 다시 통과시키고 push한다.
5. 같은 원인으로 2회 이상 실패하면 중단하고 사용자에게 보고한다.