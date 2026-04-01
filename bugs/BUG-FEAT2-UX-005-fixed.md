# BUG-FEAT2-UX-005: Durchgestrichener Titel-Text verfehlt Mindestkontrast 3:1

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-04-02 — `color-text-disabled` auf `color-text-secondary` (neutral-600, 7.3:1) geändert in TaskItem.css

## Problem

Erledigte Tasks zeigen den Titel in `color-text-disabled` = `color-neutral-400` = `#9CA3AF` auf dem Hintergrund `color-bg-surface` = `color-neutral-0` = `#FFFFFF`.

Gemessener Kontrast: ca. 2.5:1.

Die UX-Spec (Abschnitt 2, Barrierefreiheit) setzt die Mindestanforderung fur diesen Wert bewusst niedrig an – "mindestens 3:1 Kontrast gegen color-bg-surface" – mit der Begruendung dass der Text dekorativ ist und die Checkbox den Status primare kommuniziert. Trotzdem verfehlt die Implementierung auch diesen reduzierten Schwellenwert von 3:1.

Fur Nutzer mit Sehschwache kann der Titeltext eines erledigten Tasks kaum lesbar sein. Da der Text weiterhin inhaltlich relevant ist (Nutzer mussen lesen konnen welche Tasks erledigt sind), ist 2.5:1 nicht ausreichend.

## Steps to Reproduce

1. App laden, mindestens einen Task als erledigt markieren
2. Titelfarbe des erledigten Tasks pruefen (z.B. mit Browser DevTools oder Colour Contrast Analyser)
3. Expected: Kontrast-Ratio >= 3:1 (gemas eigener UX-Spec-Anforderung)
4. Actual: Kontrast-Ratio ca. 2.5:1 mit color-neutral-400 (#9CA3AF) auf Weiss (#FFFFFF)

## Empfehlung

Den Token `color-text-disabled` prufen – aktuell auf `color-neutral-400` (#9CA3AF) gesetzt. Fur den durchgestrichenen Titel-Zustand ware `color-neutral-600` (#4B5563) sinnvoller: Kontrast ca. 7.3:1, kommuniziert visuell immer noch "erledigt/herabgestuft" ohne Lesbarkeit zu opfern.

Alternative: Eigenen Token `color-text-completed` einfuhren der bewusst zwischen `color-text-disabled` und `color-text-secondary` angesiedelt ist.

## Priority

Fix before release
