# Aktien-Check

## App
Tech-Aktien Kennzahlen-Screener nach Philipp „Pip" Klöckner (Doppelgänger-Podcast).
7 Kennzahlen: Rule of 40, EV/Sales, Bruttomarge, NRR, SBC-adj. FCF, Churn Rate, LTV/CAC.
State in localStorage. Pull-to-Refresh löscht alle Eingaben.
KI-Befüllung via Hetzner-Backend (Yahoo Finance + Claude Haiku). Primär auf iPhone genutzt.

## URLs
- Live: https://seppofaz.github.io/Aktien-Check/
- GitHub: https://github.com/sEppofaz/Aktien-Check

## Deployment
```bash
git add . && git commit -m "..." && git push
# GitHub Pages deployt automatisch
```

## GitHub Pages einrichten (einmalig)
Settings → Pages → Branch: main, Folder: / (root) → Save

## SW-Cache
`aktien-check-v1` → bei Änderungen an Icons oder manifest.json hochzählen (index.html: network-first, kein Hochzählen nötig)

## Icon
Lucide trending-up, Hintergrund #064e3b (dunkelgrün), weißes Icon
Methode A (macOS): qlmanage + sips (siehe BKM/PWA-Standards.md)

## Ampel-Schwellenwerte
| Kennzahl       | Grün          | Gelb          | Rot        |
|----------------|---------------|---------------|------------|
| Rule of 40     | ≥ 40          | 25–39         | < 25       |
| EV/Sales       | < 10×         | 10–20×        | > 20×      |
| Bruttomarge    | ≥ 80 %        | 60–79 %       | < 60 %     |
| NRR            | ≥ 120 %       | 100–119 %     | < 100 %    |
| SBC-adj. FCF   | Marge ≥ 15 %  | 5–14 %        | < 5 %      |
| Churn Rate     | < 5 %         | 5–15 %        | > 15 %     |
| LTV/CAC        | ≥ 3×          | 1–3×          | < 1×       |

## Pip-Score
Punkte: grün=3, gelb=2, rot=1. Score = Punkte / (bewertete Kennzahlen × 3).
Label: ≥80 % → Stark, ≥60 % → Solide, ≥40 % → Gemischt, <40 % → Kritisch.
SBC-adj. FCF ohne Umsatz-Eingabe erhält keine Ampel und fließt nicht in den Score ein.

---

## KI-Befüllung (Backend – Hetzner)

- **Endpoint:** `POST https://umbenennen.duckdns.org/aktien-lookup`
- **Auth:** `X-Token: AKTIEN_LOOKUP_SECRET` (in `/etc/pka/secrets.env`)
- **Blueprint:** `/opt/rename-webhook/services/aktien/routes.py`
- **Yahoo Finance:** EV, Umsatz, Wachstum, Bruttomarge, FCF, SBC → direkte Felder
- **Claude Haiku:** NRR %, Churn %, LTV/CAC × → als Komponentenwerte zurückgerechnet, mit `~KI`-Badge markiert
- **NRR-Rückrechnung:** arr=1000, churn=30, expansion = (nrr%/100−1)×1000+30
- **Kosten:** ~0,001 € / Lookup (Haiku)

## Autocomplete (Backend)

- **Endpoint:** `GET https://umbenennen.duckdns.org/aktien-search?q=...`
- **Kein Token** (nur Lesen, öffentliche Daten)
- **yfinance Search**, filtert auf EQUITY, US-Börsen zuerst
- **Debounce:** 280 ms

## iOS-Pitfalls

- Dropdown muss `position:fixed` als `<body>`-Kind sein – nicht im sticky Header (wird sonst abgeschnitten)
- Dropdown-Items: `onpointerdown + e.preventDefault()` statt `onmousedown` → verhindert Blur vor Auswahl
- Touch-Targets: min 44px (iOS HIG)
- `restoreState()` muss `updateKiBtn()` aufrufen, sonst bleibt Button nach Reload disabled

## SW-Pitfall
Kein `reg.update()` + `location.reload()` bei `controllerchange` – verursacht Reload-Loop. SW hat `skipWaiting()` selbst im Install-Handler.

## Template-Literal-Pitfall (Vorfall 2026-06-22)
Template-Literal-Backticks (`` ` ``) in `kiFill()` fehlten → SyntaxError → **gesamter `<script>`-Block parsete nicht** → App komplett funktionslos. Immer nach Änderungen an JS-Strings die Template-Literals enthalten prüfen ob Backticks korrekt gesetzt sind (Python `repr()` oder `python3 -c "with open(...) as f: print(f.read())"` auf verdächtige Zeilen).
