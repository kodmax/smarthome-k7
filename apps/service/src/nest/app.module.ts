import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [AppService],
})
export class AppModule {}
