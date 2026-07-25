CREATE TABLE IF NOT EXISTS documents (
  scope       varchar(64) NOT NULL,
  id          varchar(64) NOT NULL,
  hash        varchar(64) NOT NULL,
  modified_at timestamp   NOT NULL DEFAULT current_timestamp()
              ON UPDATE current_timestamp(),
  content     json        NOT NULL,
  PRIMARY KEY (scope, id),
  KEY idx_documents_hash (hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
