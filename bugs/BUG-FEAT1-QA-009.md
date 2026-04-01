# BUG-FEAT1-QA-009: Kein <main>-Landmark – Seiteninhalte per Screen Reader nicht direkt anspringbar

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Low
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. App mit Screen Reader öffnen (z.B. NVDA + Chrome, VoiceOver + Safari)
2. Landmark-Navigation aufrufen (NVDA: `D`/`Shift+D`; VoiceOver: Rotor → Landmarks)

- **Expected:** Seiteninhalte sind über eine `<main>`-Landmark navigierbar. Screen Reader springt direkt zum Hauptinhalt (Aufgabenliste + Create-Input) ohne Header-Inhalte zu überfliegen.
- **Actual:** Kein `<main>`-Landmark vorhanden. Landmark-Navigation liefert nur die implizite `banner`-Rolle des äußeren Dokuments. Screen Reader muss Inhalte linear durchlaufen.

## Zusätzlicher Befund: `<header>` ohne banner-Rolle

Das `<header className="task-page__header">` in `TaskPage.tsx` sitzt als Kind eines `<div>`, nicht als Kind von `<body>` oder einem Sectioning Content Element. Laut HTML-Spec erhält `<header>` die implizite ARIA-Rolle `banner` nur wenn es ein direktes Kind von `<body>` ist (nicht innerhalb von `<article>`, `<aside>`, `<main>`, `<nav>`, `<section>`). Als Kind von `<div>` hat es keine ARIA-Landmark-Rolle.

## Technische Details

In `projekt/src/components/TaskPage.tsx`:

```tsx
return (
  <div className="task-page">          {/* kein Landmark */}
    <div className="task-page__card">  {/* kein Landmark */}
      <header className="task-page__header">  {/* kein banner – Kind von div */}
        <h1>Aufgaben</h1>
      </header>
      <TaskCreate />
      <TaskList />
    </div>
  </div>
)
```

Fix: Äußerstes `<div className="task-page">` durch `<main className="task-page">` ersetzen, oder `role="main"` hinzufügen. Das `<header>` erhält damit automatisch keine banner-Rolle (bleibt Kind von `<main>`), ist aber durch Heading-Navigation (h1) erreichbar.

## Severity-Begründung

Low: Einziger Screen. Bei einem Single-Page-App ohne Navigation ist fehlende Landmark-Navigation weniger kritisch als bei Multi-Page-Apps. Für Nutzer, die direkt zur Hauptaufgabe springen wollen, ist es aber ein spürbarer Mehraufwand.

## Priority

Fix before release
