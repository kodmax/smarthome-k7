import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { NewsSource } from '@/data-sources/news'
import { DataSourceRegistryType } from '@/data-sources'
import { NewsItemUidDto } from './news.commands.dto'

@Controller('data-sources/news/command')
export class NewsCommandsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): NewsSource {
    return this.dataSources.get('news')
  }

  @Post('read')
  @HttpCode(HttpStatus.NO_CONTENT)
  read(@Body() dto: NewsItemUidDto): Promise<void> {
    return this.source().read(dto.itemUid)
  }

  @Post('unread')
  @HttpCode(HttpStatus.NO_CONTENT)
  unread(@Body() dto: NewsItemUidDto): Promise<void> {
    return this.source().unread(dto.itemUid)
  }
}
