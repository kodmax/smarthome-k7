CREATE TABLE IF NOT EXISTS job_market_insight_snapshots (
  snapshot_at datetime NOT NULL,
  metrics json NOT NULL,
  ads_count int NOT NULL,
  PRIMARY KEY (snapshot_at),
  KEY idx_job_market_insight_snapshots_at (snapshot_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
