import { DynamicModule, Global, Module } from '@nestjs/common'
import type { Logger } from '@repo/logger'
import { AppLogger } from './app-logger.service'
import { ROOT_LOGGER } from './logger.constants'

@Global()
@Module({})
export class LoggerModule {
  static forRoot(logger: Logger): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
      providers: [{ provide: ROOT_LOGGER, useValue: logger }, AppLogger],
      exports: [ROOT_LOGGER, AppLogger],
    }
  }
}
