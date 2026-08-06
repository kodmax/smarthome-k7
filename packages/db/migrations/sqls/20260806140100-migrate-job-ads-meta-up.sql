-- Merge job-ads meta rows into job_ads documents, then remove source meta rows.

UPDATE job_ads ja
INNER JOIN meta m ON ja.id = m.item_uid AND m.group_id = 'job-ads' AND m.attribute_name = 'application'
SET ja.data = JSON_SET(
  ja.data,
  '$.meta.application', JSON_SET(
    m.value,
    '$.statusChangedAt',
    DATE_FORMAT(m.last_update_timestamp, '%Y-%m-%dT%H:%i:%s.000Z')
  )
);

UPDATE job_ads ja
INNER JOIN meta m ON ja.id = m.item_uid AND m.group_id = 'job-ads' AND m.attribute_name = 'fav'
SET ja.data = JSON_SET(ja.data, '$.meta.fav', true);

UPDATE job_ads ja
INNER JOIN meta m ON ja.id = m.item_uid AND m.group_id = 'job-ads' AND m.attribute_name = 'first-published-at'
SET ja.data = JSON_SET(ja.data, '$.meta.firstPublishedAt', JSON_UNQUOTE(m.value));

INSERT INTO job_ads (id, added_at, last_seen, data)
SELECT
  uid.item_uid,
  uid.added_at,
  uid.last_seen,
  JSON_OBJECT(
    'content', JSON_OBJECT(
      'id', uid.item_uid,
      'title', '',
      'advertUrl', COALESCE(uid.ad_url, ''),
      'companyLogoUrl', '',
      'companyName', '',
      'requiredSkills', JSON_ARRAY(),
      'workplaceType', 'office',
      'employmentType', 'b2b',
      'origin', 'jj',
      'publishedAt', COALESCE(uid.first_published_at, '1970-01-01T00:00:00.000Z')
    ),
    'meta', JSON_OBJECT(
      'application', JSON_SET(
        COALESCE(
          uid.application,
          JSON_OBJECT(
            'applyStatus', 'pending-review',
            'archiveReason', NULL,
            'comment', NULL,
            'appliedAt', NULL,
            'rejectedAt', NULL,
            'statusChangedAt', NULL
          )
        ),
        '$.statusChangedAt', uid.application_status_changed_at
      ),
      'fav', IF(uid.fav = 1, true, false),
      'firstPublishedAt', COALESCE(uid.first_published_at, '1970-01-01T00:00:00.000Z')
    )
  )
FROM (
  SELECT
    m.item_uid,
    MIN(m.last_update_timestamp) AS added_at,
    MAX(m.last_update_timestamp) AS last_seen,
    MAX(CASE WHEN m.attribute_name = 'ad-url' THEN JSON_UNQUOTE(m.value) END) AS ad_url,
    MAX(CASE WHEN m.attribute_name = 'first-published-at' THEN JSON_UNQUOTE(m.value) END) AS first_published_at,
    MAX(CASE WHEN m.attribute_name = 'application' THEN m.value END) AS application,
    MAX(
      CASE
        WHEN m.attribute_name = 'application' THEN DATE_FORMAT(m.last_update_timestamp, '%Y-%m-%dT%H:%i:%s.000Z')
      END
    ) AS application_status_changed_at,
    MAX(CASE WHEN m.attribute_name = 'fav' AND JSON_EXTRACT(m.value, '$') = true THEN 1 ELSE 0 END) AS fav
  FROM meta m
  WHERE m.group_id = 'job-ads'
  GROUP BY m.item_uid
) uid
WHERE uid.item_uid NOT IN (SELECT id FROM job_ads);

DELETE FROM meta WHERE group_id = 'job-ads';
