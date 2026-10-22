# Feature Specification: minimal Python editor

**Feature Branch**: `001-python-editor`
**Created**: 2026-10-21
**Updated**: 2026-10-22
**Status**: Draft; confirmed decisions recorded, remaining scope questions open.
**Input**: Product-owner discussion, issue #3, `specs/product.md`, constitution
v1.0.0; latest merged project-agreement base `c95b156`.

Klode is the product name selected on 2026-10-22. Concrete error-handling and
acceptance proposals below remain subject to the human product owner's review.

## Clarifications

### Session 2026-10-22

- Exam environment: locked Windows laptop, network access only to ans.app and
  selected editor URLs on a whitelist; no additional specialised lockdown software.
- `input()` must be interactive. An interface input field is proposed, inspired
  by wasm.ch; the implementation needs feasibility evidence.
- Transfer: copy code from the editor and paste it into ans.app.
- There is no requirement to preserve code between sessions. Reload recovery
  within a session has not been decided.
- Product name: Klode, replacing Codeklad.

## User Scenarios & Testing

### User Story 1 - Write and run Python (Priority: P1)

As a student, I want to edit and run one Python program without AI assistance.

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

As a student, I want to answer `input()` while a program is running.

**Why this priority**: Interactive input is explicitly required for the first version.
**Independent Test**: Run `name = input("Name: "); print("Hello", name)`, wait
until the prompt appears, enter `Ada`, and see `Hello Ada` without restarting.

**Acceptance Scenarios**:

1. **Given** a running program reaches `input()`, **When** no answer is submitted,
   **Then** it waits for the student's answer and the prompt is visible.
2. **Given** the program is waiting, **When** the student submits a line,
   **Then** that line is returned to `input()` and the same execution continues.
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
3. **Given** a completed session, **When** a new session starts,
   **Then** recovering code from the earlier session is not an acceptance requirement.

### User Story 4 - Choose a readable display (Priority: P2)

As a student, I want a responsive interface with system, light and dark themes.

**Why this priority**: These usability requirements are already agreed.
**Independent Test**: Use narrow/wide viewports and system/manual themes.

**Acceptance Scenarios**:

1. **Given** no manual override, **When** Klode opens, **Then** it follows system theme.
2. **Given** current code, **When** the student selects light/dark,
   **Then** the display changes without removing that code.
3. **Given** a narrow window, **When** editing and running,
   **Then** the editor, input/output and necessary controls remain reachable.

### Edge Cases

Proposed error handling, to be confirmed in review:

- Invalid code shows an error and remains editable.
- Runtime loading failures produce a readable error state.
- An endless loop or input wait can be stopped without losing current editor code.
- Repeated run requests do not create confusing concurrent executions.
- Multiline code and blank input lines are preserved correctly.
- Reload recovery and permitted editor assistance remain open under Q3.

## Requirements

### Functional Requirements

- **FR-001**: Support Python in one file named `main.py` in the first version.
- **FR-002**: Let the student edit, run and inspect program output/errors.
- **FR-003**: Support interactive `input()`, including visible prompts, ordered
  responses and empty lines; pre-supplied input alone is insufficient.
- **FR-004**: Provide a responsive editor and input/output interface.
- **FR-005**: Follow system theme and allow manual light/dark selection.
- **FR-006**: Provide no AI assistance.
- **FR-007**: Demonstrate the workflows on the restricted Windows exam laptop,
  with ans.app and only the approved editor URLs accessible.
- **FR-008**: Exclude SQL and other languages from the first version.
- **FR-009**: Support copying code into ans.app with line breaks and indentation intact.
- **FR-010**: Cross-session code persistence is not required; do not infer a reload
  recovery policy or a prohibition on storage from this decision.

### Remaining product decisions and test prerequisites

- **Q1 — Exam evidence**: [NEEDS CLARIFICATION: Confirm the Windows browser/version,
  tab/window/embed opening route, whitelisted URL and reference exercise.]
- **Q2 — Python scope**: [NEEDS CLARIFICATION: Which standard-library modules,
  external packages, files and graphics are required for the first version?]
- **Q3 — Editor assistance and same-session recovery**: [NEEDS CLARIFICATION:
  Is automatic completion allowed; should code survive a reload within a session,
  and should preferences persist?]

### Key Entities

- **Program**: Student-authored contents of `main.py`.
- **Execution**: One run with output, errors and zero or more input requests.
- **Input request**: A pending request for one line, answered during the same run.
- **Theme preference**: System-following or manual light/dark; retention undecided.
- **Reference exercise**: Exam task with required capabilities and expected outcomes.

## Success Criteria

### Measurable Outcomes

Acceptance proposals to be confirmed by the product owner:

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

Evidence records the application commit, browser/version, whitelist, opening route,
reference cases, expected/actual results and limitations. A normal-browser test is
reported separately from actual exam-laptop evidence.

## Assumptions

- The product owner provides or confirms the remaining exam test details.
- Hosting has not been selected and actual exam validation has not been performed.
- A URL whitelist does not require operation with every network connection disabled.
- Extra packages, graphics, multiple files, accounts and reload recovery have not
  been silently included or ruled out.
- Pyodide, a worker, an established editor and same-origin assets remain technical
  proposals to validate, rather than product decisions.

## Next steps and stop conditions

Resolve remaining scope questions and confirm proposed criteria, then produce
an implementation plan, feasibility work and implementation tasks. Do not
implement or publish an app before scope agreement. Escalate exam restrictions
that require scope or criteria changes to the product owner.
