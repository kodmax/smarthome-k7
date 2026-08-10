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
} from './job-ads.commands.dto'

@Controller('data-sources/job-ads/command')
export class JobAdsCommandsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): JobAdsSource {
    return this.dataSources.get('jobAds')
  }

  @Post('change-state')
  @HttpCode(HttpStatus.NO_CONTENT)
  changeState(@Body() dto: ChangeStateDto): Promise<void> {
    return this.source().changeState(dto)
  }

  @Post('fav')
  @HttpCode(HttpStatus.NO_CONTENT)
  fav(@Body() dto: ItemIdDto): Promise<void> {
    return this.source().fav(dto.itemId)
  }

  @Post('unfav')
  @HttpCode(HttpStatus.NO_CONTENT)
  unfav(@Body() dto: ItemIdDto): Promise<void> {
    return this.source().unfav(dto.itemId)
  }

  @Post('set-acceptable-salary')
  @HttpCode(HttpStatus.NO_CONTENT)
  setAcceptableSalary(@Body() dto: SetAcceptableSalaryDto): Promise<void> {
    return this.source().setAcceptableSalary(dto.value)
  }

  @Post('analyze-cv-match')
  @HttpCode(HttpStatus.NO_CONTENT)
  analyzeCvMatch(@Body() dto: AnalyzeCvMatchDto): Promise<void> {
    return this.source().analyzeCvMatch(dto.adId)
  }

  @Post('add-manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  addManual(@Body() dto: AddManualJobAdDto): Promise<void> {
    return this.source().addManualJobAd(dto)
  }

  @Post('edit-manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  editManual(@Body() dto: EditManualJobAdDto): Promise<void> {
    return this.source().editManualJobAd(dto)
  }

  @Post('delete-manual')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteManual(@Body() dto: DeleteManualJobAdDto): Promise<void> {
    return this.source().deleteManualJobAd(dto.id)
  }
}
