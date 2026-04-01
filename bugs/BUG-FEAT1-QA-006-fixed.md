# BUG-FEAT1-QA-006: focus() wird bei jedem task.title-Change im Edit-Modus erneut aufgerufen

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Low
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. Task erstellen
2. Auf Titel klicken -> Edit-Modus aktiv, Input fokussiert
3. Tippen (jeder Keystroke aendert editValue, aber nicht task.title – kein Problem hier)
4. Szenario: Wenn in FEAT-3 Persistenz via localStorage eingebaut wird und ein Storage-Event den task.title updated waehrend das Edit-Input aktiv ist

5. Expected: focus() wird nur einmalig aufgerufen wenn der Edit-Modus startet (isEditing wechselt von false auf true)
6. Actual: `inputRef.current?.focus()` steht im selben useEffect wie der task.title-Check. Jede Aenderung von task.title waehrend isEditing=true ruft erneut focus() auf.

## Technische Details

In `/Users/enricoreinsdorf/Projekte/ux-stammtisch_004/projekt/src/components/TaskItem.tsx`, Zeilen 25-30:

```typescript
useEffect(() => {
  if (isEditing) {
    setEditValue(task.title)     // Bug: ueberschreibt Tipp-Zustand (siehe BUG-001)
    inputRef.current?.focus()    // Bug: wird bei jedem task.title-Change re-applied
  }
}, [isEditing, task.title])
```

Das wiederholte `focus()` kann dazu fuehren dass der Nutzer-Cursor-Fokus zurueckgesetzt wird wenn er z.B. per Tab zum Delete-Button wechseln wollte und dann task.title sich aendert.

Dies ist ein direkter Begleitfehler zu BUG-FEAT1-QA-001 (gleiche Ursache: falsche useEffect-Dependencies). Wird gefixt wenn BUG-001 gefixt wird.

## Priority
Fix before release
