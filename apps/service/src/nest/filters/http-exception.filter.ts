import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { captureProductionError } from '@/sentry'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      throw exception
    }

    const response = host.switchToHttp().getResponse()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        captureProductionError(exception)
      }

      return response.status(status).json(exception.getResponse())
    }

    captureProductionError(exception)

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    })
  }
}
