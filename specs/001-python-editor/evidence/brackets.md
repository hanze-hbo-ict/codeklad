# Bracket and quote assistance — issue #29

Baseline: cleanup merge `adb86b5`; constitution v1.0.1. Product-owner decision
2026-10-23 approves closing/matching, with subsequent approval for quote closing.
The issue records the scope update; the PR identifies reviewed commits.

## Behaviour and implementation

Use CodeMirror `closeBrackets`, its Backspace keymap and `bracketMatching` without
`autocompletion`, snippets or broad `basicSetup`. Explicitly pin the already locked
transitive `@codemirror/autocomplete` 6.20.4 as a direct dependency; no resolved
package versions change. Its package name does not enable code suggestions.

Use the existing Python syntax tree/language data for context: brackets and quotes
pair in code; comments remain literal. String text permits its own quote delimiter
for skip/delete behaviour while other quote characters/brackets remain literal.
Keep native Python prefix/triple-quote handling. A typed closing quote skips the
whole generated triple closer, as provided by CodeMirror. At a completed string's
end the caret is back in code; an unfinished string remains literal text.

Matching brackets have a theme-aware selection background and accent outline;
mismatches have an error background/outline and wavy underline. Text colour and
selection are preserved. Quotes close automatically but bracket matching remains
for `()`, `[]`, `{}`. The footer still excludes code completion/AI.

## Checks

Focused browser regression `tests/browser/brackets.browser.test.mjs` uses actual
keyboard typing and native clipboard inspection. It covers:

- Each bracket type, inner caret, closer skipping, empty-pair deletion and nesting.
- Undo/redo and exact copied source.
- Comments, unfinished/closed/triple/f-string text and Python f-string expressions.
- Single/double quotes, empty-pair deletion, prefix/triple handling, apostrophes,
  opposite quote characters and escaped quotes.
- Matching/mismatch decorations in light/dark themes, including outline and wavy
  underline; no suggestions under Control+Space, normal Tab focus navigation and
  retained footer.

Local focused checks pass in Chrome 156.0.8078.47; production build and diff
whitespace check pass. Full existing unit/application regressions and independent
review results are recorded in the PR. Actual school Windows/Edge acceptance
remains separate under #13; no production publication is implied by these checks.
