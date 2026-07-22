import { Box } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { getTechnologyLogoUrl } from '@/assets/technology-logos/technologyLogos'
import { getPopularTechnologyPresentation } from './popularTechnologyPresentation'

type TechnologyLogoProps = {
  id: string
  name: string
}

export const TechnologyLogo: FC<TechnologyLogoProps> = ({ id, name }) => {
  const logoUrl = getTechnologyLogoUrl(id)

  if (logoUrl !== undefined) {
    return (
      <Box
        component='img'
        src={logoUrl}
        alt=''
        aria-hidden
        sx={{
          width: 24,
          height: 24,
          flexShrink: 0,
          objectFit: 'contain',
        }}
      />
    )
  }

  const presentation = getPopularTechnologyPresentation(id)

  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: `${designTokens.radius.sm}px`,
        bgcolor: presentation.color,
        color: id === 'javascript' ? 'text.primary' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
      }}
      aria-label={name}
    >
      {presentation.abbreviation}
    </Box>
  )
}
