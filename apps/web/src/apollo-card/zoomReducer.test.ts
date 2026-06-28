import { describe, expect, it } from 'vitest'
import { zoomReducer } from './zoomReducer'

const style = {
  transition: 'left 0.7s ease-out',
  bottom: 10,
  right: 10,
  left: 10,
  top: 10,
  fontSize: 42,
  lineHeight: 1.2,
}

describe('zoomReducer', () => {
  it('activates zoom on focus and expand', () => {
    expect(zoomReducer({ active: false }, { method: 'focus', style })).toEqual({
      active: true,
      style,
    })
  })

  it('deactivates zoom on zoom-out', () => {
    expect(zoomReducer({ active: true, style }, { method: 'zoom-out' })).toEqual({
      active: false,
      style,
    })
  })
})
