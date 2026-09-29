# Design — Free AI Tier Tracker

## Overview

A zero-build static dashboard. Pure functions in `src/tracker.js` hold all business
logic (dates, budgets, ordering, validation); `public/` renders them; `data/tools.json`
is the single source of truth for tool data. The same core module is imported by the
browser UI, the Node test suite and the MCP server — one implementation, three consumers.

## Architecture

```
data/tools.json            ← tool catalogue (validated by hook + script)
src/tracker.js             ← pure business logic (days, budgets, ordering, validation)
public/index.html|css|app.js ← dashboard UI (imports ../src/tracker.js as an ES module)
tests/tracker.property.test.js ← property-based tests (fast-check, node:test)
scripts/validate-data.js   ← schema check for data/tools.json
mcp/tracker-server.js      ← MCP server exposing the catalogue to AI agents
```

Serve the repository root (`npm run serve`) and open `/public/` — the UI fetches
`../data/tools.json` and imports `../src/tracker.js` relatively.

## Components

### tracker.js (core)

| Function | Purpose |
|---|---|
| `daysUntil(expiryIso, nowIso?)` | Whole days until expiry (negative when expired) |
| `expiryStatus(tool, nowIso?)` | `expired` / `expiring-soon` / `active` / `no-expiry` |
| `creditPercent(tool)` | Usage bar fill, clamped to [0, 100] |
| `creditsRemaining(tool)` | `limit − used`, floored at 0 |
| `dailyBudget(tool, nowIso?)` | `remaining / daysLeft`, 0 when expired, full balance when no expiry |
| `sortByUrgency(tools, nowIso?)` | Urgency ordering per Requirement 3 |
| `validateTool(tool)` | Schema check returning a list of error strings |

All date functions accept an explicit `nowIso` so tests and demos are deterministic.

### Data model (data/tools.json)

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

`expiryDate` is an ISO string or `null`. `reset` is one of `daily`, `monthly`, `one-time`.

### Dashboard UI (public/)

- Header with search box + status filter.
- Summary stat tiles (tracked / active / expiring soon / expired).
- Cards sorted by `sortByUrgency`, each with a usage bar, remaining balance,
  expiry line and safe daily budget.
- Dark theme, no build step, no framework.

## Testing

Property-based tests (`tests/tracker.property.test.js`, fast-check over `node:test`):

- `daysUntil` equals the floored millisecond day-difference for arbitrary timestamp pairs.
- `expiryStatus` is consistent with `daysUntil` for arbitrary dates.
- `creditPercent` is always within [0, 100] for arbitrary limits/usage.
- `sortByUrgency` preserves the set of tools and never violates urgency order.
- `validateTool` accepts every well-formed generated tool and rejects over-used /
  malformed ones.

The `run-tests` hook executes `npm test` on every save under `src/`.

## Kiro integration

- **Steering** (`.kiro/steering/`): product, tech and structure context, always loaded.
- **Hooks** (`.kiro/hooks/`): `run-tests.json` (tests on source save),
  `validate-data.json` (schema check on data save).
- **MCP** (`.kiro/settings/mcp.json` + `mcp/tracker-server.js`): exposes
  `list_tools` / `get_tool` to any MCP-capable agent.
- **Agents** (`.kiro/agents/tool-researcher.md`): researches new free AI tools and
  drafts validated `tools.json` entries.
- **Powers** (`powers/tier-tracker-expert/`): installable domain knowledge pack for
  the free-tier tracking domain.
