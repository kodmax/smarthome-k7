import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { nestLogger } from './logger/nest-logger'
import { PinoNestLoggerService } from './logger/pino-nest-logger.service'

const DEFAULT_PORT = 3679

export const createNestApp = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoNestLoggerService(nestLogger()),
  })

  const port = Number(process.env.API_PORT ?? DEFAULT_PORT)
  if (Number.isNaN(port)) {
    throw new Error('Environment variable API_PORT must be a number')
  }

  await app.listen(port)

  return app
}
