export type ZoomStyle = {
  transition: string
  bottom: number | string
  right: number | string
  left: number | string
  top: number | string
}

export type ZoomSetup =
  | { active: false }
  | {
      style: ZoomStyle
      focusStyle: ZoomStyle
      active: true
    }

export type ZoomAction =
  | {
      method: 'zoom-out' | 'collapse'
    }
  | {
      method: 'focus' | 'expand'
      style: ZoomStyle
    }

export function zoomReducer(state: ZoomSetup, action: ZoomAction): ZoomSetup {
  switch (action.method) {
    case 'expand':
      if (!state.active) {
        return state
      }

      return {
        active: true,
        style: action.style,
        focusStyle: state.focusStyle,
      }

    case 'focus':
      return {
        active: true,
        style: action.style,
        focusStyle: action.style,
      }

    case 'collapse':
      if (!state.active) {
        return state
      }

      return {
        active: true,
        style: state.focusStyle,
        focusStyle: state.focusStyle,
      }

    case 'zoom-out':
      return {
        active: false,
      }
  }
}
