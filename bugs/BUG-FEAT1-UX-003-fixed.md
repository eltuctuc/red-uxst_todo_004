# BUG-FEAT1-UX-003: Inputs haben kein `name`-Attribut

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die DS-Spec `input.md` schreibt unter "Regeln" explizit vor: "Jeder Input hat ein name-Attribut". Keines der drei Input-Felder in der Implementierung setzt dieses Attribut:

- `TaskCreate.tsx` – `<input type="text" ...>` ohne `name`
- `TaskItem.tsx` (Edit-Modus) – `<input type="text" ...>` ohne `name`

Das `name`-Attribut ist relevant für:
1. Accessibility-Tools und Browser-Autofill (auch wenn kein Formular-Submit vorhanden ist)
2. Konsistenz mit der DS-Spec – keine Ausnahme ist dokumentiert
3. Zukünftige Erweiterbarkeit (FEAT-3 Persistenz könnte Formular-Submit einführen)

## Steps to Reproduce

1. `TaskCreate.tsx` und `TaskItem.tsx` auf das `<input>`-Element prüfen
2. Expected: `name`-Attribut vorhanden (z. B. `name="new-task"` bzw. `name="edit-task"`)
3. Actual: Kein `name`-Attribut vorhanden

## Empfehlung

- `TaskCreate`: `name="new-task"` hinzufügen
- `TaskItem` (Edit-Input): `name="edit-task"` hinzufügen

Triviale Änderung, keine funktionale Auswirkung, aber DS-konform und zukunftssicher.

## Priority

Fix before release
