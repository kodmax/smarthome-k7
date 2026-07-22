import { ListIcon } from '@repo/assets'
import { describe, expect, it } from 'vitest'
import { ApolloCardAction } from './ApolloCardAction'
import { BaseCard } from './BaseCard'
import { ZoomStateProvider } from './ZoomStateProvider'
import { renderWithTheme, screen } from './test/test-utils'

describe('BaseCard', () => {
  it('shows actions outside zoom mode', () => {
    renderWithTheme(
      <ZoomStateProvider>
        <BaseCard
          cardId='no-zoom-card'
          title='Popular technologies'
          icon={ListIcon}
          allowZoom={false}
          actions={<ApolloCardAction title='Edit preferences' onClick={() => undefined} Icon={ListIcon} />}
        >
          Content
        </BaseCard>
      </ZoomStateProvider>,
    )

    expect(screen.getByRole('button', { name: 'Edit preferences' })).toBeInTheDocument()
  })

  it('hides zoomActions outside zoom mode', () => {
    renderWithTheme(
      <ZoomStateProvider>
        <BaseCard
          cardId='zoom-card'
          title='Jobs'
          icon={ListIcon}
          zoomActions={<ApolloCardAction title='Edit preferences' onClick={() => undefined} Icon={ListIcon} />}
        >
          Content
        </BaseCard>
      </ZoomStateProvider>,
    )

    expect(screen.queryByRole('button', { name: 'Edit preferences' })).not.toBeInTheDocument()
  })
})
