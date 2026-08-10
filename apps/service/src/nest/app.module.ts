import { DynamicModule, Module } from '@nestjs/common'
import { AppService } from './app.service'
import { LoggerModule } from './logger/logger.module'
import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'
import { CommandsModule } from './commands/commands.module'
import { DataSourcesModule } from './data-sources/data-sources.module'
import { FeedModule } from './feed/feed.module'

export type BootstrapDeps = {
  dataSources: DataSourceRegistry<DataSourceRegistryType>
  feeds: FeedComposer
}

@Module({})
export class AppModule {
  static register({ feeds, dataSources }: BootstrapDeps): DynamicModule {
    return {
      module: AppModule,
      imports: [
        LoggerModule.forRoot(),
        FeedModule.forRoot(feeds),
        DataSourcesModule.forRoot(dataSources),
        CommandsModule,
      ],
      providers: [AppService],
    }
  }
}
