export function isJournaldLoggingEnabled(): boolean {
  const value = process.env['LOG_JOURNALD']
  return value === '1' || value === 'true'
}
