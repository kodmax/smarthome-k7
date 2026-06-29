import styled from '@emotion/styled'

const ApolloDataTable = styled('table')({
  borderSpacing: 0,
  width: '100%',
  '& tr:nth-of-type(even)': {
    backgroundColor: '#fcfcfc',
  },
  '& th:first-of-type': {
    textAlign: 'left',
  },
  '& td': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& td:last-of-type': {
    textAlign: 'right',
  },
})

export default ApolloDataTable
