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
