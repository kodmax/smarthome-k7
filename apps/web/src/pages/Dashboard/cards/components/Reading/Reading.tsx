import { type FC, type ReactNode } from 'react'
import { type ColorIndicationRange } from '../ColorIndication'
import { ApolloTableCell, ApolloTableRow, ApolloValueCell } from '../ApolloDataTable'
import ValuePlaceholder from '../ValuePlaceholder'
import { ReadingValue } from './ReadingValue'

type Props = {
  title: string
  graph?: ReactNode
  extraInfo?: ReactNode
  colorIndicatorRange?: ColorIndicationRange
  value?: number
  displayValue: string | undefined
  unit?: string
  copy?: string
}

export const Reading: FC<Props> = ({
  title,
  graph,
  extraInfo,
  displayValue,
  colorIndicatorRange,
  value,
  unit,
  copy,
}) => {
  if (displayValue === undefined) {
    return <ValuePlaceholder label={title} />
  }

  return (
    <ApolloTableRow>
      <ApolloTableCell>{title}</ApolloTableCell>
      <ApolloTableCell>{graph}</ApolloTableCell>
      <ApolloTableCell>{extraInfo}</ApolloTableCell>
      <ApolloValueCell sx={{ width: '56em' }}>
        <ReadingValue
          displayValue={displayValue}
          unit={unit}
          colorIndicatorRange={colorIndicatorRange}
          value={value}
          copy={copy}
        />
      </ApolloValueCell>
    </ApolloTableRow>
  )
}
