import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { destination, readScopedLogLevel, createLogger } from '@repo/logger'
import { apolloWsOptions, apolloWsUrl } from './config.js'
import { DASHBOARD_FEED_IDS } from './feeds/dashboardFeeds.js'
import { FeedStore } from './feeds/FeedStore.js'
import { registerDashboardTools } from './tools/dashboardTools.js'

const logger = createLogger({ name: 'dashboard-mcp', destination: destination(2) })

function createServer(feedStore: FeedStore): McpServer {
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

  registerDashboardTools(server, feedStore)

  return server
}

async function main(): Promise<void> {
  const feedStore = new FeedStore(
    apolloWsUrl,
    logger.child({ component: 'feeds' }, { level: readScopedLogLevel('feeds') }),
    apolloWsOptions,
  )
  feedStore.start(DASHBOARD_FEED_IDS)

  const server = createServer(feedStore)
  const transport = new StdioServerTransport()
  await server.connect(transport)
  logger.info({ apolloWsUrl, toolCount: 15 }, 'ready on stdio')
}

main().catch(error => {
  logger.fatal({ err: error }, 'fatal error')
  process.exit(1)
})
