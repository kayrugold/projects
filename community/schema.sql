PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS members (id TEXT PRIMARY KEY, public_key TEXT NOT NULL, created INTEGER NOT NULL, banned INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS entries (id TEXT PRIMARY KEY, kind TEXT NOT NULL, parent TEXT REFERENCES entries(id), project TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, author TEXT NOT NULL REFERENCES members(id), created INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'open', hidden INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS entries_feed ON entries(kind, parent, created DESC);
CREATE TABLE IF NOT EXISTS nonces (id TEXT PRIMARY KEY, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS flags (entry TEXT NOT NULL REFERENCES entries(id), author TEXT NOT NULL REFERENCES members(id), created INTEGER NOT NULL, PRIMARY KEY(entry,author));

CREATE INDEX IF NOT EXISTS entries_parent ON entries(parent,created);
CREATE TABLE IF NOT EXISTS entry_controls (entry TEXT PRIMARY KEY REFERENCES entries(id), pinned INTEGER NOT NULL DEFAULT 0, highlighted INTEGER NOT NULL DEFAULT 0, locked INTEGER NOT NULL DEFAULT 0, deleted INTEGER NOT NULL DEFAULT 0);
CREATE VIEW IF NOT EXISTS community_entries AS SELECT e.*, COALESCE(c.pinned,0) AS pinned, COALESCE(c.highlighted,0) AS highlighted, COALESCE(c.locked,0) AS locked, COALESCE(c.deleted,0) AS deleted FROM entries e LEFT JOIN entry_controls c ON c.entry=e.id;
