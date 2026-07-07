CREATE TABLE IF NOT EXISTS meta (
  item_uid varchar(64) NOT NULL,
  attribute_name varchar(64) NOT NULL,
  last_update_timestamp timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  value json NOT NULL,
  PRIMARY KEY (item_uid, attribute_name),
  KEY idx_meta_last_update_timestamp (last_update_timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
