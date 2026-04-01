# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Was dieses Projekt ist

Dieses Verzeichnis ist ein **Product Development Framework** (red proto). Es enthält keine App-Code-Dateien – stattdessen orchestriert es Produktentwicklung über Claude-Code-Commands, ein Design System und strukturierte Dokumentation.

## Pipeline (Reihenfolge einhalten)

```
/red:proto-sparring      → Idee schärfen + PRD erstellen  →  prd.md
/red:proto-dev-setup     → Tech-Stack + Scaffold + Git    →  project-config.md
/red:proto-research      → Personas (optional)            →  research/
/red:proto-requirements  → Feature Specs (je Feature)     →  features/FEAT-N.md
/red:proto-flows         → Screen-Inventar (einmalig)     →  flows/product-flows.md
/red:proto-ux            → UX-Entscheidungen (je Feature) →  features/FEAT-N.md
/red:proto-architect     → Tech-Design (je Feature)       →  features/FEAT-N.md
/red:proto-dev           → Implementierung (je Feature)
/red:proto-qa            → QA + Bug-Reports               →  bugs/
```

Nach jeder Pause: `/red:proto-workflow` gibt den aktuellen Stand und den nächsten Schritt aus.

## Verzeichnisstruktur

| Verzeichnis | Inhalt |
|---|---|
| `features/` | Feature-Specs – ein File pro Feature (`FEAT-1.md`, `FEAT-2.md` ...) |
| `bugs/` | Bug-Reports – offene ohne `-fixed`-Suffix |
| `flows/` | `product-flows.md` – Screen-Inventar und Transitions |
| `research/` | Personas und Problem Statement Maps |
| `docs/` | `releases.md` u.a. Projektdokumentation |
| `design-system/` | Verbindliche Design-Referenz (siehe unten) |

## Design System

`design-system/` ist die verbindliche Referenz für alle Agents. Wichtigste Regeln:

- **Tokens haben Vorrang** – keine Hardcoded-Werte (kein `#3B82F6` direkt, Token-Namen verwenden)
- **Existiert eine Komponente im DS** → nutze die Spec, baue keine eigene
- **Existiert keine passende Komponente** → baue eine neue, dokumentiere sie unter `## Offene Punkte` im Feature-File
- **Abweichungen vom DS** → als UX-Bug melden (Severity: Medium oder höher)

Screen-Referenzen gehören nach `design-system/screens/[flow-name]/` als PNG (kebab-case, numerisches Präfix).

## Feature-Status

Jedes Feature-File in `features/` trägt einen `Aktueller Schritt:`-Status:

```
Spec → UX → Tech → Dev → QA → Done
```

## Agents

Spezialisierte Sub-Agents liegen in `.claude/agents/` und werden von den Commands orchestriert:

- `frontend-developer` – implementiert nur UI (liest gesamtes DS)
- `backend-developer` – implementiert nur Backend
- `ux-reviewer` – DS-Compliance-Check nach Implementierung
- `qa-engineer` – technisches QA gegen Acceptance Criteria
