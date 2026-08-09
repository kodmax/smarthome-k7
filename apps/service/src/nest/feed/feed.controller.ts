import { Controller, Get, Param, UseFilters } from '@nestjs/common'
import { FeedComposer } from '@repo/feeds'
import { FeedNotFoundFilter } from './feed-not-found.filter'

@UseFilters(FeedNotFoundFilter)
@Controller('feeds')
export class FeedController {
  constructor(private feeds: FeedComposer) {}

  @Get(':feedId')
  getFeed(@Param('feedId') feedId: string) {
    return this.feeds.getFeedData(feedId)
  }
}
