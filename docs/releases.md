# Release History

## 2026-04-02 – v0.2.0
### Neue Features
- **FEAT-3 – Persistenz:** Automatisches Speichern aller Tasks im localStorage; transparentes Laden beim App-Start; Reset-Banner bei korrupten oder teilweise ungültigen Daten.

### Bug Fixes
- **BUG-FEAT3-QA-001:** Array.isArray-Check verhindert Absturz bei nicht-Array JSON *(Severity: Medium)*
- **BUG-FEAT3-QA-002:** Filter entfernt strukturell ungültige Task-Objekte beim Laden *(Severity: Medium)*
- **BUG-FEAT3-QA-006:** Touch-Target Close-Button auf 44×44px korrigiert (border-box Fix) *(Severity: Medium)*
- **BUG-FEAT3-UX-001:** Reset-Banner bei vollständigem Datenverlust implementiert *(Severity: Medium)*
- **BUG-FEAT3-UX-004:** Auto-Dismiss Banner entfernt – Banner bleibt persistent bis User-Close *(Severity: Medium)*
- **BUG-FEAT3-UX-005:** Close-Button WCAG Touch-Target gefixt (Teil von QA-006) *(Severity: Medium)*
- **BUG-FEAT3-UX-006:** wasReset auch bei partiellem Task-Verlust gesetzt – Banner erscheint nun auch wenn einzelne Tasks gefiltert werden *(Severity: Medium)*

---

## 2026-04-02 – v0.1.0
### Neue Features
- **FEAT-2 – Task-Status Toggle:** Checkbox pro Task zum Markieren als erledigt/offen; visuelles Feedback via Strikethrough und reduziertem Kontrast.

### Bug Fixes
- **BUG-FEAT2-QA-001:** Checkbox Touch Target auf 44×44px erhöht (WCAG 2.5.5) *(Severity: Medium)*
- **BUG-FEAT2-QA-002:** Hover-Border-Kontrast auf color-primary-500 angehoben (WCAG 1.4.11) *(Severity: Medium)*
- **BUG-FEAT2-QA-004:** Motion-Tokens in TaskItem.css durchgezogen (vorher hardcoded 0.15s) *(Severity: Medium)*
- **BUG-FEAT2-QA-005:** Checkbox label/aria-label Kombination auf useId + htmlFor umgestellt *(Severity: Medium)*
- **BUG-FEAT2-QA-006:** Focus-Ring CSS-Selektor (+ → ~) nach QA-005-Regression gefixt *(Severity: Medium)*
- **BUG-FEAT2-UX-001:** Checkmark-Farbe auf color-text-on-primary Token umgestellt *(Severity: Medium)*
- **BUG-FEAT2-UX-002:** Transitions in Checkbox.css auf Motion-Tokens umgestellt *(Severity: Medium)*
- **BUG-FEAT2-UX-003:** prefers-reduced-motion in Checkbox.css ergänzt *(Severity: Medium)*
- **BUG-FEAT2-UX-004:** Hover-Border von color-primary-300 auf color-primary-500 korrigiert *(Severity: Medium)*
- **BUG-FEAT2-UX-005:** Durchgestrichener Titel-Kontrast auf color-text-secondary (~7.3:1) angehoben *(Severity: Medium)*
- **BUG-FEAT2-UX-006:** TaskItem.css hardcoded Transitions auf Motion-Tokens umgestellt *(Severity: Medium)*
- **BUG-FEAT2-UX-007:** prefers-reduced-motion in TaskItem.css ergänzt *(Severity: Medium)*
