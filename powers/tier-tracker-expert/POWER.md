---
name: "tier-tracker-expert"
displayName: "Tier Tracker Expert"
description: "Domain expertise for tracking free AI tiers: free-tier economics, catalogue data conventions, and the Kiro workflow used by the Free AI Tier Tracker"
keywords: ["free tier", "AI tools", "credits", "expiry", "tracker", "free ai"]
author: "Aditya Saini"
---

# Tier Tracker Expert

Installable domain knowledge for anything involving free AI tier tracking — the same
conventions this repository was built with.

## When this power activates

Any task about free AI tools, credit limits, trial expiries, or the Free AI Tier
Tracker codebase. Keywords: free tier, AI tools, credits, expiry, tracker.

## Core principles

1. **One source of truth.** All business logic lives in `src/tracker.js` as pure
   functions. The UI, tests and MCP server consume it — never reimplement it.
2. **Deterministic dates.** Date logic always takes an explicit `now` parameter.
   Hidden `Date.now()` calls make logic untestable and are not allowed in `src/`.
3. **Data is guilty until proven valid.** Every `data/tools.json` change must pass
   `npm run validate:data`. Limits come from official provider pages, never from memory.
4. **Properties over examples.** New behaviour gets a property-based test asserting a
   universal invariant, not a handful of hand-picked cases.

## Steering

- `steering/quick-reference.md` — schema, commands and invariants at a glance.

## MCP

This power ships no MCP server of its own; pair it with the repository's
`tier-tracker` MCP server (`.kiro/settings/mcp.json`) to let agents query the live
catalogue.
