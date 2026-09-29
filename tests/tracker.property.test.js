// Property-based tests for the Free AI Tier Tracker core logic.
// Lesson 4 of the Kiro University Challenge: property-based testing.
// Instead of hand-picked examples, fast-check generates hundreds of random
// inputs per property and verifies universal invariants hold for all of them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import {
  daysUntil,
  expiryStatus,
  creditPercent,
  creditsRemaining,
  dailyBudget,
  sortByUrgency,
  validateTool,
} from '../src/tracker.js';

const DAY_MS = 86400000;
const isoArb = () =>
  fc.integer({ min: Date.UTC(2024, 0, 1), max: Date.UTC(2028, 11, 31) })
    .map((ms) => new Date(ms).toISOString());

const toolArb = () =>
  fc.record({
    name: fc.string({ minLength: 1, maxLength: 40 }),
    url: fc.webUrl(),
    category: fc.string({ minLength: 1, maxLength: 20 }),
    freeTier: fc.record({
      limit: fc.double({ min: 0, max: 100000, noNaN: true }),
      used: fc.double({ min: 0, max: 100000, noNaN: true }),
      unit: fc.string({ minLength: 1, maxLength: 20 }),
    }).filter((ft) => ft.used <= ft.limit),
    expiryDate: fc.option(isoArb(), { nil: null }),
  });

test('daysUntil equals the floored day difference between two timestamps', () => {
  fc.assert(
    fc.property(isoArb(), isoArb(), (expiry, now) => {
      const expected = Math.floor((new Date(expiry) - new Date(now)) / DAY_MS);
      assert.equal(daysUntil(expiry, now), expected);
    }),
    { numRuns: 500 }
  );
});

test('expiryStatus is always consistent with daysUntil', () => {
  fc.assert(
    fc.property(isoArb(), isoArb(), fc.boolean(), (expiry, now, hasExpiry) => {
      const tool = hasExpiry ? { expiryDate: expiry } : { expiryDate: null };
      const status = expiryStatus(tool, now);
      if (!hasExpiry) {
        assert.equal(status, 'no-expiry');
      } else {
        const d = daysUntil(expiry, now);
        if (d < 0) assert.equal(status, 'expired');
        else if (d <= 7) assert.equal(status, 'expiring-soon');
        else assert.equal(status, 'active');
      }
    }),
    { numRuns: 500 }
  );
});

test('creditPercent is always clamped to [0, 100]', () => {
  fc.assert(
    fc.property(
      fc.double({ min: 0, max: 100000, noNaN: true }),
      fc.double({ min: 0, max: 100000, noNaN: true }),
      (limit, used) => {
        const p = creditPercent({ freeTier: { limit, used } });
        assert.ok(p >= 0 && p <= 100, `out of range: ${p}`);
      }
    ),
    { numRuns: 500 }
  );
});

test('creditsRemaining plus used never exceeds the limit', () => {
  fc.assert(
    fc.property(toolArb(), (tool) => {
      assert.ok(
        creditsRemaining(tool) + tool.freeTier.used <= tool.freeTier.limit + 1e-9
      );
    }),
    { numRuns: 300 }
  );
});

test('dailyBudget is never negative and never exceeds remaining credits', () => {
  fc.assert(
    fc.property(toolArb(), isoArb(), (tool, now) => {
      const budget = dailyBudget(tool, now);
      assert.ok(budget >= 0, `negative budget: ${budget}`);
      assert.ok(budget <= creditsRemaining(tool) + 1e-9);
    }),
    { numRuns: 300 }
  );
});

test('sortByUrgency keeps every tool exactly once and orders expired first', () => {
  fc.assert(
    fc.property(fc.array(toolArb(), { maxLength: 20 }), isoArb(), (tools, now) => {
      const sorted = sortByUrgency(tools, now);
      assert.equal(sorted.length, tools.length);
      const names = (arr) => arr.map((t) => t.name).sort();
      assert.deepEqual(names(sorted), names(tools));

      const rank = { expired: 0, 'expiring-soon': 1, active: 2, 'no-expiry': 3 };
      const ranks = sorted.map((t) => rank[expiryStatus(t, now)]);
      for (let i = 1; i < ranks.length; i++) {
        assert.ok(ranks[i] >= ranks[i - 1], 'urgency order violated');
      }
    }),
    { numRuns: 300 }
  );
});

test('validateTool accepts every well-formed tool the generator produces', () => {
  fc.assert(
    fc.property(toolArb(), (tool) => {
      assert.deepEqual(validateTool(tool), []);
    }),
    { numRuns: 300 }
  );
});

test('validateTool rejects over-used and malformed entries', () => {
  fc.assert(
    fc.property(toolArb(), (tool) => {
      const overUsed = {
        ...tool,
        freeTier: { ...tool.freeTier, used: tool.freeTier.limit + 1 },
      };
      assert.ok(validateTool(overUsed).length > 0);
      assert.ok(validateTool({ ...tool, expiryDate: 'not-a-date' }).length > 0);
      assert.ok(validateTool(null).length > 0);
    }),
    { numRuns: 200 }
  );
});
