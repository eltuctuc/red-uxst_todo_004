# BUG-FEAT1-QA-003: Span mit role="button" hat kein aria-label – Screen Reader Kontext fehlt

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. App mit Screen Reader (z.B. VoiceOver macOS, NVDA Windows) oeffnen
2. Zum Task-Titel-Element navigieren (Tab oder Pfeiltasten)

3. Expected: Screen Reader liest vor: "[Task-Titel] – bearbeiten" oder aequivalent mit Hinweis auf die Aktion
4. Actual: Screen Reader liest vor: "[Task-Titel] – Schaltflaeche" (oder nur den Titel, je nach SR). Kein Hinweis dass ein Klick den Edit-Modus aktiviert.

## Technische Details

In `/Users/enricoreinsdorf/Projekte/ux-stammtisch_004/projekt/src/components/TaskItem.tsx`, Zeilen 63-77:

```tsx
<span
  className="task-item__title"
  role="button"
  tabIndex={0}
  onClick={() => onStartEdit(task.id)}
  onKeyDown={...}
>
  {task.title}
</span>
```

Die Spec (Section 2, Barrierefreiheit) definiert:
- Delete-Button: `aria-label="[Titel] löschen"` – korrekt implementiert
- Inline-Edit-Input: `aria-label="Titel bearbeiten"` – korrekt implementiert
- Fuer den Titel-Span (Edit-Trigger) ist kein aria-label spezifiziert

Das fehlende aria-label ist technisch eine A11y-Luecke: Ein `role="button"` Element ohne beschreibenden Label liefert dem Screen Reader nur den sichtbaren Text als Namen – kein Hinweis auf die Aktion (Edit-Modus aktivieren). Nutzer wissen nicht, was ein Klick/Enter auf diesem Element bewirkt.

Empfehlung: `aria-label={`${task.title} bearbeiten`}` oder `aria-description="Klicken zum Bearbeiten"`.

## Priority
Fix before release
