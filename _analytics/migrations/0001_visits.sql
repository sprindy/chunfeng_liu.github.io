CREATE TABLE page_views (
  id TEXT PRIMARY KEY,
  visitor TEXT NOT NULL,
  session TEXT NOT NULL,
  path TEXT NOT NULL,
  started INTEGER NOT NULL,
  active_ms INTEGER NOT NULL DEFAULT 0,
  ip TEXT NOT NULL,
  asn INTEGER,
  network TEXT
);
CREATE INDEX page_views_started ON page_views(started);

CREATE TABLE login_attempts (
  key TEXT PRIMARY KEY,
  bucket INTEGER NOT NULL,
  attempts INTEGER NOT NULL
);
