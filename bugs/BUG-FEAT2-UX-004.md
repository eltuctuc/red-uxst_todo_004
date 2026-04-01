# BUG-FEAT2-UX-004: Hover-Border color-primary-300 zu schwach fuer ausreichenden Kontrast

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Low
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die UX-Spec definiert als Hover-Border fur die Checkbox (unchecked) den Token `color-primary-400`. Dieser Token existiert nicht im Design System – dokumentierte Tech-Debt-Entscheidung: stattdessen wird `color-primary-300` (#93C5FD) verwendet.

`color-primary-300` (#93C5FD) auf weissem Hintergrund `color-neutral-0` (#FFFFFF) ergibt einen Kontrast-Ratio von ca. 1.6:1. Das liegt deutlich unter dem WCAG 2.1 Mindestkontrast von 3:1 fur UI-Komponenten (Erfolgskriterium 1.4.11 Non-Text Contrast). Die Hover-Border ist damit zu blass um fur Nutzer mit Sehschwache als Zustandsindikator erkennbar zu sein.

Zum Vergleich: `color-primary-500` (#3B82F6) ergibt ca. 3.0:1 – genau an der WCAG-Grenze. `color-primary-600` (#2563EB) ware die sichere Wahl.

## Steps to Reproduce

1. App laden mit mindestens einem Task
2. Maus uber die Checkbox (unchecked) hovern
3. Expected: Hover-Border sichtbar mit mindestens 3:1 Kontrast gegenuber dem Hintergrund
4. Actual: Border wechselt auf color-primary-300 (#93C5FD) – visuell kaum erkennbar, Kontrast ca. 1.6:1

## Empfehlung

Zwei Optionen:
- **Option A (sauber):** `color-primary-400` als neuen Token ins Design System aufnehmen (z.B. `#60A5FA`) – loest das Grundproblem und schliesst die Token-Lucke
- **Option B (schnell):** Hover-Border auf `color-primary-500` oder `color-primary-600` setzen – beide verfugbar und mit ausreichend Kontrast

Da `color-primary-400` im DS fehlt und die Hover-Border visuell kaum erkennbar ist, empfiehlt sich Option B als Sofortmassnahme bis Option A entschieden wird.

## Priority

Nice-to-have
