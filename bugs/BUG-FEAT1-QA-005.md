# BUG-FEAT1-QA-005: Task-Liste hat keine semantische Beschriftung fuer Screen Reader

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Low
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. App mit Screen Reader navigieren
2. Zur Task-Liste navigieren

3. Expected: Screen Reader kuendigt eine beschriftete Liste an, z.B. "Aufgaben, Liste mit 3 Elementen"
4. Actual: Screen Reader liest "Liste mit 3 Elementen" – kein kontextueller Name. Bei mehreren Listen auf einer Seite waere das nicht unterscheidbar.

## Technische Details

In `/Users/enricoreinsdorf/Projekte/ux-stammtisch_004/projekt/src/components/TaskList.tsx`, Zeile 28:

```tsx
<ul className="task-list">
```

Die `<ul>` hat kein `aria-label` oder `aria-labelledby`. Da der Page-Heading `<h1>Aufgaben</h1>` existiert, koennte ein `aria-labelledby` auf die h1-ID gesetzt werden. Alternativ genuegt `aria-label="Aufgabenliste"`.

Schweregrad Low, da es nur einen Screen gibt und der Kontext durch die h1 ausreichend gegeben ist. Wird bei mehreren Listen relevant.

## Priority
Nice-to-have
