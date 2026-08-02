import { DataSource } from './DataSource'
import { type DataSourceDefinition } from './DataSourceDefinition'

export type DataSourceCommand = {
  sourceId: string
  name: string
  args: string
}

export type DataSourceDefinitionCtor<T = unknown, TCache = T> = new (
  push: (content?: T) => void | Promise<void>,
  reportError: (e: Error) => void,
) => DataSourceDefinition<T, TCache>

export type DefinitionFromCtor<T extends DataSourceDefinitionCtor<unknown, unknown>> = InstanceType<T>

export type DataSourceFromCtor<T extends DataSourceDefinitionCtor<unknown, unknown>> =
  InstanceType<T> extends DataSourceDefinition<infer TValue, infer TCache> ? DataSource<TValue, TCache> : never

export type DataSourceValueFromCtor<T extends DataSourceDefinitionCtor<unknown, unknown>> =
  T extends DataSourceDefinitionCtor<infer TValue, unknown> ? TValue : never

export type DataSourceCacheFromCtor<T extends DataSourceDefinitionCtor<unknown, unknown>> =
  T extends DataSourceDefinitionCtor<unknown, infer TCache> ? TCache : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDataSourceDefinitionClass = DataSourceDefinitionCtor<any, any>

export type SourceMetricType = 'knx' | 'scraper' | 'api' | 'db' | 'other'

export type DataSourceRefreshObserver = <T>(
  metricType: SourceMetricType,
  sourceId: string,
  fn: () => Promise<T>,
) => Promise<T>
