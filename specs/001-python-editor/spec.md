# Feature Specification: minimal Python editor

**Feature Branch**: `001-python-editor`
**Created**: 2026-10-21
**Updated**: 2026-10-22
**Status**: Approved scope revised by feedback round 1 (#19–#24); public deployment
exists, revised implementation pending. Actual school acceptance remains pending.
**Input**: Product-owner discussion, issue #3, `specs/product.md`, constitution
v1.0.1; merged product-name base `bb356fc`.

Klode is the product name selected on 2026-10-22. The scope and plan
were approved before implementation; acceptance evidence remains subject to review.

## Clarifications

### Session 2026-10-22

- Exam environment: locked Windows laptop, network access only to ans.app and
  selected editor URLs on a whitelist; no additional specialised lockdown software.
- `input()` must be interactive; feedback round 1 requires input directly within
  the console with accepted-answer echo and newline (see FR-003).
- Native copy must preserve exact source; ans.app is a contextual exam destination.
- Feedback round 1 supersedes same-session reload recovery: no application-managed
  source save/restore, including existing stored source; reload uses initial content.
- Use the standard library supported by the selected browser runtime; no extra
  packages, user file workflows or graphics in the first version.
- Provide syntax highlighting and automatic indentation; no code completion.
- Product name: Klode, replacing Codeklad.

## User Scenarios & Testing

### User Story 1 - Write and run Python (Priority: P1)

As a user, I want to edit and run one Python program without AI assistance.

**Why this priority**: This is the core purpose of the product.
**Independent Test**: Enter `print(2 + 3)` in `main.py`, run it and see `5`.

**Acceptance Scenarios**:

1. **Given** the editor is open, **When** the student edits code,
   **Then** they edit one file named `main.py`.
2. **Given** `print(2 + 3)`, **When** the student runs the program,
   **Then** the output contains `5`.
3. **Given** invalid code, **When** it runs,
   **Then** an error is displayed and the code remains available for correction.

### User Story 2 - Answer an interactive prompt (Priority: P1)

As a user, I want to answer `input()` while a program is running.

**Why this priority**: Interactive input is explicitly required for the first version.
**Independent Test**: Run `name = input("Name: "); print("Hello", name)`, wait
until the prompt appears, enter `Ada`, and see `Hello Ada` without restarting.

**Acceptance Scenarios**:

1. **Given** a running program reaches `input()`, **When** no answer is submitted,
   **Then** it waits for the student's answer and the prompt is visible.
2. **Given** the program is waiting, **When** the student submits a line,
   **Then** that line is echoed once beside the prompt with a newline before
   subsequent output, returned to `input()` and the same execution continues.
3. **Given** two sequential calls to `input()`, **When** the student answers each,
   **Then** answers are delivered in order to the corresponding calls.
4. **Given** the program requests input, **When** an empty line is submitted,
   **Then** `input()` returns an empty string rather than treating it as no answer.

### User Story 3 - Work on an exam laptop and transfer code (Priority: P1)

As a student, I want to use Klode on the exam laptop and copy my code into ans.app.

**Why this priority**: A normal-browser test alone does not establish exam suitability.
**Independent Test**: Open the editor on the actual restricted Windows laptop,
run a reference exercise and paste its code into ans.app.

**Acceptance Scenarios**:

1. **Given** only the agreed exam URLs are allowed and the browser cache is empty,
   **When** the student opens Klode and runs the input/output reference cases,
   **Then** no required resource needs an unapproved URL.
2. **Given** multiline code in the editor, **When** the student selects and copies
   it and pastes it into ans.app, **Then** content, newlines and indentation survive.
3. **Given** edited code or an old stored source value, **When** the page reloads,
   **Then** the application starts its normal initial document without restoring source.
4. **Given** current code (including edits made during a run), **When** execution
   finishes, fails, is stopped or theme changes, **Then** current source is unchanged.

### User Story 4 - Choose a readable display (Priority: P2)

As a user, I want a responsive interface with system, light and dark themes.

**Why this priority**: These usability requirements are already agreed.
**Independent Test**: Use narrow/wide viewports and system/manual themes.

**Acceptance Scenarios**:

1. **Given** no manual override, **When** Klode opens, **Then** it follows system theme.
2. **Given** current code, **When** the student selects light/dark,
   **Then** the display changes without removing that code.
3. **Given** a narrow window, **When** editing and running,
   **Then** the editor, input/output and necessary controls remain reachable.

### Edge Cases

Agreed error handling:

- Invalid code shows an error and remains editable.
- Runtime loading failures produce a readable error state.
- An endless loop or input wait can be stopped without losing current editor code.
- Repeated run requests do not create confusing concurrent executions.
- Multiline code and blank input lines are preserved correctly.
- Reload does not restore source from application storage; unavailable storage
  does not require a source-recovery warning. Browser-native history is not a guarantee.
- Rejected, oversized, duplicate or stale answers are not echoed as accepted input.
- Stop remains responsive during output floods; finite output is never silently truncated.

## Requirements

### Functional Requirements

- **FR-001**: Support Python in one file named `main.py` in the first version.
- **FR-002**: Let the student edit, run and inspect program output/errors.
- **FR-003**: Support interactive `input()`, including visible prompts, ordered
  responses and empty lines. Input is entered within the console at the prompt,
  accepted answers are echoed exactly once with a newline before subsequent output,
  and previous transcript is read-only. Pre-supplied input alone is insufficient.
  Focus/reveal pending input within the console without scrolling to the bottom
  of the whole page, including short/narrow screens; retain transcript selection/copy.
  This is stdin for a running script, not a standalone command REPL.
- **FR-004**: Provide a responsive editor and input/output interface.
- **FR-005**: Follow system theme and allow manual light/dark selection.
- **FR-006**: Provide no AI assistance.
- **FR-007**: Demonstrate the workflows on the restricted Windows exam laptop,
  with ans.app and only the approved editor URLs accessible.
- **FR-008**: Exclude SQL and other languages from the first version.
- **FR-009**: Support copying code into ans.app with line breaks and indentation intact.
- **FR-010**: Do not save or restore source via sessionStorage, localStorage or a
  substitute application persistence mechanism. Ignore existing `klode.source.v1`
  content and initialise normal starting content after reload; omit recovery and
  storage-failure copy. Preserve current edits through Run/errors/Stop/theme changes.
- **FR-011**: Use the selected runtime's supported standard library, without extra
  packages, user file workflows or graphics. Document runtime compatibility limits.
- **FR-012**: Provide syntax highlighting and automatic indentation, without code
  completion. No AI assistance is allowed.

- **FR-013**: Put Run/Stop in the upper editor header with correct enabled states
  and keyboard order. Retain responsive reachability at short/narrow sizes.
- **FR-014**: Give editor and console clear, rounded, padded keyboard focus in both
  themes, without clipping at the gutter or obscuring text/selection.
- **FR-015**: Use keyboard-operable local system/light/dark icons with accessible
  names, selected-state indication and visible focus, not an external icon CDN.
  Switching theme preserves source, execution and transcript.
- **FR-016**: Present a general online Python editor. Remove ans-specific transfer
  instructions, “Runs in your browser” and the hardcoded Python version. Retain
  “No code completion or AI assistance” and both approved taglines; add a subtle
  labelled repository link to https://github.com/hanze-hbo-ict/klode.
- **FR-017**: Provide a public README leading with the live URL and actual features,
  short local quickstart and limits. CONTRIBUTING links the established human/agent
  workflow and governance; do not claim unimplemented feedback is already live.

### Actual-environment test prerequisites

Before claiming exam suitability, record the Windows browser/version, actual
opening route (tab/window/embed), approved editor URL and a reference exercise.
These are validation prerequisites, not permission to invent new product scope.
The plan can proceed with a feasibility gate that verifies these details. If
browser/hosting restrictions invalidate the proposed runtime design, stop and
return to the product owner instead of weakening interactive input or the whitelist.

### Key Entities

- **Program**: Student-authored contents of `main.py`.
- **Execution**: One run with output, errors and zero or more input requests.
- **Input request**: A pending request for one line, answered during the same run.
- **Theme preference**: System-following or manual light/dark; cross-session retention is not required.
- **Reference exercise**: Exam task with required capabilities and expected outcomes.

## Success Criteria

### Measurable Outcomes

Acceptance criteria:

- **SC-001**: `print(2 + 3)` produces `5`; editing and running again works.
- **SC-002**: A syntax error is displayed and the corrected code runs in the same editor.
- **SC-003**: A two-prompt program accepts answers in order during execution,
  including an empty line; the UI remains usable while waiting.
- **SC-004**: All agreed reference cases pass on the actual exam laptop from a
  cold browser cache without access to unapproved URLs.
- **SC-005**: A multiline program pasted into ans.app preserves its exact content.
- **SC-006**: At viewport widths of 360 and 1280 CSS pixels, editor, input/output
  and necessary controls remain reachable.
- **SC-007**: System and both manual themes work without removing current code.
- **SC-008**: Reload starts normal initial content after nonempty/empty edits and
  with an old storage value present. No application source save/restore or recovery
  warning occurs; Run/errors/Stop/theme preserve current edits.
- **SC-009**: The editor highlights syntax and indents automatically without
  suggesting completions or AI-generated content.

Evidence records the application commit, browser/version, whitelist, opening route,
reference cases, expected/actual results and limitations. A normal-browser test is
reported separately from actual exam-laptop evidence.

## Assumptions

- The product owner provides or confirms the remaining exam test details.
- Netlify hosts the public editor; actual school-whitelist validation remains open.
- A URL whitelist does not require operation with every network connection disabled.
- Extra packages, user file workflows and graphics are excluded by the accepted
  first-version scope. Account functionality is not part of this feature.
- The existing implementation uses Pyodide, a worker, CodeMirror and same-origin
  assets. These technical choices do not expand product scope.

## Next steps and stop conditions

The local runtime spike is implemented and the continuation decision below
authorises local editor work. Complete the remaining school-environment gate.
Do not claim actual exam compatibility until the Windows/whitelist cases pass, and do not publish before
the human merge gate and release checks. Escalate restrictions that require scope
or criteria changes to the product owner.

## Product-owner continuation decision — 2026-10-22

The product owner reports the LAN HTTPS input spike works in their libvirt
Windows VM using Edge, and explicitly authorises continuing with the editor.
This is user-reported VM smoke evidence; exact OS/browser versions and per-case
results were not supplied. It is not a passed school-laptop whitelist test.

On this basis, local UI/runtime implementation may proceed before the remaining
school-environment evidence. The actual Windows school whitelist, opening route,
reference exercise, cold loading and ans.app clipboard checks remain mandatory
before claiming exam suitability or releasing for exam use. T005–T006, T016 and
T021 remain incomplete until that evidence is collected/reviewed. This decision
supersedes the earlier implementation stop on unavailable school-device access;
it does not weaken the product requirements or authorise production deployment.

## Feedback-round acceptance — 2026-10-22 (#19–#24)

This revision supersedes conflicting recovery/UI wording in earlier design and
acceptance records; those records remain historical evidence for their commits.
Verify `naam = input("Jouw naam? "); print("Hello", naam)` with answer `Misja`
produces exactly `Jouw naam? Misja\nHello Misja\n`. Cover empty, Unicode, successive
and non-newline prompts, rejected input, Stop/rerun/stale events, safe read-only
history, lossless finite output and Stop during floods. Python receives the entered
line using normal `input()` semantics, without displayed prompt or duplicated newline.

Verify upper controls, focus, long code/output and pending input at 1280×720 and
360×640 in light/dark/system modes, without page horizontal overflow or loss of
copy/selection. Theme icons expose names and selected state without relying solely
on colour/shape. Public docs distinguish implemented/live behaviour from planned
changes. No packages, files, extra language or standalone REPL is added.
