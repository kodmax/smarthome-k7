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
