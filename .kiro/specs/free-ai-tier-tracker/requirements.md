# Requirements — Free AI Tier Tracker

## Introduction

Builders who rely on free AI tiers juggle many providers at once: API credits here,
daily request caps there, trial credits expiring on different dates. This project is a
single dashboard that tracks every free AI tool, its limits, usage and expiry dates —
so nothing valuable silently expires.

Built for the Kiro University Challenge, the project demonstrates all seven Kiro
lessons: spec-driven development, steering, hooks, property-based testing, powers,
MCP and custom agents.

## Glossary

- **Tool**: one free AI offering (e.g. an LLM inference API with a free tier).
- **Free tier**: the provider's no-cost allowance, described by a limit, a unit and a reset period.
- **Expiry date**: the calendar date on which a one-time credit grant becomes worthless (null when the tier has no expiry).
- **Urgency**: display order — expired first, then expiring soon, then active, then no-expiry.

## Requirements

### Requirement 1: Tool catalogue

**User Story:** As a builder, I want one list of every free AI tool I use, so that I stop
losing track of what is available to me.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL render one card per entry in
   `data/tools.json`, showing name, category, provider link and free-tier summary.
2. WHEN a tool entry is missing a name or URL THEN the system SHALL treat the entry as
   invalid and the data validator SHALL report it.

### Requirement 2: Credit usage display

**User Story:** As a builder, I want to see how much of each free tier I have burned
through, so that I can pace my usage.

#### Acceptance Criteria

1. WHEN a card renders THEN the system SHALL show a usage bar whose fill equals
   `used / limit` clamped to the range 0–100%.
2. WHEN `limit` is zero or missing THEN the system SHALL display 0% rather than failing.

### Requirement 3: Expiry awareness

**User Story:** As a builder, I want expiring credits surfaced first, so that I use them
before they vanish.

#### Acceptance Criteria

1. WHEN the dashboard renders THEN the system SHALL order tools by urgency: expired
   first, then expiring within 7 days, then active, then tools with no expiry date.
2. WHEN a credit grant expired in the past THEN the system SHALL label the card
   "Expired" and show how many days ago it expired.
3. WHEN a credit grant expires within 7 days THEN the system SHALL label the card
   "Expiring soon".

### Requirement 4: Safe daily budget

**User Story:** As a builder, I want a suggested daily spend per tool, so that my free
credits last until their expiry date.

#### Acceptance Criteria

1. WHEN a tool has an expiry date in the future THEN the system SHALL display
   `remaining credits / days left`, rounded for display.
2. WHEN a tool has no expiry date THEN the system SHALL display the full remaining
   balance as the budget.
3. WHEN the budget is displayed THEN it SHALL never be negative.

### Requirement 5: Search and filter

**User Story:** As a builder with many tools, I want to search and filter the list, so
that I can find a specific provider quickly.

#### Acceptance Criteria

1. WHEN the user types in the search box THEN the system SHALL show only tools whose
   name or category matches the query (case-insensitive).
2. WHEN the user picks a status filter THEN the system SHALL show only tools with that
   expiry status.

### Requirement 6: Data integrity

**User Story:** As the maintainer, I want invalid tool data to be caught automatically,
so that the dashboard never renders garbage.

#### Acceptance Criteria

1. WHEN `data/tools.json` is saved THEN the validate-data hook SHALL run and report
   every entry violating the schema.
2. WHEN any entry has `used` greater than `limit` THEN the validator SHALL fail.
3. WHEN any entry has an unparsable `expiryDate` THEN the validator SHALL fail.
