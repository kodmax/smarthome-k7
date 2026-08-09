import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule, BootstrapDeps } from './app.module'
import { nestLogger } from './logger/nest-logger'
import { PinoNestLoggerService } from './logger/pino-nest-logger.service'
import { HttpExceptionFilter } from './filters/http-exception.filter'

const DEFAULT_PORT = 3679

export const createNestApp = async (deps: BootstrapDeps) => {
  const app = await NestFactory.create(AppModule.register(deps), {
    logger: new PinoNestLoggerService(nestLogger()),
  })

  app.useGlobalFilters(new HttpExceptionFilter())

  const port = Number(process.env.API_PORT ?? DEFAULT_PORT)
  if (Number.isNaN(port)) {
    throw new Error('Environment variable API_PORT must be a number')
  }

  await app.listen(port)

  return app
}
