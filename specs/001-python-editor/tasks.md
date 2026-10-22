# Tasks: Klode minimal Python editor

**Input**: spec.md, plan.md, research.md, data-model.md, contracts/ui-runtime.md.
**Status**: Original decomposition plus approved feedback #19–#24. Original completed
tasks record historical implementation, including superseded recovery work; they
do not assert current requirements. GitHub issues remain authoritative for status.
**Validation**: Each story includes acceptance evidence; no blanket TDD requirement.

## Phase 1: Setup

- [X] T001 Pin supported Node, Vite, CodeMirror and Pyodide versions in package.json, package-lock.json and .node-version; record compatibility in specs/001-python-editor/evidence/feasibility.md.
- [X] T002 Add reproducible runtime vendoring with checksums/license notices in scripts/vendor-runtime.mjs and public/runtime/<pinned-version>/; wire it into package.json and prevent CDN/import-triggered package downloads.
- [X] T003 Configure Vite dev/preview headers and static build in vite.config.js; document the same HTTPS/COOP/COEP production requirements in docs/hosting.md without choosing or publishing a host.

## Phase 2: Foundation and feasibility gate

The 2026-10-22 product-owner continuation decision in spec.md/plan.md permits
local user-story implementation after the successful user-reported Windows VM
smoke test. School-environment evidence remains a release/acceptance gate.

- [X] T004 Build an isolated minimal stdin/shared-memory spike in experiments/input-spike/ using a module worker and page input field; prove repeated, empty and Unicode answers with visible prompts, Stop/restart and no main-thread blocking.
- [ ] T005 Record actual browser/version, opening route, whitelist, agreed reference exercise with expected results, candidate HTTPS host/header capability and cold-cache origin audit in specs/001-python-editor/evidence/feasibility.md; coordinate approved candidate provisioning with #4 and run the spike on the exam laptop.
- [ ] T006 Obtain independent review of specs/001-python-editor/evidence/feasibility.md against the input/whitelist gate; stop and report missing/failed actual-environment evidence at #3 before proceeding.

## Phase 3: US1 — Write and run Python (P1)

Goal: edit main.py, execute it and recover after errors.
Independent validation: print(2 + 3), edit/run again, then introduce/fix a syntax error.

- [X] T007 [US1] Build index.html and src/editor.js with one main.py document, syntax highlighting and indentation; omit completion/AI extensions and preserve plain selection/copy.
- [X] T008 [US1] Implement src/runtime/worker.js and src/runtime/client.js with the chosen runtime, fresh execution namespaces, one active run, run IDs and stale-message rejection.
- [X] T009 [US1] Wire Run/Stop and capability/loading/error states in src/main.js; Stop terminates/recreates the worker without changing editor source.
- [X] T010 [US1] Render ordered stdout/stderr and prompts without newline as text in src/output.js; record normal/error/restart results in specs/001-python-editor/evidence/acceptance.md.

## Phase 4: US2 — Interactive input (P1)

Goal: answer synchronous Python input calls through the page during execution.
Independent validation: two prompts, delayed/empty/Unicode answers, Stop during wait.

- [X] T011 [US2] Implement src/runtime/input-mailbox.js and worker stdin hookup; enforce 'one request may be pending per active run', explicit run/request identity, byte length and atomically published states; document the finite byte capacity in specs/001-python-editor/contracts/ui-runtime.md.
- [X] T012 [US2] Implement labelled pending-input controls in src/input.js; preserve empty lines, encode Unicode as UTF-8, reject oversize lines visibly without truncation and prevent stale submissions.
- [X] T013 [US2] Integrate waiting/submission/cancellation states in src/main.js and record repeated/empty/Unicode/no-newline/oversize/stop/rerun cases in specs/001-python-editor/evidence/acceptance.md.

## Phase 5: US3 — Exam transfer (P1)

Goal: use the approved laptop route and copy exact source into ans.app.
Independent validation: multiline clipboard comparison. T014/T015 are historical
recovery implementation superseded by feedback #20/T024 below.

- [X] T014 [US3] Implement src/session.js with a versioned sessionStorage key; 'source is a Unicode string and may be empty', absence differs from empty, storage failures are visible, and stdin/output are not persisted.
- [X] T015 [US3] Connect session saves/restoration in src/main.js without losing code on Stop/restart; document unavailable-storage behaviour in specs/001-python-editor/evidence/acceptance.md.
- [ ] T016 [US3] Validate native multiline copy/paste into ans.app on the exam laptop; record expected/actual text, browser, whitelist and commit in specs/001-python-editor/evidence/acceptance.md.

## Phase 6: US4 — Responsive display and themes (P2)

