import { Box, Button, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { TriangleAlert } from 'lucide-react'
import { type FC } from 'react'
import { PageWrapper } from '@/app/components/PageWrapper'
import { useTranslations } from '@/i18n'

type GlobalErrorFallbackProps = {
  error: unknown
  onRetry?: () => void
}

export const GlobalErrorFallback: FC<GlobalErrorFallbackProps> = ({ error, onRetry }) => {
  const { t } = useTranslations()
  const details = error instanceof Error ? error.message : t.error.unexpected

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
        <TriangleAlert size={56} strokeWidth={designTokens.icon.strokeWidth} />
        <Typography component='h1' variant='h2'>
          {t.error.title}
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary', maxWidth: 420 }}>
          {t.error.description}
        </Typography>
        <Typography
          variant='body2'
          component='p'
          sx={{
            color: 'text.secondary',
            maxWidth: 560,
            fontFamily: 'monospace',
            wordBreak: 'break-word',
          }}
        >
          {details}
        </Typography>
        <Button variant='contained' size='large' onClick={onRetry ?? (() => window.location.reload())}>
          {t.error.retry}
        </Button>
      </Box>
    </PageWrapper>
  )
}
