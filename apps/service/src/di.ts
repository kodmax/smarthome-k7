import type { KnxLink } from 'js-knx'
import type { Pool } from 'mariadb'
import type { config as appConfig } from './config'

/**
 * Whitelist of dependencies that can be registered in the container.
 * Add new entries here when introducing a new shared dependency.
 */
export type Dependencies = {
  db: Pool
  config: typeof appConfig
  knx: KnxLink
}

export type DependencyKey = keyof Dependencies

const registry: Partial<Dependencies> = {}

export function registerDependency<K extends DependencyKey>(key: K, value: Dependencies[K]): void {
  registry[key] = value
}

export function getDependency<K extends DependencyKey>(key: K): Dependencies[K] {
  const value = registry[key]

  if (value === undefined) {
    throw new Error(`Dependency "${String(key)}" is not registered`)
  }

  return value
}

export function Inject<K extends DependencyKey>(key: K) {
  return function (target: object, propertyKey: string | symbol): void {
    Object.defineProperty(target, propertyKey, {
      get(): Dependencies[K] {
        return getDependency(key)
      },
      enumerable: true,
      configurable: true,
    })
  }
}
