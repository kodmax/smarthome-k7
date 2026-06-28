import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ticker } from '@/test/fixtures/stockMarket'
import { renderInTableRow } from '@/test/renderInTable'
import { EG } from './EG'

describe('EG', () => {
  it('renders EG percentage', () => {
    renderInTableRow(<EG ticker={ticker({ symbol: 'AAA', price: { eg: 17.6 } })} />)

    expect(screen.getByText('18%')).toBeInTheDocument()
  })

  it('renders placeholder when EG is missing', () => {
    renderInTableRow(<EG ticker={ticker({ symbol: 'BBB', price: { eg: null } })} />)

    expect(screen.getByText('--%')).toBeInTheDocument()
  })
})
