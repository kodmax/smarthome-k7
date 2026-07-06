CREATE TABLE IF NOT EXISTS energy_readings (
  datetime datetime NOT NULL,
  hour_start_reading int(11) NOT NULL,
  hourly_consumption int(11) DEFAULT NULL,
  PRIMARY KEY (datetime) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO energy_readings (datetime, hour_start_reading, hourly_consumption)
SELECT
  curr.timestamp,
  curr.reading_value,
  next.reading_value - curr.reading_value
FROM readings curr
LEFT JOIN readings next ON next.reading_name = 'meter_total'
  AND next.timestamp = (
    SELECT MIN(timestamp)
    FROM readings
    WHERE reading_name = 'meter_total'
      AND timestamp > curr.timestamp
  )
WHERE curr.reading_name = 'meter_total';

DELETE FROM readings
WHERE reading_name = 'meter_total';
