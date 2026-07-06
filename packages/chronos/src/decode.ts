export function decode(item: string, min: number, max: number, names: Record<string, number> = {}): number[] {
  const values = []

  for (const [range, step] of item.split(',').map(item => item.split('/'))) {
    const [from, to] = range === '*' ? [min, max] : range.split('-').map(value => names[value] ?? +value)

    const f = +from
    if (isNaN(f) || f < min || f > max) {
      throw new Error('Cron invalid from: ' + item)
    }

    if (to === undefined && step === undefined) {
      values.push(from)
      continue
    }

    const t = +(to ?? max)
    if (isNaN(t) || t < min || t > max) {
      throw new Error('Cron invalid to: ' + item)
    }

    const s = +(step ?? 1)
    if (isNaN(s) || s < 1 || s > max) {
      throw new Error('Cron invalid step: ' + item)
    }

    const m = max - min + 1
    const e = t > f ? t : t + m
    for (let i = f; i <= e; i += s) {
      values.push(((i - min) % m) + min)
    }
  }

  return values
}
