# BUG-FEAT3-QA-005: Gefilterte Task-Objekte (valides Array, ungültige Elemente) lösen kein Reset-Banner aus

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Low
- **Bereich:** Functional
- **Gefunden von:** QA Engineer (Runde 2)
- **Status:** Open

## Steps to Reproduce

1. App öffnen
2. In Browser-DevTools: `localStorage.setItem('ux-stammtisch-tasks', '[1, 2, 3]')` ausführen
3. Seite neu laden

- **Expected:** localStorage enthält ein valides JSON-Array, aber keine gültigen Task-Objekte. Die App startet mit leerer Liste. Da die Daten unbrauchbar waren, sollte idealerweise (wie bei korruptem JSON) ein Reset-Banner erscheinen.
- **Actual:** `loadTasksFromStorage` parst das Array erfolgreich. Der Filter auf Zeile 20–27 wirft alle Elemente heraus (`typeof 1 === 'object'` ist false). Zurückgegeben wird `{ tasks: [], wasReset: false }`. Der User sieht eine leere Task-Liste ohne Banner. Es gibt keine Rückmeldung dass Daten verworfen wurden.

## Weitere Reproduzierbare Eingaben

- `'[{"foo":"bar"}]'` – valides Objekt ohne id/title/completed → gefiltert, kein Banner
- `'[{"id":1,"title":"test","completed":false}]'` – id ist number statt string → gefiltert, kein Banner
- `'[null, null, null]'` – null-Werte im Array → gefiltert (typeof null === 'object' aber item !== null Check greift), kein Banner

## Root Cause

In `loadTasksFromStorage` (Zeile 20–28) wird `wasReset` nur auf `true` gesetzt wenn:
1. `JSON.parse` einen Fehler wirft (catch-Block)
2. Das geparste Ergebnis kein Array ist

Der Fall "valides Array, aber alle/einige Elemente sind strukturell ungültig" setzt `wasReset: false`. Das ist eine Inkonsistenz gegenüber AC-5 (Silent Reset bei unbrauchbaren Daten).

## Betroffene ACs

AC-5: "Sind die localStorage-Daten nicht als valides JSON parsebar..." – Der Wortlaut schließt diesen Fall aus ("parsebar"). Die Daten sind parsebar. Aber die Spec meint implizit "unbrauchbare Daten" (Definitionen-Abschnitt: "localStorage-Eintrag der nicht als valides JSON-Array von Task-Objekten geparst werden kann"). Task-Objekte mit fehlenden Pflichtfeldern fallen unter diese Definition.

## Einschätzung

Für einen Prototyp mit Single-User-Scope ist `[1, 2, 3]` im localStorage unrealistisch (der User schreibt nur über die App). Severity Low, weil das stille Fehlverhalten keine Datenverlust-Konsequenz hat – die App funktioniert korrekt (leer), der User wundert sich höchstens. Kein Crash.

Ein gültiges Argument ist auch: das Banner bei QA-002-Fix nicht zu zeigen ist bewusst korrekt, weil die App korrekt filtered und `wasReset` das Verhalten bei *syntaktisch korrupten Daten* signalisieren soll.

## Priority
Nice-to-have
