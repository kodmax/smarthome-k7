import { IconButton } from '@mui/material'
import { BackIcon, type StyledLucideIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC, type ReactNode } from 'react'
import {
  Actions,
  ApolloCardBottomFade,
  ApolloCardContent,
  ApolloCardContentArea,
  ApolloCardHeader,
  ApolloCardHeadingInfo,
  ApolloCardRoot,
  ApolloCardTitle,
  ApolloCardTopFade,
} from './styled'
import { ZoomCurtain } from './ZoomCurtain'

type BaseCardProps = {
  title: string
  icon: StyledLucideIcon
  children: ReactNode
  cardId: string
  height?: number
  extraHeight?: number
  allowZoom?: boolean
  onZoom?: () => void
  actions?: ReactNode
  zoomActions?: ReactNode
  headingInfo?: ReactNode
}

export const BaseCard: FC<BaseCardProps> = ({
  height = 4,
  extraHeight = 0,
  children,
  title,
  icon: Icon,
  cardId,
  onZoom,
  allowZoom = true,
  headingInfo,
  actions,
  zoomActions,
}) => {
  return (
    <ZoomCurtain cardId={cardId} allowZoom={allowZoom} onZoom={onZoom}>
      {({ zoomClose, zoom }) => {
        const showActions = actions !== undefined || (zoom && zoomActions !== undefined)

        return (
          <ApolloCardRoot zoom={zoom}>
            <ApolloCardHeader>
              {zoom ? (
                <IconButton aria-label='Back' size='small' sx={{ marginLeft: '-12px' }} onClick={zoomClose}>
                  <BackIcon size={designTokens.icon.sizeSm} strokeWidth={designTokens.icon.strokeWidth} />
                </IconButton>
              ) : null}
              <Icon
                size={designTokens.icon.sizeSm}
                strokeWidth={designTokens.icon.strokeWidth}
                glow='default'
                aria-hidden
              />
              <ApolloCardTitle variant='h3'>{title}</ApolloCardTitle>
              <ApolloCardHeadingInfo>{headingInfo}</ApolloCardHeadingInfo>
              {showActions ? (
                <Actions>
                  {actions}
                  {zoom ? zoomActions : null}
                </Actions>
              ) : null}
            </ApolloCardHeader>

            <ApolloCardContentArea zoom={zoom}>
              <ApolloCardContent
                rows={zoom ? undefined : height}
                extraHeight={zoom ? undefined : extraHeight}
                sx={zoom ? { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' } : undefined}
              >
                {children}
              </ApolloCardContent>
              <ApolloCardTopFade aria-hidden />
              <ApolloCardBottomFade aria-hidden />
            </ApolloCardContentArea>
          </ApolloCardRoot>
        )
      }}
    </ZoomCurtain>
  )
}
