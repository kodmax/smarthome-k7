import { Box, Divider, List } from '@mui/material'
import { type FC } from 'react'
import { type NavSection } from './SideMenuContent'
import { SectionTitle } from './SectionTitle'
import { SideMenuNavItem } from './SideMenuNavItem'
import { sideMenuScaleMedia } from './sideMenuScaleMedia'

const mainSx = () => ({
  flex: 1,
  overflowY: 'auto',
  pl: 2,
  pr: 4,
  pb: 2,
  [sideMenuScaleMedia]: {
    pl: 3,
    pr: 6,
    pb: 3,
  },
})

const sectionDividerSx = () => ({
  my: 2,
  [sideMenuScaleMedia]: {
    my: 3,
  },
})

type SideMenuMainProps = {
  sections: NavSection[]
  onNavigate?: () => void
}

export const SideMenuMain: FC<SideMenuMainProps> = ({ sections, onNavigate }) => (
  <Box sx={mainSx}>
    {sections.map((section, sectionIndex) => (
      <Box key={section.title ?? `section-${sectionIndex}`}>
        {sectionIndex > 0 ? <Divider sx={sectionDividerSx} /> : null}
        {section.title !== undefined ? <SectionTitle isFirst={sectionIndex === 0}>{section.title}</SectionTitle> : null}
        <List disablePadding>
          {section.items.map(item => (
            <SideMenuNavItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </List>
      </Box>
    ))}
  </Box>
)
