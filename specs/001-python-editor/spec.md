# Feature Specification: minimal Python editor

**Feature Branch**: `001-python-editor`
**Created**: 2026-10-21
**Updated**: 2026-10-22
**Status**: Proposed baseline; product scope clarified, technical plan ready for review.
**Input**: Product-owner discussion, issue #3, `specs/product.md`, constitution
v1.0.1; merged product-name base `bb356fc`.

Klode is the product name selected on 2026-10-22. Concrete error-handling and
acceptance proposals below remain subject to the human product owner's review.

## Clarifications

### Session 2026-10-22

- Exam environment: locked Windows laptop, network access only to ans.app and
  selected editor URLs on a whitelist; no additional specialised lockdown software.
- `input()` must be interactive. An interface input field is proposed, inspired
  by wasm.ch; the implementation needs feasibility evidence.
- Transfer: copy code from the editor and paste it into ans.app.
- Preserve code on page reload within the same session; cross-session persistence
  is not required.
- Use the standard library supported by the selected browser runtime; no extra
  packages, user file workflows or graphics in the first version.
- Provide syntax highlighting and automatic indentation; no code completion.
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
3. **Given** current code, **When** the page is reloaded within the same session,
   **Then** the exact editor source, including an empty document, is restored.
4. **Given** a completed session, **When** a new session starts,
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
- Reload restores the latest successfully saved same-session code, including empty
  code. If browser storage is unavailable, report the limitation without blocking
  editing or claiming recovery works.

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
- **FR-010**: Preserve current code across reloads within a session; cross-session
  persistence is not required.
- **FR-011**: Use the selected runtime's supported standard library, without extra
  packages, user file workflows or graphics. Document runtime compatibility limits.
- **FR-012**: Provide syntax highlighting and automatic indentation, without code
  completion. No AI assistance is allowed.

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

Concrete acceptance proposals for review:

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
- **SC-008**: Reload after editing restores the same code in that session; this
  includes deliberate deletion to an empty editor. A new session has no recovery
  requirement.
- **SC-009**: The editor highlights syntax and indents automatically without
  suggesting completions or AI-generated content.

Evidence records the application commit, browser/version, whitelist, opening route,
reference cases, expected/actual results and limitations. A normal-browser test is
reported separately from actual exam-laptop evidence.

## Assumptions

- The product owner provides or confirms the remaining exam test details.
- Hosting has not been selected and actual exam validation has not been performed.
- A URL whitelist does not require operation with every network connection disabled.
- Extra packages, user file workflows and graphics are excluded by the accepted
  first-version scope. Account functionality is not part of this feature.
- Pyodide, a worker, an established editor and same-origin assets remain technical
  proposals to validate, rather than product decisions.

## Next steps and stop conditions

Review this specification and its implementation plan/tasks. Begin with the
feasibility gate before implementing the full editor. Do not claim actual exam
compatibility until the Windows/whitelist cases pass, and do not publish before
the human merge gate and release checks. Escalate restrictions that require scope
or criteria changes to the product owner.
