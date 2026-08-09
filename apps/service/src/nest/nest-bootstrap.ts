import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import type { Logger } from '@repo/logger'
import { AppModule } from './app.module'
import { PinoNestLoggerService } from './logger/pino-nest-logger.service'

export const createNestContext = async (rootLogger: Logger) => {
  const nestLogger = new PinoNestLoggerService(rootLogger)

  return NestFactory.createApplicationContext(AppModule.register({ logger: rootLogger }), {
    logger: nestLogger,
  })
}
