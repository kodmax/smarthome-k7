import { Typography } from '@mui/material'
import { type FC, type ReactNode } from 'react'
import { sideMenuScaleMedia } from './sideMenuScaleMedia'

const sectionTitleSx = (isFirst: boolean) => ({
  pl: 1.5,
  pr: 3,
  pt: isFirst ? 0 : 1,
  pb: 1,
  [sideMenuScaleMedia]: {
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
  <Typography variant='sideMenuSectionLabel' sx={sectionTitleSx(isFirst)}>
    {children}
  </Typography>
)
