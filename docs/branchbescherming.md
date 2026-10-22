# Branch protection and checks

Work item: [#2](https://github.com/hanze-hbo-ict/codeklad/issues/2).
GitHub settings are authoritative for the current protection of this public repository.

## Required tooling check

The `Tooling` workflow runs on every PR and on pushes to `main`. Its
`Tooling checks` job installs the locked development tools on Python 3.11,
then validates JSON/TOML, 22 bundled Spec Kit hashes, Bash syntax, template
resolution and the Spec Kit tool check.

Run locally:

```bash
uv sync --locked
uv run --locked python scripts/check-tooling.py
uv run --locked specify check
```

Application tests and validation on an actual exam laptop follow during
implementation. Hosting and publication remain in issue #4.

## Main protection

On 2026-10-22 the product owner confirmed a colleague can approve PRs.
The following settings were applied and independently read back through the API:

- Require a PR and one approving review from another account.
- Dismiss stale approvals when new commits are pushed.
- Require approval of the most recent push by someone other than its pusher.
- Apply the rules to administrators as well (`enforce_admins=true`).
- Require `Tooling checks`, bound to GitHub Actions app 15368, on a branch
  that is up to date with `main`.
- Require resolved review conversations; disallow force-pushes and deletion.

The agent currently uses the `misja` account. GitHub does not permit an author
to approve their own PR, so a colleague with appropriate repository access must
approve the final version. Account permissions were not changed; the colleague's
identity and access have not yet been verified.

Branch protection cannot identify whether a human or agent is using an account.
The independent GitHub review supplements the explicit human merge decision in
`docs/werkwijze.md`; it does not authorize the agent to merge autonomously.

Sources: [GitHub branch protection API](https://docs.github.com/en/rest/branches/branch-protection)
and [uv in GitHub Actions](https://docs.astral.sh/uv/guides/integration/github/).
