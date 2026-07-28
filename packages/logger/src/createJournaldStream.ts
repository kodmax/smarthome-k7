import type { DestinationStream } from 'pino'
import { pinoLevelToJournaldPriority } from './pinoLevelToJournaldPriority'

export function createJournaldStream(destination: DestinationStream): DestinationStream {
  return {
    write(chunk: string | Buffer) {
      const line = typeof chunk === 'string' ? chunk : chunk.toString()
      const trimmed = line.endsWith('\n') ? line.slice(0, -1) : line
      if (trimmed.length === 0) {
        return
      }

      const entry = JSON.parse(trimmed) as { level: number }
      const priority = pinoLevelToJournaldPriority(entry.level)
      destination.write(`<${priority}>${line}`)
    },
  }
}
