# FEAT-3: Persistenz

## Status
Aktueller Schritt: Spec

## Abhängigkeiten
- Benötigt: FEAT-1 (Task-CRUD) – Task-Datenstruktur muss definiert sein
- Benötigt: FEAT-2 (Task-Status) – Status muss mit persistiert werden

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-01*

### Beschreibung
Alle Tasks inkl. ihrer Status-Werte werden automatisch im localStorage des Browsers gespeichert. Beim nächsten Seitenaufruf werden die gespeicherten Daten geladen. Der Nutzer muss nichts aktiv tun – Speichern und Laden passieren transparent im Hintergrund.

### Definitionen
- **Persistenz:** Eigenschaft, dass Task-Daten einen Browser-Tab-Reload überleben, ohne Server-Kommunikation.
- **localStorage:** Browser-API zur synchronen Schlüssel-Wert-Speicherung, scoped auf Origin und Tab-unabhängig.
- **Storage-Key:** Der eindeutige Schlüssel unter dem die Task-Liste im localStorage abgelegt wird (z. B. `ux-stammtisch-tasks`).
- **Korrupte Daten:** localStorage-Eintrag der nicht als valides JSON-Array von Task-Objekten geparst werden kann.

### User Stories
- Als Nutzer möchte ich dass meine Tasks nach einem Seiten-Reload noch vorhanden sind, damit ich die App schließen und später weitermachen kann.
- Als Nutzer möchte ich dass Änderungen (Erstellen, Bearbeiten, Löschen, Status-Toggle) sofort gespeichert werden, ohne einen Speichern-Button drücken zu müssen.
- Als Nutzer möchte ich die App beim ersten Start ohne Konfiguration sofort nutzen können, damit kein Setup-Overhead entsteht.

### Acceptance Criteria
- [ ] Alle Tasks (Titel + Status) werden nach jeder Änderung automatisch im localStorage gespeichert.
- [ ] Beim App-Start werden die Tasks aus dem localStorage geladen und in der gespeicherten Reihenfolge angezeigt.
- [ ] Nach einem Seiten-Reload sind alle Tasks mit ihren Titeln und Status-Werten identisch zur vorherigen Session.
- [ ] Ist der localStorage-Schlüssel nicht vorhanden (erster Start), startet die App mit einer leeren Task-Liste.
- [ ] Sind die localStorage-Daten nicht als valides JSON parsebar, werden sie gelöscht und die App startet mit einer leeren Liste (silent reset, kein sichtbarer Fehler).
- [ ] Es gibt keinen expliziten „Speichern"-Button – Persistenz ist vollständig automatisch.

### Edge Cases
- **Erster App-Start (leerer localStorage):** Kein Fehler, leere Task-Liste wird angezeigt.
- **Korrupte Daten im localStorage:** JSON.parse schlägt fehl → localStorage-Eintrag löschen, App mit leerer Liste starten. Kein sichtbarer Fehler für den User.
- **localStorage voll (QuotaExceededError):** Für eine single-user Minimal-App mit Text-Tasks praktisch nicht relevant – kein spezielles Handling nötig.
- **Mehrere Tabs gleichzeitig:** Kein Cross-Tab-Sync – jeder Tab arbeitet unabhängig. Beim Reload eines Tabs werden die zuletzt geschriebenen Daten geladen (Last-Write-Wins durch den zuletzt aktiven Tab).
- **Privat/Inkognito-Modus:** localStorage kann eingeschränkt sein. Kein spezielles Handling – App verhält sich wie beim ersten Start.

### Nicht im Scope
- Server-seitige Persistenz, Cloud-Sync oder Backup
- Export / Import von Task-Daten
- Cross-Tab-Synchronisation (StorageEvent)
- Versionierung des Daten-Schemas / Migrations
- Offline-Support via Service Worker
