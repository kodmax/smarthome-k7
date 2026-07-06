CREATE TABLE IF NOT EXISTS daily_energy_readings (
  date date NOT NULL,
  total_reading int(11) NOT NULL,
  daily_consumption int(11) NOT NULL,
  UNIQUE KEY date_UNIQUE (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
