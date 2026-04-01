# Product Requirements Document
*Erstellt: 2026-04-01*

## Vision
Eine minimalistische Browser-Todo-App für eine einzelne Person, die alle Daten lokal im Browser speichert – primär als Testobjekt für die red:proto-Entwicklungspipeline.

## Zielgruppe
Einzelnutzer (Enrico), lokal im Desktop-Browser.

## Kernproblem
Zum Testen der red:proto-Pipeline wird ein realistisches, aber überschaubares Produkt benötigt – komplex genug um alle Pipeline-Schritte sinnvoll zu durchlaufen, einfach genug um nicht abzulenken.

## Scope (In)
- Tasks anlegen (Titel)
- Tasks bearbeiten (Titel ändern)
- Tasks als erledigt markieren
- Tasks löschen
- Persistenz via localStorage (Daten überleben Tab-Reload)
- Reine Frontend-App, kein Server nötig

## Out-of-Scope
- Fälligkeitsdaten, Prioritäten, Tags, Kategorien
- Mehrere Listen / Projekte
- Nutzeraccounts, Sync, Backend
- Mobile Optimierung

## Erfolgskriterien
- Alle vier CRUD-Operationen funktionieren ohne Fehler
- Daten bleiben nach Seiten-Reload erhalten
- App läuft ohne Server direkt im Browser (oder über lokalen Dev-Server)

## Offene Fragen
- Keine – Scope ist vollständig definiert

## Scope-Typ
Funktionierender Prototyp
