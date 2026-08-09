import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { nestLogger } from './logger/nest-logger'
import { PinoNestLoggerService } from './logger/pino-nest-logger.service'

export const createNestContext = async () => {
  return NestFactory.createApplicationContext(AppModule, {
    logger: new PinoNestLoggerService(nestLogger()),
  })
}
