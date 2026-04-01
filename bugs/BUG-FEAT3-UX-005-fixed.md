# BUG-FEAT3-UX-005: Close-Button des Reset-Banners unterschreitet WCAG-Mindestgroesse fuer Touch-Target

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed – 2026-04-02
- **Fix:** `.task-page__reset-notice-close` in `TaskPage.css` auf `padding: 12px` gesetzt. Hit-Area ist jetzt 44x44px (20px + 2×12px), visuelles Erscheinungsbild unverändert.

## Problem

Der Close-Button im Reset-Banner hat eine Groesse von `width: 20px; height: 20px` (definiert in `TaskPage.css`). Es gibt kein erweitertes Padding das die Hit-Area vergroessert.

WCAG 2.5.5 (Level AA) fordert mindestens 44x44 CSS-Pixel fuer interaktive Elemente. Apple HIG und Material Design nennen ebenfalls 44pt bzw. 48dp als Minimum. 20x20 Pixel sind weniger als die Haelfte des Mindestmasses.

Das ist besonders problematisch weil:
1. Das Banner erscheint in einem Stress-Moment (Datenverlust). Der Nutzer wird das Banner schnell wegklicken wollen.
2. Das Banner ist die einzige Interaktionsmoeglchkeit in diesem Zustand. Eine schwer treffbare Schliessen-Taste erhoet Frustration genau dann, wenn der Nutzer sowieso schon verunsichert ist.
3. Auf Touch-Geraeten (Tablet, Touch-Monitor) ist ein 20px-Button eine Fehlklick-Falle.

## Steps to Reproduce

1. `localStorage.setItem('ux-stammtisch-tasks', 'KORRUPT')` setzen
2. App laden – Reset-Banner erscheint
3. Close-Button (×) per Touch versuchen zu treffen
4. Expected: Button ist zuverlaessig treffbar (44x44px Hit-Area)
5. Actual: Button-Flaeche ist 20x20px – miss clicks sind wahrscheinlich

## Empfehlung

Den Close-Button auf mindestens 44x44px erweitern. Zwei Optionen:

**Option A – Padding auf dem Button:**
```css
.task-page__reset-notice-close {
  width: 44px;
  height: 44px;
  /* statt width: 20px; height: 20px */
}
```

**Option B – Padding-basiert (visuelle Groesse bleibt 20px, Hit-Area ist 44px):**
```css
.task-page__reset-notice-close {
  width: 20px;
  height: 20px;
  padding: 12px; /* (44 - 20) / 2 = 12px auf jeder Seite */
}
```

Option B ist vorzuziehen wenn das visuelle Design des Buttons beibehalten werden soll. Das Padding vergrossert die Hit-Area ohne das Erscheinungsbild zu veraendern.

## Priority

Fix before release
