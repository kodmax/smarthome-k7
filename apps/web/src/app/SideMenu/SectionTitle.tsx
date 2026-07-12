import { Typography } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { type FC, type ReactNode } from 'react'

const below2xl = (theme: Theme) => theme.breakpoints.down('2xl')

const sectionTitleSx = (theme: Theme, isFirst: boolean) => ({
  pl: 1.5,
  pr: 3,
  pt: isFirst ? 0 : 1,
  pb: 1,
  [below2xl(theme)]: {
    pl: 2.25,
    pr: 4.5,
    pt: isFirst ? 0 : 1.5,
    pb: 1.5,
  },
})

type SectionTitleProps = {
  children: ReactNode
  isFirst?: boolean
}

export const SectionTitle: FC<SectionTitleProps> = ({ children, isFirst = false }) => (
  <Typography variant='sideMenuSectionLabel' sx={theme => sectionTitleSx(theme, isFirst)}>
    {children}
  </Typography>
)
