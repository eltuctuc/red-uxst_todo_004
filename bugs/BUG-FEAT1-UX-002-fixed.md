# BUG-FEAT1-UX-002: Card-Komponente als Custom-Rebuild statt DS-Komponente

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die Feature-Spec (Abschnitt 2, Eingesetzte Komponenten) listet `Card` mit DS-Status `✓ Vorhanden` und Quelle `design-system/components/card.md`. Das bedeutet: Die DS-Komponente ist vorhanden und muss konform eingesetzt werden.

Die Implementierung in `TaskPage.css` baut die Card-Optik jedoch als eigene CSS-Klasse `.task-page__card` nach – mit eigenem `background`, `border`, `border-radius`, `box-shadow`, und `overflow: hidden`. Das ist kein DS-Komponenten-Einsatz, sondern ein Rebuild.

Konkrete Abweichungen gegenüber DS-Spec (`card.md`):

1. **Padding:** Die Card-Spec schreibt `spacing-6` (1.5rem) als Padding Body vor. Das `task-page__card` hat kein Padding im Wrapper selbst – das Padding ist auf Unterkomponenten verteilt (Header: `spacing-6 spacing-4`, Create: `spacing-4`). Das horizontale Padding des Headers beträgt `spacing-4` (1rem), nicht `spacing-6`.
2. **`overflow: hidden`** ist nicht in der DS-Card-Spec definiert – eine selbst eingeführte Eigenschaft.
3. Kein semantisches Markup entsprechend der Card-Aufbau-Spezifikation (`Card-Wrapper > Card-Header > Card-Body`).

## Steps to Reproduce

1. `TaskPage.css` mit `design-system/components/card.md` vergleichen
2. Expected: Card-Wrapper nutzt DS-Card-Spec vollständig (Tokens, Padding, Aufbau)
3. Actual: `.task-page__card` ist ein eigenständiger Rebuild mit abweichendem horizontalem Padding und nicht-spezifiziertem `overflow: hidden`

## Empfehlung

Die Card-Wrapper-Klasse sollte exakt die DS-Spec umsetzen:
- Horizontales Padding auf `spacing-6` (1.5rem) vereinheitlichen (Header und Body)
- `overflow: hidden` entfernen oder explizit als Ausnahme dokumentieren – es kann Layout-Bugs verursachen (z. B. abgeschnittener Focus-Ring)
- Wenn das Layout-Splitting (Header hat anderes Padding als Body) gewollt ist, das als Variante in der Card-Spec dokumentieren

## Priority

Fix before release
