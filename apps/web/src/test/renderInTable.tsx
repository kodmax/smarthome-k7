import { Table, TableBody, TableRow } from '@mui/material'
import { type ReactElement } from 'react'
import { renderWithTheme, type RenderOptions, type RenderResult } from './test-utils'

export function renderInTableRow(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult {
  return renderWithTheme(
    <Table>
      <TableBody>
        <TableRow>{ui}</TableRow>
      </TableBody>
    </Table>,
    options,
  )
}

export function renderInTableBody(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult {
  return renderWithTheme(
    <Table>
      <TableBody>{ui}</TableBody>
    </Table>,
    options,
  )
}
