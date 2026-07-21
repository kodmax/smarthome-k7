export type DependencyKey<TDependencies> = keyof TDependencies

export type DependencyContainer<TDependencies extends Record<string, unknown>> = {
  registerDependency<K extends DependencyKey<TDependencies>>(key: K, value: TDependencies[K]): void
  getDependency<K extends DependencyKey<TDependencies>>(key: K): TDependencies[K]
  Inject<K extends DependencyKey<TDependencies>>(key: K): PropertyDecorator
}

export function createContainer<TDependencies extends Record<string, unknown>>(): DependencyContainer<TDependencies> {
  const registry: Partial<TDependencies> = {}

  function registerDependency<K extends DependencyKey<TDependencies>>(key: K, value: TDependencies[K]): void {
    registry[key] = value
  }

  function getDependency<K extends DependencyKey<TDependencies>>(key: K): TDependencies[K] {
    const value = registry[key]

    if (value === undefined) {
      throw new Error(`Dependency "${String(key)}" is not registered`)
    }

    return value
  }

  function Inject<K extends DependencyKey<TDependencies>>(key: K): PropertyDecorator {
    return function (target: object, propertyKey: string | symbol): void {
      Object.defineProperty(target, propertyKey, {
        get(): TDependencies[K] {
          return getDependency(key)
        },
        enumerable: true,
        configurable: true,
      })
    }
  }

  return { registerDependency, getDependency, Inject }
}
