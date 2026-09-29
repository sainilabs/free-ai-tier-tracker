# ⚡ Free AI Tier Tracker

Every free AI credit you have. Every expiry date. One dashboard.

Built with [Kiro](https://kiro.dev) for the **Kiro University Challenge** — demonstrating
all seven lessons: spec-driven development, steering, hooks, property-based testing,
powers, MCP and custom agents.

## Run it

```bash
npm install
npm test            # property-based test suite (fast-check)
npm run validate:data
npm run serve       # open http://localhost:8080/public/
```

## How it works

- `data/tools.json` — the catalogue of free AI tools (single source of truth)
- `src/tracker.js` — pure business logic: expiry math, usage %, urgency ordering,
  safe daily budgets, schema validation
- `public/` — static dashboard (no framework, no build step)
- `mcp/tracker-server.js` — MCP server exposing `list_tools` / `get_tool`

## Kiro lessons in this repo

| Lesson | Where |
|---|---|
| 1. Spec-driven development | `.kiro/specs/free-ai-tier-tracker/` — requirements (EARS), design, tasks |
| 2. Steering | `.kiro/steering/` — product, tech, structure |
| 3. Hooks | `.kiro/hooks/` — tests on source save, data validation on data save |
| 4. Property-based testing | `tests/tracker.property.test.js` — invariants over generated inputs |
| 5. Powers | `powers/tier-tracker-expert/` — installable domain knowledge |
| 6. MCP | `.kiro/settings/mcp.json` + `mcp/tracker-server.js` |
| 7. Custom agents | `.kiro/agents/tool-researcher.md` |

## Data note

The bundled catalogue is **sample data for demonstration**. Provider terms change
often — verify current limits on official pages before relying on any figure.
