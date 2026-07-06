INSERT INTO readings (timestamp, reading_name, reading_value)
SELECT datetime, 'outdoor_temp', value
FROM outdoor_temp;

DROP TABLE outdoor_temp;
