ALTER TABLE meta
  ADD COLUMN group_id varchar(64) NULL AFTER attribute_name;

UPDATE meta
SET group_id = 'news'
WHERE attribute_name = 'read';

UPDATE meta
SET group_id = 'jobs'
WHERE attribute_name IN ('application', 'fav', 'applied', 'hide');

DELETE FROM meta
WHERE group_id IS NULL;

ALTER TABLE meta
  MODIFY group_id varchar(64) NOT NULL;

CREATE INDEX idx_meta_group_id_last_update_timestamp ON meta (group_id, last_update_timestamp);
