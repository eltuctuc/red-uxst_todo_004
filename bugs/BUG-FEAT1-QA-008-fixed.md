# BUG-FEAT1-QA-008: Edit-Modus bleibt ghost-aktiv nach Tab Delete-Button weiter-Tab

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Kontext

Eingeführt durch den Fix für BUG-FEAT1-QA-004/007: `handleBlur` prüft jetzt via `relatedTarget`, ob der Fokus vom Edit-Input auf den Delete-Button desselben Tasks wechselt – und unterdrückt in diesem Fall `onCancelEdit()`. Das ist korrekt für den direkten Delete-Button-Klick. Erzeugt aber einen neuen Folgefehler.

## Steps to Reproduce

1. Einen Task erstellen (z.B. "Test-Task")
2. Auf den Titel klicken → Edit-Modus aktiv (Input fokussiert)
3. Tab drücken → Fokus wechselt auf den Delete-Button desselben Tasks
   - `handleBlur` feuert, `relatedTarget === deleteButtonRef.current` → return, kein Cancel
   - Edit-Modus bleibt aktiv (`editingId` unverandert), Edit-Input bleibt im DOM sichtbar
4. Tab erneut drücken → Fokus wechselt auf das nächste Element (z.B. Delete-Button eines anderen Tasks oder Create-Input)
   - Der Delete-Button verliert den Fokus – kein `handleBlur` auf dem Delete-Button
   - Das Edit-Input ist noch im DOM, aber nicht fokussiert und nicht aktiv
5. Nutzer klickt nicht auf das Edit-Input zurück, sondern agiert anderswo

- **Expected:** Nach Tab-Weiterwechsel vom Delete-Button weg wird der Edit-Modus beendet (onCancelEdit ausgelöst). Der Titel-Span wird wieder angezeigt.
- **Actual:** `editingId` bleibt auf `task.id` gesetzt. Das Edit-Input bleibt sichtbar/gemounted, ist aber nicht fokussiert. `onCancelEdit()` wurde nie aufgerufen. Kein weiteres Blur-Event feuert auf dem Edit-Input (es hat den Fokus nicht mehr). Der Edit-Modus ist "eingefroren".

## Konsequenz des Frozen-State

- Das Edit-Input ist sichtbar, der ursprüngliche Text steht darin
- Kein sichtbarer Cursor im Input
- Der Nutzer kann in diesem Zustand einen anderen Task-Titel anklicken → `handleStartEdit(otherId)` → `editingId = otherId` – der vorherige Edit-Modus wird korrekt überschrieben. **Selbstheilend bei Interaktion.**
- Klickt der Nutzer aber auf eine neutrale Fläche außerhalb der Task-Liste, ändert sich nichts am State. Der "eingefrorene" Edit-Modus bleibt bis zur nächsten Interaktion mit einem Task.

## Technische Ursache

`TaskItem.tsx`, `handleBlur` (Zeilen 56–68):

```typescript
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  if (isSavingRef.current) {
    isSavingRef.current = false
    return
  }
  if (
    e.relatedTarget &&
    deleteButtonRef.current &&
    e.relatedTarget === deleteButtonRef.current
  ) {
    return  // Kein Cancel wenn Fokus auf Delete-Button geht
  }
  onCancelEdit()
}
```

Das `return` nach dem `relatedTarget`-Check gibt die Kontrolle komplett ab. Es existiert kein Mechanismus, der `onCancelEdit()` aufruft, wenn der Delete-Button danach den Fokus verliert. Der Delete-Button selbst hat kein `onBlur`-Handler, der den Edit-Modus beenden würde.

## Reproduzierbarkeit

Reproduzierbar im Tab-only-Keyboard-Flow: Edit-Input → Tab → Delete-Button → Tab weiter. Seltener Pfad, aber explizit durch die Spec abgedeckt: "Delete-Button per Tab erreichbar" (Section 2, Barrierefreiheit).

## Priority

Fix before release
