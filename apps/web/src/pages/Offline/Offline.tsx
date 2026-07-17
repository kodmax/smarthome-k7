import { Box, Button, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { WifiOff } from 'lucide-react'
import { PageWrapper } from '@/app/components/PageWrapper'
import { useTranslations } from '@/i18n'

export const Offline: FC<Record<string, never>> = () => {
  const { t } = useTranslations()

  return (
    <PageWrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          minHeight: '60vh',
          textAlign: 'center',
          px: 2,
        }}
      >
        <WifiOff size={56} strokeWidth={designTokens.icon.strokeWidth} />
        <Typography component='h1' variant='h2'>
          {t.offline.title}
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary', maxWidth: 420 }}>
          {t.offline.description}
        </Typography>
        <Button variant='contained' size='large' onClick={() => window.location.reload()}>
          {t.offline.retry}
        </Button>
      </Box>
    </PageWrapper>
  )
}
