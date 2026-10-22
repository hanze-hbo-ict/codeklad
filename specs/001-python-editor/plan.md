# Implementation Plan: Klode minimal Python editor

**Branch**: `001-python-editor` | **Date**: 2026-10-22 | **Spec**: [spec.md](spec.md)
**Input**: Product-owner decisions recorded under #3; constitution v1.0.1.
**Status**: Approved plan; local editor implementation under review (#15).
School-environment acceptance and human merge/release gates remain pending.

## Summary

Build a static single-page JavaScript application with CodeMirror 6 and Pyodide
in a module worker. Interactive input uses a shared-memory mailbox; editor code
survives same-session reload through sessionStorage. Prove runtime input and
whitelisted loading before building the full interface. Keep all runtime assets
on the approved origin. No framework, backend, extra packages, user file workflows,
graphics, completion or AI features.

## Technical Context

**Language/Version**: Modern JavaScript ES modules; Python via pinned Pyodide.
Pin exact supported Node, Vite, CodeMirror and Pyodide versions during setup.
**Dependencies**: Vite, explicit CodeMirror Python/highlighting/indentation extensions,
locally packaged Pyodide runtime/stdlib; npm lockfile. Existing uv remains dev tooling.
**Storage**: sessionStorage for current editor code; no backend or cross-session requirement.
**Validation**: production build, browser acceptance cases in quickstart, network
origin audit, input/cancellation/reload scenarios; retain existing Tooling checks.
**Target**: locked Windows exam laptop with whitelisted network access; actual
browser/version and opening route recorded at feasibility. Standalone tab is a
design proposal, not a confirmed school workflow.
**Project type**: Static web application.
**Performance**: UI remains interactive during Python execution/input wait;
collect cold-load timing and asset sizes during feasibility without inventing an SLA.
**Constraints**: HTTPS, cross-origin isolation for shared memory, allowed-origin-only
asset loading, ordinary copying into ans.app, one file main.py.
**Scope**: One local student program and one active execution; no server state.

## Constitution Check

Pre-design: pass. One-file Python/no AI, responsive themes, simple modern JS,
proven editor, explicit spec, isolated work and independent review are retained.
Post-design: pass. Exact exam evidence is gated, not claimed; no hosting vendor,
new product scope or autonomous publication is selected. Node/Vite supplement
uv tooling for browser assets and do not add a Python backend.

## Feasibility gate

The implemented local runtime spike proves input, Unicode,
empty answers, visible non-newline prompts, Stop/restart, same-origin cold loading
and required local isolation headers. The product owner also reports successful
LAN HTTPS use in a Windows/Edge VM. Under the continuation decision below, local
UI implementation may proceed. Actual school browser, opening route, whitelist
and candidate HTTPS host evidence remain an acceptance/exam-use release gate.
No silent fallback to preloaded input or an unapproved CDN.
Candidate hosting/deployment must follow the existing human gate; preparing this
plan does not select hosting or authorise publication. Coordinate provisioning
with #4 and report a blocker if the actual-environment gate cannot be executed.

## Project Structure

```text
specs/001-python-editor/
  spec.md, plan.md, research.md, data-model.md, quickstart.md, tasks.md
  contracts/ui-runtime.md
  evidence/feasibility.md, evidence/acceptance.md  # local/actual results kept separate
index.html
src/
  main.js, editor.js, output.js, input.js, session.js, theme.js, styles.css
  runtime/client.js, runtime/worker.js, runtime/input-mailbox.js
public/runtime/<pinned-version>/
scripts/vendor-runtime.mjs
package.json, package-lock.json, vite.config.js
```

## Delivery strategy

1. Setup and isolated feasibility spike, with an independent evidence review.
2. Editing/execution, then interactive input, clipboard/reload recovery, then themes.
3. Build/origin audit and actual Windows acceptance evidence.
4. Independent review and human merge decision for every implementation PR;
   publication follows only the approved release route.

Treat each story as an independently verifiable increment. Full first-version
acceptance requires all P1 stories and the agreed responsive/theme requirements.
GitHub issues own status and handoffs; tasks.md is the dependency decomposition.
No constitution exceptions or additional complexity waivers are proposed.

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
