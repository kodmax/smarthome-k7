import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { EnergyMeterSource } from '@/data-sources/knx/EnergyMeterSource'
import { DataSourceRegistryType } from '@/data-sources'

@Controller('data-sources/energy.meter/command')
export class EnergyMeterCommandsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): EnergyMeterSource {
    return this.dataSources.get('energyMeter')
  }

  @Post('reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  reset(): Promise<void> {
    return this.source().resetMeter()
  }

  @Post('start')
  @HttpCode(HttpStatus.NO_CONTENT)
  start(): Promise<void> {
    return this.source().startMeter()
  }

  @Post('stop')
  @HttpCode(HttpStatus.NO_CONTENT)
  stop(): Promise<void> {
    return this.source().stopMeter()
  }

  @Post('request-readings')
  @HttpCode(HttpStatus.NO_CONTENT)
  requestReadings(): Promise<void> {
    return this.source().requestReadings()
  }
}
