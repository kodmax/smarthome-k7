import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { MySkillsSource } from '@/data-sources/my-skills/MySkillsSource'
import { DataSourceRegistryType } from '@/data-sources'
import { SetSkillCommentDto, SetSkillLevelDto } from './my-skills.dto'

@Controller('data-sources/my-skills')
export class MySkillsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): MySkillsSource {
    return this.dataSources.get('mySkills')
  }

  @Post('command/set-skill-level')
  @HttpCode(HttpStatus.NO_CONTENT)
  setSkillLevel(@Body() dto: SetSkillLevelDto): Promise<void> {
    return this.source().setSkillLevel(dto)
  }

  @Post('command/set-skill-comment')
  @HttpCode(HttpStatus.NO_CONTENT)
  setSkillComment(@Body() dto: SetSkillCommentDto): Promise<void> {
    return this.source().setSkillComment(dto)
  }
}
