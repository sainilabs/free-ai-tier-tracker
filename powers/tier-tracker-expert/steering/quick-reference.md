# Tier Tracker Expert — Quick Reference

## Tool entry schema

```json
{
  "name": "Provider",
  "category": "LLM API",
  "url": "https://…",
  "freeTier": { "limit": 100, "used": 12, "unit": "credits", "reset": "daily" },
  "expiryDate": "2026-10-15T00:00:00.000Z",
  "notes": "…"
}
```

`reset` ∈ `daily | monthly | one-time`. `expiryDate` is ISO-8601 or `null`.

## Commands

- `npm test` — property-based suite (fast-check, 500 runs per property)
- `npm run validate:data` — schema-check the catalogue
- `npm run serve` — serve repo root, open `/public/`

## Invariants (do not break)

- `0 ≤ creditPercent(tool) ≤ 100` for any limit/used.
- `expiryStatus` agrees with `daysUntil`: negative → expired, 0–7 → expiring-soon.
- `sortByUrgency` never drops, duplicates or reorders across urgency ranks.
- `dailyBudget` ≥ 0 and ≤ remaining credits.
