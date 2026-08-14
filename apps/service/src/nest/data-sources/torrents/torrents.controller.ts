import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { TorrentSource } from '@/data-sources/the-pirate-bay'
import { DataSourceRegistryType } from '@/data-sources'
import { SearchTorrentsDto } from './torrents.dto'

@Controller('data-sources/torrents')
export class TorrentsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): TorrentSource {
    return this.dataSources.get('torrents')
  }

  @Post('command/search')
  @HttpCode(HttpStatus.NO_CONTENT)
  search(@Body() dto: SearchTorrentsDto): Promise<void> {
    return this.source().search(dto.query)
  }
}
