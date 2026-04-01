# BUG-FEAT2-UX-008: Checkbox.css – Falscher Kontrast-Wert im Code-Kommentar

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Low
- **Bereich:** DS-Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

In `Checkbox.css` Zeile 41 steht folgender Kommentar:

```css
/* Hover: unchecked – BUG-FEAT2-QA-002 fix: color-primary-500 statt color-primary-300 (Kontrast 4.5:1 statt 1.9:1) */
```

Die angegebenen Kontrast-Werte sind falsch:
- `color-primary-500` (#3B82F6) auf `color-neutral-0` (#FFFFFF): tatsaechlich ca. **3.0:1**, nicht 4.5:1
- `color-primary-300` (#93C5FD) auf `color-neutral-0` (#FFFFFF): tatsaechlich ca. **1.6:1**, nicht 1.9:1

Der Fix selbst (Verwendung von color-primary-500) ist korrekt und erfuellt WCAG 1.4.11 (3:1 fuer UI-Elemente). Der Kommentar suggeriert jedoch einen deutlich hoeheren Kontrast als tatsaechlich vorhanden. Das kann Entwickler dazu verleiten, die Hover-Border als "sicher ueberschreitend" einzustufen und keine weiteren Nachbesserungen vorzunehmen – obwohl der Wert genau an der WCAG-Grenze liegt.

## Steps to Reproduce

1. `projekt/src/components/Checkbox.css` Zeile 41 lesen
2. Kontrast von `#3B82F6` auf `#FFFFFF` mit einem Kontrastrechner pruefen (z.B. WebAIM Contrast Checker)
3. Expected: Kommentar gibt korrekte Kontrast-Werte an
4. Actual: Kommentar gibt 4.5:1 an, tatsaechlicher Wert ist ca. 3.0:1

## Priority

Nice-to-have
