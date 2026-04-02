# Produktfähigkeiten

## Persistenz *(FEAT-3, seit 2026-04-02)*
Alle Tasks werden automatisch im localStorage des Browsers gespeichert – ohne Speichern-Button und ohne Serverkommunikation. Beim nächsten Seitenaufruf lädt die App den gespeicherten Zustand transparent wieder her: Titel, Reihenfolge und Erledigt-Status bleiben identisch zur vorherigen Session. Lässt sich der Speicher nicht lesen (korrupte oder teilweise ungültige Daten), erscheint ein diskreter Hinweis-Banner und die App startet mit einer leeren Liste.

## Task-Status Toggle *(FEAT-2, seit 2026-04-02)*
Der Nutzer kann jeden Task per Checkbox-Klick als erledigt markieren und diese Markierung wieder aufheben. Erledigte Tasks werden visuell durch eine angehakte Checkbox, einen durchgestrichenen Titel und reduzierten Kontrast hervorgehoben – alle drei Kanäle sind redundant, sodass der Status auch ohne Farbunterscheidung erkennbar ist. Die Interaktion ist synchron und sofort wirksam, ohne Ladezeit oder Formular-Submit.
