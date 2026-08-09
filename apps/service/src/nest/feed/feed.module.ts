import { DynamicModule, Global, Module } from '@nestjs/common'
import { FeedComposer } from '@repo/feeds'
import { FeedNotFoundFilter } from './feed-not-found.filter'
import { FeedController } from './feed.controller'

@Global()
@Module({})
export class FeedModule {
  static forRoot(feeds: FeedComposer): DynamicModule {
    return {
      controllers: [FeedController],
      module: FeedModule,
      providers: [{ provide: FeedComposer, useValue: feeds }, FeedNotFoundFilter],
      exports: [FeedComposer],
    }
  }
}
