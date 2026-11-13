import { createTools } from './tools'
import type { ModelContext } from './types'

export function registerWebMcp(
  context = (document as Document & { modelContext?: ModelContext }).modelContext,
): () => void {
  if (!context || typeof context.registerTool !== 'function') return () => undefined
  const controller = new AbortController()
  // Keep registrations and their executions scoped to this app instance.
  void (async () => {
    try {
      for (const tool of createTools()) {
        if (controller.signal.aborted) return
        await context.registerTool(
          {
            ...tool,
            execute: (input, { signal }) =>
              tool.execute(input, { signal: AbortSignal.any([signal, controller.signal]) }),
          },
          { signal: controller.signal },
        )
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        controller.abort()
        console.warn('[webmcp] Tool registration failed', error)
      }
    }
  })()
  return () => controller.abort()
}
