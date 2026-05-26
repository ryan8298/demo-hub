-- Adds the industry column used to badge demos in the customer/Microsoft hubs.
-- Idempotent — safe to re-run.

ALTER TABLE demos
  ADD COLUMN IF NOT EXISTS industry TEXT;

CREATE INDEX IF NOT EXISTS idx_demos_industry ON demos(industry);
