const YEAR_PATTERN = /(19|20)\d{2}/

export const unifyTitle = (name: string): string => {
  const withSpaces = name.replace(/\./g, ' ')
  const match = withSpaces.match(YEAR_PATTERN)

  if (!match || match.index === undefined) {
    return withSpaces.trim().replace(/\s+/g, ' ')
  }

  const titlePart = withSpaces
    .slice(0, match.index)
    .trim()
    .replace(/\s*\(\s*$/, '')
    .trim()
    .replace(/\s+/g, ' ')

  return `${titlePart} (${match[0]})`
}

export const compareTitle = (name: string): string =>
  unifyTitle(name)
    .toLowerCase()
    .replace(/\s+\(((?:19|20)\d{2})\)$/, ' $1')
    .trim()
