// Validates data/tools.json against the tracker schema.
// Wired to the `validate-data-on-save` Kiro hook (.kiro/hooks/validate-data.json).
import { readFileSync } from 'node:fs';
import { validateTool } from '../src/tracker.js';

const tools = JSON.parse(readFileSync(new URL('../data/tools.json', import.meta.url)));

let failed = 0;
for (const tool of tools) {
  const errs = validateTool(tool);
  if (errs.length > 0) {
    failed += 1;
    console.error(`INVALID ${tool.name || '(unnamed)'}: ${errs.join('; ')}`);
  }
}
if (failed > 0) {
  console.error(`${failed} tool(s) failed validation`);
  process.exit(1);
}
console.log(`OK — ${tools.length} tools valid`);
