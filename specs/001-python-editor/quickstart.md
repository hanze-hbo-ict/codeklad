# Planned validation guide

These commands and paths describe the future implementation; they are not runnable
application instructions yet. Existing tooling checks can already run via uv.

## Setup after implementation

Use the pinned Node version recorded by setup, then `npm ci`, `npm run dev` and
`npm run build`. The runtime-vendoring script is wired into the build and checks
pinned assets. Run `npm run preview` with isolation headers configured for validation.
The production host must return the same headers; a successful dev server alone
is insufficient evidence. No automatic deployment is part of these commands.

## Feasibility evidence

Record in evidence/feasibility.md: commit, runtime/browser versions, opening route,
approved URL, agreed reference exercise with expected results, response headers,
crossOriginIsolated in window/worker, cold-load
network log and asset sizes. Test a normal browser first, then the actual exam
Windows laptop with every unapproved destination blocked. The product owner or
school supplies the actual laptop and confirms whitelist/opening details.

## Acceptance cases

1. Run `print(2 + 3)` and see 5; introduce/fix syntax and runtime errors.
2. Run two input() calls with visible prompts; answer after execution starts.
   Include empty and non-ASCII answers and a prompt with no newline.
3. Stop while waiting for input and while running an endless loop; run again.
   Code survives, stale events/answers do not enter the new execution.
4. Reject an input line larger than mailbox capacity visibly and without truncation.
5. Import selected supported standard modules, such as math; confirm unavailable
   packages produce an error without attempted network installation.
6. Copy multiline code containing indentation from the editor into ans.app and
   compare it exactly. Test actual clipboard behaviour on the exam laptop.
7. Edit and reload in the same tab; recover exact code. Repeat with an empty editor.
   Simulate unavailable storage and confirm a visible warning with editing intact.
8. Verify syntax highlighting/indentation with no completion/AI interface.
9. Verify system/manual themes and reachable controls at 360 and 1280 CSS pixels.
10. Cold-load the production build under whitelist conditions and confirm only
    approved application/runtime resources are requested.

Write expected/actual results in evidence/acceptance.md. Record local and actual
exam evidence separately; do not mark missing laptop/hosting checks as passed.
Independent review and human merge approval precede publication.
