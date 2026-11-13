// Local boundary for the experimental browser API; no MCP server dependency.
export type WebTool = {
  name: string
  description: string
  inputSchema: { type: 'object'; properties: Record<string, unknown>; required?: string[]; additionalProperties: false }
  annotations: { readOnlyHint: boolean; untrustedContentHint?: boolean }
  execute: (input: Record<string, unknown>, options: { signal: AbortSignal }) => Promise<unknown>
}

export type ModelContext = {
  registerTool: (tool: WebTool, options: { signal: AbortSignal }) => Promise<unknown> | void
}
