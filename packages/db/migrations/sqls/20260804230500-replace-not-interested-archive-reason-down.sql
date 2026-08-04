UPDATE meta
SET value = JSON_SET(value, '$.archiveReason', 'not-interested')
WHERE attribute_name = 'application'
  AND JSON_UNQUOTE(JSON_EXTRACT(value, '$.archiveReason')) = 'other';
