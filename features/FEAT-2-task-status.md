# FEAT-2: Task-Status

## Status
Aktueller Schritt: Dev

## Abhängigkeiten
- Benötigt: FEAT-1 (Task-CRUD) – Status-Toggle setzt eine bestehende Task-Liste voraus

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-01*

### Beschreibung
Der Nutzer kann jeden Task als erledigt markieren und diese Markierung wieder aufheben. Erledigte Tasks werden visuell durch eine angehakte Checkbox und einen durchgestrichenen Titel hervorgehoben. Kein Filter – alle Tasks bleiben jederzeit sichtbar.

### Definitionen
- **Status:** Binärer Zustand eines Tasks: `offen` (Standard) oder `erledigt`.
- **Status-Toggle:** Aktion, die den Status eines Tasks zwischen `offen` und `erledigt` wechselt.
- **Checkbox:** UI-Steuerelement links des Titels, das den aktuellen Status anzeigt und per Klick toggelt.

### User Stories
- Als Nutzer möchte ich einen Task per Checkbox-Klick als erledigt markieren, um meinen Fortschritt sichtbar zu machen.
- Als Nutzer möchte ich einen erledigten Task per erneutem Checkbox-Klick als offen markieren, um Fehler oder Planänderungen zu korrigieren.
- Als Nutzer möchte ich erledigte Tasks visuell unterscheiden (Strikethrough + Checkbox angehakt), ohne sie ausblenden zu müssen.
- Als Nutzer möchte ich auf einen Blick sehen welche Tasks noch offen sind, um mich auf die verbleibende Arbeit zu konzentrieren.

### Acceptance Criteria
- [ ] Jeder Task zeigt eine Checkbox links des Titels.
- [ ] Ein Klick auf die Checkbox eines offenen Tasks setzt den Status auf `erledigt`: Checkbox zeigt Haken, Titel ist durchgestrichen.
- [ ] Ein erneuter Klick auf die Checkbox eines erledigten Tasks setzt den Status zurück auf `offen`: Checkbox leer, Strikethrough entfernt.
- [ ] Der Status-Toggle ändert nicht die Position des Tasks in der Liste.
- [ ] Titelediting (FEAT-1 Inline-Edit) ändert den Status nicht – beide Aktionen sind vollständig unabhängig.
- [ ] Nach einem Löschen eines Tasks (FEAT-1) verschwindet er unabhängig von seinem Status.

### Edge Cases
- **Toggle auf erledigt, dann sofort Titel bearbeiten:** Status bleibt `erledigt`; Strikethrough bleibt erhalten während und nach dem Edit.
- **Schnelles Doppel-Klick auf Checkbox:** Toggle wird zweifach ausgeführt – Task landet wieder im ursprünglichen Status (idempotent durch Klick-Events, kein Debounce nötig).
- **Alle Tasks erledigt:** Kein Sonderverhalten – Liste zeigt alle Tasks durchgestrichen; kein „Alle erledigt"-Hinweis nötig.
- **Neuer Task nach erledigten Tasks:** Neu erstellte Tasks starten immer mit Status `offen`, unabhängig vom Status anderer Tasks.

### Nicht im Scope
- Filter (Alle / Offen / Erledigt)
- Bulk-Toggle (alle erledigen / alle öffnen)
- Fälligkeitsdaten oder Prioritäten
- Persistenz des Status → FEAT-3

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-02*

### Einbettung im Produkt
Erweiterung des bestehenden S-01 (Task-Liste) – kein neuer Screen.
Route: `/` (unverändert)

### Einstiegspunkte
Kein eigener Einstieg – Feature ist Teil jedes sichtbaren Tasks auf S-01.

### User Flow

```
S-01: Task-Liste – Tasks mit Checkbox sichtbar
    ↓ Klick auf Checkbox (offener Task)
Checkbox zeigt Haken, Titel wird durchgestrichen → Status: erledigt
    ↓ Klick auf Checkbox (erledigter Task)
Checkbox leer, Strikethrough entfernt → Status: offen
```

