# BUG-FEAT2-UX-009: Completed-Zustand nutzt falschen Token – Spec definiert color-text-disabled, Code verwendet color-text-secondary

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Low
- **Bereich:** DS-Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die UX-Spec (FEAT-2, Abschnitt 2 "Visueller Zustand: erledigter Task") definiert explizit:

> Titel-Farbe: `color-text-disabled` (reduzierter Kontrast signalisiert "erledigt")

Der Fix fuer BUG-FEAT2-UX-005 hat den Token in `TaskItem.css` korrekt von `color-neutral-400` auf einen Token mit ausreichendem Kontrast geaendert. Der gewahlte Token ist jedoch `color-text-secondary` (= neutral-600, 7.3:1) statt dem in der Spec definierten `color-text-disabled` (= neutral-400, 2.5:1).

Das ist kein inhaltlich falscher Fix – `color-text-secondary` loest das Kontrast-Problem und macht den Text lesbar. Aber er erzeugt jetzt eine Diskrepanz zwischen Spec und Implementierung:
- Die Spec sagt `color-text-disabled` soll den "herabgestuften" Zustand signalisieren.
- Der Code verwendet `color-text-secondary`, den Standard-Token fuer Hilfstext und Labels.

Konsequenz: Der erledigte Task-Titel hat visuell denselben Token wie sekundaere UI-Labels. Die semantische Unterscheidung "erledigt/herabgestuft" ist damit nur noch durch Strikethrough kommuniziert, nicht durch einen dedizierten Farbtoken. Ausserdem ist die UX-Spec nach dem Fix faktisch falsch dokumentiert – sie gibt einen Token an, der nicht eingehalten wird.

Die eigentliche Ursache ist dass `color-text-disabled` (2.5:1) den WCAG-Mindestkontrast verfehlt. Ohne einen dedizierten `color-text-completed`-Token bleibt das eine ungeloeste Spannung im DS.

## Steps to Reproduce

1. `projekt/src/components/TaskItem.css` oeffnen, Zeile 88
2. Expected: `color: var(--color-text-disabled)` gemaess UX-Spec FEAT-2 Abschnitt 2
3. Actual: `color: var(--color-text-secondary)` – anderer Token als in der Spec definiert

4. `features/FEAT-2-task-status.md` Abschnitt 2 "Visueller Zustand" pruefen
5. Expected: Spec stimmt mit Implementierung ueberein
6. Actual: Spec nennt `color-text-disabled`, Code verwendet `color-text-secondary`

## Empfehlung

Einen von drei Wegen waehlen:

**Option A (sauber, empfohlen):** Neuen Token `color-text-completed` ins Design System aufnehmen, der einen Kontrast von mindestens 3:1 hat und semantisch "abgeschlossene/herabgestufte Inhalte" repraesentiert. Zum Beispiel neutral-500 (#6B7280, ca. 4.5:1). Spec und Code auf diesen Token aktualisieren.

**Option B (pragmatisch):** UX-Spec in FEAT-2 auf `color-text-secondary` korrigieren und den bewussten Abweichungsgrund dokumentieren: "color-text-disabled verfehlt WCAG-Mindestkontrast fuer lesbaren Text; color-text-secondary ist der naechste verfuegbare Token mit ausreichendem Kontrast".

**Option C (nicht empfohlen):** Den Code auf `color-text-disabled` zuruecksetzen – das reaktiviert den Kontrast-Verstos aus UX-005.

## Priority

Nice-to-have
