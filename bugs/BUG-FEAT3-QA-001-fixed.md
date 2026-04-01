# BUG-FEAT3-QA-001: JSON.parse liefert Non-Array – kein Parse-Error, aber Runtime-Crash bei Array-Methoden

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** High
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Fixed – 2026-04-02

## Steps to Reproduce

1. App öffnen
2. In den Browser-DevTools: `localStorage.setItem('ux-stammtisch-tasks', 'null')` ausführen
3. Seite neu laden

- **Expected:** App erkennt korrupte / unbrauchbare Daten, löscht den localStorage-Eintrag und startet mit leerer Task-Liste (AC-5: Silent Reset)
- **Actual:** `JSON.parse('null')` wirft keinen Fehler – der catch-Block wird nicht ausgelöst. `loadTasksFromStorage` gibt `null` zurück (TypeScript-Cast `as Task[]` ist reine Compile-Zeit-Annotation, keine Runtime-Validierung). `useState` wird mit `null` initialisiert. Beim ersten Render ruft `TaskList` auf `tasks.map(...)` auf einem `null`-Wert auf → `TypeError: Cannot read properties of null (reading 'map')` – die App crashed.

## Reproduzierbare Eingaben

Alle folgenden localStorage-Werte triggern denselben Pfad (kein Parse-Fehler, kein Array):
- `'null'` → `JSON.parse` gibt `null`
- `'42'` → gibt `42`
- `'"ein string"'` → gibt `"ein string"`
- `'{}'` → gibt ein Objekt, kein Array
- `'{"id":"x"}'` → gibt ein einzelnes Objekt

## Root Cause

In `projekt/src/components/TaskPage.tsx`, Zeile 12–13:

```typescript
try {
  return JSON.parse(raw) as Task[]
```

`JSON.parse` kann valides JSON zurückgeben, das kein Array ist. Die catch-Logik greift nur bei syntaktisch kaputtem JSON. Eine strukturelle Typprüfung fehlt. Das `as Task[]`-Cast ist TypeScript-only und hat zur Laufzeit keine Wirkung.

## Betroffene ACs

AC-5: "Sind die localStorage-Daten nicht als valides JSON parsebar, werden sie gelöscht und die App startet mit einer leeren Liste." – Die Spec formuliert "nicht als valides JSON parsebar", erfasst aber implizit auch den Fall "valides JSON, aber kein Task-Array". Die Intention ist klar (Silent Reset bei unbrauchbaren Daten), die Implementierung deckt nur den Syntaxfehler-Fall ab.

## Fix-Richtung

Nach `JSON.parse` prüfen ob das Ergebnis ein Array ist:

```typescript
const parsed = JSON.parse(raw)
if (!Array.isArray(parsed)) {
  localStorage.removeItem(STORAGE_KEY)
  return []
}
return parsed as Task[]
```

## Priority
Fix now
