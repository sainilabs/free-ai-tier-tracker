# Tech — Free AI Tier Tracker

## Stack

- Language: JavaScript (ES modules, `"type": "module"`).
- Runtime: Node.js 20+ for tests/scripts; any static server for the UI.
- UI: hand-written HTML/CSS/JS — no framework, no build step.
- Tests: `node:test` runner + `fast-check` for property-based tests.
- MCP server: `@modelcontextprotocol/sdk` over stdio.

## Commands

- `npm test` — run the property-based test suite.
- `npm run validate:data` — schema-check `data/tools.json`.
- `npm run serve` — serve the repo root locally (open `/public/`).

## Conventions

- `src/tracker.js` exports pure functions only: no I/O, no DOM, no `Date.now()`
  hidden inside — every date function takes an explicit `nowIso` parameter so logic
  stays deterministic and testable.
- The UI (`public/app.js`) imports from `../src/tracker.js`; business logic is never
  duplicated in the frontend.
- Tool entries follow the schema in `.kiro/specs/free-ai-tier-tracker/design.md`.
  `expiryDate` is ISO-8601 or `null`.
- Property tests assert universal invariants over generated inputs — prefer adding a
  new property over adding a hand-picked example.
