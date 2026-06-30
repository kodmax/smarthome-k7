import { DataSource, DataSourceDefinition } from './DataSource'

export type DS = DataSource<DataSourceDefinition<unknown>>

export type SourceDataTypes<S extends Record<string, DataSourceDefinition<unknown>>> = {
  [K in keyof S]: S[K] extends DataSourceDefinition<infer T> ? T : never
}

export type FeedSources = Map<string, DataSource<DataSourceDefinition<unknown>>>

export type FeedCb = (content: Record<string, unknown>) => unknown

export type SourceRegistration = {
  definition: DataSourceDefinition<unknown>
  dataSource: DS
}

export type Feed = {
  sources: FeedSources
  cb: FeedCb
  feedId: string
}
