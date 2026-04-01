# BUG-FEAT3-QA-003: useEffect schreibt beim initialen Render in localStorage – unnötiger Write bei App-Start

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Low
- **Bereich:** Functional / Performance
- **Gefunden von:** QA Engineer
- **Status:** Open

## Steps to Reproduce

1. 3 Tasks erstellen und Seite neu laden
2. In den Browser-DevTools Network/Performance-Tab öffnen (oder localStorage-Write über Storage-Breakpoint beobachten)
3. Seite erneut neu laden

- **Expected:** Beim App-Start werden Tasks aus localStorage geladen. Ein localStorage-Write findet erst statt wenn der Nutzer eine Änderung vornimmt.
- **Actual:** Beim initialen Mount führt der `useEffect` sofort aus (weil `tasks` im Dependency-Array liegt und beim ersten Render immer als "geändert" gilt). Damit wird `localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))` mit dem gerade geladenen Inhalt aufgerufen. Der Wert wird identisch zurückgeschrieben – kein Datenverlust, aber ein redundanter synchroner Schreibvorgang.

## Root Cause

In `projekt/src/components/TaskPage.tsx`, Zeile 64–66:

```typescript
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}, [tasks])
```

React's `useEffect` führt nach dem ersten Render immer aus, unabhängig davon ob sich der Wert gegenüber dem vorherigen State geändert hat. Es gibt keinen "wurde gerade aus localStorage geladen"-Zustand, den der Effekt kennt.

## Warum kein Datenverlust

Der Write-Back ist identisch zu dem, was gerade gelesen wurde (`loadTasksFromStorage` → `useState` → `useEffect`). Reihenfolge ist sicher: React garantiert, dass `useState(initializer)` synchron vor dem ersten Render ausgeführt wird. Der `useEffect` läuft danach. Kein Timing-Race zwischen Lesen und Schreiben.

## Warum trotzdem relevant

Bei sehr großen Task-Arrays (theoretisch) ist der initiale Write ein unnötiger Overhead. Wichtiger: Wenn `loadTasksFromStorage` durch BUG-FEAT3-QA-001 oder einen anderen Fehlerfall `[]` zurückgibt (obwohl Daten vorhanden waren), würde der useEffect sofort `[]` in localStorage zurückschreiben und die Originaldaten überschreiben. Dieses Fenster ist klein, aber vorhanden.

Der eigentliche Risikopfad: Falls in Zukunft der Lazy Initializer durch eine async-Variante ersetzt wird (z.B. IndexedDB), würde die aktuelle useEffect-Logik ohne Anpassung Daten überschreiben bevor sie geladen sind.

## Fix-Richtung

Ein `isInitialized`-Ref verwenden:
```typescript
const isInitialized = useRef(false)
useEffect(() => {
  if (!isInitialized.current) {
    isInitialized.current = true
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}, [tasks])
```

Oder: einen Custom Hook `useLocalStorage` extrahieren, der Laden und Speichern in einer Logik kapselt und den initialen Write explizit verhindert.

## Priority
Nice-to-have
