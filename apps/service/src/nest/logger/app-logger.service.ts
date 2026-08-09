import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@repo/logger'
import { readScopedLogLevel } from '@repo/logger'
import { ROOT_LOGGER } from './logger.constants'

@Injectable()
export class AppLogger {
  constructor(@Inject(ROOT_LOGGER) private readonly root: Logger) {}

  forComponent(component: string): Logger {
    const level = readScopedLogLevel(component)
    return level ? this.root.child({ component }, { level }) : this.root.child({ component })
  }
}
