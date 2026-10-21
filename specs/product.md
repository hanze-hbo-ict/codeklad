# Productspecificatie — concept

Status: vastgelegde uitgangspunten en open vragen; nog geen uitvoerbare featurespec.

## Doel

Een eenvoudige online editor voor gebruik vanuit een besloten toetsomgeving,
zonder AI-assistentie en met controle over beschikbaarheid en functionaliteit.

## Vastgelegde uitgangspunten

- Eerste versie: Python, één bestand `main.py`.
- Minimale interface met editor en uitvoer/invoer.
- Responsieve layout, ook bruikbaar op kleinere schermen.
- Systeemthema volgen en handmatig kunnen wisselen tussen licht en donker.
- Voorkeur voor modern JavaScript en een eenvoudige bouw- en onderhoudsroute.
- Gebruik beproefde bibliotheken waar ze waarde toevoegen, bijvoorbeeld de editor.
- Zelfstandige repository, lokaal onder `/home/misja/code/hanze/` en upstream
  onder de GitHub-organisatie `hanze-hbo-ict`.

## Voorgestelde technische richting

Pyodide in een Web Worker, een bestaande editorbibliotheek en alle benodigde
bestanden vanaf hetzelfde domein. Statische hosting, mogelijk Netlify.
De haalbaarheid moet in de daadwerkelijke toetsomgeving worden vastgesteld.

## Open vragen vóór uitwerking van acceptatiecriteria

- Vereiste standaardbibliotheek, packages, bestanden en eventuele grafieken.
- Interactieve `input()` versus vooraf opgegeven invoer.
- Browser/lockdownsoftware en openen in tab, venster of embed.
- Overdracht van code naar de toets: kopiëren/plakken of downloaden.
- Toegestane editorhulp, waaronder automatische aanvulling.
- Bewaren van code en voorkeuren tijdens en tussen sessies.

SQL en andere talen zijn toekomstwensen en vallen buiten de eerste versie.
