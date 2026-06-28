import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ZoomContext, ZoomCurtain } from './ZoomCurtain'

function renderWithZoomState(allowZoom = true) {
  return render(
    <ZoomCurtain cardId='test-card' allowZoom={allowZoom}>
      <ZoomContext.Consumer>
        {zoom => (
          <span data-testid='card-surface'>
            <span data-testid='zoom-state'>{zoom.active ? 'active' : 'idle'}</span>
            <button type='button'>Inside card</button>
          </span>
        )}
      </ZoomContext.Consumer>
    </ZoomCurtain>,
  )
}

describe('ZoomCurtain', () => {
  it('toggles zoom state when the card is clicked', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 200,
      right: 300,
      left: 100,
      top: 50,
      width: 200,
      height: 150,
      x: 100,
      y: 50,
      toJSON: () => ({}),
    })

    renderWithZoomState()

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')

    fireEvent.click(screen.getByTestId('card-surface'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('active')

    fireEvent.click(screen.getByTestId('card-surface'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')
  })

  it('does not zoom when allowZoom is false', () => {
    renderWithZoomState(false)

    fireEvent.click(screen.getByTestId('card-surface'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')
  })

  it('ignores clicks on interactive elements', () => {
    renderWithZoomState()

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')
  })
})
