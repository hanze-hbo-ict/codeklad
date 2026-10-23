# Cleanup evidence — issue #28

Baseline: `a7533caf414f3ce4bb8f8f4aae4b64c8468fae4a`; product-owner approval
2026-10-23. No editor/runtime behaviour change or school-acceptance claim.
The PR records the implementation and independently reviewed commits.

## Repository changes and coverage

The isolated input-spike UI, thin runtime wrappers and its Vite production entry
are retired. Git history retains the original experiment and its protocol README.
Current tests moved to `tests/unit/`, `tests/browser/` and `tests/support/`.
The production runtime files are unchanged.

The deleted spike browser suite duplicated current product coverage:

| Former spike cases | Retained product browser coverage |
| --- | --- |
| Ordered empty/Unicode input | ordered empty/Unicode input and exact echoed transcript |
| No-newline prompt and oversize retry | no-newline prompt; oversize retry |
| Stop input/loop, stale form, rerun | Stop wait/loop/output flood, stale form and rerun |
| Standard-library/unavailable imports | supported/unavailable imports; safe output |
| Missing isolation headers | missing isolation capability failure |
| Cold-load same-origin runtime resources | cold context same-origin worker/runtime audit |

Mailbox unit tests retain exact capacity, UTF-8 encoding, stale/duplicate rejection,
actual worker blocking/resumption and pinned Python runtime input. Execution timer
and preview-readiness unit regressions are retained.

## Verification

- `npm ci`: locked installation succeeds; no lockfile/dependency changes.
- `npm test`: 11/11 pass.
- `npm run build`: passes, packages verified Pyodide 314.0.7.
- `npm run test:browser`: 20/20 case groups pass in Chrome 156.0.8078.47.
  Fresh browser context blocks off-origin requests; none attempted. All five
  runtime resource requests observed. Clipboard, responsive themes, input,
  Stop/floods, Retry, errors and missing-header refusal are covered.
- Inspected `dist/`: only root HTML, editor CSS/JS, worker, runtime and licence
  assets; no experiment HTML/assets. Hosting SPA fallback may still return root
  HTML for an obsolete URL, which is not evidence of the spike being deployed.
- `git diff --check`: passes.

These are local production-build checks. No production deployment was made;
actual Windows/Edge school-whitelist acceptance remains open under #13.

## Local environment disposition

Every removed worktree was checked for tracked/untracked changes (none) and its
HEAD confirmed an ancestor of baseline `a7533ca`. Ignored content was inventoried
separately: reproducible virtual environments, dependencies, builds, runtime copies
and a feature-selection metadata file. No unique source or credentials removed.

Removed worktrees and their merged local branches:

- `/tmp/codeklad-branch-protection` — `002-branch-protection`
- `/tmp/codeklad-colleague-review` — `002-required-colleague-review`
- `/tmp/codeklad-python-editor` — `001-python-editor`
- `/tmp/codeklad-rename-klode` — `rename-klode`
- `/tmp/codeklad-working-language` — `008-working-language`
- `/tmp/klode-feedback` — `019-feedback-round1`
- `/tmp/klode-input-feasibility` — `013-input-feasibility`
- `/tmp/klode-netlify` — `017-netlify`

The merged local `bootstrap` branch was also removed. Remote branches, historical
commits, temporary handoff/evidence reports and unrelated processes were retained.

Process command lines/cwds were inspected outside the sandbox before termination:
old Vite previews on 4173 (input-feasibility), 4277 (editor-app) and 4341 (feedback),
and the Python spike/CA download server on 4443/4174 were stopped. No old server
was stopped solely by a guessed port or process name.

Retained: main workspace; active `/tmp/klode-cleanup`; `/tmp/klode-python-editor-app`
and its branch/build because the useful HTTPS LAN preview serves that dist;
`/tmp/klode-lan-https` including certificates and scripts. The retained LAN preview
initially accepted TLS but closed HTTP requests without a response. Restarting the
same script in a managed execution session restored HTTP 200 on
https://192.168.1.5:4444/ with COOP `same-origin`, COEP `require-corp` and no-store.
It serves the previously approved build, not this unmerged cleanup branch.
