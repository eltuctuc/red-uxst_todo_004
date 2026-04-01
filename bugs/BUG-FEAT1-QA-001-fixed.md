# BUG-FEAT1-QA-001: useEffect ueberschreibt Edit-Wert wenn task.title sich aendert

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** High
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. Task A erstellen ("Originaltitel")
2. Task A in den Inline-Edit-Zustand versetzen (Klick auf Titel)
3. Nutzer beginnt einen neuen Titel zu tippen ("Neuer T...")
4. Gleichzeitig oder unmittelbar davor wird task.title durch einen externen Update geaendert (koennte in FEAT-2/3 relevant werden, aber auch heute bei schnellen State-Updates durch React Batching moeglich)
5. Expected: Der Nutzer-Tipp-Wert bleibt im Input-Feld erhalten
6. Actual: `useEffect` in TaskItem (Zeilen 25-30) hat `task.title` in der Dependency-Liste. Wenn isEditing=true ist und `task.title` sich aendert, wird `setEditValue(task.title)` ausgefuehrt und ueberschreibt den aktuell getippten Text des Nutzers.

## Technische Details

In `/Users/enricoreinsdorf/Projekte/ux-stammtisch_004/projekt/src/components/TaskItem.tsx`, Zeilen 25-30:

```typescript
useEffect(() => {
  if (isEditing) {
    setEditValue(task.title)  // Wird bei JEDEM task.title-Change ausgefuehrt, auch mitten im Tippen
    inputRef.current?.focus()
  }
}, [isEditing, task.title])
```

Die Intention war: Wenn der Edit-Modus startet, den aktuellen Titel ins Input laden. Die Implementierung laesst aber `task.title` als Dependency stehen, was dazu fuehrt dass jede Aenderung des Titels (z.B. durch einen zweiten parallel-laufenden Update-Mechanismus in FEAT-3) den Tipp-Zustand zerstoert.

Korrekte Logik: `task.title` sollte nur einmalig beim Wechsel von isEditing=false auf isEditing=true geladen werden. Die Dependency sollte nur `isEditing` enthalten, oder alternativ eine Ref fuer den "Entry-Titel" genutzt werden.

## Priority
Fix before release
