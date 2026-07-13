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

type ApolloCardProps = {
  title: string
  icon: StyledLucideIcon
  children: ReactNode
  cardId: string
  height?: number
  allowZoom?: boolean
  onZoom?: () => void
  actions?: ReactNode
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
  headingInfo,
  actions,
}) => {
  return (
    <ZoomCurtain cardId={cardId} allowZoom={allowZoom} onZoom={onZoom}>
      {({ zoomClose, zoom }) => (
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
            {zoom && actions !== undefined ? <Actions>{actions}</Actions> : null}
          </ApolloCardHeader>

          <ApolloCardContentArea zoom={zoom}>
            <ApolloCardContent
              rows={zoom ? undefined : height}
              sx={zoom ? { flex: '1 1 auto', minHeight: 0, overflowY: 'auto' } : undefined}
            >
              {children}
            </ApolloCardContent>
            <ApolloCardTopFade aria-hidden />
            <ApolloCardBottomFade aria-hidden />
          </ApolloCardContentArea>
        </ApolloCardRoot>
      )}
    </ZoomCurtain>
  )
}
