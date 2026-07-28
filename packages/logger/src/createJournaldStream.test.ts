import { describe, expect, it } from 'vitest'
import { createJournaldStream } from './createJournaldStream'

describe('createJournaldStream', () => {
  it('prepends syslog priority without altering JSON payload', () => {
    const lines: string[] = []
    const stream = createJournaldStream({
      write(chunk: string) {
        lines.push(chunk)
      },
    })

    stream.write('{"level":40,"time":1,"msg":"warn"}\n')

    expect(lines).toEqual(['<4>{"level":40,"time":1,"msg":"warn"}\n'])
  })
})
