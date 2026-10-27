-- PostgreSQL schema (3NF) for the Full Stack Web Development course
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student',   -- student | instructor | admin
  bio           TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id  TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, module_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id  TEXT NOT NULL,
  quiz_id    TEXT NOT NULL,
  score      INTEGER NOT NULL,                      -- 0..100
  passed     BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

CREATE TABLE IF NOT EXISTS notes (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id  TEXT NOT NULL,
  body       TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, module_id)
);

CREATE TABLE IF NOT EXISTS highlights (
  id        SERIAL PRIMARY KEY,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  text      TEXT NOT NULL
);

-- Per-learner extras that do not deserve their own table: language choice, solved challenges, best checkpoint scores
CREATE TABLE IF NOT EXISTS learner_data (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data       TEXT NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS forum_posts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id  TEXT NOT NULL DEFAULT 'general',
  parent_id  INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
  title      TEXT,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_parent ON forum_posts(parent_id);
