export const toIsoDate = (value: string): string => {
  const normalized = value.endsWith('Z') ? value : `${value}Z`

  return new Date(normalized).toISOString()
}
