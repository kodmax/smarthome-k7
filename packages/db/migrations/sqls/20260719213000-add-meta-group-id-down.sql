DROP INDEX idx_meta_group_id_last_update_timestamp ON meta;

ALTER TABLE meta
  DROP COLUMN group_id;
