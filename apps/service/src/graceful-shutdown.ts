import type { KnxLink } from 'js-knx'
import pool from './db'

let knxLink: KnxLink | undefined
let shuttingDown = false

export const registerKnxLink = (link: KnxLink): void => {
  knxLink = link
}

const closeConnections = async (): Promise<void> => {
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
