import { Dispatch } from 'react'

export type ZoomStateAction =
  | {
      id: 'zoom-out'
    }
  | {
      id: 'zoom-in'
      cardId: string
    }

export type ZoomState = {
  zoomedCardId: string | undefined
}

export type ZoomStateWithDispatch = ZoomState & {
  dispatch: Dispatch<ZoomStateAction>
}
