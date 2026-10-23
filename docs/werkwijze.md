# Werkwijze

## Working language

The product owner decided on 2026-10-22 that English is the working language
for agents and project artifacts: instructions, handoffs, documentation,
specifications, plans, tasks, issues, PRs, reviews and work reports. Direct
conversation between the product owner and assistant remains Dutch.

Apply this agreement to new work immediately. Existing Dutch artifacts and
templates will be corrected separately under
[issue #8](https://github.com/hanze-hbo-ict/klode/issues/8). Preserve decisions,
requirements, acceptance criteria and unresolved questions when translating.
Historical comments and closed work items may remain in their original language.
The application's user-interface language is a separate product decision.

## Human merge decision

Misja or any other authorised human colleague with sufficient repository rights
may merge any PR, including one created under their own account. Required checks
and other branch protection rules must pass; a separate GitHub approval by a
second person is not required. Independent agent review remains part of the
workflow. An agent may execute a merge on explicit human instruction, and must
not merge autonomously. This clarification was confirmed on 2026-10-22 (#2).

## Verantwoordelijkheden

De product owner is een mens: Misja of een collega. De orchestrator helpt wensen
verduidelijken, stelt werkitems op en bewaakt voortgang, afhankelijkheden en
overdrachten. De ontwikkelaar implementeert een afgebakende taak. De onafhankelijke
tester/reviewer beoordeelt het resultaat tegen de spec. De release manager
controleert opleverbaarheid, publiceert na de menselijke gate en verifieert de
deployment. De concrete tooling voor deze rollen moet nog worden ingericht.

## Route

1. Product owner en orchestrator leggen gewenst gedrag en afbakening vast.
2. De orchestrator maakt een GitHub-issue met specverwijzingen, scope,
   acceptatiecriteria, afhankelijkheden en verwachte oplevering.
3. De ontwikkelaar werkt in een eigen branch/worktree en levert een PR met
   relevante controles en een verwijzing naar het issue.
4. Een onafhankelijke tester/reviewer rapporteert bevindingen en bewijs.
5. De orchestrator stuurt herstel binnen bestaande afspraken terug naar de
   passende rol. Productkeuzes en scopewijzigingen gaan naar de product owner.
6. De product owner beoordeelt de concrete PR en beslist over merge.
7. Mergegoedkeuring autoriseert publicatie. De release manager controleert dat de
   goedgekeurde versie wordt gepubliceerd en verifieert het resultaat. Bij falende
   controles stopt publicatie en volgt terugkoppeling.

## Overdracht en isolatie

Elke taak benoemt rol, issue, specversie/commit, invoer, toegestane wijzigingen,
acceptatiecriteria, verwacht resultaat en stopvoorwaarden. Geef beoordelaars
de spec, diff en controleerbare resultaten; laat hun oordeel niet afhangen van
het maakgesprek. Parallel werk vereist expliciete afspraken over gedeelde
interfaces en bestanden.

Een overdracht noemt de beoordeelde commit, uitgevoerde controles, resultaten,
resterende onzekerheden en de volgende verantwoordelijke rol. Een blocker bevat
het probleem, bewijs, impact en zo mogelijk opties of een concrete beslisvraag.
Herstelrondes zijn begrensd door de taak; bij herhaling zonder voortgang escaleert
de orchestrator naar de product owner.

## Bronnen en onderhoud

Specs in Git beschrijven productgedrag. Issues volgen werk, rationale en besluiten.
PR's bevatten wijzigingen en verificatie. Verwerk besluiten die productgedrag
veranderen ook in de spec. Een wezenlijke scopewijziging vereist een menselijk
besluit voordat afhankelijke uitvoering doorgaat.

Een PR voor de human gate noemt het probleem, het resultaat, aangetoonde
acceptatiecriteria, beperkingen en waar passend een preview. Scheid succesvolle
lokale controles van controles in de echte toetsomgeving.

Spec Kit 1.2.2 is lokaal ingericht met de Codex-integratie. De projectprincipes
staan in `.specify/memory/constitution.md`. Takenbestanden dienen als decompositie
bij de spec; GitHub-issues zijn leidend voor werkstatus en overdrachten.
De gebundelde workflow implementeert niet onze rollenlus: de orchestrator bewaakt
onze rolgrenzen en menselijke gate. Deze afspraken gelden ook wanneer een
Spec Kit-command anders suggereert.
