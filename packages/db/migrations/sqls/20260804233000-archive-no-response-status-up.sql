UPDATE meta
SET value = JSON_SET(
  JSON_REMOVE(value, '$.comment'),
  '$.applyStatus', 'archived',
  '$.archiveReason', 'no-response'
)
WHERE attribute_name = 'application'
  AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.applyStatus')) = 'no-response';
