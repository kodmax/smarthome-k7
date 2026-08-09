import { Inject, Injectable } from '@nestjs/common'
import { childComponentLogger, type Logger } from '@repo/logger'
import { ROOT_LOGGER } from './logger.constants'

@Injectable()
export class AppLogger {
  constructor(@Inject(ROOT_LOGGER) private readonly root: Logger) {}

  forComponent(component: string): Logger {
    return childComponentLogger(this.root, component)
  }
}
