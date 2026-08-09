import { DynamicModule, Module } from '@nestjs/common'
import { AppService } from './app.service'
import { LoggerModule } from './logger/logger.module'
import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'
import { FeedModule } from './feed/feed.module'

export type BootstrapDeps = {
  dataSources: DataSourceRegistry<DataSourceRegistryType>
  feeds: FeedComposer
}

@Module({})
export class AppModule {
  static register({ feeds }: BootstrapDeps): DynamicModule {
    return {
      module: AppModule,
      imports: [LoggerModule.forRoot(), FeedModule.forRoot(feeds)],
      providers: [AppService],
    }
  }
}
