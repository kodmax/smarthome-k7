import { styled } from '@mui/material'
import { IconLink } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'

const { icon } = designTokens

const Link = styled('a')({
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  lineHeight: 0,
  color: 'inherit',
  textDecoration: 'none',
})

const LinkOpen: FC<{ href: string }> = ({ href }) => {
  return (
    <Link href={href} target='_blank' rel='noopener noreferrer'>
      <IconLink size={icon.sizeXs} strokeWidth={icon.strokeWidth} aria-hidden />
    </Link>
  )
}

export default LinkOpen
