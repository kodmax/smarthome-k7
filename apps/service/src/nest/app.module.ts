import { DynamicModule, Module } from '@nestjs/common'
import { AppService } from './app.service'
import { LoggerModule } from './logger/logger.module'
import { FeedsController } from './feeds/feeds.controller'
import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'
import { FeedsModule } from './feeds/feeds.module'

export type BootstrapDeps = {
  dataSources: DataSourceRegistry<DataSourceRegistryType>
  feeds: FeedComposer
}

@Module({})
export class AppModule {
  static register({ feeds }: BootstrapDeps): DynamicModule {
    return {
      module: AppModule,
      imports: [LoggerModule.forRoot(), FeedsModule.forRoot(feeds)],
      providers: [AppService],
      controllers: [FeedsController],
    }
  }
}
