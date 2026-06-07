import { CacheAgeUnit } from 'apollo-ws'

export default class DateTime {
  private readonly datetime: string

  public constructor(shift = 0, unit: CacheAgeUnit = CacheAgeUnit.HOURS) {
    this.datetime = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000 + shift * unit * 1000,
    ).toISOString()
  }

  getDate(): string {
    return this.datetime.substring(0, 10)
  }

  getTime(): string {
    return this.datetime.substring(11, 19)
  }

  getDateTime(): string {
    return `${this.getDate()}T${this.getTime()}`
  }
}
