# agent-harness-lab

AI Agent(Claude Code)가 코드를 작성할 때, 그 결과를 사람이 매번 검증하지 않아도 되게 만드는 harness를 단계적으로 설계하고 실험한 기록.


## Why

목적은 Agent가 실수해도 시스템이 감지하고 복구하는 범위를 넓히는 것. Agent에게 "검증해"라고 말하는 대신 Agent가 검증할 수밖에 없는 환경을 만드는 게 이 프로젝트의 방향이다.

## Levels

각 레벨은 이전 레벨의 실패를 전제로 만들어졌다. "Agent가 이걸 못 할 수도
있다"를 먼저 관찰하고, 그다음 그걸 막는 layer를 추가하는 순서로 진행했다.
- Level 0 AI Agent → 코드 생성
- Level 1 AI Agent → npm run verify + CLAUDE.md + requirements.md → 자체 검증
- Level 2 GitHub Actions → 독립적인 verification
- Level 3 Branch Ruleset → FAIL 시 merge 차단
- Level 4 CI failure → Agent feedback → 자동 diagnosis → Agent self-correction → CI


## What broke at each level

- **Level 0 → 1**: `npm run build` 통과를 기능 검증 성공으로 착각.
  한글 IME composition 버그를 build는 잡지 못함 → behavior-level test 필요.
- **Level 1 → 2**: Agent가 요구사항을 스스로 만들어냄 (priority 기능
  요청 시 색깔/정렬/기본값을 임의로 결정). 로컬 verify는 이걸 못 잡음
  → `requirements.md` + 확인 절차 추가.
- **Level 2 → 3**: CI가 통과/실패를 알려줘도, merge는 여전히 사람 판단에
  의존 → merge 자체를 CI 결과에 묶어야 함.
- **Level 3 → 4**: merge가 막혀도 원인 진단과 수정은 여전히 사람이 함
  → self-correction protocol 필요.

## Level 4

- CI 실패 → 로그 진단 → 환경 차이 원인 특정까지는 완전 자동
- 원인이 된 파일 삭제처럼 되돌리기 어려운 액션은 Claude Code 자체의
  permission classifier가 막고, 사람 승인을 요구함
- 승인 후 재검증 → 재커밋 → 재push → CI 통과 → merge → merge 후
  main CI 재확인까지는 다시 자동
- 전체 루프는 여전히 사람이 "merge까지 해도 좋아"처럼 명시적으로
  트리거해야 시작됨 — CI 실패가 자동으로 Agent 세션을 깨우진 않는다

다음 단계는 CI 실패가 사람의 트리거 없이 자동으로 Agent 세션을 깨우는 것까지 포함할 예정

## Harness 구성 요소

- `CLAUDE.md` — workflow, ambiguity 처리, self-correction protocol,
  scope control
- `docs/requirements.md` — product behavior의 source of truth
- `.github/workflows/ci.yml` — 독립 verification
- Branch protection rule (main) — status check 실패 시 merge 차단

## 실험 로그

Harness가 실제로 의도대로 작동하는지 검증한 케이스들:

1. **로컬 self-correction** — 의도적으로 버그(하드코딩된 삭제 조건)를
   심고, 무관한 리팩터링 요청을 던져서 Agent가 verify 실패를 스스로
   발견·진단·수정하는지 관찰. 가설을 먼저 세우고 최소 수정으로
   검증하는 흐름을 확인.

2. **무관한 실패 처리** — 명백한 오타(스스로 판단해 고치고 보고)와
   애매한/디자인 결정으로 보이는 불일치(고치지 않고 사용자에게 확인)에
   대해 Agent가 다르게 반응함을 관찰. 확신도에 따라 자동수정과
   확인요청을 가르는 것으로 보임.

3. **Bail-out** — 논리적으로 동시에 만족 불가능한 모순(서로 다른
   문구를 요구하는 중복 테스트)을 심어서 관찰. Agent는 반복 시도
   대신, 변경 전 상태로 되돌려 실행해보는 방식으로 "이 실패가 내
   변경과 무관하다"를 직접 검증한 뒤 즉시 원인을 지목하고 사용자에게
   결정을 요청함 — 3회 재시도 카운터가 발동하기 전에 문제의 본질을
   인식.

4. **End-to-end CI self-correction** — 로컬은 통과하지만 CI(UTC)에서만
   실패하는 timezone 버그를 심어두고 "merge까지 해도 좋다"고 허락.
   Agent가 원인을 정확히 진단(과거 유사 사례 커밋까지 찾아 인용)했고,
   원인 파일 삭제 시도는 tool-level permission classifier에 막혀
   별도 승인을 요청함. 승인 후 삭제 → 재검증 → merge → merge 후
   main CI 재확인까지 완료.

## Next

- CI 실패가 사람의 트리거 없이 자동으로 Agent를 깨우는 구조 (예: CI
  webhook → 이슈 생성 → Agent가 이슈를 픽업)
- 재시도 횟수를 "코드 수정 시도 횟수"가 아니라 "논리적으로 구분되는
  접근 횟수"로 세는 기준을 CLAUDE.md에 더 구체화
- 파괴적 액션(삭제, force push 등)에 대한 tool-level classifier의
  동작 범위를 명시적으로 문서화
