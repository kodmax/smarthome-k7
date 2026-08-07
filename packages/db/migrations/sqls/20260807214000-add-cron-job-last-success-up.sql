CREATE TABLE cron_job_last_success (
  namespace varchar(64) NOT NULL,
  job_id varchar(64) NOT NULL,
  last_successful_occurrence timestamptz NOT NULL,
  PRIMARY KEY (namespace, job_id)
);
