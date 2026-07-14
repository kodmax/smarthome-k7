import { Box, Fade, Portal, Slide, Typography } from '@mui/material'
import { below2xlSideMenuScaleMediaQuery, designTokens, scaleBelow2xl } from '@repo/design-tokens'
import { apolloCardHintIconSize } from '@repo/apollo-card'
import { type FC, useEffect, useState } from 'react'
import { APP_HINT_AUTO_DISMISS_MS, type ActiveAppHint } from './appHintTypes'
import { useAppHint } from './useAppHint'

const { font, space } = designTokens

const HINT_Z_INDEX = 1400

type AppHintViewProps = {
  hint: ActiveAppHint | null
  dismissMs: number
  onDismiss: () => void
}

export const AppHintView: FC<AppHintViewProps> = ({ hint, dismissMs, onDismiss }) => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState<ActiveAppHint | null>(null)

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
            right: space[6],
            bottom: space[6] + space[12],
            zIndex: HINT_Z_INDEX,
            width: 'max-content',
            maxWidth: `min(75vw, calc(100vw - ${space[12]}px))`,
            pointerEvents: 'none',
          }}
        >
          <Slide direction='up' in={visible} mountOnEnter unmountOnExit>
            <Box
              key={content?.id}
              role='status'
              aria-live='polite'
              onClick={onDismiss}
              sx={theme => ({
                borderRadius: `${designTokens.radius.md}px`,
                border: '1px solid',
                borderColor: theme.vars.palette.borderStrong.main,
                backgroundColor: theme.vars.palette.surfaceElevated.main,
                backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.surfaceElevated.main} 0%, ${theme.vars.palette.background.paper} 65%)`,
                backdropFilter: 'blur(12px)',
                boxShadow: theme.shadows[12],
                display: 'flex',
                alignItems: 'center',
                gap: space[3],
                pl: space[1] * 1.5,
                pr: space[1],
                py: space[1],
                pointerEvents: 'auto',
                cursor: 'pointer',
                [below2xlSideMenuScaleMediaQuery]: {
                  gap: scaleBelow2xl(space[3]),
                  pl: scaleBelow2xl(space[1] * 1.5),
                  pr: scaleBelow2xl(space[1]),
                  py: scaleBelow2xl(space[1]),
                },
              })}
            >
              <Box sx={{ flex: '0 1 auto', minWidth: 0 }}>
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: space[1],
                    [below2xlSideMenuScaleMediaQuery]: {
                      gap: scaleBelow2xl(space[1]),
                    },
                  }}
                >
                  {descriptionLines.map((line, index) =>
                    line ? (
                      <Typography
                        key={index}
                        variant='body2'
                        color='text.secondary'
                        sx={{
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
              </Box>
              <Box
                sx={{
                  flex: '0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  [below2xlSideMenuScaleMediaQuery]: {
                    '& svg': {
                      width: scaleBelow2xl(apolloCardHintIconSize),
                      height: scaleBelow2xl(apolloCardHintIconSize),
                    },
                  },
                }}
              >
                {content?.content.icon}
              </Box>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </Portal>
  )
}

export const AppHint: FC<Record<string, never>> = () => {
  const { activeHint, hideHint } = useAppHint()

  return <AppHintView hint={activeHint} dismissMs={APP_HINT_AUTO_DISMISS_MS} onDismiss={hideHint} />
}
