import { designTokens } from '@repo/design-tokens'

const { layout, space } = designTokens
const { bodyPadding } = layout

export const pageHeaderLayout = {
  bodyPadding,
  containerMax: layout.containerMax,
  menuContentGap: space[4],
  titleRowGap: space[3],
  portraitMobileSidePadding: Math.round(bodyPadding.right / 3),
} as const
