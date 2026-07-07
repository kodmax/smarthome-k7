import { Reducer } from 'react'
import { ZoomState, ZoomStateAction } from './types'

export const reducer: Reducer<ZoomState, ZoomStateAction> = (state, action) => {
  switch (action.id) {
    case 'zoom-out':
      return {
        ...state,
        zoomedCardId: undefined,
      }

    case 'zoom-in':
      return {
        ...state,
        zoomedCardId: action.cardId,
      }
  }
}
