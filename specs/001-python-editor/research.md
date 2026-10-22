# Research: Klode's first Python editor

Date: 2026-10-22. Design decisions below are proposed for implementation review;
none constitute actual exam-laptop or hosting evidence.

## Runtime and execution

Decision: use a pinned Pyodide release in a module Web Worker, with explicit
runtime URL and locally packaged assets. Pin and record exact runtime/browser
versions in the feasibility work before relying on compatibility.
Rationale: Python runs in the browser without a backend, and a worker keeps the
UI responsive. Do not load packages from imports or fetch CDN resources at runtime.
Alternatives: main-thread execution blocks editing; a remote Python service adds
hosting and whitelist dependencies. Ordinary worker messages alone cannot make
a synchronous input handler await an asynchronous UI event.
Sources: [workers](https://pyodide.org/en/stable/usage/webworker.html),
[deployment](https://pyodide.org/en/stable/usage/downloading-and-deploying.html).

## Interactive input

Decision: implement synchronous stdin in the worker with a SharedArrayBuffer
mailbox. Request input through a message; receive UTF-8 line bytes via shared
memory and Atomics notification. The worker waits; the main thread never does.
Use explicit run/request IDs, status and byte length; a zero-length answer is a
valid line. Bound the mailbox and visibly reject oversize input without truncation;
the precise capacity is an implementation constant recorded in the contract.
Stop terminates the worker and recreates it, invalidating old run IDs.
Rationale: the Python call must resume in the same execution after the student's
answer. A waiting worker cannot receive ordinary message callbacks.
Alternatives: browser prompts are less integrated; pre-supplied input fails the
interactive requirement; a different execution mechanism needs its own proof.
Sources: [stdin](https://pyodide.org/en/stable/usage/streams.html),
[Atomics.wait](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait),
[termination](https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate).

## Hosting and exam gate

Decision: target a standalone top-level editor tab, pending confirmation that
this opening route is permitted in the real exam. Require HTTPS and headers
`Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp`. Check crossOriginIsolated in both
window and worker; package all application/runtime resources on the allowed
editor origin. No iframe integration is assumed.
Rationale: shared memory needs cross-origin isolation. Manual copy/paste into
ans.app does not depend on preserving an opener reference. Whitelisting permits
approved network access and does not imply fully offline operation.
Alternatives: embedding needs cooperation from ans.app; CDN dependencies introduce
additional whitelist entries. If the real opening route or hosting cannot meet
these conditions, stop at feasibility and seek a revised design before full UI work.
Sources: [COOP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Opener-Policy),
[COEP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy).

## Editor and build

Decision: modern JavaScript, no UI framework, Vite for a development server and
static build, and explicitly selected CodeMirror 6 extensions for Python syntax
and indentation. Do not use basicSetup or include autocompletion. Pin supported
Node/tool versions and all dependency versions in the first setup task.
Rationale: a single page needs little framework machinery, while bundling proven
editor packages is useful. Preserve plain selection and Ctrl+C transfer.
Alternatives: a textarea lacks the agreed highlighting/indentation; basicSetup
includes unwanted assistance.
Sources: [Vite](https://vite.dev/guide/),
[CodeMirror setup source](https://raw.githubusercontent.com/codemirror/basic-setup/main/src/codemirror.ts).

## Source lifecycle and Python scope

Feedback #20 supersedes the original sessionStorage recovery decision. Keep the
editor document independent from worker lifetimes but do not save/restore source
through application storage; ignore existing values and initialise normal content
on reload. No storage warning or alternative persistence mechanism is required.
Historical recovery results apply only to their recorded implementation commits.
The runtime-supported standard library is the first-version scope. Explicitly
document browser-runtime limits; do not promise desktop CPython module parity.
No extra packages, file-import/export workflows or graphics.
Sources: [Pyodide constraints](https://pyodide.org/en/stable/usage/wasm-constraints.html).

## Research outcome

No unresolved conceptual design question prevents planning. Browser/version,
actual opening route, approved URL and candidate host header support are explicit
execution prerequisites for the feasibility gate, not assumed successful results.
Exact version selection and mailbox limits are recorded implementation constants.
