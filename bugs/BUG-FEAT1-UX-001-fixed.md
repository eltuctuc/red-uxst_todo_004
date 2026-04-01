# BUG-FEAT1-UX-001: Delete ohne Bestätigung – undokumentierte Abweichung von DS-Regel

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die DS-Spec `button.md` schreibt verbindlich vor: "Danger-Buttons erst nach Bestätigung (Modal oder Inline-Confirm)". Der Delete-Button in `TaskItem` loescht den Task sofort beim ersten Klick ohne jede Bestätigung.

Die Feature-Spec (Abschnitt 1, AC: "Jeder Task hat eine Lösch-Aktion [...] die den Task sofort aus der Liste entfernt") definiert das "sofort" als gewolltes Verhalten. Diese Abweichung von der DS-Regel ist jedoch nicht als Hypothesentest oder genehmigte Ausnahme dokumentiert. Im Abschnitt "DS-Status dieser Implementierung" steht unter "Bewusste Abweichungen (Hypothesentest): –".

Solange die Ausnahme nicht dokumentiert ist, ist das ein UX-Bug (Bereich: Konsistenz, DS-Abweichung nicht autorisiert).

## Steps to Reproduce

1. App oeffnen
2. Einen Task erstellen (z. B. "Wichtige Aufgabe")
3. Auf den X-Button (Delete) klicken
4. Expected: Bestätigungsdialog oder Inline-Confirm erscheint
5. Actual: Task wird sofort ohne Rückfrage gelöscht

## Empfehlung

Entweder:
- **Option A (DS-konform):** Inline-Confirm direkt im TaskItem einbauen – z. B. nach Klick auf Delete erscheint ein sekundärer "Wirklich löschen?"-Button für 3 Sekunden sichtbar, danach automatisch wieder weg. Kein Modal nötig.
- **Option B (Ausnahme dokumentieren):** Die sofortige Löschung als bewusste Abweichung in der Feature-Spec unter "Bewusste Abweichungen (Hypothesentest)" eintragen und begründen (z. B. "Prototyp, single user, kein kritischer Datenverlust").

Option B ist für diesen Prototyp der schnellere und ehrlichere Weg.

## Priority

Fix before release
