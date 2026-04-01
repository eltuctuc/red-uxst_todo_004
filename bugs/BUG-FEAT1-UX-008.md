# BUG-FEAT1-UX-008: Inputs ohne `autocomplete`-Attribut entgegen DS-Regel

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Low
- **Bereich:** DS-Compliance
- **Gefunden von:** UX Reviewer (Retest nach Bug-Fix-Sprint)
- **Status:** Open

## Problem

Die DS-Spec `input.md` schreibt unter "Regeln" explizit vor: "Autocomplete-Attribute setzen (email, name, tel etc.)". BUG-FEAT1-UX-003 hat das `name`-Attribut nachgezogen – das `autocomplete`-Attribut wurde dabei nicht miterfasst und ist in keinem der Inputs vorhanden:

- `TaskCreate.tsx`: `<input type="text" name="new-task">` – kein `autocomplete`
- `TaskItem.tsx` (Edit-Input): `<input type="text" name="edit-task">` – kein `autocomplete`

Ohne explizites `autocomplete`-Attribut überlässt die Implementierung es dem Browser, ob er Autofill-Vorschläge anbietet. Bei einem Task-Titel-Feld ist das unerwünscht (Browser könnten zuvor eingegebene Werte als Vorschlag zeigen, was im Edit-Kontext irreführend wirkt).

## Steps to Reproduce

1. `TaskCreate.tsx` und `TaskItem.tsx` auf `autocomplete`-Attribut prüfen
2. Expected: `autocomplete`-Attribut vorhanden (für Task-Titel sinnvoll: `autocomplete="off"`)
3. Actual: Kein `autocomplete`-Attribut gesetzt

## Empfehlung

- `TaskCreate`: `autocomplete="off"` hinzufügen (Task-Titel sind keine Browser-Autofill-Kandidaten)
- `TaskItem` (Edit-Input): `autocomplete="off"` hinzufügen

Triviale Änderung, verhindert unerwünschte Browser-Autofill-Vorschläge und erfüllt die DS-Regel.

## Priority

Nice-to-have
