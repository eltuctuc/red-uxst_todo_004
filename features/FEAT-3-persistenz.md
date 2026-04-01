# FEAT-3: Persistenz

## Status
Aktueller Schritt: Dev

## Abhängigkeiten
- Benötigt: FEAT-1 (Task-CRUD) – Task-Datenstruktur muss definiert sein
- Benötigt: FEAT-2 (Task-Status) – Status muss mit persistiert werden

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-01*

### Beschreibung
Alle Tasks inkl. ihrer Status-Werte werden automatisch im localStorage des Browsers gespeichert. Beim nächsten Seitenaufruf werden die gespeicherten Daten geladen. Der Nutzer muss nichts aktiv tun – Speichern und Laden passieren transparent im Hintergrund.

### Definitionen
- **Persistenz:** Eigenschaft, dass Task-Daten einen Browser-Tab-Reload überleben, ohne Server-Kommunikation.
- **localStorage:** Browser-API zur synchronen Schlüssel-Wert-Speicherung, scoped auf Origin und Tab-unabhängig.
- **Storage-Key:** Der eindeutige Schlüssel unter dem die Task-Liste im localStorage abgelegt wird (z. B. `ux-stammtisch-tasks`).
- **Korrupte Daten:** localStorage-Eintrag der nicht als valides JSON-Array von Task-Objekten geparst werden kann.

### User Stories
- Als Nutzer möchte ich dass meine Tasks nach einem Seiten-Reload noch vorhanden sind, damit ich die App schließen und später weitermachen kann.
- Als Nutzer möchte ich dass Änderungen (Erstellen, Bearbeiten, Löschen, Status-Toggle) sofort gespeichert werden, ohne einen Speichern-Button drücken zu müssen.
- Als Nutzer möchte ich die App beim ersten Start ohne Konfiguration sofort nutzen können, damit kein Setup-Overhead entsteht.

### Acceptance Criteria
- [ ] Alle Tasks (Titel + Status) werden nach jeder Änderung automatisch im localStorage gespeichert.
- [ ] Beim App-Start werden die Tasks aus dem localStorage geladen und in der gespeicherten Reihenfolge angezeigt.
- [ ] Nach einem Seiten-Reload sind alle Tasks mit ihren Titeln und Status-Werten identisch zur vorherigen Session.
- [ ] Ist der localStorage-Schlüssel nicht vorhanden (erster Start), startet die App mit einer leeren Task-Liste.
- [ ] Sind die localStorage-Daten nicht als valides JSON parsebar, werden sie gelöscht und die App startet mit einer leeren Liste (silent reset, kein sichtbarer Fehler).
- [ ] Es gibt keinen expliziten „Speichern"-Button – Persistenz ist vollständig automatisch.

### Edge Cases
- **Erster App-Start (leerer localStorage):** Kein Fehler, leere Task-Liste wird angezeigt.
- **Korrupte Daten im localStorage:** JSON.parse schlägt fehl → localStorage-Eintrag löschen, App mit leerer Liste starten. Kein sichtbarer Fehler für den User.
- **localStorage voll (QuotaExceededError):** Für eine single-user Minimal-App mit Text-Tasks praktisch nicht relevant – kein spezielles Handling nötig.
- **Mehrere Tabs gleichzeitig:** Kein Cross-Tab-Sync – jeder Tab arbeitet unabhängig. Beim Reload eines Tabs werden die zuletzt geschriebenen Daten geladen (Last-Write-Wins durch den zuletzt aktiven Tab).
- **Privat/Inkognito-Modus:** localStorage kann eingeschränkt sein. Kein spezielles Handling – App verhält sich wie beim ersten Start.

### Nicht im Scope
- Server-seitige Persistenz, Cloud-Sync oder Backup
- Export / Import von Task-Daten
- Cross-Tab-Synchronisation (StorageEvent)
- Versionierung des Daten-Schemas / Migrations
- Offline-Support via Service Worker

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-02*

### Einbettung im Produkt
Kein eigener Screen. Persistenz ist eine unsichtbare Systemfunktion, die vollständig im Hintergrund auf S-01 (Task-Liste) arbeitet.

