import { Box } from '@mui/material'
import { ListIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { describe, expect, it } from 'vitest'
import { ApolloCardAction } from './ApolloCardAction'
import { BaseCard } from './BaseCard'
import { apolloCardContentHeight } from './styled'
import { ZoomStateProvider } from './ZoomStateProvider'
import { renderWithTheme, screen } from './test/test-utils'

describe('BaseCard', () => {
  it('applies extraHeight to the content area', () => {
    const { container } = renderWithTheme(
      <ZoomStateProvider>
        <BaseCard cardId='extra-height-card' title='Jobs' icon={ListIcon} allowZoom={false} height={7} extraHeight={12}>
          Content
        </BaseCard>
      </ZoomStateProvider>,
    )

    const content = container.querySelector('.MuiCardContent-root')

    expect(content).toHaveStyle({ height: apolloCardContentHeight(7, 12) })
  })

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

  it('keeps header icon size and truncates long titles in narrow cards', () => {
    const longTitle = 'Very long card title that should truncate with ellipsis'

    const { container } = renderWithTheme(
      <Box sx={{ width: 120 }}>
        <ZoomStateProvider>
          <BaseCard cardId='narrow-title-card' title={longTitle} icon={ListIcon} allowZoom={false}>
            Content
          </BaseCard>
        </ZoomStateProvider>
      </Box>,
    )

    const icon = container.querySelector('svg')
    const title = screen.getByText(longTitle)

    expect(icon).toHaveAttribute('width', String(designTokens.icon.sizeSm))
    expect(icon).toHaveAttribute('height', String(designTokens.icon.sizeSm))
    expect(title).toHaveStyle({ textOverflow: 'ellipsis' })
  })

  it('does not let long titles overlap headingInfo', () => {
    const longTitle = 'Very long card title that should truncate with ellipsis'

    renderWithTheme(
      <Box sx={{ width: 180 }}>
        <ZoomStateProvider>
          <BaseCard
            cardId='narrow-title-with-info'
            title={longTitle}
            icon={ListIcon}
            allowZoom={false}
            headingInfo={<span>42</span>}
          >
            Content
          </BaseCard>
        </ZoomStateProvider>
      </Box>,
    )

    const title = screen.getByText(longTitle)
    const headingInfo = screen.getByText('42')

    expect(title.getBoundingClientRect().right).toBeLessThanOrEqual(headingInfo.getBoundingClientRect().left + 1)
  })

  it('does not let long titles overlap actions', () => {
    const longTitle = 'Very long card title that should truncate with ellipsis'

    renderWithTheme(
      <Box sx={{ width: 180 }}>
        <ZoomStateProvider>
          <BaseCard
            cardId='narrow-title-with-actions'
            title={longTitle}
            icon={ListIcon}
            allowZoom={false}
            actions={<ApolloCardAction title='Edit preferences' onClick={() => undefined} Icon={ListIcon} />}
          >
            Content
          </BaseCard>
        </ZoomStateProvider>
      </Box>,
    )

    const title = screen.getByText(longTitle)
    const action = screen.getByRole('button', { name: 'Edit preferences' })

    expect(title.getBoundingClientRect().right).toBeLessThanOrEqual(action.getBoundingClientRect().left + 1)
  })
})
