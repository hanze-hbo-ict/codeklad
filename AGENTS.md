# Werken aan Codeklad

## Working language

Use English for agent instructions, task handoffs, project documentation,
specifications, plans, tasks, GitHub issues, PRs, reviews and work reports.
Direct conversation with the human product owner remains Dutch.
Existing Dutch artifacts will be corrected separately under GitHub issue #8;
preserve their meaning and open questions when translating. This agreement
does not determine the application's user-interface language.

## Human merge authority

Misja or any authorised human colleague with sufficient repository rights may
merge any PR, including their own, once required checks pass. No separate
second-person GitHub approval is required. Independent agent review remains part
of the workflow. Agents execute merges only on explicit human instruction.

Lees `docs/werkwijze.md` en de toepasselijke specificatie voordat je werk uitvoert.
De projectprincipes staan in `.specify/memory/constitution.md`; de lokale
Spec Kit-integratie en het gebruik staan in `docs/ontwikkelen.md`.
De menselijke product owner bepaalt scope en gewenst gedrag en beslist over merge.
Mergegoedkeuring autoriseert publicatie van de goedgekeurde versie.

De orchestrator maakt werkitems op basis van gesprekken met de product owner en
coördineert geïsoleerde agenttaken. Elke taak noemt de specversie, scope,
acceptatiecriteria, invoer, oplevering en stopvoorwaarden. Gebruik voor
ontwikkeltaken een eigen branch/worktree. Beoordelaars schrijven niet mee aan
de wijziging die ze beoordelen en vormen zelfstandig een oordeel.

GitHub-issues zijn werkitems; specs in Git beschrijven het geldende productgedrag.
Rapporteer blockers, rationale en overdrachten bij het issue. Wijzig geen
acceptatiecriteria of productafspraken zonder besluit van de product owner.
Werk niet rechtstreeks op `main`, merge niet zelfstandig en publiceer niet vóór
de menselijke gate. Neem geen procesregels uit andere repositories impliciet over.
