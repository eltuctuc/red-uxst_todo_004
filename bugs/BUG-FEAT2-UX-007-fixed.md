# BUG-FEAT2-UX-007: TaskItem.css – prefers-reduced-motion nicht beachtet

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-04-02: TaskItem.css – @media (prefers-reduced-motion: reduce) Block mit transition: none für .task-item__title, .task-item__edit-input, .task-item__delete ergänzt

## Problem

Der Fix fuer BUG-FEAT2-UX-003 hat `@media (prefers-reduced-motion: reduce)` korrekt in `Checkbox.css` ergaenzt. `TaskItem.css` enthaelt jedoch ebenfalls Transitions (`.task-item__title`, `.task-item__edit-input`, `.task-item__delete`) ohne entsprechenden `prefers-reduced-motion`-Block.

Nutzer die auf Betriebssystemebene "Bewegung reduzieren" aktiviert haben, erleben weiterhin Transitions beim Hover auf Titelzeile und Delete-Button sowie beim Fokus auf das Edit-Input-Feld. Das Design System (motion.md) und WCAG 2.1 erfordern dass alle Uebergaenge unter `prefers-reduced-motion` deaktiviert werden.

Das Problem existierte vor FEAT-2 bereits in TaskItem.css (FEAT-1-Erbe), ist aber durch den selektiven Fix von UX-003 jetzt eine sichtbare Inkonsistenz: Checkbox respektiert das User-Preference, TaskItem nicht.

## Steps to Reproduce

1. Betriebssystem auf "Bewegung reduzieren" setzen (macOS: Einstellungen > Bedienungshilfen > Bewegung > Bewegung reduzieren)
2. App laden, mit Maus ueber einen Task-Titel hovern oder in ein Edit-Input wechseln
3. Expected: Keine Transitions – sofortiger Zustandswechsel
4. Actual: Hover-Hintergrund auf `.task-item__title` und Hover-/Active-Zustand des Delete-Buttons laufen mit Transition trotz gesetztem prefers-reduced-motion

## Priority

Fix before release
