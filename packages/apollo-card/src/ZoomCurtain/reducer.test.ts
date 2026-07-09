import { describe, expect, it } from 'vitest'
import { zoomReducer } from './reducer'

const style = {
  transition: 'left 0.7s ease-out',
  bottom: 10,
  right: 10,
  left: 10,
  top: 10,
}

describe('zoomReducer', () => {
  it('activates zoom on focus and expand', () => {
    expect(zoomReducer({ active: false }, { method: 'focus', style })).toEqual({
      active: true,
      style,
      focusStyle: style,
      transition: true,
    })

    const expandedStyle = { ...style, bottom: '10vh' }
    expect(
      zoomReducer({ active: true, style, focusStyle: style, transition: true }, { method: 'expand', style: expandedStyle }),
    ).toEqual({
      active: true,
      style: expandedStyle,
      focusStyle: style,
      transition: false,
    })
  })

  it('collapses zoom back to focus style', () => {
    const expandedStyle = { ...style, bottom: '10vh' }

    expect(
      zoomReducer({ active: true, style: expandedStyle, focusStyle: style, transition: false }, { method: 'collapse' }),
    ).toEqual({
      active: true,
      style,
      focusStyle: style,
      transition: true,
    })
  })

  it('deactivates zoom on zoom-out', () => {
    expect(zoomReducer({ active: true, style, focusStyle: style }, { method: 'zoom-out' })).toEqual({
      active: false,
    })
  })
})
