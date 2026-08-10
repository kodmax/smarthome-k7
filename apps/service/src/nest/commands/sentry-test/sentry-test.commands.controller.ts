import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { SentryTestSource } from '@/data-sources/sentry-test'
import { DataSourceRegistryType } from '@/data-sources'

@Controller('data-sources/sentry-test/command')
export class SentryTestCommandsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): SentryTestSource {
    return this.dataSources.get('sentryTest')
  }

  @Post('throw')
  @HttpCode(HttpStatus.NO_CONTENT)
  throw(): Promise<void> {
    return this.source().throwTestError()
  }
}
