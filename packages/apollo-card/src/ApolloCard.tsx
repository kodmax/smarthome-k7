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
import { ZoomCurtain } from './ZoomCurtain'
import { useZoom } from './useZoom'

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

export const ApolloCard: FC<ApolloCardProps> = ({
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
  const zoom = useZoom(cardId)
  return (
    <ZoomCurtain cardId={cardId} allowZoom={allowZoom} onZoom={onZoom}>
      <ApolloCardRoot zoom={zoom}>
        <ApolloCardHeader>
          <Icon
            size={designTokens.icon.sizeSm}
            strokeWidth={designTokens.icon.strokeWidth}
            glow='default'
            aria-hidden
          />
          <ApolloCardTitle variant='h3'>{title}</ApolloCardTitle>
          <ApolloCardHeadingInfo>{headingInfo}</ApolloCardHeadingInfo>
          {zoom && onEditPreferences !== undefined ? (
            <Actions>
              <IconButton aria-label='Edit preferences' onClick={onEditPreferences} size='small'>
                <SettingsIcon size={designTokens.icon.sizeSm} strokeWidth={designTokens.icon.strokeWidth} />
              </IconButton>
            </Actions>
          ) : null}
        </ApolloCardHeader>

        <ApolloCardContent
          sx={
            zoom ? { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' } : { height: apolloCardContentHeight(height) }
          }
        >
          {children}
        </ApolloCardContent>
      </ApolloCardRoot>
    </ZoomCurtain>
  )
}
