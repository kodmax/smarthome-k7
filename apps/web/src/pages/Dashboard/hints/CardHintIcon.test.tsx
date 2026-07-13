import { WindIcon } from '@repo/assets'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CardHintIcon } from './CardHintIcon'
import { CardHintContext } from './CardHintContext'

describe('CardHintIcon', () => {
  it('calls showHint with title and description on click', () => {
    const showHint = vi.fn()

    render(
      <CardHintContext.Provider value={{ hint: null, showHint, hideHint: vi.fn() }}>
        <CardHintIcon Icon={WindIcon} variant='info' title='Silny wiatr' description={['6 m/s', 'Wiatr jest silny.']} />
      </CardHintContext.Provider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Silny wiatr' }))

    expect(showHint).toHaveBeenCalledWith({
      title: 'Silny wiatr',
      description: ['6 m/s', 'Wiatr jest silny.'],
      icon: expect.anything(),
    })
  })
})
