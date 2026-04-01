# BUG-FEAT3-UX-002: Kein Hinweis auf automatisches Speichern – implizites UX-Versprechen nicht kommuniziert

- **Feature:** FEAT-3 – Persistenz / localStorage
- **Severity:** Low
- **Bereich:** Copy / UX
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

User Story 2 lautet: "Als Nutzer möchte ich dass Änderungen sofort gespeichert werden, ohne einen Speichern-Button drücken zu müssen."

Die Implementierung erfüllt das technisch korrekt. Das UX-Problem: Der Nutzer kann dieses Verhalten nicht aus der App ablesen. Es gibt keinen Hinweis – weder explizit ("Automatisch gespeichert") noch implizit (kein Speichern-Button der jetzt fehlt, kein Diskette-Icon). 

Für Persona Enrico (technikaffin) ist das vermutlich kein Problem – er wird es ausprobieren und schnell merken. Aber die User Story formuliert eine Erwartung ("möchte ich, dass Änderungen sofort gespeichert werden"), die der User nur durch aktives Testen (Reload nach Task-Erstellung) verifizieren kann. Das Vertrauen in die Persistenz-Funktion entsteht nicht von selbst.

Konkrete Reibungsmomente:
- Nutzer erstellt Tasks, schliesst den Tab, öffnet ihn wieder: Beim ersten Mal weiss er nicht, ob die Tasks noch da sind
- Nutzer fragt sich, ob er etwas tun muss um die Daten zu "sichern"
- Kein visuelles Feedback das bestätigt "deine Arbeit ist sicher"

## Steps to Reproduce

1. App frisch öffnen (kein vorheriger Zustand)
2. 3 Tasks erstellen
3. Frage stellen: Woher weiss der Nutzer, dass diese Tasks beim nächsten Öffnen noch da sind?

- **Expected:** Der Nutzer hat ein klares Signal – entweder durch UI-Text, durch Verhalten (automatisches "Gespeichert" Feedback) oder durch Kontext-Information
- **Actual:** Kein Hinweis. Das Verhalten ist unsichtbar, und das ist laut Spec so gewollt. Aber die Unsichtbarkeit erzeugt keine Sicherheit, sondern Ungewissheit.

## Empfehlung

Minimaler, nicht-störender Hinweis in der App. Drei Optionen:

**Option A (bevorzugt für Prototyp):** Einen einzeiligen, subtilen Hinweistext unterhalb der Task-Liste oder im Footer der Card: "Wird automatisch gespeichert" – dauerhaft sichtbar, in `color-text-secondary`, `text-sm`. Kein Icon nötig. Erzeugt Vertrauen ohne Aufmerksamkeit zu stehlen.

**Option B:** Nur nach der ersten erfolgreichen Speicherung (erster Task erstellt) einmalig einen kurzen Toast: "Aufgaben werden automatisch gespeichert." – nur einmal sichtbar, dann nie wieder.

**Option C (minimal):** Nichts ändern – aber dann sollte die User Story geändert werden. Die aktuelle Formulierung impliziert, dass der Nutzer dieses Versprechen wahrnehmen kann.

Dieser Bug ist Low, weil technikaffine Nutzer (Enrico) das Verhalten schnell verifizieren. Für einen breiteren Nutzerkreis wäre es Medium.

## Priority

Nice-to-have
