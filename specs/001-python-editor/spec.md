# Feature Specification: minimale Python-editor

**Feature Branch**: `001-python-editor`
**Created**: 2026-10-21
**Status**: Concept; open productvragen blokkeren definitieve planning.
**Input**: Eerste versie uit `specs/product.md`, uitgewerkt op verzoek van de
product owner. Werkitem #3; basiscommit `cec0b8e`; constitution v1.0.0.

Bestaande uitgangspunten zijn hieronder geconcretiseerd. Aanvullende criteria
zijn voorstellen ter beoordeling, geen stilzwijgende productbesluiten.

## User Scenarios & Testing

### User Story 1 - Python schrijven en uitvoeren (Priority: P1)

Als student wil ik één Python-programma schrijven en uitvoeren om een opgave
uit te werken zonder AI-assistentie.

**Why this priority**: Dit is het kerndoel van Codeklad.
**Independent Test**: Schrijf `print(2 + 3)` in `main.py`, voer uit en zie `5`.

**Acceptance Scenarios**:

1. **Given** een geopende editor, **When** de student code schrijft,
   **Then** bewerkt de student één bestand `main.py`.
2. **Given** `print(2 + 3)`, **When** de student uitvoert,
   **Then** is `5` zichtbaar in de uitvoer.
3. **Given** ongeldige code, **When** de student uitvoert,
   **Then** verschijnt de fout en blijft de code beschikbaar voor correctie.

### User Story 2 - Werken in de toetsomgeving (Priority: P1)

Als docent wil ik de editor vanuit de besloten toetsomgeving kunnen gebruiken.

**Why this priority**: Een gewone browsertest bewijst dit doel niet.
**Independent Test**: Open Codeklad langs de afgesproken route in de echte
omgeving en voer de vast te stellen referentieopgave uit.

**Acceptance Scenarios**:

1. **Given** de gekozen toetsbrowser en openingswijze, **When** de student de
   referentieopgave uitvoert, **Then** werken editor, invoer en uitvoer.
2. **Given** de toetsomgeving, **When** de student code overdraagt,
   **Then** werkt de nog vast te stellen overdrachtsroute.

### User Story 3 - Passende weergave kiezen (Priority: P2)

Als student wil ik bruikbare weergave op verschillende schermen en in licht/donker.

**Why this priority**: Dit zijn vastgelegde eisen voor bruikbaarheid.
**Independent Test**: Gebruik een smal en breed venster; controleer systeemthema
plus beide handmatige thema's.

**Acceptance Scenarios**:

1. **Given** geen handmatige themakeuze, **When** Codeklad opent,
   **Then** volgt het thema de systeeminstelling.
2. **Given** een geopende editor, **When** licht/donker wordt gekozen,
   **Then** verandert de weergave zonder verlies van huidige code.
3. **Given** een smal venster, **When** code wordt bewerkt en uitgevoerd,
   **Then** blijven de noodzakelijke bediening en uitvoer bereikbaar.

### Edge Cases

Voorgestelde foutafhandeling, nog te bevestigen:

- Ongeldige code toont een fout en blijft bewerkbaar.
- Een niet-startende omgeving toont een begrijpelijke foutstatus.
- Een eindeloze lus kan worden gestopt zonder verlies van huidige code.
- Herhaald uitvoeren tijdens een actieve uitvoering veroorzaakt geen
  verwarrende gelijktijdige uitvoer; bediening volgt na scopebesluit.
- Herladen, sluiten en codeherstel vallen onder Q3.

## Requirements

### Functional Requirements

- **FR-001**: Eerste versie: Python in één bestand `main.py`.
- **FR-002**: De student kan code bewerken, uitvoeren en uitvoer bekijken.
- **FR-003**: Invoer is beschikbaar; de vorm wordt vastgesteld bij Q2.
- **FR-004**: De responsieve interface biedt toegang tot editor en uitvoer.
- **FR-005**: Thema volgt het systeem en kan handmatig naar licht/donker.
- **FR-006**: Codeklad biedt geen AI-assistentie.
- **FR-007**: Werking wordt aangetoond in de gekozen echte toetsomgeving.
- **FR-008**: SQL en andere talen vallen buiten deze eerste versie.

### Open productbesluiten

- **Q1 — Toetsroute en bewijs**: [NEEDS CLARIFICATION: Welke toetsomgeving,
  browser/lockdownsoftware en openingswijze (tab, venster of embed) gelden,
  en welke bestaande opgave gebruiken we als referentie?]
- **Q2 — Python-opgaven**: [NEEDS CLARIFICATION: Moet input() interactief
  werken of volstaat vooraf ingevulde invoer; welke libraries, bestanden en
  grafieken zijn minimaal nodig?]
- **Q3 — Editor en codelevensloop**: [NEEDS CLARIFICATION: Hoe draagt de student
  code over, welke editorhulp is toegestaan en wat wordt bewaard of hersteld
  tijdens uitvoering, na herladen en tussen sessies?]

### Key Entities

- **Programma**: Inhoud van het door de student bewerkte `main.py`.
- **Uitvoering**: Uitvoerpoging met invoer, uitvoer en eventuele foutmelding.
- **Themavoorkeur**: Systeem volgen of handmatig licht/donker; opslagduur bij Q3.
- **Referentieopgave**: Door de docent gekozen opgave met verwachte resultaten
  en benodigde mogelijkheden voor het acceptatiebewijs.

## Success Criteria

### Measurable Outcomes

Voorgestelde acceptatiecriteria, te bevestigen na Q1–Q3:

- **SC-001**: `print(2 + 3)` levert `5`; de code kan na wijziging opnieuw draaien.
- **SC-002**: Een syntaxfout verschijnt als fout; na correctie kan opnieuw worden
  uitgevoerd vanuit dezelfde editor.
- **SC-003**: Alle afgesproken referentiegevallen slagen in de echte toetsomgeving,
  inclusief invoer en codeoverdracht.
- **SC-004**: Bij 360 en 1280 CSS-pixels vensterbreedte zijn editor, uitvoer en
  noodzakelijke bediening bereikbaar.
- **SC-005**: Systeemthema en beide handmatige thema's werken; wisselen verwijdert
  de huidige code niet.

Acceptatiebewijs noemt de applicatiecommit, browser/omgeving, referentiegevallen,
verwachte en werkelijke resultaten en resterende beperkingen.

## Assumptions

- De product owner levert of bevestigt toetsomgeving en referentieopgave.
- Hostingkeuze en echte toetsverificatie zijn nog niet uitgevoerd.
- Extra packages, grafieken, meerdere bestanden, accounts en opslag zijn niet
  stilzwijgend als eis toegevoegd of als uitgesloten verklaard.
- Pyodide, een Web Worker, een editorbibliotheek en één domein blijven technische
  voorstellen voor het latere onderzoek.

## Volgende stap en stopvoorwaarden

Beantwoord Q1–Q3, verwerk besluiten ook in `specs/product.md` en bevestig criteria.
Maak daarna het technische plan, de haalbaarheidsproef en implementatietaken.
Implementeer nog geen app en publiceer nog niet. Beperkingen in de toetsomgeving
vereisen een product-ownerbesluit voordat scope of criteria veranderen.
