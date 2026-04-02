# BUG-FEAT3-UX-003: Alert-Banner fehlt DS-konformes Icon – Farbe als einziger Semantik-Traeger

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Low
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Das `task-page__reset-notice`-Banner entspricht nicht dem definierten Alert-Banner-Pattern aus `design-system/patterns/feedback.md`.

Das DS-Pattern definiert den Aufbau als:
```
[Icon]  [Titel (optional)]  [Beschreibung]  [Aktion (optional)]  [Close (optional)]
```

Die Implementierung hat:
```
[Beschreibung]  [Close]
```

Das Icon fehlt vollstaendig. Das bedeutet: Die Semantik des Banners (Warnung, nicht Info, nicht Fehler) wird ausschliesslich ueber die Hintergrundfarbe (`color-warning-100`) transportiert. Gemaess WCAG-Prinzip "color-not-only" darf Farbe nicht das einzige Unterscheidungsmerkmal sein. Ein Nutzer der Farben nicht korrekt wahrnimmt (z.B. bei Rot-Gruen-Schwaerche, die sich auf Gelb-Wahrnehmung auswirkt) erkennt den Warncharakter des Banners nicht.

Konkret: Ein Warn-Icon (z.B. Dreieck mit Ausrufezeichen) oder Info-Icon wuerde die Semantik redundant kommunizieren – unabhaengig von der Farbwahrnehmung.

## Steps to Reproduce

1. Lokalen Speicher manipulieren: `localStorage.setItem('ux-stammtisch-tasks', 'KORRUPT')`
2. App neu laden
3. Reset-Banner wird angezeigt
4. Expected: Banner enthaelt ein Icon das den Warn-Charakter visuell kommuniziert (unabhaengig von Farbe)
5. Actual: Banner zeigt nur Text und Close-Button – kein Icon

## Empfehlung

Ein semantisches Icon links neben dem Text hinzufuegen. Optionen:

- Inline SVG (Warn-Dreieck / Ausrufezeichen) in `color-warning-700` – kein Icon-Font noetig
- Unicode-Fallback `⚠` als `aria-hidden="true"` span – wenn keine SVG-Infrastruktur vorhanden ist

Das Icon muss `aria-hidden="true"` tragen, da `role="alert"` bereits den Text fuer Screenreader kommuniziert. Kein alt-Text noetig.

```jsx
<div className="task-page__reset-notice" role="alert">
  <span aria-hidden="true" className="task-page__reset-notice-icon">⚠</span>
  <span className="task-page__reset-notice-text">
    Gespeicherte Aufgaben konnten nicht geladen werden.
  </span>
  <button ...>×</button>
</div>
```

## Priority

Nice-to-have
