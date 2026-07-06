CREATE TABLE IF NOT EXISTS outdoor_temp (
  datetime datetime NOT NULL,
  value decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO outdoor_temp (datetime, value)
SELECT timestamp, reading_value
FROM readings
WHERE reading_name = 'outdoor_temp';

DELETE FROM readings
WHERE reading_name = 'outdoor_temp';
