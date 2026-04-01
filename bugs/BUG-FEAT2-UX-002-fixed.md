# BUG-FEAT2-UX-002: Transitions hardcoded statt Motion-Tokens

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-04-02 — Motion-Tokens `--transition-border` und `--transition-bg` (200ms ease-in-out) in index.css definiert und in Checkbox.css verwendet

## Problem

In `Checkbox.css` sind die Transition-Werte direkt als Zeitangaben hartcodiert:

- `.checkbox__box`: `transition: border-color 0.15s, background-color 0.15s;`

Das Design System definiert in `design-system/tokens/motion.md` verbindliche Motion-Tokens, u.a.:
- `transition-color` → `color 200ms ease-in-out`
- `transition-bg` → `background-color 200ms ease-in-out`
- `transition-border` → `border-color 200ms ease-in-out`

Die UX-Spec sagt "transition-colors 150ms" – aber dieser Token-Name existiert nicht im DS. Stattdessen wurden `transition-border` und `transition-bg` (beide 200ms ease-in-out) als passende Tokens verwendet werden sollen. Die Implementierung nutzt weder den korrekten Token-Wert (200ms) noch CSS Custom Properties fur die Motion-Tokens, sondern hardcoded `0.15s` (150ms).

Konsequenz: Wenn Motion-Tokens global angepasst werden (z.B. auf 100ms fur ein snappigeres Feeling), bleibt die Checkbox aussen vor.

## Steps to Reproduce

1. `projekt/src/components/Checkbox.css` offnen, Zeile 30
2. `transition: border-color 0.15s, background-color 0.15s;` pruefen
3. Expected: Transition-Werte uber CSS-Variablen aus dem Motion-Token-Set oder zumindest konsistent 200ms wie die DS-Tokens vorgeben
4. Actual: Hardcoded `0.15s` ohne Easing-Angabe – weder Token-Name noch korrekter Wert

## Empfehlung

Wenn das Projekt CSS Custom Properties fur Motion-Tokens definiert (z.B. `--transition-border`, `--transition-bg`), diese verwenden. Falls noch nicht vorhanden: Timing zumindest auf 200ms ease-in-out korrigieren, um mit dem DS-Wert konsistent zu sein. Die Abweichung auf 150ms ist ohne dokumentierten Grund eine Inkonsistenz.

## Priority

Fix before release
