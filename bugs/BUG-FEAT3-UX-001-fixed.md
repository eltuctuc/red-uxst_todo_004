# BUG-FEAT3-UX-001: Silent Reset bei korrupten Daten entspricht visuell dem ersten App-Start – Datenverlust nicht erkennbar

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Medium
- **Bereich:** UX / Flow
- **Gefunden von:** UX Reviewer
- **Status:** Fixed – 2026-04-02

## Problem

Wenn der localStorage-Eintrag korrupt ist und die App einen Silent Reset durchführt, sieht der Nutzer exakt denselben Zustand wie beim allerersten App-Start: den Empty State mit "Noch keine Aufgaben – leg los!" und ein leeres Create-Input.

Der Nutzer hat aber in einer vorherigen Session Tasks angelegt. Er hat eine berechtigte Erwartung, dass diese noch da sind. Stattdessen sind sie weg – ohne Erklärung, ohne Hinweis, ohne Möglichkeit nachzuvollziehen was passiert ist.

Für Persona Enrico (technikaffin, Desktop) bedeutet das: Er öffnet die App, erwartet seine Task-Liste, sieht eine leere App und denkt entweder (a) er ist auf der falschen URL, (b) ein Browser-Update hat die Daten gelöscht, oder (c) die App hat einen Fehler. Er hat keine Information um das einzuordnen. Das erzeugt Verwirrung und Misstrauen in die Persistenz-Funktion – genau das, was FEAT-3 aufbauen soll.

Die Spec erlaubt diesen Silent Reset explizit und definiert ihn als "kein sichtbarer Fehler". Das ist eine legitime Design-Entscheidung für einen Prototyp. Das UX-Problem ist nicht das Verhalten selbst, sondern dass der resultierende Zustand (leere App) keinerlei Unterschied zum Normalzustand kommuniziert.

## Steps to Reproduce

1. App starten und 3 Tasks erstellen
2. In DevTools: `localStorage.setItem('ux-stammtisch-tasks', 'INVALID_JSON')` ausführen
3. Seite neu laden

- **Expected:** User sieht entweder (a) seinen vorherigen Zustand wieder (Happy Path) oder (b) einen klaren Hinweis, dass die gespeicherten Daten nicht geladen werden konnten
- **Actual:** User sieht die leere App, identisch mit erstem Start – kein Hinweis auf Datenverlust, kein Kontext

## Empfehlung

Zwei Optionen, nach Aufwand sortiert:

**Option A (minimal, Prototyp-konform):** Eine einmalige, selbst-schliessende Hinweismeldung nach Silent Reset: "Gespeicherte Aufgaben konnten nicht geladen werden." Kein technischer Jargon, kein Fehler-Dialog. Kann als Alert-Banner (DS: `feedback.md`) implementiert werden, der nach 8 Sekunden automatisch verschwindet. Kein Handlungsbedarf nötig.

**Option B (einfachste Variante):** Einen Boolean-Flag `wasReset` aus `loadTasksFromStorage` zurückgeben. In `TaskPage` diesen Zustand tracken und einmalig im Empty State einen ergänzenden Hinweissatz zeigen: "Deine vorherigen Aufgaben konnten nicht wiederhergestellt werden." – nur wenn Reset passiert ist, nicht standardmässig.

Der Silent Reset als technisches Verhalten bleibt unverändert. Es geht nur darum, dem Nutzer minimalen Kontext zu geben, wenn seine Daten verloren gegangen sind.

## Priority

Fix before release
