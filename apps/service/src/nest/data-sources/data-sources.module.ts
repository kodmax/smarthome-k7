import { DynamicModule, Global, Module } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

@Global()
@Module({})
export class DataSourcesModule {
  static forRoot(dataSources: DataSourceRegistry<DataSourceRegistryType>): DynamicModule {
    return {
      module: DataSourcesModule,
      providers: [{ provide: DataSourceRegistry, useValue: dataSources }],
      exports: [DataSourceRegistry],
    }
  }
}
