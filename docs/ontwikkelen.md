# Ontwikkelomgeving

Gebruik Python 3.11 of nieuwer en `uv`. `pyproject.toml` beheert de
ontwikkeltooling; Klode heeft voorlopig geen Python-applicatiepakket.
De geplande editor draait als JavaScript/Pyodide-applicatie in de browser.

Spec Kit staat vast op `specify-cli==1.2.2`. Het lockbestand legt de
transitieve dependencies vast.

## Installeren en controleren

```bash
uv sync --locked
uv run --locked specify version
uv run --locked specify check
```

Installeer geen globale kopie van de CLI voor dit project. Als de standaard
uv-cache niet schrijfbaar is in een sandbox, gebruik dan een lokale cache:

```bash
uv --cache-dir .uv-cache run --locked --offline specify version
```

Die offline route vereist een geïnstalleerde omgeving of gevulde cache.

## Spec Kit gebruiken

De integratie is met de gebundelde templates van versie 1.2.2 gegenereerd:

```bash
uv run --locked specify init /tmp/codeklad-speckit-stage \
  --integration codex --script sh --non-interactive
```

De mappen `.specify` en `.agents` zijn daarna overgenomen naar Klode,
zonder bestaande projectbestanden te overschrijven. Het constitution-template
is ingevuld met de eerder bevestigde projectafspraken. Init-metadata en
manifests bewaren de herkomst van gegenereerde bestanden. De stagingdirectory
was alleen voor de bootstrap; gebruik voor volgende generatie een lege directory.

Start Codex vanuit Klode om de projectskills in `.agents/skills` te
ontdekken. Relevante opdrachten in het agentgesprek zijn:

- `$speckit-constitution`: projectprincipes onderhouden.
- `$speckit-specify`: een featurespecificatie opstellen.
- `$speckit-clarify`: open vragen verduidelijken.
- `$speckit-plan`: een technisch plan opstellen.
- `$speckit-tasks`: een plan in taken ontleden.
- `$speckit-analyze`: consistentie tussen artefacten beoordelen.
- `$speckit-implement`: een toegewezen implementatie uitvoeren.
- `$speckit-converge`: resterend werk vaststellen.

Skills kunnen in een lopende agentsessie pas na herstart zichtbaar worden.
CLI-commands zijn terminalopdrachten; bovenstaande skills zijn dat niet.

## Aansluiting op onze werkwijze

Lees `AGENTS.md`, `docs/werkwijze.md` en de projectprincipes vóór gebruik.
`specs/product.md` blijft het productoverzicht. Spec Kit plaatst features
normaal onder `specs/<nummer>-<naam>/`. Er is nog geen featurespecificatie
gegenereerd of open productvraag stilzwijgend ingevuld.

GitHub-issues blijven leidend voor werkstatus en overdrachten. Een `tasks.md`
is een decompositie bij de spec; koppel taken aan werkitems zodra GitHub
beschikbaar is. Implementeer alleen binnen de toegewezen rol en scope.
De gebundelde workflow `speckit` implementeert niet onze rollenlus, onafhankelijke
beoordeling of menselijke mergegate. Gebruik die niet als vervanging daarvan.

Bij upgrades: wijzig de dependency en het lockbestand bewust, genereer in een
lege tijdelijke directory en beoordeel verschillen vóór overname. Behoud eigen
projectprincipes en procesafspraken.

## Huidige status

CLI 1.2.2, Codex-skills, templates en Bash-scripts zijn lokaal beschikbaar.
De bootstrap is via PR #5 gemerged. De workflow `Tooling` controleert de
ontwikkelomgeving en meegeleverde Spec Kit-bestanden. Zie
[branchbescherming en controles](branchbescherming.md) voor de inrichting en
beperkingen van de mergegate.

The public editor is live at https://klode.netlify.app/. See
[hosting and release verification](hosting.md) for Netlify configuration and
remaining operational/school-environment checks, and [CONTRIBUTING](../CONTRIBUTING.md)
for the contributor workflow.
