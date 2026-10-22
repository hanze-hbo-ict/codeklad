# Hosting requirements for the input feasibility spike

No host is selected or deployment authorised by this document. Provisioning and
publication are coordinated through #4 and require the existing human gate.

Serve the entire static `dist/` output on the approved editor origin over HTTPS.
Preserve `/experiments/input-spike/index.html`, `/assets/` and `/runtime/` paths;
the spike currently assumes hosting at the origin root. Serve `.wasm` with
`Content-Type: application/wasm`, `.mjs` as JavaScript, and zip as binary data.
Set these response headers on HTML and worker/script responses:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Both window and module worker must report `crossOriginIsolated === true`.
SharedArrayBuffer and worker Atomics.wait are essential: a missing capability
produces a visible failure rather than a preloaded-input fallback. Vite dev AND
preview set both headers. HTTP localhost is a browser secure-context exception
for local testing; this is not evidence for a production HTTPS origin.

All startup resources are bundled on the same editor origin. `npm ci` downloads
locked build dependencies; `npm run vendor:runtime` only verifies/copies local
npm files and refuses checksum drift. `npm run build` includes runtime files in
the static output. There are no CDN imports or import-triggered installation in
the spike. A Python import absent from the bundled runtime fails normally.
This is not a security sandbox: arbitrary Python/JavaScript interoperation is not
restricted, and the exam network whitelist remains an environmental requirement.

The actual target is Microsoft Edge on the restricted Windows exam laptop.
Opening in a new window is provisional and needs confirmation on that laptop;
no embedded route is assumed. Confirm the Edge version, actual opening route,
approved origin and all required path rules with the school. Record a cold-cache
network log with every unapproved destination blocked. Verify COOP does not break
the school's opening workflow and native copy/paste into ans.app separately.
Do not proceed to the full editor until the actual-environment feasibility gate
and independent review are complete.
