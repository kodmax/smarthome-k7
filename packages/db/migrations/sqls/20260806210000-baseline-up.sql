-- PostgreSQL baseline: final schema for the apollo database.

CREATE TABLE readings (
  timestamp timestamptz NOT NULL DEFAULT now(),
  reading_name varchar(64) NOT NULL,
  reading_value double precision NOT NULL,
  PRIMARY KEY (reading_name, timestamp)
);

CREATE TABLE meta (
  item_uid varchar(64) NOT NULL,
  attribute_name varchar(64) NOT NULL,
  group_id varchar(64) NOT NULL,
  last_update_timestamp timestamptz NOT NULL DEFAULT now(),
  value jsonb NOT NULL,
  PRIMARY KEY (item_uid, attribute_name)
);

CREATE INDEX idx_meta_group_id_last_update_timestamp
  ON meta (group_id, last_update_timestamp);

CREATE INDEX idx_meta_last_update_timestamp
  ON meta (last_update_timestamp);

CREATE TABLE job_ads (
  id varchar(64) NOT NULL PRIMARY KEY,
  added_at timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  data jsonb NOT NULL
);

CREATE INDEX idx_job_ads_last_seen ON job_ads (last_seen);

CREATE TABLE documents (
  scope varchar(64) NOT NULL,
  id varchar(64) NOT NULL,
  hash varchar(64) NOT NULL,
  source_hash varchar(64),
  modified_at timestamptz NOT NULL DEFAULT now(),
  content jsonb NOT NULL,
  PRIMARY KEY (scope, id)
);

CREATE INDEX idx_documents_hash ON documents (hash);

CREATE TABLE preferences (
  scope varchar(64) NOT NULL,
  preference_key varchar(64) NOT NULL,
  value jsonb NOT NULL,
  PRIMARY KEY (scope, preference_key)
);

CREATE TABLE my_skills (
  skill_id varchar(64) NOT NULL PRIMARY KEY,
  skill_name varchar(128) NOT NULL,
  experience_level varchar(32) NOT NULL,
  comment text
);

CREATE TABLE job_market_insight_snapshots (
  snapshot_at timestamptz NOT NULL PRIMARY KEY,
  metrics jsonb NOT NULL
);

CREATE INDEX idx_job_market_insight_snapshots_at
  ON job_market_insight_snapshots (snapshot_at);

CREATE TABLE energy_rates (
  operator varchar(32) NOT NULL,
  effective_from date NOT NULL,
  added double precision NOT NULL,
  distribution double precision NOT NULL,
  energy double precision NOT NULL,
  vat double precision NOT NULL,
  PRIMARY KEY (operator, effective_from)
);

INSERT INTO energy_rates (operator, effective_from, added, distribution, energy, vat)
VALUES
  ('EON', '2026-01-01', 206.46 / 6, 0.2619, 0.505, 1.23),
  ('EON', '2026-02-01', 56.29, 0.2777, 0.505, 1.23);
