# Local editor implementation evidence — issue #15

Historical evidence for the commits recorded below. Issue #28 retires the separate
spike application and moves current regressions to `tests/`; use Git history for
the original spike source and README. This record is not current product status.


Baseline: specification/continuation decision `a086775`, constitution 1.0.1;
merged local spike `e1c39e1`. Reviewed implementation head: see the PR and issue
handoff. This report is local validation, not completed exam acceptance.

## Implementation

One main.py CodeMirror document, explicit Python parser/highlighting/indentation
and undo bindings, without completion/AI extensions. Native selection/copy is
preserved. The production application is at `/`; the isolated spike remains at
`/experiments/input-spike/index.html`. Both reuse the shared module worker and
65,536-byte UTF-8 stdin mailbox. All resources remain on the application origin.
Stop terminates/recreates the runtime without editing source. Normal runs use
fresh globals; Stop also resets mutated runtime/module state. Python output and
errors are rendered as text. Lossless output batching/backpressure keeps Stop
responsive during endless printing; no arbitrary output cap is introduced.

Same-tab sessionStorage recovery restores exact Unicode source including empty
code. Blocked storage reports a visible warning and hides the recovery promise,
while editing/running remain available. System/light/dark themes and responsive
panels support 360/1280 CSS-pixel widths with keyboard focus.

Dependencies retain the pinned spike versions; @codemirror/commands 6.11.1 adds
standard editing/undo/Enter indentation behavior. pythonLanguage is used directly
rather than the completion-support Python convenience extension. The Application
workflow installs exact Node/npm and locked dependencies, runs tests/build/browser
regressions with runner Chrome, and has no deployment job. Tooling is unchanged.

## Local results

Validation in Linux with Node 24.19.0/npm 11.16.0 and Chrome 156.0.8078.47:

- Unit/runtime tests: five groups pass (mailbox identity/capacity/Unicode, real
  synchronous worker wait, pinned Pyodide input, empty-source persistence and
  storage failure handling).
- Static production build: passes; verifies all runtime checksums and includes
  same-origin runtime assets plus both HTML entry points.
- Application browser regression: 15 groups pass, including syntax/runtime error
  correction; ordered delayed empty/Unicode input; no-newline prompts; oversize
  rejection/retry; Stop during input, CPU loop and output flood; finite output
  preservation; fresh namespaces; safe output; native multiline Unicode copy;
  exact nonempty/empty reload; indentation/highlighting without completion;
  system/manual themes at 360/1280; blocked storage; same-origin worker/runtime
  loading; and visible no-isolation failure.
- Isolated-spike browser regression: seven groups pass after shared-runtime refactor.
- Independent parent browser suite: 32 checks passed on Linux/Chrome
  156.0.8078.47, including output-flood Stop, exact finite output, input/copy/reload,
  indentation, themes/responsiveness, storage failure and all five same-origin
  worker runtime resources. Final reviewed head is recorded in the PR/issue.

The initial independent test found Stop blocked by endless printing. Worker
output now uses bounded chunks and shared-memory frame acknowledgements; the
page batches text updates, retains all output and scrolls to the prompt/result
at input/completion boundaries. Local regressions cover this failure and exact
finite output, including flushed stdout/stderr order and final non-newline text.
The native read-only console avoids rich-DOM layout overhead. Editor dependency
MIT notices are retained in public/editor-licenses.txt and included in the build.

Browser tests use fresh contexts with non-origin requests blocked, observing
worker module/wasm/stdlib traffic. They cover native clipboard locally; they do
not establish clipboard transfer into ans.app or a school whitelist result.
The no-isolation case requires a visible startup failure and disabled Run.

## User-reported VM evidence

The product owner reported the LAN HTTPS spike works in a libvirt Windows VM
using Edge and authorised proceeding with local editor implementation. Exact OS/
browser versions and per-case results were not supplied. This is smoke evidence,
not an actual school-laptop test, and does not claim the new editor is validated
there yet.

## Remaining acceptance and release gate

T005–T006, T016, T021–T022 remain incomplete. Required before claiming exam
suitability or releasing for exam use:

- Actual restricted Windows/Edge browser version, opening route and school whitelist.
- Approved HTTPS candidate origin, correct headers, cold-cache allowed-origin audit.
- Agreed reference exercise and expected/actual results on that laptop.
- Native multiline copy from this editor into ans.app, exact content comparison,
  nonempty/empty reload, input/Stop/theme/viewport cases on the actual device.
- Independent evidence review and human merge/release decision.

No host, deployment or repository rename is included. Local localhost uses a
secure-context exception and cannot prove production HTTPS. The bundled runtime
is CPython 3.14.2 via Pyodide 314.0.7; desktop subprocesses/native sockets and
unavailable modules are limited by the browser runtime. Extra packages, user file
workflows and graphics remain excluded. No import-triggered package installation
is performed; missing modules raise ordinary Python errors.
