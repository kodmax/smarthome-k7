import { Catch, ExceptionFilter, NotFoundException } from '@nestjs/common'
import { FeedNotFound } from '@repo/feeds'
import { AppLogger } from '../logger/app-logger.service'
import { type Logger } from '@repo/logger'
@Catch(FeedNotFound)
export class FeedNotFoundFilter implements ExceptionFilter {
  private readonly logger: Logger

  constructor(appLogger: AppLogger) {
    this.logger = appLogger.forComponent('feeds-api')
  }

  catch(err: FeedNotFound) {
    this.logger.warn({ feedId: err.feedId }, 'feed not found')
    throw new NotFoundException(err.message)
  }
}
