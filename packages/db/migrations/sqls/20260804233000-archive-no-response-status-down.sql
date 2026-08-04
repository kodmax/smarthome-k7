UPDATE meta
SET value = JSON_SET(
  JSON_REMOVE(value, '$.archiveReason'),
  '$.applyStatus', 'no-response'
)
WHERE attribute_name = 'application'
  AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.applyStatus')) = 'archived'
  AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.archiveReason')) = 'no-response';
