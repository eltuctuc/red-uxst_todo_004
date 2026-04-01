# BUG-FEAT1-QA-002: Blur nach Enter speichert – aber onCancelEdit wird trotzdem aufgerufen

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. Task erstellen ("Originaltitel")
2. Auf den Titel klicken -> Inline-Edit-Zustand aktiv
3. Neuen Titel eintippen ("Neuer Titel")
4. Enter druecken

5. Expected: Titel wird gespeichert. Keine weiteren State-Mutationen.
6. Actual: `handleSave()` wird aufgerufen (Zeile 32-36 TaskItem.tsx), `onUpdate(id, trimmed)` setzt `editingId` auf null in TaskPage. DANACH feuert der Browser automatisch den `blur`-Event auf dem Input, was `handleBlur()` aufruft, was wiederum `onCancelEdit()` aufruft. Das setzt `editingId` erneut auf null (schon null). Kein sichtbarer Fehler heute – aber logisch falsch: nach einem erfolgreichen Save wird Cancel-Logik ausgefuehrt.

## Technische Details

In `/Users/enricoreinsdorf/Projekte/ux-stammtisch_004/projekt/src/components/TaskItem.tsx`:

- `handleBlur` (Zeile 46-48) ruft immer `onCancelEdit()` auf, ohne zu pruefen ob gerade ein Save stattgefunden hat.
- Nach Enter -> `handleSave()` -> `onUpdate()` -> React setzt `isEditing=false` -> Input wird unmounted -> Blur feuert -> `onCancelEdit()` wird aufgerufen.

Heute ist der doppelte `setEditingId(null)`-Aufruf harmlos. Aber das Muster ist korrektheitstechnisch falsch: Eine Discard-Aktion wird nach einem erfolgreich abgeschlossenen Save ausgefuehrt. Wenn `onCancelEdit` in FEAT-2 oder FEAT-3 Seiteneffekte bekommt (z.B. State-Reset, Analytics-Events, Server-Abbruch), wird dieser Bug kritisch.

## Priority
Fix before release
