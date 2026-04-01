# BUG-FEAT1-UX-004: Focus-Ring wird durch `overflow: hidden` auf der Card abgeschnitten

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

`TaskPage.css` setzt auf `.task-page__card` den Wert `overflow: hidden`. Das erste und letzte interaktive Element in der Card (Create-Input oben, letztes TaskItem unten) haben einen Focus-Ring mit `outline-offset: 2px`. Dieser Focus-Ring wird durch `overflow: hidden` am Card-Rand abgeschnitten und ist damit für Keyboard-Nutzer nicht vollständig sichtbar.

Betroffen:
- Create-Input beim Fokus (obere Kante der Card)
- Erster TaskItem-Titel oder letztes TaskItem beim Fokus (unterste Zeile der Liste)
- Delete-Button des letzten Tasks (hat ebenfalls `outline-offset: 2px`)

Die WCAG 2.1 Anforderung (Guideline 2.4.7 – Focus Visible) verlangt einen sichtbaren Fokus-Indikator. Ein abgeschnittener Focus-Ring erfüllt diese Anforderung nicht vollständig.

## Steps to Reproduce

1. App mit Keyboard bedienen (Tab)
2. Create-Input fokussieren (erster Tab-Stop)
3. Expected: Blauer 2px Focus-Ring vollständig sichtbar um das Input-Feld
4. Actual: Der obere Teil des Focus-Rings (mit offset) wird durch den oberen Card-Rand abgeschnitten, weil `.task-page__card` `overflow: hidden` hat

Gleiches Problem beim letzten Task in der Liste (unterer Card-Rand).

## Empfehlung

`overflow: hidden` von `.task-page__card` entfernen. Wenn das Overflow-Clipping für die Border-Radius-Darstellung benoetigt wird (was der eigentliche Grund ist), stattdessen `overflow: clip` verwenden – das clipped nur visuell, blockiert aber keine Outlines. Alternativ kann der Card-Wrapper etwas Padding an den Aussenseiten erhalten, sodass der Focus-Ring immer innerhalb des sichtbaren Bereichs bleibt.

## Priority

Fix before release
