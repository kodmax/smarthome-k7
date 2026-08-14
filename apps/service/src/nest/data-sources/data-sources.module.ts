import { DynamicModule, Global, Module } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'
import { CvController } from './cv/cv.controller'
import { EnergyMeterController } from './energy-meter/energy-meter.controller'
import { JobAdsController } from './job-ads/job-ads.controller'
import { LightsController } from './lights/lights.controller'
import { MySkillsController } from './my-skills/my-skills.controller'
import { NewsController } from './news/news.controller'
import { SentryTestController } from './sentry-test/sentry-test.controller'
import { TorrentsController } from './torrents/torrents.controller'
import { TransmissionController } from './transmission/transmission.controller'

@Global()
@Module({})
export class DataSourcesModule {
  static forRoot(dataSources: DataSourceRegistry<DataSourceRegistryType>): DynamicModule {
    return {
      module: DataSourcesModule,
      controllers: [
        CvController,
        EnergyMeterController,
        JobAdsController,
        LightsController,
        MySkillsController,
        NewsController,
        SentryTestController,
        TorrentsController,
        TransmissionController,
      ],
      providers: [{ provide: DataSourceRegistry, useValue: dataSources }],
      exports: [DataSourceRegistry],
    }
  }
}
