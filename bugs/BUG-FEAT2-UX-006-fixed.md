# BUG-FEAT2-UX-006: TaskItem.css – Transitions hardcoded statt Motion-Tokens

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** DS-Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-04-02: TaskItem.css – alle drei Transitions auf DS Motion-Tokens umgestellt (identisch zu BUG-FEAT2-QA-004)

## Problem

Der Fix fuer BUG-FEAT2-UX-002 hat Motion-Tokens korrekt in `Checkbox.css` eingefuehrt. Dieselben Hardcoding-Verst(oe)sse existieren jedoch weiterhin in `TaskItem.css` an drei Stellen:

- Zeile 23: `.task-item__title` – `transition: background-color 0.15s;` (statt `var(--transition-bg)`)
- Zeile 47: `.task-item__edit-input` – `transition: border-color 0.15s;` (statt `var(--transition-border)`)
- Zeile 68: `.task-item__delete` – `transition: background-color 0.15s, color 0.15s;` (statt `var(--transition-bg), var(--transition-color)`)

Die Motion-Tokens `--transition-bg`, `--transition-border` und `--transition-color` sind in `index.css` definiert und koennen direkt verwendet werden. Die Werte in `TaskItem.css` sind ausserdem falsch (150ms statt der DS-Standard-200ms) und fehlen die Easing-Angabe (`ease-in-out`).

## Steps to Reproduce

1. `projekt/src/components/TaskItem.css` oeffnen, Zeilen 23, 47, 68 pruefen
2. Expected: `transition: var(--transition-bg)` bzw. `var(--transition-border)` bzw. `var(--transition-bg), var(--transition-color)`
3. Actual: Hardcoded `0.15s` ohne Easing – abweichend von DS-Tokens (200ms ease-in-out) und nicht token-gesteuert

## Priority

Fix before release
