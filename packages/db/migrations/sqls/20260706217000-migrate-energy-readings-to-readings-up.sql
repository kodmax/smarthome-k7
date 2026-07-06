INSERT INTO readings (timestamp, reading_name, reading_value)
SELECT datetime, 'meter_total', hour_start_reading
FROM energy_readings;

DROP TABLE energy_readings;
