import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { type FC, type MouseEvent } from 'react'
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
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant='h1' sx={{ mb: 1 }}>
        Wygląd
      </Typography>
      <Typography variant='body1' sx={{ color: 'text.secondary', mb: 4 }}>
        Ustawienia wyglądu aplikacji.
      </Typography>

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
    </Box>
  )
}
