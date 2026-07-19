INSERT INTO meta (item_uid, attribute_name, value)
SELECT
  applied_meta.item_uid,
  'application',
  JSON_OBJECT(
    'applyStatus', 'applied',
    'comment', NULL,
    'appliedAt', CONCAT(
      DATE_FORMAT(
        CONVERT_TZ(applied_meta.last_update_timestamp, @@session.time_zone, '+00:00'),
        '%Y-%m-%dT%H:%i:%s'
      ),
      '.000Z'
    )
  )
FROM meta AS applied_meta
WHERE applied_meta.attribute_name = 'applied'
  AND NOT EXISTS (
    SELECT 1
    FROM meta AS app_meta
    WHERE app_meta.item_uid = applied_meta.item_uid
      AND app_meta.attribute_name = 'application'
  );

DELETE FROM meta WHERE attribute_name = 'applied';
