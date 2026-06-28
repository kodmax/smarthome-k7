import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { type ReactElement } from 'react'

export function renderInTableRow(ui: ReactElement, options?: RenderOptions): RenderResult {
  return render(
    <table>
      <tbody>
        <tr>{ui}</tr>
      </tbody>
    </table>,
    options,
  )
}

export function renderInTableBody(ui: ReactElement, options?: RenderOptions): RenderResult {
  return render(
    <table>
      <tbody>{ui}</tbody>
    </table>,
    options,
  )
}
