UPDATE meta
SET group_id = 'job-ads'
WHERE group_id = 'jobs';

UPDATE preferences
SET scope = 'job-ads'
WHERE scope = 'jobs';
