# BUG-FEAT3-QA-004: useState als Einweg-Initializer missbraucht – unidiomatic und Strict Mode Side-Effect

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Low
- **Bereich:** Functional / Code Quality
- **Gefunden von:** QA Engineer (Runde 2)
- **Status:** Open

## Steps to Reproduce

1. App in React Strict Mode starten (Development-Build via `npm run dev`)
2. Browser-DevTools öffnen → Application → localStorage beobachten
3. `localStorage.setItem('ux-stammtisch-tasks', 'null')` setzen
4. Seite neu laden

- **Expected:** `loadTasksFromStorage` wird einmalig aufgerufen. `localStorage.removeItem` wird einmalig aufgerufen.
- **Actual:** In React Strict Mode werden Komponenten zweimal gerendert. `loadTasksFromStorage` wird zweimal aufgerufen. Beim ersten Aufruf: `JSON.parse('null')` ist kein Array → `localStorage.removeItem(STORAGE_KEY)` → `{ tasks: [], wasReset: true }`. Beim zweiten Aufruf: Key ist bereits weg → `raw === null` → `{ tasks: [], wasReset: false }`. React verwirft den zweiten Render-State, behält den ersten. Das Endergebnis ist funktional korrekt – aber `removeItem` und der gesamte `loadTasksFromStorage`-Aufruf mit seinem Side-Effect (localStorage-Mutation) wurden zweimal ausgeführt.

## Root Cause

In `projekt/src/components/TaskPage.tsx`, Zeilen 36–37:

```typescript
const [{ tasks: loadedTasks, wasReset }] = useState(loadTasksFromStorage)
const [tasks, setTasks] = useState<Task[]>(loadedTasks)
```

`useState` mit Lazy Initializer ist das React-Pattern um eine teure Berechnung nur einmal auszuführen. Es ist aber nicht für Funktionen gedacht, die Side-Effects haben (wie `localStorage.removeItem`). React Strict Mode ruft den Initializer absichtlich zweimal auf um genau solche Side-Effects zu erkennen.

Zusätzlich: Der erste `useState`-Aufruf produziert einen State (`{ tasks, wasReset }`) der nie über einen Setter aktualisiert wird. Er ist kein echter State, sondern ein Einweg-Initializer. Der korrekte Ansatz für unveränderliche Werte die einmalig berechnet werden ist `useRef`, nicht `useState`.

## Warum kein Production-Bug

In Production-Builds führt React Strict Mode keine Doppel-Renders durch. Der Side-Effect tritt nur in Development auf. Keine Daten gehen verloren. Keine Exception.

## Warum trotzdem relevant

1. React Strict Mode ist der Standard für Vite + React-Projekte (prüfe `main.tsx` auf `<React.StrictMode>`).
2. Der Pattern (`useState` für Einweg-Initialisierung mit Side-Effects) ist ein Anti-Pattern das bei zukünftigen React-Versionen problematischer werden kann (React 19 Concurrent Mode).
3. Der zweite `useState` (`useState<Task[]>(loadedTasks)`) ist abhängig vom Wert aus dem ersten `useState` – das ist ein State-Dependency-Pattern das React nicht nativ unterstützt und zu Verwirrung führt.

## Fix-Richtung

Option A: `useRef` statt `useState` für den unveränderlichen Initialwert:
```typescript
const initRef = useRef(loadTasksFromStorage())
const { tasks: loadedTasks, wasReset } = initRef.current
const [tasks, setTasks] = useState<Task[]>(loadedTasks)
const [showResetNotice, setShowResetNotice] = useState(wasReset)
```

Option B: `loadTasksFromStorage` außerhalb der Komponente aufrufen (Modul-Scope), aber nur wenn die Funktion nicht per Prop/Context injiziert werden soll.

Option C: Side-Effects aus `loadTasksFromStorage` entfernen (kein `removeItem` darin), und den Remove in einem separaten `useEffect` durchführen.

## Priority
Nice-to-have
