# BUG-FEAT3-QA-006: UX-005-Fix fehlerhaft – padding: 12px erreicht kein 44px Touch-Target bei box-sizing: border-box

- **Feature:** FEAT-3 – Persistenz
- **Severity:** Medium
- **Bereich:** A11y / Functional
- **Gefunden von:** QA Engineer (Runde 3)
- **Status:** Open

## Kontext

BUG-FEAT3-UX-005 (Close-Button unterschreitet WCAG Touch-Target-Mindestgröße) wurde in Runde 3 mit `padding: 12px` korrigiert. Der Fix beruht auf der Annahme, dass Padding das tatsächliche Touch-Target vergrößert. Diese Annahme ist falsch, weil das Projekt global `box-sizing: border-box` verwendet.

## Steps to Reproduce

1. App im Browser öffnen
2. localStorage auf ungültiges JSON setzen: `localStorage.setItem('ux-stammtisch-tasks', 'x')`
3. Seite neu laden – Reset-Banner erscheint
4. Browser-DevTools öffnen, Reset-Notice-Close-Button inspizieren (`.task-page__reset-notice-close`)
5. Im Computed-Tab die tatsächliche Größe (width/height) des Elements ablesen

- **Expected:** Button hat eine Touch-Target-Größe von mindestens 44px x 44px (WCAG 2.5.5)
- **Actual:** Button rendert mit 20px x 20px. Das `padding: 12px` wird bei `box-sizing: border-box` in die 20px hineingerechnet, nicht addiert. Die Außengröße bleibt 20px.

## Root Cause

In `projekt/src/components/TaskPage.css`, Zeilen 46–61:

```css
.task-page__reset-notice-close {
  padding: 12px;       /* Intent: 20px + 2*12px = 44px – aber bei border-box kein Effekt auf Außengröße */
  width: 20px;
  height: 20px;
  /* ... */
}
```

In `projekt/src/index.css`, Zeilen 119–121:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Bei `box-sizing: border-box` definieren `width` und `height` die Außengröße inklusive Padding und Border. Das `padding: 12px` verkleinert den Content-Bereich, vergrößert nicht den Button. Da 2 * 12px = 24px > 20px (deklarierte Breite/Höhe), ist der Content-Bereich nominal negativ und wird auf 0px geclampt. Das Element rendert mit 20px x 20px Außengröße.

## Korrekte Fix-Richtung

`width` und `height` direkt auf 44px setzen:

```css
.task-page__reset-notice-close {
  width: 44px;
  height: 44px;
  padding: 0;   /* oder angepasst für visuelles Centering des × */
  /* ... */
}
```

Alternativ min-width/min-height:

```css
.task-page__reset-notice-close {
  min-width: 44px;
  min-height: 44px;
}
```

## Regression-Hinweis

Dieser Bug ist ein direktes Ergebnis des UX-005-Fix-Versuchs in Runde 3. BUG-FEAT3-UX-005 bleibt funktional ungefixt und sollte als Open markiert bleiben.

## Priority
Fix before release
