'use client'

import { Box, Button, Typography } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC } from 'react'
import { PageWrapper } from '@/app/shell/components/PageWrapper'
import { useTranslations } from '@/i18n'

export const NotFoundScreen: FC = () => {
  const { t } = useTranslations()
  const pathname = usePathname()

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
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <Box
            sx={theme => ({
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: '50%',
              bgcolor: `${theme.vars.palette.temperature.main}18`,
            })}
          />
          <Typography
            component='p'
            aria-hidden
            sx={theme => ({
              fontSize: { xs: '5.5rem', sm: '7rem' },
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: `linear-gradient(135deg, ${theme.vars.palette.temperature.main}, ${theme.vars.palette.text.secondary})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            })}
          >
            404
          </Typography>
        </Box>

        <Typography component='h1' variant='h2'>
          {t.notFound.title}
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary', maxWidth: 420 }}>
          {t.notFound.description}
        </Typography>
        <Typography
          variant='body2'
          component='p'
          sx={{
            color: 'text.secondary',
            maxWidth: 560,
            fontFamily: 'monospace',
            wordBreak: 'break-word',
            opacity: 0.8,
          }}
        >
          {pathname}
        </Typography>
        <Button
          component={Link}
          href='/dashboard'
          variant='contained'
          size='large'
          startIcon={<Home size={20} strokeWidth={designTokens.icon.strokeWidth} />}
        >
          {t.notFound.backHome}
        </Button>
      </Box>
    </PageWrapper>
  )
}
