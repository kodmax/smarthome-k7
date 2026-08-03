CREATE TABLE IF NOT EXISTS energy_rates (
  operator       varchar(32)  NOT NULL,
  effective_from date         NOT NULL,
  added          double       NOT NULL,
  distribution   double       NOT NULL,
  energy         double       NOT NULL,
  vat            double       NOT NULL,
  PRIMARY KEY (operator, effective_from)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO energy_rates (operator, effective_from, added, distribution, energy, vat)
VALUES
  ('EON', '2026-01-01', 206.46 / 6, 0.2619, 0.505, 1.23),
  ('EON', '2026-02-01', 56.29, 0.2777, 0.505, 1.23);
