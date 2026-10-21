# Branchbescherming en controles

Werkitem: [#2](https://github.com/hanze-hbo-ict/codeklad/issues/2).
De repository is publiek; GitHub ondersteunt branchbescherming en Actions.
Instellingen op GitHub zijn leidend voor de actuele bescherming.

## Verplichte controle

De workflow `Tooling` draait voor iedere PR en voor pushes naar `main`.
De job `Tooling checks` installeert de ontwikkelomgeving met `uv sync --locked`
op Python 3.11. Daarna controleert hij JSON/TOML, de 22 hashes van meegeleverde
Spec Kit-bestanden, Bash-syntax, template-resolutie en de Spec Kit-toolcheck.

Lokaal uitvoeren:

```bash
uv sync --locked
uv run --locked python scripts/check-tooling.py
uv run --locked specify check
```

Dit controleert de ontwikkeltooling. App-tests en verificatie in de echte
toetsomgeving volgen met de implementatie. Hosting, preview en publicatie
blijven onderdeel van [#4](https://github.com/hanze-hbo-ict/codeklad/issues/4).

## Instellingen voor main

Vereis een PR, opgeloste reviewgesprekken en de succesvolle job `Tooling checks`
op een branch die actueel is ten opzichte van `main`. Sta force-pushes en
verwijderen van `main` niet toe. Bind de verplichte check aan GitHub Actions
zodra de eerste run is geregistreerd.

Een verplichte goedkeuring door een tweede account en het toepassen van regels
op beheerders vereisen een keuze van de product owner. De agent gebruikt nu
het account `misja`; GitHub staat zelfgoedkeuring van PR's niet toe.
Leg de gekozen instellingen en de teruggelezen API-resultaten vast bij #2.

Branchbescherming onderscheidt geen mens en agent die hetzelfde account
gebruiken. De menselijke mergegoedkeuring uit `docs/werkwijze.md` blijft daarom
een expliciete procesafspraak. Een uitzondering voor beheerders geeft technisch
ook ruimte om controles te omzeilen; gebruik die niet zonder menselijk besluit.

Bronnen: [GitHub branch protection API](https://docs.github.com/en/rest/branches/branch-protection)
en [uv in GitHub Actions](https://docs.astral.sh/uv/guides/integration/github/).
