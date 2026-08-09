import { DynamicModule, Global, Module } from '@nestjs/common'
import { AppLogger } from './app-logger.service'
import { ROOT_LOGGER } from './logger.constants'
import { nestLogger } from './nest-logger'

@Global()
@Module({})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [{ provide: ROOT_LOGGER, useFactory: nestLogger }, AppLogger],
      exports: [AppLogger],
    }
  }
}
