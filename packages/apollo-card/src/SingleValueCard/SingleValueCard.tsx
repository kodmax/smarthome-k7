import { Typography } from '@mui/material'
import { type StyledLucideIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC, type ReactNode } from 'react'
import { BaseCard } from '../BaseCard'

export type SingleValueCardProps = {
  cardId: string
  icon: StyledLucideIcon
  title: string
  primary: ReactNode
  secondary?: ReactNode
  secondaryColor?: string
  tertiary?: ReactNode
  height?: number
  headingInfo?: ReactNode
}

export const SingleValueCard: FC<SingleValueCardProps> = ({
  cardId,
  icon,
  title,
  primary,
  secondary,
  secondaryColor = 'text.secondary',
  tertiary,
  height = 4,
  headingInfo,
}) => {
  return (
    <BaseCard cardId={cardId} title={title} icon={icon} height={height} allowZoom={false} headingInfo={headingInfo}>
      <Typography
        sx={{
          fontSize: designTokens.font.h1.size,
          fontWeight: designTokens.font.h1.weight,
          lineHeight: designTokens.font.h1.lineHeight,
          mb: 3,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {primary}
      </Typography>

      {secondary !== undefined ? (
        <Typography variant='body2' sx={{ color: secondaryColor, fontWeight: 600, mb: tertiary !== undefined ? 0.5 : 0 }}>
          {secondary}
        </Typography>
      ) : null}

      {tertiary !== undefined ? (
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          {tertiary}
        </Typography>
      ) : null}
    </BaseCard>
  )
}
