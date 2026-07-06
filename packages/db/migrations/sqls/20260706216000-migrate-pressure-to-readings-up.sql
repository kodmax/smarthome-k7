INSERT INTO readings (timestamp, reading_name, reading_value)
SELECT datetime, 'air_pressure', pressure
FROM pressure;

DROP TABLE pressure;
