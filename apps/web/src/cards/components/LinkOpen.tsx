import { styled } from '@mui/material'
import { IconLink } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { ApolloTableCell } from './ApolloDataTable'

const { icon } = designTokens

const OpenCell = styled(ApolloTableCell)({
  verticalAlign: 'middle',
  boxSizing: 'border-box',
  width: '1em',
  textOverflow: 'clip',
})

const Link = styled('a')({
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  lineHeight: 0,
  color: 'inherit',
  textDecoration: 'none',
})

const LinkOpen: FC<{ href: string; onClick?: () => void }> = ({ href, onClick }) => {
  return (
    <OpenCell>
      <Link href={href} target='_blank' rel='noopener noreferrer' onClick={onClick}>
        <IconLink size={icon.sizeXs - 4} strokeWidth={icon.strokeWidth} aria-hidden />
      </Link>
    </OpenCell>
  )
}

export default LinkOpen
