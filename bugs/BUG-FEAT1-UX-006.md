# BUG-FEAT1-UX-006: Delete-Button im Default-Zustand hat keinen sichtbaren Danger-Charakter

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Low
- **Bereich:** Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die Feature-Spec (Abschnitt 2) definiert den Delete-Button als DS-Komponente Button, Variante `danger`. Die DS-Spec `button.md` beschreibt Danger-Buttons als destruktive Aktionen mit entsprechender Farbgebung.

In der Implementierung hat der Delete-Button im Default-Zustand die Farbe `var(--color-neutral-400)` – ein neutrales Grau. Erst beim Hover wechselt er auf `color-error-500` (Rot). Das bedeutet: Im Ruhezustand ist die Destruktivität des Buttons nicht erkennbar. Die Danger-Semantik kommuniziert sich nur bei Hover – was für Nutzer ohne Maus (Touch, Keyboard) nie sichtbar ist.

Ein Keyboard-Nutzer der auf den Button tabbt sieht einen grauen Button mit Focus-Ring – kein visueller Hinweis auf die destruktive Aktion.

## Steps to Reproduce

1. App öffnen mit mindestens einem Task
2. Per Keyboard (Tab) den Delete-Button fokussieren
3. Expected: Button kommuniziert auch ohne Hover seinen Danger-Charakter (z. B. durch rote Farbe oder rotes Icon im Default-Zustand)
4. Actual: Button ist neutral grau – Danger-Semantik erst bei Mouse-Hover sichtbar

## Empfehlung

Zwei Optionen:
- **Option A:** Delete-Icon im Default-Zustand auf `color-error-500` setzen (nur die Icon-Farbe, kein Hintergrund) – kommuniziert Destruktivität ohne visuelles Gewicht zu erhöhen
- **Option B:** Den Button als transparenter Danger-Button belassen, aber sicherstellen dass das `aria-label` ("X löschen") die Semantik klar trägt – akzeptabel für icon-only wenn die Accessibility stimmt

Option B ist vertretbar für diesen Prototyp-Kontext, sollte aber explizit als Entscheidung dokumentiert werden.

## Priority

Nice-to-have
