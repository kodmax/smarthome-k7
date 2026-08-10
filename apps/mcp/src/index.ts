import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { destination, createLogger } from '@repo/logger'
import { serviceApiUrl } from './config.js'
import { registerDashboardTools } from './tools/dashboardTools.js'

const logger = createLogger({ name: 'dashboard-mcp', destination: destination(2) })

function createServer(): McpServer {
  const server = new McpServer({
    name: 'dashboard',
    version: '0.0.0',
  })

  server.registerTool(
    'ping',
    {
      title: 'Ping',
      description: 'Sprawdza, czy serwer MCP odpowiada.',
    },
    async () => ({
      content: [{ type: 'text', text: 'pong' }],
    }),
  )

  registerDashboardTools(server)

  return server
}

async function main(): Promise<void> {
  const server = createServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
  logger.info({ serviceApiUrl, toolCount: 15 }, 'ready on stdio')
}

main().catch(error => {
  logger.fatal({ err: error }, 'fatal error')
  process.exit(1)
})
