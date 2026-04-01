# FEAT-2: Task-Status

## Status
Aktueller Schritt: Spec

## Abhängigkeiten
- Benötigt: FEAT-1 (Task-CRUD) – Status-Toggle setzt eine bestehende Task-Liste voraus

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-01*

### Beschreibung
Der Nutzer kann jeden Task als erledigt markieren und diese Markierung wieder aufheben. Erledigte Tasks werden visuell durch eine angehakte Checkbox und einen durchgestrichenen Titel hervorgehoben. Kein Filter – alle Tasks bleiben jederzeit sichtbar.

### Definitionen
- **Status:** Binärer Zustand eines Tasks: `offen` (Standard) oder `erledigt`.
- **Status-Toggle:** Aktion, die den Status eines Tasks zwischen `offen` und `erledigt` wechselt.
- **Checkbox:** UI-Steuerelement links des Titels, das den aktuellen Status anzeigt und per Klick toggelt.

### User Stories
- Als Nutzer möchte ich einen Task per Checkbox-Klick als erledigt markieren, um meinen Fortschritt sichtbar zu machen.
- Als Nutzer möchte ich einen erledigten Task per erneutem Checkbox-Klick als offen markieren, um Fehler oder Planänderungen zu korrigieren.
- Als Nutzer möchte ich erledigte Tasks visuell unterscheiden (Strikethrough + Checkbox angehakt), ohne sie ausblenden zu müssen.

### Acceptance Criteria
- [ ] Jeder Task zeigt eine Checkbox links des Titels.
- [ ] Ein Klick auf die Checkbox eines offenen Tasks setzt den Status auf `erledigt`: Checkbox zeigt Haken, Titel ist durchgestrichen.
- [ ] Ein erneuter Klick auf die Checkbox eines erledigten Tasks setzt den Status zurück auf `offen`: Checkbox leer, Strikethrough entfernt.
- [ ] Der Status-Toggle ändert nicht die Position des Tasks in der Liste.
- [ ] Titelediting (FEAT-1 Inline-Edit) ändert den Status nicht – beide Aktionen sind vollständig unabhängig.
- [ ] Nach einem Löschen eines Tasks (FEAT-1) verschwindet er unabhängig von seinem Status.

### Edge Cases
- **Toggle auf erledigt, dann sofort Titel bearbeiten:** Status bleibt `erledigt`; Strikethrough bleibt erhalten während und nach dem Edit.
- **Schnelles Doppel-Klick auf Checkbox:** Toggle wird zweifach ausgeführt – Task landet wieder im ursprünglichen Status (idempotent durch Klick-Events, kein Debounce nötig).
- **Alle Tasks erledigt:** Kein Sonderverhalten – Liste zeigt alle Tasks durchgestrichen; kein „Alle erledigt"-Hinweis nötig.
- **Neuer Task nach erledigten Tasks:** Neu erstellte Tasks starten immer mit Status `offen`, unabhängig vom Status anderer Tasks.

### Nicht im Scope
- Filter (Alle / Offen / Erledigt)
- Bulk-Toggle (alle erledigen / alle öffnen)
- Fälligkeitsdaten oder Prioritäten
- Persistenz des Status → FEAT-3
