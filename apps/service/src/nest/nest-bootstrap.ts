import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule, BootstrapDeps } from './app.module'
import { nestLogger } from './logger/nest-logger'
import { PinoNestLoggerService } from './logger/pino-nest-logger.service'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { CommandMetricsInterceptor } from './interceptors/command-metrics.interceptor'
import { WsAdapter } from '@nestjs/platform-ws'

const DEFAULT_PORT = 3679
const JSON_BODY_LIMIT = '1mb'

export const createNestApp = async (deps: BootstrapDeps) => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule.register(deps), {
    logger: new PinoNestLoggerService(nestLogger()),
  })

  app.useBodyParser('json', { limit: JSON_BODY_LIMIT })
  app.useWebSocketAdapter(new WsAdapter(app))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new CommandMetricsInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const port = Number(process.env.API_PORT ?? DEFAULT_PORT)
  if (Number.isNaN(port)) {
    throw new Error('Environment variable API_PORT must be a number')
  }

  await app.listen(port)

  return app
}
