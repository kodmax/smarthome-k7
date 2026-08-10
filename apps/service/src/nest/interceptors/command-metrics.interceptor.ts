import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { incApiCommand, parseCommandRequestPath } from '@/prometheus/commandMetrics'

@Injectable()
export class CommandMetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle()
    }

    const request = context.switchToHttp().getRequest<{ path: string }>()
    const parsed = parseCommandRequestPath(request.path)
    if (!parsed) {
      return next.handle()
    }

    const { source, command } = parsed

    return next.handle().pipe(
      tap({
        next: () => incApiCommand(source, command, 'success'),
        error: () => incApiCommand(source, command, 'error'),
      }),
    )
  }
}
