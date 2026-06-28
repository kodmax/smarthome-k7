import type { KnxLink } from 'js-knx'

let knxLink: KnxLink | undefined
let shuttingDown = false

export const registerKnxLink = (link: KnxLink): void => {
  knxLink = link
}

export const setupGracefulShutdown = (): void => {
  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      process.exit(1)
      return
    }
    shuttingDown = true

    console.log(`${signal}. Exiting.`)

    if (knxLink === undefined) {
      process.exit(0)
      return
    }

    knxLink
      .disconnect()
      .then(() => process.exit(0))
      .catch(err => {
        console.error('Failed to disconnect KNX:', err)
        process.exit(1)
      })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}
