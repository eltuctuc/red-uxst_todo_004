# BUG-FEAT2-QA-003: Strikethrough-Zustandswechsel ohne Transition – inkonsistent zur Checkbox-Animation

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Low
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. App oeffnen, mindestens einen Task erstellen
2. Auf die Checkbox klicken, um den Task als erledigt zu markieren
3. Beobachten wie Checkbox und Titel reagieren
4. Expected: Checkbox und Titel-Strikethrough wechseln gleichzeitig und mit aehnlichem Timing (Checkbox hat 150ms transition-colors)
5. Actual: Die Checkbox animiert smooth ueber 150ms (`transition: border-color 0.15s, background-color 0.15s`). Der Titeltext wechselt abrupt ohne Transition von normal zu `text-decoration: line-through` und `color: var(--color-text-disabled)`.

## Technische Details

In `projekt/src/components/TaskItem.css`:

```css
.task-item__title--completed {
  text-decoration: line-through;
  color: var(--color-text-disabled);
  /* kein transition */
}

.task-item__title {
  /* ... */
  transition: background-color 0.15s;
  /* kein transition fuer color oder text-decoration */
}
```

Die Checkbox hat explizit `transition: border-color 0.15s, background-color 0.15s` definiert. Der Titelzustand hat keine Entsprechung. Das erzeugt ein visuell inkonsistentes Toggle-Erlebnis: Checkbox wechselt smooth, Titel springt.

Fix: `.task-item__title` erhaelt `transition: color 0.15s;` (text-decoration ist in CSS nicht animierbar in allen Browsern, aber die Farbvenderung wuerde den Hauptteil des visuellen Wechsels glaetten).

## Priority

Nice-to-have
