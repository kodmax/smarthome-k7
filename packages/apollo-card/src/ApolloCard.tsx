import { IconButton } from '@mui/material'
import { SettingsIcon, type StyledLucideIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC, type ReactNode } from 'react'
import {
  Actions,
  ApolloCardContent,
  ApolloCardHeader,
  ApolloCardHeadingInfo,
  ApolloCardRoot,
  ApolloCardTitle,
  apolloCardContentHeight,
} from './styled'
import { ZoomContext } from './ZoomContext/ZoomContext'
import { ZoomCurtain } from './ZoomContext/ZoomCurtain'

type ApolloCardProps = {
  title: string
  icon: StyledLucideIcon
  children: ReactNode
  cardId: string
  height?: number
  allowZoom?: boolean
  onZoom?: () => void
  onEditPreferences?: () => void
  headingInfo?: ReactNode
}

const ApolloCard: FC<ApolloCardProps> = ({
  height = 4,
  children,
  title,
  icon: Icon,
  cardId,
  onZoom,
  allowZoom = true,
  onEditPreferences,
  headingInfo,
}) => {
  return (
    <ZoomCurtain cardId={cardId} allowZoom={allowZoom} onZoom={onZoom}>
      <ZoomContext.Consumer>
        {zoom => (
          <ApolloCardRoot zoom={zoom.active}>
            <ApolloCardHeader>
              <Icon
                size={designTokens.icon.sizeSm}
                strokeWidth={designTokens.icon.strokeWidth}
                glow='default'
                aria-hidden
              />
              <ApolloCardTitle variant='h3'>{title}</ApolloCardTitle>
              <ApolloCardHeadingInfo>{headingInfo}</ApolloCardHeadingInfo>
              {zoom.active && onEditPreferences !== undefined ? (
                <Actions>
                  <IconButton aria-label='Edit preferences' onClick={onEditPreferences} size='small'>
                    <SettingsIcon size={designTokens.icon.sizeSm} strokeWidth={designTokens.icon.strokeWidth} />
                  </IconButton>
                </Actions>
              ) : null}
            </ApolloCardHeader>

            <ApolloCardContent
              sx={
                zoom.active
                  ? { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }
                  : { height: apolloCardContentHeight(height) }
              }
            >
              {children}
            </ApolloCardContent>
          </ApolloCardRoot>
        )}
      </ZoomContext.Consumer>
    </ZoomCurtain>
  )
}

export default ApolloCard
