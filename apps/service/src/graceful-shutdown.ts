import type { Feeds, Server } from '@repo/apollo-ws'
import type { KnxLink } from 'js-knx'
import pool from './db'

let knxLink: KnxLink | undefined
let knxCron: { stop(): void } | undefined
let apolloFeeds: Feeds | undefined
let apolloServer: Server | undefined
let shuttingDown = false

export const registerKnxLink = (link: KnxLink): void => {
  knxLink = link
}

export const registerKnxCron = (chronos: { stop(): void }): void => {
  knxCron = chronos
}

export const registerApollo = (server: Server, feeds: Feeds): void => {
  apolloServer = server
  apolloFeeds = feeds
}

const closeConnections = async (): Promise<void> => {
  if (knxCron !== undefined) {
    knxCron.stop()
  }

  if (apolloFeeds !== undefined) {
    apolloFeeds.close()
  }

  if (apolloServer !== undefined) {
    await apolloServer.close()
  }

  if (knxLink !== undefined) {
    await knxLink.disconnect()
  }

  await pool.end()
}

export const setupGracefulShutdown = (): void => {
  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      process.exit(1)
      return
    }
    shuttingDown = true

    console.log(`${signal}. Exiting.`)

    closeConnections()
      .then(() => process.exit(0))
      .catch(err => {
        console.error('Failed during shutdown:', err)
        process.exit(1)
      })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}
