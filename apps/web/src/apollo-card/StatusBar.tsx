import { CardContent } from '@mui/material'
import { styled } from '@mui/material/styles'

const StatusBar = styled(CardContent)({
  color: 'hsl(0deg 0% 50%)',
  fontSize: '0.5em',
  padding: 0,
  textAlign: 'center',
  ':last-child': {
    paddingBottom: 0,
  },
})

export default StatusBar
