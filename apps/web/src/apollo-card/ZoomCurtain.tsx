import { styled } from '@mui/material'
import { createContext, type FC, type MouseEventHandler, type ReactNode, useCallback, useReducer } from 'react'
import feed from '../feed'

type ZoomStyle = {
    transition: string
    bottom: number | string
    right: number | string
    left: number | string
    top: number | string

    fontSize: number
    lineHeight: number
}

type ZoomSetup = { active: false } | {
    style: ZoomStyle
    active: true
}

const ZoomContext = createContext<ZoomSetup>({
    active: false
})

const Curtain = styled('div')({
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    transition: 'opacity 1s ease-out',
    backgroundColor: 'black',
    opacity: 0
})

const zoomCardTransition = 'left 0.7s ease-out, right 0.7s ease-out, top 0.7s ease-out, bottom 0.7s ease-out'
const zoomIgnoreClicksOnTags = ['A', 'BUTTON', 'INPUT']

type ZoomAction = {
    method: 'zoom-out'
} | {
    method: 'focus' | 'expand'
    style: ZoomStyle
}

const ZoomCurtain: FC<{ children: ReactNode; cardId: string; allowZoom: boolean }> = ({ children, cardId, allowZoom }) => {
    const [zoom, dispatch] = useReducer(
        (state: ZoomSetup, action: ZoomAction): ZoomSetup => {
            switch (action.method) {
                case 'expand':
                    return {
                        ...state,
                        active: true,
                        style: action.style
                    }

                case 'focus':
                    return {
                        ...state,
                        active: true,
                        style: action.style
                    }

                case 'zoom-out':
                    return {
                        ...state,
                        active: false
                    }
            }
        },
        { active: false }
    )

    const click: React.MouseEventHandler<HTMLDivElement> = useCallback<MouseEventHandler<HTMLDivElement>>(ev => {
        if (!allowZoom) {
            return
        }

        for (let node: Node | null = (ev.target as Node); node; node = node.parentNode) {
            if (node instanceof HTMLElement) {
                if (zoomIgnoreClicksOnTags.includes((node).tagName) || (node).hasAttribute('data-no-close')) {
                    return false
                }
            }
        }

        const wrapper = ev.currentTarget
        if (zoom.active) {
            dispatch({ method: 'zoom-out' })

        } else {

            feed.dispatchEvent(new CustomEvent('card-zoom', { detail: { cardId } }))
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
                    lineHeight: 1.2
                }
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
                        lineHeight: 1.2
                    }
                })
            }, 0)
        }
    }, [allowZoom, zoom, feed])

    return (
        <ZoomContext.Provider value={zoom}>
            <Curtain style={zoom.active ? { position: 'fixed', opacity: 0.9, zIndex: 10 } : { width: '100%' }} />

            <div onClick={click} style={zoom.active ? { position: 'fixed', zIndex: 11, ...zoom.style } : { width: '100%', transition: zoomCardTransition }}>
                {children}
            </div>
        </ZoomContext.Provider>
    )
}
export { ZoomContext, ZoomCurtain }
