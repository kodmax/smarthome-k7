const PINO_LEVEL_TO_JOURNALD_PRIORITY: Record<number, number> = {
  10: 7, // trace -> debug
  20: 7, // debug -> debug
  30: 6, // info -> info
  40: 4, // warn -> warning
  50: 3, // error -> err
  60: 2, // fatal -> crit
}

export function pinoLevelToJournaldPriority(pinoLevel: number): number {
  return PINO_LEVEL_TO_JOURNALD_PRIORITY[pinoLevel] ?? 6
}
