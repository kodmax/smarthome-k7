CREATE TABLE IF NOT EXISTS indoor_readings (
  timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reading_name varchar(64) NOT NULL,
  reading_value float NOT NULL,
  PRIMARY KEY (reading_name, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS hourly_energy_readings (
  hour time NOT NULL,
  datetime datetime NOT NULL,
  hour_start_reading int(11) NOT NULL,
  hourly_consumption int(11) DEFAULT NULL,
  PRIMARY KEY (datetime) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS daily_energy_readings (
  date date NOT NULL,
  total_reading int(11) NOT NULL,
  daily_consumption int(11) NOT NULL,
  UNIQUE KEY date_UNIQUE (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS outdoor_temp (
  datetime datetime NOT NULL,
  value decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS pressure (
  pressure smallint(6) NOT NULL,
  datetime datetime NOT NULL,
  PRIMARY KEY (datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
