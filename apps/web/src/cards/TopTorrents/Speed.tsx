import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Unit } from '@/card-components'
import { designTokens } from '@repo/design-tokens'
import type { LucideIcon } from 'lucide-react'
import { type FC } from 'react'

const iconSize = designTokens.icon.sizeXs

const formatSpeedMbitPerSec = (bytesPerSec: number): string => ((bytesPerSec * 8) / 1_000_000).toFixed(1)

const downloadFlow = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2px);
  }
`

const uploadFlow = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
`

const SpeedRoot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
`

const SpeedIcon = styled.span<{ $active: boolean; $direction: 'down' | 'up' }>`
  display: inline-flex;
  animation: ${({ $active, $direction }) =>
    $active
      ? css`
          ${$direction === 'down' ? downloadFlow : uploadFlow} 1.4s ease-in-out infinite
        `
      : 'none'};
`

const SpeedValue = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.15em;
  font-family: monospace;
`

const SpeedUnit = styled(Unit)`
  line-height: 1;
`

type SpeedProps = {
  icon: LucideIcon
  speed: number
  direction: 'down' | 'up'
}

export const Speed: FC<SpeedProps> = ({ icon: Icon, speed, direction }) => {
  const active = speed > 0

  return (
    <SpeedRoot>
      <SpeedIcon $active={active} $direction={direction}>
        <Icon size={iconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
      </SpeedIcon>
      <SpeedValue>
        {formatSpeedMbitPerSec(speed)}
        <SpeedUnit>Mb/s</SpeedUnit>
      </SpeedValue>
    </SpeedRoot>
  )
}
