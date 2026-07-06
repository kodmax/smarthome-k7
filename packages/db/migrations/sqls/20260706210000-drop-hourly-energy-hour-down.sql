ALTER TABLE hourly_energy_readings ADD COLUMN hour time NOT NULL DEFAULT '00:00:00';
UPDATE hourly_energy_readings SET hour = TIME(datetime);