### Interaktionsmuster
- **Primärmuster:** Toggle-Interaktion – Checkbox als binärer Zustandswechsel (kein Formular-Submit, sofortige Wirkung)
- **Fehler-Handling:** Keins nötig – Toggle ist eine synchrone lokale Operation ohne Fehlerzustand
- **Leerer Zustand:** Wird von FEAT-1 gehandhabt (Empty State der Task-Liste)
- **Ladeverhalten:** Keins – Operation ist synchron/lokal

### Eingesetzte Komponenten

| Komponente | DS-Status | Quelle | Verwendung |
|---|---|---|---|
| Checkbox | ⚠ Tokens-Build | Keine Spec – genehmigt 2026-04-02 | Status-Toggle links des Titels in jeder TaskItem-Zeile |
| TaskItem | ⚠ Tokens-Build | Keine Spec – genehmigt in FEAT-1 (2026-04-01) | Erweitert um Checkbox als Leading-Element |

### Checkbox – Tokens-Build-Spezifikation

Da keine DS-Spec existiert, wird die Checkbox mit bestehenden Design Tokens gebaut:

| Eigenschaft | Zustand: unchecked | Zustand: checked |
|---|---|---|
| Größe | 18×18px (passt zu `text-sm` Zeilenhöhe) | 18×18px |
| Border | `1px color-border-default` | keine (gefüllt) |
| Border-Radius | `radius-default` | `radius-default` |
| Hintergrund | `color-neutral-0` | `color-primary-500` |
| Checkmark | – | Weiß (`color-text-on-primary`), SVG |
| Hover | Border: `color-primary-400` | Hintergrund: `color-primary-600` |
| Focus | Focus-Ring: `color-border-focus`, 2px, 2px Offset | Focus-Ring: `color-border-focus`, 2px, 2px Offset |
| Transition | `transition-colors` (150ms) | `transition-colors` (150ms) |

### Visueller Zustand: erledigter Task

| Eigenschaft | Wert |
|---|---|
| Titel-Textdekoration | `line-through` |
| Titel-Farbe | `color-text-disabled` (reduzierter Kontrast signalisiert "erledigt") |
| Checkbox | checked (Haken sichtbar) |
| Delete-Button | Unverändert sichtbar und funktional |

### Screen Transitions (verbindlich)

Keine Screen-zu-Screen-Transitions – alle Interaktionen sind Zustandswechsel auf S-01.
Vollständige Zustandstabelle in `flows/product-flows.md` (Abschnitt "Zustandswechsel auf S-01").

| Von | Trigger | Wohin | Bedingung |
|---|---|---|---|
| Task (offen) | Klick auf Checkbox | Task (erledigt): Checkbox checked, Titel durchgestrichen | – |
| Task (erledigt) | Klick auf Checkbox | Task (offen): Checkbox unchecked, Strikethrough entfernt | – |

*(Bereits in flows/product-flows.md eingetragen)*

### DS-Status dieser Implementierung
- **Konforme Komponenten:** – (keine reinen DS-Komponenten in FEAT-2)
- **Neue Komponenten (Tokens-Build, genehmigt):** Checkbox (2026-04-02)
- **Bewusste Abweichungen (Hypothesentest):** –

### Barrierefreiheit (A11y)
- **Keyboard-Navigation:** Checkbox per Tab erreichbar, Toggle per Space-Taste (native `<input type="checkbox">` Verhalten)
- **Screen Reader:** Checkbox mit `aria-label="[Task-Titel] als erledigt markieren"` (unchecked) bzw. `aria-label="[Task-Titel] als offen markieren"` (checked); Zustandsänderung wird über nativen Checkbox-State kommuniziert (`checked`-Attribut)
- **Farbkontrast:** Durchgestrichener Titel nutzt `color-text-disabled` – muss mindestens 3:1 Kontrast gegen `color-bg-surface` haben (dekorativer Text, nicht informationskritisch, da Checkbox-State die primäre Statusanzeige ist)
- **Keine Farbe als einziger Indikator:** Status wird durch Checkbox-Zustand (checked/unchecked) UND Strikethrough UND Farbänderung kommuniziert – drei redundante Kanäle

