type EasternParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const getNthWeekdayOfMonth = (year: number, month: number, weekday: number, n: number): number => {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay()

  return 1 + ((weekday - firstWeekday + 7) % 7) + (n - 1) * 7
}

const isEasternDaylightTime = ({ year, month, day, hour, minute, second }: EasternParts): boolean => {
  const dstStartDay = getNthWeekdayOfMonth(year, 2, 0, 2)
  const dstEndDay = getNthWeekdayOfMonth(year, 10, 0, 1)
  const time = hour * 3600 + minute * 60 + second

  if (month < 2 || month > 10) {
    return false
  }

  if (month > 2 && month < 10) {
    return true
  }

  if (month === 2) {
    return day > dstStartDay || (day === dstStartDay && time >= 2 * 3600)
  }

  return day < dstEndDay || (day === dstEndDay && time < 2 * 3600)
}

export const toEasternTimestamp = (parts: EasternParts): number => {
  const offsetMinutes = isEasternDaylightTime(parts) ? -240 : -300

  return (
    Date.UTC(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second) - offsetMinutes * 60 * 1000
  )
}

const getEasternDateParts = (timestamp: number): EasternParts => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(new Date(timestamp))

  const get = (type: Intl.DateTimeFormatPartTypes): number => +parts.find(part => part.type === type)!.value

  return {
    year: get('year'),
    month: get('month') - 1,
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  }
}

export const getTradeDayStartET = (timestamp: number): number => {
  const { year, month, day } = getEasternDateParts(timestamp)

  return toEasternTimestamp({ year, month, day, hour: 0, minute: 0, second: 0 })
}

export const getOpeningTimeOfDayOffset = (openingTime: number): number => openingTime - getTradeDayStartET(openingTime)
