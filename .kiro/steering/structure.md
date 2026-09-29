# Structure — Free AI Tier Tracker

```
free-ai-tier-tracker/
├── .kiro/
│   ├── specs/free-ai-tier-tracker/  # requirements.md, design.md, tasks.md
│   ├── steering/                    # product.md, tech.md, structure.md
│   ├── hooks/                       # run-tests.json, validate-data.json
│   ├── agents/                      # tool-researcher.md
│   └── settings/mcp.json            # MCP server registration
├── powers/tier-tracker-expert/      # installable domain-knowledge power
├── src/tracker.js                   # pure business logic (single source of truth)
├── tests/tracker.property.test.js   # property-based tests (fast-check)
├── scripts/validate-data.js         # data/tools.json schema checker
├── data/tools.json                  # the tool catalogue
├── mcp/tracker-server.js            # MCP server (list_tools, get_tool)
├── public/                          # static dashboard (index.html, app.js, styles.css)
└── package.json
```

Dependency direction: `public/` → `src/` → nothing. `tests/`, `scripts/` and `mcp/`
all consume `src/tracker.js`; nothing imports from `public/`.
