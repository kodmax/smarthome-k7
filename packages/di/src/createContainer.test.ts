import { describe, expect, it } from 'vitest'
import { createContainer } from './createContainer'

type TestDependencies = {
  db: { query: () => string }
  config: { enabled: boolean }
}

describe('createContainer', () => {
  it('registers and resolves dependencies', () => {
    const { registerDependency, getDependency } = createContainer<TestDependencies>()

    registerDependency('db', { query: () => 'ok' })
    registerDependency('config', { enabled: true })

    expect(getDependency('db').query()).toBe('ok')
    expect(getDependency('config').enabled).toBe(true)
  })

  it('throws when dependency is not registered', () => {
    const { getDependency } = createContainer<TestDependencies>()

    expect(() => getDependency('db')).toThrow('Dependency "db" is not registered')
  })

  it('injects dependencies via property decorator', () => {
    const { registerDependency, Inject } = createContainer<TestDependencies>()

    registerDependency('config', { enabled: false })

    class Example {}

    Inject('config')(Example.prototype, 'config')

    expect(new Example().config.enabled).toBe(false)
  })
})
