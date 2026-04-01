# BUG-FEAT2-UX-003: prefers-reduced-motion nicht beachtet

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-04-02 — `@media (prefers-reduced-motion: reduce) { .checkbox__box { transition: none; } }` in Checkbox.css ergänzt

## Problem

`Checkbox.css` enthalt Transitions fur Farb- und Hintergrundwechsel beim Toggle. Das Design System dokumentiert in `design-system/tokens/motion.md` explizit den Accessibility-Hinweis:

> Respektiere `prefers-reduced-motion`: alle Ubergange mussen auch ohne Animation funktionieren.

Die Checkbox-CSS enthalt keine `@media (prefers-reduced-motion: reduce)`-Regel. Nutzer die auf Betriebssystemebene "Bewegung reduzieren" aktiviert haben, erleben dennoch die Transitions. Fur Nutzer mit vestibularen Storungen oder Schwindelbeschwerden konnen selbst subtile Farbanimationen unangenehm sein.

Relevant gemas WCAG 2.1 Erfolgskriterium 2.3.3 (Animation from Interactions, Level AAA) und dem DS-eigenen Accessibility-Hinweis.

## Steps to Reproduce

1. Betriebssystem auf "Bewegung reduzieren" setzen (macOS: Einstellungen > Bedienungshilfen > Bewegung > Bewegung reduzieren)
2. App laden, Task-Checkbox klicken
3. Expected: Checkbox wechselt ohne Transition sofort in den neuen Zustand
4. Actual: Farbwechsel-Transition lauft trotzdem (150ms)

## Empfehlung

In `Checkbox.css` einen `prefers-reduced-motion`-Block erganzen:

```css
@media (prefers-reduced-motion: reduce) {
  .checkbox__box {
    transition: none;
  }
}
```

Das gleiche Muster sollte konsistent fur alle animierten Komponenten gelten.

## Priority

Fix before release
