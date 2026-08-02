import {
  DataSource,
  DataSourceDefinition,
  AnyDataSourceDefinitionClass,
  type DataSourceRefreshObserver,
  AnyDataSource,
} from '../DataSource'
import type { ErrorHandler } from '../notifyError'
import type { Logger } from '@repo/logger'

export type DS = DataSource<unknown>

export type SourceDataTypes<S extends Record<string, AnyDataSourceDefinitionClass>> = {
  [K in keyof S]: S[K] extends new (...args: never[]) => infer I
    ? I extends DataSourceDefinition<infer T, unknown>
      ? T
      : never
    : never
}

export type DataSourceDataTypes<S extends Record<string, AnyDataSource>> = {
  [K in keyof S]: S[K] extends DataSource<infer T, unknown> ? T : never
}

export type FeedSources = Map<string, DataSource<unknown>>

export type FeedCb = (content: Record<string, unknown>) => unknown

export type SourceRegistration = {
  sourceClass: AnyDataSourceDefinitionClass
  dataSource: DS
}

export type Feed = {
  sources: FeedSources
  cb: FeedCb
  feedId: string
}

export type FeedsOptions = {
  logger: Logger
  onError: ErrorHandler
  observeDataSourceRefresh?: DataSourceRefreshObserver
}
