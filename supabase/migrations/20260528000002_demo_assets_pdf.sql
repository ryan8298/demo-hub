-- =============================================================================
--  Allow PDF uploads in the demo-assets bucket (architecture diagrams)
--
--  Run via the Supabase SQL editor. Idempotent.
-- =============================================================================

UPDATE storage.buckets
SET
  allowed_mime_types = ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf'
  ],
  file_size_limit = 10485760  -- 10 MB (PDFs can exceed the previous 5 MB)
WHERE id = 'demo-assets';
