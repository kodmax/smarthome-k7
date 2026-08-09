import { Controller, Get, Param, UseFilters } from '@nestjs/common'
import { FeedComposer } from '@repo/feeds'
import { FeedNotFoundFilter } from './feed-not-found.filter'

@UseFilters(FeedNotFoundFilter)
@Controller()
export class FeedsController {
  constructor(private feeds: FeedComposer) {}

  @Get('feed/:feedId')
  getFeed(@Param('feedId') feedId: string) {
    return this.feeds.getFeedData(feedId)
  }
}
