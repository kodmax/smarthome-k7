import { Box, Divider, List, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { footerNavItems, mainNavSections } from './navItems'
import { SideMenuNavItem } from './SideMenuNavItem'

type SideMenuContentProps = {
  onNavigate?: () => void
}

export const SideMenuContent: FC<SideMenuContentProps> = ({ onNavigate }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: `${designTokens.radius.md}px`,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'text.primary', lineHeight: 1 }}>K7</Typography>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: designTokens.font.bodyLarge.size, lineHeight: 1.2 }}>
            Smarthome
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: designTokens.font.bodySmall.size, lineHeight: 1.3 }}>
            Dashboard
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>
        {mainNavSections.map((section, sectionIndex) => (
          <Box key={section.title ?? `section-${sectionIndex}`}>
            {sectionIndex > 0 ? <Divider sx={{ my: 2 }} /> : null}
            {section.title !== undefined ? (
              <Typography
                sx={{
                  px: 1.5,
                  pt: sectionIndex > 0 ? 1 : 0,
                  pb: 1,
                  color: 'text.disabled',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: designTokens.font.caption.size,
                }}
              >
                {section.title}
              </Typography>
            ) : null}
            <List disablePadding>
              {section.items.map(item => (
                <SideMenuNavItem key={item.label} item={item} onNavigate={onNavigate} />
              ))}
            </List>
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List disablePadding>
          {footerNavItems.map(item => (
            <SideMenuNavItem key={item.label} item={item} onNavigate={onNavigate} />
          ))}
        </List>
      </Box>
    </Box>
  )
}
