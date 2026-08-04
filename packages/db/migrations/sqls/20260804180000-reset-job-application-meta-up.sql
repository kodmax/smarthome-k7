UPDATE meta
SET value = JSON_OBJECT(
  'applyStatus', 'pending-review',
  'archiveReason', NULL,
  'comment', NULL,
  'appliedAt', JSON_EXTRACT(value, '$.appliedAt'),
  'rejectedAt', JSON_EXTRACT(value, '$.rejectedAt')
)
WHERE attribute_name = 'application';
