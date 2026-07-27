import pino from 'pino'

export function createSilentLogger(): pino.Logger {
  return pino({ level: 'silent' })
}

export function createCaptureLogger(): {
  logger: pino.Logger
  getMessages: () => string[]
  getEntries: () => Record<string, unknown>[]
} {
  const messages: string[] = []
  const entries: Record<string, unknown>[] = []
  const logger = pino(
    { level: 'debug' },
    {
      write(chunk: string) {
        const entry = JSON.parse(chunk) as Record<string, unknown>
        entries.push(entry)
        messages.push(entry.msg as string)
      },
    },
  )

  return {
    logger,
    getMessages: () => messages,
    getEntries: () => entries,
  }
}
