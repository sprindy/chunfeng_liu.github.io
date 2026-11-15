CREATE TABLE IF NOT EXISTS post_likes (
  path TEXT NOT NULL,
  reader TEXT NOT NULL,
  PRIMARY KEY (path, reader)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  created INTEGER NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS post_comments_public ON post_comments(path, approved, created);
CREATE INDEX IF NOT EXISTS post_comments_pending ON post_comments(approved, created);
