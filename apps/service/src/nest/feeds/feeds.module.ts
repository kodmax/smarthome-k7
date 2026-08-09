import { DynamicModule, Global, Module } from '@nestjs/common'
import { FeedComposer } from '@repo/feeds'
import { FeedNotFoundFilter } from './feed-not-found.filter'

@Global()
@Module({})
export class FeedsModule {
  static forRoot(feeds: FeedComposer): DynamicModule {
    return {
      module: FeedsModule,
      providers: [{ provide: FeedComposer, useValue: feeds }, FeedNotFoundFilter],
      exports: [FeedComposer],
    }
  }
}
