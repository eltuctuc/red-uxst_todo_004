# BUG-FEAT2-QA-002: Checkbox Hover-Border-Kontrast unterschreitet WCAG 1.4.11 (Non-Text Contrast)

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Fixed — 2026-04-02 — Hover-Border von `color-primary-300` (1.9:1) auf `color-primary-500` (4.5:1) geändert in Checkbox.css

## Steps to Reproduce

1. App oeffnen, mindestens einen Task erstellen
2. Maus ueber die Checkbox eines offenen Tasks hovern (ohne zu klicken)
3. Expected: Hover-Zustand zeigt Border-Farbe mit mindestens 3:1 Kontrast-Verhaeltnis gegen den Seitenhintergrund (WCAG 1.4.11 Non-Text Contrast)
4. Actual: Hover-Border wechselt auf `--color-primary-300` (#93C5FD) gegen `--color-neutral-0` (#FFFFFF). Kontrast-Verhaeltnis: ca. 1.9:1 – unterhalb des WCAG-Minimums von 3:1.

## Technische Details

In `projekt/src/components/Checkbox.css`, Zeile 41:

```css
/* Hover: unchecked */
.checkbox:hover .checkbox__box:not(.checkbox__box--checked) {
  border-color: var(--color-primary-300);
}
```

`color-primary-300` = #93C5FD (helles Blau)
Seitenhintergrund `color-neutral-0` = #FFFFFF

Kontrast #93C5FD auf #FFFFFF: ~1.9:1 (WCAG-Minimum fuer UI-Komponenten: 3:1)

Hintergrund: Die UX-Spec definierte `color-primary-400` als Hover-Color, der nicht als DS-Token existiert. Die Implementierung hat als naechsten verfuegbaren Token `color-primary-300` gewaehlt (dokumentiert in FEAT-2.md "Offene Punkte / Tech-Debt"). Dabei wurde der Kontrast nicht geprueft.

`color-primary-500` (#3B82F6) haette einen Kontrast von ~4.5:1 und waere konform. Alternativ genuegt es, den Hover-Zustand visuell anders zu kommunizieren (z.B. Box-Shadow statt Border-Color).

## Priority

Fix before release
