import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { EnergyMeterSource } from '@/data-sources/knx/EnergyMeterSource'
import { DataSourceRegistryType } from '@/data-sources'

@Controller('data-sources/energy.meter')
export class EnergyMeterController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): EnergyMeterSource {
    return this.dataSources.get('energyMeter')
  }

  @Post('command/reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  reset(): Promise<void> {
    return this.source().resetMeter()
  }

  @Post('command/start')
  @HttpCode(HttpStatus.NO_CONTENT)
  start(): Promise<void> {
    return this.source().startMeter()
  }

  @Post('command/stop')
  @HttpCode(HttpStatus.NO_CONTENT)
  stop(): Promise<void> {
    return this.source().stopMeter()
  }

  @Post('command/request-readings')
  @HttpCode(HttpStatus.NO_CONTENT)
  requestReadings(): Promise<void> {
    return this.source().requestReadings()
  }
}
