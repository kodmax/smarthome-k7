import { Controller, Get, Param, UseFilters } from '@nestjs/common'
import { trace } from '@opentelemetry/api'
import { FeedComposer } from '@repo/feeds'
import { FeedNotFoundFilter } from './feed-not-found.filter'

@UseFilters(FeedNotFoundFilter)
@Controller('feeds')
export class FeedController {
  constructor(private feeds: FeedComposer) {}

  @Get(':feedId')
  getFeed(@Param('feedId') feedId: string) {
    trace.getActiveSpan()?.setAttributes({
      'feed.id': feedId,
      'http.route': `/feeds/${feedId}`,
    })

    return this.feeds.getFeedData(feedId)
  }
}
