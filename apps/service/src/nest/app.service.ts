import { Injectable, OnModuleInit } from '@nestjs/common'
import type { Logger } from '@repo/logger'
import { AppLogger } from './logger/app-logger.service'

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger: Logger

  constructor(appLogger: AppLogger) {
    this.logger = appLogger.forComponent('app-service')
  }

  onModuleInit(): void {
    this.logger.info('Nest initialized')
  }
}
