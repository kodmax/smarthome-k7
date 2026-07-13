export const HIGH_DRAW_MIN_W = 1000

export const shouldShowHighDrawHint = (watts: number | undefined): boolean =>
  watts !== undefined && watts >= HIGH_DRAW_MIN_W