### Einstiegspunkte
Keine – das Feature hat keinen vom Nutzer auslösbaren Einstiegspunkt. Es aktiviert sich automatisch bei App-Start (Laden) und nach jeder Datenänderung (Speichern).

### User Flow
Nicht anwendbar. Der Nutzer interagiert nicht bewusst mit Persistenz. Der implizite Flow:

App-Start
    ↓
localStorage vorhanden? → Ja: Tasks laden und anzeigen
                        → Nein / korrupt: Leere Liste (Silent Reset)
    ↓
Nutzer arbeitet normal (FEAT-1, FEAT-2)
    ↓
Nach jeder Änderung: automatisches Speichern im Hintergrund

### Interaktionsmuster
- **Primärmuster:** Keine sichtbare Interaktion – vollständig transparent
- **Fehler-Handling:** Silent Reset bei korrupten Daten. Kein Fehler-Dialog, kein Toast, keine Meldung. App startet einfach mit leerer Liste.
- **Leerer Zustand:** Identisch mit FEAT-1 Empty State (Hinweistext + Eingabefeld sichtbar)
- **Ladeverhalten:** Synchron via localStorage – kein Skeleton, kein Spinner nötig (localStorage ist blocking und sub-ms schnell)

### Eingesetzte Komponenten
| Komponente | DS-Status | Quelle |
|---|---|---|
| – | – | Keine UI-Komponenten nötig |

Dieses Feature benötigt keine visuellen Komponenten. Es ist reine Datenlogik.

### Screen Transitions (verbindlich)
| Von | Trigger | Wohin | Bedingung |
|---|---|---|---|
| – | – | – | Keine Transitions – Feature ist unsichtbar |

Keine neuen Transitions. Alle bestehenden Zustandswechsel auf S-01 (definiert in FEAT-1, FEAT-2) bleiben unverändert.

### DS-Status dieser Implementierung
- **Konforme Komponenten:** –
- **Neue Komponenten (Tokens-Build, genehmigt):** –
- **Bewusste Abweichungen (Hypothesentest):** –

### Barrierefreiheit (A11y)
Nicht anwendbar – kein sichtbares UI. Persistenz hat keine Auswirkung auf Accessibility.

### Mobile-Verhalten
Nicht anwendbar – localStorage funktioniert identisch auf allen Plattformen. Kein UI-spezifisches Verhalten.

### Begründung für minimalen UX-Abschnitt
FEAT-3 ist ein rein technisches Feature ohne sichtbare UI-Elemente. Die bewusste Design-Entscheidung ist: **Der Nutzer soll von Persistenz nichts merken.** Kein Speichern-Button, kein Lade-Indikator, kein Fehler-Dialog. Transparenz ist das UX-Prinzip.

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

Keine neuen Komponenten. FEAT-3 ändert ausschließlich die Dateninitialisierung und State-Updates in `TaskPage`.

```
TaskPage (angepasst)
├── Initial State: localStorage → useState (statt leeres Array)
├── State-Updates: jeder Setter schreibt zusätzlich in localStorage
└── Alle Kind-Komponenten: unverändert
```

**Zu ändern:**
- `TaskPage` — State-Initialisierung und Persist-Logik

**Kein neues File nötig** – die Logik lebt direkt in `TaskPage` als Custom Hook oder Inline-Logik.

### Daten-Model

Identisch zu FEAT-1 + FEAT-2. Keine neuen Felder.

**Serialisierungsformat:** Das Task-Array wird als JSON-String unter einem festen Key gespeichert.

- **Storage-Key:** `ux-stammtisch-tasks`
- **Wert:** `JSON.stringify(tasks)` — Array von Task-Objekten mit `id`, `title`, `createdAt`, `completed`
- **Beim Laden:** `JSON.parse(localStorage.getItem(key))` — mit Validierung (siehe unten)

Gespeichert in: **localStorage** (zusätzlich zum React State, der weiterhin die Runtime-Wahrheit ist).

### API / Daten-Fluss

Kein Backend. Zwei neue Datenpfade:

