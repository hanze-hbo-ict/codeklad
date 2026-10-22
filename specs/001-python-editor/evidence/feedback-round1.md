# Feedback round 1: local acceptance and review

Date: 2026-10-22. Work items: #19 (parent), #20–#24.
Specification baseline: `910088e76bc1b976e56d2f7a568a887fbf19b25b`, independently
approved before application implementation. Candidate reviewed and tested:
`e1e4bde7471b5c3a1d512c82ac4c07388efd3394` on `019-feedback-round1`.
Constitution: 1.0.1. Application change: `8f7fedd`; public documentation: `636a9cc`.

This report records local acceptance for the feedback revision. It does not
rewrite the earlier acceptance report, whose recovery results describe its
original implementation. Source recovery is superseded by #20.

## Checks and results

- `npm test`: 6/6 unit/runtime checks pass (empty/Unicode/capacity/stale input,
  synchronous worker resumption, pinned runtime, preview readiness/failure).
- `npm run build`: passes with verified local Pyodide 314.0.7 assets; no runtime
  download during packaging. Node 24.19.0, npm 11.16.0, Vite 8.3.5.
- Application browser suite: 18 passing acceptance groups using Chrome
  156.0.8078.47 on Linux against the production build. It rejects off-origin
  requests and observes all five runtime files on the local editor origin.
- Isolated spike browser suite: 7 passing groups with the same browser/runtime.
- `python3 scripts/check-tooling.py`: passes, including 22 manifest hashes.
- `git diff --check`: passes. Documentation's 20 local Markdown targets resolve.

The application checks establish:

| Work item | Observed result |
| --- | --- |
| #20 | Reload starts initial content after nonempty/empty edits. Old session/local source values are ignored and untouched. Blocked storage is never accessed and needs no warning. Native multiline/Unicode source copy is exact. Edits made during a run survive completion, errors, Stop and theme changes. No ans-specific UI remains. |
| #21 | Entering `Misja` at `Jouw naam? ` leaves exactly `Jouw naam? Misja\nHello Misja\n`. Empty/Unicode/successive input works. Oversized input is rejected without echo; duplicate/stale submissions add no accepted input. Read-only transcript renders literal markup safely and remains selectable/copyable. |
| #21 | Stop remains responsive during input wait, busy loops and output floods. All 10,000 numbered output lines survive multiple acknowledgement chunks; flushed stdout/stderr order and final tails remain intact. |
| #22 | Upper Run/Stop remain visible at 1280×720 and 360×640. Long source scrolls inside the editor; long output and pending input scroll within the console. Input focus leaves page scrollY at zero. No page horizontal overflow, including long prompts. |
| #23 | System/light/dark icon controls have names, pressed state and keyboard operation. Live system changes and manual overrides work without changing source/execution/transcript. Repository link, retained taglines and no-assistance copy verified; hardcoded version/browser copy removed. |
| #24 | Public README and CONTRIBUTING match the generic product and established human/agent workflow. Live approved-main behaviour is distinguished from unmerged branches; exam acceptance remains separate. |

Visual inspection covered focused editor, pending-input console and light/dark
360×640 and 1280×720 screens. Focus borders are rounded, inset and padded; the
editor gutter does not cover them. Native DOM transcript selection may omit a
terminal line break when copied; the rendered transcript retains its exact newline.
Exact editor-source copying remains verified separately.

## Independent review

A separate read-only reviewer approved both the specification baseline and the
complete candidate `e1e4bde7471b5c3a1d512c82ac4c07388efd3394`, with no blocking
findings. The reviewer independently ran the six unit checks and a Chrome 156
360×640 probe: consecutive ASCII/Unicode/empty/literal-HTML answers produced the
exact transcript, no HTML was injected, read-only history focus was visible,
and page scrollY remained zero without horizontal overflow. They inspected the
full diff, browser report and mobile screenshot. They made no implementation edits.
The orchestrator owns this report and task-status update after that review.

## Remaining gates

Human merge approval is still required for production. The existing Netlify
integration automatically built a PR preview after PR #25 was opened:
https://deploy-preview-25--klode.netlify.app/ (initial preview deployment
`6ada6f475e5929add6402f4d`). No production release was requested.
After merge, verify the released Netlify commit and live headers,
runtime loading and core editor/input/Stop behaviour using `docs/hosting.md`.

Actual restricted school Windows/Edge browser/version, opening route, cold-load
whitelist and reference exercise/ans.app clipboard evidence remain under #13.
Local Chrome and the earlier user-reported Windows VM smoke test do not establish
that separate school acceptance.

## Local-preview refinement acceptance (#26)

The product owner then requested a single cycling theme control, the payoff back
below the workspace and visually undecorated console input without a Send button.
Updated spec `7403d75` was independently approved before app commit `8f87e90`.
The complete refinement candidate `b90b836942f49c92c9438c2b07443525d1c8ce3c` was
independently approved with no findings. The reviewer inspected the implementation,
updated test helpers, mobile screenshot and passing browser report without editing
the implementation. This section/task-status update is the orchestrator's report.

Local validation passes: six unit/runtime checks, production build, 18 application
browser groups, seven isolated-spike groups, tooling metadata and whitespace.
Browser: Chrome156.0.8078.47. At1280×720/360×640, the one native button displays only
the current mode's SVG, names current/next mode and cycles System→Light→Dark using
click/Enter/Space. System following/manual overrides and current source remain
intact. Input is transparent, borderless and without a Send button; native Enter
submission, accessible name/help and console-level focus remain. The exact name
example, empty/Unicode/repeated/oversized/stale input, Stop, complete10000-line
output, edits during execution and native clipboard cases still pass. The payoff
sits below the workspace. Visual light/dark screens preserve unclipped focus.

The updated static build is served at the existing LAN URL
https://192.168.1.5:4444/ using the existing certificate and isolation headers.
Run/Stop behaviour is deliberately unchanged; the open product decision is tracked
separately in #27. Neither this review nor the preview authorises production merge
or claims actual-school acceptance.
