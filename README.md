# Klode

A minimal Python workspace for teaching and exams: one `main.py` editor, output,
and interactive input. CodeMirror provides syntax highlighting and automatic
indentation, without code completion or AI assistance. Python runs in a worker
inside the browser. Copy your source into ans.app using ordinary selection and
Ctrl+C. Code, including an empty document, is restored when reloading the same tab;
if session storage is unavailable, a visible warning explains the limitation.

## Local development

Use Node 24.19.0 and npm 11.16.0 (see `.node-version`):

```bash
npm ci
npm test
npm run dev
```

Open the local URL printed by Vite. The application is at `/`; the isolated input
experiment remains at `/experiments/input-spike/index.html`.

```bash
npm run build
npm run preview
npm run test:browser
```

The build verifies and copies the pinned Pyodide runtime; its binaries are
reconstructed from locked npm dependencies rather than committed to Git. All
application/runtime assets are served from the same origin, with no CDN or
import-triggered package downloads. Browser tests use pinned `playwright-core`
and an installed Chrome/Edge executable; set `CHROME_BIN=/path/to/browser` if it
is not `/opt/google/chrome/chrome`. Tests start their own local preview servers
on ports 4273–4276 and do not download a browser. The Application workflow runs
locked installation, unit/runtime tests, build and browser tests using runner
Chrome. Existing Tooling checks remain separate.

## Validation and hosting

This is a local implementation for review, not a published exam service. The
product owner reported successful HTTPS input testing in a Windows/Edge VM and
authorised continuing. Actual school-laptop whitelist, browser/version, opening
route, reference exercise, cold loading and copy/paste into ans.app remain release
and acceptance gates. See the [acceptance evidence](specs/001-python-editor/evidence/acceptance.md).

Production hosting needs HTTPS, COOP/COEP isolation and correct static MIME types;
see [hosting requirements](docs/hosting.md). No host or deployment is selected.
The runtime supports its bundled Python standard library, with browser limits:
no desktop processes or ordinary native sockets, and no extra packages, file
workflows or graphics. Student code is not a security sandbox.

## Project

- [Workflow and roles](docs/werkwijze.md)
- [Product overview](specs/product.md) and [feature specification](specs/001-python-editor/spec.md)
- [Work items](https://github.com/hanze-hbo-ict/codeklad/issues)
- [Spec Kit development tooling](docs/ontwikkelen.md)

Formerly Codeklad; the repository URL and local checkout retain the original
name pending the separate repository rename.

Klode is available under the [MIT license](LICENSE). See
[third-party notices](THIRD_PARTY_NOTICES.md) and [runtime notices](public/runtime/NOTICE.md)
for bundled dependencies and development tooling. The static output also contains
[editor dependency licenses](public/editor-licenses.txt).
