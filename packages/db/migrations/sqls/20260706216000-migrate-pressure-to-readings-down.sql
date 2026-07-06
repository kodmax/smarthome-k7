CREATE TABLE IF NOT EXISTS pressure (
  pressure smallint(6) NOT NULL,
  datetime datetime NOT NULL,
  PRIMARY KEY (datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO pressure (datetime, pressure)
SELECT timestamp, reading_value
FROM readings
WHERE reading_name = 'air_pressure';

DELETE FROM readings
WHERE reading_name = 'air_pressure';
