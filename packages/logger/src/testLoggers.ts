import pino from 'pino'

export function createSilentLogger(): pino.Logger {
  return pino({ level: 'silent' })
}

export function createCaptureLogger(): { logger: pino.Logger; getMessages: () => string[] } {
  const messages: string[] = []
  const logger = pino(
    { level: 'debug' },
    {
      write(chunk: string) {
        messages.push(JSON.parse(chunk).msg as string)
      },
    },
  )

  return {
    logger,
    getMessages: () => messages,
  }
}
