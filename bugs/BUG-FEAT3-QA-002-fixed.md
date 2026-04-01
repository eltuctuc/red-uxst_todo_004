# BUG-FEAT3-QA-002: Task-Objekte mit fehlenden Pflichtfeldern werden ohne Fehler geladen – Runtime-Fehler bei Interaktion

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Fixed – 2026-04-02

## Steps to Reproduce

1. App öffnen
2. In den Browser-DevTools folgenden Wert setzen:
   `localStorage.setItem('ux-stammtisch-tasks', '[{"id":"x","title":"Kein completed-Feld","createdAt":1700000000000}]')`
3. Seite neu laden
4. Auf die Checkbox des geladenen Tasks klicken (Toggle-Aktion)

- **Expected:** Task wird korrekt angezeigt. Klick auf Checkbox togglet den Status von false auf true.
- **Actual:** Der Task wird geladen und gerendert (kein Absturz beim Laden). Beim Toggle-Klick wertet `handleToggle` aus: `!task.completed` → `!undefined` → `true`. Der Task wird auf `completed: true` gesetzt. Das ist technisch keine Exception, aber semantisch falsch – ein Task ohne `completed`-Feld verhält sich wie `completed: false` und springt beim ersten Toggle direkt auf `true`, ohne das normale `false` → `true` → `false` Verhalten.

## Weiterer Schadfall: fehlendes `id`-Feld

`localStorage.setItem('ux-stammtisch-tasks', '[{"title":"Kein ID","createdAt":1700000000000,"completed":false}]')`

- Task wird geladen. `id` ist `undefined`.
- React verwendet `id` als `key`-Prop in `TaskList` (über die `map`-Funktion). `key={undefined}` ist ein gültiger Wert in React (wird wie fehlend behandelt) – React warnt in der Konsole: `Each child in a list should have a unique "key" prop.`
- `handleDelete(id)` und `handleUpdate(id, ...)` filtern/mappen auf `task.id === id` mit `id === undefined` – könnte mehrere Tasks gleichzeitig treffen wenn mehrere Tasks ohne `id` geladen werden.

## Root Cause

`loadTasksFromStorage` prüft nur:
1. Ist der localStorage-Eintrag vorhanden?
2. Ist der Inhalt syntaktisch valides JSON?
3. (Nach BUG-FEAT3-QA-001-Fix) Ist das Ergebnis ein Array?

Eine strukturelle Validierung der einzelnen Array-Elemente fehlt. Das ist in der Tech-Design-Spec explizit als "Overengineering für den Prototyp" ausgeschlossen (`"Keine Schema-Validierung" [...] "wir kontrollieren beide Seiten"`). Das Argument gilt für normal persistierte Daten, nicht für manuell manipulierte oder aus fremden Quellen eingefügte Werte.

## Einschätzung

Für einen Prototyp mit Single-User-Scope ist dieser Fall theoretisch, da der Nutzer keine externen Daten importiert. Severity Medium, weil der Schadfall real auslösbar ist (DevTools) und zu stummem Fehlverhalten führt – kein Crash, aber falsche Datenlage ohne Fehlermeldung.

## Fix-Richtung

Array-Elemente filtern: Tasks ohne `id` oder ohne `completed`-Feld (typeof-Check) aus dem geladenen Array herauswerfen, oder den gesamten Eintrag löschen wenn die Struktur inkonsistent ist. Alternative: Defaults für fehlende Felder setzen.

## Priority
Fix before release
