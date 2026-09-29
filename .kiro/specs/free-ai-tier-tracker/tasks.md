# Tasks — Free AI Tier Tracker

Each task cites the requirement(s) it satisfies. Tasks are ordered so every step is
independently verifiable.

- [x] 1. Write the spec (requirements, design, tasks) — _Requirements: all_
- [x] 2. Implement `src/tracker.js` core logic (days, status, percent, budget,
  ordering, validation) — _Requirements: 2, 3, 4, 6_
- [x] 3. Create `data/tools.json` with sample tool entries — _Requirements: 1_
- [x] 4. Add `scripts/validate-data.js` schema checker — _Requirements: 6_
- [x] 5. Write property-based tests with fast-check — _Requirements: 2, 3, 4, 6_
- [x] 6. Build the dashboard UI (`public/index.html`, `styles.css`, `app.js`) —
  _Requirements: 1, 2, 3, 4, 5_
- [x] 7. Add Kiro steering files (`product.md`, `tech.md`, `structure.md`) — _Kiro lesson: steering_
- [x] 8. Add Kiro hooks (`run-tests.json`, `validate-data.json`) — _Kiro lesson: hooks_
- [x] 9. Add the tool-researcher custom agent — _Kiro lesson: custom agents_
- [x] 10. Add the MCP server and `.kiro/settings/mcp.json` — _Kiro lesson: MCP_
- [x] 11. Add the tier-tracker-expert power — _Kiro lesson: powers_
- [ ] 12. Run `npm test` and `npm run validate:data` — both green before release
- [ ] 13. Record the demo video (30s–3min) highlighting all seven lessons
