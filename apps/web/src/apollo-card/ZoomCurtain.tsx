import { styled } from '@mui/material'
import {
  createContext,
  type FC,
  type MouseEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useReducer,
} from 'react'
import { type ZoomSetup, zoomReducer } from './zoomReducer'

export type { ZoomSetup } from './zoomReducer'

const ZoomContext = createContext<ZoomSetup>({
  active: false,
})

const Curtain = styled('div')({
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  transition: 'opacity 1s ease-out',
  backgroundColor: 'black',
  opacity: 0,
})

const zoomCardTransition = 'left 0.7s ease-out, right 0.7s ease-out, top 0.7s ease-out, bottom 0.7s ease-out'
const zoomIgnoreClicksOnTags = ['A', 'BUTTON', 'INPUT']

const ZoomCurtain: FC<{ children: ReactNode; cardId: string; allowZoom: boolean; onZoom?: () => void }> = ({
  children,
  allowZoom,
  onZoom,
}) => {
  const [zoom, dispatch] = useReducer(zoomReducer, { active: false })

  useEffect(() => {
    if (zoom.active && onZoom !== undefined) {
      onZoom()
    }
  }, [zoom.active, onZoom])

  const click: React.MouseEventHandler<HTMLDivElement> = useCallback<MouseEventHandler<HTMLDivElement>>(
    ev => {
      if (!allowZoom) {
        return
      }

      for (let node: Node | null = ev.target as Node; node; node = node.parentNode) {
        if (node instanceof HTMLElement) {
          if (zoomIgnoreClicksOnTags.includes(node.tagName) || node.hasAttribute('data-no-close')) {
            return
          }
        }
      }

      const wrapper = ev.currentTarget
      if (zoom.active) {
        dispatch({ method: 'zoom-out' })
      } else {
        const rect = wrapper.getBoundingClientRect()
        const scale = 3.5

        dispatch({
          method: 'focus',
          style: {
            transition: zoomCardTransition,
            bottom: window.innerHeight - rect.bottom,
            right: window.innerWidth - rect.right,
            left: rect.left,
            top: rect.top,

            fontSize: 12 * scale,
            lineHeight: 1.2,
          },
        })

        setTimeout(() => {
          dispatch({
            method: 'expand',
            style: {
              transition: zoomCardTransition,
              bottom: '10vh',
              top: '10vh',
              right: '5vw',
              left: '5vw',

              fontSize: 12 * scale,
              lineHeight: 1.2,
            },
          })
        }, 0)
      }
    },
    [allowZoom, zoom],
  )

  return (
    <ZoomContext.Provider value={zoom}>
      <Curtain style={zoom.active ? { position: 'fixed', opacity: 0.9, zIndex: 10 } : { width: '100%' }} />

      <div
        onClick={click}
        style={
          zoom.active
            ? { position: 'fixed', zIndex: 11, ...zoom.style }
            : { width: '100%', transition: zoomCardTransition }
        }
      >
        {children}
      </div>
    </ZoomContext.Provider>
  )
}
export { ZoomContext, ZoomCurtain }
