# BUG-FEAT3-UX-004: Alert-Banner hat Auto-Dismiss – DS-Pattern fordert persistentes Banner

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Medium
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Fixed – 2026-04-02
- **Fix:** `useEffect` mit `setTimeout` aus `TaskPage.tsx` entfernt. Banner bleibt persistent bis Nutzer den Close-Button klickt.

## Problem

Das `task-page__reset-notice`-Banner schliesst sich nach 8 Sekunden automatisch (`setTimeout` in TaskPage.tsx). Das widerspricht dem Alert-Banner-Pattern aus `design-system/patterns/feedback.md`.

Das DS definiert:
| Pattern | Persistent? |
|---------|-------------|
| Toast/Snackbar | Nein (3–5s) |
| Alert-Banner | Ja (manuell) |

Die Implementierung verwendet Alert-Banner-Markup und -Styling, aber Toast-Verhalten (Auto-Dismiss). Das ist eine nicht-genehmigte Abweichung vom DS-Pattern – im Feature-File (`## DS-Status dieser Implementierung`) ist keine Ausnahme dokumentiert.

Aus Nutzerperspektive ist das ein Problem: Der User hat gerade erfahren, dass seine gespeicherten Daten verloren sind. Das Banner ist der einzige Kontext, der diesen Datenverlust erklaert. Wenn er in diesem Moment nicht auf den Bildschirm schaut (abgelenkt, Tab wurde im Hintergrund geladen) ist das Banner weg bevor er es lesen konnte. Der Zustand ist danach identisch mit dem uninformierten Empty State, den BUG-FEAT3-UX-001 urspruenglich beschrieben hat.

8 Sekunden sind fuer den Textinhalt zwar lesbar – aber der Anlass (Datenverlust) rechtfertigt eine persistente Meldung, die der Nutzer selbst wegklickt wenn er sie verstanden hat.

## Steps to Reproduce

1. `localStorage.setItem('ux-stammtisch-tasks', 'KORRUPT')` in DevTools setzen
2. Tab in den Hintergrund bringen (oder kurz abwenden)
3. App laden (Tab im Hintergrund)
4. 8 Sekunden warten, Tab in den Vordergrund bringen
5. Expected: Banner ist noch sichtbar und erklaert den leeren Zustand
6. Actual: Banner ist verschwunden, App sieht aus wie erster App-Start ohne Erklaerung

## Empfehlung

Auto-Dismiss entfernen. Das Banner soll persistent bleiben bis der Nutzer aktiv den Close-Button klickt. Der Close-Button ist bereits vorhanden – das ist die vorgesehene Dismiss-Interaktion.

In `TaskPage.tsx` den `useEffect` mit dem `setTimeout` entfernen:

```tsx
// Entfernen:
useEffect(() => {
  if (!showResetNotice) return
  const timer = setTimeout(() => setShowResetNotice(false), 8000)
  return () => clearTimeout(timer)
}, [showResetNotice])
```

Der Close-Button `onClick={() => setShowResetNotice(false)}` bleibt unveraendert.

## Priority

Fix before release
