import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { HomeLightsSource } from '@/data-sources/knx/HomeLightsSource'
import { DataSourceRegistryType } from '@/data-sources'
import { SetLightDto } from './lights.dto'

@Controller('data-sources/lights')
export class LightsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): HomeLightsSource {
    return this.dataSources.get('homeLights')
  }

  @Post('command/set')
  @HttpCode(HttpStatus.NO_CONTENT)
  set(@Body() dto: SetLightDto): Promise<void> {
    return this.source().setLight(dto.circuitId, dto.state)
  }
}
