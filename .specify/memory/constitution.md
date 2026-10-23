# Klode — project principles

## I. Simplicity and exam use

Klode provides a minimal programming environment without AI assistance.
The first version supports Python in one file, `main.py`, with an editor and
input/output. Other languages are outside this first version.

## II. Usability

The interface is responsive, including on smaller screens. The theme follows
the system and can be switched manually between light and dark.

## III. Maintainability

Prefer modern JavaScript and a simple build process. Frameworks and libraries
must add value. Use proven libraries where appropriate, for example for the
editor. Python and uv currently manage development tooling; this does not require
the browser application to have a backend.

## IV. Specification as agreement

Record desired behaviour, scope and observable acceptance criteria before
implementation. Keep the specification current after changes. Mark open questions
explicitly; a technical proposal is not a product decision.
`specs/product.md` contains the current starting points and open product questions.

## V. Human product owner and independent roles

The product owner is a human. The orchestrator clarifies wishes, creates GitHub
work items and coordinates isolated tasks. Developer, tester/reviewer and release
manager have bounded responsibilities. A reviewer does not assess their own
implementation. Follow `docs/werkwijze.md` for the workflow, handoffs, blockers
and escalation.

## Work items and verification

GitHub issues represent work items and refer to the specification version, scope,
acceptance criteria and dependencies. Spec Kit tasks decompose work under the
specification; issues are authoritative for work status and handoffs.
Report checks with concrete results and the reviewed commit. Distinguish local
verification from verification in the actual exam environment.

## Governance and publication

The product owner decides scope, desired behaviour and merge. Fixes within the
agreed scope may go back to a preceding role; product choices and scope changes
require a human decision. Record rationale on the issue and update changed
product agreements in the specification as well.

Human merge approval authorises publication of the approved version. Failing
release checks stop publication and lead to a report back. Spec Kit commands
and workflows do not replace these authorities and gates. Changes to these
principles require an explicit product-owner decision.

**Version**: 1.0.1 | **Ratified**: 2026-10-21 | **Last Amended**: 2026-10-22

Source: agreements confirmed by the product owner in the bootstrap conversation.

Amendment 1.0.1 records the product-owner-approved name Klode (2026-10-22).
The principles and governance are unchanged; see issue #10.

English translation under issue #8 (2026-10-23) preserves version 1.0.1 and its
ratification/amendment dates; it introduces no change to the principles.
