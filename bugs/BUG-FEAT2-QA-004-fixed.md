# BUG-FEAT2-QA-004: Motion-Token-Fix (BUG-FEAT2-UX-002) nur in Checkbox.css umgesetzt – TaskItem.css weiterhin hardcoded

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Fixed — 2026-04-02: TaskItem.css – alle drei Transitions auf Motion Tokens umgestellt (--transition-bg, --transition-border, --transition-color) + prefers-reduced-motion Block ergänzt

## Steps to Reproduce

1. Code-Review von `projekt/src/components/TaskItem.css` durchführen
2. Expected: Alle Transitions in TaskItem.css verwenden DS Motion-Tokens (analog zur Checkbox.css nach BUG-FEAT2-UX-002-Fix)
3. Actual: TaskItem.css enthält drei hardcoded Transition-Werte:
   - Zeile 23: `transition: background-color 0.15s;` (task-item__title)
   - Zeile 46: `transition: border-color 0.15s;` (task-item__edit-input)
   - Zeile 68: `transition: background-color 0.15s, color 0.15s;` (task-item__delete)

## Technische Details

BUG-FEAT2-UX-002 wurde als "Fixed" markiert mit dem Kommentar "Motion Tokens statt hardcoded 0.15s". Der Fix wurde in `Checkbox.css` korrekt umgesetzt:

```css
/* Checkbox.css – korrekt */
transition: var(--transition-border), var(--transition-bg);
```

In `TaskItem.css` sind jedoch drei Transitions unverändert hardcoded geblieben. Der DS-Token `--transition-bg` entspricht `background-color 200ms ease-in-out`, nicht `background-color 0.15s` – d.h. Timing und Easing weichen auch inhaltlich vom DS ab.

Zusätzlich fehlt in `TaskItem.css` ein `@media (prefers-reduced-motion: reduce)` Block, der die Transitions deaktiviert. Checkbox.css hat diesen Block (BUG-FEAT2-UX-003-Fix). TaskItem.css nicht.

## Priority

Fix before release
