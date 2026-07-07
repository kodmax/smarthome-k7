const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

const RAW_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/
const DISPLAY_RE = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2}) (AM|PM) ET$/
const TRADE_DATE_RE = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/

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

const toEasternTimestamp = (parts: EasternParts): number => {
  const offsetMinutes = isEasternDaylightTime(parts) ? -240 : -300

  return (
    Date.UTC(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second) - offsetMinutes * 60 * 1000
  )
}

const parse12Hour = (hour: number, meridiem: 'AM' | 'PM'): number => {
  if (meridiem === 'AM') {
    return hour === 12 ? 0 : hour
  }

  return hour === 12 ? 12 : hour + 12
}

const parseMonthDayYear = (monthLabel: string, day: number, year: number): EasternParts => {
  const month = MONTHS[monthLabel]
  if (month === undefined) {
    throw new Error(`Unsupported Nasdaq month label: ${monthLabel}`)
  }

  return { year, month, day, hour: 0, minute: 0, second: 0 }
}

export const parseNasdaqEasternRaw = (value: string): number => {
  const match = RAW_RE.exec(value)
  if (match === null) {
    throw new Error(`Invalid Nasdaq raw datetime: ${value}`)
  }

  const [, year, month, day, hour, minute, second] = match

  return toEasternTimestamp({
    year: +year,
    month: +month - 1,
    day: +day,
    hour: +hour,
    minute: +minute,
    second: +second,
  })
}

export const parseNasdaqEasternDisplay = (value: string): number => {
  const match = DISPLAY_RE.exec(value)
  if (match === null) {
    throw new Error(`Invalid Nasdaq display datetime: ${value}`)
  }

  const [, monthLabel, day, year, hour, minute, meridiem] = match
  const monthDayYear = parseMonthDayYear(monthLabel, +day, +year)

  return toEasternTimestamp({
    ...monthDayYear,
    hour: parse12Hour(+hour, meridiem as 'AM' | 'PM'),
    minute: +minute,
    second: 0,
  })
}

export const parseNasdaqTradeDate = (value: string): number => {
  const match = TRADE_DATE_RE.exec(value)
  if (match === null) {
    throw new Error(`Invalid Nasdaq trade date: ${value}`)
  }

  const [, monthLabel, day, year] = match

  return toEasternTimestamp(parseMonthDayYear(monthLabel, +day, +year))
}
