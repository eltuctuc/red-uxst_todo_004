# BUG-FEAT1-QA-007: Delete-Button im Edit-Modus nicht per Keyboard erreichbar ohne Edit abzubrechen

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. App per Keyboard (nur Tab/Enter/Space) bedienen
2. Ersten Task per Enter in Edit-Modus versetzen
3. Versuchen, den Delete-Button per Tab zu erreichen ohne ESC zu druecken

4. Expected (laut Spec, Section 2): "Delete-Button per Tab erreichbar und per Enter/Space ausloesbar" – impliziert Erreichbarkeit auch aus dem Edit-Zustand heraus
5. Actual: Sobald Tab im Edit-Input gedrueckt wird, feuert onBlur, Edit wird abgebrochen. Der Browser setzt danach den Fokus auf das naechste Element (Titel-Span), nicht auf den Delete-Button. Der Nutzer muss den Edit-Modus erst explizit per ESC verlassen und dann erneut Tab druecken.

## Technische Details

Das Grundproblem: `onBlur={handleBlur}` auf dem Edit-Input in TaskItem.tsx (Zeile 61) bricht den Edit-Modus ab, sobald das Input den Fokus verliert – auch wenn der Fokus innerhalb derselben Task-Zeile (zum Delete-Button) wechselt.

Die Spec-Anforderung "Delete-Button per Tab erreichbar" wird technisch nicht vollstaendig erfuellt, weil der natuerliche Tab-Flow vom Edit-Input den Edit-Modus beendet bevor der Delete-Button fokussiert werden kann.

Loesungsansatz (nicht implementiert): `onBlur` koennte mit `relatedTarget`-Pruefung implementiert werden – wenn der Fokus auf den Delete-Button des selben Tasks wechselt, kein Cancel ausloesen.

## Priority
Fix before release
