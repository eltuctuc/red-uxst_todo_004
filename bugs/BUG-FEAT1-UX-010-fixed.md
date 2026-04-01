# BUG-FEAT1-UX-010: TaskList verliert Listenrolle in Safari/VoiceOver durch `list-style: none`

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer (Retest Runde 3)
- **Status:** Open

## Problem

`TaskList.css` setzt `list-style: none` auf dem `<ul>`-Element. Safari/VoiceOver entfernt in diesem Fall die semantische Listenrolle der `<ul>` – ein bekanntes, dokumentiertes Browser-Verhalten seit Safari 13+. VoiceOver-Nutzer hören die Elemente dann nicht als "Liste mit N Einträgen" angesagt, was die Orientierung erheblich erschwert.

Das Fix ist minimal: `role="list"` explizit am `<ul>` in `TaskList.tsx` setzen. Das stellt die Listenrolle in allen Browsern unabhängig von CSS-Resets sicher.

Hinweis: BUG-FEAT1-QA-005 meldet das fehlende `aria-label` an der `<ul>` aus QA-Perspektive. Dieser Bug ist komplementär – er betrifft nicht das Label, sondern die Listenrolle selbst.

## Steps to Reproduce

1. App mit mindestens zwei Tasks öffnen
2. VoiceOver in Safari aktivieren (macOS: Cmd+F5)
3. Tab zur Task-Liste navigieren
4. Expected: VoiceOver liest "Liste, 2 Einträge" oder äquivalent an
5. Actual: Listenrolle wird in Safari nicht angesagt – `<ul>` mit `list-style: none` ohne `role="list"` verliert die Semantik

## Empfehlung

In `TaskList.tsx` am `<ul>`-Element `role="list"` hinzufügen:

```tsx
<ul className="task-list" role="list">
```

Ergänzend sollte `aria-label="Aufgabenliste"` oder `aria-labelledby` auf die h1-Überschrift gesetzt werden (adressiert auch BUG-FEAT1-QA-005).

## Priority

Fix before release
