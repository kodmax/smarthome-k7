import { type DataSourceDefinition } from './DataSourceDefinition'

export type DataSourceCommand = {
  sourceId: string
  name: string
  args: string
}

export type DataSourceDefinitionClass<T = unknown, TCache = T> = new (
  push: (content?: T) => void | Promise<void>,
  reportError: (e: Error) => void,
) => DataSourceDefinition<T, TCache>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDataSourceDefinitionClass = DataSourceDefinitionClass<any, any>

export type SourceMetricType = 'knx' | 'scraper' | 'api' | 'db' | 'other'

export type DataSourceRefreshObserver = <T>(
  metricType: SourceMetricType,
  sourceId: string,
  fn: () => Promise<T>,
) => Promise<T>
