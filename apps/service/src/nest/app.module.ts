import { DynamicModule, Module } from '@nestjs/common'
import type { Logger } from '@repo/logger'
import { AppService } from './app.service'
import { LoggerModule } from './logger/logger.module'

@Module({
  providers: [AppService],
})
export class AppModule {
  static register(options: { logger: Logger }): DynamicModule {
    return {
      module: AppModule,
      imports: [LoggerModule.forRoot(options.logger)],
    }
  }
}