### Mobile-Verhalten
- Out-of-Scope laut PRD (Desktop-only). Kein responsives Verhalten definiert.

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

FEAT-2 erweitert die bestehende FEAT-1-Struktur – keine neuen Container oder Seiten.

```
TaskPage (aus FEAT-1)
└── Card
    ├── TaskCreate (unverändert)
    ├── TaskList (unverändert)
    │   └── TaskItem (erweitert)
    │       ├── Checkbox              ← NEU: Tokens-Build, leading
    │       ├── [Anzeige-Modus]       ← Titel + conditional Strikethrough
    │       │   └── Button (Delete)
    │       └── [Edit-Modus]          ← unverändert aus FEAT-1
    └── TaskEmpty (unverändert)
```

**Wiederverwendbar aus FEAT-1:**
- Gesamte Seitenstruktur, TaskCreate, TaskList, TaskEmpty bleiben unverändert

**Neu zu bauen (Tokens-Build):**
- `Checkbox` — Custom-Komponente nach UX-Tokens-Spec (18×18px, SVG-Checkmark, Hover/Focus-States)

**Zu erweitern:**
- `TaskItem` — Checkbox als Leading-Element einfügen; bedingtes Strikethrough + `color-text-disabled` bei Status `erledigt`

### Daten-Model

Erweiterung des Task-Objekts aus FEAT-1:
- **id** — (aus FEAT-1)
- **title** — (aus FEAT-1)
- **createdAt** — (aus FEAT-1)
- **completed** — Boolean, Standardwert `false`. `true` = erledigt, `false` = offen.

Gespeichert in: **React State** (gleicher `useState` in `TaskPage` wie FEAT-1). Das Task-Interface in `types.ts` wird um das Feld `completed` erweitert.

### API / Daten-Fluss

Kein Backend. Eine zusätzliche synchrone State-Mutation:

- **Toggle:** `TaskItem` ruft Callback `onToggle(id)` auf → `TaskPage` invertiert `completed` im Array

Datenfluss bleibt strikt top-down (Props + Callbacks). `onToggle` wird neben `onUpdate` und `onDelete` als weiterer Callback an `TaskItem` übergeben.

### Tech-Entscheidungen

- **Custom Checkbox statt `<input type="checkbox">`:** Die UX-Spec definiert eigene Tokens für Größe, Farben, Hover und Focus. Ein natives Checkbox-Element wird als verstecktes `<input>` beibehalten (A11y), visuell aber durch ein gestyltes Element ersetzt. So bleibt die native Keyboard- und Screen-Reader-Funktionalität erhalten.
- **Kein Debounce auf Toggle:** Wie in der Spec beschrieben – schnelles Doppelklicken führt einfach zu zweimaligem Toggle (idempotentes Verhalten). Kein extra Handling nötig.
- **Strikethrough + Farbwechsel über CSS-Klasse:** Eine einzige CSS-Klasse (z.B. `.task-completed`) schaltet `text-decoration: line-through` und `color: var(--color-text-disabled)` gleichzeitig um.

### Security-Anforderungen

- Identisch zu FEAT-1 – keine neuen Security-relevanten Aspekte. Boolean-Toggle auf Client-State ist unkritisch.

### Dependencies

Keine neuen Packages. Die Checkbox wird als reine React-Komponente mit CSS gebaut.

### Test-Setup

- **Unit Tests:**
  - Checkbox-Toggle: Klick wechselt `completed` von `false` auf `true` und zurück
  - Neuer Task startet mit `completed: false`
  - Toggle ändert nicht die Listenposition

- **Integration Tests:**
  - Toggle-Flow: Checkbox klicken → Strikethrough erscheint → erneut klicken → Strikethrough verschwindet
  - Toggle + Edit: Task als erledigt markieren → Titel bearbeiten → Status bleibt `erledigt`
  - Toggle + Delete: Erledigten Task löschen → Task ist weg

