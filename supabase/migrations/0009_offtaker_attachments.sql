-- =====================================================================
-- 0009 — Offtaker attachments (Annexure A documents)
-- =====================================================================
-- Stores metadata for files uploaded via the offtaker submission form.
-- Actual file bytes live in Supabase Storage (bucket: offtaker-attachments).
-- One row per file. Many files per submission.
-- =====================================================================

CREATE TABLE IF NOT EXISTS offtaker_attachments (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  submission_id            UUID NOT NULL REFERENCES offtaker_submissions(id) ON DELETE CASCADE,

  -- Which Annexure A row this file belongs to
  annexure_section         TEXT NOT NULL,        -- e.g. 'A.1', 'A.2', ... 'A.7'
  annexure_item            TEXT NOT NULL,        -- e.g. 'Company registration certificate (CIPC)'
  annexure_item_index      INT,                  -- ordinal within the section (0-based)

  -- File metadata
  original_filename        TEXT NOT NULL,
  storage_path             TEXT NOT NULL,        -- path inside the bucket
  mime_type                TEXT NOT NULL,
  size_bytes               INT NOT NULL,

  -- Audit
  uploaded_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by_user_id      UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Optional moderation (reviewer can flag missing/incorrect docs)
  reviewed                 BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_at              TIMESTAMPTZ,
  reviewer_user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  review_note              TEXT
);

CREATE INDEX IF NOT EXISTS idx_offtaker_attachments_submission ON offtaker_attachments(submission_id);
CREATE INDEX IF NOT EXISTS idx_offtaker_attachments_tenant     ON offtaker_attachments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offtaker_attachments_section    ON offtaker_attachments(annexure_section);

-- =====================================================================
-- Row-Level Security (tenant isolation)
-- =====================================================================
ALTER TABLE offtaker_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY offtaker_attachments_isolation
  ON offtaker_attachments
  USING (tenant_id::text = current_setting('app.tenant_id', true));

-- =====================================================================
-- Convenience view: file count + total bytes per submission
-- =====================================================================
CREATE OR REPLACE VIEW offtaker_attachment_counts AS
SELECT
  submission_id,
  tenant_id,
  COUNT(*)::int               AS file_count,
  SUM(size_bytes)::bigint      AS total_bytes,
  COUNT(DISTINCT annexure_section)::int AS sections_covered,
  MAX(uploaded_at)             AS last_upload_at
FROM offtaker_attachments
GROUP BY submission_id, tenant_id;

-- =====================================================================
-- ONE-TIME SETUP (run separately in Supabase Studio):
-- 1. Storage > Create new bucket
--      Name:           offtaker-attachments
--      Public:         NO (private - signed URLs only)
--      File size limit: 20 MB
--      Allowed MIME:    application/pdf, image/*, application/msword,
--                       application/vnd.openxmlformats-officedocument.*
-- 2. Bucket policies (Storage > Policies):
--      Service role: full access
--      Anon: no access
-- =====================================================================
