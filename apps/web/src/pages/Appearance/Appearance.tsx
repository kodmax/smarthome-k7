import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { iconStyles, SunMoonIcon } from '@repo/assets'
import { type FC, type MouseEvent } from 'react'
import { PageHeader } from '@/app/components/PageHeader'
import { PageWrapper } from '@/app/components/PageWrapper'
import { type AppColorMode } from '@/app/theme/colorMode'

export const Appearance: FC<Record<string, never>> = () => {
  const { mode, setMode } = useColorScheme()

  const handleModeChange = (_event: MouseEvent<HTMLElement>, value: AppColorMode | null) => {
    if (value !== null) {
      setMode(value)
    }
  }

  const selectedMode: AppColorMode = mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'system'

  return (
    <PageWrapper>
      <PageHeader
        icon={SunMoonIcon}
        iconColor={iconStyles.fav.color}
        title='Wygląd'
        description='Ustawienia wyglądu aplikacji.'
      />

      <Box>
        <Typography variant='h3' sx={{ mb: 2 }}>
          Motyw
        </Typography>
        <ToggleButtonGroup exclusive value={selectedMode} onChange={handleModeChange} aria-label='Motyw aplikacji'>
          <ToggleButton value='system' aria-label='Motyw systemowy'>
            Systemowy
          </ToggleButton>
          <ToggleButton value='light' aria-label='Jasny motyw'>
            Jasny
          </ToggleButton>
          <ToggleButton value='dark' aria-label='Ciemny motyw'>
            Ciemny
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </PageWrapper>
  )
}