- **E2E Tests:**
  - Happy Path: 3 Tasks erstellen → 2 als erledigt markieren → einen wieder öffnen → korrekter visueller Zustand
  - Keyboard: Tab zur Checkbox → Space zum Toggeln → Status wechselt

Test-Framework: Vitest + React Testing Library (wie FEAT-1).

## 4. Implementierung
*Ausgefüllt von: /red:proto-dev — 2026-04-02*

### Implementierte Dateien
- `projekt/src/types.ts` – Task-Interface um `completed: boolean` erweitert
- `projekt/src/components/Checkbox.tsx` – Neue Checkbox-Komponente (Tokens-Build, native `<input>` für A11y, custom visual overlay)
- `projekt/src/components/Checkbox.css` – Tokens-basierte Styles: unchecked/checked/hover/focus-Zustände
- `projekt/src/components/TaskItem.tsx` – Checkbox als Leading-Element, `onToggle`-Callback, `.task-item__title--completed` für Strikethrough
- `projekt/src/components/TaskItem.css` – `.task-item__title--completed` Klasse (line-through + color-text-disabled)
- `projekt/src/components/TaskList.tsx` – `onToggle`-Prop durchgereicht an TaskItem
- `projekt/src/components/TaskPage.tsx` – `handleToggle` Handler (`prev.map + !completed`), `completed: false` beim Anlegen

### Installierte Dependencies
Keine neuen Packages.

### Offene Punkte / Tech-Debt
- `color-primary-400` ist kein definierter DS-Token → Hover-Border der Checkbox nutzt `color-primary-300` als nächstnäheren verfügbaren Token

---

## 5. QA Ergebnisse
*Ausgefüllt von: /red:proto-qa — 2026-04-02*

### Acceptance Criteria Status
- [x] AC-1: Jeder Task zeigt eine Checkbox links des Titels ✅
- [x] AC-2: Klick auf Checkbox (offen) → checked + Strikethrough ✅
- [x] AC-3: Klick auf Checkbox (erledigt) → unchecked, kein Strikethrough ✅
- [x] AC-4: Toggle ändert Listenposition nicht ✅
- [x] AC-5: Titelediting ändert Status nicht ✅
- [x] AC-6: Löschen unabhängig vom Status ✅

### Security-Check
Kein Befund. Boolean-Toggle ist immutabel implementiert, kein XSS-Risiko.

### A11y-Check
- aria-label dynamisch korrekt implementiert ✅
- Keyboard-Navigation (Tab + Space) funktioniert ✅
- Probleme: Touch Target zu klein (BUG-FEAT2-QA-001), Hover-Kontrast unter 3:1 (BUG-FEAT2-QA-002), prefers-reduced-motion fehlt (BUG-FEAT2-UX-003), Titeltext-Kontrast zu niedrig (BUG-FEAT2-UX-005)

### Offene Bugs
- BUG-FEAT2-QA-001 – Checkbox Touch Target zu klein (Medium)
- BUG-FEAT2-QA-002 – Hover-Border-Kontrast unter WCAG 1.4.11 (Medium)
- BUG-FEAT2-QA-003 – Strikethrough-Übergang ohne Transition (Low)
- BUG-FEAT2-UX-001 – Checkmark-Farbe hardcoded statt Token (Medium)
- BUG-FEAT2-UX-002 – Transitions hardcoded statt Motion-Tokens (Medium)
- BUG-FEAT2-UX-003 – prefers-reduced-motion nicht beachtet (Medium)
- BUG-FEAT2-UX-004 – Hover-Border color-primary-300 zu schwach (Low)
- BUG-FEAT2-UX-005 – Durchgestrichener Titel verfehlt Mindestkontrast 3:1 (Medium)

### Summary
- ✅ 6/6 Acceptance Criteria passed
- ❌ 8 Bugs (0 Critical, 0 High, 6 Medium, 2 Low)

### Production-Ready
❌ NOT Ready – 6 Medium-Bugs offen (A11y + DS-Compliance), alle auf "Fix before release"
