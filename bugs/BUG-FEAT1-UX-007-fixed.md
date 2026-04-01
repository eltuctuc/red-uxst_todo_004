# BUG-FEAT1-UX-007: Card-Body-Struktur weiterhin nicht DS-konform (unvollständiger Fix von UX-002)

- **Feature:** FEAT-1 – Task-CRUD
- **Severity:** Medium
- **Bereich:** Konsistenz / DS-Compliance
- **Gefunden von:** UX Reviewer (Retest nach Bug-Fix-Sprint)
- **Status:** Open

## Problem

BUG-FEAT1-UX-002 wurde als fixed markiert. Der Fix hat zwei der drei dokumentierten Abweichungen behoben:
- Horizontales Padding des Headers auf `spacing-6` angeglichen: behoben.
- `overflow: hidden` zu `overflow: clip` geändert: behoben.

Die dritte Abweichung ist weiterhin offen: Die Card-Spec (`design-system/components/card.md`) definiert den Pflichtaufbau als `Card-Wrapper > Card-Header > Card-Body`. Der Card-Body hat laut Spec `Padding Body: spacing-6`.

In der Implementierung (`TaskPage.tsx`) gibt es keinen `Card-Body`-Container. Der Hauptinhalt (TaskCreate + TaskList) liegt direkt im Card-Wrapper ohne Body-Wrapper und ohne einheitliches Padding. Stattdessen hat jede Unterkomponente ihr eigenes Padding:

- `TaskCreate.css`: `padding: var(--spacing-4)` – abweichend von `spacing-6`
- `TaskList.css`: Kein Padding am Listenelement selbst

Die DS-Spec ist eindeutig: Der Card-Body ist Pflicht und hat `spacing-6` Padding. Eine Ausnahme ist weder als Hypothesentest noch anderweitig dokumentiert.

## Steps to Reproduce

1. `TaskPage.tsx` mit `design-system/components/card.md` vergleichen
2. Expected: Direktkinder des Card-Wrappers folgen der Struktur `Card-Header > Card-Body`; Card-Body hat `padding: var(--spacing-6)`
3. Actual: Kein Card-Body-Wrapper vorhanden; TaskCreate hat `padding: spacing-4` (abweichend); TaskList hat kein Padding

## Empfehlung

Einen `<div className="task-page__card-body">` als Wrapper um TaskList einführen mit `padding: var(--spacing-6)`. TaskCreate liegt zwischen Header und Body – wenn das Layout-Splitting (Create-Input zwischen Header und Body, mit eigener Border-Bottom) beibehalten werden soll, dieses als genehmigte Variante in `design-system/components/card.md` dokumentieren oder als Hypothesentest im Feature-File eintragen.

## Priority

Fix before release
