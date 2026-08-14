import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { CvSource } from '@/data-sources/cv/CvSource'
import { DataSourceRegistryType } from '@/data-sources'
import { UploadCvDto } from './cv.dto'

@Controller('data-sources/cv')
export class CvController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): CvSource {
    return this.dataSources.get('cv')
  }

  @Post('command/upload')
  @HttpCode(HttpStatus.NO_CONTENT)
  upload(@Body() dto: UploadCvDto): Promise<void> {
    return this.source().upload(dto)
  }
}
