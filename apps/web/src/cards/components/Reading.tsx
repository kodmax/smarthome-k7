import { styled } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { FC, type ReactNode } from 'react'
import { ColorIndicator, type ColorIndicationRange } from './ColorIndication'
import { ApolloTableCell, ApolloTableRow } from './ApolloDataTable'
import Copy from './Copy'
import ValuePlaceholder from './ValuePlaceholder'

export const Unit = styled('span')({
  fontSize: '0.8em',
  color: designTokens.color.textSecondary,
})

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
      <ApolloTableCell>
        {colorIndicatorRange !== undefined && value !== undefined ? (
          <ColorIndicator instant={value} range={colorIndicatorRange} />
        ) : null}
        {copy !== undefined ? <Copy text={copy} /> : null}
        {displayValue}
        {unit !== undefined ? (
          <>
            {' '}
            <Unit>{unit}</Unit>
          </>
        ) : null}
      </ApolloTableCell>
    </ApolloTableRow>
  )
}
