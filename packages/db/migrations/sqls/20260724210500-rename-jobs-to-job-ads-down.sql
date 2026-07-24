UPDATE meta
SET group_id = 'jobs'
WHERE group_id = 'job-ads';

UPDATE preferences
SET scope = 'jobs'
WHERE scope = 'job-ads';
