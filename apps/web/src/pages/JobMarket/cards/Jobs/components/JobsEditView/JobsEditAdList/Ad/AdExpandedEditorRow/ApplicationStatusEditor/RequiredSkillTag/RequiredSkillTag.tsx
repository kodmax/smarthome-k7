import { Box } from '@mui/material'
import { MySkill } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'
import { Tag } from '@/card-components'
import { SkillLevelIcon, skillLevelIconDefaultSize } from '@/components/SkillLevelIcon'

type Props = {
  skill: string
  mySkill: MySkill | undefined
}

export const RequiredSkillTag: FC<Props> = ({ skill, mySkill }) => (
  <Tag variant='neutral'>
    <Box
      component='span'
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${designTokens.space[1]}px`,
      }}
    >
      {skill}
      {mySkill !== undefined ? <SkillLevelIcon level={mySkill.level} size={skillLevelIconDefaultSize} /> : null}
    </Box>
  </Tag>
)
