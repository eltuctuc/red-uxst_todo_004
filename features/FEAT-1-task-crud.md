# FEAT-1: Task-CRUD

## Status
Aktueller Schritt: Spec

## Abhängigkeiten
- Benötigt: Keine

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-01*

### Beschreibung
Der Nutzer kann Tasks mit einem Titel anlegen, in einer Liste anzeigen, den Titel inline bearbeiten und Tasks löschen. Kein Status-Toggle (→ FEAT-2), keine Persistenz (→ FEAT-3).

### Definitionen
- **Task:** Ein Eintrag mit einem nicht-leeren Titel-String. Einziges Pflichtfeld.
- **Inline-Edit:** Der Titel eines bestehenden Tasks wird direkt in der Listenzeile editierbar, ohne Modal oder separate View.
- **Aktiver Edit-Zustand:** Zustand eines Tasks, in dem sein Titel-Feld fokussiert und bearbeitbar ist.

### User Stories
- Als Nutzer möchte ich einen Task per Texteingabe + Enter erstellen, um meine Aufgaben schnell zu erfassen.
- Als Nutzer möchte ich alle Tasks in einer Liste sehen, um einen Überblick über meine Aufgaben zu haben.
- Als Nutzer möchte ich einen Task-Titel durch Klicken inline bearbeiten, um Tippfehler oder Änderungen schnell zu korrigieren.
- Als Nutzer möchte ich eine Bearbeitung mit ESC oder Klick ausserhalb abbrechen, um versehentliche Änderungen zu verhindern.
- Als Nutzer möchte ich einen Task löschen, um abgeschlossene oder irrelevante Einträge zu entfernen.

### Acceptance Criteria
- [ ] Ein Task kann über ein Eingabefeld (Placeholder: „Neue Aufgabe...") per Enter-Taste erstellt werden.
- [ ] Nach dem Erstellen ist das Eingabefeld leer und bereit für die nächste Eingabe.
- [ ] Ein Task mit leerem oder nur-Whitespace-Titel kann nicht gespeichert werden (Submit wird blockiert, kein Feedback nötig).
- [ ] Alle bestehenden Tasks werden in der Reihenfolge ihrer Erstellung als Liste angezeigt.
- [ ] Ein Klick auf den Titel eines Tasks aktiviert den Inline-Edit-Zustand (Input-Feld mit aktuellem Titel, fokussiert).
- [ ] Im Inline-Edit-Zustand speichert Enter den neuen Titel (sofern nicht leer).
- [ ] Im Inline-Edit-Zustand verwirft ESC die Änderung – der Original-Titel bleibt erhalten.
- [ ] Ein Klick ausserhalb des aktiven Input-Felds (Blur) verwirft die Änderung – der Original-Titel bleibt erhalten.
- [ ] Zu jeder Zeit ist maximal ein Task im Inline-Edit-Zustand.
- [ ] Jeder Task hat eine Lösch-Aktion (z. B. Button oder Icon), die den Task sofort aus der Liste entfernt.

### Edge Cases
- **Leerer Titel beim Erstellen:** Enter bei leerem oder Whitespace-only-Eingabefeld macht nichts – kein Task wird angelegt.
- **Leerer Titel beim Bearbeiten:** Versucht der Nutzer per Enter einen leeren Titel zu speichern, wird blockiert – Original bleibt.
- **Blur bei unverändertem Inhalt:** Wenn der Nutzer ins Feld klickt, nichts ändert und dann Blur auslöst, bleibt der Titel unverändert (kein Dirty-Flag nötig).
- **Löschen während aktiver Bearbeitung:** Löscht der Nutzer einen Task, der gerade bearbeitet wird (z. B. über Keyboard-Navigation), wird der Task sofort entfernt.
- **Sehr langer Titel:** Titel werden nicht auf eine Maximal-Länge begrenzt; das UI macht den Text wrappable oder truncated (visuell, nicht funktional kritisch).

### Nicht im Scope
- Status-Toggle (erledigt / offen) → FEAT-2
- Filterung oder Sortierung der Liste
- Persistenz (Daten gehen beim Reload verloren) → FEAT-3
- Drag-and-Drop-Sortierung
- Mehrfachauswahl oder Bulk-Aktionen
- Undo/Redo nach Löschen
- Tastaturkürzel über Enter/ESC hinaus
