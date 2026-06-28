export type ZoomStyle = {
  transition: string
  bottom: number | string
  right: number | string
  left: number | string
  top: number | string
  fontSize: number
  lineHeight: number
}

export type ZoomSetup =
  | { active: false }
  | {
      style: ZoomStyle
      active: true
    }

export type ZoomAction =
  | {
      method: 'zoom-out'
    }
  | {
      method: 'focus' | 'expand'
      style: ZoomStyle
    }

export function zoomReducer(state: ZoomSetup, action: ZoomAction): ZoomSetup {
  switch (action.method) {
    case 'expand':
      return {
        ...state,
        active: true,
        style: action.style,
      }

    case 'focus':
      return {
        ...state,
        active: true,
        style: action.style,
      }

    case 'zoom-out':
      return {
        ...state,
        active: false,
      }
  }
}
