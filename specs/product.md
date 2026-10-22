# Product specification — draft

Status: agreed product direction and remaining questions; no implemented application.
Product name: **Klode**, selected by the product owner on 2026-10-22 (formerly Codeklad).

## Goal

Provide a minimal online programming editor for education and exams, without AI
assistance and with control over availability and functionality.

## Agreed requirements

- First version: Python in one file, `main.py`, with editor and input/output.
- Responsive layout, including smaller screens.
- Follow the system theme with a manual light/dark override.
- Prefer modern JavaScript and a simple build/maintenance process; use proven
  libraries where they add value, especially for editing.
- Exam devices are locked Windows laptops. Internet access is restricted by a URL
  whitelist to ans.app and selected editor environments; no additional specialised
  lockdown software was identified by the product owner.
- Python `input()` must be interactive. An input field in the interface, inspired
  by wasm.ch, is the proposed interaction; exact implementation is to be validated.
- Students transfer code by copying from the editor and pasting into ans.app.
- Code persistence between sessions is not required. This does not decide whether
  code should survive a page reload within the same session.
- SQL and other languages are future wishes, outside the first version.

## Proposed technical direction

Pyodide in a Web Worker, an established editor library and all required assets
served from an allowed origin. Static hosting remains a proposal; Netlify was
mentioned but not selected. Feasibility must be demonstrated on an actual exam
laptop with the whitelist in effect, including a cold load without cached assets.
A URL whitelist is restricted connectivity, not a requirement for fully offline use.

## Remaining questions

- Required standard-library modules, external packages, files and graphics.
- Exact Windows browser/version, opening route (tab/window/embed) and an exam
  reference exercise; these are needed for the actual-environment test.
- Permitted editor assistance, including automatic completion.
- Code recovery on reload within a session and preference persistence.
- Exact whitelisted URL/origin and hosting response-header capabilities.

## Decision provenance and repository identity

The product owner confirmed the exam constraints, interactive input, copy/paste
transfer, lack of a cross-session persistence requirement, and the name Klode on
2026-10-22. These decisions are recorded under issue #3. The physical repository
and local directory still use `codeklad` while the rename is prepared separately;
existing URLs and identifiers remain valid during review.
