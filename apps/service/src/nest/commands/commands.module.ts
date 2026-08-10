import { Module } from '@nestjs/common'
import { CvCommandsController } from './cv/cv.commands.controller'
import { EnergyMeterCommandsController } from './energy-meter/energy-meter.commands.controller'
import { JobAdsCommandsController } from './job-ads/job-ads.commands.controller'
import { LightsCommandsController } from './lights/lights.commands.controller'
import { MySkillsCommandsController } from './my-skills/my-skills.commands.controller'
import { NewsCommandsController } from './news/news.commands.controller'
import { SentryTestCommandsController } from './sentry-test/sentry-test.commands.controller'
import { TorrentsCommandsController } from './torrents/torrents.commands.controller'
import { TransmissionCommandsController } from './transmission/transmission.commands.controller'

@Module({
  controllers: [
    CvCommandsController,
    EnergyMeterCommandsController,
    JobAdsCommandsController,
    LightsCommandsController,
    MySkillsCommandsController,
    NewsCommandsController,
    SentryTestCommandsController,
    TorrentsCommandsController,
    TransmissionCommandsController,
  ],
})
export class CommandsModule {}
