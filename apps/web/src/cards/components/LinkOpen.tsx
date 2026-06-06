import { styled } from '@mui/material'
import { type FC } from 'react'
import icon from './open-in-new-window.png'

const A = styled('a')({
  backgroundImage: `url('${icon}')`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  verticalAlign: 'text-bottom',
  display: 'inline-block',
  width: '1em',
  height: '1em',
})

const LinkOpen: FC<{ href: string }> = ({ href }) => {
  return <A href={href} target='_blank' />
}

export default LinkOpen
