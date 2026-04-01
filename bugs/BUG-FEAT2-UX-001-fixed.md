# BUG-FEAT2-UX-001: Checkmark-Farbe hardcoded statt Token

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-04-02 — SVG stroke="currentColor", CSS `.checkbox__box svg { color: var(--color-text-on-primary) }` in Checkbox.css

## Problem

In `Checkbox.tsx` ist der SVG-Checkmark mit `stroke="white"` hardcoded. Die UX-Spec definiert explizit `color-text-on-primary` als Token fur die Checkmark-Farbe. Das Hardcoding verstosst gegen die DS-Grundregel "keine Hardcoded-Werte" und macht den Wert immun gegenuber Token-Updates (z.B. wenn sich `color-text-on-primary` im Dark-Mode oder bei Theming andert).

Konkret: `stroke="white"` als SVG-Attribut ist nicht CSS-Variable-fahig und ignoriert das Token-System vollstandig.

## Steps to Reproduce

1. `projekt/src/components/Checkbox.tsx` offnen, Zeile 22
2. `stroke="white"` pruefen
3. Expected: Checkmark-Farbe uber CSS und Token gesteuert (z.B. `color: var(--color-text-on-primary)` auf dem SVG-Element, `stroke="currentColor"`)
4. Actual: `stroke="white"` hardcoded im SVG-Attribut – Token wird nicht verwendet

## Empfehlung

SVG-Pfad auf `stroke="currentColor"` umstellen, CSS-Klasse auf dem SVG-Element (oder dem umgebenden `span`) mit `color: var(--color-text-on-primary)` versehen. Damit ist die Farbe token-gesteuert und reagiert auf Theming.

## Priority

Fix before release
