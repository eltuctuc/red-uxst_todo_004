# BUG-FEAT2-QA-006: Checkbox Focus-Ring unsichtbar – CSS-Adjacency-Selektor durch QA-005-Fix gebrochen

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. App öffnen, mindestens einen Task erstellen
2. Per Tab-Taste zur Checkbox navigieren (Keyboard-only, keine Maus)
3. Expected: Die Checkbox-Box zeigt einen sichtbaren Focus-Ring (2px solid `--color-border-focus`, 2px Offset)
4. Actual: Kein Focus-Ring sichtbar – die Checkbox sieht fokussiert und unfokussiert identisch aus

## Technische Details

Der QA-005-Fix hat einen `<span class="checkbox__label-text">` zwischen das `<input>` und das `<span class="checkbox__box">` eingefügt:

```tsx
// Checkbox.tsx – aktuelle DOM-Reihenfolge nach QA-005-Fix
<label className="checkbox" htmlFor={id}>
  <input id={id} className="checkbox__input" ... />       // Element 1
  <span className="checkbox__label-text">{label}</span>   // Element 2 (NEU)
  <span className="checkbox__box ...">...</span>          // Element 3
</label>
```

Der CSS-Selektor für den Focus-Ring in `Checkbox.css` Zeile 66 lautet:

```css
.checkbox__input:focus-visible + .checkbox__box {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

Der `+`-Operator (Adjacent Sibling Selector) matcht ausschließlich das **unmittelbar** folgende Geschwister-Element. Das unmittelbare Folge-Element von `.checkbox__input` ist jetzt `.checkbox__label-text`, nicht `.checkbox__box`. Der Selektor greift nie.

## Fix-Optionen

**Option A – Selektor auf General Sibling erweitern:**
```css
.checkbox__input:focus-visible ~ .checkbox__box {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```
Der `~`-Operator (General Sibling Selector) matcht alle nachfolgenden Geschwister, nicht nur das direkte.

**Option B – DOM-Reihenfolge anpassen:**
Label-Text-Span an den Anfang stellen (vor das Input) oder ans Ende (nach die Box). Dann bleibt der `+`-Selektor gültig. Visuell ändert sich nichts, da der Span SR-only ist.

## Kontext: Regression durch QA-005-Fix

Vor dem QA-005-Fix war die DOM-Reihenfolge `<input>` → `<span class="checkbox__box">` (adjacent), sodass `+` korrekt funktionierte. Der Fix für das A11y-Problem QA-005 (doppelter Screen-Reader-Announcement) hat durch Einfügen des Label-Spans ein neues A11y-Problem (unsichtbarer Keyboard-Focus) verursacht.

## Priority

Fix before release
