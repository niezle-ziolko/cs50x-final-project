DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  password TEXT,
  email TEXT,
  created_at TEXT NOT NULL,
  display INTEGER NOT NULL,
  seen INTEGER NOT NULL
);