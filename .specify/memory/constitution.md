# Klode — projectprincipes

## I. Eenvoud en toetsgebruik

Klode biedt een minimale programmeeromgeving zonder AI-assistentie.
De eerste versie ondersteunt Python in één bestand, `main.py`, met een editor
en uitvoer/invoer. Andere talen vallen buiten deze eerste versie.

## II. Bruikbaarheid

De interface is responsief, ook op kleinere schermen. Het thema volgt het
systeem en kan handmatig tussen licht en donker worden gewisseld.

## III. Onderhoudbaarheid

Gebruik bij voorkeur modern JavaScript en een eenvoudige bouwstraat.
Frameworks en bibliotheken moeten waarde toevoegen. Gebruik beproefde
bibliotheken waar passend, bijvoorbeeld voor de editor. Python en uv beheren
voorlopig de ontwikkeltooling; dit verplicht de browserapp niet tot een backend.

## IV. Specificatie als afspraak

Leg gewenst gedrag, afbakening en observeerbare acceptatiecriteria vast vóór
implementatie. Houd de specificatie na wijzigingen actueel. Markeer open vragen
expliciet; een technisch voorstel is geen genomen productbesluit.
`specs/product.md` bevat de huidige uitgangspunten en open productvragen.

## V. Menselijke product owner en onafhankelijke rollen

De product owner is een mens. De orchestrator verduidelijkt wensen, stelt
GitHub-werkitems op en coördineert geïsoleerde taken. Ontwikkelaar,
tester/reviewer en release manager hebben afgebakende verantwoordelijkheden.
Een beoordelaar beoordeelt geen eigen implementatie. Volg `docs/werkwijze.md`
voor de route, overdrachten, blockers en escalatie.

## Werkitems en verificatie

GitHub-issues vertegenwoordigen werkitems en verwijzen naar de specversie,
scope, acceptatiecriteria en afhankelijkheden. Spec Kit-taken zijn een
decompositie bij de spec; issues zijn leidend voor werkstatus en overdrachten.
Rapporteer controles met concrete resultaten en de beoordeelde commit.
Onderscheid lokale verificatie van verificatie in de echte toetsomgeving.

## Governance en publicatie

De product owner beslist over scope, gewenst gedrag en merge. Herstel binnen
de afgesproken scope kan terug naar een voorgaande rol; productkeuzes en
scopewijzigingen vereisen een menselijk besluit. Leg rationale bij het issue
vast en werk gewijzigde productafspraken ook in de spec bij.

Menselijke mergegoedkeuring autoriseert publicatie van de goedgekeurde versie.
Falende releasecontroles stoppen publicatie en leiden tot terugkoppeling.
Spec Kit-commands en workflows vervangen deze bevoegdheden en gates niet.
Wijzigingen aan deze principes vereisen een expliciet product-ownerbesluit.

**Version**: 1.0.1 | **Ratified**: 2026-10-21 | **Last Amended**: 2026-10-22

Bron: door de product owner in het bootstrapgesprek bevestigde afspraken.

Amendment 1.0.1 records the product-owner-approved name Klode (2026-10-22).
The principles and governance are unchanged; see issue #10.
