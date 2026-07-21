export default class DateTime {
  static readonly SECOND = 1
  static readonly MINUTE = 60
  static readonly HOUR = 3600
  static readonly DAY = 86400

  private readonly datetime: string
  private readonly timestamp: number

  static shift(shift = 0, unit = DateTime.HOUR) {
    return new DateTime(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + shift * unit * 1000)
  }

  static now() {
    return new DateTime(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
  }

  constructor(timestamp: number) {
    this.timestamp = timestamp
    this.datetime = new Date(this.timestamp).toISOString()
  }

  shifted(shift = 0, unit = DateTime.HOUR): DateTime {
    return new DateTime(this.timestamp + shift * unit * 1000)
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
