# Interactive input feasibility spike

This isolated experiment implements T001–T004 for issue #13 against approved
spec commit 9112431 and constitution 1.0.1. It is not the product editor.

Use Node 24.19.0 / npm 11.16.0:

```
npm ci
npm test
npm run dev
npm run build
npm run preview
```

Run `npm run test:browser` after the production build for the actual-browser
regression. It uses pinned playwright-core and an already installed Chrome/Edge
executable; no browser is downloaded. Set `CHROME_BIN=/path/to/browser` when it
is not `/opt/google/chrome/chrome`. The test starts its own preview at 4273 and
a header-negative server at 4274, with fresh browser contexts, and rejects every
non-preview network request. These ports must be free.

Open `http://127.0.0.1:5173/experiments/input-spike/index.html` for dev,
or port 4173 for the production preview. A clean dependency installation requires
build-time network access; with dependencies installed, vendoring/building uses
no external network. Do not deploy before the human gate.

The default snippet requests two lines. Wait for the prompts, submit Unicode and
an empty line, and inspect the printed repr values. Test `print("Prompt", end="");
input()` to check output without newline. Stop while waiting and during an endless
loop; the runtime is recreated while the textarea source remains. Run again when
ready. Try more than 65,536 UTF-8 bytes: the pending request remains and a visible
error appears. Output is rendered with textContent.

## Wire and mailbox implementation

Main→worker: `initialise {runtimeURL, mailbox}`, `run {runId, source}`.
Worker→main: `ready {runId:0, isolated, version}`, `output {runId, channel,
text}`, `input-request {runId, requestId}`, `completed {runId}`, `failed {runId,
error}`. Main filters events by worker generation and active runId. Stop discards
the old worker and buffer; request IDs restart within a fresh run. No answer is
sent as a message to a synchronously blocked worker.

The shared buffer is 16 header bytes plus 65,536 payload bytes. Int32 control
words: state (0 waiting, 1 answer), runId, requestId, UTF-8 byte length. The worker
publishes an input request after setting its identity and state. The page checks
identity/state, rejects multiline/oversize answers, writes bytes and length, then
atomically publishes answer and notifies. A zero byte length is a valid empty
line. The worker loops on state before Atomics.wait, so early notifications are
not lost. The main thread never waits. Unit tests include a real worker wait.

`setStdin` returns the decoded line plus an explicit newline, including for empty
answers. Copy the payload into an ordinary ArrayBuffer before decoding: browser
TextDecoder rejects views backed by SharedArrayBuffer, although Node accepts them. Stream write
callbacks forward output immediately, retaining incremental UTF-8 decoding, so
prompts need no trailing newline. Each normal run gets a fresh globals dict;
Stop provides a complete runtime reset. This experiment does not promise that
normal reruns reset mutations to Python builtins, modules or browser state.

CodeMirror packages are pinned for future work but intentionally unused here.
No full editor, session recovery, theme or exam acceptance has been implemented.
See the feasibility evidence and hosting requirements for the remaining gate.