Goal: readable editor/input/output in narrow and wide layouts with theme control.
Independent validation: system/light/dark at 360 and 1280 CSS pixels without source loss.

- [X] T017 [P] [US4] Implement system/light/dark state and system-change handling in src/theme.js; cross-session theme retention is not required.
- [X] T018 [P] [US4] Implement responsive editor/input/output layout and visible keyboard focus in src/styles.css; keep required controls reachable at 360 and 1280 CSS pixels.
- [X] T019 [US4] Wire theme controls in src/main.js and record theme/viewport/source-preservation cases in specs/001-python-editor/evidence/acceptance.md.

## Phase 7: Cross-cutting delivery

- [X] T020 Add locked application build and relevant browser validation to .github/workflows/app.yml, retaining Tooling checks and no deployment; report all failures against the owning issue.
- [ ] T021 Run the production-build and real-laptop cases in specs/001-python-editor/quickstart.md and complete evidence/acceptance.md with separate local/actual results and documented runtime standard-library limits.
- [ ] T022 Obtain independent review and a human merge decision for the completed implementation; record exact commit, checks, remaining limits and release handoff in specs/001-python-editor/evidence/acceptance.md and the owning GitHub issues, with publication coordinated through #4.

## Dependencies and execution order

Original feasibility chain: T001 → T002/T003 → T004 → T005 → T006.
The documented product-owner continuation decision allows T007 onward locally
after T004 and the reported VM smoke test; T005/T006 remain open for exam acceptance.
US1 (T007–T010) follows the locally proven runtime and continuation decision; US2 (T011–T013) follows US1 runtime integration.
US3 (T014–T016) follows the editor/runtime and input workflows. US4 (T017–T019)
follows the working P1 UI, then T020–T022 validate the complete feature.
T005 may require school access/whitelisting and a separately approved host; report
that dependency rather than claiming the school-environment gate passed.

## Parallel opportunities by story

US1: editor and runtime work can be delegated to separate branches after exact
message fields are agreed; UI integration is sequential. US2: mailbox and page
controls have distinct files but require a frozen contract first. US3: native-copy validation can be prepared separately; main.js integration and
evidence are sequential.
US4: T017 and T018 may run in parallel; T019 integrates them. Never edit the shared
main.js or acceptance evidence concurrently. Marked [P] tasks have disjoint files.

## Implementation strategy and handoffs

The smallest technical increment is the isolated input spike, not a complete exam
product. Deliver US1 as the first independently reviewable UI increment; first-version
acceptance includes all four stories. Each implementation issue must pin the reviewed
spec commit, allowed files/scope, prerequisites, criteria, role, deliverable and stop
conditions from this plan. Use an isolated branch/worktree, independent reviewer and
human merge gate for every issue. Do not turn task checkboxes into a competing status
system or change product criteria during implementation.

## Phase 8: Feedback round 1 (#19–#24)

- [ ] T023 Review revised product/spec/plan/contracts before dependent implementation; record reviewed spec commit at #19/#20.
- [ ] T024 [#20] Remove application source save/restore, storage warning and ans-specific UI instructions. Preserve current edits during execution/Stop/theme and exact native copy; verify initial content on reload with empty/nonempty edits and old stored values. Replace recovery assertions in current tests/docs; retain historical evidence for original commits.
- [ ] T025 [#21] Integrate labelled input at the console prompt with safe read-only selectable history, accepted-only echo/newline before later output, internal reveal/focus and unchanged mailbox/ACK/Stop semantics. Cover exact example, empty/Unicode/repeated/no-newline, rejection/duplicate/stale/Stop/rerun and lossless output/flood cases.
- [ ] T026 [#22] Move Run/Stop to upper editor header; coordinate DOM/CSS sequentially with T025. Add padded rounded unclipped accessible editor/console focus. Verify light/dark at 1280×720/360×640, long content and pending input without horizontal overflow.
- [ ] T027 [#23] Replace dropdown with accessible local system/light/dark icons; simplify footer, keep approved copy/taglines, add repository link, remove hardcoded version/browser copy. Verify selected state, keyboard/focus and source/runtime/transcript preservation.
- [ ] T028 [#24] Publish-facing README plus CONTRIBUTING linking existing governance, honest live/planned features and browser limits, local quickstart and human/agent workflow. Keep broad translation under #8.
- [ ] T029 Independently review feedback diff and relevant build/browser results; report issue-specific outcomes and remaining actual-school gate. Prepare PR for human merge decision; no autonomous merge/publication.

T023 precedes T024–T028. T025/T026 share console/header/focus interfaces and must
be integrated sequentially or have explicit disjoint ownership. T027 may not edit
their shared files concurrently. T028 follows the revised agreed behaviour and
distinguishes pending changes from live deployment. T029 follows relevant checks.