**Laden (einmalig bei App-Start):**
1. `localStorage.getItem('ux-stammtisch-tasks')` lesen
2. Falls `null` → leeres Array (erster Start)
3. Falls vorhanden → `JSON.parse()` in try/catch
4. Falls Parse fehlschlägt → `localStorage.removeItem()`, leeres Array (Silent Reset)
5. Falls Parse erfolgreich → als Initialwert für `useState` nutzen

**Speichern (nach jeder Mutation):**
- Nach jedem Create, Update, Delete oder Toggle wird das neue Task-Array via `JSON.stringify()` in localStorage geschrieben
- Umsetzung: `useEffect` mit `tasks` als Dependency, oder direkt in den Setter-Funktionen

### Tech-Entscheidungen

- **`useEffect` vs. direkte Schreibung:** `useEffect(() => localStorage.setItem(...), [tasks])` ist sauberer – eine einzige Stelle für alle Persist-Logik, statt in jedem Handler einzeln. Nachteil: ein zusätzlicher Render-Zyklus Verzögerung. Bei synchronem localStorage irrelevant.
- **Kein Custom Hook:** Bei dieser Komplexität (3 Zeilen Laden, 3 Zeilen Speichern) lohnt sich kein `useLocalStorage`-Abstraktions-Hook. Falls die Logik wächst, kann sie später extrahiert werden.
- **Keine Schema-Validierung:** Für den Prototyp reicht ein try/catch um `JSON.parse`. Strukturelle Validierung (hat jedes Objekt `id`, `title`, etc.) wäre Overengineering – wir kontrollieren beide Seiten (Schreiben und Lesen).
- **Kein Migrations-System:** Explizit out-of-scope laut Spec. Falls sich das Daten-Model ändert, wird beim nächsten Feature entschieden.

### Security-Anforderungen

- **localStorage-Zugriff:** Nur eigene Origin kann auf die Daten zugreifen (Same-Origin-Policy). Kein zusätzlicher Schutz nötig für einen Prototyp.
- **Keine sensiblen Daten:** Task-Titel und Status sind nicht vertraulich.
- **XSS-Risiko durch localStorage:** Theoretisch kann ein XSS-Angriff localStorage lesen/schreiben. Da kein Backend existiert und keine externen Skripte geladen werden, ist das Risiko minimal. React-Default-Escaping verhindert, dass manipulierte Titel zu XSS führen.

### Dependencies

Keine. `localStorage` ist eine native Browser-API.

### Test-Setup

- **Unit Tests:**
  - Laden bei leerem localStorage → leere Task-Liste
  - Laden bei validem JSON → Tasks korrekt wiederhergestellt (Titel + Status)
  - Laden bei korruptem JSON → Silent Reset, leere Liste, localStorage-Key gelöscht
  - Speichern nach Create → localStorage enthält neuen Task
  - Speichern nach Toggle → localStorage enthält aktualisierten Status

- **Integration Tests:**
  - Full Roundtrip: Task erstellen → localStorage prüfen → Seite neu laden (State zurücksetzen + erneut aus localStorage lesen) → Task ist noch da
  - Edit + Persist: Titel ändern → Reload → neuer Titel sichtbar
  - Delete + Persist: Task löschen → Reload → Task weg

- **E2E Tests:**
  - Persistence Happy Path: 2 Tasks erstellen, 1 als erledigt markieren → Browser-Reload → identischer Zustand
  - Corrupt Recovery: localStorage manuell auf ungültiges JSON setzen → App laden → leere Liste, kein Fehler

Test-Framework: Vitest + React Testing Library (wie FEAT-1/2). localStorage kann in Tests via `vi.stubGlobal` oder JSDOM gemockt werden.

---

## 4. Implementierung
*Ausgefüllt von: /red:proto-dev — 2026-04-02*

### Implementierte Dateien
- `projekt/src/components/TaskPage.tsx` – State-Initialisierung aus localStorage (lazy initializer) + `useEffect` für automatisches Speichern nach jeder Mutation

### Installierte Dependencies
Keine – `localStorage` ist native Browser-API.

### Offene Punkte / Tech-Debt
Keine.
