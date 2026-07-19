INSERT INTO meta (item_uid, attribute_name, value, last_update_timestamp)
SELECT
  item_uid,
  'applied',
  CAST('true' AS JSON),
  COALESCE(
    STR_TO_DATE(
      REPLACE(JSON_UNQUOTE(JSON_EXTRACT(value, '$.appliedAt')), 'Z', ''),
      '%Y-%m-%dT%H:%i:%s'
    ),
    last_update_timestamp
  )
FROM meta
WHERE attribute_name = 'application'
  AND JSON_EXTRACT(value, '$.appliedAt') IS NOT NULL;

DELETE FROM meta WHERE attribute_name = 'application';
