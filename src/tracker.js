// Core logic for the Free AI Tier Tracker.
// Pure functions — no I/O, no DOM — so they can be property-tested.

const DAY_MS = 86400000;

/** Whole days from `now` until `expiry` (negative when already expired). */
export function daysUntil(expiryIso, nowIso = new Date().toISOString()) {
  const ms = new Date(expiryIso).getTime() - new Date(nowIso).getTime();
  return Math.floor(ms / DAY_MS);
}

/** Lifecycle status of a tool's free tier. */
export function expiryStatus(tool, nowIso = new Date().toISOString()) {
  if (!tool.expiryDate) return 'no-expiry';
  const d = daysUntil(tool.expiryDate, nowIso);
  if (d < 0) return 'expired';
  if (d <= 7) return 'expiring-soon';
  return 'active';
}

/** Percentage of the free-tier limit already used, clamped to [0, 100]. */
export function creditPercent(tool) {
  const { limit, used } = tool.freeTier;
  if (!limit || limit <= 0) return 0;
  return Math.min(100, Math.max(0, (used / limit) * 100));
}

/** Credits remaining in the free tier (never negative). */
export function creditsRemaining(tool) {
  return Math.max(0, tool.freeTier.limit - tool.freeTier.used);
}

/**
 * Safe daily spend so the free tier lasts until expiry.
 * Falls back to the full remaining balance when there is no expiry date.
 */
export function dailyBudget(tool, nowIso = new Date().toISOString()) {
  const remaining = creditsRemaining(tool);
  if (!tool.expiryDate) return remaining;
  const d = daysUntil(tool.expiryDate, nowIso);
  if (d <= 0) return 0;
  return remaining / d;
}

/** Tools ordered by urgency: expired first, then expiring soon, then by usage. */
export function sortByUrgency(tools, nowIso = new Date().toISOString()) {
  const rank = { 'expired': 0, 'expiring-soon': 1, 'active': 2, 'no-expiry': 3 };
  return [...tools].sort((a, b) => {
    const ra = rank[expiryStatus(a, nowIso)];
    const rb = rank[expiryStatus(b, nowIso)];
    if (ra !== rb) return ra - rb;
    return creditPercent(b) - creditPercent(a);
  });
}

/** Validate one tool entry. Returns a list of error strings (empty = valid). */
export function validateTool(tool) {
  if (!tool || typeof tool !== 'object' || Array.isArray(tool)) {
    return ['tool must be an object'];
  }
  const errors = [];
  if (!tool.name || typeof tool.name !== 'string') errors.push('name is required');
  if (!tool.url || typeof tool.url !== 'string') errors.push('url is required');
  const ft = tool.freeTier;
  if (!ft || typeof ft !== 'object') {
    errors.push('freeTier is required');
  } else {
    if (typeof ft.limit !== 'number' || Number.isNaN(ft.limit) || ft.limit < 0) {
      errors.push('freeTier.limit must be a non-negative number');
    }
    if (typeof ft.used !== 'number' || Number.isNaN(ft.used) || ft.used < 0) {
      errors.push('freeTier.used must be a non-negative number');
    }
    if (typeof ft.limit === 'number' && typeof ft.used === 'number' && ft.used > ft.limit) {
      errors.push('freeTier.used cannot exceed freeTier.limit');
    }
    if (!ft.unit || typeof ft.unit !== 'string') errors.push('freeTier.unit is required');
  }
  if (tool.expiryDate !== null && tool.expiryDate !== undefined &&
      Number.isNaN(new Date(tool.expiryDate).getTime())) {
    errors.push('expiryDate must be a valid ISO date or null');
  }
  return errors;
}
