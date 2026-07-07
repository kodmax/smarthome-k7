import { useEffect, useMemo, useReducer } from 'react'
import { ZoomStateWithDispatch } from './types'
import { reducer } from './reducer'
import { ZOOM_AUTO_DISMISS_MS } from './consts'

export function useValue(): ZoomStateWithDispatch {
  const [state, dispatch] = useReducer(reducer, { zoomedCardId: undefined })

  useEffect(() => {
    if (state.zoomedCardId === undefined) {
      return
    }

    const timeoutId = setTimeout(() => {
      dispatch({ id: 'zoom-out' })
    }, ZOOM_AUTO_DISMISS_MS)

    return () => clearTimeout(timeoutId)
  }, [state])

  return useMemo<ZoomStateWithDispatch>(
    () => ({
      dispatch,
      ...state,
    }),
    [state],
  )
}
