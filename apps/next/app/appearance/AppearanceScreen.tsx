'use client'

import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { iconStyles, SunMoonIcon } from '@repo/assets'
import { type AppColorMode } from '@repo/styles'
import { type FC, type MouseEvent } from 'react'
import { PageHeader } from '@/app/shell/components/PageHeader'
import { PageWrapper } from '@/app/shell/components/PageWrapper'
import { APP_LOCALES, type AppLocale, LOCALE_LABELS, useLocale, useTranslations } from '@/i18n'

type AppearanceScreenProps = Record<string, never>

export const AppearanceScreen: FC<AppearanceScreenProps> = () => {
  const { mode, setMode } = useColorScheme()
  const { locale, setLocale } = useLocale()
  const { t } = useTranslations()

  const handleModeChange = (_event: MouseEvent<HTMLElement>, value: AppColorMode | null) => {
    if (value !== null) {
      setMode(value)
    }
  }

  const handleLocaleChange = (_event: MouseEvent<HTMLElement>, value: AppLocale | null) => {
    if (value !== null) {
      setLocale(value)
    }
  }

  const selectedMode: AppColorMode = mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'system'

  return (
    <PageWrapper>
      <PageHeader
        icon={SunMoonIcon}
        iconColor={iconStyles.fav.color}
        title={t.appearance.title}
        description={t.appearance.description}
      />

      <Box sx={{ mb: 4 }}>
        <Typography variant='h3' sx={{ mb: 2 }}>
          {t.appearance.theme}
        </Typography>
        <ToggleButtonGroup
          exclusive
          size='large'
          value={selectedMode}
          onChange={handleModeChange}
          aria-label={t.appearance.themeAriaLabel}
        >
          <ToggleButton value='system' aria-label={t.appearance.systemAriaLabel}>
            {t.appearance.system}
          </ToggleButton>
          <ToggleButton value='light' aria-label={t.appearance.lightAriaLabel}>
            {t.appearance.light}
          </ToggleButton>
          <ToggleButton value='dark' aria-label={t.appearance.darkAriaLabel}>
            {t.appearance.dark}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant='h3' sx={{ mb: 2 }}>
          {t.appearance.language}
        </Typography>
        <ToggleButtonGroup
          exclusive
          size='large'
          value={locale}
          onChange={handleLocaleChange}
          aria-label={t.appearance.languageAriaLabel}
        >
          {APP_LOCALES.map(appLocale => (
            <ToggleButton key={appLocale} value={appLocale} aria-label={LOCALE_LABELS[appLocale]}>
              {LOCALE_LABELS[appLocale]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </PageWrapper>
  )
}
