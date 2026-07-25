import { createContainer } from '@repo/di'
import type { KnxLink } from 'js-knx'
import type { Pool } from 'mariadb'
import type OpenAI from 'openai'
import type { RedisClientType } from 'redis'
import type { config as appConfig } from './config'

/**
 * Whitelist of dependencies that can be registered in the container.
 * Add new entries here when introducing a new shared dependency.
 */
export type Dependencies = {
  db: Pool
  redis: RedisClientType
  config: typeof appConfig
  knx: KnxLink
  openai: OpenAI
}

export type DependencyKey = keyof Dependencies

export const { registerDependency, getDependency, Inject } = createContainer<Dependencies>()
