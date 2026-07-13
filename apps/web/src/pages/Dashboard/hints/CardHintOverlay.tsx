import { Box, Fade, Portal, Slide, Typography } from '@mui/material'
import { below2xlSideMenuScaleMediaQuery, designTokens, scaleBelow2xl } from '@repo/design-tokens'
import { type FC, useEffect, useState } from 'react'
import type { ActiveCardHint } from './cardHintTypes'

const { font, space } = designTokens

const HINT_Z_INDEX = 1400

type CardHintOverlayProps = {
  hint: ActiveCardHint | null
  dismissMs: number
  onDismiss: () => void
}

export const CardHintOverlay: FC<CardHintOverlayProps> = ({ hint, dismissMs, onDismiss }) => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState<ActiveCardHint | null>(null)

  useEffect(() => {
    if (hint === null) {
      setVisible(false)
      return
    }

    setContent(hint)
    setVisible(true)

    const timer = setTimeout(onDismiss, dismissMs)

    return () => clearTimeout(timer)
  }, [hint, dismissMs, onDismiss])

  const descriptionLines = Array.isArray(content?.content.description)
    ? content.content.description
    : [content?.content.description ?? '']

  return (
    <Portal>
      <Fade in={visible} onExited={() => setContent(null)}>
        <Box
          sx={{
            position: 'fixed',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            zIndex: HINT_Z_INDEX,
            width: 'min(520px, calc(100vw - 48px))',
            pointerEvents: 'none',
          }}
        >
          <Slide direction='up' in={visible} mountOnEnter unmountOnExit>
            <Box
              key={content?.id}
              role='status'
              aria-live='polite'
              sx={theme => ({
                position: 'relative',
                overflow: 'hidden',
                borderRadius: `${designTokens.radius.md}px`,
                backgroundColor: theme.vars.palette.background.paper,
                backdropFilter: 'blur(12px)',
                boxShadow: theme.shadows[8],
                display: 'flex',
                alignItems: 'center',
                gap: space[3],
                px: space[3],
                py: space[2],
                '@keyframes card-hint-progress': {
                  from: { transform: 'scaleX(1)' },
                  to: { transform: 'scaleX(0)' },
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  height: 3,
                  width: '100%',
                  transformOrigin: 'left center',
                  backgroundColor: theme.vars.palette.success.main,
                  animation: `card-hint-progress ${dismissMs}ms linear forwards`,
                },
              })}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant='subtitle2'
                  sx={{
                    fontWeight: 600,
                    [below2xlSideMenuScaleMediaQuery]: {
                      fontSize: scaleBelow2xl(font.bodySmall.size),
                    },
                  }}
                >
                  {content?.content.title}
                </Typography>
                {descriptionLines.map((line, index) =>
                  line ? (
                    <Typography
                      key={index}
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        mt: index === 0 ? 0.5 : 0.25,
                        [below2xlSideMenuScaleMediaQuery]: {
                          fontSize: scaleBelow2xl(font.bodySmall.size),
                        },
                      }}
                    >
                      {line}
                    </Typography>
                  ) : null,
                )}
              </Box>
              <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>{content?.content.icon}</Box>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </Portal>
  )
}
