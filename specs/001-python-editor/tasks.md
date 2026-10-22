# Tasks: Klode minimal Python editor

**Input**: spec.md, plan.md, research.md, data-model.md, contracts/ui-runtime.md.
**Status**: Proposed decomposition for #3; not an instruction to implement before
human scope/merge approval. GitHub issues remain authoritative for work status.
**Validation**: Each story includes acceptance evidence; no blanket TDD requirement.

## Phase 1: Setup

- [ ] T001 Pin supported Node, Vite, CodeMirror and Pyodide versions in package.json, package-lock.json and .node-version; record compatibility in specs/001-python-editor/evidence/feasibility.md.
- [ ] T002 Add reproducible runtime vendoring with checksums/license notices in scripts/vendor-runtime.mjs and public/runtime/<pinned-version>/; wire it into package.json and prevent CDN/import-triggered package downloads.
- [ ] T003 Configure Vite dev/preview headers and static build in vite.config.js; document the same HTTPS/COOP/COEP production requirements in docs/hosting.md without choosing or publishing a host.

## Phase 2: Foundation and feasibility gate

No full user-story implementation begins until this evidence gate passes.

- [ ] T004 Build an isolated minimal stdin/shared-memory spike in experiments/input-spike/ using a module worker and page input field; prove repeated, empty and Unicode answers with visible prompts, Stop/restart and no main-thread blocking.
- [ ] T005 Record actual browser/version, opening route, whitelist, candidate HTTPS host/header capability and cold-cache origin audit in specs/001-python-editor/evidence/feasibility.md; coordinate approved candidate provisioning with #4 and run the spike on the exam laptop.
- [ ] T006 Obtain independent review of specs/001-python-editor/evidence/feasibility.md against the input/whitelist gate; stop and report missing/failed actual-environment evidence at #3 before proceeding.

## Phase 3: US1 — Write and run Python (P1)

Goal: edit main.py, execute it and recover after errors.
Independent validation: print(2 + 3), edit/run again, then introduce/fix a syntax error.

- [ ] T007 [US1] Build index.html and src/editor.js with one main.py document, syntax highlighting and indentation; omit completion/AI extensions and preserve plain selection/copy.
- [ ] T008 [US1] Implement src/runtime/worker.js and src/runtime/client.js with the chosen runtime, fresh execution namespaces, one active run, run IDs and stale-message rejection.
- [ ] T009 [US1] Wire Run/Stop and capability/loading/error states in src/main.js; Stop terminates/recreates the worker without changing editor source.
- [ ] T010 [US1] Render ordered stdout/stderr and prompts without newline as text in src/output.js; record normal/error/restart results in specs/001-python-editor/evidence/acceptance.md.

## Phase 4: US2 — Interactive input (P1)

Goal: answer synchronous Python input calls through the page during execution.
Independent validation: two prompts, delayed/empty/Unicode answers, Stop during wait.

- [ ] T011 [US2] Implement src/runtime/input-mailbox.js and worker stdin hookup; enforce 'one request may be pending per active run', explicit run/request identity, byte length and atomically published states; document the finite byte capacity in specs/001-python-editor/contracts/ui-runtime.md.
- [ ] T012 [US2] Implement labelled pending-input controls in src/input.js; preserve empty lines, encode Unicode as UTF-8, reject oversize lines visibly without truncation and prevent stale submissions.
- [ ] T013 [US2] Integrate waiting/submission/cancellation states in src/main.js and record repeated/empty/Unicode/no-newline/oversize/stop/rerun cases in specs/001-python-editor/evidence/acceptance.md.

## Phase 5: US3 — Exam transfer and reload recovery (P1)

Goal: use the approved laptop route, copy exact source into ans.app and restore on reload.
Independent validation: multiline clipboard comparison and nonempty/empty reload cases.

- [ ] T014 [US3] Implement src/session.js with a versioned sessionStorage key; 'source is a Unicode string and may be empty', absence differs from empty, storage failures are visible, and stdin/output are not persisted.
- [ ] T015 [US3] Connect session saves/restoration in src/main.js without losing code on Stop/restart; document unavailable-storage behaviour in specs/001-python-editor/evidence/acceptance.md.
- [ ] T016 [US3] Validate native multiline copy/paste into ans.app and exact same-session reload recovery on the exam laptop; record expected/actual text, browser, whitelist and commit in specs/001-python-editor/evidence/acceptance.md.

## Phase 6: US4 — Responsive display and themes (P2)

Goal: readable editor/input/output in narrow and wide layouts with theme control.
Independent validation: system/light/dark at 360 and 1280 CSS pixels without source loss.

- [ ] T017 [P] [US4] Implement system/light/dark state and system-change handling in src/theme.js; cross-session theme retention is not required.
- [ ] T018 [P] [US4] Implement responsive editor/input/output layout and visible keyboard focus in src/styles.css; keep required controls reachable at 360 and 1280 CSS pixels.
- [ ] T019 [US4] Wire theme controls in src/main.js and record theme/viewport/source-preservation cases in specs/001-python-editor/evidence/acceptance.md.

## Phase 7: Cross-cutting delivery

- [ ] T020 Add locked application build and relevant browser validation to .github/workflows/app.yml, retaining Tooling checks and no deployment; report all failures against the owning issue.
- [ ] T021 Run the production-build and real-laptop cases in specs/001-python-editor/quickstart.md and complete evidence/acceptance.md with separate local/actual results and documented runtime standard-library limits.
- [ ] T022 Obtain independent review and a human merge decision for the completed implementation; record exact commit, checks, remaining limits and release handoff in specs/001-python-editor/evidence/acceptance.md and the owning GitHub issues, with publication coordinated through #4.

## Dependencies and execution order

T001 → T002/T003 → T004 → T005 → T006 is the blocking feasibility chain.
US1 (T007–T010) follows that gate; US2 (T011–T013) follows US1 runtime integration.
US3 (T014–T016) follows the editor/runtime and input workflows. US4 (T017–T019)
follows the working P1 UI, then T020–T022 validate the complete feature.
T005 may require school access/whitelisting and a separately approved host; report
that dependency rather than claiming the gate passed or starting full UI work.

## Parallel opportunities by story

US1: editor and runtime work can be delegated to separate branches after exact
message fields are agreed; UI integration is sequential. US2: mailbox and page
controls have distinct files but require a frozen contract first. US3: session
helper can be prepared separately; main.js integration and evidence are sequential.
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
