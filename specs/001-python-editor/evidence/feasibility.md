# Input feasibility evidence — issue #13

Baseline: approved specification commit `9112431`, constitution 1.0.1;
implementation base `3e53c7d`, branch `013-input-feasibility`.
Implementation commit: pending independent review and final commit.
This report covers local T001–T004 preparation. T005–T006 remain blocked on
actual-environment evidence; no full editor work or publication is authorised.

## Pinned setup and reproducibility

Node 24.19.0; npm 11.16.0; Vite 8.3.5; Pyodide 314.0.7 (lock metadata:
CPython 3.14.2, Emscripten 5.0.3, wasm32 ABI 2026_0).
CodeMirror view 6.43.15, state 6.7.6, language 6.13.1, lang-python 6.2.1 are
pinned for future editor implementation, unused by this spike. Exact npm versions
and transitive archive integrities are in package-lock.json. Vite's declared Node
range includes the pinned Node release; Pyodide's Node range is >=18.

`npm ci` retrieves the locked build dependencies; vendoring then verifies SHA-256
for each of the five local runtime files. Its total is 13,531,207 bytes before HTTP
compression. No build-time CDN fetch is needed beyond npm installation. Generated
runtime files, node_modules and dist are ignored so giant binary artifacts are
reconstructed from the lockfile rather than committed. Licenses/notices are
tracked in public/runtime and copied into the build. The static build retains the
same-origin runtime and worker. There is no automatic package loading from imports.

## Local checks

- `npm ci --offline` with the populated local npm cache: clean locked install
  completed; npm audit reported zero vulnerabilities.
- `npm test`: three test groups passed (empty/Unicode/exact capacity, oversize,
  stale/duplicate identity rejection, multiline rejection, real worker wait and
  real pinned-runtime empty/Unicode input regression).
- `npm run build`: completed; vendoring checksummed all files and Vite built the
  isolated HTML plus module worker.
- Independent production-browser results: initial empty-answer test exposed a
  browser-specific OSError: TextDecoder rejected a SharedArrayBuffer-backed view
  inside stdin. Copying payload bytes into an ordinary ArrayBuffer fixes that
  incompatibility; explicit line endings are also supplied. Node runtime regression
  passes but did not detect that browser-only restriction.
- Independent production browser: Chrome 156.0.8078.47 on Linux, fresh profile,
  local production preview; 16 cases passed after repair. External DNS was blocked
  except localhost/127.0.0.1. Repeated empty/Unicode input, no-newline prompt,
  responsive UI during wait/loop, oversize rejection/valid retry, Stop wait/loop
  and rerun with preserved source, stale answer rejection, fresh globals, literal
  HTML output, math/unavailable imports all passed. Independent no-header test
  also passed (visible capability failure and disabled Run).
- Repository `npm run test:browser`: actual Chromium regression with pinned
  playwright-core 1.64.1, installed Chrome, production preview, fresh contexts.
  Passed input/Stop/oversize/stale/stdlib cases and missing-header failure. It
  blocked non-preview requests and observed all five same-origin runtime fetches
  including worker-originated wasm/stdlib requests; none went off origin.

Local browser startup uses the secure-context localhost exception, not HTTPS.
No production cold-load timing or actual-school network result is available.

The spike documents its exact wire fields and 65,536-byte mailbox in
experiments/input-spike/README.md. Source and output use a technical textarea/UI;
this does not implement the full product editor or its user-story acceptance.

## Actual Windows/whitelist gate — NOT EXECUTED

Confirmed by the product owner: locked Windows laptop, Microsoft Edge, network
whitelist allowing ans.app and selected editor URLs, no specialised lockdown
software. Opening in a new window is provisional and must be confirmed in testing.

Still needed:

- Actual Edge and Windows versions, device/tester/date, exact opening route.
- Human-approved candidate HTTPS origin and confirmed COOP/COEP response headers
  (coordinate provisioning through #4; this change selects no host).
- School-approved complete origin/path whitelist and cold-cache network trace with
  every unapproved destination blocked; window/worker cross-origin isolation.
- Agreed reference exercise, exact expected outcomes and actual results.
- Repeated/empty/Unicode input, prompt without newline, finite-limit rejection,
  Stop in wait/loop followed by rerun, and native code copy into ans.app.
- Measured cold-load duration and transferred asset sizes on that environment.
- Independent review against the gate (T006).

Local localhost headers and local browser success cannot substitute for those
checks. Stop here before implementing T007 onward. No production/exam suitability
is claimed. Runtime-supported stdlib excludes desktop-only/process/socket modules
and unavailable packages; no extra packages, user files or graphics are provided.

## API sources

Implementation checked against official
[Pyodide 314.0.7 streams](https://pyodide.org/en/314.0.7/usage/streams.html),
[deployment](https://pyodide.org/en/314.0.7/usage/downloading-and-deploying.html)
and [Vite configuration](https://vite.dev/config/server-options.html).
