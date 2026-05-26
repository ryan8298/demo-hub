-- Add industry column to demos table
-- Run this in Supabase SQL Editor

ALTER TABLE demos
ADD COLUMN industry TEXT;

-- Add index for industry filtering (optional, improves query performance)
CREATE INDEX idx_demos_industry ON demos(industry);
