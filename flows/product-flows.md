# Product Flows
*Erstellt von: /red:proto-flows — 2026-04-01*
*Letzte Aktualisierung: 2026-04-01*

> Dieses Dokument ist die verbindliche Navigations-Referenz.
> Kein Screen darf ohne Eintrag hier mit einem anderen verbunden werden.
> Änderungen erfordern eine explizite Entscheidung des UX Designers.

## Screens

| Screen-ID | Screen-Name  | Route | Feature              | Typ  |
|-----------|--------------|-------|----------------------|------|
| S-01      | Task-Liste   | /     | FEAT-1, FEAT-2, FEAT-3 | Page |

## Einstiegspunkte

| Kontext   | Einstiegs-Screen | Bedingung |
|-----------|------------------|-----------|
| App-Start | S-01             | –         |

## Zustandswechsel auf S-01

Diese App hat keine Screen-zu-Screen-Navigation. Alle Interaktionen sind Zustandswechsel innerhalb von S-01.

| Zustand-Von               | Trigger                              | Zustand-Nach              | Bedingung                        | Feature  |
|---------------------------|--------------------------------------|---------------------------|----------------------------------|----------|
| Input-Feld (gefüllt)      | Enter-Taste                          | Input-Feld leer, Task in Liste | Titel nicht leer/Whitespace  | FEAT-1   |
| Input-Feld (leer)         | Enter-Taste                          | Keine Änderung            | Titel leer – Submit blockiert    | FEAT-1   |
| Task (normal)             | Klick auf Titel                      | Task im Inline-Edit-Zustand | –                              | FEAT-1   |
| Task im Inline-Edit       | Enter-Taste                          | Task (normal), neuer Titel | Titel nicht leer               | FEAT-1   |
| Task im Inline-Edit       | Enter-Taste bei leerem Feld          | Keine Änderung            | Submit blockiert                 | FEAT-1   |
| Task im Inline-Edit       | ESC-Taste                            | Task (normal), Original-Titel | –                            | FEAT-1   |
| Task im Inline-Edit       | Blur (Klick außerhalb)               | Task (normal), Original-Titel | –                            | FEAT-1   |
| Task (beliebig)           | Klick auf Lösch-Button               | Task aus Liste entfernt   | –                                | FEAT-1   |
| Task (offen)              | Klick auf Checkbox                   | Task (erledigt)           | –                                | FEAT-2   |
| Task (erledigt)           | Klick auf Checkbox                   | Task (offen)              | –                                | FEAT-2   |

## Screen Transitions

*Keine – die App besteht aus einem einzigen Screen ohne Navigation zu anderen Screens.*

## Offene Transitions

Transitions die während der Implementierung als fehlend gemeldet wurden und noch nicht definiert sind:

| Gemeldet von | Von Screen | Situation | Status |
|---|---|---|---|
| – | – | – | – |

*(Wird vom `frontend-developer` befüllt wenn eine Transition fehlt. UX Designer muss entscheiden und Tabellen oben ergänzen.)*
