# FEAT-1: Task-CRUD

## Status
Aktueller Schritt: Dev

## Abhängigkeiten
- Benötigt: Keine

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-01*

### Beschreibung
Der Nutzer kann Tasks mit einem Titel anlegen, in einer Liste anzeigen, den Titel inline bearbeiten und Tasks löschen. Kein Status-Toggle (→ FEAT-2), keine Persistenz (→ FEAT-3).

### Definitionen
- **Task:** Ein Eintrag mit einem nicht-leeren Titel-String. Einziges Pflichtfeld.
- **Inline-Edit:** Der Titel eines bestehenden Tasks wird direkt in der Listenzeile editierbar, ohne Modal oder separate View.
- **Aktiver Edit-Zustand:** Zustand eines Tasks, in dem sein Titel-Feld fokussiert und bearbeitbar ist.

### User Stories
- Als Nutzer möchte ich einen Task per Texteingabe + Enter erstellen, um meine Aufgaben schnell zu erfassen.
- Als Nutzer möchte ich alle Tasks in einer Liste sehen, um einen Überblick über meine Aufgaben zu haben.
- Als Nutzer möchte ich einen Task-Titel durch Klicken inline bearbeiten, um Tippfehler oder Änderungen schnell zu korrigieren.
- Als Nutzer möchte ich eine Bearbeitung mit ESC oder Klick ausserhalb abbrechen, um versehentliche Änderungen zu verhindern.
- Als Nutzer möchte ich einen Task löschen, um abgeschlossene oder irrelevante Einträge zu entfernen.

