# BUG-FEAT3-UX-006: Stiller Teilverlust von Tasks ohne Nutzer-Feedback

- **Feature:** FEAT-3 – Persistenz
- **Severity:** Medium
- **Bereich:** UX / Flow
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Wenn der localStorage ein valides JSON-Array enthaelt, einzelne Elemente aber strukturell ungueltig sind (fehlende Pflichtfelder wie `id`, `title` oder `completed`), werden diese stillen Elemente durch den Filter in `loadTasksFromStorage` entfernt – ohne dass der Nutzer davon erfaehrt.

Der Code gibt in diesem Fall `{ tasks: validTasks, wasReset: false }` zurueck. `wasReset` bleibt `false`, das Reset-Banner wird nicht angezeigt. Der Nutzer sieht eine kuerzere Task-Liste als erwartet, ohne Erklaerung.

Das ist qualitativ ein anderer Fall als ein kompletter Silent Reset (der durch das Banner kommuniziert wird): Beim partiellen Verlust hat der Nutzer spezifische Tasks erwartet und vermisst sie nun. Das Banner-System existiert genau fuer diesen Informationsbedarf – es greift aber nicht.

Konkrete Situation:
- Nutzer hatte 5 Tasks gespeichert
- 2 Tasks haben nach einem Daten-Schema-Problem (z.B. veraltete App-Version ohne `completed`-Feld) kein `completed`-Feld mehr
- Nach Reload: 3 Tasks sichtbar, 2 verschwunden
- Banner: nicht sichtbar, kein Hinweis
- Nutzer: verwirrt, wiederholt Tasks oder vertraut der App nicht mehr

## Steps to Reproduce

1. In DevTools direkt in localStorage schreiben:
   ```js
   localStorage.setItem('ux-stammtisch-tasks', JSON.stringify([
     { id: '1', title: 'Valider Task', completed: false, createdAt: 1 },
     { id: '2', title: 'Unvollstaendiger Task' }  // kein completed-Feld
   ]))
   ```
2. App neu laden
3. Expected: Nutzer sieht entweder beide Tasks (toleranter Parse) oder wird informiert, dass ein Task nicht geladen werden konnte
4. Actual: Nur 1 Task sichtbar, kein Hinweis auf den verlorenen Task – Reset-Banner bleibt aus

## Empfehlung

Den `wasReset`-Flag auch bei partiellem Datenverlust setzen. Wenn `validTasks.length < parsed.length`, ist Daten verloren gegangen – der Nutzer soll es wissen.

Anpassung in `loadTasksFromStorage`:

```tsx
const validTasks = parsed.filter(...)
const hadPartialLoss = validTasks.length < parsed.length
return { tasks: validTasks, wasReset: hadPartialLoss }
```

Der Banner-Text koennte dann differenzieren (optionale Verbesserung):
- Vollstaendiger Reset: "Gespeicherte Aufgaben konnten nicht geladen werden."
- Partieller Verlust: "Einige Aufgaben konnten nicht geladen werden und wurden entfernt."

Alternativ (minimaler Fix): Gleiche Banner-Nachricht fuer beide Faelle – kein Text-Splitting noetig.

## Priority

Fix before release
