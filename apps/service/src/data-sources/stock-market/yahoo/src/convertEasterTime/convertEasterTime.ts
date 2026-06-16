const easterTimeRe = /([1-2]?[0-9]):([0-5][0-9]):([0-5][0-9]) (AM|PM) (EST|EDT)/

const easterOffset: Record<string, number> = {
  EST: -5,
  EDT: -4,
}

export const convertEasterTime = (easternTime: string, targetTimezoneOffset: number): string => {
  const match = easterTimeRe.exec(easternTime)
  if (match === null) {
    return easternTime
  }

  const [, hh, nn, ss, m, tz] = match
  const diff = targetTimezoneOffset - easterOffset[tz]
  const targetHh = (+hh + diff + (m === 'PM' ? 12 : 0)) % 24

  return `${targetHh.toString().padStart(2, '0')}:${nn}:${ss}`
}
