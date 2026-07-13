import { designTokens } from '@repo/design-tokens'

const { space, layout } = designTokens

export const portraitTopBarSidePadding = Math.round(layout.bodyPadding.right / 3)

export const portraitTopBarBottomPadding = space[2]

export const portraitTopBarTopPadding = portraitTopBarBottomPadding

export const portraitTopBarContentHeight = 48

export const portraitTopBarHeight = portraitTopBarContentHeight + portraitTopBarTopPadding + portraitTopBarBottomPadding

export const portraitTopBarOffset = `calc(env(safe-area-inset-top) + ${portraitTopBarHeight}px)`
