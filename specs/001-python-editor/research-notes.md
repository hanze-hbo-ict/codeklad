# Preliminary feasibility notes — interactive input

Date: 2026-10-22. This is research input, not a completed implementation plan
or evidence of compatibility with the exam laptop.

## Confirmed requirement

The student must answer Python `input()` during execution. A field in the page
is the product owner's proposed interaction, inspired by wasm.ch. Preloading
all responses before execution does not satisfy the requirement.

## Findings from primary documentation

[Pyodide standard streams](https://pyodide.org/en/stable/usage/streams.html)
exposes `setStdin()` and line-oriented input handlers. This supports replacing
the default browser-prompt behaviour with application-controlled input. It does
not by itself demonstrate that a Promise-returning handler can pause synchronous
Python while waiting for a page input event.

[Pyodide workers](https://pyodide.org/en/stable/usage/webworker.html) describes
running Python outside the UI thread and exchanging messages. A worker cannot
access the DOM directly. The runtime version, worker setup and interaction
between synchronous stdin and asynchronous page events must be validated together.

The [wasm.ch reference](https://wasm.ch/) was opened, but its rendered input
behaviour was not verified by this research. No claim of equivalent implementation
is made.

## Proposed feasibility work

1. Pin a runtime version and demonstrate two sequential input requests answered
   through the page while the program remains in the same execution.
2. Cover visible prompts without trailing newlines, empty lines, Unicode input,
   cancellation during input wait, and stopping a busy program.
3. Investigate the communication mechanism and any requirements it places on
   browser capabilities, hosting headers and embedding; do not assume that worker
   messages alone make synchronous Python input await asynchronous UI events.
4. Package required runtime/editor assets under approved URLs and test a cold
   browser cache with all unapproved network destinations blocked.
5. Repeat the input and multiline copy/paste-to-ans.app cases on the actual
   Windows exam laptop. Record browser/version, opening route, whitelist,
   response headers, application commit and results.

No fully offline requirement follows from the whitelist restriction. Package,
file and graphics support remain open scope questions. Browser/opening details
and the approved URL remain prerequisites for the actual-environment test.
