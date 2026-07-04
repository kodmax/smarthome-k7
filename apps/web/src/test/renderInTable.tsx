import { Table, TableBody, TableRow } from '@mui/material'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { type ReactElement } from 'react'

export function renderInTableRow(ui: ReactElement, options?: RenderOptions): RenderResult {
  return render(
    <Table>
      <TableBody>
        <TableRow>{ui}</TableRow>
      </TableBody>
    </Table>,
    options,
  )
}

export function renderInTableBody(ui: ReactElement, options?: RenderOptions): RenderResult {
  return render(
    <Table>
      <TableBody>{ui}</TableBody>
    </Table>,
    options,
  )
}