### Acceptance Criteria
- [ ] Ein Task kann über ein Eingabefeld (Placeholder: „Neue Aufgabe...") per Enter-Taste erstellt werden.
- [ ] Nach dem Erstellen ist das Eingabefeld leer und bereit für die nächste Eingabe.
- [ ] Ein Task mit leerem oder nur-Whitespace-Titel kann nicht gespeichert werden (Submit wird blockiert, kein Feedback nötig).
- [ ] Alle bestehenden Tasks werden in der Reihenfolge ihrer Erstellung als Liste angezeigt.
- [ ] Ein Klick auf den Titel eines Tasks aktiviert den Inline-Edit-Zustand (Input-Feld mit aktuellem Titel, fokussiert).
- [ ] Im Inline-Edit-Zustand speichert Enter den neuen Titel (sofern nicht leer).
- [ ] Im Inline-Edit-Zustand verwirft ESC die Änderung – der Original-Titel bleibt erhalten.
- [ ] Ein Klick ausserhalb des aktiven Input-Felds (Blur) verwirft die Änderung – der Original-Titel bleibt erhalten.
- [ ] Zu jeder Zeit ist maximal ein Task im Inline-Edit-Zustand.
- [ ] Jeder Task hat eine Lösch-Aktion (z. B. Button oder Icon), die den Task sofort aus der Liste entfernt.
- [ ] Ein Task kann vom Tippen des Titels bis zur Anzeige in der Liste in unter 2 Sekunden erstellt werden (Erfolgskriterium aus Problem Statement).

### Edge Cases
- **Leerer Titel beim Erstellen:** Enter bei leerem oder Whitespace-only-Eingabefeld macht nichts – kein Task wird angelegt.
- **Leerer Titel beim Bearbeiten:** Versucht der Nutzer per Enter einen leeren Titel zu speichern, wird blockiert – Original bleibt.
- **Blur bei unverändertem Inhalt:** Wenn der Nutzer ins Feld klickt, nichts ändert und dann Blur auslöst, bleibt der Titel unverändert (kein Dirty-Flag nötig).
- **Löschen während aktiver Bearbeitung:** Löscht der Nutzer einen Task, der gerade bearbeitet wird (z. B. über Keyboard-Navigation), wird der Task sofort entfernt.
- **Sehr langer Titel:** Titel werden nicht auf eine Maximal-Länge begrenzt; das UI macht den Text wrappable oder truncated (visuell, nicht funktional kritisch).
- **Leere Liste (Empty State):** Bei null Tasks wird ein Hinweistext angezeigt (z. B. „Noch keine Aufgaben – leg los!") plus das sichtbare Create-Input.

### Nicht im Scope
- Status-Toggle (erledigt / offen) → FEAT-2
- Filterung oder Sortierung der Liste
- Persistenz (Daten gehen beim Reload verloren) → FEAT-3
- Drag-and-Drop-Sortierung
- Mehrfachauswahl oder Bulk-Aktionen
- Undo/Redo nach Löschen
- Tastaturkürzel über Enter/ESC hinaus

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-01*

### Einbettung im Produkt
Alle CRUD-Interaktionen leben auf dem einzigen Screen S-01 (Task-Liste).
Route: `/`

### Einstiegspunkte
Direkter App-Start – S-01 ist der einzige Einstiegspunkt.

### User Flow

```
App-Start
    ↓
S-01: Task-Liste – leeres Create-Input sichtbar
    ↓ Titel tippen + Enter
Task erscheint in Liste, Input wird geleert
    ↓ Klick auf Task-Titel
Inline-Edit-Zustand: Input mit aktuellem Titel, fokussiert
    ↓ Enter (nicht leer) / ESC / Blur
Titel gespeichert (Enter) oder verworfen (ESC/Blur)
    ↓ Klick auf Delete-Button
Task sofort aus Liste entfernt
```

### Interaktionsmuster
- **Primärmuster:** Liste + Inline-Editing — Referenz: `design-system/patterns/datenanzeige.md` (Einfache Liste)
- **Fehler-Handling:** Kein sichtbares Feedback bei blockiertem Submit (leerer Titel) – Submit macht schlicht nichts
- **Leerer Zustand:** Hinweistext (z. B. „Noch keine Aufgaben – leg los!") + sichtbares Create-Input (Research: „Hinweistext + Eingabefeld sichtbar")
- **Ladeverhalten:** Kein Ladezustand – alle Operationen sind synchron/lokal

### Eingesetzte Komponenten

| Komponente  | DS-Status       | Quelle                                       | Verwendung                                    |
|-------------|-----------------|----------------------------------------------|-----------------------------------------------|
| Input       | ✓ Vorhanden     | design-system/components/input.md            | Create-Feld (Variante: `default`, Size: `md`) |
| Input       | ✓ Vorhanden     | design-system/components/input.md            | Inline-Edit-Zustand (Variante: `default`, Size: `sm`) |
| Button      | ✓ Vorhanden     | design-system/components/button.md           | Delete-Aktion (Variante: `danger`, icon-only, Size: `sm`) |
| Card        | ✓ Vorhanden     | design-system/components/card.md             | App-Wrapper/Container (Variante: `default`) |
| TaskItem    | ⚠ Tokens-Build  | Kein Spec – List-Pattern als Referenz        | Listenzeile: Titel (klickbar) + Delete-Button; genehmigt 2026-04-01 |

### Screen Transitions (verbindlich)

Keine Screen-zu-Screen-Transitions – alle Interaktionen sind Zustandswechsel auf S-01.
Vollständige Zustandstabelle in `flows/product-flows.md` (Abschnitt "Zustandswechsel auf S-01").

| Von                       | Trigger                    | Wohin                              | Bedingung                    |
|---------------------------|----------------------------|------------------------------------|------------------------------|
| Input-Feld (gefüllt)      | Enter                      | Input geleert, Task in Liste       | Titel nicht leer/Whitespace  |
| Input-Feld (leer)         | Enter                      | Keine Änderung                     | Submit blockiert             |
| Task (normal)             | Klick auf Titel            | Task im Inline-Edit-Zustand        | –                            |
| Task im Inline-Edit       | Enter (Titel nicht leer)   | Task normal, neuer Titel           | –                            |
| Task im Inline-Edit       | Enter (Titel leer)         | Keine Änderung                     | Submit blockiert             |
| Task im Inline-Edit       | ESC                        | Task normal, Original-Titel        | –                            |
| Task im Inline-Edit       | Blur                       | Task normal, Original-Titel        | –                            |
| Task (beliebig)           | Klick auf Delete-Button    | Task aus Liste entfernt            | –                            |

*(Eingetragen in flows/product-flows.md)*

### DS-Status dieser Implementierung
- **Konforme Komponenten:** Input, Button, Card
- **Neue Komponenten (Tokens-Build, genehmigt):** TaskItem (List-Pattern Referenz)
- **Bewusste Abweichungen (Hypothesentest):** –

### Barrierefreiheit (A11y)
- **Keyboard-Navigation:** Tab zwischen Create-Input und Task-Elementen; Enter/ESC im Inline-Edit; Delete-Button per Tab erreichbar und per Enter/Space auslösbar
- **Screen Reader:** Create-Input mit `aria-label="Neue Aufgabe"` (kein sichtbares Label nötig, da Placeholder kontextuell ausreicht – Ausnahme der DS-Regel für Prototyp explizit akzeptiert); Delete-Button als icon-only immer mit `aria-label="[Titel] löschen"`; Inline-Edit-Input mit `aria-label="Titel bearbeiten"`
- **Farbkontrast:** Alle Text/Hintergrund-Kombinationen über DS-Tokens – Referenz: `design-system/tokens/colors.md`

### Mobile-Verhalten
- Out-of-Scope laut PRD (Desktop-only). Kein responsives Verhalten definiert.

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

```
App
└── TaskPage                          ← neuer Container, ersetzt Vite-Scaffold
    ├── Card                          ← DS: card.md (Variante: default)
    │   ├── TaskCreate                ← Create-Input + Enter-Handler
    │   │   └── Input                 ← DS: input.md (default, md)
    │   ├── TaskList                  ← rendert Array von TaskItem oder Empty State
    │   │   └── TaskItem (×n)         ← Tokens-Build: Titel (klickbar) + Delete-Button
    │   │       ├── [Anzeige-Modus]   ← Titel als <span>, klickbar
    │   │       │   └── Button        ← DS: button.md (danger, icon-only, sm) – Delete
    │   │       └── [Edit-Modus]      ← Input (DS: default, sm) + Enter/ESC/Blur-Handler
    │   └── TaskEmpty                 ← Hinweistext bei leerer Liste
    └── (kein weiterer Screen)
```

**Wiederverwendbar aus DS:**
- `Input` — design-system/components/input.md
- `Button` — design-system/components/button.md
- `Card` — design-system/components/card.md

**Neu zu bauen (Tokens-Build):**
- `TaskPage` — Layout-Container, ersetzt das Vite-Scaffold in App.tsx
- `TaskCreate` — Eingabe-Logik für neue Tasks
- `TaskList` — Listenrendering + Empty State
- `TaskItem` — Zeile mit Anzeige-/Edit-Modus und Delete-Button
- `TaskEmpty` — Hinweistext „Noch keine Aufgaben – leg los!"

### Daten-Model

Ein **Task** besteht aus:
- **id** — eindeutiger Identifier (generiert beim Erstellen, z.B. via `crypto.randomUUID()`)
- **title** — nicht-leerer String (Pflichtfeld)
- **createdAt** — Zeitstempel der Erstellung (für stabile Sortierung nach Erstellungsreihenfolge)

Gespeichert in: **React State** (`useState` in `TaskPage`). Kein externer State-Manager nötig – ein einzelner Screen, ein Datentyp, keine Seiteneffekte. FEAT-3 wird die Persistenz nachrüsten.

Das Task-Array wird als Single Source of Truth in `TaskPage` gehalten und per Props an Kinder weitergegeben.

### API / Daten-Fluss

Kein Backend, kein API. Alle Operationen sind synchrone State-Mutationen:

- **Create:** `TaskCreate` ruft Callback `onAdd(title)` auf → `TaskPage` erzeugt neues Task-Objekt und hängt es ans Array an
- **Update:** `TaskItem` ruft Callback `onUpdate(id, newTitle)` auf → `TaskPage` ersetzt den Titel im Array
- **Delete:** `TaskItem` ruft Callback `onDelete(id)` auf → `TaskPage` filtert Task aus Array

Datenfluss ist strikt **top-down** (Props + Callbacks), kein Context, kein globaler Store.

### Tech-Entscheidungen

- **Kein State-Management-Library:** Bei einem Screen mit einem Datentyp ist `useState` ausreichend. Overhead von Zustand/Redux wäre unverhältnismäßig.
- **`crypto.randomUUID()` für IDs:** Nativ in allen modernen Browsern, keine Dependency nötig. Stabil genug für Client-only State.
- **Kein separates Types-File:** Der Task-Typ wird als `interface` in einer Datei `types.ts` im `src/`-Verzeichnis definiert – minimale Struktur, die bei FEAT-2/3 mitwächst.
- **CSS Modules oder App.css:** Styling über die bestehende `App.css` bzw. komponentenspezifische CSS-Dateien – kein Tailwind oder CSS-in-JS (hält den Prototyp einfach und nahe am DS).

### Security-Anforderungen

- **Authentifizierung:** Keine – öffentliche lokale App ohne Backend.
- **Autorisierung:** Keine Rollen – Single-User-App.
- **Input-Validierung:** Title wird vor dem Speichern getrimmt und auf non-empty geprüft (sowohl Create als auch Edit). Kein HTML in Titeln nötig – React escaped JSX-Output automatisch (XSS-safe).
- **OWASP-relevante Punkte:** Kein Backend, kein API, keine Datenbank → kein SQL-Injection, kein CSRF. XSS durch React-Default-Escaping abgedeckt. Keine Secrets, keine Cookies.

### Dependencies

Keine neuen Packages nötig. Alles wird mit React-Bordmitteln und nativen Browser-APIs gebaut:
- `useState` für State
- `crypto.randomUUID()` für IDs
- Standard-DOM-Events für Keyboard/Focus-Handling

### Test-Setup

- **Unit Tests:**
  - Task-Erstellung: leerer Titel blockiert, gültiger Titel erzeugt Task
  - Task-Update: leerer Titel blockiert, gültiger Titel wird übernommen
  - Task-Delete: Task wird aus Liste entfernt
  - Edge Case: maximal ein Task gleichzeitig im Edit-Modus

- **Integration Tests:**
  - Vollständiger Create-Flow: Titel eingeben → Enter → Task in Liste sichtbar → Input leer
  - Inline-Edit-Flow: Klick → Titel ändern → Enter → neuer Titel angezeigt
  - ESC/Blur-Abbruch: Änderung wird verworfen, Original-Titel bleibt
  - Delete während Edit: Task wird trotzdem entfernt

- **E2E Tests:**
  - Happy Path: App öffnen → 3 Tasks erstellen → einen bearbeiten → einen löschen → korrekter Endzustand
  - Empty State: App öffnen → Hinweistext sichtbar → Task erstellen → Hinweistext verschwindet

Test-Framework: Vitest (kommt mit Vite) + React Testing Library für Component-Tests.

---

## 4. Implementierung
*Ausgefüllt von: /red:proto-dev — 2026-04-02*

### Implementierte Dateien
- `projekt/src/types.ts` – Task-Interface (id, title, createdAt)
- `projekt/src/components/TaskPage.tsx` – Container mit State-Management (useState für tasks + editingId)
- `projekt/src/components/TaskPage.css` – Layout: zentrierte Card auf Page-Background
- `projekt/src/components/TaskCreate.tsx` – Create-Input mit Enter-Handler und Whitespace-Validierung
- `projekt/src/components/TaskCreate.css` – Input-Styling nach DS (default, md)
- `projekt/src/components/TaskList.tsx` – Listenrendering oder Empty State
- `projekt/src/components/TaskList.css` – Reset-Styles für ul
- `projekt/src/components/TaskItem.tsx` – Zeile mit Anzeige-/Edit-Modus, Delete-Button, Keyboard-Navigation
- `projekt/src/components/TaskItem.css` – Inline-Edit, Danger-Delete, Hover/Focus-States
- `projekt/src/components/TaskEmpty.tsx` – Hinweistext "Noch keine Aufgaben – leg los!"
- `projekt/src/components/TaskEmpty.css` – Zentrierter Hinweistext
- `projekt/src/index.css` – Alle DS-Tokens als CSS Custom Properties + Global Reset
- `projekt/src/App.tsx` – Ersetzt Vite-Scaffold durch TaskPage

### Installierte Dependencies
- Keine – alles mit React-Bordmitteln (useState, crypto.randomUUID())

### Offene Punkte / Tech-Debt
- TaskItem ist ein Tokens-Build (keine DS-Komponenten-Spec) – dokumentiert in UX-Abschnitt als genehmigt
