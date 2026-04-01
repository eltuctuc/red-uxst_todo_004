# BUG-FEAT1-QA-004: Delete-Button fehlt Focus-Indikator im Keyboard-Only-Modus bei aktivem Edit

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. App per Keyboard navigieren (Tab)
2. Einen Task-Titel per Enter in den Edit-Modus versetzen
3. Mit Tab vom Edit-Input weiter zum Delete-Button navigieren

4. Expected: Fokus wechselt zum Delete-Button und ein sichtbarer Focus-Ring wird angezeigt.
5. Actual: Das `onBlur`-Event des Edit-Inputs feuert sobald Tab gedrueckt wird. `onCancelEdit()` wird aufgerufen. React rendert das `isEditing=false`-Layout. Der Fokus landet auf dem nun wieder sichtbaren Titel-Span – NICHT auf dem Delete-Button.

## Technische Details

Wenn das Edit-Input fokussiert ist und der Nutzer Tab drueckt:
1. Blur-Event feuert auf Edit-Input -> `onCancelEdit()` -> `isEditing=false`
2. React re-rendert: Edit-Input wird unmounted, Titel-Span wird gemounted
3. Browser versucht den Fokus auf das naechste Tab-Element (Delete-Button) zu legen
4. Da das DOM waehrend des Tab-Events neu gerendert wird, landet der Fokus unzuverlaessig

Das bedeutet: Ein Keyboard-Only-Nutzer kann den Delete-Button eines Tasks, den er gerade bearbeitet, **nicht per Tab erreichen ohne den Edit-Modus zu verlassen**. Das verletzt das in der Spec definierte Keyboard-Navigationsmodell: "Delete-Button per Tab erreichbar und per Enter/Space ausloesbar" (Section 2, Barrierefreiheit).

Der Spec-Anforderung "Tab zwischen Create-Input und Task-Elementen" wird nicht vollstaendig erfuellt, wenn der Tab aus dem Edit-Input heraus den Edit-Modus abbricht bevor der Delete-Button erreichbar ist.

## Priority
Fix before release
