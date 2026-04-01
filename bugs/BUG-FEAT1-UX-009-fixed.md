# BUG-FEAT1-UX-009: Delete-Button touch target unter 44x44px – A11y-Mindestgröße nicht erfüllt

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer (Retest Runde 3)
- **Status:** Open

## Problem

Der Delete-Button in `TaskItem.css` hat eine feste Größe von 32x32px (width: 32px, height: 32px). WCAG 2.5.5 (Level AAA) und die Apple HIG empfehlen ein Minimum von 44x44px für interaktive Touch-Targets. WCAG 2.5.8 (Level AA, WCAG 2.2) schreibt 24x24px als absolutes Minimum vor – was eingehalten wird – aber 32x32px bleibt deutlich unter dem empfohlenen komfortablen Bereich.

Problematischer als die absolute Größe ist der Kontext: Das Target ist zudem durch `gap: var(--spacing-3)` (12px) vom Titel-Span getrennt. Das genügt, verhindert aber keine Fehlklicks bei kleinerem Viewport oder Nutzern mit motorischen Einschränkungen, da der Button selbst zu klein ist.

Die DS-Spec `button.md` definiert für Size `sm`: Height 32px. Das ist der Quell-Token – der Bug liegt darin, dass die DS-Spec selbst die WCAG-empfohlene Mindestgröße für touch-sensitive Kontexte nicht einhält. Für diesen Prototyp (Desktop-only, explizit out-of-scope für Mobile) ist die Severity auf Medium gesetzt.

## Steps to Reproduce

1. App mit mindestens einem Task öffnen
2. Delete-Button betrachten oder per Devtools auf Größe prüfen
3. Expected: Klickbarer Bereich >= 44x44px (via padding oder hitbox-Erweiterung)
4. Actual: Button hat exakt 32x32px – kein `padding` zur Hitbox-Erweiterung vorhanden

## Empfehlung

Zwei Optionen ohne visuellen Größenunterschied:
- **Option A:** Unsichtbares Padding via `::before`-Pseudo-Element oder `padding` + negativer `margin` um den hit-area auf 44x44px zu erweitern
- **Option B:** Button-Größe auf 40x40px erhöhen (nächstnähere DS-Größe), was visuell kaum auffällt aber die Zugänglichkeit verbessert

Da Desktop-only im Scope ist, reicht Option B als pragmatische Lösung.

## Priority

Fix before release
