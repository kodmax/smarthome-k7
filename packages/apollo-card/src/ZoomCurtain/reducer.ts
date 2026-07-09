import { Reducer } from 'react'
import { ZoomAction, ZoomSetup } from './types'

export const zoomReducer: Reducer<ZoomSetup, ZoomAction> = (state, action) => {
  switch (action.method) {
    case 'expand':
      if (!state.active) {
        return state
      }

      return {
        active: true,
        style: action.style,
        focusStyle: state.focusStyle,
        transition: false,
      }

    case 'focus':
      return {
        active: true,
        style: action.style,
        focusStyle: action.style,
        transition: true,
      }

    case 'collapse':
      if (!state.active) {
        return state
      }

      return {
        active: true,
        style: state.focusStyle,
        focusStyle: state.focusStyle,
        transition: true,
      }

    case 'zoom-out':
      return {
        active: false,
      }
  }
}
