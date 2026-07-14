import { WindIcon } from '@repo/assets'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppHintContext } from './AppHintContext'
import { CardHintIcon } from './CardHintIcon'

describe('CardHintIcon', () => {
  it('calls showHint with title and description on click', () => {
    const showHint = vi.fn()

    render(
      <AppHintContext.Provider value={{ activeHint: null, showHint, hideHint: vi.fn() }}>
        <CardHintIcon Icon={WindIcon} variant='info' title='Silny wiatr' description={['6 m/s', 'Wiatr jest silny.']} />
      </AppHintContext.Provider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Silny wiatr' }))

    expect(showHint).toHaveBeenCalledWith({
      title: 'Silny wiatr',
      description: ['6 m/s', 'Wiatr jest silny.'],
      icon: expect.anything(),
    })
  })
})
