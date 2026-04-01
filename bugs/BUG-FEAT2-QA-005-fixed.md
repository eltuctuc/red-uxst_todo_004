# BUG-FEAT2-QA-005: Checkbox aria-label-Verkettung erzeugt potentiellen Doppel-Announcement bei Screen Readern

- **Feature:** FEAT-2 – Task-Status
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Fixed — 2026-04-02: Checkbox.tsx – useId() für eindeutige id/htmlFor-Bindung, aria-label entfernt, Label-Text als visually-hidden Span; Checkbox.css – .checkbox__label-text SR-only Klasse ergänzt

## Steps to Reproduce

1. App mit Screen Reader öffnen (VoiceOver/macOS oder NVDA/Windows)
2. Tab zur Checkbox eines Tasks navigieren
3. Expected: Screen Reader liest genau einmal den zugänglichen Namen, z.B. "Task-Titel als erledigt markieren, Checkbox, nicht aktiviert"
4. Actual: Das äußere `<label>`-Element umschließt das `<input>` und ist selbst klickbar (native Label-Mechanik). Gleichzeitig hat das `<input>` ein eigenes `aria-label`. Einige Screen Reader/Browser-Kombinationen (insbesondere VoiceOver + Safari) können das Label-Element separat ankündigen, was zu redundanten oder widersprüchlichen Announcements führt.

## Technische Details

In `projekt/src/components/Checkbox.tsx`:

```tsx
<label className="checkbox">
  <input
    className="checkbox__input"
    type="checkbox"
    checked={checked}
    aria-label={label}  // aria-label auf dem Input
    onChange={onChange}
  />
  <span className="checkbox__box" aria-hidden="true">  // visual-only span
    {/* SVG */}
  </span>
</label>
```

Das `<label>`-Element selbst hat keinen Text-Content (der `<span>` ist `aria-hidden="true"`, das `<input>` ist visually hidden). Das native Label-für-Input-Binding erfolgt durch Umschließen, nicht über `for`/`id`.

Das `aria-label` auf dem Input überschreibt in den meisten AT-Kombinationen das umschließende Label korrekt. Aber die Kombination aus:
- umliegendem `<label>` ohne eigenen zugänglichen Namen
- `aria-label` direkt auf dem Input
- minimalem Touch-Target (44x44px) auf dem Label

...ist fragil und kann in VoiceOver/Safari zu doppelten Fokus-Punkten führen (einmal das Label, einmal das Input).

Sauberere Lösung: Das Input bekommt eine eigene `id`, das Label bekommt `htmlFor` und den Label-Text als visually-hidden Span (oder die gesamte Struktur wird zu einem einzigen `<button>` mit `role="checkbox"` vereinfacht, wenn native Checkbox-Semantik nicht benötigt wird).

## Priority

Fix before release
