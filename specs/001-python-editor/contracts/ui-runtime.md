# UI/runtime contract

## User interaction

One editor labelled main.py, Run and Stop, output/error region, a labelled
line-input control when Python requests input, and system/light/dark themes.
No completion UI, AI, package-install controls, file manager or graphics panel.
Allow normal select/copy shortcuts without rewriting selected code. Preserve code
on reload in the same session; warn if browser storage prevents that guarantee.

## Messages

Main-to-worker: initialise(runtime URL, shared mailbox), run(run ID, source).
Worker-to-main: ready, output(run ID, channel, text), input-request(run ID,
request ID), completed(run ID), failed(run ID, error text).
Stop terminates the worker; a new worker/run generation invalidates old events.
Document exact wire field names beside implementation before parallel work.

## Shared input mailbox

Use separate atomic control words and a UTF-8 payload. Record capacity as an
implementation constant; every submission must fit in full. Control metadata
includes run/request association, state and byte length. UI writes bytes then
length, publishes ready atomically and notifies. Worker checks state in a loop
before waiting, so an early notification is not lost. Byte length zero denotes an
empty answer, not EOF or a missing answer. Cancellation invalidates the mailbox.
Never block the UI thread with Atomics.wait or expect message callbacks to run
inside a blocked worker. Verify Unicode and successive requests explicitly.

## Hosting boundary

All application/runtime URLs must be approved; package assets under the editor
origin. HTTPS with COOP same-origin and COEP require-corp is the proposed standalone
hosting contract. Check window/worker crossOriginIsolated before accepting input
execution. If unavailable, show a capability error and escalate feasibility failure;
do not claim exam support or weaken interactive-input requirements.

## Python compatibility

Support the chosen runtime's standard library; document unsupported desktop-only
modules. Do not automatically fetch packages based on imports. A module unavailable
in the bundled runtime produces an ordinary Python error. User files and graphics
are outside this version's workflows, rather than a claim of a security sandbox.

## Implemented local contract — issue #15

The product editor and isolated spike now share `src/runtime/worker.js` and
`src/runtime/input-mailbox.js`. The page-side runtime client enforces one active
run and filters worker-generation/run identity. Wire fields:

- Page → worker: `initialise {runtimeURL, mailbox, outputSignal}`, `run {runId, source}`.
- Worker → page: `ready {runId:0, isolated, version}`, `output {runId, channel,
  text, outputId}`, `input-request {runId, requestId}`, `completed {runId}`,
  `failed {runId, error}`.

The mailbox has four Int32 words (state, run ID, request ID, byte length) followed
by exactly 65,536 UTF-8 payload bytes. State 0 means waiting, state 1 answer.
Oversize or multiline submissions are rejected visibly; empty lines are accepted.
Bytes and length precede atomic state publication/notification. The worker checks
identity/state/length, copies the shared payload before browser TextDecoder use,
and supplies a newline explicitly. Stop invalidates the generation and creates
an entirely new worker/mailbox. Normal reruns use fresh globals, while imported
modules/builtins can persist until Stop. This is not a security sandbox.

Application state is exposed in `#status[data-state]`: loading, ready, running,
waiting-for-input, stopping, failed. The visible labels are plain English.
`#run` is enabled only when ready; `#stop` resets the runtime (Retry after failure).
Editor source lives independently and survives runtime termination.

Session storage key `klode.source.v1` holds source only. A missing key uses the
initial example; an empty value restores an empty editor. Every document change
saves synchronously; storage failures warn without disabling editing/execution.
Theme selection is in-memory only; System also reacts to live OS preference changes.

Output uses a separate one-word shared acknowledgement buffer. The worker groups
writes and emits ordered chunks of at most 8,192 UTF-16 code units, preserving
surrogate pairs. It waits for page acknowledgement before producing the next
chunk; the page appends at an animation frame and acknowledges atomically. This
backpressure keeps Stop reachable during endless printing without discarding or
capping output. Pending output flushes before input, completion and failure.
The isolated technical spike omits output acknowledgement; the application enables
it. Output is a read-only native text control, retaining exact safe plain text.
