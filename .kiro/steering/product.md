# Product — Free AI Tier Tracker

## What it is

A single dashboard that tracks every free AI tool a builder relies on: credit limits,
usage, reset periods and expiry dates. Goal: never let free value silently expire.

## Who it serves

Builders and creators (like the maintainer) who stack free tiers across many AI
providers and need one glanceable source of truth.

## Key behaviours

- Tools are ordered by urgency — expiring credits surface first.
- Every number shown (usage %, daily budget, days left) is derived from pure
  functions in `src/tracker.js`; the UI never computes business logic inline.
- `data/tools.json` is the only data source; it is schema-validated on every save.
- Sample data ships with the repo. Real provider terms change often — verify before
  relying on any figure shown.

## Non-goals

- No backend, no accounts, no server-side storage.
- No automatic usage syncing with providers (manual `used` updates for now).
