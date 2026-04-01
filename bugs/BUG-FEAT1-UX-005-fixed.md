# BUG-FEAT1-UX-005: Inline-Edit-Input Groesse springt beim Aktivieren (Layout-Shift)

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** UX
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Wenn der Nutzer auf einen Task-Titel klickt, wechselt der angezeigte `<span>` (`.task-item__title`) zu einem `<input>` (`.task-item__edit-input`). Beide Elemente haben unterschiedliche Font-Sizes:

- `.task-item__title`: `font-size: var(--text-base)` (1rem = 16px)
- `.task-item__edit-input`: `font-size: var(--text-sm)` (0.875rem = 14px)

Das erzeugt beim Aktivieren des Edit-Modus einen sichtbaren Layout-Shift: Der Text schrumpft um 2px, das Input-Feld beansprucht eine andere Hoehe als der Titel-Span, und die gesamte Task-Zeile kann sich in der Hoehe verändern.

Dies steht auch in Konflikt mit der Feature-Spec: Der Inline-Edit-Input ist mit DS-Variante `sm` (Size `sm`) spezifiziert, waehrend der angezeigte Titel visuell auf `text-base` geht. Die Groessen-Differenz war wahrscheinlich nicht als visueller Sprung gemeint, sondern als Groessendefinition des Input-Widgets selbst – die Font-Size sollte dennoch konsistent sein.

## Steps to Reproduce

1. Einen Task erstellen
2. Auf den Task-Titel klicken
3. Expected: Uebergang in den Edit-Modus ist visuell stabil, kein Text-Groessen-Sprung
4. Actual: Der Titeltext springt von 16px auf 14px, die Zeile kann sich leicht in der Hoehe verschieben

## Empfehlung

Font-Size im `.task-item__edit-input` auf `var(--text-base)` setzen, konsistent mit `.task-item__title`. Die `sm`-Groesse in der Spec bezieht sich auf die Input-Hoehe (32px via Padding), nicht auf die Font-Size – das Padding `spacing-2 / spacing-3` kann beibehalten werden.

## Priority

Fix before release
