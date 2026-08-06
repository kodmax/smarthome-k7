CREATE TABLE IF NOT EXISTS job_ads (
  id         varchar(64)  NOT NULL,
  added_at   timestamp    NOT NULL DEFAULT current_timestamp(),
  last_seen  timestamp    NOT NULL DEFAULT current_timestamp(),
  data       json         NOT NULL,
  PRIMARY KEY (id),
  KEY idx_job_ads_last_seen (last_seen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
