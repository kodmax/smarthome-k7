import { act, fireEvent, renderWithTheme as render, screen } from '../test/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZOOM_AUTO_DISMISS_MS, ZOOM_EXPAND_DURATION_MS } from './zoomConstants'
import { ZoomCurtain } from './ZoomCurtain'
import { ZoomStateProvider } from '../ZoomStateProvider'
import { useZoom } from '../useZoom'

const cardId = 'test-card'

function CardSurface() {
  const zoom = useZoom(cardId)

  return (
    <span data-testid='card-surface'>
      <span data-testid='zoom-state'>{zoom ? 'active' : 'idle'}</span>
      <button type='button'>Inside card</button>
    </span>
  )
}

function mockBoundingClientRect() {
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
}

function renderWithZoomState(allowZoom = true) {
  return render(
    <ZoomStateProvider>
      <ZoomCurtain cardId={cardId} allowZoom={allowZoom}>
        <CardSurface />
      </ZoomCurtain>
    </ZoomStateProvider>,
  )
}

describe('ZoomCurtain', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('opens zoom on card click and closes it when clicking outside the card', () => {
    vi.useFakeTimers()
    mockBoundingClientRect()

    renderWithZoomState()

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')

    fireEvent.click(screen.getByTestId('card-surface'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('active')

    fireEvent.click(screen.getByTestId('card-surface'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('active')

    fireEvent.click(screen.getByTestId('zoom-curtain'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('active')

    act(() => {
      vi.advanceTimersByTime(ZOOM_EXPAND_DURATION_MS)
    })

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')
  })

  it('closes zoom when clicking the active wrapper outside the card surface', () => {
    vi.useFakeTimers()
    mockBoundingClientRect()

    renderWithZoomState()

    fireEvent.click(screen.getByTestId('card-surface'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('active')

    fireEvent.click(screen.getByTestId('zoom-wrapper'))

    act(() => {
      vi.advanceTimersByTime(ZOOM_EXPAND_DURATION_MS)
    })

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

  it('auto-dismisses zoom after expand animation plus configured dismiss delay', () => {
    vi.useFakeTimers()
    mockBoundingClientRect()

    renderWithZoomState()

    fireEvent.click(screen.getByTestId('card-surface'))

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('active')

    const autoDismissDelay = ZOOM_EXPAND_DURATION_MS + ZOOM_AUTO_DISMISS_MS

    act(() => {
      vi.advanceTimersByTime(autoDismissDelay - 1)
    })

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('active')

    act(() => {
      vi.advanceTimersByTime(1 + ZOOM_EXPAND_DURATION_MS)
    })

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')
  })

  it('cancels auto-dismiss when zoom is closed manually', () => {
    vi.useFakeTimers()
    mockBoundingClientRect()

    renderWithZoomState()

    fireEvent.click(screen.getByTestId('card-surface'))

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    fireEvent.click(screen.getByTestId('zoom-curtain'))

    act(() => {
      vi.advanceTimersByTime(ZOOM_EXPAND_DURATION_MS)
    })

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(screen.getByTestId('zoom-state')).toHaveTextContent('idle')
  })
})
