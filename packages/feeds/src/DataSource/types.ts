import type { Logger } from '@repo/logger'
import type { CacheEntry } from '../Cache'
import { FeedEvents } from '../FeedManager'
import { DataSource } from './DataSource'

export type DataSourceCommand = {
  sourceId: string
  name: string
  args: string
}

export type ErrorHandler = (error: unknown, context: string) => void

export type DataSourceParams<TCache = unknown> = {
  feedEvents: FeedEvents
  cacheEntry: CacheEntry<TCache>
  logger: Logger
  onError: ErrorHandler
  observeDataSourceRefresh?: DataSourceRefreshObserver
}

export type DataSourceCtor<T = unknown, TCache = T> = {
  new (params: DataSourceParams<TCache>): DataSource<T, TCache>
  getId(): string
  getCacheTTL(): number
  getCron(): string | undefined
  isVolatile(): boolean
}

export type DataSourceFromCtor<T extends DataSourceCtor<unknown, unknown>> = InstanceType<T>

export type DataSourceValueFromCtor<T extends DataSourceCtor<unknown, unknown>> =
  T extends DataSourceCtor<infer TValue, unknown> ? TValue : never

export type DataSourceCacheFromCtor<T extends DataSourceCtor<unknown, unknown>> =
  T extends DataSourceCtor<unknown, infer TCache> ? TCache : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDataSourceCtor = DataSourceCtor<any, any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDataSource = DataSource<any, any>

export type SourceMetricType = 'knx' | 'scraper' | 'api' | 'db' | 'other'

export type DataSourceRefreshObserver = <T>(
  metricType: SourceMetricType,
  sourceId: string,
  fn: () => Promise<T>,
) => Promise<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegistryBaseType = Record<string, DataSourceCtor<any, any>>

export type DataSourcesByIds<R extends RegistryBaseType, K extends readonly (keyof R)[]> = {
  [P in K[number]]: DataSource<DataSourceValueFromCtor<R[P]>, DataSourceCacheFromCtor<R[P]>>
}
