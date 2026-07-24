CREATE TABLE IF NOT EXISTS preferences (
  scope           varchar(64) NOT NULL,
  preference_key  varchar(64) NOT NULL,
  value           json        NOT NULL,
  PRIMARY KEY (scope, preference_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
