ALTER TABLE job_market_insight_snapshots ADD COLUMN ads_count int NOT NULL DEFAULT 0 AFTER metrics;

UPDATE job_market_insight_snapshots
SET ads_count = CAST(JSON_UNQUOTE(JSON_EXTRACT(metrics, '$.adsCount')) AS UNSIGNED);
