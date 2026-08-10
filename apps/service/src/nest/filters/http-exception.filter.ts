import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import type { Logger } from '@repo/logger'
import { isProduction } from '@repo/env'
import { captureProductionError } from '@/sentry'
import { nestLogger } from '../logger/nest-logger'

const isHttpStatus = (value: unknown): value is number =>
  typeof value === 'number' && value >= HttpStatus.BAD_REQUEST && value < 600

const resolveHttpStatus = (exception: unknown): number => {
  if (typeof exception !== 'object' || exception === null) {
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  const record = exception as { statusCode?: unknown; status?: unknown }
  if (isHttpStatus(record.statusCode)) {
    return record.statusCode
  }
  if (isHttpStatus(record.status)) {
    return record.status
  }

  return HttpStatus.INTERNAL_SERVER_ERROR
}

const formatUnknownExceptionBody = (exception: unknown, status: number) => {
  if (isProduction) {
    return {
      statusCode: status,
      message: status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'Internal server error' : 'Bad Request',
    }
  }

  const message =
    status >= HttpStatus.INTERNAL_SERVER_ERROR
      ? 'Internal server error'
      : exception instanceof Error && exception.message.length > 0
        ? exception.message
        : 'Request failed'

  return { statusCode: status, message }
}

const logHttpException = (logger: Logger, exception: unknown, status: number): void => {
  const message = exception instanceof Error ? exception.message : 'HTTP exception'
  const fields = { err: exception, status }

  if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
    logger.error(fields, message)
    captureProductionError(exception)
    return
  }

  logger.warn(fields, message)
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = nestLogger().child({ source: 'http' })

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      throw exception
    }

    const response = host.switchToHttp().getResponse()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      logHttpException(this.logger, exception, status)

      return response.status(status).json(exception.getResponse())
    }

    const status = resolveHttpStatus(exception)
    logHttpException(this.logger, exception, status)

    return response.status(status).json(formatUnknownExceptionBody(exception, status))
  }
}
