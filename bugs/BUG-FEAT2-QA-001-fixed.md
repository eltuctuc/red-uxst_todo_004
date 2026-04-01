# BUG-FEAT2-QA-001: Checkbox Touch Target zu klein – 18x18px statt WCAG-Minimum 44x44px

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Fixed — 2026-04-02 — `.checkbox` erhält `min-width: 44px; min-height: 44px; justify-content: center;` in Checkbox.css

## Steps to Reproduce

1. App oeffnen, mindestens einen Task erstellen
2. Checkbox links des Task-Titels per Touch oder mit praezisem Maus-Klick anvisieren
3. Expected: Klickbarer Bereich ist mindestens 44x44px (WCAG 2.5.5)
4. Actual: Klickbarer Bereich entspricht der visuellen Groesse des `<label>`-Elements: 18x18px (Checkbox-Box-Groesse). Das `<label>` hat kein Padding, kein min-width, kein min-height.

## Technische Details

In `projekt/src/components/Checkbox.css`:

```css
.checkbox {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  /* kein min-width / min-height / padding */
}

.checkbox__box {
  width: 18px;
  height: 18px;
  /* ... */
}
```

Der Delete-Button hat dieses Problem durch BUG-FEAT1-UX-009 bereits behoben bekommen (`min-width: 44px; min-height: 44px`). Die Checkbox wurde mit demselben Fehler implementiert.

WCAG 2.5.5 (Level AA) fordert mindestens 44x44 CSS-Pixel fuer alle interaktiven Elemente.

Fix: `.checkbox` erhaelt `min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;`

## Kontext: Regression-Awareness

BUG-FEAT1-UX-009 hat das identische Problem fuer den Delete-Button behoben. Die Checkbox ist ein neues interaktives Element desselben Patterns und haette beim gleichen Fix-Ansatz berücksichtigt werden müssen.

## Priority

Fix before release
