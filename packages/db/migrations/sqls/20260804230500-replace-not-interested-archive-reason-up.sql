UPDATE meta
SET value = JSON_SET(value, '$.archiveReason', 'other')
WHERE attribute_name = 'application'
  AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.archiveReason')) = 'not-interested';
