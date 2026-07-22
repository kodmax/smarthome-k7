CREATE TABLE IF NOT EXISTS my_skills (
  skill_id         varchar(64)  NOT NULL,
  skill_name       varchar(128) NOT NULL,
  experience_level varchar(32)  NOT NULL,
  comment          text         NULL,
  PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
