import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { JobAdsSource } from '@/data-sources/job-ads/JobAdsSource'
import { DataSourceRegistryType } from '@/data-sources'
import {
  AddManualJobAdDto,
  AnalyzeCvMatchDto,
  ChangeStateDto,
  DeleteManualJobAdDto,
  EditManualJobAdDto,
  ItemIdDto,
  SetAcceptableSalaryDto,
} from './job-ads.dto'

@Controller('data-sources/job-ads')
export class JobAdsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): JobAdsSource {
    return this.dataSources.get('jobAds')
  }

  @Post('command/change-state')
  @HttpCode(HttpStatus.NO_CONTENT)
  changeState(@Body() dto: ChangeStateDto): Promise<void> {
    return this.source().changeState(dto)
  }

  @Post('command/fav')
  @HttpCode(HttpStatus.NO_CONTENT)
  fav(@Body() dto: ItemIdDto): Promise<void> {
    return this.source().fav(dto.itemId)
  }

  @Post('command/unfav')
  @HttpCode(HttpStatus.NO_CONTENT)
  unfav(@Body() dto: ItemIdDto): Promise<void> {
    return this.source().unfav(dto.itemId)
  }

  @Post('command/set-acceptable-salary')
  @HttpCode(HttpStatus.NO_CONTENT)
  setAcceptableSalary(@Body() dto: SetAcceptableSalaryDto): Promise<void> {
    return this.source().setAcceptableSalary(dto.value)
  }

  @Post('command/analyze-cv-match')
  @HttpCode(HttpStatus.NO_CONTENT)
  analyzeCvMatch(@Body() dto: AnalyzeCvMatchDto): Promise<void> {
    return this.source().analyzeCvMatch(dto.adId)
  }

  @Post('command/add-manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  addManual(@Body() dto: AddManualJobAdDto): Promise<void> {
    return this.source().addManualJobAd(dto)
  }

  @Post('command/edit-manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  editManual(@Body() dto: EditManualJobAdDto): Promise<void> {
    return this.source().editManualJobAd(dto)
  }

  @Post('command/delete-manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteManual(@Body() dto: DeleteManualJobAdDto): Promise<void> {
    return this.source().deleteManualJobAd(dto.id)
  }
}
