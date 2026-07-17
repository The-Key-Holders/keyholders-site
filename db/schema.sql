-- PSAP / Advisor path ops — Slice 1 closeout
-- Single-row JSONB snapshot (fast path; normalize tables in later slices)

CREATE TABLE IF NOT EXISTS ops_snapshot (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
