import { TableBody } from '@mui/material'
import { type FC } from 'react'
import ApolloDataTable, { ApolloTableCell, ApolloTableRow, ApolloValueCell } from './ApolloDataTable'

const TablePlaceholder: FC<{ rows: number; graph: boolean; value: boolean }> = ({ rows, graph, value }) => {
  return (
    <ApolloDataTable>
      <TableBody>
        {[...new Array(rows).keys()].map(i => (
          <ApolloTableRow key={i}>
            <ApolloTableCell>
              <span
                style={{
                  background: 'hsl(0deg 0% 50% / 10%)',
                  width: graph ? '50%' : value ? '80%' : '100%',
                  display: 'inline-block',
                }}
              >
                &nbsp;
              </span>
            </ApolloTableCell>
            {!graph ? null : (
              <ApolloTableCell sx={{ width: '4em' }}>
                <span style={{ background: 'hsl(0deg 0% 50% / 10%)', width: '80%', display: 'inline-block' }}>
                  &nbsp;
                </span>
              </ApolloTableCell>
            )}
            {!value ? null : (
              <ApolloValueCell sx={{ width: '20%' }}>
                <span style={{ background: 'hsl(0deg 0% 50% / 10%)', width: '80%', display: 'inline-block' }}>
                  &nbsp;
                </span>
              </ApolloValueCell>
            )}
          </ApolloTableRow>
        ))}
      </TableBody>
    </ApolloDataTable>
  )
}

export default TablePlaceholder
