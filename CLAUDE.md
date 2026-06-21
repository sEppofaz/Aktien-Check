# Aktien-Check

## App
Tech-Aktien Kennzahlen-Screener nach Philipp „Pip" Klöckner (Doppelgänger-Podcast).
7 Kennzahlen: Rule of 40, EV/Sales, Bruttomarge, NRR, SBC-adj. FCF, Churn Rate, LTV/CAC.
Rein client-seitig, kein Backend. State wird in localStorage gespeichert. Pull-to-Refresh löscht alle Eingaben.

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
