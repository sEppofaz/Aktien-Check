# ADR-001: Kein Client-Secret – Rate-Limiting als einziger Schutz für /aktien-lookup

**Datum:** 2026-06-26
**Status:** aktiv
**Projekt:** Aktien-Check

## Problem

Der `/aktien-lookup`-Endpoint (Hetzner) war mit einem `X-Token`-Header geschützt. Dieser Token wurde in `index.html` als JavaScript-Konstante gespeichert und mit dem Repo auf GitHub Pages veröffentlicht – öffentlich einsehbar im Quelltext.

## Entscheidung

Kein Client-Secret mehr. `/aktien-lookup` ist tokenlos. Schutz ausschließlich via nginx `claude_zone` Rate-Limit (burst=3, ~3 Requests/Minute pro IP).

## Begründung

Static PWAs auf GitHub Pages haben keinen sicheren Ort für Secrets. Jeder Wert in der HTML/JS-Datei ist für jeden Besucher lesbar. Ein Token in diesem Kontext schützt nicht, er täuscht Schutz vor. Rate-Limiting auf Server-Seite ist der einzige korrekte Mechanismus für eine persönliche PWA dieses Typs.

## Verworfen

| Alternative | Warum verworfen |
|---|---|
| Token rotieren + weiter im Frontend nutzen | Schiebt das Problem nur auf – nächster Git-Commit legt den neuen Token wieder offen |
| Backend-Proxy (eigener Auth-Server) | Overengineering für persönliche App mit 1 Nutzer |
| CORS-only | Bypass per curl trivial möglich, kein echter Schutz |

## Gilt unter

- App bleibt auf GitHub Pages (statisch, public)
- Rate-Limit `claude_zone` ist in nginx aktiv (burst=3)
- App ist persönlich (1 Nutzer) – bei öffentlicher Nutzung Rate-Limit ggf. anpassen

## Konsequenzen

- `AKTIEN_LOOKUP_SECRET` in `/etc/pka/secrets.env` ist obsolet (kann entfernt werden)
- `/aktien-lookup` ist ohne Token aufrufbar – bei Missbrauch nginx-Log prüfen + Rate-Limit verschärfen
- Keine mehr Tokens oder API-Keys in Frontend-Code dieser App
