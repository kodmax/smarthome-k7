import { useCallback } from 'react'
import type { CommandPayloadRegistry } from '@repo/types'
import { sendCommand } from './sendCommand'

type CommandFn<P> = P extends void ? () => Promise<void> : (payload: P) => Promise<void>

export function useCommand<S extends keyof CommandPayloadRegistry, N extends keyof CommandPayloadRegistry[S]>(
  sourceId: S,
  name: N,
): CommandFn<CommandPayloadRegistry[S][N]> {
  return useCallback(
    ((payload?: CommandPayloadRegistry[S][N]) => {
      return sendCommand(sourceId, name, payload as CommandPayloadRegistry[S][N])
    }) as CommandFn<CommandPayloadRegistry[S][N]>,
    [sourceId, name],
  )
}
