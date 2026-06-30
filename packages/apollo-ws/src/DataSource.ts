import EventEmitter from 'events'
import { CacheEntry, Snapshot } from './cache'
import { NoRecentContent } from './Errors'
import { ApolloEvents } from './ApolloEvents'

type DSCT<S> = S extends DataSourceDefinition<infer T> ? T : never
type DSM<S extends Record<string, DataSourceDefinition<unknown>>> = {
  [K in keyof S]: DSCT<S[K]>
}

type DD = DataSourceDefinition<unknown>
type DataSourceDefinition<T> = {
  expired: (cache: Snapshot<unknown>) => boolean
  script: () => Promise<T>
  id: string

  push?: (push: (content: T) => void, command: EventEmitter, err: (e: Error) => void) => void
  volatile?: boolean
  cron?: string
}

export type DataSourceCommand = {
  sourceId: string
  name: string
  args: string
}

class DataSource<S extends DataSourceDefinition<unknown>, T = DSCT<S>> {
  private updating: Promise<T> | undefined

  public constructor(
    private definition: S,
    private cacheEntry: CacheEntry<T>,
    private vent: ApolloEvents,
  ) {
    const command = new EventEmitter()

    if (definition.push) {
      this.vent.on('command', ev => {
        if (ev.sourceId === definition.id) {
          try {
            command.emit(ev.name, ev.args)
          } catch (e) {
            this.vent.emit(
              'sys-log',
              4,
              `Data source <${this.definition.id}> command <${ev.name} execution error: ${e}`,
              e,
            )
          }
        }
      })

      definition.push(
        content => this.push(content as T),
        command,
        e => {
          this.vent.emit('sys-log', 4, `Push data source <${this.definition.id}> update error: ${e}`, e)
        },
      )
    }
  }

  public async push(content: T): Promise<void> {
    await this.cacheEntry.write(content)

    this.vent.emit('sys-log', 7, `Push data source <${this.definition.id}>`)
    this.vent.emit('data-update', this.definition.id)
  }

  public isCacheFresh(): boolean {
    return !this.cacheEntry.isEmpty() && !this.definition.expired(this.cacheEntry.getSnapshot())
  }

  public getId(): string {
    return this.definition.id
  }

  public getRecentContent(): T {
    if (this.cacheEntry.isEmpty()) {
      throw new NoRecentContent()
    }

    return this.cacheEntry.getSnapshot().getContent()
  }

  public async getData(forceRefresh = false): Promise<T> {
    if (this.updating) {
      return this.updating
    } else if (!forceRefresh && this.isCacheFresh()) {
      this.vent.emit('sys-log', 7, `Cache hit on data source <${this.definition.id}>`)

      return this.cacheEntry.getSnapshot().getContent()
    } else {
      this.updating = new Promise((resolve, reject) => {
        this.definition
          .script()
          .then(async content => {
            await this.cacheEntry.write(content as T)
            resolve(content as T)

            this.vent.emit('sys-log', 4, `Data source <${this.definition.id}> content refreshed`)
            this.vent.emit('data-update', this.definition.id)
            this.updating = void 0
          })
          .catch(e => {
            this.vent.emit('sys-log', 4, `Data source <${this.definition.id}> update error: ` + e)
            this.updating = void 0
            reject(e)
          })
      })

      return this.updating
    }
  }
}

export type { DataSourceDefinition, DSCT, DSM, DD }
export { DataSource }
